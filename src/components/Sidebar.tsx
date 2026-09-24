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
  Scale,
  LayoutDashboard
} from 'lucide-react';

export interface ModelMetadata {
  id: string;
  name: string;
  category: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  tags: string[];
  formulaSnippet: string;
  modelType: string;
  badgeColor: 'cyan' | 'green' | 'amber' | 'violet' | 'rose' | 'blue';
}

export const ALL_MODELS: ModelMetadata[] = [
  // Derivatives & Options
  {
    id: 'black-scholes',
    name: 'Black-Scholes Model',
    category: 'Derivatives & Options',
    icon: TrendingUp,
    description: 'Analytical European Call/Put pricing & implied volatility solver via continuous-time PDE.',
    complexity: 'Intermediate',
    tags: ['Option Pricing', 'PDE Engine', 'Implied Vol', 'Greeks'],
    formulaSnippet: 'C = S₀ N(d₁) - K e⁻ʳᵀ N(d₂)',
    modelType: 'Continuous PDE Solver',
    badgeColor: 'cyan'
  },
  {
    id: 'binomial-tree',
    name: 'Binomial Tree Model',
    category: 'Derivatives & Options',
    icon: GitFork,
    description: 'Cox-Ross-Rubinstein discrete lattice tree for American & European option early exercise.',
    complexity: 'Beginner',
    tags: ['American Options', 'Discrete Lattice', 'Early Exercise'],
    formulaSnippet: 'u = e^{σ√Δt}, d = e^{-σ√Δt}, p = (e^{rΔt}-d)/(u-d)',
    modelType: 'Discrete Lattice Engine',
    badgeColor: 'blue'
  },
  {
    id: 'option-greeks',
    name: 'Option Greeks Visualizer',
    category: 'Derivatives & Options',
    icon: Sparkles,
    description: 'Delta, Gamma, Vega, Theta & Rho sensitivity surface curves and dynamic hedging ratios.',
    complexity: 'Intermediate',
    tags: ['Risk Sensitivity', 'Hedging', 'Delta Neutral', 'Vega Risk'],
    formulaSnippet: 'Δ = ∂C/∂S, Γ = ∂²C/∂S², ν = ∂C/∂σ',
    modelType: 'Sensitivity Matrix',
    badgeColor: 'cyan'
  },
  {
    id: 'heston-model',
    name: 'Heston Stochastic Volatility',
    category: 'Derivatives & Options',
    icon: Waves,
    description: 'Option pricing under mean-reverting Cox-Ingersoll-Ross (CIR) stochastic variance process.',
    complexity: 'Advanced',
    tags: ['Stochastic Vol', 'Mean Reversion', 'CIR Process', 'Vol Skew'],
    formulaSnippet: 'dv_t = κ(θ - v_t)dt + ξ√v_t dW_t',
    modelType: 'Stochastic SDE Solver',
    badgeColor: 'violet'
  },
  {
    id: 'sabr-model',
    name: 'SABR Volatility Model',
    category: 'Derivatives & Options',
    icon: Smile,
    description: 'Forward implied volatility smile & skew calibration via Hagan asymptotic expansion.',
    complexity: 'Expert',
    tags: ['Vol Smile', 'Hagan Expansion', 'Interest Rates', 'Swaptions'],
    formulaSnippet: 'dF_t = σ_t F_t^β dW_t¹, dσ_t = ν σ_t dW_t²',
    modelType: 'Asymptotic Expansion',
    badgeColor: 'amber'
  },

  // Risk & Credit
  {
    id: 'value-at-risk',
    name: 'Value at Risk (VaR)',
    category: 'Risk & Credit',
    icon: ShieldAlert,
    description: 'Parametric Gaussian, Historical & Monte Carlo VaR with Expected Shortfall (CVaR).',
    complexity: 'Intermediate',
    tags: ['Tail Risk', 'Expected Shortfall', 'Monte Carlo', 'Portfolio Risk'],
    formulaSnippet: 'VaR_α = μ - Z_α · σ, CVaR_α = E[L | L > VaR]',
    modelType: 'Risk Control Engine',
    badgeColor: 'rose'
  },
  {
    id: 'merton-credit',
    name: 'Merton Credit Risk Model',
    category: 'Risk & Credit',
    icon: Building,
    description: 'Structural firm asset valuation, default probability & distance to default metric.',
    complexity: 'Advanced',
    tags: ['Structural Credit', 'Default Probability', 'Corporate Debt'],
    formulaSnippet: 'DD = [ln(V_A/D) + (r - 0.5σ_A²)T] / (σ_A √T)',
    modelType: 'Structural Option Engine',
    badgeColor: 'amber'
  },
  {
    id: 'copula-models',
    name: 'Copula Risk Models',
    category: 'Risk & Credit',
    icon: Network,
    description: 'Gaussian & Student-t Copula for multivariate joint tail default dependency & CDO pricing.',
    complexity: 'Expert',
    tags: ['Joint Tail Risk', 'Gaussian Copula', 'CDO Pricing', 'Correlation'],
    formulaSnippet: 'C(u₁, u₂) = Φ_Σ(Φ⁻¹(u₁), Φ⁻¹(u₂))',
    modelType: 'Multivariate Dependency',
    badgeColor: 'rose'
  },

  // Volatility & Stochastic
  {
    id: 'monte-carlo',
    name: 'Monte Carlo Simulation',
    category: 'Volatility & Stochastic',
    icon: Dices,
    description: 'Geometric Brownian Motion (GBM) path generator & terminal payoff probability distribution.',
    complexity: 'Intermediate',
    tags: ['GBM', 'Path Simulation', 'Distribution', 'Confidence Intervals'],
    formulaSnippet: 'S_t = S₀ exp((r - σ²/2)t + σ √t Z_t)',
    modelType: 'Stochastic Path Generator',
    badgeColor: 'cyan'
  },
  {
    id: 'garch-volatility',
    name: 'GARCH(1,1) Volatility',
    category: 'Volatility & Stochastic',
    icon: Zap,
    description: 'Time series volatility clustering estimation, conditional variance & 60-day forecasting.',
    complexity: 'Advanced',
    tags: ['Vol Clustering', 'Heteroskedasticity', 'Time Series', 'Forecast'],
    formulaSnippet: 'σ_t² = ω + α ε_{t-1}² + β σ_{t-1}²',
    modelType: 'Econometric Time Series',
    badgeColor: 'amber'
  },
  {
    id: 'vasicek-rate',
    name: 'Vasicek Short Rate Model',
    category: 'Volatility & Stochastic',
    icon: Landmark,
    description: 'Mean-reverting Ornstein-Uhlenbeck short rate term structure & zero-coupon bond curve.',
    complexity: 'Advanced',
    tags: ['Short Rate', 'Yield Curve', 'Mean Reversion', 'Bond Pricing'],
    formulaSnippet: 'dr_t = a(b - r_t)dt + σ dW_t',
    modelType: 'Term Structure SDE',
    badgeColor: 'green'
  },

  // Asset Pricing & Allocation
  {
    id: 'capm-model',
    name: 'CAPM Model',
    category: 'Asset Allocation',
    icon: PieChart,
    description: 'Capital Asset Pricing Model & Security Market Line (SML) expected return evaluation.',
    complexity: 'Beginner',
    tags: ['Systematic Risk', 'Beta', 'SML Curve', 'Cost of Capital'],
    formulaSnippet: 'E[R_i] = R_f + β_i (E[R_m] - R_f)',
    modelType: 'Single Factor Equilibrium',
    badgeColor: 'blue'
  },
  {
    id: 'factor-models',
    name: 'Fama-French Factor Models',
    category: 'Asset Allocation',
    icon: Layers,
    description: 'Multi-factor model decomposing returns across Market, Size (SMB), and Value (HML) factors.',
    complexity: 'Intermediate',
    tags: ['Fama-French', 'SMB', 'HML', 'Alpha Attribution'],
    formulaSnippet: 'R_i - R_f = α_i + β₁ MKT + β₂ SMB + β₃ HML',
    modelType: 'Multivariate Regression',
    badgeColor: 'violet'
  },
  {
    id: 'portfolio-opt',
    name: 'Portfolio Optimization',
    category: 'Asset Allocation',
    icon: Sliders,
    description: 'Markowitz Efficient Frontier & Max Sharpe tangency allocation solver with quadratic constraints.',
    complexity: 'Advanced',
    tags: ['Markowitz', 'Efficient Frontier', 'Sharpe Ratio', 'Quadratic Opt'],
    formulaSnippet: 'max_w (wᵀ μ - R_f) / √(wᵀ Σ w)',
    modelType: 'Convex Quadratic Engine',
    badgeColor: 'green'
  },
  {
    id: 'risk-parity',
    name: 'Risk Parity Model',
    category: 'Asset Allocation',
    icon: Scale,
    description: 'Equal Risk Contribution (ERC) portfolio allocation solver for balanced volatility exposure.',
    complexity: 'Advanced',
    tags: ['ERC', 'Risk Budgeting', 'Volatility Allocation', 'Equal Risk'],
    formulaSnippet: 'RC_i = w_i (Σ w)_i / √(wᵀ Σ w) = σ_p / N',
    modelType: 'Risk Allocation Engine',
    badgeColor: 'cyan'
  },

  // Time Series & Signal Processing
  {
    id: 'arima-forecasting',
    name: 'ARIMA Forecasting',
    category: 'Time Series & ML',
    icon: LineChart,
    description: 'Autoregressive Integrated Moving Average point forecast & 95% confidence bounds.',
    complexity: 'Intermediate',
    tags: ['Auto-Regressive', 'Moving Average', 'Stationarity', 'Point Forecast'],
    formulaSnippet: '(1 - ∑ ϕ_i L^i)(1 - L)^d X_t = (1 + ∑ θ_j L^j) ε_t',
    modelType: 'Box-Jenkins Model',
    badgeColor: 'blue'
  },
  {
    id: 'kalman-filter',
    name: 'Kalman Filter Pairs',
    category: 'Time Series & ML',
    icon: Cpu,
    description: 'Recursive state space dynamic hedge ratio (β_t) & z-score tracking for statistical arbitrage.',
    complexity: 'Expert',
    tags: ['State Space', 'Pairs Trading', 'Dynamic Beta', 'StatArb'],
    formulaSnippet: 'θ_{t|t} = θ_{t|t-1} + K_t (y_t - x_tᵀ θ_{t|t-1})',
    modelType: 'Recursive State Space',
    badgeColor: 'violet'
  },
  {
    id: 'hmm-regimes',
    name: 'Hidden Markov Model',
    category: 'Time Series & ML',
    icon: RefreshCw,
    description: 'Multi-state market regime switching (Bull / Bear / High Volatility) probability decoder.',
    complexity: 'Expert',
    tags: ['Regime Switching', 'Markov Chain', 'Baum-Welch', 'Viterbi'],
    formulaSnippet: 'P(S_t = j | S_{t-1} = i) = A_{ij}',
    modelType: 'Probabilistic State Engine',
    badgeColor: 'rose'
  },
  {
    id: 'pca-analysis',
    name: 'Principal Component (PCA)',
    category: 'Time Series & ML',
    icon: Boxes,
    description: 'Yield curve & equity return factor decomposition into Level, Slope, and Curvature modes.',
    complexity: 'Intermediate',
    tags: ['Eigenvalues', 'Yield Curve Shift', 'Factor Reduction'],
    formulaSnippet: 'Σ v_i = λ_i v_i, X_{reduced} = X V_k',
    modelType: 'Dimensionality Reduction',
    badgeColor: 'cyan'
  },
  {
    id: 'ml-alpha',
    name: 'ML Alpha Models',
    category: 'Time Series & ML',
    icon: BrainCircuit,
    description: 'Random Forest multi-feature alpha signals & cumulative backtest strategy curve generator.',
    complexity: 'Expert',
    tags: ['Random Forest', 'Feature Importance', 'Alpha Signal', 'Backtesting'],
    formulaSnippet: 'ŷ_t = f_{RF}(RSI_t, MACD_t, Vol_t), Signal = sign(ŷ_t)',
    modelType: 'Supervised Machine Learning',
    badgeColor: 'green'
  }
];

interface SidebarProps {
  activeModelId: string;
  setActiveModelId: (id: string) => void;
  searchQuery: string;
  selectedCategory: string;
  onReturnToDashboard?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModelId,
  setActiveModelId,
  searchQuery,
  selectedCategory,
  onReturnToDashboard
}) => {
  const filteredModels = ALL_MODELS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(ALL_MODELS.map((m) => m.category)));

  return (
    <aside className="w-full md:w-80 bg-slate-950/90 border-r border-slate-800 flex flex-col h-[calc(100vh-57px)] sticky top-[57px]">
      {/* Return to Dashboard Button */}
      {onReturnToDashboard && (
        <div className="p-3 border-b border-slate-800 bg-slate-900/60">
          <button
            onClick={onReturnToDashboard}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold transition shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            <span>← Front Dashboard Overview</span>
          </button>
        </div>
      )}

      <div className="p-3 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>MODEL CATALOG</span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
          {filteredModels.length} / {ALL_MODELS.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {categories.map((cat) => {
          const catModels = filteredModels.filter((m) => m.category === cat);
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
                    <div
                      className={`p-1.5 rounded-md mt-0.5 transition ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
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
