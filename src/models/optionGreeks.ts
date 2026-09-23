import { normalCDF, normalPDF } from './utils';

export interface GreeksInput {
  S: number;  // Spot price
  K: number;  // Strike price
  T: number;  // Time to expiry
  r: number;  // Risk free rate
  v: number;  // Volatility
}

export interface GreeksResult {
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
  greekCurves: { spot: number; delta: number; gamma: number; vega: number; theta: number }[];
}

export function calculateOptionGreeks(input: GreeksInput): GreeksResult {
  const { S, K, T, r, v } = input;

  const sqrtT = Math.sqrt(Math.max(T, 0.0001));
  const d1 = (Math.log(S / K) + (r + 0.5 * v * v) * T) / (v * sqrtT);
  const d2 = d1 - v * sqrtT;

  const delta = normalCDF(d1);
  const gamma = normalPDF(d1) / (S * v * sqrtT);
  const vega = (S * sqrtT * normalPDF(d1)) / 100;
  const theta = (- (S * v * normalPDF(d1)) / (2 * sqrtT) - r * K * Math.exp(-r * T) * normalCDF(d2)) / 365;
  const rho = (K * T * Math.exp(-r * T) * normalCDF(d2)) / 100;

  // Curves across spot price
  const greekCurves = [];
  const minSpot = K * 0.5;
  const maxSpot = K * 1.5;
  const steps = 30;
  const stepSize = (maxSpot - minSpot) / steps;

  for (let i = 0; i <= steps; i++) {
    const s = minSpot + i * stepSize;
    const cd1 = (Math.log(s / K) + (r + 0.5 * v * v) * T) / (v * sqrtT);
    const cd2 = cd1 - v * sqrtT;

    const d = normalCDF(cd1);
    const g = normalPDF(cd1) / (s * v * sqrtT);
    const vg = (s * sqrtT * normalPDF(cd1)) / 100;
    const th = (- (s * v * normalPDF(cd1)) / (2 * sqrtT) - r * K * Math.exp(-r * T) * normalCDF(cd2)) / 365;

    greekCurves.push({
      spot: parseFloat(s.toFixed(2)),
      delta: parseFloat(d.toFixed(3)),
      gamma: parseFloat(g.toFixed(4)),
      vega: parseFloat(vg.toFixed(3)),
      theta: parseFloat(th.toFixed(3))
    });
  }

  return {
    delta,
    gamma,
    vega,
    theta,
    rho,
    greekCurves
  };
}
