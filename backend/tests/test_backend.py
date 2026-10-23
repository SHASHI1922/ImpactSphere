import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.matching import calculate_skill_score, calculate_cause_score, rank_opportunities
from app.models import MatchRequest, MatchWeights, Opportunity
from app.reports import generate_impact_report
from app.database import db

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ImpactSphere AI Core"
    assert data["database"]["opportunities"] > 0
    assert data["ai_status"]["rag_chunks_indexed"] > 0

def test_causes_endpoint():
    response = client.get("/api/causes")
    assert response.status_code == 200
    causes = response.json()
    assert len(causes) >= 4
    categories = [c["category"] for c in causes]
    assert "Environment" in categories
    assert "Education" in categories

def test_opportunities_filtering():
    # Filter by category
    response = client.get("/api/opportunities?category=Environment")
    assert response.status_code == 200
    opps = response.json()
    assert len(opps) > 0
    for o in opps:
        assert o["category"] == "Environment"

    # Filter remote
    response_remote = client.get("/api/opportunities?remote=true")
    assert response_remote.status_code == 200
    remote_opps = response_remote.json()
    for o in remote_opps:
        assert o["is_remote"] is True

def test_matching_algorithm_weights_and_reasons():
    opps = list(db.opportunities.values())
    req = MatchRequest(
        volunteer_skills=["Data Analysis", "Python", "GIS / Mapping"],
        preferred_causes=["Climate Action"],
        preferred_schedule="Flexible",
        remote_only=True,
        location="San Francisco, CA",
        weights=MatchWeights(skill_weight=0.4, cause_weight=0.3, availability_weight=0.15, location_weight=0.15)
    )

    ranked = rank_opportunities(opps, req)
    assert len(ranked) == len(opps)

    top_match = ranked[0]
    # The Canopy Satellite role is Remote, Python/GIS, Climate Action, Flexible
    assert top_match.opportunity.id == "opp-canopy-data"
    assert top_match.match_breakdown.total_alignment_score >= 85
    assert len(top_match.match_breakdown.factors) == 4

    # Verify no mention of probability
    summary = top_match.match_breakdown.summary_reason
    assert "probability" not in summary.lower()

def test_rag_assistant_grounded_and_refusal():
    # Grounded query about sapling biodiversity rules
    response = client.post("/api/assistant/chat", json={
        "message": "What percentage of native saplings does GreenCanopy require for urban planting?"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["grounded"] is True
    assert len(data["citations"]) > 0
    assert "GreenCanopy" in data["citations"][0]["organization_name"]
    assert "80%" in data["answer"] or "native" in data["answer"].lower()

    # Query with zero evidence in documents -> honest refusal
    response_unrelated = client.post("/api/assistant/chat", json={
        "message": "What is the secret recipe for quantum rocket fuel in Antarctica?"
    })
    assert response_unrelated.status_code == 200
    data_unrelated = response_unrelated.json()
    assert data_unrelated["grounded"] is False
    assert data_unrelated["fallback_mode"] is True
    assert "insufficient" in data_unrelated["answer"].lower() or "no sufficiently grounded" in data_unrelated["answer"].lower()

def test_impact_report_generation_segregation():
    org = db.organizations["org-green-canopy"]
    records = list(db.impact_records.values())

    report = generate_impact_report(org, records, reporting_period="Q3 2026")
    assert report.org_id == org.id
    assert report.status == "draft"
    assert report.human_reviewer_signoff is None

    # Measured facts are deterministic sums
    assert report.measured_facts["verified_volunteer_hours"] > 0
    assert "audit_evidence_ledger" in report.measured_facts

    # Estimates are explicitly separated
    assert "estimated_economic_value_created_usd" in report.estimates_and_projections
    assert "Independent Sector" in report.estimates_and_projections["labor_valuation_basis"]

    # Missing evidence alert array exists
    assert isinstance(report.missing_evidence_notices, list)

def test_application_and_attendance_workflow():
    # Submit application
    app_payload = {
        "opportunity_id": "opp-canopy-101",
        "volunteer_name": "Test Volunteer",
        "volunteer_email": "test.vol@example.org",
        "motivation": "I love planting trees and spending time outdoors.",
        "skills_offered": ["Gardening & Outdoors"],
        "availability_note": "Weekends only"
    }
    response = client.post("/api/applications", json=app_payload)
    assert response.status_code == 200
    app_data = response.json()
    app_id = app_data["id"]
    assert app_data["status"] == "pending"

    # NGO approves application
    status_resp = client.post(f"/api/applications/{app_id}/status?status=accepted")
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "accepted"

    # Record attendance hours
    att_resp = client.post("/api/attendance/record", json={
        "application_id": app_id,
        "hours_to_add": 4.5,
        "session_notes": "Great work planting 10 oaks."
    })
    assert att_resp.status_code == 200
    assert att_resp.json()["hours_logged"] == 4.5

def test_ngo_verification_lifecycle():
    # Check pending org
    org = db.organizations["org-coastal-watch"]
    assert org.verification_status == "pending"

    # Admin verifies org
    verify_resp = client.post(f"/api/organizations/{org.id}/verify", json={
        "status": "approved",
        "notes": "Audited water permits and coastal safety certifications."
    })
    assert verify_resp.status_code == 200
    assert verify_resp.json()["verification_status"] == "approved"
    assert verify_resp.json()["verified_at"] is not None

    # Reject invalid status
    bad_resp = client.post(f"/api/organizations/{org.id}/verify", json={
        "status": "non_existent_status"
    })
    assert bad_resp.status_code == 400
