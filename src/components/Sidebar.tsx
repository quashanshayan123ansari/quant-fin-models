import React from 'react';
import {
  TrendingUp,
  Dices,
  GitFork,
  ShieldAlert,
  Zap,
  PieChart,
  Layers,
  Cpu,
  RefreshCw,
  Waves,
  Landmark,
  Smile,
  Network,
  LineChart,
  Boxes,
  Sliders,
  Sparkles,
  Building,
  BrainCircuit,
  Scale
} from 'lucide-react';

export interface ModelMetadata {
  id: string;
  name: string;
  category: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}

export const ALL_MODELS: ModelMetadata[] = [
  // Derivatives & Options
  { id: 'black-scholes', name: 'Black-Scholes Model', category: 'Derivatives & Options', icon: TrendingUp, description: 'Analytical European Call/Put pricing & implied volatility solver' },
  { id: 'binomial-tree', name: 'Binomial Tree Model', category: 'Derivatives & Options', icon: GitFork, description: 'CRR discrete lattice tree for European & American options' },
  { id: 'option-greeks', name: 'Option Greeks Visualizer', category: 'Derivatives & Options', icon: Sparkles, description: 'Delta, Gamma, Vega, Theta & Rho sensitivity curves' },
  { id: 'heston-model', name: 'Heston Stochastic Volatility', category: 'Derivatives & Options', icon: Waves, description: 'Option pricing under mean-reverting CIR variance process' },
  { id: 'sabr-model', name: 'SABR Volatility Model', category: 'Derivatives & Options', icon: Smile, description: 'Forward implied volatility smile & skew Hagan expansion' },

  // Risk & Credit
  { id: 'value-at-risk', name: 'Value at Risk (VaR)', category: 'Risk & Credit', icon: ShieldAlert, description: 'Parametric, Historical & Monte Carlo VaR with Expected Shortfall' },
  { id: 'merton-credit', name: 'Merton Credit Risk Model', category: 'Risk & Credit', icon: Building, description: 'Structural firm asset default probability & distance to default' },
  { id: 'copula-models', name: 'Copula Risk Models', category: 'Risk & Credit', icon: Network, description: 'Gaussian & Student-t Copula joint tail default dependency' },

  // Volatility & Stochastic
  { id: 'monte-carlo', name: 'Monte Carlo Simulation', category: 'Volatility & Stochastic', icon: Dices, description: 'Geometric Brownian Motion path generator & price distributions' },
  { id: 'garch-volatility', name: 'GARCH(1,1) Volatility', category: 'Volatility & Stochastic', icon: Zap, description: 'Conditional volatility clustering estimation & 10-day forecast' },
  { id: 'vasicek-rate', name: 'Vasicek Short Rate Model', category: 'Volatility & Stochastic', icon: Landmark, description: 'Mean-reverting Ornstein-Uhlenbeck short rate & zero bond curve' },

  // Asset Pricing & Allocation
  { id: 'capm-model', name: 'CAPM Model', category: 'Asset Allocation', icon: PieChart, description: 'Capital Asset Pricing Model & Security Market Line (SML)' },
  { id: 'factor-models', name: 'Fama-French Factor Models', category: 'Asset Allocation', icon: Layers, description: 'Multi-factor 3-Factor (Market, SMB, HML) expected return solver' },
  { id: 'portfolio-opt', name: 'Portfolio Optimization', category: 'Asset Allocation', icon: Sliders, description: 'Markowitz Efficient Frontier & Max Sharpe tangency allocation' },
  { id: 'risk-parity', name: 'Risk Parity Model', category: 'Asset Allocation', icon: Scale, description: 'Equal Risk Contribution (ERC) volatility allocation solver' },

  // Time Series & Signal Processing
  { id: 'arima-forecasting', name: 'ARIMA Forecasting', category: 'Time Series & ML', icon: LineChart, description: 'ARIMA time series model point & confidence interval forecast' },
  { id: 'kalman-filter', name: 'Kalman Filter Pairs', category: 'Time Series & ML', icon: Cpu, description: 'Recursive state space dynamic hedge ratio & z-score tracking' },
  { id: 'hmm-regimes', name: 'Hidden Markov Model', category: 'Time Series & ML', icon: RefreshCw, description: 'Multi-state market regime switching (Bull/Bear/Volatile) decoder' },
  { id: 'pca-analysis', name: 'Principal Component (PCA)', category: 'Time Series & ML', icon: Boxes, description: 'Yield curve & return factor decomposition (Level, Slope, Curvature)' },

  // Machine Learning
  { id: 'ml-alpha', name: 'ML Alpha Models', category: 'Time Series & ML', icon: BrainCircuit, description: 'Random Forest multi-feature alpha signals & cumulative backtest' },
];

interface SidebarProps {
  activeModelId: string;
  setActiveModelId: (id: string) => void;
  searchQuery: string;
  selectedCategory: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModelId,
  setActiveModelId,
  searchQuery,
  selectedCategory
}) => {
  const filteredModels = ALL_MODELS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(ALL_MODELS.map(m => m.category)));

  return (
    <aside className="w-full md:w-80 bg-slate-950/90 border-r border-slate-800 flex flex-col h-[calc(100vh-57px)] sticky top-[57px]">
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>QUANT MODEL CATALOG</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">{filteredModels.length} / 20</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {categories.map((cat) => {
          const catModels = filteredModels.filter(m => m.category === cat);
          if (catModels.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                {cat}
              </div>
              {catModels.map((m) => {
                const Icon = m.icon;
                const isActive = m.id === activeModelId;

                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModelId(m.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition group ${
                      isActive
                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-white shadow-sm shadow-cyan-500/10'
                        : 'hover:bg-slate-900 border border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md mt-0.5 transition ${
                      isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-medium truncate ${isActive ? 'text-cyan-300 font-semibold' : ''}`}>
                        {m.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                        {m.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}

        {filteredModels.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            No models found matching "{searchQuery}"
          </div>
        )}
      </div>
    </aside>
  );
};
