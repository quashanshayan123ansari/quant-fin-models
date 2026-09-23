export interface CAPMInput {
  riskFreeRate: number;     // Rf (decimal, e.g. 0.04)
  marketReturn: number;     // Rm (decimal, e.g. 0.10)
  beta: number;             // Asset Beta
  assetVol: number;         // Total volatility of asset (decimal)
  marketVol: number;        // Market volatility (decimal)
}

export interface CAPMResult {
  expectedReturn: number;
  marketRiskPremium: number;
  systematicRisk: number;
  unsystematicRisk: number;
  rSquared: number;
  smlChart: { beta: number; expectedReturnPct: number; isSelected?: boolean; assetLabel?: string }[];
}

export function calculateCAPM(input: CAPMInput): CAPMResult {
  const { riskFreeRate, marketReturn, beta, assetVol, marketVol } = input;

  const marketRiskPremium = marketReturn - riskFreeRate;
  const expectedReturn = riskFreeRate + beta * marketRiskPremium;

  // Risk breakdown
  const totalVariance = assetVol * assetVol;
  const systematicVariance = Math.pow(beta * marketVol, 2);
  const systematicRisk = Math.sqrt(systematicVariance);
  const unsystematicVariance = Math.max(0, totalVariance - systematicVariance);
  const unsystematicRisk = Math.sqrt(unsystematicVariance);
  const rSquared = totalVariance > 0 ? systematicVariance / totalVariance : 1.0;

  // Build Security Market Line (SML) chart
  const smlChart = [];
  for (let b = 0; b <= 2.0; b += 0.2) {
    const bVal = parseFloat(b.toFixed(1));
    const er = riskFreeRate + bVal * marketRiskPremium;
    const isCurrent = Math.abs(bVal - parseFloat(beta.toFixed(1))) < 0.05;

    smlChart.push({
      beta: bVal,
      expectedReturnPct: parseFloat((er * 100).toFixed(2)),
      isSelected: isCurrent,
      assetLabel: isCurrent ? 'Target Asset' : undefined
    });
  }

  return {
    expectedReturn,
    marketRiskPremium,
    systematicRisk,
    unsystematicRisk,
    rSquared,
    smlChart
  };
}
