from typing import List, Tuple
from .models import Opportunity, MatchRequest, MatchBreakdown, MatchFactor, OpportunityWithMatch

def calculate_skill_score(volunteer_skills: List[str], required_skills: List[str]) -> Tuple[int, str]:
    if not required_skills:
        return 100, "No specific prerequisites required; wide open to all backgrounds."
    if not volunteer_skills:
        return 30, "No volunteer skills listed in profile; basic match on entry-level readiness."

    v_set = {s.strip().lower() for s in volunteer_skills if s.strip()}
    r_set = {s.strip().lower() for s in required_skills if s.strip()}

    # Exact or substring match
    matched = []
    for req in r_set:
        for v in v_set:
            if v == req or v in req or req in v:
                matched.append(req)
                break

    matched_count = len(matched)
    ratio = matched_count / len(r_set)
    score = int(min(100, max(20, ratio * 100)))

    if matched_count == len(r_set):
        explanation = f"Full skill match ({len(r_set)}/{len(r_set)} requirements: {', '.join(required_skills)})."
    elif matched_count > 0:
        matched_pretty = [r for r in required_skills if r.strip().lower() in matched]
        explanation = f"Matched {matched_count} of {len(r_set)} core skills ({', '.join(matched_pretty)})."
    else:
        explanation = "Complementary background; opportunity provides onboarding mentorship."

    return score, explanation

def calculate_cause_score(preferred_causes: List[str], opp: Opportunity) -> Tuple[int, str]:
    if not preferred_causes:
        return 75, "Matches general community impact preferences."

    p_causes = [c.strip().lower() for c in preferred_causes if c.strip()]
    opp_cause_lower = opp.cause_name.lower()
    opp_cat_lower = opp.category.lower()

    for p in p_causes:
        if p in opp_cause_lower or p in opp_cat_lower or opp_cat_lower in p:
            return 100, f"Directly aligns with your priority cause: {opp.cause_name} ({opp.category})."

    return 40, f"Cross-disciplinary opportunity in {opp.category} with shared community goals."

def calculate_availability_score(preferred_schedule: str, opp_schedule: str) -> Tuple[int, str]:
    pref = preferred_schedule.strip().lower()
    opp = opp_schedule.strip().lower()

    if "flexible" in pref or "flexible" in opp:
        return 100, "High flexibility match with your requested schedule window."
    if pref == opp:
        return 100, f"Exact schedule alignment on {opp_schedule}."
    if "weekend" in pref and "weekend" in opp:
        return 100, "Weekend schedule matches your profile availability."
    if "evening" in pref and "evening" in opp:
        return 100, "Evening window matches your availability."

    return 55, f"Opportunity runs on {opp_schedule}; partial overlap with your preference."

def calculate_location_score(remote_only: bool, location_pref: str, opp: Opportunity) -> Tuple[int, str]:
    if remote_only:
        if opp.is_remote:
            return 100, "Fully remote opportunity matches your remote-only preference."
        else:
            return 15, "In-person role requires on-site participation; remote-only is requested."

    if opp.is_remote:
        return 95, "Remote-accessible anywhere."

    if location_pref and opp.location:
        loc_pref_lower = location_pref.lower().split(",")[0].strip()
        opp_loc_lower = opp.location.lower()
        if loc_pref_lower in opp_loc_lower or opp_loc_lower in loc_pref_lower:
            return 100, f"Local on-site role in {opp.location}."

    return 60, f"Role is located at {opp.location}."

def rank_opportunities(opps: List[Opportunity], request: MatchRequest) -> List[OpportunityWithMatch]:
    ranked = []
    w = request.weights
    total_weights = w.skill_weight + w.cause_weight + w.availability_weight + w.location_weight
    if total_weights <= 0:
        total_weights = 1.0

    norm_skill_w = w.skill_weight / total_weights
    norm_cause_w = w.cause_weight / total_weights
    norm_avail_w = w.availability_weight / total_weights
    norm_loc_w = w.location_weight / total_weights

    for opp in opps:
        skill_score, skill_expl = calculate_skill_score(request.volunteer_skills, opp.skills_required)
        cause_score, cause_expl = calculate_cause_score(request.preferred_causes, opp)
        avail_score, avail_expl = calculate_availability_score(request.preferred_schedule, opp.schedule_type)
        loc_score, loc_expl = calculate_location_score(request.remote_only, request.location or "", opp)

        # Weighted calculation
        total_score_raw = (
            (skill_score * norm_skill_w) +
            (cause_score * norm_cause_w) +
            (avail_score * norm_avail_w) +
            (loc_score * norm_loc_w)
        )
        total_score = int(round(total_score_raw))

        factors = [
            MatchFactor(
                factor_name="Skill Alignment",
                weight_percentage=int(round(norm_skill_w * 100)),
                score_percentage=skill_score,
                explanation=skill_expl
            ),
            MatchFactor(
                factor_name="Cause Fit",
                weight_percentage=int(round(norm_cause_w * 100)),
                score_percentage=cause_score,
                explanation=cause_expl
            ),
            MatchFactor(
                factor_name="Availability",
                weight_percentage=int(round(norm_avail_w * 100)),
                score_percentage=avail_score,
                explanation=avail_expl
            ),
            MatchFactor(
                factor_name="Location / Mode",
                weight_percentage=int(round(norm_loc_w * 100)),
                score_percentage=loc_score,
                explanation=loc_expl
            )
        ]

        summary_reason = f"{total_score}% alignment fit: {skill_expl} {cause_expl}"

        breakdown = MatchBreakdown(
            total_alignment_score=total_score,
            factors=factors,
            summary_reason=summary_reason
        )

        ranked.append(OpportunityWithMatch(opportunity=opp, match_breakdown=breakdown))

    ranked.sort(key=lambda x: x.match_breakdown.total_alignment_score, reverse=True)
    return ranked
