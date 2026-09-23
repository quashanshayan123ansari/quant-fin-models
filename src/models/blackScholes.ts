import { normalCDF, normalPDF } from './utils';

export interface BSMInput {
  S: number;  // Spot price
  K: number;  // Strike price
  T: number;  // Time to expiration in years
  r: number;  // Risk-free rate (decimal)
  v: number;  // Volatility (decimal)
}

export interface BSMResult {
  callPrice: number;
  putPrice: number;
  d1: number;
  d2: number;
  callDelta: number;
  putDelta: number;
  gamma: number;
  vega: number;
  callTheta: number;
  putTheta: number;
  callRho: number;
  putRho: number;
  payoffChart: { spot: number; callPayoff: number; putPayoff: number; callValue: number; putValue: number }[];
}

export function calculateBSM(input: BSMInput): BSMResult {
  const { S, K, T, r, v } = input;
  const sqrtT = Math.sqrt(Math.max(T, 0.0001));
  const d1 = (Math.log(S / K) + (r + (v * v) / 2) * T) / (v * sqrtT);
  const d2 = d1 - v * sqrtT;

  const Nd1 = normalCDF(d1);
  const Nd2 = normalCDF(d2);
  const NMd1 = normalCDF(-d1);
  const NMd2 = normalCDF(-d2);
  const npd1 = normalPDF(d1);

  const expRT = Math.exp(-r * T);

  const callPrice = S * Nd1 - K * expRT * Nd2;
  const putPrice = K * expRT * NMd2 - S * NMd1;

  // Greeks
  const callDelta = Nd1;
  const putDelta = Nd1 - 1;
  const gamma = npd1 / (S * v * sqrtT);
  const vega = (S * sqrtT * npd1) / 100; // per 1% vol change

  const callTheta = (- (S * v * npd1) / (2 * sqrtT) - r * K * expRT * Nd2) / 365;
  const putTheta = (- (S * v * npd1) / (2 * sqrtT) + r * K * expRT * NMd2) / 365;

  const callRho = (K * T * expRT * Nd2) / 100;
  const putRho = (-K * T * expRT * NMd2) / 100;

  // Generate curve for spot price from 50% to 150% of K
  const payoffChart = [];
  const minSpot = Math.max(1, K * 0.5);
  const maxSpot = K * 1.5;
  const steps = 30;
  const stepSize = (maxSpot - minSpot) / steps;

  for (let i = 0; i <= steps; i++) {
    const spot = minSpot + i * stepSize;
    const cd1 = (Math.log(spot / K) + (r + (v * v) / 2) * T) / (v * sqrtT);
    const cd2 = cd1 - v * sqrtT;
    const cVal = spot * normalCDF(cd1) - K * expRT * normalCDF(cd2);
    const pVal = K * expRT * normalCDF(-cd2) - spot * normalCDF(-cd1);

    payoffChart.push({
      spot: parseFloat(spot.toFixed(2)),
      callPayoff: Math.max(0, spot - K),
      putPayoff: Math.max(0, K - spot),
      callValue: parseFloat(Math.max(0, cVal).toFixed(2)),
      putValue: parseFloat(Math.max(0, pVal).toFixed(2))
    });
  }

  return {
    callPrice,
    putPrice,
    d1,
    d2,
    callDelta,
    putDelta,
    gamma,
    vega,
    callTheta,
    putTheta,
    callRho,
    putRho,
    payoffChart
  };
}
