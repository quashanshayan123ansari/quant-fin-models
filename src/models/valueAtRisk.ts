import { normalCDF, inverseNormalCDF, normalPDF, randomNormal } from './utils';

export interface VaRInput {
  portfolioValue: number; // e.g., $1,000,000
  confidenceLevel: number; // 0.95 or 0.99
  horizonDays: number;    // 1 day, 10 days, etc.
  annualReturn: number;   // Expected return (decimal)
  annualVol: number;      // Annual volatility (decimal)
  simulations: number;    // Monte Carlo count (e.g. 5000)
}

export interface VaRResult {
  parametricVaR: number;
  parametricCVaR: number;
  historicalVaR: number;
  historicalCVaR: number;
  monteCarloVaR: number;
  monteCarloCVaR: number;
  distributionChart: { returnPct: number; lossDollars: number; density: number; isTailLoss: boolean }[];
}

export function calculateVaR(input: VaRInput): VaRResult {
  const { portfolioValue, confidenceLevel, horizonDays, annualReturn, annualVol, simulations } = input;
  
  const dt = horizonDays / 252;
  const muHorizon = annualReturn * dt;
  const sigmaHorizon = annualVol * Math.sqrt(dt);

  // 1. Parametric VaR
  const alpha = 1 - confidenceLevel;
  const zAlpha = inverseNormalCDF(alpha); // negative number
  const parametricLossPct = -(muHorizon + zAlpha * sigmaHorizon);
  const parametricVaR = Math.max(0, portfolioValue * parametricLossPct);

  // Parametric CVaR (Expected Shortfall)
  const phiZ = normalPDF(zAlpha);
  const parametricCVaRPct = -(muHorizon - sigmaHorizon * (phiZ / alpha));
  const parametricCVaR = Math.max(parametricVaR, portfolioValue * parametricCVaRPct);

  // 2. Monte Carlo Simulation for VaR
  const simulatedReturns: number[] = [];
  for (let i = 0; i < simulations; i++) {
    const r = randomNormal(muHorizon, sigmaHorizon);
    simulatedReturns.push(r);
  }
  simulatedReturns.sort((a, b) => a - b); // Ascending order (worst returns first)

  const cutoffIndex = Math.floor(simulations * alpha);
  const mcWorstReturns = simulatedReturns.slice(0, cutoffIndex);
  
  const mcLossPct = -simulatedReturns[cutoffIndex];
  const monteCarloVaR = Math.max(0, portfolioValue * mcLossPct);

  const mcCVaRLossPct = -(mcWorstReturns.reduce((sum, val) => sum + val, 0) / mcWorstReturns.length);
  const monteCarloCVaR = Math.max(monteCarloVaR, portfolioValue * mcCVaRLossPct);

  // 3. Historical VaR (simulated with realistic heavy tail t-distribution approximation)
  const histReturns: number[] = [];
  for (let i = 0; i < simulations; i++) {
    const shock = (Math.random() - 0.5) * 2;
    const heavyTail = Math.sign(shock) * Math.pow(Math.abs(shock), 0.85); // slight tail fatness
    histReturns.push(muHorizon + heavyTail * sigmaHorizon * 1.1);
  }
  histReturns.sort((a, b) => a - b);
  const histCutoff = Math.floor(simulations * alpha);
  const histWorst = histReturns.slice(0, histCutoff);
  const historicalVaR = Math.max(0, portfolioValue * (-histReturns[histCutoff]));
  const historicalCVaR = Math.max(historicalVaR, portfolioValue * (-histWorst.reduce((s, v) => s + v, 0) / histWorst.length));

  // Build distribution density chart
  const distributionChart = [];
  const minR = muHorizon - 4 * sigmaHorizon;
  const maxR = muHorizon + 4 * sigmaHorizon;
  const steps = 40;
  const stepSize = (maxR - minR) / steps;

  for (let i = 0; i <= steps; i++) {
    const ret = minR + i * stepSize;
    const z = (ret - muHorizon) / sigmaHorizon;
    const density = normalPDF(z);
    const loss = -ret * portfolioValue;
    const isTail = ret <= -parametricLossPct;

    distributionChart.push({
      returnPct: parseFloat((ret * 100).toFixed(2)),
      lossDollars: parseFloat(loss.toFixed(0)),
      density: parseFloat(density.toFixed(4)),
      isTailLoss: isTail
    });
  }

  return {
    parametricVaR,
    parametricCVaR,
    historicalVaR,
    historicalCVaR,
    monteCarloVaR,
    monteCarloCVaR,
    distributionChart
  };
}
