export interface PortfolioInput {
  riskFreeRate: number; // e.g. 0.04
  assetCount: number;   // 3 or 4 assets
  assetReturns: number[]; // e.g. [0.12, 0.08, 0.15, 0.06]
  assetVols: number[];    // e.g. [0.20, 0.12, 0.25, 0.08]
  correlation: number;    // Average asset correlation
}

export interface PortfolioResult {
  maxSharpeWeights: number[];
  maxSharpeReturnPct: number;
  maxSharpeVolPct: number;
  maxSharpeRatio: number;
  minVarWeights: number[];
  minVarReturnPct: number;
  minVarVolPct: number;
  frontierChart: { volPct: number; returnPct: number; sharpe: number; isTangency?: boolean; isMinVar?: boolean }[];
  assetPoints: { name: string; volPct: number; returnPct: number }[];
}

export function calculatePortfolioOptimization(input: PortfolioInput): PortfolioResult {
  const { riskFreeRate, assetReturns, assetVols, correlation } = input;
  const N = assetReturns.length;
  const assetNames = ['US Equities (SPY)', 'Tech Growth (QQQ)', 'EM Equities (EEM)', 'US Treasury (TLT)'].slice(0, N);

  // Asset points
  const assetPoints = assetReturns.map((r, i) => ({
    name: assetNames[i],
    returnPct: parseFloat((r * 100).toFixed(2)),
    volPct: parseFloat((assetVols[i] * 100).toFixed(2))
  }));

  // Generate 500 random portfolio weights to sample Efficient Frontier
  const samples = 600;
  const frontiers: { returnPct: number; volPct: number; sharpe: number; weights: number[] }[] = [];

  for (let s = 0; s < samples; s++) {
    const rawWeights = Array.from({ length: N }, () => Math.random());
    const sumW = rawWeights.reduce((a, b) => a + b, 0);
    const w = rawWeights.map(x => x / sumW);

    // Expected Return = w^T * mu
    const portRet = w.reduce((sum, weight, i) => sum + weight * assetReturns[i], 0);

    // Variance = w^T * Sigma * w
    let portVar = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const cov = i === j ? assetVols[i] * assetVols[i] : correlation * assetVols[i] * assetVols[j];
        portVar += w[i] * w[j] * cov;
      }
    }
    const portVol = Math.sqrt(Math.max(0.0001, portVar));
    const sharpe = (portRet - riskFreeRate) / portVol;

    frontiers.push({
      returnPct: parseFloat((portRet * 100).toFixed(2)),
      volPct: parseFloat((portVol * 100).toFixed(2)),
      sharpe: parseFloat(sharpe.toFixed(2)),
      weights: w.map(x => parseFloat(x.toFixed(3)))
    });
  }

  // Find Tangency (Max Sharpe) & Minimum Variance
  frontiers.sort((a, b) => b.sharpe - a.sharpe);
  const maxSharpePort = frontiers[0];

  frontiers.sort((a, b) => a.volPct - b.volPct);
  const minVarPort = frontiers[0];

  // Efficient Frontier Chart curve
  const frontierChart = frontiers.map(p => ({
    volPct: p.volPct,
    returnPct: p.returnPct,
    sharpe: p.sharpe,
    isTangency: p.sharpe === maxSharpePort.sharpe,
    isMinVar: p.volPct === minVarPort.volPct
  })).sort((a, b) => a.volPct - b.volPct);

  return {
    maxSharpeWeights: maxSharpePort.weights,
    maxSharpeReturnPct: maxSharpePort.returnPct,
    maxSharpeVolPct: maxSharpePort.volPct,
    maxSharpeRatio: maxSharpePort.sharpe,
    minVarWeights: minVarPort.weights,
    minVarReturnPct: minVarPort.returnPct,
    minVarVolPct: minVarPort.volPct,
    frontierChart,
    assetPoints
  };
}
