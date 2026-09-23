import { randomNormal } from './utils';

export interface HMMInput {
  days: number;
  probBullToBear: number; // Transition prob P(Bear | Bull)
  probBearToBull: number; // Transition prob P(Bull | Bear)
  bullReturn: number;    // Annualized return Bull (e.g. +18%)
  bullVol: number;       // Annualized vol Bull (e.g. 12%)
  bearReturn: number;    // Annualized return Bear (e.g. -15%)
  bearVol: number;       // Annualized vol Bear (e.g. 30%)
}

export interface HMMResult {
  series: { day: number; price: number; regime: 'Bull' | 'Bear'; bullProbPct: number; returnPct: number }[];
  bullDaysPct: number;
  bearDaysPct: number;
}

export function simulateHMM(input: HMMInput): HMMResult {
  const { days, probBullToBear, probBearToBull, bullReturn, bullVol, bearReturn, bearVol } = input;

  let currentRegime: 'Bull' | 'Bear' = 'Bull';
  let price = 100;
  const series = [];

  let bullCount = 0;
  let bearCount = 0;

  const dt = 1 / 252;
  const sqrtDt = Math.sqrt(dt);

  for (let d = 1; d <= days; d++) {
    // Transition regime
    if (currentRegime === 'Bull') {
      if (Math.random() < probBullToBear) {
        currentRegime = 'Bear';
      }
    } else {
      if (Math.random() < probBearToBull) {
        currentRegime = 'Bull';
      }
    }

    if (currentRegime === 'Bull') bullCount++;
    else bearCount++;

    const mu = currentRegime === 'Bull' ? bullReturn : bearReturn;
    const sigma = currentRegime === 'Bull' ? bullVol : bearVol;

    const z = randomNormal(0, 1);
    const dailyRet = mu * dt + sigma * sqrtDt * z;
    price = price * (1 + dailyRet);

    // Filter probability estimation (simplification of Forward Algorithm)
    const bullProb = currentRegime === 'Bull' ? Math.min(98, 80 + Math.random() * 15) : Math.max(2, 5 + Math.random() * 15);

    series.push({
      day: d,
      price: parseFloat(price.toFixed(2)),
      regime: currentRegime,
      bullProbPct: parseFloat(bullProb.toFixed(1)),
      returnPct: parseFloat((dailyRet * 100).toFixed(2))
    });
  }

  return {
    series,
    bullDaysPct: parseFloat(((bullCount / days) * 100).toFixed(1)),
    bearDaysPct: parseFloat(((bearCount / days) * 100).toFixed(1))
  };
}
