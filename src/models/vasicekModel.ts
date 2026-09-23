import { randomNormal } from './utils';

export interface VasicekInput {
  r0: number;       // Initial interest rate (e.g. 0.05)
  a: number;        // Speed of mean reversion
  b: number;        // Long-term mean rate
  sigma: number;    // Volatility of short rate
  horizonYears: number; // Time horizon
  simulations: number;
}

export interface VasicekResult {
  yieldCurve: { maturity: number; zeroRatePct: number; bondPrice: number }[];
  simulatedPaths: { time: number; meanRatePct: number; path1Pct: number; path2Pct: number }[];
  terminalMeanRatePct: number;
}

export function simulateVasicek(input: VasicekInput): VasicekResult {
  const { r0, a, b, sigma, horizonYears, simulations } = input;

  // 1. Analytical Yield Curve for Zero Coupon Bonds
  // B(t, T) = (1 - e^(-a(T-t))) / a
  // A(t, T) = exp((b - sigma^2 / (2*a^2)) * (B(t,T) - (T-t)) - (sigma^2 / (4*a)) * B(t,T)^2)
  // P(t, T) = A(t, T) * exp(-r0 * B(t, T))
  const yieldCurve = [];
  for (let T = 0.5; T <= Math.min(horizonYears, 30); T += 0.5) {
    const B_val = (1 - Math.exp(-a * T)) / a;
    const A_val = Math.exp((b - (sigma * sigma) / (2 * a * a)) * (B_val - T) - ((sigma * sigma) / (4 * a)) * B_val * B_val);
    const bondPrice = A_val * Math.exp(-r0 * B_val);
    const zeroRate = -Math.log(bondPrice) / T;

    yieldCurve.push({
      maturity: T,
      zeroRatePct: parseFloat((zeroRate * 100).toFixed(2)),
      bondPrice: parseFloat(bondPrice.toFixed(4))
    });
  }

  // 2. Monte Carlo path simulation for short rate SDE: dr = a(b-r)dt + sigma*dW
  const steps = 40;
  const dt = horizonYears / steps;
  const sqrtDt = Math.sqrt(dt);

  const pathMatrix: number[][] = Array.from({ length: steps + 1 }, () => []);
  for (let s = 0; s < simulations; s++) {
    pathMatrix[0].push(r0);
  }

  for (let s = 0; s < simulations; s++) {
    let r = r0;
    for (let t = 1; t <= steps; t++) {
      const z = randomNormal(0, 1);
      r = r + a * (b - r) * dt + sigma * sqrtDt * z;
      pathMatrix[t].push(r);
    }
  }

  const simulatedPaths = [];
  for (let t = 0; t <= steps; t++) {
    const timeVal = parseFloat((t * dt).toFixed(2));
    const vals = pathMatrix[t];
    const meanR = vals.reduce((sum, v) => sum + v, 0) / vals.length;
    
    simulatedPaths.push({
      time: timeVal,
      meanRatePct: parseFloat((meanR * 100).toFixed(2)),
      path1Pct: parseFloat((vals[0] * 100).toFixed(2)),
      path2Pct: parseFloat((vals[Math.min(1, vals.length - 1)] * 100).toFixed(2))
    });
  }

  const finalVals = pathMatrix[steps];
  const terminalMeanRatePct = (finalVals.reduce((sum, v) => sum + v, 0) / finalVals.length) * 100;

  return {
    yieldCurve,
    simulatedPaths,
    terminalMeanRatePct
  };
}
