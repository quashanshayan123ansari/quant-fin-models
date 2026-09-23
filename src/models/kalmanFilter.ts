import { randomNormal } from './utils';

export interface KalmanInput {
  days: number;           // Timeframe in days
  initialBeta: number;    // Initial hedge ratio
  processNoiseQ: number;  // Process variance Q (e.g. 1e-4)
  measurementNoiseR: number; // Measurement variance R (e.g. 1e-2)
}

export interface KalmanResult {
  series: { day: number; assetY: number; assetX: number; estimatedBeta: number; zScore: number; spread: number }[];
  finalBeta: number;
  latestZScore: number;
}

export function simulateKalmanFilter(input: KalmanInput): KalmanResult {
  const { days, initialBeta, processNoiseQ, measurementNoiseR } = input;

  let beta = initialBeta;
  let P = 1.0; // Estimate error variance

  let px = 100;
  let py = 100 * initialBeta;

  const series = [];

  for (let d = 1; d <= days; d++) {
    // True beta evolves slowly with random walk
    const trueBetaChange = randomNormal(0, 0.005);
    const actualBeta = (series.length > 0 ? series[series.length - 1].estimatedBeta : initialBeta) + trueBetaChange;

    // Simulate price movements
    const retX = randomNormal(0.0005, 0.015);
    const noiseY = randomNormal(0, 0.008);
    px = px * (1 + retX);
    py = px * actualBeta + noiseY * px;

    // Kalman Filter Update
    // Predict step
    const betaPrior = beta;
    const PPrior = P + processNoiseQ;

    // Measurement step
    // y_t = beta_t * x_t + e_t
    const H = px; // Observation matrix
    const y = py;
    const yHat = H * betaPrior;
    const error = y - yHat;

    // Innovation variance S = H * P * H^T + R
    const S = H * PPrior * H + measurementNoiseR * 1000;
    // Kalman Gain K = P * H^T * S^-1
    const K = (PPrior * H) / S;

    // State update
    beta = betaPrior + K * error;
    P = (1 - K * H) * PPrior;

    const spread = py - beta * px;
    // Estimate spread rolling standard deviation approximation
    const approxStd = Math.sqrt(measurementNoiseR * 1000);
    const zScore = spread / Math.max(0.1, approxStd);

    series.push({
      day: d,
      assetY: parseFloat(py.toFixed(2)),
      assetX: parseFloat(px.toFixed(2)),
      estimatedBeta: parseFloat(beta.toFixed(4)),
      zScore: parseFloat(zScore.toFixed(2)),
      spread: parseFloat(spread.toFixed(2))
    });
  }

  return {
    series,
    finalBeta: beta,
    latestZScore: series[series.length - 1].zScore
  };
}
