import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Opportunity, OpportunityWithMatch, MatchRequest } from '../types';
import { ApplicationModal } from '../components/ApplicationModal';
import {
  Search, Filter, MapPin, Clock, ShieldCheck, CheckCircle2,
  Sparkles, SlidersHorizontal, ArrowUpDown, ChevronRight, X
} from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { selectedOpportunityId, setSelectedOpportunityId, isApplyModalOpen, setIsApplyModalOpen, addToast } = useApp();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [rankedOpportunities, setRankedOpportunities] = useState<OpportunityWithMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState('All');

  // Match Tuning Drawer
  const [showMatchTuner, setShowMatchTuner] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>(['Data Analysis', 'Python', 'GIS / Mapping']);
  const [skillInput, setSkillInput] = useState('');
  const [skillWeight, setSkillWeight] = useState(0.35);
  const [causeWeight, setCauseWeight] = useState(0.25);
  const [availWeight, setAvailWeight] = useState(0.20);
  const [locWeight, setLocWeight] = useState(0.20);

  // Selected Detail Modal
  const [detailedOpp, setDetailedOpp] = useState<Opportunity | null>(null);

  const categories = ['All', 'Environment', 'Education', 'Food Security', 'Social Inclusion'];
  const schedules = ['All', 'Weekends', 'Flexible', 'Weekday Evenings'];

  const loadData = async () => {
    setLoading(true);
    try {
      const opps = await api.getOpportunities({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        remote: remoteOnly ? true : undefined,
        schedule: selectedSchedule === 'All' ? undefined : selectedSchedule,
        query: searchQuery || undefined
      });
      setOpportunities(opps);

      // Run matching
      const req: MatchRequest = {
        volunteer_skills: userSkills,
        preferred_causes: ['Climate Action', 'Youth STEM'],
        preferred_schedule: selectedSchedule === 'All' ? 'Flexible' : selectedSchedule,
        remote_only: remoteOnly,
        weights: {
          skill_weight: skillWeight,
          cause_weight: causeWeight,
          availability_weight: availWeight,
          location_weight: locWeight
        }
      };
      const matches = await api.getMatches(req);
      setRankedOpportunities(matches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, remoteOnly, selectedSchedule, searchQuery, userSkills, skillWeight, causeWeight, availWeight, locWeight]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !userSkills.includes(skillInput.trim())) {
      setUserSkills([...userSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setUserSkills(userSkills.filter(s => s !== skill));
  };

  const activeOppForApply = detailedOpp || opportunities.find(o => o.id === selectedOpportunityId) || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header and Match Tuner Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest text-warmIvory text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-limeAccent" />
            <span>Deterministic Algorithmic Matching Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest">Volunteering Opportunities</h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            Search verified community roles or tune your volunteer attributes below. Match scores represent deterministic alignment fit based on transparent factors, never probabilistic approval odds.
          </p>
        </div>

        <button
          onClick={() => setShowMatchTuner(!showMatchTuner)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shadow-sm border ${
            showMatchTuner
              ? 'bg-forest text-warmIvory border-forest'
              : 'bg-white text-forest border-stone-200 hover:bg-stone-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-primaryGreen" />
          <span>{showMatchTuner ? 'Hide Match Tuner' : 'Customize Match Weights'}</span>
        </button>
      </div>

      {/* Match Tuner Panel */}
      {showMatchTuner && (
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-md space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-forest">Configurable Match Engine</h3>
              <p className="text-xs text-stone-500">Add your skills and adjust how heavily each attribute influences your alignment score.</p>
            </div>
            <span className="text-[11px] font-bold text-primaryGreen bg-primaryGreen/10 px-2.5 py-1 rounded-full">
              Transparent Scoring
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills Profile */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700">Your Volunteer Skills (Tag Input)</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. Python, Mentorship, First Aid..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); }}}
                  className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-stone-200 focus:border-primaryGreen outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3.5 py-2 bg-forest text-warmIvory text-xs font-bold rounded-xl hover:bg-forest-700"
                >
                  Add Skill
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {userSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-warmIvory border border-warmIvory-300 text-stone-800"
                  >
                    <span>{s}</span>
                    <button onClick={() => handleRemoveSkill(s)} className="text-stone-400 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Weights Sliders */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-700">Weight Allocations (Totals normalize automatically)</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-stone-600 mb-1">
                    <span>Skills:</span>
                    <span className="font-bold">{Math.round(skillWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={skillWeight}
                    onChange={(e) => setSkillWeight(parseFloat(e.target.value))}
                    className="w-full accent-primaryGreen"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-stone-600 mb-1">
                    <span>Cause Alignment:</span>
                    <span className="font-bold">{Math.round(causeWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={causeWeight}
                    onChange={(e) => setCauseWeight(parseFloat(e.target.value))}
                    className="w-full accent-primaryGreen"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-stone-600 mb-1">
                    <span>Availability:</span>
                    <span className="font-bold">{Math.round(availWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={availWeight}
                    onChange={(e) => setAvailWeight(parseFloat(e.target.value))}
                    className="w-full accent-primaryGreen"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-stone-600 mb-1">
                    <span>Location/Remote:</span>
                    <span className="font-bold">{Math.round(locWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={locWeight}
                    onChange={(e) => setLocWeight(parseFloat(e.target.value))}
                    className="w-full accent-primaryGreen"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search opportunities by role, skills (e.g. React, GIS, Gardening), or NGO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:border-primaryGreen outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium text-stone-700 outline-none"
          >
            {categories.map(c => <option key={c} value={c}>Category: {c}</option>)}
          </select>

          {/* Schedule Dropdown */}
          <select
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium text-stone-700 outline-none"
          >
            {schedules.map(s => <option key={s} value={s}>Schedule: {s}</option>)}
          </select>

          {/* Remote Toggle */}
          <button
            onClick={() => setRemoteOnly(!remoteOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              remoteOnly
                ? 'bg-primaryGreen text-white border-primaryGreen'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {remoteOnly ? '✓ Remote Only' : 'Remote & On-site'}
          </button>
        </div>
      </div>

      {/* Opportunity List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-2">
          <span>Found {opportunities.length} matching positions</span>
          <span>Ranked by deterministic alignment</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-stone-200/60 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : rankedOpportunities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <p className="text-sm font-bold text-stone-700">No opportunities match the selected criteria.</p>
            <p className="text-xs text-stone-500">Try broadening your search or disabling the remote filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {rankedOpportunities.map(({ opportunity: opp, match_breakdown }) => (
              <div
                key={opp.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-forest bg-warmIvory px-2.5 py-0.5 rounded-full border border-warmIvory-300">
                      {opp.category}
                    </span>
                    {opp.org_verified && (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Verified NGO
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-primaryGreen bg-limeAccent/30 px-2.5 py-0.5 rounded-full">
                      {match_breakdown.total_alignment_score}% Alignment Fit
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-forest hover:text-primaryGreen transition-colors cursor-pointer"
                      onClick={() => setDetailedOpp(opp)}
                    >
                      {opp.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">{opp.org_name}</p>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Factor breakdown pill */}
                  <div className="text-[11px] text-stone-500 bg-warmIvory-50 p-2.5 rounded-xl border border-warmIvory-200">
                    <strong className="text-forest">Alignment Breakdown: </strong>
                    {match_breakdown.summary_reason}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-primaryGreen" /> {opp.schedule_type} ({opp.commitment_hours} hrs/wk)
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-primaryGreen" /> {opp.is_remote ? 'Remote' : opp.location}
                    </span>
                    <span className="text-stone-400">
                      • {opp.slots_total - opp.slots_filled} of {opp.slots_total} slots open
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 w-full md:w-auto flex-shrink-0">
                  <button
                    onClick={() => {
                      setDetailedOpp(opp);
                      setIsApplyModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-primaryGreen hover:bg-primaryGreen-light text-white text-xs font-bold rounded-xl transition-all shadow-sm text-center"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => setDetailedOpp(opp)}
                    className="px-5 py-2 bg-warmIvory hover:bg-warmIvory-200 text-stone-800 text-xs font-semibold rounded-xl border border-warmIvory-300 transition-all text-center"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Slideout/Modal */}
      {detailedOpp && !isApplyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-primaryGreen uppercase tracking-wider">{detailedOpp.category}</span>
                <h2 className="text-2xl font-bold text-forest mt-1">{detailedOpp.title}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-stone-600 font-semibold">{detailedOpp.org_name}</span>
                  {detailedOpp.org_verified && (
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Audited NGO
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setDetailedOpp(null)}
                className="text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Opportunity Overview</h4>
                <p>{detailedOpp.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1.5">Required Skills & Preparation</h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailedOpp.skills_required.map(s => (
                    <span key={s} className="bg-warmIvory border border-warmIvory-300 text-stone-800 px-3 py-1 rounded-lg font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-warmIvory rounded-2xl border border-warmIvory-300">
                <div>
                  <span className="text-stone-500">Schedule:</span>
                  <div className="font-bold text-stone-900">{detailedOpp.schedule_type} ({detailedOpp.commitment_hours} hrs/week)</div>
                </div>
                <div>
                  <span className="text-stone-500">Location:</span>
                  <div className="font-bold text-stone-900">{detailedOpp.is_remote ? 'Fully Remote' : detailedOpp.location}</div>
                </div>
                <div>
                  <span className="text-stone-500">Campaign Window:</span>
                  <div className="font-bold text-stone-900">{detailedOpp.start_date} to {detailedOpp.end_date}</div>
                </div>
                <div>
                  <span className="text-stone-500">Availability:</span>
                  <div className="font-bold text-stone-900">{detailedOpp.slots_total - detailedOpp.slots_filled} of {detailedOpp.slots_total} spots left</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setDetailedOpp(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Close
              </button>
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="px-5 py-2.5 bg-primaryGreen hover:bg-primaryGreen-light text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Proceed to Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      <ApplicationModal
        opportunity={activeOppForApply}
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setDetailedOpp(null);
        }}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
};
