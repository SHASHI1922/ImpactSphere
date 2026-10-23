import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Cause } from '../types';
import { Search, Globe, Users, Clock, ArrowRight, Filter, Sparkles } from 'lucide-react';

export const CausesPage: React.FC = () => {
  const { navigate } = useApp();
  const [causes, setCauses] = useState<Cause[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCauses() {
      try {
        const data = await api.getCauses();
        setCauses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCauses();
  }, []);

  const categories = ['All', 'Environment', 'Education', 'Food Security', 'Social Inclusion'];

  const filteredCauses = causes.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sdg_goal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primaryGreen/10 text-primaryGreen text-xs font-bold">
          <Globe className="w-3.5 h-3.5" />
          <span>United Nations Sustainable Development Goals</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest">Social Cause Directory</h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          Explore transparent, verified causes aligned with global SDG goals. Every initiative listed is backed by audited non-profit partnerships and active community operations.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white rounded-3xl border border-stone-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search causes by title, keyword, or SDG goal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:border-primaryGreen focus:ring-1 focus:ring-primaryGreen outline-none"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-forest text-warmIvory'
                  : 'bg-warmIvory text-stone-700 hover:bg-warmIvory-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cause Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-stone-200/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredCauses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <p className="text-sm font-bold text-stone-700">No causes match your query.</p>
          <p className="text-xs text-stone-500">Try adjusting your keyword filter or select 'All'.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-forest text-warmIvory text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCauses.map((cause) => (
            <div
              key={cause.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={cause.image_url}
                  alt={cause.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-limeAccent/90 text-forest-900 text-[11px] font-bold mb-1">
                    {cause.sdg_goal}
                  </div>
                  <h3 className="text-xl font-bold">{cause.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 leading-relaxed">
                  {cause.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 p-3.5 bg-warmIvory rounded-2xl border border-warmIvory-300 text-center">
                  <div>
                    <div className="text-sm font-black text-forest">{cause.active_opportunities_count}</div>
                    <div className="text-[10px] text-stone-500 font-medium">Open Roles</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-forest">{cause.volunteers_engaged}</div>
                    <div className="text-[10px] text-stone-500 font-medium">Volunteers</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-primaryGreen">{cause.verified_hours}</div>
                    <div className="text-[10px] text-stone-500 font-medium">Verified Hours</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-medium">
                    Category: <strong className="text-stone-800">{cause.category}</strong>
                  </span>
                  <button
                    onClick={() => navigate('/opportunities')}
                    className="px-4 py-2 bg-primaryGreen hover:bg-primaryGreen-light text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
                  >
                    <span>View Opportunities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
