/**
 * Industry ids, labels and placeholder cost-per-lead ranges.
 * CPL ranges are planning placeholders (verified: false). Replace them with
 * your own account data. Descriptive copy lives in content/industries.ts.
 */
export const INDUSTRIES = [
  { id: 'real-estate', label: 'Real estate', short: 'Real estate' },
  { id: 'healthcare', label: 'Healthcare & hospitals', short: 'Healthcare' },
  { id: 'education', label: 'Education', short: 'Education' },
  { id: 'fmcg-d2c', label: 'FMCG & D2C', short: 'FMCG & D2C' },
  { id: 'bfsi', label: 'BFSI & fintech', short: 'BFSI' },
  { id: 'auto-ev', label: 'Auto & EV', short: 'Auto & EV' },
  { id: 'renewable-energy', label: 'Renewable energy', short: 'Renewables' },
  { id: 'retail', label: 'Retail, fashion & jewellery', short: 'Retail' },
] as const;

export type IndustryId = (typeof INDUSTRIES)[number]['id'];
export const INDUSTRY_IDS = INDUSTRIES.map((i) => i.id) as [IndustryId, ...IndustryId[]];
export const industryLabel = (id: IndustryId) => INDUSTRIES.find((i) => i.id === id)?.label ?? id;

/** Cost per lead (or per purchase for FMCG & D2C) on social and search, in INR. */
export const CPL_BY_INDUSTRY: Record<IndustryId, { low: number; high: number; unit: string; verified: false }> = {
  'real-estate': { low: 300, high: 1500, unit: 'per lead', verified: false },
  healthcare: { low: 200, high: 800, unit: 'per lead', verified: false },
  education: { low: 150, high: 600, unit: 'per lead', verified: false },
  'fmcg-d2c': { low: 80, high: 300, unit: 'per purchase or lead', verified: false },
  bfsi: { low: 250, high: 1000, unit: 'per lead', verified: false },
  'auto-ev': { low: 300, high: 1200, unit: 'per lead', verified: false },
  'renewable-energy': { low: 250, high: 1000, unit: 'per lead', verified: false },
  retail: { low: 100, high: 400, unit: 'per lead', verified: false },
};
