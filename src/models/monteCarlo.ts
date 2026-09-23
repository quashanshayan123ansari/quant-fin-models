import { randomNormal } from './utils';

export interface MonteCarloInput {
  S0: number;       // Initial asset price
  mu: number;       // Expected return / drift (decimal)
  sigma: number;    // Volatility (decimal)
  T: number;        // Time horizon in years
  steps: number;    // Number of time steps
  simulations: number; // Number of simulated paths
}

export interface MonteCarloResult {
  paths: { time: number; mean: number; p5: number; p95: number; samplePaths: number[] }[];
  terminalPrices: number[];
  meanTerminal: number;
  stdTerminal: number;
  percentile5: number;
  percentile95: number;
  histogram: { bin: string; count: number }[];
}

export function simulateMonteCarlo(input: MonteCarloInput): MonteCarloResult {
  const { S0, mu, sigma, T, steps, simulations } = input;
  const dt = T / steps;
  const sqrtDt = Math.sqrt(dt);

  // Store terminal prices
  const terminalPrices: number[] = [];
  // Store path values: pathsData[step][sim]
  const pathValues: number[][] = Array.from({ length: steps + 1 }, () => []);

  // Initialize initial price for all simulations
  for (let s = 0; s < simulations; s++) {
    pathValues[0].push(S0);
  }

  // Simulate paths
  for (let s = 0; s < simulations; s++) {
    let currentS = S0;
    for (let t = 1; t <= steps; t++) {
      const z = randomNormal(0, 1);
      const drift = (mu - 0.5 * sigma * sigma) * dt;
      const diffusion = sigma * sqrtDt * z;
      currentS = currentS * Math.exp(drift + diffusion);
      pathValues[t].push(currentS);
    }
    terminalPrices.push(currentS);
  }

  // Calculate stats for each step
  const paths: { time: number; mean: number; p5: number; p95: number; samplePaths: number[] }[] = [];
  const numSamplePaths = Math.min(5, simulations);

  for (let t = 0; t <= steps; t++) {
    const timeVal = parseFloat((t * dt).toFixed(2));
    const vals = pathValues[t].slice().sort((a, b) => a - b);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const p5 = vals[Math.floor(0.05 * vals.length)];
    const p95 = vals[Math.floor(0.95 * vals.length)];
    const samples = vals.slice(0, numSamplePaths);

    paths.push({
      time: timeVal,
      mean: parseFloat(mean.toFixed(2)),
      p5: parseFloat(p5.toFixed(2)),
      p95: parseFloat(p95.toFixed(2)),
      samplePaths: samples.map(v => parseFloat(v.toFixed(2)))
    });
  }

  // Sort terminal prices for statistics
  terminalPrices.sort((a, b) => a - b);
  const meanTerminal = terminalPrices.reduce((a, b) => a + b, 0) / simulations;
  const variance = terminalPrices.reduce((a, b) => a + Math.pow(b - meanTerminal, 2), 0) / simulations;
  const stdTerminal = Math.sqrt(variance);
  const percentile5 = terminalPrices[Math.floor(0.05 * simulations)];
  const percentile95 = terminalPrices[Math.floor(0.95 * simulations)];

  // Create histogram bins
  const minP = terminalPrices[0];
  const maxP = terminalPrices[terminalPrices.length - 1];
  const binCount = 12;
  const binWidth = (maxP - minP) / binCount;
  const histogram: { bin: string; count: number }[] = [];

  for (let i = 0; i < binCount; i++) {
    const bMin = minP + i * binWidth;
    const bMax = bMin + binWidth;
    const count = terminalPrices.filter(p => p >= bMin && (i === binCount - 1 ? p <= bMax : p < bMax)).length;
    histogram.push({
      bin: `$${Math.round(bMin)}-$${Math.round(bMax)}`,
      count
    });
  }

  return {
    paths,
    terminalPrices,
    meanTerminal,
    stdTerminal,
    percentile5,
    percentile95,
    histogram
  };
}
