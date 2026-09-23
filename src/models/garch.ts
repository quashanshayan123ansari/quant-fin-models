import { randomNormal } from './utils';

export interface GARCHInput {
  omega: number;   // Long-term baseline variance parameter (w)
  alpha: number;   // ARCH coefficient (reaction to news shock)
  beta: number;    // GARCH coefficient (volatility persistence)
  days: number;    // Simulation timeframe (e.g. 100 days)
  initialVol: number; // Initial annualized volatility (e.g. 0.20)
}

export interface GARCHResult {
  unconditionalVol: number;
  persistence: number;
  series: { day: number; returnPct: number; conditionalVolPct: number; upperBandPct: number; lowerBandPct: number }[];
  forecastVolPct: number;
}

export function calculateGARCH(input: GARCHInput): GARCHResult {
  const { omega, alpha, beta, days, initialVol } = input;

  const persistence = alpha + beta;
  const longTermVar = omega / Math.max(0.0001, 1 - persistence);
  const unconditionalVol = Math.sqrt(Math.max(0, longTermVar)) * Math.sqrt(252);

  // Daily variance
  let currentVar = (initialVol * initialVol) / 252;
  const series = [];

  for (let d = 1; d <= days; d++) {
    const z = randomNormal(0, 1);
    const dailyVol = Math.sqrt(currentVar);
    const dailyReturn = dailyVol * z;

    const annVol = dailyVol * Math.sqrt(252);
    const annRet = dailyReturn * Math.sqrt(252);

    series.push({
      day: d,
      returnPct: parseFloat((annRet * 100).toFixed(2)),
      conditionalVolPct: parseFloat((annVol * 100).toFixed(2)),
      upperBandPct: parseFloat((annVol * 2 * 100).toFixed(2)),
      lowerBandPct: parseFloat((-annVol * 2 * 100).toFixed(2))
    });

    // Update conditional variance: sigma_t^2 = w + alpha * eps_{t-1}^2 + beta * sigma_{t-1}^2
    const epsSquared = dailyReturn * dailyReturn;
    currentVar = omega + alpha * epsSquared + beta * currentVar;
  }

  // 10-day forward forecast
  let forecastVar = currentVar;
  for (let f = 0; f < 10; f++) {
    forecastVar = omega + persistence * forecastVar;
  }
  const forecastVolPct = Math.sqrt(forecastVar * 252) * 100;

  return {
    unconditionalVol,
    persistence,
    series,
    forecastVolPct
  };
}
