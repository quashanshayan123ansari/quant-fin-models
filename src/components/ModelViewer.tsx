import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { MathFormula } from './MathFormula';
import { CodeBlock } from './CodeBlock';
import { ALL_MODELS } from './Sidebar';
import { Quant3DScene } from './Quant3DScene';
import {
  ArrowLeft,
  ChevronDown,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Activity,
  CheckCircle2,
  Cpu,
  BarChart3
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Import calculation engines
import { calculateBSM } from '../models/blackScholes';
import { simulateMonteCarlo } from '../models/monteCarlo';
import { calculateBinomialTree } from '../models/binomialTree';
import { calculateVaR } from '../models/valueAtRisk';
import { calculateGARCH } from '../models/garch';
import { calculateCAPM } from '../models/capm';
import { calculateFactorModel } from '../models/factorModels';
import { simulateKalmanFilter } from '../models/kalmanFilter';
import { simulateHMM } from '../models/hmmRegime';
import { simulateHeston } from '../models/hestonModel';
import { simulateVasicek } from '../models/vasicekModel';
import { calculateSABR } from '../models/sabrModel';
import { simulateCopula } from '../models/copulaModel';
import { calculateARIMA } from '../models/arimaModel';
import { calculatePCA } from '../models/pcaAnalysis';
import { calculatePortfolioOptimization } from '../models/portfolioOptimization';
import { calculateOptionGreeks } from '../models/optionGreeks';
import { calculateMerton } from '../models/mertonCredit';
import { calculateMLAlpha } from '../models/mlAlphaModel';
import { calculateRiskParity } from '../models/riskParity';

interface ModelViewerProps {
  modelId: string;
  onSelectModel?: (modelId: string) => void;
  onReturnToDashboard?: () => void;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  modelId,
  onSelectModel,
  onReturnToDashboard
}) => {
  const modelMeta = ALL_MODELS.find((m) => m.id === modelId) || ALL_MODELS[0];
  const [activeTab, setActiveTab] = useState<'chart' | '3d-surface' | 'math' | 'code'>('chart');

  // Shared state for parameters across models
  const [S, setS] = useState<number>(100);
  const [K, setK] = useState<number>(100);
  const [T, setT] = useState<number>(1.0);
  const [r, setR] = useState<number>(0.05);
  const [v, setV] = useState<number>(0.20);
  const [simulations, setSimulations] = useState<number>(1000);
  const [confidence, setConfidence] = useState<number>(0.95);
  const [kappa, setKappa] = useState<number>(2.0);
  const [theta, setTheta] = useState<number>(0.04);
  const [rho, setRho] = useState<number>(-0.5);
  const [beta, setBeta] = useState<number>(1.2);
  const [steps, setSteps] = useState<number>(10);

  // Compute model calculations
  const bsmRes = useMemo(() => calculateBSM({ S, K, T, r, v }), [S, K, T, r, v]);
  const mcRes = useMemo(() => simulateMonteCarlo({ S0: S, mu: r, sigma: v, T, steps: 30, simulations }), [S, r, v, T, simulations]);
  const binomRes = useMemo(() => calculateBinomialTree({ S, K, T, r, v, steps, isAmerican: true, optionType: 'call' }), [S, K, T, r, v, steps]);
  const varRes = useMemo(() => calculateVaR({ portfolioValue: 1000000, confidenceLevel: confidence, horizonDays: 10, annualReturn: 0.08, annualVol: v, simulations: 3000 }), [confidence, v]);
  const garchRes = useMemo(() => calculateGARCH({ omega: 0.00001, alpha: 0.1, beta: 0.85, days: 60, initialVol: v }), [v]);
  const capmRes = useMemo(() => calculateCAPM({ riskFreeRate: r, marketReturn: r + 0.06, beta, assetVol: v, marketVol: 0.15 }), [r, beta, v]);
  const factorRes = useMemo(() => calculateFactorModel({ rf: r, mktPremium: 0.06, smbPremium: 0.02, hmlPremium: 0.03, betaMkt: beta, betaSMB: 0.4, betaHML: -0.2, alpha: 0.015 }), [r, beta]);
  const kalmanRes = useMemo(() => simulateKalmanFilter({ days: 60, initialBeta: beta, processNoiseQ: 0.0001, measurementNoiseR: 0.01 }), [beta]);
  const hmmRes = useMemo(() => simulateHMM({ days: 90, probBullToBear: 0.05, probBearToBull: 0.10, bullReturn: 0.18, bullVol: 0.12, bearReturn: -0.15, bearVol: 0.28 }), []);
  const hestonRes = useMemo(() => simulateHeston({ S0: S, K, T, r, v0: v * v, kappa, theta, xi: 0.3, rho, simulations: 500 }), [S, K, T, r, v, kappa, theta, rho]);
  const vasicekRes = useMemo(() => simulateVasicek({ r0: r, a: kappa, b: theta, sigma: v * 0.5, horizonYears: 10, simulations: 300 }), [r, kappa, theta, v]);
  const sabrRes = useMemo(() => calculateSABR({ F: S, T, alpha: v, beta: 0.7, rho, nu: 0.4 }), [S, T, v, rho]);
  const copulaRes = useMemo(() => simulateCopula({ correlation: rho, defaultProb1: 0.05, defaultProb2: 0.05, simulations: 2000, copulaType: 'gaussian', degreesOfFreedom: 4 }), [rho]);
  const arimaRes = useMemo(() => calculateARIMA({ phi: 0.7, theta: -0.3, d: 1, historySteps: 40, forecastSteps: 15 }), []);
  const pcaRes = useMemo(() => calculatePCA({ parallelShift: 25, steepening: -15, curvature: 10 }), []);
  const portOptRes = useMemo(() => calculatePortfolioOptimization({ riskFreeRate: r, assetCount: 4, assetReturns: [0.12, 0.08, 0.15, 0.04], assetVols: [0.20, 0.10, 0.25, 0.06], correlation: 0.25 }), [r]);
  const greeksRes = useMemo(() => calculateOptionGreeks({ S, K, T, r, v }), [S, K, T, r, v]);
  const mertonRes = useMemo(() => calculateMerton({ firmValue: S * 5000000, debtFaceValue: K * 3000000, assetVol: v, riskFreeRate: r, T }), [S, K, v, r, T]);
  const mlAlphaRes = useMemo(() => calculateMLAlpha({ days: 90, treeDepth: 6, featureCount: 5, signalThreshold: 0.5 }), []);
  const riskParityRes = useMemo(() => calculateRiskParity({ volEquities: v, volBonds: 0.06, volCommodities: 0.20, volRealEstate: 0.14, correlation: 0.2 }), [v]);

  // Crisp Institutional Light Mode Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#334155', font: { family: 'Fira Code', size: 11, weight: 'bold' as const } }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#38bdf8',
        bodyColor: '#f8fafc',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
        ticks: { color: '#64748b', font: { family: 'Fira Code', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
        ticks: { color: '#64748b', font: { family: 'Fira Code', size: 10 } }
      }
    }
  };

  // Build chart dataset per model with vivid light mode contrast
  const renderChart = () => {
    switch (modelId) {
      case 'black-scholes': {
        const data = {
          labels: bsmRes.payoffChart.map((p) => `$${p.spot}`),
          datasets: [
            { label: 'Call Option Price ($)', data: bsmRes.payoffChart.map((p) => p.callValue), borderColor: '#0284c7', backgroundColor: 'rgba(2, 132, 199, 0.08)', fill: true, tension: 0.4, borderWidth: 2.5 },
            { label: 'Call Payoff at Expiry', data: bsmRes.payoffChart.map((p) => p.callPayoff), borderColor: '#10b981', borderDash: [4, 4], borderWidth: 2 },
            { label: 'Put Option Price ($)', data: bsmRes.payoffChart.map((p) => p.putValue), borderColor: '#e11d48', backgroundColor: 'rgba(225, 29, 72, 0.05)', fill: true, tension: 0.4, borderWidth: 2 }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'monte-carlo': {
        const data = {
          labels: mcRes.paths.map((p) => `${p.time}y`),
          datasets: [
            { label: 'Expected Mean Path ($)', data: mcRes.paths.map((p) => p.mean), borderColor: '#0284c7', borderWidth: 3 },
            { label: '95th Percentile ($)', data: mcRes.paths.map((p) => p.p95), borderColor: '#10b981', borderDash: [3, 3], borderWidth: 2 },
            { label: '5th Percentile ($)', data: mcRes.paths.map((p) => p.p5), borderColor: '#e11d48', borderDash: [3, 3], borderWidth: 2 },
            ...mcRes.paths[0].samplePaths.map((_, idx) => ({
              label: `Sample Path ${idx + 1}`,
              data: mcRes.paths.map((p) => p.samplePaths[idx]),
              borderColor: 'rgba(148, 163, 184, 0.3)',
              borderWidth: 1
            }))
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'binomial-tree': {
        const data = {
          labels: binomRes.stepChart.map((s) => `Step ${s.step}`),
          datasets: [
            { label: 'American Option Price ($)', data: binomRes.stepChart.map((s) => s.americanPrice), borderColor: '#0284c7', backgroundColor: 'rgba(2, 132, 199, 0.08)', fill: true, borderWidth: 2.5 },
            { label: 'European Option Price ($)', data: binomRes.stepChart.map((s) => s.europeanPrice), borderColor: '#7c3aed', borderDash: [4, 4], borderWidth: 2 }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'value-at-risk': {
        const data = {
          labels: varRes.distributionChart.map((d) => `${d.returnPct}%`),
          datasets: [
            {
              label: 'Return Loss Density',
              data: varRes.distributionChart.map((d) => d.density),
              backgroundColor: varRes.distributionChart.map((d) => (d.isTailLoss ? 'rgba(225, 29, 72, 0.85)' : 'rgba(2, 132, 199, 0.4)')),
              borderColor: varRes.distributionChart.map((d) => (d.isTailLoss ? '#e11d48' : '#0284c7')),
              borderWidth: 1.5
            }
          ]
        };
        return <Bar data={data} options={chartOptions} />;
      }
      case 'garch-volatility': {
        const data = {
          labels: garchRes.series.map((s) => `Day ${s.day}`),
          datasets: [
            { label: 'Annualized Conditional Volatility (%)', data: garchRes.series.map((s) => s.conditionalVolPct), borderColor: '#0284c7', borderWidth: 2.5 },
            { label: '2-Sigma Upper Vol Band (%)', data: garchRes.series.map((s) => s.upperBandPct), borderColor: '#d97706', borderDash: [3, 3], borderWidth: 2 }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'capm-model': {
        const data = {
          labels: capmRes.smlChart.map((s) => `β=${s.beta}`),
          datasets: [
            { label: 'Security Market Line (SML)', data: capmRes.smlChart.map((s) => s.expectedReturnPct), borderColor: '#0284c7', borderWidth: 2.5 },
            { label: 'Selected Asset', data: capmRes.smlChart.map((s) => (s.isSelected ? s.expectedReturnPct : null)), pointRadius: 9, pointBackgroundColor: '#10b981', borderColor: '#10b981' }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'factor-models': {
        const data = {
          labels: factorRes.breakdownChart.map((f) => f.factor),
          datasets: [
            { label: 'Expected Return Contribution (%)', data: factorRes.breakdownChart.map((f) => f.contributionPct), backgroundColor: ['#2563eb', '#0284c7', '#10b981', '#d97706', '#7c3aed'] }
          ]
        };
        return <Bar data={data} options={chartOptions} />;
      }
      case 'kalman-filter': {
        const data = {
          labels: kalmanRes.series.map((s) => `Day ${s.day}`),
          datasets: [
            { label: 'Estimated Dynamic Beta (β_t)', data: kalmanRes.series.map((s) => s.estimatedBeta), borderColor: '#0284c7', borderWidth: 2.5, yAxisID: 'y' },
            { label: 'Spread Z-Score', data: kalmanRes.series.map((s) => s.zScore), borderColor: '#e11d48', borderDash: [2, 2], borderWidth: 2, yAxisID: 'y1' }
          ]
        };
        return <Line data={data} options={{ ...chartOptions, scales: { ...chartOptions.scales, y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#e11d48' } } } }} />;
      }
      case 'hmm-regimes': {
        const data = {
          labels: hmmRes.series.map((s) => `Day ${s.day}`),
          datasets: [
            { label: 'Asset Price ($)', data: hmmRes.series.map((s) => s.price), borderColor: '#0284c7', borderWidth: 2.5, yAxisID: 'y' },
            { label: 'Bull State Prob (%)', data: hmmRes.series.map((s) => s.bullProbPct), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, yAxisID: 'y1' }
          ]
        };
        return <Line data={data} options={{ ...chartOptions, scales: { ...chartOptions.scales, y1: { position: 'right', grid: { drawOnChartArea: false } } } }} />;
      }
      case 'heston-model': {
        const data = {
          labels: hestonRes.samplePaths.map((p) => `${p.time}y`),
          datasets: [
            { label: 'Asset Price ($)', data: hestonRes.samplePaths.map((p) => p.spot), borderColor: '#0284c7', borderWidth: 2.5, yAxisID: 'y' },
            { label: 'Stochastic Volatility (%)', data: hestonRes.samplePaths.map((p) => p.volatilityPct), borderColor: '#7c3aed', borderWidth: 2, yAxisID: 'y1' }
          ]
        };
        return <Line data={data} options={{ ...chartOptions, scales: { ...chartOptions.scales, y1: { position: 'right', grid: { drawOnChartArea: false } } } }} />;
      }
      case 'vasicek-rate': {
        const data = {
          labels: vasicekRes.yieldCurve.map((y) => `${y.maturity}Y`),
          datasets: [
            { label: 'Zero-Coupon Yield Curve (%)', data: vasicekRes.yieldCurve.map((y) => y.zeroRatePct), borderColor: '#0284c7', backgroundColor: 'rgba(2,132,199,0.08)', fill: true, borderWidth: 2.5 },
            { label: 'Zero Bond Price ($)', data: vasicekRes.yieldCurve.map((y) => y.bondPrice * 100), borderColor: '#10b981', borderWidth: 2, yAxisID: 'y1' }
          ]
        };
        return <Line data={data} options={{ ...chartOptions, scales: { ...chartOptions.scales, y1: { position: 'right', grid: { drawOnChartArea: false } } } }} />;
      }
      case 'sabr-model': {
        const data = {
          labels: sabrRes.smileChart.map((s) => `$${s.strike}`),
          datasets: [
            { label: 'SABR Volatility Smile (%)', data: sabrRes.smileChart.map((s) => s.sabrVolPct), borderColor: '#0284c7', borderWidth: 3 },
            { label: 'Lognormal Flat Vol (%)', data: sabrRes.smileChart.map((s) => s.lognormalVolPct), borderColor: '#94a3b8', borderDash: [4, 4], borderWidth: 2 }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'copula-models': {
        const data = {
          labels: ['Standalone Asset 1', 'Standalone Asset 2', 'Joint Default', 'Conditional P(D2|D1)'],
          datasets: [
            { label: 'Default Probabilities (%)', data: [copulaRes.standaloneProb1 * 100, copulaRes.standaloneProb2 * 100, copulaRes.jointDefaultProb * 100, copulaRes.conditionalProb * 100], backgroundColor: ['#2563eb', '#7c3aed', '#e11d48', '#d97706'] }
          ]
        };
        return <Bar data={data} options={chartOptions} />;
      }
      case 'arima-forecasting': {
        const historyLabels = arimaRes.historySeries.map((h) => `t=${h.step}`);
        const forecastLabels = arimaRes.forecastSeries.map((f) => `t=${f.step}`);

        const data = {
          labels: [...historyLabels, ...forecastLabels],
          datasets: [
            { label: 'Historical Asset Price', data: [...arimaRes.historySeries.map((h) => h.actual), ...arimaRes.forecastSeries.map(() => null)], borderColor: '#0284c7', borderWidth: 2.5 },
            { label: 'ARIMA Point Forecast', data: [...arimaRes.historySeries.map(() => null), ...arimaRes.forecastSeries.map((f) => f.forecast)], borderColor: '#10b981', borderDash: [2, 2], borderWidth: 2.5 },
            { label: '95% Upper CI', data: [...arimaRes.historySeries.map(() => null), ...arimaRes.forecastSeries.map((f) => f.upperCI)], borderColor: 'rgba(217,119,6,0.7)', borderDash: [4, 4] },
            { label: '95% Lower CI', data: [...arimaRes.historySeries.map(() => null), ...arimaRes.forecastSeries.map((f) => f.lowerCI)], borderColor: 'rgba(217,119,6,0.7)', borderDash: [4, 4] }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'pca-analysis': {
        const data = {
          labels: pcaRes.yieldCurveChart.map((y) => `${y.maturityYears}Y`),
          datasets: [
            { label: 'Baseline Yield Curve (%)', data: pcaRes.yieldCurveChart.map((y) => y.originalYieldPct), borderColor: '#94a3b8', borderWidth: 2 },
            { label: 'Shifted PCA Reconstructed Curve (%)', data: pcaRes.yieldCurveChart.map((y) => y.reconstructedYieldPct), borderColor: '#0284c7', borderWidth: 3 }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'portfolio-opt': {
        const data = {
          labels: portOptRes.frontierChart.map((f) => `${f.volPct}%`),
          datasets: [
            { label: 'Efficient Frontier', data: portOptRes.frontierChart.map((f) => f.returnPct), borderColor: '#0284c7', backgroundColor: 'rgba(2,132,199,0.06)', fill: true, borderWidth: 2.5 },
            { label: 'Max Sharpe Tangency Portfolio', data: portOptRes.frontierChart.map((f) => (f.isTangency ? f.returnPct : null)), pointRadius: 10, pointBackgroundColor: '#10b981', borderColor: '#10b981' }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'option-greeks': {
        const data = {
          labels: greeksRes.greekCurves.map((g) => `$${g.spot}`),
          datasets: [
            { label: 'Delta (Δ)', data: greeksRes.greekCurves.map((g) => g.delta), borderColor: '#0284c7', borderWidth: 2.5 },
            { label: 'Gamma (Γ)', data: greeksRes.greekCurves.map((g) => g.gamma * 10), borderColor: '#10b981', borderWidth: 2 },
            { label: 'Vega (ν)', data: greeksRes.greekCurves.map((g) => g.vega), borderColor: '#7c3aed', borderWidth: 2 },
            { label: 'Theta (Θ)', data: greeksRes.greekCurves.map((g) => g.theta), borderColor: '#e11d48', borderWidth: 2 }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'merton-credit': {
        const data = {
          labels: mertonRes.mertonChart.map((m) => `${m.firmValueRatio}x Debt`),
          datasets: [
            { label: 'Equity Value ($M)', data: mertonRes.mertonChart.map((m) => m.equityVal), borderColor: '#0284c7', borderWidth: 2.5, yAxisID: 'y' },
            { label: 'Default Probability (%)', data: mertonRes.mertonChart.map((m) => m.defaultProbPct), borderColor: '#e11d48', borderWidth: 2, yAxisID: 'y1' }
          ]
        };
        return <Line data={data} options={{ ...chartOptions, scales: { ...chartOptions.scales, y1: { position: 'right', grid: { drawOnChartArea: false } } } }} />;
      }
      case 'ml-alpha': {
        const data = {
          labels: mlAlphaRes.cumulativeReturns.map((c) => `Day ${c.day}`),
          datasets: [
            { label: 'ML Strategy Alpha Cumulative Return (%)', data: mlAlphaRes.cumulativeReturns.map((c) => c.strategyPct), borderColor: '#10b981', borderWidth: 3 },
            { label: 'Market Benchmark Return (%)', data: mlAlphaRes.cumulativeReturns.map((c) => c.benchmarkPct), borderColor: '#64748b', borderWidth: 2 }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'risk-parity': {
        const data = {
          labels: riskParityRes.assetWeights.map((a) => a.asset),
          datasets: [
            { label: 'Capital Allocation Weight (%)', data: riskParityRes.assetWeights.map((a) => a.weightPct), backgroundColor: '#0284c7' },
            { label: 'Risk Contribution (%)', data: riskParityRes.assetWeights.map((a) => a.riskContribPct), backgroundColor: '#10b981' }
          ]
        };
        return <Bar data={data} options={chartOptions} />;
      }
      default:
        return null;
    }
  };

  const getMathFormula = () => {
    switch (modelId) {
      case 'black-scholes':
        return `C = S_0 N(d_1) - K e^{-r T} N(d_2) \\quad P = K e^{-r T} N(-d_2) - S_0 N(-d_1) \\\\ d_1 = \\frac{\\ln(S_0/K) + (r + \\sigma^2/2)T}{\\sigma \\sqrt{T}}, \\quad d_2 = d_1 - \\sigma \\sqrt{T}`;
      case 'monte-carlo':
        return `S_t = S_0 \\exp\\left( \\left(r - \\frac{\\sigma^2}{2}\\right)t + \\sigma \\sqrt{t} Z_t \\right), \\quad Z_t \\sim \\mathcal{N}(0,1)`;
      case 'binomial-tree':
        return `u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = e^{-\\sigma \\sqrt{\\Delta t}} = \\frac{1}{u}, \\quad p = \\frac{e^{r \\Delta t} - d}{u - d}`;
      case 'value-at-risk':
        return `\\text{VaR}_\\alpha = \\mu - Z_\\alpha \\cdot \\sigma, \\quad \\text{CVaR}_\\alpha = \\mu + \\sigma \\frac{\\phi(Z_\\alpha)}{1-\\alpha}`;
      case 'garch-volatility':
        return `\\sigma_t^2 = \\omega + \\alpha \\epsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2, \\quad \\sigma_\\infty = \\sqrt{\\frac{\\omega}{1 - \\alpha - \\beta}}`;
      case 'capm-model':
        return `\\mathbb{E}[R_i] = R_f + \\beta_i (\\mathbb{E}[R_m] - R_f), \\quad \\beta_i = \\frac{\\text{Cov}(R_i, R_m)}{\\text{Var}(R_m)}`;
      case 'factor-models':
        return `R_{i,t} - R_{f,t} = \\alpha_i + \\beta_{i1}(R_{m,t} - R_{f,t}) + \\beta_{i2} \\text{SMB}_t + \\beta_{i3} \\text{HML}_t + \\epsilon_{i,t}`;
      case 'kalman-filter':
        return `\\theta_{t|t-1} = \\theta_{t-1|t-1}, \\quad K_t = P_{t|t-1} x_t (x_t^T P_{t|t-1} x_t + R)^{-1}, \\quad \\theta_{t|t} = \\theta_{t|t-1} + K_t (y_t - x_t^T \\theta_{t|t-1})`;
      case 'hmm-regimes':
        return `P(S_t = j \\mid S_{t-1} = i) = A_{ij}, \\quad y_t \\mid S_t = k \\sim \\mathcal{N}(\\mu_k, \\sigma_k^2)`;
      case 'heston-model':
        return `dS_t = \\mu S_t dt + \\sqrt{v_t} S_t dW_t^S, \\quad dv_t = \\kappa (\\theta - v_t) dt + \\xi \\sqrt{v_t} dW_t^v`;
      case 'vasicek-rate':
        return `dr_t = a(b - r_t)dt + \\sigma dW_t, \\quad P(t, T) = A(t, T) e^{-r_0 B(t, T)}`;
      case 'sabr-model':
        return `dF_t = \\sigma_t F_t^\\beta dW_t^1, \\quad d\\sigma_t = \\nu \\sigma_t dW_t^2, \\quad dW_t^1 dW_t^2 = \\rho dt`;
      case 'copula-models':
        return `C(u_1, u_2) = \\Phi_\\Sigma(\\Phi^{-1}(u_1), \\Phi^{-1}(u_2))`;
      case 'arima-forecasting':
        return `\\left(1 - \\sum_{i=1}^p \\phi_i L^i\\right) (1 - L)^d X_t = \\left(1 + \\sum_{j=1}^q \\theta_j L^j\\right) \\epsilon_t`;
      case 'pca-analysis':
        return `\\Sigma v_i = \\lambda_i v_i, \\quad X_{\\text{reduced}} = X V_k`;
      case 'portfolio-opt':
        return `\\max_w \\frac{w^T \\mu - R_f}{\\sqrt{w^T \\Sigma w}} \\quad \\text{s.t.} \\quad \\sum w_i = 1, \\; w_i \\ge 0`;
      case 'option-greeks':
        return `\\Delta = N(d_1), \\quad \\Gamma = \\frac{n(d_1)}{S \\sigma \\sqrt{T}}, \\quad \\nu = S \\sqrt{T} n(d_1)`;
      case 'merton-credit':
        return `V_E = V_A N(d_1) - D e^{-r T} N(d_2), \\quad DD = \\frac{\\ln(V_A/D) + (r - 0.5\\sigma_A^2)T}{\\sigma_A \\sqrt{T}}, \\quad PD = N(-DD)`;
      case 'ml-alpha':
        return `\\hat{y}_t = f_{\\text{RF}}(\\text{RSI}_t, \\text{MACD}_t, \\text{Vol}_t), \\quad \\text{Signal}_t = \\text{sign}(\\hat{y}_t)`;
      case 'risk-parity':
        return `\\text{RC}_i = w_i \\frac{(\\Sigma w)_i}{\\sqrt{w^T \\Sigma w}} = \\frac{1}{N} \\sqrt{w^T \\Sigma w}`;
      default:
        return '';
    }
  };

  const getCodeSnippet = () => {
    switch (modelId) {
      case 'black-scholes':
        return `export function calculateBSM(S: number, K: number, T: number, r: number, v: number) {
  const d1 = (Math.log(S / K) + (r + 0.5 * v * v) * T) / (v * Math.sqrt(T));
  const d2 = d1 - v * Math.sqrt(T);
  const callPrice = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  const putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  return { callPrice, putPrice, d1, d2 };
}`;
      case 'value-at-risk':
        return `export function calculateVaR(portfolioValue: number, alpha: number, mu: number, sigma: number) {
  const zAlpha = inverseNormalCDF(1 - alpha);
  const varPct = -(mu + zAlpha * sigma);
  const varDollars = portfolioValue * varPct;
  const cvarDollars = portfolioValue * (-(mu - sigma * (normalPDF(zAlpha) / (1 - alpha))));
  return { varDollars, cvarDollars };
}`;
      case 'portfolio-opt':
        return `export function maxSharpePortfolio(returns: number[], covMatrix: number[][], rf: number) {
  // Optimization solver for w^T * mu - rf / sqrt(w^T * Sigma * w)
  // ...
  return { weights, expectedReturn, volatility, sharpeRatio };
}`;
      default:
        return `// Model calculation function for ${modelMeta.name}
// Pure TypeScript engine implementation in src/models/${modelId.replace('-', '')}.ts`;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8 space-y-6">
      {/* Top Navigation & Quick Model Dropdown Bar */}
      <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {onReturnToDashboard && (
            <button
              onClick={onReturnToDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-300/80 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard Overview</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Category:</span>
            <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              {modelMeta.category}
            </span>
          </div>
        </div>

        {/* Model Dropdown Selector (No Sidebar Needed!) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">Select Model:</span>
          <div className="relative min-w-[240px]">
            <select
              value={modelId}
              onChange={(e) => onSelectModel && onSelectModel(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-900 text-xs font-mono font-bold rounded-xl px-3.5 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 transition appearance-none pr-8"
            >
              {ALL_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 uppercase font-bold hidden sm:inline-block">
            {modelMeta.modelType}
          </span>
        </div>
      </div>

      {/* Model Header Info & View Mode Tabs */}
      <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">{modelMeta.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              {modelMeta.category}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">{modelMeta.description}</p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'chart'
                ? 'bg-white text-cyan-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Terminal
          </button>
          <button
            onClick={() => setActiveTab('3d-surface')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === '3d-surface'
                ? 'bg-white text-cyan-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3D Volatility Stage
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'math'
                ? 'bg-white text-cyan-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            LaTeX Formulation
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'code'
                ? 'bg-white text-cyan-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Code Snippet
          </button>
        </div>
      </div>

      {/* 3D Volatility Surface Stage View */}
      {activeTab === '3d-surface' && (
        <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-mono font-bold text-slate-800 uppercase">
                {modelMeta.name} — Interactive 3D Manifold Stage
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic 3D visualization of volatility surface skew, term structure, and PDE solution space.
              </p>
            </div>
          </div>
          <Quant3DScene
            surfaceType={
              modelId.includes('heston')
                ? 'heston'
                : modelId.includes('sabr')
                ? 'sabr'
                : modelId.includes('vasicek')
                ? 'vasicek'
                : 'black-scholes'
            }
            height={480}
            interactive={true}
          />
        </div>
      )}

      {/* Interactive Main Calculation Terminal */}
      {activeTab === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls Panel */}
          <div className="lg:col-span-4 bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-600" />
                Model Parameter Controls
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                LIVE ENGINE
              </span>
            </div>

            {/* Dynamic Slider Controls */}
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Spot / Asset Price (S₀):</span>
                  <span className="text-cyan-700 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">${S}</span>
                </div>
                <input type="range" min="10" max="300" step="1" value={S} onChange={(e) => setS(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Strike / Debt Level (K):</span>
                  <span className="text-cyan-700 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">${K}</span>
                </div>
                <input type="range" min="10" max="300" step="1" value={K} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Volatility (σ):</span>
                  <span className="text-cyan-700 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{(v * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0.05" max="0.80" step="0.01" value={v} onChange={(e) => setV(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Risk-Free Rate (r):</span>
                  <span className="text-cyan-700 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{(r * 100).toFixed(1)}%</span>
                </div>
                <input type="range" min="0.00" max="0.15" step="0.005" value={r} onChange={(e) => setR(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Time Horizon (T):</span>
                  <span className="text-cyan-700 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{T} Year(s)</span>
                </div>
                <input type="range" min="0.1" max="5.0" step="0.1" value={T} onChange={(e) => setT(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium mb-1">
                  <span>Asset Correlation (ρ) / Beta (β):</span>
                  <span className="text-cyan-700 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{rho.toFixed(2)}</span>
                </div>
                <input type="range" min="-0.9" max="0.9" step="0.05" value={rho} onChange={(e) => setRho(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Right Output Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            {/* Key Metric Highlight Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/90 border-t-4 border-t-cyan-500 shadow-sm rounded-2xl p-4">
                <div className="text-[11px] text-slate-500 font-mono font-bold uppercase">CALL / PRIMARY VAL</div>
                <div className="text-xl font-bold text-slate-900 font-mono mt-1">
                  ${bsmRes.callPrice.toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Δ = {bsmRes.callDelta.toFixed(2)}</div>
              </div>

              <div className="bg-white border border-slate-200/90 border-t-4 border-t-rose-500 shadow-sm rounded-2xl p-4">
                <div className="text-[11px] text-slate-500 font-mono font-bold uppercase">10D 95% VaR</div>
                <div className="text-xl font-bold text-rose-600 font-mono mt-1">
                  ${(varRes.parametricVaR / 1000).toFixed(1)}k
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">CVaR = ${(varRes.parametricCVaR / 1000).toFixed(1)}k</div>
              </div>

              <div className="bg-white border border-slate-200/90 border-t-4 border-t-emerald-500 shadow-sm rounded-2xl p-4">
                <div className="text-[11px] text-slate-500 font-mono font-bold uppercase">MAX SHARPE RATIO</div>
                <div className="text-xl font-bold text-emerald-600 font-mono mt-1">
                  {portOptRes.maxSharpeRatio}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Return = {portOptRes.maxSharpeReturnPct}%</div>
              </div>

              <div className="bg-white border border-slate-200/90 border-t-4 border-t-amber-500 shadow-sm rounded-2xl p-4">
                <div className="text-[11px] text-slate-500 font-mono font-bold uppercase">MERTON DEFAULT PROB</div>
                <div className="text-xl font-bold text-amber-600 font-mono mt-1">
                  {mertonRes.defaultProbabilityPct}%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">DD = {mertonRes.distanceToDefault}</div>
              </div>
            </div>

            {/* Interactive Chart Visualizer */}
            <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 relative">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h4 className="text-xs font-mono font-bold text-slate-800 uppercase flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-600" />
                  {modelMeta.name} Terminal Visualizer
                </h4>
                <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                  REAL-TIME SIMULATION
                </span>
              </div>
              <div className="h-72 w-full">
                {renderChart()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LaTeX Formulation Tab */}
      {activeTab === 'math' && (
        <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-mono font-bold text-slate-800 uppercase border-b border-slate-100 pb-3">
            Mathematical Derivations &amp; Stochastic PDE Formulation
          </h3>
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 flex justify-center">
            <MathFormula math={getMathFormula()} block={true} />
          </div>
          <div className="text-xs text-slate-600 leading-relaxed space-y-2">
            <p><strong className="text-slate-800">Theoretical Background:</strong> The model evaluates continuous financial dynamics using partial differential equations (PDEs) or stochastic differential equations (SDEs).</p>
            <p><strong className="text-slate-800">Key Parameters:</strong> S₀ = Spot Price, K = Strike/Barrier Price, r = Risk-Free Rate, σ = Volatility, T = Maturity.</p>
          </div>
        </div>
      )}

      {/* Pure TypeScript Code Snippet Tab */}
      {activeTab === 'code' && (
        <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-mono font-bold text-slate-800 uppercase border-b border-slate-100 pb-3">
            Pure TypeScript Engine Implementation
          </h3>
          <CodeBlock code={getCodeSnippet()} language="typescript" />
        </div>
      )}
    </div>
  );
};
