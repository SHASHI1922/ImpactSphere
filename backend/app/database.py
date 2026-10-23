from typing import List, Dict, Optional
import datetime
from .models import Organization, Cause, Opportunity, Application, ImpactRecord, ReportDraft

class Database:
    def __init__(self):
        self.organizations: Dict[str, Organization] = {}
        self.causes: Dict[str, Cause] = {}
        self.opportunities: Dict[str, Opportunity] = {}
        self.applications: Dict[str, Application] = {}
        self.impact_records: Dict[str, ImpactRecord] = {}
        self.reports: Dict[str, ReportDraft] = {}
        self.knowledge_documents: List[Dict] = []
        self._seed_data()

    def _seed_data(self):
        # 1. Organizations
        orgs = [
            Organization(
                id="org-green-canopy",
                name="GreenCanopy Urban Forestry",
                mission="Restoring urban biodiversity and building community resilience through native canopy reforestation.",
                website="https://greencanopy.org",
                contact_email="impact@greencanopy.org",
                verification_status="approved",
                location="San Francisco, CA",
                focus_areas=["Climate Action", "Urban Biodiversity", "Environmental Justice"],
                created_at="2024-02-15T09:00:00Z",
                verified_at="2024-03-01T14:30:00Z",
                verified_by="Platform Admin (Audit Committee)",
                verification_notes="501(c)(3) verified with audited fiscal statements and active municipal tree-planting permits."
            ),
            Organization(
                id="org-code-pathways",
                name="CodePathways Youth Initiative",
                mission="Democratizing access to technology education and mentorship for underrepresented youth.",
                website="https://codepathways.org",
                contact_email="mentor@codepathways.org",
                verification_status="approved",
                location="Oakland, CA",
                focus_areas=["Education & Youth", "Tech Equity", "Career Mentorship"],
                created_at="2024-01-10T10:00:00Z",
                verified_at="2024-01-28T11:15:00Z",
                verified_by="Platform Admin (Audit Committee)",
                verification_notes="Registered educational non-profit, student safeguarding compliance passed."
            ),
            Organization(
                id="org-nourish-all",
                name="NourishAll Community Pantry Network",
                mission="Eliminating food waste and distributing nutritious groceries to underserved neighborhoods.",
                website="https://nourishall.org",
                contact_email="coordination@nourishall.org",
                verification_status="approved",
                location="San Jose, CA",
                focus_areas=["Hunger Relief", "Food Waste Reduction", "Public Health"],
                created_at="2023-11-20T08:00:00Z",
                verified_at="2023-12-05T16:00:00Z",
                verified_by="Platform Admin (Audit Committee)",
                verification_notes="Food rescue logistics verified, cold-chain safety certification documented."
            ),
            Organization(
                id="org-coastal-watch",
                name="Pacific Shore & Watershed Watch",
                mission="Monitoring coastal wetland ecosystems and leading community watershed conservation.",
                website="https://pacificshorewatch.org",
                contact_email="fieldops@pacificshorewatch.org",
                verification_status="pending",
                location="Santa Cruz, CA",
                focus_areas=["Ocean Health", "Watershed Protection", "Citizen Science"],
                created_at="2026-09-12T11:00:00Z",
                verified_at=None,
                verified_by=None,
                verification_notes="Pending submission of 2025 water testing liability waivers."
            ),
            Organization(
                id="org-elder-connect",
                name="Silver Bridge Senior Alliance",
                mission="Counteracting elder isolation through intergenerational tech literacy and companionship.",
                website="https://silverbridgealliance.org",
                contact_email="care@silverbridgealliance.org",
                verification_status="approved",
                location="San Francisco, CA",
                focus_areas=["Community Care", "Elder Welfare", "Digital Inclusion"],
                created_at="2024-05-04T12:00:00Z",
                verified_at="2024-05-18T10:00:00Z",
                verified_by="Platform Admin (Audit Committee)",
                verification_notes="Background screening standards reviewed and approved."
            )
        ]
        for org in orgs:
            self.organizations[org.id] = org

        # 2. Causes
        causes = [
            Cause(
                id="cause-climate",
                title="Climate Action & Rewilding",
                slug="climate-action",
                description="Combat urban heat islands, restore degraded ecosystems, and rewild civic spaces with native vegetation.",
                category="Environment",
                sdg_goal="SDG 13: Climate Action",
                image_url="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
                active_opportunities_count=4,
                volunteers_engaged=420,
                verified_hours=2150
            ),
            Cause(
                id="cause-education",
                title="Youth STEM & Digital Equity",
                slug="youth-stem-equity",
                description="Equip students from under-resourced public schools with foundational coding, mathematics, and design skills.",
                category="Education",
                sdg_goal="SDG 4: Quality Education",
                image_url="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
                active_opportunities_count=3,
                volunteers_engaged=310,
                verified_hours=1840
            ),
            Cause(
                id="cause-hunger",
                title="Food Security & Rescue Systems",
                slug="food-security",
                description="Rescue surplus wholesome groceries from regional farmers and distribute fresh produce to food-insecure families.",
                category="Food Security",
                sdg_goal="SDG 2: Zero Hunger",
                image_url="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
                active_opportunities_count=3,
                volunteers_engaged=580,
                verified_hours=3290
            ),
            Cause(
                id="cause-community",
                title="Intergenerational Care & Civic Health",
                slug="intergenerational-care",
                description="Strengthen social fabrics through senior companionship, community mental wellness circles, and digital inclusion.",
                category="Social Inclusion",
                sdg_goal="SDG 3 & 10: Reduced Inequalities",
                image_url="https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=800&q=80",
                active_opportunities_count=2,
                volunteers_engaged=190,
                verified_hours=960
            )
        ]
        for c in causes:
            self.causes[c.id] = c

        # 3. Opportunities
        opps = [
            Opportunity(
                id="opp-canopy-101",
                org_id="org-green-canopy",
                org_name="GreenCanopy Urban Forestry",
                org_verified=True,
                title="Urban Micro-Forest Planting & Soil Prep",
                description="Join our team of arborists to plant 150 climate-adapted native saplings in urban parkways, mulch soil, and set up drip irrigation lines.",
                cause_id="cause-climate",
                cause_name="Climate Action & Rewilding",
                category="Environment",
                skills_required=["Gardening & Outdoors", "Physical Activity", "Community Teamwork"],
                location="San Francisco, CA (Mission District)",
                is_remote=False,
                schedule_type="Weekends",
                commitment_hours=4,
                start_date="2026-11-07",
                end_date="2026-11-08",
                slots_total=25,
                slots_filled=18,
                status="open",
                created_at="2026-10-01T10:00:00Z"
            ),
            Opportunity(
                id="opp-canopy-data",
                org_id="org-green-canopy",
                org_name="GreenCanopy Urban Forestry",
                org_verified=True,
                title="Canopy Satellite & GIS Analytics Volunteer",
                description="Analyze open satellite thermal imagery and city tree inventories to identify neighborhoods with highest thermal heat-island severity.",
                cause_id="cause-climate",
                cause_name="Climate Action & Rewilding",
                category="Environment",
                skills_required=["Data Analysis", "Python", "GIS / Mapping", "Data Visualization"],
                location="Remote",
                is_remote=True,
                schedule_type="Flexible",
                commitment_hours=6,
                start_date="2026-11-01",
                end_date="2026-12-15",
                slots_total=5,
                slots_filled=3,
                status="open",
                created_at="2026-10-05T12:00:00Z"
            ),
            Opportunity(
                id="opp-codepath-web",
                org_id="org-code-pathways",
                org_name="CodePathways Youth Initiative",
                org_verified=True,
                title="Youth Web Development Mentor & Project Guide",
                description="Mentor high school students building their first civic portfolio projects in HTML, CSS, JavaScript, and React during our weekend academy.",
                cause_id="cause-education",
                cause_name="Youth STEM & Digital Equity",
                category="Education",
                skills_required=["Web Development", "React", "Mentorship", "Patient Communication"],
                location="Oakland, CA (or Hybrid)",
                is_remote=False,
                schedule_type="Weekends",
                commitment_hours=3,
                start_date="2026-11-14",
                end_date="2026-12-19",
                slots_total=12,
                slots_filled=9,
                status="open",
                created_at="2026-10-08T09:30:00Z"
            ),
            Opportunity(
                id="opp-codepath-curriculum",
                org_id="org-code-pathways",
                org_name="CodePathways Youth Initiative",
                org_verified=True,
                title="Interactive AI Literacy Curriculum Designer",
                description="Design beginner-friendly interactive modules explaining how AI and LLMs work ethically for high schoolers.",
                cause_id="cause-education",
                cause_name="Youth STEM & Digital Equity",
                category="Education",
                skills_required=["Curriculum Writing", "AI / Machine Learning", "Design", "Communication"],
                location="Remote",
                is_remote=True,
                schedule_type="Flexible",
                commitment_hours=5,
                start_date="2026-11-10",
                end_date="2026-12-10",
                slots_total=4,
                slots_filled=2,
                status="open",
                created_at="2026-10-10T14:00:00Z"
            ),
            Opportunity(
                id="opp-nourish-pantry",
                org_id="org-nourish-all",
                org_name="NourishAll Community Pantry Network",
                org_verified=True,
                title="Weekend Fresh Produce Packing & Distribution",
                description="Help sort rescued farm produce, pack weekly grocery bags, and distribute directly to senior center residents and neighborhood families.",
                cause_id="cause-hunger",
                cause_name="Food Security & Rescue Systems",
                category="Food Security",
                skills_required=["Physical Logistics", "Food Safety", "Community Outreach", "Bilingual Spanish/English"],
                location="San Jose, CA (East Side Hub)",
                is_remote=False,
                schedule_type="Weekends",
                commitment_hours=4,
                start_date="2026-11-07",
                end_date="2026-11-07",
                slots_total=30,
                slots_filled=22,
                status="open",
                created_at="2026-10-02T11:00:00Z"
            ),
            Opportunity(
                id="opp-nourish-route",
                org_id="org-nourish-all",
                org_name="NourishAll Community Pantry Network",
                org_verified=True,
                title="Logistics Route Optimization Assistant",
                description="Help our dispatch team optimize van collection routes across 18 regional grocery donors using open mapping tools.",
                cause_id="cause-hunger",
                cause_name="Food Security & Rescue Systems",
                category="Food Security",
                skills_required=["Data Analysis", "Logistics", "Spreadsheets", "Problem Solving"],
                location="Remote",
                is_remote=True,
                schedule_type="Flexible",
                commitment_hours=4,
                start_date="2026-11-01",
                end_date="2026-11-30",
                slots_total=3,
                slots_filled=1,
                status="open",
                created_at="2026-10-12T16:00:00Z"
            ),
            Opportunity(
                id="opp-elder-tech",
                org_id="org-elder-connect",
                org_name="Silver Bridge Senior Alliance",
                org_verified=True,
                title="Senior Digital Literacy & Smartphone Coach",
                description="Sit 1-on-1 with elderly neighbors to teach video calling relatives, using telehealth apps, and avoiding online scams.",
                cause_id="cause-community",
                cause_name="Intergenerational Care & Civic Health",
                category="Social Inclusion",
                skills_required=["Patient Communication", "Tech Basics", "Empathy", "Elder Care"],
                location="San Francisco, CA (Richmond Senior Center)",
                is_remote=False,
                schedule_type="Weekday Evenings",
                commitment_hours=2,
                start_date="2026-11-12",
                end_date="2026-12-17",
                slots_total=10,
                slots_filled=7,
                status="open",
                created_at="2026-10-04T15:00:00Z"
            )
        ]
        for opp in opps:
            self.opportunities[opp.id] = opp

        # 4. Applications (Demo state)
        apps = [
            Application(
                id="app-101",
                opportunity_id="opp-canopy-data",
                opportunity_title="Canopy Satellite & GIS Analytics Volunteer",
                org_id="org-green-canopy",
                org_name="GreenCanopy Urban Forestry",
                volunteer_name="Alex Chen",
                volunteer_email="alex.chen@example.org",
                status="accepted",
                motivation="Passionate about climate resilience in low-canopy urban neighborhoods. Have 3 years of geospatial Python experience.",
                skills_offered=["Data Analysis", "Python", "GIS / Mapping"],
                availability_note="Available Saturday afternoons and weekday evenings (6 hrs/week).",
                hours_logged=12.0,
                applied_at="2026-10-06T14:20:00Z",
                updated_at="2026-10-08T09:10:00Z"
            ),
            Application(
                id="app-102",
                opportunity_id="opp-codepath-web",
                opportunity_title="Youth Web Development Mentor & Project Guide",
                org_id="org-code-pathways",
                org_name="CodePathways Youth Initiative",
                volunteer_name="Alex Chen",
                volunteer_email="alex.chen@example.org",
                status="pending",
                motivation="I learned coding at a free community center and want to pay it forward to current high schoolers.",
                skills_offered=["Web Development", "React", "Mentorship"],
                availability_note="Available Sundays 10am-1pm.",
                hours_logged=0.0,
                applied_at="2026-10-14T18:45:00Z",
                updated_at="2026-10-14T18:45:00Z"
            ),
            Application(
                id="app-103",
                opportunity_id="opp-nourish-pantry",
                opportunity_title="Weekend Fresh Produce Packing & Distribution",
                org_id="org-nourish-all",
                org_name="NourishAll Community Pantry Network",
                volunteer_name="Maria Gonzalez",
                volunteer_email="maria.g@example.org",
                status="accepted",
                motivation="Want to support local pantry network and help Spanish-speaking seniors navigate grocery choice days.",
                skills_offered=["Bilingual Spanish/English", "Food Safety"],
                availability_note="Available first and third Saturdays.",
                hours_logged=8.5,
                applied_at="2026-10-03T11:00:00Z",
                updated_at="2026-10-04T13:00:00Z"
            )
        ]
        for app in apps:
            self.applications[app.id] = app

        # 5. Impact Records (Verifiable field ledger)
        records = [
            ImpactRecord(
                id="rec-001",
                org_id="org-green-canopy",
                opportunity_id="opp-canopy-101",
                opportunity_title="Urban Micro-Forest Planting & Soil Prep",
                event_title="Mission District Green Corridor Planting",
                date="2026-09-26",
                volunteer_hours=72.0,
                attendees_count=18,
                beneficiaries_served=1400,
                outcomes=["45 native oak and redbud saplings planted", "2 tons of recycled wood mulch distributed", "Automated drip lines installed"],
                evidence_type="photo_audit",
                evidence_reference="DOC-CANOPY-2026-0926-AUDIT",
                is_demo_record=False,
                verified_timestamp="2026-09-27T10:15:00Z"
            ),
            ImpactRecord(
                id="rec-002",
                org_id="org-green-canopy",
                opportunity_id="opp-canopy-data",
                opportunity_title="Canopy Satellite & GIS Analytics Volunteer",
                event_title="Quarterly Heat Island GIS Mapping",
                date="2026-10-10",
                volunteer_hours=38.0,
                attendees_count=4,
                beneficiaries_served=6500,
                outcomes=["Identified 6 priority census tracts lacking tree cover", "Delivered interactive GIS map to city parks commission"],
                evidence_type="countersigned_roster",
                evidence_reference="DOC-CANOPY-GIS-Q3",
                is_demo_record=False,
                verified_timestamp="2026-10-11T16:00:00Z"
            ),
            ImpactRecord(
                id="rec-003",
                org_id="org-code-pathways",
                opportunity_id="opp-codepath-web",
                opportunity_title="Youth Web Development Mentor & Project Guide",
                event_title="Fall Youth Civic Web Hackathon",
                date="2026-09-19",
                volunteer_hours=54.0,
                attendees_count=9,
                beneficiaries_served=27,
                outcomes=["27 high school students deployed accessible websites", "8 students matched with summer tech internships"],
                evidence_type="gps_checkin",
                evidence_reference="DOC-CODEPATH-HACK-0919",
                is_demo_record=False,
                verified_timestamp="2026-09-20T12:30:00Z"
            ),
            ImpactRecord(
                id="rec-004",
                org_id="org-nourish-all",
                opportunity_id="opp-nourish-pantry",
                opportunity_title="Weekend Fresh Produce Packing & Distribution",
                event_title="Bi-Weekly East San Jose Farm Surplus Rescue",
                date="2026-10-04",
                volunteer_hours=88.0,
                attendees_count=22,
                beneficiaries_served=450,
                outcomes=["4,200 lbs organic produce diverted from landfills", "180 family grocery packs delivered", "Zero food safety incidents"],
                evidence_type="countersigned_roster",
                evidence_reference="DOC-NOURISH-DIST-1004",
                is_demo_record=False,
                verified_timestamp="2026-10-05T09:45:00Z"
            ),
            ImpactRecord(
                id="rec-005",
                org_id="org-elder-connect",
                opportunity_id="opp-elder-tech",
                opportunity_title="Senior Digital Literacy & Smartphone Coach",
                event_title="Digital Wellness Workshop at Richmond Center",
                date="2026-10-08",
                volunteer_hours=14.0,
                attendees_count=7,
                beneficiaries_served=21,
                outcomes=["21 senior citizens configured 2-factor authentication & family video calling", "Zero fraud reports recorded"],
                evidence_type="countersigned_roster",
                evidence_reference="DOC-SILVER-08-1026",
                is_demo_record=False,
                verified_timestamp="2026-10-09T11:00:00Z"
            )
        ]
        for r in records:
            self.impact_records[r.id] = r

        # 6. Knowledge Documents (Approved Knowledge Base for RAG)
        self.knowledge_documents = [
            {
                "id": "doc-gc-01",
                "org_id": "org-green-canopy",
                "org_name": "GreenCanopy Urban Forestry",
                "title": "Urban Rewilding & Native Species Protocol 2026",
                "document_type": "Field Manual",
                "content": """
                GreenCanopy operates strictly under biodiversity guidelines that mandate a minimum of 80% native Californian saplings (such as Coast Live Oak, California Redbud, and Western Sycamore) for every urban planting.
                Each planting site requires an initial 3-inch compost aeration layer followed by organic mulch rings to preserve root moisture.
                Volunteers must undergo a 20-minute safety orientation covering spade ergonomics, utility line awareness (811 marking verification), and heat exhaustion protocols.
                All planted trees receive automated micro-drip emitters set to deliver 15 gallons of water per week for the first 24 months.
                Impact is measured through canopy growth indexes measured biannually with drone photogrammetry and GPS geotagging.
                """
            },
            {
                "id": "doc-gc-02",
                "org_id": "org-green-canopy",
                "org_name": "GreenCanopy Urban Forestry",
                "title": "2025-2026 Audited Carbon & Heat Mitigation Brief",
                "document_type": "Annual Report",
                "content": """
                In the 2025-2026 season, GreenCanopy mobilized 1,240 unique volunteers logging 6,820 verified field hours across 32 urban neighborhood projects.
                Our micro-forest installations reduced localized summer street surface temperatures by an average of 4.2 degrees Fahrenheit in verified test corridors.
                Projected lifetime carbon sequestration for trees planted in 2025-2026 is estimated at 380 metric tons of CO2 equivalent over 30 years, validated against USDA Forest Service i-Tree methodology.
                Direct beneficiaries reached in low-canopy equity neighborhoods exceeded 24,000 residents.
                """
            },
            {
                "id": "doc-cp-01",
                "org_id": "org-code-pathways",
                "org_name": "CodePathways Youth Initiative",
                "title": "Volunteer Mentorship Guidelines & Child Safeguarding Policy",
                "document_type": "Policy",
                "content": """
                CodePathways requires all volunteer mentors to pass criminal background checks and complete our trauma-informed education training before working with students under 18.
                Mentorship sessions must occur in public group settings or monitored virtual rooms with at least two adults present at all times.
                Curriculum emphasizes project-based learning: mentors do not write code for students, but employ the Socratic method to guide debugging.
                Student milestones are tracked through open-source GitHub classroom repositories with automated linter checks and personalized feedback.
                """
            },
            {
                "id": "doc-na-01",
                "org_id": "org-nourish-all",
                "org_name": "NourishAll Community Pantry Network",
                "title": "Food Rescue Quality & Cold-Chain Standards",
                "document_type": "Field Manual",
                "content": """
                NourishAll enforces strict adherence to USDA and California Department of Public Health food recovery criteria.
                Perishable dairy, protein, and prepped items must remain below 41°F (5°C) from donor pickup to distribution, verified by digital probe thermometers at every handoff.
                Volunteers handling food packaging must wear hairnets, clean gloves, and hold an active California Food Handler card (which NourishAll provides free of charge).
                In Q3 2026, 94.2% of all rescued goods were redistributed within 24 hours of farm or store collection, ensuring peak nutritional value.
                """
            }
        ]

db = Database()
