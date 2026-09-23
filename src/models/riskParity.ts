export interface RiskParityInput {
  volEquities: number;  // e.g. 0.18
  volBonds: number;     // e.g. 0.06
  volCommodities: number; // e.g. 0.22
  volRealEstate: number;  // e.g. 0.14
  correlation: number;  // e.g. 0.2
}

export interface RiskParityResult {
  assetWeights: { asset: string; weightPct: number; riskContribPct: number; volPct: number }[];
  portfolioVolPct: number;
  comparisonChart: { asset: string; equalWeightRiskPct: number; riskParityRiskPct: number }[];
}

export function calculateRiskParity(input: RiskParityInput): RiskParityResult {
  const { volEquities, volBonds, volCommodities, volRealEstate, correlation } = input;

  const vols = [volEquities, volBonds, volCommodities, volRealEstate];
  const assets = ['US Equities', 'US Treasuries', 'Commodities', 'Real Estate'];

  // Inverse volatility weighting initial approximation for Risk Parity (Equal Risk Contribution)
  const invVols = vols.map(v => 1 / Math.max(0.01, v));
  const sumInv = invVols.reduce((a, b) => a + b, 0);
  const rpWeights = invVols.map(v => v / sumInv);

  // Equal Weight risk contribution calculation
  const ewWeights = [0.25, 0.25, 0.25, 0.25];

  function calcRiskContribs(weights: number[]) {
    let totalVar = 0;
    const N = weights.length;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const cov = i === j ? vols[i] * vols[i] : correlation * vols[i] * vols[j];
        totalVar += weights[i] * weights[j] * cov;
      }
    }
    const portVol = Math.sqrt(Math.max(0.0001, totalVar));

    const contribs = weights.map((w, i) => {
      let marginal = 0;
      for (let j = 0; j < N; j++) {
        const cov = i === j ? vols[i] * vols[i] : correlation * vols[i] * vols[j];
        marginal += weights[j] * cov;
      }
      const absoluteContrib = w * (marginal / portVol);
      return absoluteContrib / portVol;
    });

    return { portVol, contribs };
  }

  const rpRes = calcRiskContribs(rpWeights);
  const ewRes = calcRiskContribs(ewWeights);

  const assetWeights = assets.map((a, i) => ({
    asset: a,
    weightPct: parseFloat((rpWeights[i] * 100).toFixed(1)),
    riskContribPct: parseFloat((rpRes.contribs[i] * 100).toFixed(1)),
    volPct: parseFloat((vols[i] * 100).toFixed(1))
  }));

  const comparisonChart = assets.map((a, i) => ({
    asset: a,
    equalWeightRiskPct: parseFloat((ewRes.contribs[i] * 100).toFixed(1)),
    riskParityRiskPct: parseFloat((rpRes.contribs[i] * 100).toFixed(1))
  }));

  return {
    assetWeights,
    portfolioVolPct: parseFloat((rpRes.portVol * 100).toFixed(2)),
    comparisonChart
  };
}
