export interface SABRInput {
  F: number;        // Forward price (e.g. 100)
  T: number;        // Expiry time (years)
  alpha: number;    // Initial volatility level
  beta: number;     // CEV exponent (0 for Normal, 1 for Lognormal)
  rho: number;      // Correlation between asset and volatility (-1 to 1)
  nu: number;       // Volatility of volatility (vol-of-vol)
}

export interface SABRResult {
  atmVolPct: number;
  smileChart: { strike: number; sabrVolPct: number; lognormalVolPct: number }[];
}

// Hagan et al. (2002) SABR Implied Volatility Expansion Formula
export function calculateSABR(input: SABRInput): SABRResult {
  const { F, T, alpha, beta, rho, nu } = input;

  const strikes = [];
  const minK = F * 0.6;
  const maxK = F * 1.4;
  const steps = 30;
  const stepSize = (maxK - minK) / steps;

  function sabrVol(K: number): number {
    if (Math.abs(F - K) < 1e-5) {
      // ATM formula
      const FK = F;
      const term1 = alpha / Math.pow(FK, 1 - beta);
      const term2 = 1 + (((1 - beta) * (1 - beta) * alpha * alpha) / (24 * Math.pow(FK, 2 - 2 * beta)) +
                     (rho * beta * nu * alpha) / (4 * Math.pow(FK, 1 - beta)) +
                     ((2 - 3 * rho * rho) * nu * nu) / 24) * T;
      return term1 * term2;
    }

    const FK = F * K;
    const logFK = Math.log(F / K);
    const FKBeta = Math.pow(FK, (1 - beta) / 2);

    const z = (nu / alpha) * FKBeta * logFK;
    const xz = Math.log((Math.sqrt(1 - 2 * rho * z + z * z) + z - rho) / (1 - rho));

    const factor1 = alpha / (FKBeta * (1 + (Math.pow(1 - beta, 2) / 24) * Math.pow(logFK, 2) + (Math.pow(1 - beta, 4) / 1920) * Math.pow(logFK, 4)));
    const factor2 = Math.abs(z) < 1e-5 ? 1 : z / xz;
    const factor3 = 1 + (((Math.pow(1 - beta, 2) / 24) * alpha * alpha) / Math.pow(FK, 1 - beta) +
                    (rho * beta * nu * alpha) / (4 * FKBeta) +
                    ((2 - 3 * rho * rho) / 24) * nu * nu) * T;

    return factor1 * factor2 * factor3;
  }

  const smileChart = [];
  for (let i = 0; i <= steps; i++) {
    const K = minK + i * stepSize;
    const vol = sabrVol(K);
    const flatVol = sabrVol(F);

    smileChart.push({
      strike: parseFloat(K.toFixed(2)),
      sabrVolPct: parseFloat((vol * 100).toFixed(2)),
      lognormalVolPct: parseFloat((flatVol * 100).toFixed(2))
    });
  }

  return {
    atmVolPct: parseFloat((sabrVol(F) * 100).toFixed(2)),
    smileChart
  };
}
