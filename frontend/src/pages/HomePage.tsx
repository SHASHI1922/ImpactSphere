import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Cause, Opportunity } from '../types';
import {
  ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Users,
  Clock, MapPin, BarChart3, HeartHandshake, FileCheck, Search
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, setSelectedOpportunityId, setIsApplyModalOpen } = useApp();
  const [causes, setCauses] = useState<Cause[]>([]);
  const [featuredOpps, setFeaturedOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [c, o] = await Promise.all([api.getCauses(), api.getOpportunities()]);
        setCauses(c);
        setFeaturedOpps(o.slice(0, 3));
      } catch (err) {
        console.error("Failed loading home data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-warmIvory-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest text-warmIvory text-xs font-semibold shadow-sm border border-forest-700">
                <span className="w-2 h-2 rounded-full bg-limeAccent animate-pulse" />
                <span>ImpactSphere AI — Public Verification Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest tracking-tight leading-[1.12]">
                Turn compassion into <br />
                <span className="text-primaryGreen underline decoration-limeAccent decoration-4 underline-offset-6">
                  measurable impact.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
                Connect your unique skills with verified social causes, empower non-profits with cryptographic field coordination, and turn verified hours into auditable impact reports.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={() => navigate('/opportunities')}
                  className="px-6 py-3.5 rounded-2xl bg-primaryGreen hover:bg-primaryGreen-light text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>Find Matched Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/causes')}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-warmIvory-200 text-forest font-bold text-sm border border-warmIvory-300 shadow-sm transition-all flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4 text-stone-500" />
                  <span>Explore Causes Directory</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-warmIvory-300">
                <div>
                  <div className="text-2xl font-black text-forest">266+</div>
                  <div className="text-xs text-stone-500 font-medium">Verified Hours Logged</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-primaryGreen">100%</div>
                  <div className="text-xs text-stone-500 font-medium">Supervisor Sign-offs</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-forest">8,398</div>
                  <div className="text-xs text-stone-500 font-medium">Beneficiaries Reached</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-limeAccent/30 to-primaryGreen/20 rounded-3xl blur-xl" />
                <div className="relative bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-200 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-forest uppercase tracking-wider">Live Field Verification</span>
                    </div>
                    <span className="text-[11px] font-mono bg-warmIvory px-2 py-0.5 rounded text-stone-600">Audit-Grade Ledger</span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3.5 rounded-2xl bg-warmIvory-50 border border-warmIvory-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-900">GreenCanopy Urban Reforestation</span>
                        <span className="text-primaryGreen font-bold flex items-center text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Approved NGO
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">45 native oak saplings planted in Mission District corridor.</p>
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-600 font-mono">
                        <span>Check-ins: 18 Volunteers</span>
                        <span className="bg-limeAccent/40 text-forest-900 px-2 py-0.5 rounded font-bold">72.0 Verified Hrs</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-warmIvory-50 border border-warmIvory-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-900">NourishAll Surplus Distribution</span>
                        <span className="text-primaryGreen font-bold flex items-center text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Approved NGO
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">4,200 lbs organic farm produce redistributed within 24h.</p>
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-600 font-mono">
                        <span>Families Reached: 180</span>
                        <span className="bg-limeAccent/40 text-forest-900 px-2 py-0.5 rounded font-bold">88.0 Verified Hrs</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-forest text-warmIvory rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-limeAccent" />
                      <span className="font-medium">AI Impact Assistant Active</span>
                    </div>
                    <button
                      onClick={() => navigate('/assistant')}
                      className="text-limeAccent font-bold hover:underline text-[11px]"
                    >
                      Ask Grounded Question →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cause Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold text-primaryGreen uppercase tracking-wider mb-1">Impact Domains</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest">Priority Cause Focus Areas</h2>
          </div>
          <button
            onClick={() => navigate('/causes')}
            className="mt-3 md:mt-0 text-xs font-bold text-forest hover:text-primaryGreen flex items-center space-x-1"
          >
            <span>Browse All Causes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {causes.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate('/causes')}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={c.image_url}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-forest/85 backdrop-blur-sm text-limeAccent text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {c.sdg_goal.split(':')[0]}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{c.category}</span>
                  <h3 className="text-base font-bold text-forest mt-0.5 group-hover:text-primaryGreen transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>{c.active_opportunities_count} Open Roles</span>
                  <span className="font-bold text-forest">{c.verified_hours} hrs logged</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-6 sm:p-10 text-warmIvory relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold text-limeAccent uppercase tracking-wider mb-1">Take Action Now</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Volunteering Roles</h2>
              <p className="text-xs text-stone-300 mt-1">High-priority positions with immediate community need.</p>
            </div>
            <button
              onClick={() => navigate('/opportunities')}
              className="mt-4 md:mt-0 px-4 py-2 bg-limeAccent hover:bg-limeAccent-light text-forest-900 text-xs font-bold rounded-xl transition-all"
            >
              View All Opportunities →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredOpps.map((opp) => (
              <div
                key={opp.id}
                className="bg-forest-800/90 rounded-2xl p-5 border border-forest-700 flex flex-col justify-between space-y-4 hover:border-limeAccent/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-limeAccent font-bold">{opp.category}</span>
                    <span className="text-stone-300 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {opp.schedule_type}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1.5 line-clamp-1">{opp.title}</h4>
                  <p className="text-xs text-stone-300 mt-0.5">{opp.org_name}</p>
                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">{opp.description}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-forest-700">
                  <div className="flex flex-wrap gap-1">
                    {opp.skills_required.slice(0, 2).map((s) => (
                      <span key={s} className="text-[10px] bg-forest-900 px-2 py-0.5 rounded text-stone-300">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-300">
                      {opp.slots_total - opp.slots_filled} spots remaining
                    </span>
                    <button
                      onClick={() => {
                        setSelectedOpportunityId(opp.id);
                        setIsApplyModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-primaryGreen hover:bg-primaryGreen-light text-white text-xs font-bold rounded-lg transition-all"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The ImpactSphere 4-Step Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-primaryGreen uppercase tracking-wider mb-1">How It Works</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest">From Passion to Verified Change</h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            A transparent four-phase lifecycle ensuring every hour volunteered translates into undeniable, auditable social benefit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-primaryGreen/10 flex items-center justify-center text-primaryGreen font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-forest">Algorithmic Fit</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Transparent, configurable scoring balances your exact skills, schedule window, and cause passions without misleading probability claims.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-primaryGreen/10 flex items-center justify-center text-primaryGreen font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-forest">Active Service</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Collaborate on ground or remotely with verified 501(c)(3) organizations under established child safeguarding and field protocols.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-primaryGreen/10 flex items-center justify-center text-primaryGreen font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-forest">Audit & Sign-off</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Supervisors record physical rosters, photo evidence, and GPS check-ins. No fictitious numbers or unverified accomplishments enter the ledger.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-primaryGreen/10 flex items-center justify-center text-primaryGreen font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-forest">Transparent Reports</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              AI drafts publishable reports strictly segregating measured facts from economic projections, requiring human sign-off before public release.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Mission & Responsible AI Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-warmIvory-200 rounded-3xl p-8 sm:p-12 border border-warmIvory-300 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center space-x-2 text-forest font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-primaryGreen" />
              <span>Responsible Impact Guarantee</span>
            </div>
            <h3 className="text-2xl font-bold text-forest">Zero Hallucination. Verifiable Truth.</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Too much of social impact reporting is opaque or exaggerated. ImpactSphere AI uses deterministic data pipelines and RAG grounded strictly in audited field records to protect public trust.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/about')}
              className="px-5 py-2.5 bg-forest text-warmIvory text-xs font-bold rounded-xl hover:bg-forest-700 transition-all"
            >
              Read Our AI Ethics Charter
            </button>
            <button
              onClick={() => navigate('/assistant')}
              className="px-5 py-2.5 bg-white text-forest text-xs font-bold rounded-xl border border-stone-200 hover:bg-stone-50 transition-all"
            >
              Test RAG Assistant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
