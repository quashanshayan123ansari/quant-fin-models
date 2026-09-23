import React from 'react';
import { Search, BookOpen, Activity, Cpu, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenReadme: () => void;
  categories: string[];
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenReadme,
  categories
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand & Status */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white font-mono">QUANT<span className="text-cyan-400">LABS</span></h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">v2.4 PRO</span>
            </div>
            <p className="text-xs text-slate-400">Quantitative Financial Engineering Engine</p>
          </div>
        </div>

        {/* Quick Ticker Mock */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono ml-6 pl-6 border-l border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">S&P 500</span>
            <span className="text-emerald-400 font-medium">5,842.10</span>
            <span className="text-emerald-400 text-[10px]">+0.42%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">VIX</span>
            <span className="text-amber-400 font-medium">14.85</span>
            <span className="text-amber-400 text-[10px]">-1.20%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">US10Y</span>
            <span className="text-cyan-400 font-medium">3.74%</span>
          </div>
        </div>
      </div>

      {/* Search & Category Navigation */}
      <div className="flex flex-1 items-center justify-center max-w-xl w-full gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search 20 quantitative models (e.g., Black-Scholes, VaR, GARCH, Kalman)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Docs Action */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenReadme}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-medium transition hover:border-cyan-500/40"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Documentation</span>
        </button>
      </div>
    </header>
  );
};
