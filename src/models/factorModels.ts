export interface FactorInput {
  rf: number;              // Risk free rate
  mktPremium: number;      // Market risk premium (Rm - Rf)
  smbPremium: number;      // Size factor (Small Minus Big)
  hmlPremium: number;      // Value factor (High Minus Low)
  betaMkt: number;         // Market beta
  betaSMB: number;         // Size beta
  betaHML: number;         // Value beta
  alpha: number;           // Abnormal return (Jensen's alpha)
}

export interface FactorResult {
  expectedReturn: number;
  mktContribution: number;
  smbContribution: number;
  hmlContribution: number;
  breakdownChart: { factor: string; contributionPct: number; beta: number }[];
}

export function calculateFactorModel(input: FactorInput): FactorResult {
  const { rf, mktPremium, smbPremium, hmlPremium, betaMkt, betaSMB, betaHML, alpha } = input;

  const mktContribution = betaMkt * mktPremium;
  const smbContribution = betaSMB * smbPremium;
  const hmlContribution = betaHML * hmlPremium;

  const expectedReturn = rf + alpha + mktContribution + smbContribution + hmlContribution;

  const breakdownChart = [
    { factor: 'Risk-Free Rate (Rf)', contributionPct: parseFloat((rf * 100).toFixed(2)), beta: 1.0 },
    { factor: 'Market Factor (MKT)', contributionPct: parseFloat((mktContribution * 100).toFixed(2)), beta: betaMkt },
    { factor: 'Size Factor (SMB)', contributionPct: parseFloat((smbContribution * 100).toFixed(2)), beta: betaSMB },
    { factor: 'Value Factor (HML)', contributionPct: parseFloat((hmlContribution * 100).toFixed(2)), beta: betaHML },
    { factor: 'Alpha (α)', contributionPct: parseFloat((alpha * 100).toFixed(2)), beta: 0 }
  ];

  return {
    expectedReturn,
    mktContribution,
    smbContribution,
    hmlContribution,
    breakdownChart
  };
}
