import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Application, OpportunityWithMatch } from '../types';
import {
  User, Award, Clock, CheckCircle2, AlertCircle, ShieldCheck,
  Calendar, FileText, ArrowRight, Sparkles, BookOpen
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { navigate, setSelectedOpportunityId, setIsApplyModalOpen } = useApp();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await api.getDashboard("alex.chen@example.org");
        setDashboardData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-40 bg-stone-200/60 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-stone-200/60 rounded-3xl animate-pulse" />
          <div className="md:col-span-2 h-64 bg-stone-200/60 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const volunteer = dashboardData?.volunteer;
  const applications: Application[] = dashboardData?.applications || [];
  const recommended: OpportunityWithMatch[] = dashboardData?.recommended_opportunities || [];
  const activities = dashboardData?.recent_activities || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-forest flex items-center justify-center text-limeAccent font-extrabold text-2xl shadow-md border border-forest-700">
            {volunteer?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-forest">{volunteer?.name}</h1>
              <span className="text-[11px] font-bold text-forest bg-limeAccent/60 px-2.5 py-0.5 rounded-full border border-limeAccent">
                {volunteer?.badge}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">{volunteer?.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {volunteer?.skills?.map((s: string) => (
                <span key={s} className="text-[10px] bg-warmIvory text-stone-700 px-2 py-0.5 rounded border border-warmIvory-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6">
          <div className="text-center px-3">
            <div className="text-2xl font-black text-primaryGreen">{volunteer?.total_hours_logged}</div>
            <div className="text-[11px] text-stone-500 font-medium">Verified Hours</div>
          </div>
          <div className="text-center px-3 border-l border-stone-100">
            <div className="text-2xl font-black text-forest">{volunteer?.projects_joined}</div>
            <div className="text-[11px] text-stone-500 font-medium">Joined Causes</div>
          </div>
          <div className="text-center px-3 border-l border-stone-100">
            <div className="text-2xl font-black text-amber-600">{volunteer?.verified_community_points}</div>
            <div className="text-[11px] text-stone-500 font-medium">Impact Points</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Applications and Activities */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Applications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-forest">My Applications</h3>
                <p className="text-xs text-stone-500">Track application statuses and supervisor approvals in real time.</p>
              </div>
              <button
                onClick={() => navigate('/opportunities')}
                className="text-xs font-bold text-primaryGreen hover:underline flex items-center space-x-1"
              >
                <span>Find More Roles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-2">
                <p className="text-xs text-stone-500">No applications submitted yet.</p>
                <button
                  onClick={() => navigate('/opportunities')}
                  className="px-4 py-2 bg-primaryGreen text-white text-xs font-bold rounded-xl"
                >
                  Browse Opportunities
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-forest">{app.opportunity_title}</h4>
                        <p className="text-xs text-stone-500 font-medium">{app.org_name}</p>
                      </div>

                      <span className={`self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full ${
                        app.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {app.status === 'accepted' ? '✓ Accepted by NGO' : app.status === 'pending' ? '⏳ Pending Review' : app.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 bg-warmIvory-50 p-2.5 rounded-xl border border-warmIvory-200">
                      <strong className="text-stone-800">Motivation statement: </strong>
                      "{app.motivation}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span>Logged Service: <strong className="text-forest font-mono">{app.hours_logged} hrs</strong></span>
                      <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Supervisor-Verified Activity History */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-forest">Verified Activity History</h3>
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden">
              {activities.map((act: any) => (
                <div key={act.id} className="p-4 sm:p-5 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-stone-900">{act.title}</div>
                    <div className="text-stone-500">{act.org} • {act.date}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-bold text-primaryGreen font-mono text-sm">+{act.hours} hrs</div>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold inline-flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" /> {act.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tailored Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-forest rounded-3xl p-6 text-warmIvory space-y-4">
            <div className="flex items-center space-x-2 text-limeAccent font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Recommended For You</span>
            </div>
            <h3 className="text-lg font-bold text-white">High Alignment Matches</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Calculated using your registered skills ({volunteer?.skills?.slice(0, 2).join(', ')}) and preferred schedule.
            </p>

            <div className="space-y-3 pt-2">
              {recommended.slice(0, 3).map(({ opportunity: opp, match_breakdown }) => (
                <div
                  key={opp.id}
                  className="bg-forest-800 p-4 rounded-2xl border border-forest-700 space-y-2 hover:border-limeAccent/40 transition-all"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-limeAccent font-bold">{match_breakdown.total_alignment_score}% Match</span>
                    <span className="text-stone-300 font-mono">{opp.commitment_hours} hrs/wk</span>
                  </div>
                  <h5 className="text-xs font-bold text-white line-clamp-1">{opp.title}</h5>
                  <p className="text-[11px] text-stone-400 line-clamp-1">{opp.org_name}</p>
                  <button
                    onClick={() => {
                      setSelectedOpportunityId(opp.id);
                      setIsApplyModalOpen(true);
                    }}
                    className="w-full mt-1 py-1.5 bg-primaryGreen hover:bg-primaryGreen-light text-white text-[11px] font-bold rounded-lg transition-all"
                  >
                    Quick Apply
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-warmIvory rounded-3xl p-6 border border-warmIvory-300 space-y-3">
            <h4 className="text-xs font-bold text-forest uppercase tracking-wider">Volunteer Guidance</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Need proof of volunteering for employer matching, academic credits, or tax reports? All hours logged are countersigned and exportable.
            </p>
            <button
              onClick={() => navigate('/impact')}
              className="text-xs font-bold text-primaryGreen hover:underline flex items-center space-x-1"
            >
              <span>View Public Impact Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
