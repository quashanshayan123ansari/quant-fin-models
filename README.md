# Quantitative Finance Model Suite & Interactive Dashboard 📈

![Quantitative Finance](https://img.shields.io/badge/Domain-Quantitative_Finance-00F0FF?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React_18_|_Vite_|_TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

A state-of-the-art **Quantitative Finance Suite & Interactive Terminal** featuring analytical pricing models, stochastic simulations, volatility modeling, risk management engines, time series forecasting, credit risk frameworks, machine learning alpha signals, and portfolio optimization solvers.

Includes a dynamic, financial dark-terminal Web Dashboard with interactive parameter tabs, live visual charts, LaTeX mathematical equations, and real-time computation engines for **20 essential quantitative finance models**.

---

## 📋 Table of Contents

- [Quantitative Finance Model Suite \& Interactive Dashboard 📈](#quantitative-finance-model-suite--interactive-dashboard-)
  - [📋 Table of Contents](#-table-of-contents)
  - [🚀 Quick Start \& Installation](#-quick-start--installation)
  - [💻 Interactive Dashboard Features](#-interactive-dashboard-features)
  - [📊 Complete Model Documentation (20 Models)](#-complete-model-documentation-20-models)
    - [1. Black-Scholes Model 📈](#1-black-scholes-model-)
    - [2. Monte Carlo Simulation 🎲](#2-monte-carlo-simulation-)
    - [3. Binomial Tree Model (CRR) 🌲](#3-binomial-tree-model-crr-)
    - [4. Value at Risk (VaR \& CVaR) 🛡️](#4-value-at-risk-var--cvar-)
    - [5. GARCH(1,1) Volatility Model ⚡](#5-garch11-volatility-model-)
    - [6. Capital Asset Pricing Model (CAPM) 📊](#6-capital-asset-pricing-model-capm-)
    - [7. Fama-French Multi-Factor Models 🧱](#7-fama-french-multi-factor-models-)
    - [8. Kalman Filter (Dynamic Pairs Trading) 🎯](#8-kalman-filter-dynamic-pairs-trading-)
    - [9. Hidden Markov Model (HMM Regimes) 🔄](#9-hidden-markov-model-hmm-regimes-)
    - [10. Heston Stochastic Volatility Model 🌊](#10-heston-stochastic-volatility-model-)
    - [11. Vasicek Short Rate Model 🏦](#11-vasicek-short-rate-model-)
    - [12. SABR Volatility Model 📉](#12-sabr-volatility-model-)
    - [13. Copula Models (Gaussian \& Student-t) 🔗](#13-copula-models-gaussian--student-t-)
    - [14. ARIMA Time Series Forecasting 🔮](#14-arima-time-series-forecasting-)
    - [15. Principal Component Analysis (PCA) 📐](#15-principal-component-analysis-pca-)
    - [16. Portfolio Optimization (Markowitz MPT) ⚖️](#16-portfolio-optimization-markowitz-mpt-)
    - [17. Option Greeks Visualizer 🧪](#17-option-greeks-visualizer-)
    - [18. Merton Structural Credit Risk Model 🏢](#18-merton-structural-credit-risk-model-)
    - [19. Machine Learning Alpha Models 🤖](#19-machine-learning-alpha-models-)
    - [20. Risk Parity Allocation (Equal Risk Contribution) ⚖️](#20-risk-parity-allocation-equal-risk-contribution-)
  - [📁 Repository Structure](#-repository-structure)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [📜 License \& Citation](#-license--citation)

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**

### Installation Steps

1. **Clone or Navigate to the Workspace**:
   ```bash
   cd "d:\BOOKS\Research Papers\CODES\Quant Finance Model"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Launch Local Interactive Dashboard**:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` (or indicated URL) to access the interactive financial terminal.

---

## 💻 Interactive Dashboard Features

- **20 Dedicated Model Tabs**: Seamlessly switch between derivatives, volatility, risk management, credit risk, and ML models.
- **Real-Time Input Controls**: Sliders & inputs for spot price ($S_0$), strike ($K$), risk-free rate ($r$), volatility ($\sigma$), mean-reversion speed ($\kappa$), correlations, and time horizon ($T$).
- **Interactive Visualizations**: High-contrast dark charts powered by Chart.js featuring option payoffs, price paths, yield curves, efficient frontiers, and volatility smiles.
- **LaTeX Math Formula Renderers**: Step-by-step mathematical derivations and parameter definitions displayed alongside numerical outputs.
- **Export & Code Snippets**: Inspect pure TypeScript & Python underlying calculation functions.

---

## 📊 Complete Model Documentation (20 Models)

### 1. Black-Scholes Model 📈
- **Category**: Derivatives Pricing
- **Description**: The cornerstone closed-form analytical model for European option pricing on non-dividend paying stocks under constant volatility and interest rates.
- **Formula**:
  $$C = S_0 N(d_1) - K e^{-r T} N(d_2)$$
  $$P = K e^{-r T} N(-d_2) - S_0 N(-d_1)$$
  $$d_1 = \frac{\ln(S_0/K) + (r + \sigma^2/2)T}{\sigma \sqrt{T}}, \quad d_2 = d_1 - \sigma \sqrt{T}$$

---

### 2. Monte Carlo Simulation 🎲
- **Category**: Stochastic Simulation
- **Description**: Simulates geometric Brownian motion (GBM) asset price paths to evaluate path-dependent options and complex financial distributions.
- **Formula**:
  $$S_t = S_0 \exp\left( \left(r - \frac{\sigma^2}{2}\right)t + \sigma \sqrt{t} Z_t \right), \quad Z_t \sim \mathcal{N}(0,1)$$

---

### 3. Binomial Tree Model (CRR) 🌲
- **Category**: Derivatives Pricing
- **Description**: Cox-Ross-Rubinstein discrete-time lattice model capable of evaluating American style options with early exercise features.
- **Formula**:
  $$u = e^{\sigma \sqrt{\Delta t}}, \quad d = e^{-\sigma \sqrt{\Delta t}} = \frac{1}{u}, \quad p = \frac{e^{r \Delta t} - d}{u - d}$$

---

### 4. Value at Risk (VaR & CVaR) 🛡️
- **Category**: Risk Management
- **Description**: Quantifies tail risk losses over a given confidence interval ($1-\alpha$) using Parametric, Historical, and Monte Carlo methods, alongside Expected Shortfall (CVaR).
- **Formula**:
  $$\text{VaR}_\alpha = \mu - Z_\alpha \cdot \sigma$$
  $$\text{CVaR}_\alpha = \mathbb{E}[L \mid L \ge \text{VaR}_\alpha] = \mu + \sigma \frac{\phi(Z_\alpha)}{1-\alpha}$$

---

### 5. GARCH(1,1) Volatility Model ⚡
- **Category**: Econometrics & Volatility
- **Description**: Generalized Autoregressive Conditional Heteroskedasticity model capturing volatility clustering and persistent financial time series variance.
- **Formula**:
  $$\sigma_t^2 = \omega + \alpha \epsilon_{t-1}^2 + \beta \sigma_{t-1}^2$$
  $$\text{Unconditional Volatility } \sigma_\infty = \sqrt{\frac{\omega}{1 - \alpha - \beta}}$$

---

### 6. Capital Asset Pricing Model (CAPM) 📊
- **Category**: Asset Pricing
- **Description**: Establishes linear relationship between expected return of an asset and systematic market risk ($\beta$).
- **Formula**:
  $$\mathbb{E}[R_i] = R_f + \beta_i (\mathbb{E}[R_m] - R_f), \quad \beta_i = \frac{\text{Cov}(R_i, R_m)}{\text{Var}(R_m)}$$

---

### 7. Fama-French Multi-Factor Models 🧱
- **Category**: Asset Pricing
- **Description**: Extends CAPM by adding size factor (SMB: Small Minus Big) and value factor (HML: High Minus Low) to explain asset returns.
- **Formula**:
  $$R_{i,t} - R_{f,t} = \alpha_i + \beta_{i1}(R_{m,t} - R_{f,t}) + \beta_{i2} \text{SMB}_t + \beta_{i3} \text{HML}_t + \epsilon_{i,t}$$

---

### 8. Kalman Filter (Dynamic Pairs Trading) 🎯
- **Category**: Signal Processing & Pairs Trading
- **Description**: Recursive state-space model updating dynamic hedge ratios ($\beta_t$) in real-time for cointegrated pairs trading strategies.
- **Formula**:
  $$\theta_{t|t-1} = \theta_{t-1|t-1}, \quad P_{t|t-1} = P_{t-1|t-1} + Q$$
  $$K_t = P_{t|t-1} x_t (x_t^T P_{t|t-1} x_t + R)^{-1}$$
  $$\theta_{t|t} = \theta_{t|t-1} + K_t (y_t - x_t^T \theta_{t|t-1})$$

---

### 9. Hidden Markov Model (HMM Regimes) 🔄
- **Category**: Machine Learning & Time Series
- **Description**: Detects unobserved market regimes (e.g., Bull, Bear, High Volatility) using transition matrices and observation probability distributions.
- **Formula**:
  $$P(S_t = j \mid S_{t-1} = i) = A_{ij}, \quad y_t \mid S_t = k \sim \mathcal{N}(\mu_k, \sigma_k^2)$$

---

### 10. Heston Stochastic Volatility Model 🌊
- **Category**: Derivatives Pricing
- **Description**: Option pricing framework assuming variance follows a mean-reverting Cox-Ingersoll-Ross (CIR) stochastic process correlated with asset price.
- **Formula**:
  $$dS_t = \mu S_t dt + \sqrt{v_t} S_t dW_t^S$$
  $$dv_t = \kappa (\theta - v_t) dt + \xi \sqrt{v_t} dW_t^v, \quad dW_t^S dW_t^v = \rho dt$$

---

### 11. Vasicek Short Rate Model 🏦
- **Category**: Fixed Income & Interest Rates
- **Description**: One-factor mean-reverting Ornstein-Uhlenbeck stochastic model for short-term interest rates and zero-coupon bond pricing.
- **Formula**:
  $$dr_t = a(b - r_t)dt + \sigma dW_t$$

---

### 12. SABR Volatility Model 📉
- **Category**: Volatility Modeling
- **Description**: Stochastic Alpha, Beta, Rho model predicting forward implied volatility smiles and skews in interest rate and FX markets.
- **Formula**:
  $$dF_t = \sigma_t F_t^\beta dW_t^1, \quad d\sigma_t = \nu \sigma_t dW_t^2, \quad dW_t^1 dW_t^2 = \rho dt$$

---

### 13. Copula Models (Gaussian & Student-t) 🔗
- **Category**: Credit & Joint Risk
- **Description**: Models joint multivariate dependency structures independent of marginal distributions, evaluating joint default probability in credit portfolios.
- **Formula**:
  $$C(u_1, u_2) = \Phi_\Sigma(\Phi^{-1}(u_1), \Phi^{-1}(u_2))$$

---

### 14. ARIMA Time Series Forecasting 🔮
- **Category**: Time Series Econometrics
- **Description**: AutoRegressive Integrated Moving Average model forecasting asset returns and price levels using historical lags and forecast errors.
- **Formula**:
  $$\left(1 - \sum_{i=1}^p \phi_i L^i\right) (1 - L)^d X_t = \left(1 + \sum_{j=1}^q \theta_j L^j\right) \epsilon_t$$

---

### 15. Principal Component Analysis (PCA) 📐
- **Category**: Dimensionality Reduction
- **Description**: Decomposes yield curves or multi-asset returns into orthogonal principal components (Level, Slope, Curvature).
- **Formula**:
  $$\Sigma v_i = \lambda_i v_i, \quad X_{\text{reduced}} = X V_k$$

---

### 16. Portfolio Optimization (Markowitz MPT) ⚖️
- **Category**: Asset Allocation
- **Description**: Modern Portfolio Theory computing the Efficient Frontier, Max Sharpe Ratio, and Minimum Variance asset weight allocation.
- **Formula**:
  $$\max_w \frac{w^T \mu - R_f}{\sqrt{w^T \Sigma w}} \quad \text{s.t.} \quad \sum w_i = 1, \; w_i \ge 0$$

---

### 17. Option Greeks Visualizer 🧪
- **Category**: Derivatives Analytics
- **Description**: Calculates first and second order sensitivities ($\Delta, \Gamma, \nu, \Theta, \rho$) with interactive 2D curves and 3D volatility surface visualizations.
- **Formula**:
  $$\Delta = \frac{\partial C}{\partial S} = N(d_1), \quad \Gamma = \frac{\partial^2 C}{\partial S^2} = \frac{n(d_1)}{S \sigma \sqrt{T}}, \quad \nu = \frac{\partial C}{\partial \sigma} = S \sqrt{T} n(d_1)$$

---

### 18. Merton Structural Credit Risk Model 🏢
- **Category**: Credit Risk
- **Description**: Models company equity as a European call option on firm total assets to estimate Distance to Default ($DD$) and Default Probability ($PD$).
- **Formula**:
  $$V_E = V_A N(d_1) - D e^{-r T} N(d_2)$$
  $$\text{Distance to Default } DD = \frac{\ln(V_A/D) + (\mu_A - 0.5\sigma_A^2)T}{\sigma_A \sqrt{T}}, \quad PD = N(-DD)$$

---

### 19. Machine Learning Alpha Models 🤖
- **Category**: Quantitative Trading & ML
- **Description**: Non-linear feature engineering, decision tree / random forest alpha signal construction, and backtest cumulative returns engine.
- **Formula**:
  $$\hat{y}_t = f_{\text{tree}}\left( \text{RSI}_t, \text{MACD}_t, \text{Vol}_t, \text{Mom}_t \right), \quad \text{Signal}_t = \text{sign}(\hat{y}_t)$$

---

### 20. Risk Parity Allocation (Equal Risk Contribution) ⚖️
- **Category**: Asset Allocation
- **Description**: Allocates portfolio capital such that every asset contributes equally to total portfolio volatility.
- **Formula**:
  $$\text{RC}_i = w_i \frac{(\Sigma w)_i}{\sqrt{w^T \Sigma w}}, \quad \text{s.t.} \quad \text{RC}_i = \frac{1}{N} \sqrt{w^T \Sigma w} \quad \forall i$$

---

## 📁 Repository Structure

```
Quant Finance Model/
├── README.md                      # Complete theoretical & master project documentation
├── package.json                   # Project scripts and dependencies
├── vite.config.ts                 # Vite bundler configuration
├── tsconfig.json                  # TypeScript compiler rules
├── index.html                     # Main application entrypoint
└── src/
    ├── main.tsx                   # React root entry
    ├── App.tsx                    # Main terminal application layout
    ├── index.css                  # Financial dark terminal CSS & styling tokens
    ├── components/
    │   ├── Sidebar.tsx            # Model category & tab navigation list
    │   ├── Header.tsx             # Terminal header bar & search
    │   ├── ModelViewer.tsx        # Dynamic viewer rendering active model layout
    │   ├── MathFormula.tsx        # LaTeX formula display component
    │   └── CodeBlock.tsx          # Code snippet renderer
    └── models/
        ├── blackScholes.ts        # BSM analytical pricing solver
        ├── monteCarlo.ts          # GBM path simulator
        ├── binomialTree.ts        # CRR option lattice
        ├── valueAtRisk.ts         # VaR & CVaR risk calculator
        ├── garch.ts               # GARCH(1,1) volatility estimator
        ├── capm.ts                # CAPM & SML calculation
        ├── factorModels.ts        # Fama-French 3-Factor model
        ├── kalmanFilter.ts        # Dynamic pair hedge filter
        ├── hmmRegime.ts           # HMM regime transition simulator
        ├── hestonModel.ts         # Heston stochastic volatility
        ├── vasicekModel.ts        # Vasicek short rate SDE
        ├── sabrModel.ts           # SABR volatility smile expansion
        ├── copulaModel.ts         # Copula joint tail dependency
        ├── arimaModel.ts          # ARIMA forecasting solver
        ├── pcaAnalysis.ts         # Yield curve PCA factor decomposition
        ├── portfolioOptimization.ts# Markowitz Efficient Frontier solver
        ├── optionGreeks.ts        # Analytical option Greeks solver
        ├── mertonCredit.ts        # Merton default probability model
        ├── mlAlphaModel.ts        # ML tree signal generator
        └── riskParity.ts          # Equal Risk Contribution solver
```

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with modern custom design tokens, dark financial terminal theme, neon gradients
- **Charts**: Chart.js / React-Chartjs-2
- **Icons**: Lucide React
- **Math**: KaTeX / MathJax SVG formatting

---

## 📜 License & Citation

Distributed under the **MIT License**. Free for research, quantitative trading, academic, and commercial application.
