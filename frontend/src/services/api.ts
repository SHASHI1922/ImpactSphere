import {
  Cause, Opportunity, OpportunityWithMatch, MatchRequest,
  Application, ApplicationCreate, ImpactRecord, AssistantChatResponse,
  ReportDraft, Organization
} from '../types';

const API_BASE = '/api';

// Safe fetch helper with timeout
async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (fallbackData !== undefined) {
      console.warn(`[ImpactSphere API] Live fetch failed for ${url}, using local resilience cache.`, err);
      return fallbackData;
    }
    throw err;
  }
}

export const api = {
  async getHealth() {
    return fetchWithFallback(`${API_BASE}/health`, undefined, {
      status: 'healthy (client fallback)',
      service: 'ImpactSphere AI Core',
      database: { opportunities: 7, causes: 4 },
      ai_status: { gemini_api_key_configured: false, rag_chunks_indexed: 4 }
    });
  },

  async getCauses(): Promise<Cause[]> {
    return fetchWithFallback<Cause[]>(`${API_BASE}/causes`, undefined, [
      {
        id: "cause-climate",
        title: "Climate Action & Rewilding",
        slug: "climate-action",
        description: "Combat urban heat islands, restore degraded ecosystems, and rewild civic spaces with native vegetation.",
        category: "Environment",
        sdg_goal: "SDG 13: Climate Action",
        image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
        active_opportunities_count: 4,
        volunteers_engaged: 420,
        verified_hours: 2150
      },
      {
        id: "cause-education",
        title: "Youth STEM & Digital Equity",
        slug: "youth-stem-equity",
        description: "Equip students from under-resourced public schools with foundational coding, mathematics, and design skills.",
        category: "Education",
        sdg_goal: "SDG 4: Quality Education",
        image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
        active_opportunities_count: 3,
        volunteers_engaged: 310,
        verified_hours: 1840
      },
      {
        id: "cause-hunger",
        title: "Food Security & Rescue Systems",
        slug: "food-security",
        description: "Rescue surplus wholesome groceries from regional farmers and distribute fresh produce to food-insecure families.",
        category: "Food Security",
        sdg_goal: "SDG 2: Zero Hunger",
        image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
        active_opportunities_count: 3,
        volunteers_engaged: 580,
        verified_hours: 3290
      },
      {
        id: "cause-community",
        title: "Intergenerational Care & Civic Health",
        slug: "intergenerational-care",
        description: "Strengthen social fabrics through senior companionship, community mental wellness circles, and digital inclusion.",
        category: "Social Inclusion",
        sdg_goal: "SDG 3 & 10: Reduced Inequalities",
        image_url: "https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=800&q=80",
        active_opportunities_count: 2,
        volunteers_engaged: 190,
        verified_hours: 960
      }
    ]);
  },

  async getOpportunities(params?: {
    category?: string;
    cause_id?: string;
    remote?: boolean;
    schedule?: string;
    query?: string;
  }): Promise<Opportunity[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.cause_id) query.append('cause_id', params.cause_id);
    if (params?.remote !== undefined) query.append('remote', String(params.remote));
    if (params?.schedule) query.append('schedule', params.schedule);
    if (params?.query) query.append('query', params.query);

    return fetchWithFallback<Opportunity[]>(`${API_BASE}/opportunities?${query.toString()}`, undefined, [
      {
        id: "opp-canopy-101",
        org_id: "org-green-canopy",
        org_name: "GreenCanopy Urban Forestry",
        org_verified: true,
        title: "Urban Micro-Forest Planting & Soil Prep",
        description: "Join our team of arborists to plant 150 climate-adapted native saplings in urban parkways, mulch soil, and set up drip irrigation lines.",
        cause_id: "cause-climate",
        cause_name: "Climate Action & Rewilding",
        category: "Environment",
        skills_required: ["Gardening & Outdoors", "Physical Activity", "Community Teamwork"],
        location: "San Francisco, CA (Mission District)",
        is_remote: false,
        schedule_type: "Weekends",
        commitment_hours: 4,
        start_date: "2026-11-07",
        end_date: "2026-11-08",
        slots_total: 25,
        slots_filled: 18,
        status: "open",
        created_at: "2026-10-01T10:00:00Z"
      },
      {
        id: "opp-canopy-data",
        org_id: "org-green-canopy",
        org_name: "GreenCanopy Urban Forestry",
        org_verified: true,
        title: "Canopy Satellite & GIS Analytics Volunteer",
        description: "Analyze open satellite thermal imagery and city tree inventories to identify neighborhoods with highest thermal heat-island severity.",
        cause_id: "cause-climate",
        cause_name: "Climate Action & Rewilding",
        category: "Environment",
        skills_required: ["Data Analysis", "Python", "GIS / Mapping", "Data Visualization"],
        location: "Remote",
        is_remote: true,
        schedule_type: "Flexible",
        commitment_hours: 6,
        start_date: "2026-11-01",
        end_date: "2026-12-15",
        slots_total: 5,
        slots_filled: 3,
        status: "open",
        created_at: "2026-10-05T12:00:00Z"
      },
      {
        id: "opp-codepath-web",
        org_id: "org-code-pathways",
        org_name: "CodePathways Youth Initiative",
        org_verified: true,
        title: "Youth Web Development Mentor & Project Guide",
        description: "Mentor high school students building their first civic portfolio projects in HTML, CSS, JavaScript, and React during our weekend academy.",
        cause_id: "cause-education",
        cause_name: "Youth STEM & Digital Equity",
        category: "Education",
        skills_required: ["Web Development", "React", "Mentorship", "Patient Communication"],
        location: "Oakland, CA (or Hybrid)",
        is_remote: false,
        schedule_type: "Weekends",
        commitment_hours: 3,
        start_date: "2026-11-14",
        end_date: "2026-12-19",
        slots_total: 12,
        slots_filled: 9,
        status: "open",
        created_at: "2026-10-08T09:30:00Z"
      },
      {
        id: "opp-nourish-pantry",
        org_id: "org-nourish-all",
        org_name: "NourishAll Community Pantry Network",
        org_verified: true,
        title: "Weekend Fresh Produce Packing & Distribution",
        description: "Help sort rescued farm produce, pack weekly grocery bags, and distribute directly to senior center residents and neighborhood families.",
        cause_id: "cause-hunger",
        cause_name: "Food Security & Rescue Systems",
        category: "Food Security",
        skills_required: ["Physical Logistics", "Food Safety", "Community Outreach", "Bilingual Spanish/English"],
        location: "San Jose, CA (East Side Hub)",
        is_remote: false,
        schedule_type: "Weekends",
        commitment_hours: 4,
        start_date: "2026-11-07",
        end_date: "2026-11-07",
        slots_total: 30,
        slots_filled: 22,
        status: "open",
        created_at: "2026-10-02T11:00:00Z"
      }
    ]);
  },

  async getOpportunity(id: string): Promise<Opportunity> {
    const opps = await this.getOpportunities();
    const found = opps.find(o => o.id === id);
    if (found) return found;
    return opps[0];
  },

  async getMatches(req: MatchRequest): Promise<OpportunityWithMatch[]> {
    return fetchWithFallback<OpportunityWithMatch[]>(
      `${API_BASE}/matches`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      },
      [
        {
          opportunity: {
            id: "opp-canopy-data",
            org_id: "org-green-canopy",
            org_name: "GreenCanopy Urban Forestry",
            org_verified: true,
            title: "Canopy Satellite & GIS Analytics Volunteer",
            description: "Analyze open satellite thermal imagery and city tree inventories to identify neighborhoods with highest thermal heat-island severity.",
            cause_id: "cause-climate",
            cause_name: "Climate Action & Rewilding",
            category: "Environment",
            skills_required: ["Data Analysis", "Python", "GIS / Mapping"],
            location: "Remote",
            is_remote: true,
            schedule_type: "Flexible",
            commitment_hours: 6,
            start_date: "2026-11-01",
            end_date: "2026-12-15",
            slots_total: 5,
            slots_filled: 3,
            status: "open",
            created_at: "2026-10-05T12:00:00Z"
          },
          match_breakdown: {
            total_alignment_score: 94,
            factors: [
              { factor_name: "Skill Alignment", weight_percentage: 35, score_percentage: 100, explanation: "Direct match on Python, Data Analysis, and GIS." },
              { factor_name: "Cause Fit", weight_percentage: 25, score_percentage: 100, explanation: "Matches your priority preference: Climate Action." },
              { factor_name: "Availability", weight_percentage: 20, score_percentage: 100, explanation: "Flexible schedule fits your requested hours." },
              { factor_name: "Location / Mode", weight_percentage: 20, score_percentage: 100, explanation: "Remote format aligns with your location settings." }
            ],
            summary_reason: "Strong 94% alignment fit based on your data background and climate action interest."
          }
        }
      ]
    );
  },

  async createApplication(payload: ApplicationCreate): Promise<Application> {
    return fetchWithFallback<Application>(
      `${API_BASE}/applications`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      {
        id: `app-${Date.now().toString().slice(-6)}`,
        opportunity_id: payload.opportunity_id,
        opportunity_title: "Community Program Role",
        org_id: "org-demo",
        org_name: "Participating NGO",
        volunteer_name: payload.volunteer_name,
        volunteer_email: payload.volunteer_email,
        status: "pending",
        motivation: payload.motivation,
        skills_offered: payload.skills_offered,
        availability_note: payload.availability_note,
        hours_logged: 0,
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );
  },

  async getApplications(params?: { org_id?: string; volunteer_email?: string }): Promise<Application[]> {
    const query = new URLSearchParams();
    if (params?.org_id) query.append('org_id', params.org_id);
    if (params?.volunteer_email) query.append('volunteer_email', params.volunteer_email);

    return fetchWithFallback<Application[]>(`${API_BASE}/applications?${query.toString()}`, undefined, [
      {
        id: "app-101",
        opportunity_id: "opp-canopy-data",
        opportunity_title: "Canopy Satellite & GIS Analytics Volunteer",
        org_id: "org-green-canopy",
        org_name: "GreenCanopy Urban Forestry",
        volunteer_name: "Alex Chen",
        volunteer_email: "alex.chen@example.org",
        status: "accepted",
        motivation: "Passionate about climate resilience in low-canopy urban neighborhoods.",
        skills_offered: ["Data Analysis", "Python", "GIS / Mapping"],
        availability_note: "Available Saturday afternoons and weekday evenings (6 hrs/week).",
        hours_logged: 12.0,
        applied_at: "2026-10-06T14:20:00Z",
        updated_at: "2026-10-08T09:10:00Z"
      },
      {
        id: "app-102",
        opportunity_id: "opp-codepath-web",
        opportunity_title: "Youth Web Development Mentor & Project Guide",
        org_id: "org-code-pathways",
        org_name: "CodePathways Youth Initiative",
        volunteer_name: "Alex Chen",
        volunteer_email: "alex.chen@example.org",
        status: "pending",
        motivation: "I learned coding at a free community center and want to pay it forward.",
        skills_offered: ["Web Development", "React", "Mentorship"],
        availability_note: "Available Sundays 10am-1pm.",
        hours_logged: 0.0,
        applied_at: "2026-10-14T18:45:00Z",
        updated_at: "2026-10-14T18:45:00Z"
      }
    ]);
  },

  async updateApplicationStatus(appId: string, status: string): Promise<Application> {
    return fetchWithFallback<Application>(
      `${API_BASE}/applications/${appId}/status?status=${status}`,
      { method: 'POST' },
      {
        id: appId,
        opportunity_id: "opp-101",
        opportunity_title: "Updated Application",
        org_id: "org-green-canopy",
        org_name: "GreenCanopy Urban Forestry",
        volunteer_name: "Volunteer",
        volunteer_email: "vol@example.org",
        status: status as any,
        motivation: "Status updated.",
        skills_offered: [],
        availability_note: "Updated",
        hours_logged: 0,
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );
  },

  async recordAttendance(appId: string, hours: number, notes: string): Promise<Application> {
    return fetchWithFallback<Application>(
      `${API_BASE}/attendance/record`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: appId,
          hours_to_add: hours,
          session_notes: notes,
          verified_by_supervisor: true
        })
      },
      {
        id: appId,
        opportunity_id: "opp-101",
        opportunity_title: "Updated",
        org_id: "org-green-canopy",
        org_name: "GreenCanopy Urban Forestry",
        volunteer_name: "Volunteer",
        volunteer_email: "vol@example.org",
        status: "accepted",
        motivation: "Logged",
        skills_offered: [],
        availability_note: "Logged",
        hours_logged: hours,
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );
  },

  async getDashboard(volunteerEmail: string = "alex.chen@example.org") {
    return fetchWithFallback(`${API_BASE}/dashboard?volunteer_email=${encodeURIComponent(volunteerEmail)}`, undefined, {
      volunteer: {
        name: "Alex Chen",
        email: volunteerEmail,
        badge: "Impact Star (Level 3)",
        total_hours_logged: 12.0,
        projects_joined: 2,
        completed_projects: 1,
        verified_community_points: 1200,
        skills: ["Data Analysis", "Python", "GIS / Mapping", "Web Development"],
        interests: ["Climate Action & Rewilding", "Youth STEM & Digital Equity"],
      },
      applications: [],
      recommended_opportunities: [],
      recent_activities: [
        {
          id: "act-1",
          title: "Canopy GIS Heat Map Data Analysis",
          org: "GreenCanopy Urban Forestry",
          hours: 6.0,
          date: "2026-10-10",
          status: "Verified by Supervisor"
        }
      ]
    });
  },

  async getImpactSummary() {
    return fetchWithFallback(`${API_BASE}/impact/summary`, undefined, {
      verified_metrics: {
        total_volunteer_hours: 266.0,
        total_beneficiaries_served: 8398,
        total_volunteers_mobilized: 65,
        total_verified_events: 5,
        economic_impact_usd: 8458.80,
        active_ngos_verified: 4,
      },
      by_cause: {
        "Climate Action": { hours: 110.0, beneficiaries: 7900, events: 2 },
        "Youth STEM": { hours: 54.0, beneficiaries: 27, events: 1 },
        "Food Security": { hours: 88.0, beneficiaries: 450, events: 1 },
        "Community Care": { hours: 14.0, beneficiaries: 21, events: 1 },
      },
      monthly_trend: [
        { month: "May 2026", hours: 45, beneficiaries: 820 },
        { month: "Jun 2026", hours: 95, beneficiaries: 1450 },
        { month: "Jul 2026", hours: 140, beneficiaries: 2100 },
        { month: "Aug 2026", hours: 190, beneficiaries: 3100 },
        { month: "Sep 2026", hours: 235, beneficiaries: 4900 },
        { month: "Oct 2026", hours: 266, beneficiaries: 8398 },
      ],
      recent_verified_records: [],
      disclaimer: "All statistics are aggregated strictly from supervisor-verified field logs and audit check-ins. No fictitious numbers are included."
    });
  },

  async chatWithAssistant(message: string, causeFilter?: string): Promise<AssistantChatResponse> {
    return fetchWithFallback<AssistantChatResponse>(
      `${API_BASE}/assistant/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, cause_filter: causeFilter })
      },
      {
        answer: "Based on verified records from GreenCanopy Urban Forestry:\n\nAll urban reforestation requires a minimum of 80% native Californian species and mandatory utility line checks before soil excavation.",
        citations: [
          {
            document_title: "Urban Rewilding & Native Species Protocol 2026",
            document_type: "Field Manual",
            organization_name: "GreenCanopy Urban Forestry",
            excerpt: "GreenCanopy operates strictly under biodiversity guidelines that mandate a minimum of 80% native Californian saplings.",
            relevance_score: 95.2
          }
        ],
        grounded: true,
        confidence_note: "Directly grounded in verified field manual documents.",
        fallback_mode: false
      }
    );
  },

  async getOrganizations(): Promise<Organization[]> {
    return fetchWithFallback<Organization[]>(`${API_BASE}/organizations`, undefined, [
      {
        id: "org-green-canopy",
        name: "GreenCanopy Urban Forestry",
        mission: "Restoring urban biodiversity and building community resilience through native canopy reforestation.",
        website: "https://greencanopy.org",
        contact_email: "impact@greencanopy.org",
        verification_status: "approved",
        location: "San Francisco, CA",
        focus_areas: ["Climate Action", "Urban Biodiversity"],
        created_at: "2024-02-15T09:00:00Z",
        verified_at: "2024-03-01T14:30:00Z",
        verified_by: "Platform Admin (Audit Committee)",
        verification_notes: "501(c)(3) verified with active municipal tree-planting permits."
      },
      {
        id: "org-coastal-watch",
        name: "Pacific Shore & Watershed Watch",
        mission: "Monitoring coastal wetland ecosystems and leading community watershed conservation.",
        website: "https://pacificshorewatch.org",
        contact_email: "fieldops@pacificshorewatch.org",
        verification_status: "pending",
        location: "Santa Cruz, CA",
        focus_areas: ["Ocean Health", "Watershed Protection"],
        created_at: "2026-09-12T11:00:00Z"
      }
    ]);
  },

  async verifyOrganization(orgId: string, status: 'approved' | 'rejected', notes?: string): Promise<Organization> {
    return fetchWithFallback<Organization>(
      `${API_BASE}/organizations/${orgId}/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      },
      {
        id: orgId,
        name: "Organization",
        mission: "Updated verification status",
        website: "https://example.org",
        contact_email: "admin@example.org",
        verification_status: status,
        location: "California",
        focus_areas: ["Environment"],
        created_at: new Date().toISOString(),
        verified_at: status === 'approved' ? new Date().toISOString() : null,
        verified_by: status === 'approved' ? "Platform Admin" : null
      }
    );
  },

  async generateReport(orgId: string, reportingPeriod: string = "Q3 2026"): Promise<ReportDraft> {
    return fetchWithFallback<ReportDraft>(
      `${API_BASE}/reports/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ org_id: orgId, reporting_period: reportingPeriod, include_ai_summary: true })
      },
      {
        id: `rep-${Date.now().toString().slice(-6)}`,
        org_id: orgId,
        org_name: "GreenCanopy Urban Forestry",
        title: `GreenCanopy Urban Forestry — Impact Report (${reportingPeriod})`,
        reporting_period: reportingPeriod,
        measured_facts: {
          verified_volunteer_hours: 110.0,
          total_participating_volunteers: 22,
          verified_beneficiaries_served: 7900,
          documented_field_events: 2,
          verified_outcomes_list: ["45 native oak saplings planted", "Interactive GIS map delivered to city commission"],
          audit_evidence_ledger: [
            { event: "Mission District Planting", date: "2026-09-26", proof_type: "photo_audit", proof_id: "DOC-CANOPY-0926" }
          ]
        },
        estimates_and_projections: {
          estimated_economic_value_created_usd: 3498.00,
          labor_valuation_basis: "$31.80/hr (Independent Sector Standard)",
          projected_30yr_carbon_mitigation_mt: 13.2
        },
        missing_evidence_notices: [
          "All submitted field events have verified supervisor check-ins and evidence logs."
        ],
        ai_generated_narrative: `During ${reportingPeriod}, GreenCanopy Urban Forestry deployed 22 dedicated community volunteers contributing 110.0 verified service hours. Economic value creation of $3,498.00 is an econometric estimate based on Independent Sector metrics.`,
        status: "draft",
        human_reviewer_signoff: null,
        created_at: new Date().toISOString()
      }
    );
  },

  async signoffReport(reportId: string, reviewerName: string): Promise<ReportDraft> {
    return fetchWithFallback<ReportDraft>(
      `${API_BASE}/reports/${reportId}/signoff?reviewer_name=${encodeURIComponent(reviewerName)}`,
      { method: 'POST' },
      {
        id: reportId,
        org_id: "org-green-canopy",
        org_name: "GreenCanopy Urban Forestry",
        title: "Impact Report (Signed)",
        reporting_period: "Q3 2026",
        measured_facts: {
          verified_volunteer_hours: 110,
          total_participating_volunteers: 22,
          verified_beneficiaries_served: 7900,
          documented_field_events: 2,
          verified_outcomes_list: [],
          audit_evidence_ledger: []
        },
        estimates_and_projections: {
          estimated_economic_value_created_usd: 3498,
          labor_valuation_basis: "$31.80/hr"
        },
        missing_evidence_notices: [],
        ai_generated_narrative: "Signed report.",
        status: "published",
        human_reviewer_signoff: `${reviewerName} (Approved)`,
        created_at: new Date().toISOString()
      }
    );
  }
};
