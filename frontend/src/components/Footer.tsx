import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="bg-forest-900 text-stone-300 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-limeAccent border border-forest-700">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">ImpactSphere AI</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              "Turn compassion into measurable impact." Connecting dedicated volunteers with verified social causes,
              giving non-profits verifiable tools, and transforming field records into transparent reports.
            </p>
            <div className="flex items-center space-x-2 text-xs text-limeAccent font-medium">
              <CheckCircle2 className="w-4 h-4 text-limeAccent" />
              <span>Verifiable Field Records</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore Causes</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('/causes')} className="hover:text-limeAccent transition-colors">
                  Climate Action & Rewilding
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/causes')} className="hover:text-limeAccent transition-colors">
                  Youth STEM & Digital Equity
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/causes')} className="hover:text-limeAccent transition-colors">
                  Food Security & Rescue
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/causes')} className="hover:text-limeAccent transition-colors">
                  Intergenerational Care
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform Hubs</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('/opportunities')} className="hover:text-limeAccent transition-colors">
                  Volunteering Opportunities
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-limeAccent transition-colors">
                  Volunteer Profile & Hours
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/impact')} className="hover:text-limeAccent transition-colors">
                  Verified Impact Ledger
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/assistant')} className="hover:text-limeAccent transition-colors">
                  Grounded AI Assistant
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/ngo')} className="hover:text-limeAccent transition-colors">
                  NGO Operations & Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Responsible AI & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Responsible Impact</h4>
            <div className="bg-forest-800/80 p-3.5 rounded-xl border border-forest-700 text-xs space-y-2">
              <div className="flex items-center space-x-1.5 text-limeAccent font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Hallucination Pledge</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-normal">
                Our AI generates impact narratives strictly from verified supervisor check-ins.
                We never fabricate beneficiaries, hours, or outcomes.
              </p>
            </div>
            <div className="flex items-center space-x-4 pt-1 text-xs text-stone-400">
              <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About & Ethics</button>
              <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact Support</button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-forest-800 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} ImpactSphere AI. Built with precision for non-profit transparency and community empowerment.</p>
        </div>
      </div>
    </footer>
  );
};
