import { randomNormal } from './utils';

export interface MLAlphaInput {
  days: number;           // Backtest period (days)
  treeDepth: number;      // Depth of Random Forest trees
  featureCount: number;   // Number of alpha features (RSI, MACD, Vol, Mom, Sent)
  signalThreshold: number;// Signal entry threshold
}

export interface MLAlphaResult {
  accuracyPct: number;
  sharpeRatio: number;
  cumulativeReturns: { day: number; strategyPct: number; benchmarkPct: number }[];
  featureImportance: { feature: string; importancePct: number }[];
  precisionPct: number;
  recallPct: number;
}

export function calculateMLAlpha(input: MLAlphaInput): MLAlphaResult {
  const { days, treeDepth, featureCount, signalThreshold } = input;

  const features = ['Momentum 14D', 'RSI Oscillations', 'Vol Clustering', 'MACD Divergence', 'Sentiment Score'].slice(0, featureCount);
  
  // Feature importances summing to 100%
  const rawImp = [0.35, 0.25, 0.20, 0.12, 0.08].slice(0, featureCount);
  const sumImp = rawImp.reduce((a, b) => a + b, 0);
  const featureImportance = features.map((f, i) => ({
    feature: f,
    importancePct: parseFloat(((rawImp[i] / sumImp) * 100).toFixed(1))
  }));

  // Backtest simulation
  let cumStrategy = 100;
  let cumBenchmark = 100;

  const cumulativeReturns = [];
  let correctPredictions = 0;

  for (let d = 1; d <= days; d++) {
    const marketRet = randomNormal(0.0004, 0.012);
    
    // ML prediction signal with accuracy scaled by tree depth
    const accuracy = 0.52 + (treeDepth / 20) * 0.08;
    const isCorrect = Math.random() < accuracy;
    if (isCorrect) correctPredictions++;

    const trueDirection = Math.sign(marketRet);
    const predictedDirection = isCorrect ? trueDirection : -trueDirection;

    const signal = Math.abs(predictedDirection) >= signalThreshold ? predictedDirection : 0;
    const stratRet = signal * marketRet;

    cumBenchmark = cumBenchmark * (1 + marketRet);
    cumStrategy = cumStrategy * (1 + stratRet);

    cumulativeReturns.push({
      day: d,
      strategyPct: parseFloat(((cumStrategy - 100)).toFixed(2)),
      benchmarkPct: parseFloat(((cumBenchmark - 100)).toFixed(2))
    });
  }

  const accuracyPct = parseFloat(((correctPredictions / days) * 100).toFixed(1));
  const precisionPct = parseFloat((accuracyPct * 0.95).toFixed(1));
  const recallPct = parseFloat((accuracyPct * 0.92).toFixed(1));
  
  const finalStrat = cumulativeReturns[cumulativeReturns.length - 1].strategyPct / 100;
  const annStrat = (finalStrat) * (252 / days);
  const sharpeRatio = parseFloat((annStrat / 0.15).toFixed(2));

  return {
    accuracyPct,
    sharpeRatio,
    cumulativeReturns,
    featureImportance,
    precisionPct,
    recallPct
  };
}
