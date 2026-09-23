import { randomNormal } from './utils';

export interface ARIMAInput {
  phi: number;       // AR(1) coefficient (e.g. 0.7)
  theta: number;     // MA(1) coefficient (e.g. 0.3)
  d: number;         // Integration order (0 or 1)
  historySteps: number; // Past steps (e.g. 60)
  forecastSteps: number; // Future steps (e.g. 15)
}

export interface ARIMAResult {
  historySeries: { step: number; actual: number }[];
  forecastSeries: { step: number; forecast: number; upperCI: number; lowerCI: number }[];
  ar1Coeff: number;
  ma1Coeff: number;
}

export function calculateARIMA(input: ARIMAInput): ARIMAResult {
  const { phi, theta, d, historySteps, forecastSteps } = input;

  const errors: number[] = [0];
  const stationarySeries: number[] = [0];
  const actualSeries: number[] = [100];

  // Generate historical ARMA(1,1) process
  for (let t = 1; t < historySteps; t++) {
    const e = randomNormal(0, 1.2);
    errors.push(e);

    // Y_t = phi * Y_{t-1} + e_t + theta * e_{t-1}
    const y_t = phi * stationarySeries[t - 1] + e + theta * errors[t - 1];
    stationarySeries.push(y_t);

    if (d === 1) {
      // Integrated P_t = P_{t-1} + Y_t
      actualSeries.push(actualSeries[t - 1] + y_t);
    } else {
      actualSeries.push(100 + y_t);
    }
  }

  const historyData = actualSeries.map((val, idx) => ({
    step: idx + 1,
    actual: parseFloat(val.toFixed(2))
  }));

  // Forecast future values
  const lastY = stationarySeries[stationarySeries.length - 1];
  const lastE = errors[errors.length - 1];
  const lastPrice = actualSeries[actualSeries.length - 1];

  const forecastSeries = [];
  let currentStationaryFore = lastY;
  let currentPriceFore = lastPrice;

  for (let h = 1; h <= forecastSteps; h++) {
    let nextY = 0;
    if (h === 1) {
      nextY = phi * lastY + theta * lastE;
    } else {
      nextY = phi * currentStationaryFore;
    }
    currentStationaryFore = nextY;

    if (d === 1) {
      currentPriceFore = currentPriceFore + nextY;
    } else {
      currentPriceFore = 100 + nextY;
    }

    // Confidence Interval expands with forecast horizon sqrt(h)
    const margin = 1.96 * 1.2 * Math.sqrt(h);
    const upper = currentPriceFore + margin;
    const lower = currentPriceFore - margin;

    forecastSeries.push({
      step: historySteps + h,
      forecast: parseFloat(currentPriceFore.toFixed(2)),
      upperCI: parseFloat(upper.toFixed(2)),
      lowerCI: parseFloat(lower.toFixed(2))
    });
  }

  return {
    historySeries: historyData,
    forecastSeries,
    ar1Coeff: phi,
    ma1Coeff: theta
  };
}
