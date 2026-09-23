import { normalCDF, inverseNormalCDF, randomNormal } from './utils';

export interface CopulaInput {
  correlation: number;    // Asset correlation rho (-1 to 1)
  defaultProb1: number;   // Default probability asset 1 (PD1)
  defaultProb2: number;   // Default probability asset 2 (PD2)
  simulations: number;    // Monte Carlo count
  copulaType: 'gaussian' | 'student-t';
  degreesOfFreedom: number; // For student-t copula
}

export interface CopulaResult {
  jointDefaultProb: number;
  standaloneProb1: number;
  standaloneProb2: number;
  conditionalProb: number; // P(Default 2 | Default 1)
  scatterPlot: { u1: number; u2: number; isJointDefault: boolean }[];
}

export function simulateCopula(input: CopulaInput): CopulaResult {
  const { correlation, defaultProb1, defaultProb2, simulations, copulaType, degreesOfFreedom } = input;

  const C1 = inverseNormalCDF(defaultProb1);
  const C2 = inverseNormalCDF(defaultProb2);

  let jointDefaults = 0;
  let def1Count = 0;
  let def2Count = 0;

  const scatterPlot: { u1: number; u2: number; isJointDefault: boolean }[] = [];
  const numScatterPoints = Math.min(600, simulations);

  for (let i = 0; i < simulations; i++) {
    // Generate correlated normal variates (Z1, Z2)
    const z1 = randomNormal(0, 1);
    const z2 = correlation * z1 + Math.sqrt(Math.max(0, 1 - correlation * correlation)) * randomNormal(0, 1);

    let x1 = z1;
    let x2 = z2;

    if (copulaType === 'student-t') {
      // Scale by chi-square variable for t-copula tail dependence
      let chiSq = 0;
      for (let df = 0; df < degreesOfFreedom; df++) {
        const zn = randomNormal(0, 1);
        chiSq += zn * zn;
      }
      const scale = Math.sqrt(degreesOfFreedom / Math.max(0.1, chiSq));
      x1 = z1 * scale;
      x2 = z2 * scale;
    }

    const u1 = normalCDF(x1);
    const u2 = normalCDF(x2);

    const isDef1 = z1 <= C1;
    const isDef2 = z2 <= C2;
    const isJoint = isDef1 && isDef2;

    if (isDef1) def1Count++;
    if (isDef2) def2Count++;
    if (isJoint) jointDefaults++;

    if (i < numScatterPoints) {
      scatterPlot.push({
        u1: parseFloat(u1.toFixed(3)),
        u2: parseFloat(u2.toFixed(3)),
        isJointDefault: isJoint
      });
    }
  }

  const jointDefaultProb = jointDefaults / simulations;
  const standaloneProb1 = def1Count / simulations;
  const standaloneProb2 = def2Count / simulations;
  const conditionalProb = standaloneProb1 > 0 ? jointDefaultProb / standaloneProb1 : 0;

  return {
    jointDefaultProb,
    standaloneProb1,
    standaloneProb2,
    conditionalProb,
    scatterPlot
  };
}
