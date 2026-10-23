from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class MatchWeights(BaseModel):
    skill_weight: float = Field(default=0.35, ge=0.0, le=1.0)
    cause_weight: float = Field(default=0.25, ge=0.0, le=1.0)
    availability_weight: float = Field(default=0.20, ge=0.0, le=1.0)
    location_weight: float = Field(default=0.20, ge=0.0, le=1.0)

class MatchRequest(BaseModel):
    volunteer_skills: List[str] = Field(default_factory=list)
    preferred_causes: List[str] = Field(default_factory=list)
    preferred_schedule: str = "Flexible"
    remote_only: bool = False
    location: Optional[str] = "San Francisco, CA"
    weights: MatchWeights = Field(default_factory=MatchWeights)

class MatchFactor(BaseModel):
    factor_name: str
    weight_percentage: int
    score_percentage: int
    explanation: str

class MatchBreakdown(BaseModel):
    total_alignment_score: int = Field(description="Deterministic weighted alignment score 0-100. Not a probability.")
    factors: List[MatchFactor]
    summary_reason: str

class Organization(BaseModel):
    id: str
    name: str
    mission: str
    website: str
    contact_email: str
    verification_status: str = Field(default="pending", description="pending, approved, rejected")
    location: str
    focus_areas: List[str]
    created_at: str
    verified_at: Optional[str] = None
    verified_by: Optional[str] = None
    verification_notes: Optional[str] = None

class Cause(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    category: str
    sdg_goal: str
    image_url: str
    active_opportunities_count: int
    volunteers_engaged: int
    verified_hours: int

class Opportunity(BaseModel):
    id: str
    org_id: str
    org_name: str
    org_verified: bool
    title: str
    description: str
    cause_id: str
    cause_name: str
    category: str
    skills_required: List[str]
    location: str
    is_remote: bool
    schedule_type: str  # "Weekends", "Weekday Evenings", "Flexible", "Full-time Campaign"
    commitment_hours: int
    start_date: str
    end_date: str
    slots_total: int
    slots_filled: int
    status: str = "open"  # "open", "in_progress", "completed"
    created_at: str

class OpportunityWithMatch(BaseModel):
    opportunity: Opportunity
    match_breakdown: MatchBreakdown

class ApplicationCreate(BaseModel):
    opportunity_id: str
    volunteer_name: str
    volunteer_email: str
    motivation: str
    skills_offered: List[str]
    availability_note: str

class Application(BaseModel):
    id: str
    opportunity_id: str
    opportunity_title: str
    org_id: str
    org_name: str
    volunteer_name: str
    volunteer_email: str
    status: str = "pending"  # "pending", "accepted", "rejected", "completed"
    motivation: str
    skills_offered: List[str]
    availability_note: str
    hours_logged: float = 0.0
    applied_at: str
    updated_at: str

class AttendanceRecord(BaseModel):
    application_id: str
    hours_to_add: float
    session_notes: str
    verified_by_supervisor: bool = True

class ImpactRecord(BaseModel):
    id: str
    org_id: str
    opportunity_id: str
    opportunity_title: str
    event_title: str
    date: str
    volunteer_hours: float
    attendees_count: int
    beneficiaries_served: int
    outcomes: List[str]
    evidence_type: str  # "photo_audit", "gps_checkin", "countersigned_roster"
    evidence_reference: str
    is_demo_record: bool = False
    verified_timestamp: str

class SourceCitation(BaseModel):
    document_title: str
    document_type: str
    organization_name: str
    excerpt: str
    relevance_score: float

class AssistantChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    cause_filter: Optional[str] = None

class AssistantChatResponse(BaseModel):
    answer: str
    citations: List[SourceCitation]
    grounded: bool
    confidence_note: str
    fallback_mode: bool = False

class ReportDraft(BaseModel):
    id: str
    org_id: str
    org_name: str
    title: str
    reporting_period: str
    measured_facts: Dict[str, Any]
    estimates_and_projections: Dict[str, Any]
    missing_evidence_notices: List[str]
    ai_generated_narrative: str
    status: str = "draft"  # "draft", "in_review", "published"
    human_reviewer_signoff: Optional[str] = None
    created_at: str

class ReportGenerateRequest(BaseModel):
    org_id: str
    reporting_period: str = "Q3 2026"
    include_ai_summary: bool = True

class VerifyOrgRequest(BaseModel):
    status: str = Field(description="'approved' or 'rejected'")
    notes: Optional[str] = None
    admin_key: Optional[str] = None
