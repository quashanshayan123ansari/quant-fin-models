import { randomNormal } from './utils';

export interface HestonInput {
  S0: number;      // Spot price
  K: number;       // Strike price
  T: number;       // Time to expiry
  r: number;       // Risk free rate
  v0: number;      // Initial variance (sigma^2)
  kappa: number;   // Mean reversion speed
  theta: number;   // Long-run variance
  xi: number;      // Volatility of volatility
  rho: number;     // Correlation between asset and variance
  simulations: number;
}

export interface HestonResult {
  optionPrice: number;
  fellerRatio: number; // 2 * kappa * theta / xi^2 (feller condition > 1)
  samplePaths: { time: number; spot: number; volatilityPct: number }[];
  volatilityDistribution: { volRange: string; count: number }[];
}

export function simulateHeston(input: HestonInput): HestonResult {
  const { S0, K, T, r, v0, kappa, theta, xi, rho, simulations } = input;

  const fellerRatio = (2 * kappa * theta) / (xi * xi);
  const steps = 50;
  const dt = T / steps;
  const sqrtDt = Math.sqrt(dt);

  let totalPayoff = 0;
  const samplePaths: { time: number; spot: number; volatilityPct: number }[] = [];
  const finalVols: number[] = [];

  // Simulate Monte Carlo for Heston SDE
  for (let sim = 0; sim < simulations; sim++) {
    let S = S0;
    let v = v0;
    const isRecordPath = sim === 0;

    if (isRecordPath) {
      samplePaths.push({ time: 0, spot: S0, volatilityPct: Math.sqrt(v0) * 100 });
    }

    for (let t = 1; t <= steps; t++) {
      const z1 = randomNormal(0, 1);
      const z2 = rho * z1 + Math.sqrt(1 - rho * rho) * randomNormal(0, 1);

      // Full truncation scheme for variance non-negativity
      const vPlus = Math.max(v, 0);
      const sqrtVPlus = Math.sqrt(vPlus);

      // Variance SDE: dv = kappa*(theta - v)*dt + xi*sqrt(v)*dW2
      v = v + kappa * (theta - vPlus) * dt + xi * sqrtVPlus * sqrtDt * z2;
      
      // Stock SDE: dS = r*S*dt + sqrt(v)*S*dW1
      S = S * Math.exp((r - 0.5 * vPlus) * dt + sqrtVPlus * sqrtDt * z1);

      if (isRecordPath) {
        samplePaths.push({
          time: parseFloat((t * dt).toFixed(2)),
          spot: parseFloat(S.toFixed(2)),
          volatilityPct: parseFloat((Math.sqrt(Math.max(v, 0)) * 100).toFixed(2))
        });
      }
    }

    finalVols.push(Math.sqrt(Math.max(v, 0)) * 100);
    totalPayoff += Math.max(0, S - K);
  }

  const optionPrice = Math.exp(-r * T) * (totalPayoff / simulations);

  // Volatility Distribution Histogram
  finalVols.sort((a, b) => a - b);
  const minV = finalVols[0];
  const maxV = finalVols[finalVols.length - 1];
  const binCount = 8;
  const binStep = (maxV - minV) / binCount;
  const volatilityDistribution = [];

  for (let b = 0; b < binCount; b++) {
    const bMin = minV + b * binStep;
    const bMax = bMin + binStep;
    const count = finalVols.filter(v => v >= bMin && v <= bMax).length;
    volatilityDistribution.push({
      volRange: `${bMin.toFixed(1)}%-${bMax.toFixed(1)}%`,
      count
    });
  }

  return {
    optionPrice,
    fellerRatio,
    samplePaths,
    volatilityDistribution
  };
}
