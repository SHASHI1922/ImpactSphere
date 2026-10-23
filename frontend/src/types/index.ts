export interface Cause {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  sdg_goal: string;
  image_url: string;
  active_opportunities_count: number;
  volunteers_engaged: number;
  verified_hours: number;
}

export interface Opportunity {
  id: string;
  org_id: string;
  org_name: string;
  org_verified: boolean;
  title: string;
  description: string;
  cause_id: string;
  cause_name: string;
  category: string;
  skills_required: string[];
  location: string;
  is_remote: boolean;
  schedule_type: string;
  commitment_hours: number;
  start_date: string;
  end_date: string;
  slots_total: number;
  slots_filled: number;
  status: string;
  created_at: string;
}

export interface MatchFactor {
  factor_name: string;
  weight_percentage: number;
  score_percentage: number;
  explanation: string;
}

export interface MatchBreakdown {
  total_alignment_score: number;
  factors: MatchFactor[];
  summary_reason: string;
}

export interface OpportunityWithMatch {
  opportunity: Opportunity;
  match_breakdown: MatchBreakdown;
}

export interface MatchRequest {
  volunteer_skills: string[];
  preferred_causes: string[];
  preferred_schedule: string;
  remote_only: boolean;
  location?: string;
  weights?: {
    skill_weight: number;
    cause_weight: number;
    availability_weight: number;
    location_weight: number;
  };
}

export interface Application {
  id: string;
  opportunity_id: string;
  opportunity_title: string;
  org_id: string;
  org_name: string;
  volunteer_name: string;
  volunteer_email: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  motivation: string;
  skills_offered: string[];
  availability_note: string;
  hours_logged: number;
  applied_at: string;
  updated_at: string;
}

export interface ApplicationCreate {
  opportunity_id: string;
  volunteer_name: string;
  volunteer_email: string;
  motivation: string;
  skills_offered: string[];
  availability_note: string;
}

export interface ImpactRecord {
  id: string;
  org_id: string;
  opportunity_id: string;
  opportunity_title: string;
  event_title: string;
  date: string;
  volunteer_hours: number;
  attendees_count: number;
  beneficiaries_served: number;
  outcomes: string[];
  evidence_type: string;
  evidence_reference: string;
  is_demo_record: boolean;
  verified_timestamp: string;
}

export interface SourceCitation {
  document_title: string;
  document_type: string;
  organization_name: string;
  excerpt: string;
  relevance_score: number;
}

export interface AssistantChatResponse {
  answer: string;
  citations: SourceCitation[];
  grounded: boolean;
  confidence_note: string;
  fallback_mode: boolean;
}

export interface ReportDraft {
  id: string;
  org_id: string;
  org_name: string;
  title: string;
  reporting_period: string;
  measured_facts: {
    verified_volunteer_hours: number;
    total_participating_volunteers: number;
    verified_beneficiaries_served: number;
    documented_field_events: number;
    verified_outcomes_list: string[];
    audit_evidence_ledger: Array<{
      event: string;
      date: string;
      proof_type: string;
      proof_id: string;
    }>;
  };
  estimates_and_projections: {
    estimated_economic_value_created_usd: number;
    labor_valuation_basis: string;
    projected_annualized_community_retention?: string;
    projected_30yr_carbon_mitigation_mt?: number;
  };
  missing_evidence_notices: string[];
  ai_generated_narrative: string;
  status: 'draft' | 'in_review' | 'published';
  human_reviewer_signoff: string | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  mission: string;
  website: string;
  contact_email: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  location: string;
  focus_areas: string[];
  created_at: string;
  verified_at?: string | null;
  verified_by?: string | null;
  verification_notes?: string | null;
}
