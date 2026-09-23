export interface PCAInput {
  parallelShift: number;  // Level shift (+/- bps)
  steepening: number;     // Slope (+/- bps)
  curvature: number;      // Humpe/Curvature (+/- bps)
}

export interface PCAResult {
  explainedVariancePct: { component: string; variancePct: number; cumulativePct: number }[];
  yieldCurveChart: { maturityYears: number; originalYieldPct: number; reconstructedYieldPct: number }[];
  componentsChart: { maturityYears: number; pc1Level: number; pc2Slope: number; pc3Curvature: number }[];
}

export function calculatePCA(input: PCAInput): PCAResult {
  const { parallelShift, steepening, curvature } = input;

  const maturities = [0.5, 1, 2, 3, 5, 7, 10, 20, 30];
  
  // Baseline Treasury yield curve
  const baseYields = [3.5, 3.7, 4.0, 4.15, 4.3, 4.45, 4.6, 4.8, 4.9];

  // PCs for Yield Curve:
  // PC1 (Level): flat load ~ +1.0
  // PC2 (Slope): linear load from -1.0 to +1.0
  // PC3 (Curvature): parabolic load -1.0 at ends, +1.0 at middle
  const componentsChart = maturities.map((m, i) => {
    const normM = (m - 0.5) / 29.5; // 0 to 1
    const pc1 = 1.0;
    const pc2 = 2 * (normM - 0.5); // -1 to +1
    const pc3 = 1 - 4 * Math.pow(normM - 0.5, 2); // parabola

    return {
      maturityYears: m,
      pc1Level: parseFloat(pc1.toFixed(3)),
      pc2Slope: parseFloat(pc2.toFixed(3)),
      pc3Curvature: parseFloat(pc3.toFixed(3))
    };
  });

  // Reconstructed Yield Curve under shift
  const yieldCurveChart = maturities.map((m, i) => {
    const baseY = baseYields[i];
    const comp = componentsChart[i];

    const deltaY = (parallelShift / 100) * comp.pc1Level +
                   (steepening / 100) * comp.pc2Slope +
                   (curvature / 100) * comp.pc3Curvature;

    const reconY = baseY + deltaY;

    return {
      maturityYears: m,
      originalYieldPct: parseFloat(baseY.toFixed(2)),
      reconstructedYieldPct: parseFloat(reconY.toFixed(2))
    };
  });

  const explainedVariancePct = [
    { component: 'PC1 (Level)', variancePct: 88.5, cumulativePct: 88.5 },
    { component: 'PC2 (Slope)', variancePct: 8.2, cumulativePct: 96.7 },
    { component: 'PC3 (Curvature)', variancePct: 2.8, cumulativePct: 99.5 }
  ];

  return {
    explainedVariancePct,
    yieldCurveChart,
    componentsChart
  };
}
