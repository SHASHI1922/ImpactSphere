import React, { useState } from 'react';
import { useApp, UserRole } from '../context/AppContext';
import {
  Globe, ShieldCheck, HeartHandshake, User, Building2,
  Sparkles, Menu, X, ArrowRight, BarChart3, HelpCircle, Mail
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activePath, navigate, role, setRole, addToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Discover', path: '/' },
    { name: 'Causes', path: '/causes' },
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Impact Ledger', path: '/impact' },
    { name: 'AI Assistant', path: '/assistant', badge: 'AI' },
    { name: 'Volunteer Hub', path: '/dashboard' },
    { name: 'NGO Workspace', path: '/ngo' },
  ];

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setRoleMenuOpen(false);
    const roleLabels = {
      volunteer: 'Switched to Volunteer (Alex Chen)',
      ngo: 'Switched to NGO Coordinator (Elena Vance — GreenCanopy)',
      admin: 'Switched to Platform Auditor (Auditor Rachel)'
    };
    addToast({
      type: 'info',
      title: 'Persona Changed',
      message: roleLabels[newRole]
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-warmIvory/90 backdrop-blur-md border-b border-warmIvory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-11 h-11 rounded-2xl bg-forest flex items-center justify-center text-limeAccent shadow-md transition-transform group-hover:scale-105 border border-forest-700">
              <Globe className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-forest">ImpactSphere</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-limeAccent/60 text-forest-900 rounded-md border border-limeAccent">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">Turn compassion into measurable impact</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = activePath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-forest text-warmIvory shadow-sm'
                      : 'text-stone-700 hover:text-forest hover:bg-warmIvory-200'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isActive ? 'bg-limeAccent text-forest-900' : 'bg-primaryGreen/15 text-primaryGreen-dark'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action & Role Switcher */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-warmIvory-300 bg-white hover:border-primaryGreen/50 text-xs font-semibold shadow-sm transition-all text-stone-800"
                title="Switch demo persona to test Volunteer, NGO, or Admin permissions"
              >
                <div className={`w-2 h-2 rounded-full ${
                  role === 'admin' ? 'bg-purple-600' : role === 'ngo' ? 'bg-amber-500' : 'bg-primaryGreen'
                }`} />
                <span className="capitalize text-stone-500 text-[11px]">Role:</span>
                <span className="font-bold text-forest">
                  {role === 'admin' ? 'Admin' : role === 'ngo' ? 'NGO Lead' : 'Volunteer'}
                </span>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[11px] font-bold text-stone-400 px-3 py-1.5 uppercase tracking-wider">
                    Simulate Perspective
                  </div>
                  <button
                    onClick={() => handleRoleChange('volunteer')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-2.5 transition-colors ${
                      role === 'volunteer' ? 'bg-primaryGreen/10 text-primaryGreen-dark font-bold' : 'hover:bg-warmIvory text-stone-700'
                    }`}
                  >
                    <User className="w-4 h-4 text-primaryGreen" />
                    <div>
                      <div className="font-bold">Volunteer (Alex Chen)</div>
                      <div className="text-[10px] text-stone-500">Match causes, log hours, apply</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleChange('ngo')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-2.5 transition-colors ${
                      role === 'ngo' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-warmIvory text-stone-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-bold">NGO Coordinator (Elena)</div>
                      <div className="text-[10px] text-stone-500">Review apps, log attendance, report</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-2.5 transition-colors ${
                      role === 'admin' ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-warmIvory text-stone-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-bold">Auditor (Rachel)</div>
                      <div className="text-[10px] text-stone-500">Approve NGOs, review audit logs</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Match CTA */}
            <button
              onClick={() => navigate('/opportunities')}
              className="px-4 py-2 rounded-xl bg-primaryGreen hover:bg-primaryGreen-light text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 hover:shadow-md"
            >
              <span>Find Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-warmIvory-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                activePath === link.path ? 'bg-forest text-warmIvory' : 'text-stone-800 hover:bg-warmIvory'
              }`}
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-limeAccent text-forest-900 font-bold">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-3 border-t border-stone-100 flex flex-col space-y-2">
            <div className="text-xs text-stone-500 font-medium px-2">Switch Active Persona:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { handleRoleChange('volunteer'); setMobileMenuOpen(false); }}
                className={`py-2 px-1 text-xs rounded-lg font-bold border text-center ${
                  role === 'volunteer' ? 'bg-primaryGreen text-white border-primaryGreen' : 'border-stone-200 text-stone-700'
                }`}
              >
                Volunteer
              </button>
              <button
                onClick={() => { handleRoleChange('ngo'); setMobileMenuOpen(false); }}
                className={`py-2 px-1 text-xs rounded-lg font-bold border text-center ${
                  role === 'ngo' ? 'bg-amber-600 text-white border-amber-600' : 'border-stone-200 text-stone-700'
                }`}
              >
                NGO Lead
              </button>
              <button
                onClick={() => { handleRoleChange('admin'); setMobileMenuOpen(false); }}
                className={`py-2 px-1 text-xs rounded-lg font-bold border text-center ${
                  role === 'admin' ? 'bg-purple-600 text-white border-purple-600' : 'border-stone-200 text-stone-700'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
