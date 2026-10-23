import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck, HeartHandshake, Sparkles, CheckCircle2,
  Lock, FileText, ArrowRight, Award, Compass, Eye
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest text-warmIvory text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-limeAccent" />
          <span>Our Operating Principles & Ethics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest">
          Turn compassion into measurable impact.
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          ImpactSphere AI was designed to restore trust and transparency to the non-profit sector.
          By combining algorithmic skill matching with strict, verifiable field logs, we eliminate vague impact metrics and prevent AI hallucinations.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-primaryGreen/10 flex items-center justify-center text-primaryGreen font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-forest">Algorithmic Transparency</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every match recommendation shows its full arithmetic breakdown. We never present scores as "chances of admission" or opaque black-box percentages.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-primaryGreen/10 flex items-center justify-center text-primaryGreen font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-forest">Strict Evidence Hierarchy</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We reject fabricated volunteer hours and ungrounded claims. Every hour displayed on public ledgers requires supervisor countersignatures and audit proof.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-primaryGreen/10 flex items-center justify-center text-primaryGreen font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-forest">Privacy & Role Security</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Non-profit operational data, child safeguarding records, and private volunteer personal details are never exposed to public crawlers or third-party ad brokers.
          </p>
        </div>
      </div>

      {/* Responsible AI Charter */}
      <div className="bg-forest rounded-3xl p-8 sm:p-10 text-warmIvory space-y-6">
        <div className="flex items-center space-x-2 text-limeAccent font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Responsible AI Commitment</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Our 4-Part AI Accountability Charter
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-300">
          <div className="space-y-1.5 p-4 rounded-2xl bg-forest-800 border border-forest-700">
            <h4 className="font-bold text-limeAccent text-sm">1. Grounded RAG Only</h4>
            <p>Our assistant answers user questions strictly from verified non-profit PDF manuals, safety policies, and official reports. When evidence is insufficient, it honestly refuses.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-forest-800 border border-forest-700">
            <h4 className="font-bold text-limeAccent text-sm">2. Facts vs. Estimates Segregation</h4>
            <p>Generated impact reports rigorously separate measured facts (e.g. 110 hrs worked) from econometric models (e.g. Independent Sector valuation of $3,498).</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-forest-800 border border-forest-700">
            <h4 className="font-bold text-limeAccent text-sm">3. Human Review Requirement</h4>
            <p>No AI-generated impact report may be published to donors or public ledgers without affirmative sign-off from an authorized NGO coordinator.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-forest-800 border border-forest-700">
            <h4 className="font-bold text-limeAccent text-sm">4. Zero Fabrication Guarantee</h4>
            <p>We do not fabricate synthetic beneficiaries, fake tree counts, or bogus meals to make dashboards look fuller. Honest numbers always come first.</p>
          </div>
        </div>
      </div>

      {/* Evidence Hierarchy Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-forest">The ImpactSphere Evidence Hierarchy</h3>
        <p className="text-xs text-stone-600">How we verify claims before releasing them to the public impact ledger.</p>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-start space-x-3">
            <span className="font-bold text-emerald-800 bg-emerald-200 px-2.5 py-1 rounded-lg text-[10px]">Tier 1 (Gold)</span>
            <div>
              <div className="font-bold text-emerald-950">GPS Check-in + Supervisor Digital Key</div>
              <div className="text-emerald-800 mt-0.5">Physical check-in within geo-fenced coordinates confirmed by on-site project arborist or clinic lead.</div>
            </div>
          </div>

          <div className="p-4 bg-warmIvory rounded-2xl border border-warmIvory-300 flex items-start space-x-3">
            <span className="font-bold text-forest bg-warmIvory-300 px-2.5 py-1 rounded-lg text-[10px]">Tier 2 (Silver)</span>
            <div>
              <div className="font-bold text-forest">Photo Audit & Countersigned Field Roster</div>
              <div className="text-stone-600 mt-0.5">Timestamped group photo evidence and physical paper roster uploaded with coordinator accession signature.</div>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start space-x-3">
            <span className="font-bold text-stone-700 bg-stone-200 px-2.5 py-1 rounded-lg text-[10px]">Tier 3 (Provisional)</span>
            <div>
              <div className="font-bold text-stone-900">Volunteer Self-Report</div>
              <div className="text-stone-500 mt-0.5">Logged by volunteer but pending coordinator review; clearly marked as provisional in dashboard.</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-3">
        <button
          onClick={() => navigate('/opportunities')}
          className="px-6 py-3 bg-primaryGreen hover:bg-primaryGreen-light text-white text-xs font-bold rounded-2xl transition-all shadow-sm"
        >
          Explore Verified Causes Now →
        </button>
      </div>
    </div>
  );
};
