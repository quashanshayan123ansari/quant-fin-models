import { normalCDF } from './utils';

export interface MertonInput {
  firmValue: number;    // V_A (Asset Value, e.g., $500M)
  debtFaceValue: number;// D (Debt, e.g., $300M)
  assetVol: number;     // sigma_A (Asset volatility, e.g., 0.25)
  riskFreeRate: number; // r (e.g., 0.04)
  T: number;            // Debt maturity (years)
}

export interface MertonResult {
  equityValue: number;
  creditSpreadBps: number;
  distanceToDefault: number;
  defaultProbabilityPct: number;
  survivalProbabilityPct: number;
  mertonChart: { firmValueRatio: number; equityVal: number; defaultProbPct: number }[];
}

export function calculateMerton(input: MertonInput): MertonResult {
  const { firmValue, debtFaceValue, assetVol, riskFreeRate, T } = input;

  const sqrtT = Math.sqrt(Math.max(T, 0.0001));
  const d1 = (Math.log(firmValue / debtFaceValue) + (riskFreeRate + 0.5 * assetVol * assetVol) * T) / (assetVol * sqrtT);
  const d2 = d1 - assetVol * sqrtT;

  // Equity is European Call on Firm Assets
  const equityValue = firmValue * normalCDF(d1) - debtFaceValue * Math.exp(-riskFreeRate * T) * normalCDF(d2);

  // Distance to Default (DD) & Default Probability (PD)
  const distanceToDefault = d2;
  const defaultProbabilityPct = normalCDF(-distanceToDefault) * 100;
  const survivalProbabilityPct = 100 - defaultProbabilityPct;

  // Credit Spread y - r = -1/T * ln(DebtPrice / D)
  const debtPrice = firmValue - equityValue;
  const yieldToMaturity = -Math.log(debtPrice / debtFaceValue) / T;
  const creditSpreadBps = Math.max(0, (yieldToMaturity - riskFreeRate) * 10000);

  // Sensitivity Chart
  const mertonChart = [];
  for (let r = 0.6; r <= 1.8; r += 0.1) {
    const v = debtFaceValue * r;
    const cd1 = (Math.log(v / debtFaceValue) + (riskFreeRate + 0.5 * assetVol * assetVol) * T) / (assetVol * sqrtT);
    const cd2 = cd1 - assetVol * sqrtT;
    const eq = v * normalCDF(cd1) - debtFaceValue * Math.exp(-riskFreeRate * T) * normalCDF(cd2);
    const pd = normalCDF(-cd2) * 100;

    mertonChart.push({
      firmValueRatio: parseFloat(r.toFixed(1)),
      equityVal: parseFloat((eq / 1e6).toFixed(1)),
      defaultProbPct: parseFloat(pd.toFixed(2))
    });
  }

  return {
    equityValue,
    creditSpreadBps: parseFloat(creditSpreadBps.toFixed(1)),
    distanceToDefault: parseFloat(distanceToDefault.toFixed(2)),
    defaultProbabilityPct: parseFloat(defaultProbabilityPct.toFixed(2)),
    survivalProbabilityPct: parseFloat(survivalProbabilityPct.toFixed(2)),
    mertonChart
  };
}
