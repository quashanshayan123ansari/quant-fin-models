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
  onReturnToDashboard?: () => void;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({ modelId, onReturnToDashboard }) => {
  const modelMeta = ALL_MODELS.find((m) => m.id === modelId) || ALL_MODELS[0];
  const [activeTab, setActiveTab] = useState<'chart' | 'math' | 'code'>('chart');

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

  // Dynamic Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'Fira Code', size: 11 } }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#00f0ff',
        bodyColor: '#f8fafc'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#64748b', font: { family: 'Fira Code', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#64748b', font: { family: 'Fira Code', size: 10 } }
      }
    }
  };

  // Build chart dataset per model
  const renderChart = () => {
    switch (modelId) {
      case 'black-scholes': {
        const data = {
          labels: bsmRes.payoffChart.map((p) => `$${p.spot}`),
          datasets: [
            { label: 'Call Option Price ($)', data: bsmRes.payoffChart.map((p) => p.callValue), borderColor: '#00f0ff', backgroundColor: 'rgba(0, 240, 255, 0.1)', fill: true, tension: 0.4 },
            { label: 'Call Payoff at Expiry', data: bsmRes.payoffChart.map((p) => p.callPayoff), borderColor: '#10b981', borderDash: [4, 4] },
            { label: 'Put Option Price ($)', data: bsmRes.payoffChart.map((p) => p.putValue), borderColor: '#f43f5e', backgroundColor: 'rgba(244, 63, 94, 0.05)', fill: true, tension: 0.4 }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'monte-carlo': {
        const data = {
          labels: mcRes.paths.map((p) => `${p.time}y`),
          datasets: [
            { label: 'Expected Mean Path ($)', data: mcRes.paths.map((p) => p.mean), borderColor: '#00f0ff', borderWidth: 2.5 },
            { label: '95th Percentile ($)', data: mcRes.paths.map((p) => p.p95), borderColor: '#10b981', borderDash: [3, 3] },
            { label: '5th Percentile ($)', data: mcRes.paths.map((p) => p.p5), borderColor: '#f43f5e', borderDash: [3, 3] },
            ...mcRes.paths[0].samplePaths.map((_, idx) => ({
              label: `Sample Path ${idx + 1}`,
              data: mcRes.paths.map((p) => p.samplePaths[idx]),
              borderColor: 'rgba(148, 163, 184, 0.2)',
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
            { label: 'American Option Price ($)', data: binomRes.stepChart.map((s) => s.americanPrice), borderColor: '#00f0ff', backgroundColor: 'rgba(0,240,255,0.1)', fill: true },
            { label: 'European Option Price ($)', data: binomRes.stepChart.map((s) => s.europeanPrice), borderColor: '#8b5cf6', borderDash: [4, 4] }
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
              backgroundColor: varRes.distributionChart.map((d) => (d.isTailLoss ? 'rgba(244, 63, 94, 0.7)' : 'rgba(0, 240, 255, 0.3)')),
              borderColor: varRes.distributionChart.map((d) => (d.isTailLoss ? '#f43f5e' : '#00f0ff')),
              borderWidth: 1
            }
          ]
        };
        return <Bar data={data} options={chartOptions} />;
      }
      case 'garch-volatility': {
        const data = {
          labels: garchRes.series.map((s) => `Day ${s.day}`),
          datasets: [
            { label: 'Annualized Conditional Volatility (%)', data: garchRes.series.map((s) => s.conditionalVolPct), borderColor: '#00f0ff', borderWidth: 2 },
            { label: '2-Sigma Upper Vol Band (%)', data: garchRes.series.map((s) => s.upperBandPct), borderColor: '#f59e0b', borderDash: [3, 3] }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'capm-model': {
        const data = {
          labels: capmRes.smlChart.map((s) => `β=${s.beta}`),
          datasets: [
            { label: 'Security Market Line (SML)', data: capmRes.smlChart.map((s) => s.expectedReturnPct), borderColor: '#00f0ff', borderWidth: 2 },
            { label: 'Selected Asset', data: capmRes.smlChart.map((s) => (s.isSelected ? s.expectedReturnPct : null)), pointRadius: 8, pointBackgroundColor: '#10b981', borderColor: '#10b981' }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'factor-models': {
        const data = {
          labels: factorRes.breakdownChart.map((f) => f.factor),
          datasets: [
            { label: 'Expected Return Contribution (%)', data: factorRes.breakdownChart.map((f) => f.contributionPct), backgroundColor: ['#3b82f6', '#00f0ff', '#10b981', '#f59e0b', '#8b5cf6'] }
          ]
        };
        return <Bar data={data} options={chartOptions} />;
      }
      case 'kalman-filter': {
        const data = {
          labels: kalmanRes.series.map((s) => `Day ${s.day}`),
          datasets: [
            { label: 'Estimated Dynamic Beta (β_t)', data: kalmanRes.series.map((s) => s.estimatedBeta), borderColor: '#00f0ff', yAxisID: 'y' },
            { label: 'Spread Z-Score', data: kalmanRes.series.map((s) => s.zScore), borderColor: '#f43f5e', borderDash: [2, 2], yAxisID: 'y1' }
          ]
        };
        return <Line data={data} options={{ ...chartOptions, scales: { ...chartOptions.scales, y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#f43f5e' } } } }} />;
      }
      case 'hmm-regimes': {
        const data = {
          labels: hmmRes.series.map((s) => `Day ${s.day}`),
          datasets: [
            { label: 'Asset Price ($)', data: hmmRes.series.map((s) => s.price), borderColor: '#00f0ff', yAxisID: 'y' },
            { label: 'Bull State Prob (%)', data: hmmRes.series.map((s) => s.bullProbPct), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, yAxisID: 'y1' }
          ]
        };
        return <Line data={data} options={{ ...chartOptions, scales: { ...chartOptions.scales, y1: { position: 'right', grid: { drawOnChartArea: false } } } }} />;
      }
      case 'heston-model': {
        const data = {
          labels: hestonRes.samplePaths.map((p) => `${p.time}y`),
          datasets: [
            { label: 'Asset Price ($)', data: hestonRes.samplePaths.map((p) => p.spot), borderColor: '#00f0ff', yAxisID: 'y' },
            { label: 'Stochastic Volatility (%)', data: hestonRes.samplePaths.map((p) => p.volatilityPct), borderColor: '#8b5cf6', yAxisID: 'y1' }
          ]
        };
        return <Line data={data} options={{ ...chartOptions, scales: { ...chartOptions.scales, y1: { position: 'right', grid: { drawOnChartArea: false } } } }} />;
      }
      case 'vasicek-rate': {
        const data = {
          labels: vasicekRes.yieldCurve.map((y) => `${y.maturity}Y`),
          datasets: [
            { label: 'Zero-Coupon Yield Curve (%)', data: vasicekRes.yieldCurve.map((y) => y.zeroRatePct), borderColor: '#00f0ff', backgroundColor: 'rgba(0,240,255,0.1)', fill: true },
            { label: 'Zero Bond Price ($)', data: vasicekRes.yieldCurve.map((y) => y.bondPrice * 100), borderColor: '#10b981', yAxisID: 'y1' }
          ]
        };
        return <Line data={data} options={{ ...chartOptions, scales: { ...chartOptions.scales, y1: { position: 'right', grid: { drawOnChartArea: false } } } }} />;
      }
      case 'sabr-model': {
        const data = {
          labels: sabrRes.smileChart.map((s) => `$${s.strike}`),
          datasets: [
            { label: 'SABR Volatility Smile (%)', data: sabrRes.smileChart.map((s) => s.sabrVolPct), borderColor: '#00f0ff', borderWidth: 2.5 },
            { label: 'Lognormal Flat Vol (%)', data: sabrRes.smileChart.map((s) => s.lognormalVolPct), borderColor: '#64748b', borderDash: [4, 4] }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'copula-models': {
        const data = {
          labels: ['Standalone Asset 1', 'Standalone Asset 2', 'Joint Default', 'Conditional P(D2|D1)'],
          datasets: [
            { label: 'Default Probabilities (%)', data: [copulaRes.standaloneProb1 * 100, copulaRes.standaloneProb2 * 100, copulaRes.jointDefaultProb * 100, copulaRes.conditionalProb * 100], backgroundColor: ['#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b'] }
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
            { label: 'Historical Asset Price', data: [...arimaRes.historySeries.map((h) => h.actual), ...arimaRes.forecastSeries.map(() => null)], borderColor: '#00f0ff' },
            { label: 'ARIMA Point Forecast', data: [...arimaRes.historySeries.map(() => null), ...arimaRes.forecastSeries.map((f) => f.forecast)], borderColor: '#10b981', borderDash: [2, 2] },
            { label: '95% Upper CI', data: [...arimaRes.historySeries.map(() => null), ...arimaRes.forecastSeries.map((f) => f.upperCI)], borderColor: 'rgba(245,158,11,0.5)', borderDash: [4, 4] },
            { label: '95% Lower CI', data: [...arimaRes.historySeries.map(() => null), ...arimaRes.forecastSeries.map((f) => f.lowerCI)], borderColor: 'rgba(245,158,11,0.5)', borderDash: [4, 4] }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'pca-analysis': {
        const data = {
          labels: pcaRes.yieldCurveChart.map((y) => `${y.maturityYears}Y`),
          datasets: [
            { label: 'Baseline Yield Curve (%)', data: pcaRes.yieldCurveChart.map((y) => y.originalYieldPct), borderColor: '#64748b' },
            { label: 'Shifted PCA Reconstructed Curve (%)', data: pcaRes.yieldCurveChart.map((y) => y.reconstructedYieldPct), borderColor: '#00f0ff', borderWidth: 2.5 }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'portfolio-opt': {
        const data = {
          labels: portOptRes.frontierChart.map((f) => `${f.volPct}%`),
          datasets: [
            { label: 'Efficient Frontier', data: portOptRes.frontierChart.map((f) => f.returnPct), borderColor: '#00f0ff', backgroundColor: 'rgba(0,240,255,0.05)', fill: true },
            { label: 'Max Sharpe Tangency Portfolio', data: portOptRes.frontierChart.map((f) => (f.isTangency ? f.returnPct : null)), pointRadius: 9, pointBackgroundColor: '#10b981', borderColor: '#10b981' }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'option-greeks': {
        const data = {
          labels: greeksRes.greekCurves.map((g) => `$${g.spot}`),
          datasets: [
            { label: 'Delta (Δ)', data: greeksRes.greekCurves.map((g) => g.delta), borderColor: '#00f0ff' },
            { label: 'Gamma (Γ)', data: greeksRes.greekCurves.map((g) => g.gamma * 10), borderColor: '#10b981' },
            { label: 'Vega (ν)', data: greeksRes.greekCurves.map((g) => g.vega), borderColor: '#8b5cf6' },
            { label: 'Theta (Θ)', data: greeksRes.greekCurves.map((g) => g.theta), borderColor: '#f43f5e' }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'merton-credit': {
        const data = {
          labels: mertonRes.mertonChart.map((m) => `${m.firmValueRatio}x Debt`),
          datasets: [
            { label: 'Equity Value ($M)', data: mertonRes.mertonChart.map((m) => m.equityVal), borderColor: '#00f0ff', yAxisID: 'y' },
            { label: 'Default Probability (%)', data: mertonRes.mertonChart.map((m) => m.defaultProbPct), borderColor: '#f43f5e', yAxisID: 'y1' }
          ]
        };
        return <Line data={data} options={{ ...chartOptions, scales: { ...chartOptions.scales, y1: { position: 'right', grid: { drawOnChartArea: false } } } }} />;
      }
      case 'ml-alpha': {
        const data = {
          labels: mlAlphaRes.cumulativeReturns.map((c) => `Day ${c.day}`),
          datasets: [
            { label: 'ML Strategy Alpha Cumulative Return (%)', data: mlAlphaRes.cumulativeReturns.map((c) => c.strategyPct), borderColor: '#10b981', borderWidth: 2.5 },
            { label: 'Market Benchmark Return (%)', data: mlAlphaRes.cumulativeReturns.map((c) => c.benchmarkPct), borderColor: '#64748b' }
          ]
        };
        return <Line data={data} options={chartOptions} />;
      }
      case 'risk-parity': {
        const data = {
          labels: riskParityRes.assetWeights.map((a) => a.asset),
          datasets: [
            { label: 'Capital Allocation Weight (%)', data: riskParityRes.assetWeights.map((a) => a.weightPct), backgroundColor: '#00f0ff' },
            { label: 'Risk Contribution (%)', data: riskParityRes.assetWeights.map((a) => a.riskContribPct), backgroundColor: '#10b981' }
          ]
        };
        return <Bar data={data} options={chartOptions} />;
      }
      default:
        return null;
    }
  };

  // Math equations & documentation per model
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
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          {onReturnToDashboard && (
            <button
              onClick={onReturnToDashboard}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold transition"
            >
              <span>← Dashboard</span>
            </button>
          )}
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{modelMeta.category}</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-300 font-bold">{modelMeta.name}</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
          {modelMeta.modelType}
        </span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight">{modelMeta.name}</h2>
            <span className="badge badge-cyan">{modelMeta.category}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{modelMeta.description}</p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'chart' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Terminal
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'math' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            LaTeX Formulation
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'code' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Code Snippet
          </button>
        </div>
      </div>

      {activeTab === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls Panel */}
          <div className="lg:col-span-4 glass-panel p-5 space-y-5">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Model Parameter Controls
            </h3>

            {/* Dynamic Slider Controls */}
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>Spot / Asset Price (S₀):</span>
                  <span className="text-cyan-400 font-bold">${S}</span>
                </div>
                <input type="range" min="10" max="300" step="1" value={S} onChange={(e) => setS(Number(e.target.value))} className="w-full" />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>Strike / Debt Level (K):</span>
                  <span className="text-cyan-400 font-bold">${K}</span>
                </div>
                <input type="range" min="10" max="300" step="1" value={K} onChange={(e) => setK(Number(e.target.value))} className="w-full" />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>Volatility (σ):</span>
                  <span className="text-cyan-400 font-bold">{(v * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0.05" max="0.80" step="0.01" value={v} onChange={(e) => setV(Number(e.target.value))} className="w-full" />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>Risk-Free Rate (r):</span>
                  <span className="text-cyan-400 font-bold">{(r * 100).toFixed(1)}%</span>
                </div>
                <input type="range" min="0.00" max="0.15" step="0.005" value={r} onChange={(e) => setR(Number(e.target.value))} className="w-full" />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>Time Horizon (T):</span>
                  <span className="text-cyan-400 font-bold">{T} Year(s)</span>
                </div>
                <input type="range" min="0.1" max="5.0" step="0.1" value={T} onChange={(e) => setT(Number(e.target.value))} className="w-full" />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-mono mb-1">
                  <span>Asset Correlation (ρ) / Beta (β):</span>
                  <span className="text-cyan-400 font-bold">{rho.toFixed(2)}</span>
                </div>
                <input type="range" min="-0.9" max="0.9" step="0.05" value={rho} onChange={(e) => setRho(Number(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>

          {/* Right Output Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            {/* Key Metric Highlight Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass-panel p-3.5">
                <div className="text-[11px] text-slate-400 font-mono">CALL / PRIMARY VAL</div>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                  ${bsmRes.callPrice.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Δ = {bsmRes.callDelta.toFixed(2)}</div>
              </div>

              <div className="glass-panel p-3.5">
                <div className="text-[11px] text-slate-400 font-mono">10D 95% VaR</div>
                <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">
                  ${(varRes.parametricVaR / 1000).toFixed(1)}k
                </div>
                <div className="text-[10px] text-rose-400 mt-0.5">CVaR = ${(varRes.parametricCVaR / 1000).toFixed(1)}k</div>
              </div>

              <div className="glass-panel p-3.5">
                <div className="text-[11px] text-slate-400 font-mono">MAX SHARPE RATIO</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {portOptRes.maxSharpeRatio}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Return = {portOptRes.maxSharpeReturnPct}%</div>
              </div>

              <div className="glass-panel p-3.5">
                <div className="text-[11px] text-slate-400 font-mono">MERTON DEFAULT PROB</div>
                <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                  {mertonRes.defaultProbabilityPct}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">DD = {mertonRes.distanceToDefault}</div>
              </div>
            </div>

            {/* Interactive Chart */}
            <div className="glass-panel p-5 h-80 relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase">
                  {modelMeta.name} Terminal Visualizer
                </h4>
                <span className="text-[10px] font-mono text-cyan-400">REAL-TIME SIMULATION</span>
              </div>
              <div className="h-64 w-full">
                {renderChart()}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'math' && (
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase">Mathematical Derivations & SDE Equations</h3>
          <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 flex justify-center">
            <MathFormula math={getMathFormula()} block={true} />
          </div>
          <div className="text-xs text-slate-400 leading-relaxed space-y-2">
            <p><strong className="text-slate-200">Theoretical Background:</strong> The model evaluates continuous financial dynamics using partial differential equations (PDEs) or stochastic differential equations (SDEs).</p>
            <p><strong className="text-slate-200">Key Parameters:</strong> S₀ = Spot Price, K = Strike/Barrier Price, r = Risk-Free Rate, σ = Volatility, T = Maturity.</p>
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase">Pure TypeScript Engine Implementation</h3>
          <CodeBlock code={getCodeSnippet()} language="typescript" />
        </div>
      )}
    </div>
  );
};
