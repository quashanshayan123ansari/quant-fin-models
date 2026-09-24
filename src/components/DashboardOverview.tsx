import React, { useState } from 'react';
import {
  ALL_MODELS,
  ModelMetadata
} from './Sidebar';
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Cpu,
  Activity,
  ShieldAlert,
  TrendingUp,
  Dices,
  CheckCircle2,
  Grid,
  ListFilter,
  Box,
  Eye,
  Zap
} from 'lucide-react';
import { TiltCard } from './TiltCard';
import { Quant3DScene } from './Quant3DScene';

interface DashboardOverviewProps {
  onSelectModel: (modelId: string) => void;
  onOpenReadme: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onSelectModel,
  onOpenReadme
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('All');
  const [viewLayout, setViewLayout] = useState<'grid' | 'compact' | '3d-stage'>('grid');
  const [active3DSurface, setActive3DSurface] = useState<'heston' | 'black-scholes' | 'vasicek' | 'sabr'>('heston');

  const categories = [
    'All',
    'Derivatives & Options',
    'Risk & Credit',
    'Volatility & Stochastic',
    'Asset Allocation',
    'Time Series & ML'
  ];

  const complexities = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Filter models based on search, category, complexity
  const filteredModels = ALL_MODELS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.modelType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'All' || m.complexity === selectedComplexity;

    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Derivatives & Options':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Risk & Credit':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Volatility & Stochastic':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Asset Allocation':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Time Series & ML':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getComplexityBadge = (complexity: string) => {
    switch (complexity) {
      case 'Beginner':
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">BEGINNER</span>;
      case 'Intermediate':
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">INTERMEDIATE</span>;
      case 'Advanced':
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">ADVANCED</span>;
      case 'Expert':
        return <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">EXPERT</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-8">
      {/* Top Hero Banner with 3D Surface Stage Preview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
                <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                QUANTITATIVE 3D MODEL SUITE v2.4
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700">
                20 Interactive Engines
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewLayout(viewLayout === '3d-stage' ? 'grid' : '3d-stage')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition border shadow-lg ${
                  viewLayout === '3d-stage'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Box className="w-4 h-4 text-cyan-400" />
                <span>{viewLayout === '3d-stage' ? 'Back to 3D Cards' : 'Interactive 3D Volatility Stage'}</span>
              </button>

              <button
                onClick={onOpenReadme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Docs</span>
              </button>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              Algorithmic Finance &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">3D Volatility Surface Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Explore 3D interactive volatility manifolds, stochastic interest rate surfaces, and real-time PDE solvers with perspective-tilt cards and live WebGL rendering.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">Derivatives</div>
                <div className="text-lg font-bold text-white font-mono">5 Models</div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">Risk &amp; Credit</div>
                <div className="text-lg font-bold text-white font-mono">3 Models</div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Dices className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">Stochastics</div>
                <div className="text-lg font-bold text-white font-mono">3 Models</div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">ML &amp; Time Series</div>
                <div className="text-lg font-bold text-white font-mono">5 Models</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Volatility Stage Mode View */}
      {viewLayout === '3d-stage' && (
        <div className="space-y-4">
          <Quant3DScene surfaceType={active3DSurface} height={480} interactive={true} />
        </div>
      )}

      {/* Filter Tabs & Search Bar Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Rectangular Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => {
              const count = cat === 'All' ? ALL_MODELS.length : ALL_MODELS.filter((m) => m.category === cat).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                      isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search model, formula, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sub-Filters: Complexity & Layout Toggle */}
        <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3 font-mono">
          <div className="flex items-center gap-2 text-slate-400 overflow-x-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Complexity Level:</span>
            {complexities.map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedComplexity(comp)}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedComplexity === comp
                    ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded transition ${
                viewLayout === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="3D Tilt Grid Cards"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('compact')}
              className={`p-1.5 rounded transition ${
                viewLayout === 'compact' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Compact View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('3d-stage')}
              className={`p-1.5 rounded transition ${
                viewLayout === '3d-stage' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Interactive 3D Surface Stage"
            >
              <Box className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Rectangular 3D Tilt Model Cards Grid */}
      {viewLayout !== 'compact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => {
            const Icon = model.icon;
            const badgeClass = getCategoryBadgeClass(model.category);

            return (
              <TiltCard
                key={model.id}
                onClick={() => onSelectModel(model.id)}
                glowColor={model.badgeColor}
              >
                {/* Top Badge Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 shadow-inner">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                          {model.category}
                        </span>
                      </div>
                    </div>
                    {getComplexityBadge(model.complexity)}
                  </div>

                  {/* Title & Engine Type */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-sans flex items-center gap-2">
                      {model.name}
                    </h3>
                    <p className="text-[11px] font-mono text-cyan-400/80 mt-0.5">
                      [{model.modelType}]
                    </p>
                  </div>

                  {/* Brief Description */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {model.description}
                  </p>

                  {/* Formula Preview Box */}
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 font-mono text-[11px] text-slate-300 truncate">
                    <span className="text-slate-500 mr-2 text-[10px] uppercase font-bold">Equation:</span>
                    <span className="text-cyan-300 font-semibold">{model.formulaSnippet}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {model.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Ready to Simulate
                  </span>
                  <div className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Open Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      )}

      {/* Compact Matrix Layout */}
      {viewLayout === 'compact' && (
        <div className="space-y-2">
          {filteredModels.map((model) => {
            const Icon = model.icon;
            const badgeClass = getCategoryBadgeClass(model.category);

            return (
              <div
                key={model.id}
                onClick={() => onSelectModel(model.id)}
                className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-950 text-cyan-400 border border-slate-800">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 truncate font-sans">
                        {model.name}
                      </h3>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${badgeClass}`}>
                        {model.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{model.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                  <div className="hidden lg:block bg-slate-950 px-3 py-1 rounded text-cyan-300 border border-slate-800 text-[11px]">
                    {model.formulaSnippet}
                  </div>
                  {getComplexityBadge(model.complexity)}
                  <button className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform text-xs font-semibold">
                    <span>Run</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredModels.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
          <Search className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No quantitative models found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search terms or filter selection.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedComplexity('All');
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 border border-slate-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
