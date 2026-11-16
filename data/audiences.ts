export const AUDIENCES = [
  { id: 'genz', label: 'Gen Z (18–24)', short: 'Gen Z' },
  { id: 'urban-pros', label: 'Urban young professionals', short: 'Urban pros' },
  { id: 'families', label: 'Families', short: 'Families' },
  { id: 'bharat', label: 'Bharat (tier 3 & rural)', short: 'Bharat' },
  { id: 'decision-makers', label: 'Business decision-makers', short: 'Decision-makers' },
  { id: 'affluent', label: 'Affluent / HNI', short: 'Affluent' },
  { id: 'commuters', label: 'Daily commuters', short: 'Commuters' },
  { id: 'sports-fans', label: 'Sports fans', short: 'Sports fans' },
] as const;

export type AudienceId = (typeof AUDIENCES)[number]['id'];
export const AUDIENCE_IDS = AUDIENCES.map((a) => a.id) as [AudienceId, ...AudienceId[]];
export const audienceLabel = (id: AudienceId) => AUDIENCES.find((a) => a.id === id)?.label ?? id;
