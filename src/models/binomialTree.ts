export interface BinomialInput {
  S: number;       // Spot price
  K: number;       // Strike price
  T: number;       // Time to expiry (years)
  r: number;       // Risk-free rate (decimal)
  v: number;       // Volatility (decimal)
  steps: number;   // Number of tree steps (e.g., 5 to 50)
  isAmerican: boolean;
  optionType: 'call' | 'put';
  skipConvergence?: boolean;
}

export interface TreeNode {
  spot: number;
  optionValue: number;
  isEarlyExercised?: boolean;
}

export interface BinomialResult {
  price: number;
  u: number;
  d: number;
  p: number;
  dt: number;
  tree: TreeNode[][];
  stepChart: { step: number; europeanPrice: number; americanPrice: number }[];
}

export function calculateBinomialTree(input: BinomialInput): BinomialResult {
  const { S, K, T, r, v, steps, optionType, isAmerican, skipConvergence } = input;
  const dt = T / Math.max(1, steps);
  const u = Math.exp(v * Math.sqrt(dt));
  const d = 1 / u;
  const discount = Math.exp(-r * dt);
  const p = (Math.exp(r * dt) - d) / (u - d);

  // Build tree of spots
  const spotTree: number[][] = [];
  for (let i = 0; i <= steps; i++) {
    const layer: number[] = [];
    for (let j = 0; j <= i; j++) {
      layer.push(S * Math.pow(u, j) * Math.pow(d, i - j));
    }
    spotTree.push(layer);
  }

  // Calculate option values at maturity
  const valTree: TreeNode[][] = Array.from({ length: steps + 1 }, () => []);
  for (let j = 0; j <= steps; j++) {
    const s = spotTree[steps][j];
    const payoff = optionType === 'call' ? Math.max(0, s - K) : Math.max(0, K - s);
    valTree[steps].push({ spot: s, optionValue: payoff });
  }

  // Backward induction for American / European option
  for (let i = steps - 1; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      const spot = spotTree[i][j];
      const continuation = discount * (p * valTree[i + 1][j + 1].optionValue + (1 - p) * valTree[i + 1][j].optionValue);
      const immediate = optionType === 'call' ? Math.max(0, spot - K) : Math.max(0, K - spot);
      
      let finalVal = continuation;
      let earlyEx = false;

      if (isAmerican && immediate > continuation + 1e-6) {
        finalVal = immediate;
        earlyEx = true;
      }

      valTree[i].push({
        spot: parseFloat(spot.toFixed(2)),
        optionValue: parseFloat(finalVal.toFixed(2)),
        isEarlyExercised: earlyEx
      });
    }
  }

  // Generate comparison chart across steps ONLY if skipConvergence is false
  const stepChart: { step: number; europeanPrice: number; americanPrice: number }[] = [];
  if (!skipConvergence) {
    for (let st = 3; st <= Math.min(steps + 15, 30); st += 3) {
      const resEur = calculateBinomialTree({ ...input, steps: st, isAmerican: false, skipConvergence: true });
      const resAmer = calculateBinomialTree({ ...input, steps: st, isAmerican: true, skipConvergence: true });
      stepChart.push({
        step: st,
        europeanPrice: parseFloat(resEur.price.toFixed(2)),
        americanPrice: parseFloat(resAmer.price.toFixed(2))
      });
    }
  }

  return {
    price: valTree[0][0].optionValue,
    u,
    d,
    p,
    dt,
    tree: valTree,
    stepChart
  };
}
