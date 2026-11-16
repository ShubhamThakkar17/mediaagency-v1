/**
 * Zones, states and tiers used by the planner, the India map and channel pages.
 * State ids match @svg-maps/india. Zone groupings follow common media-planning
 * practice, not administrative zonal councils. Multipliers and zone notes are
 * planning assumptions for this template, not rate cards.
 */
export const ZONES = [
  { id: 'north', label: 'North' },
  { id: 'south', label: 'South' },
  { id: 'east', label: 'East' },
  { id: 'west', label: 'West' },
  { id: 'central', label: 'Central' },
  { id: 'north-east', label: 'North-East' },
] as const;
export type ZoneId = (typeof ZONES)[number]['id'];
export const ZONE_IDS = ZONES.map((z) => z.id) as [ZoneId, ...ZoneId[]];
export const zoneLabel = (id: ZoneId) => ZONES.find((z) => z.id === id)?.label ?? id;

export const TIERS = [
  { id: 'metro', label: 'Metro', cpmMultiplier: 1.3 },
  { id: 'tier1', label: 'Tier 1', cpmMultiplier: 1.0 },
  { id: 'tier2', label: 'Tier 2', cpmMultiplier: 0.8 },
  { id: 'tier3Rural', label: 'Tier 3 & rural', cpmMultiplier: 0.6 },
] as const;
export type TierId = (typeof TIERS)[number]['id'];
export const TIER_IDS = TIERS.map((t) => t.id) as [TierId, ...TierId[]];
export const tierLabel = (id: TierId) => TIERS.find((t) => t.id === id)?.label ?? id;
/** Planning assumption: relative media cost by market tier (Tier 1 = 1.0). */
export const TIER_CPM_MULTIPLIER: Record<TierId, number> = { metro: 1.3, tier1: 1.0, tier2: 0.8, tier3Rural: 0.6 };

export type StateInfo = { id: string; name: string; zone: ZoneId; ut?: boolean };

export const STATES: StateInfo[] = [
  { id: 'jk', name: 'Jammu & Kashmir and Ladakh', zone: 'north', ut: true },
  { id: 'hp', name: 'Himachal Pradesh', zone: 'north' },
  { id: 'pb', name: 'Punjab', zone: 'north' },
  { id: 'ch', name: 'Chandigarh', zone: 'north', ut: true },
  { id: 'hr', name: 'Haryana', zone: 'north' },
  { id: 'dl', name: 'Delhi NCT', zone: 'north', ut: true },
  { id: 'ut', name: 'Uttarakhand', zone: 'north' },
  { id: 'up', name: 'Uttar Pradesh', zone: 'north' },
  { id: 'rj', name: 'Rajasthan', zone: 'north' },
  { id: 'gj', name: 'Gujarat', zone: 'west' },
  { id: 'mh', name: 'Maharashtra', zone: 'west' },
  { id: 'ga', name: 'Goa', zone: 'west' },
  { id: 'dn', name: 'Dadra & Nagar Haveli', zone: 'west', ut: true },
  { id: 'dd', name: 'Daman & Diu', zone: 'west', ut: true },
  { id: 'mp', name: 'Madhya Pradesh', zone: 'central' },
  { id: 'ct', name: 'Chhattisgarh', zone: 'central' },
  { id: 'br', name: 'Bihar', zone: 'east' },
  { id: 'jh', name: 'Jharkhand', zone: 'east' },
  { id: 'or', name: 'Odisha', zone: 'east' },
  { id: 'wb', name: 'West Bengal', zone: 'east' },
  { id: 'an', name: 'Andaman & Nicobar Islands', zone: 'east', ut: true },
  { id: 'ap', name: 'Andhra Pradesh', zone: 'south' },
  { id: 'tg', name: 'Telangana', zone: 'south' },
  { id: 'ka', name: 'Karnataka', zone: 'south' },
  { id: 'kl', name: 'Kerala', zone: 'south' },
  { id: 'tn', name: 'Tamil Nadu', zone: 'south' },
  { id: 'py', name: 'Puducherry', zone: 'south', ut: true },
  { id: 'ld', name: 'Lakshadweep', zone: 'south', ut: true },
  { id: 'as', name: 'Assam', zone: 'north-east' },
  { id: 'ar', name: 'Arunachal Pradesh', zone: 'north-east' },
  { id: 'mn', name: 'Manipur', zone: 'north-east' },
  { id: 'ml', name: 'Meghalaya', zone: 'north-east' },
  { id: 'mz', name: 'Mizoram', zone: 'north-east' },
  { id: 'nl', name: 'Nagaland', zone: 'north-east' },
  { id: 'tr', name: 'Tripura', zone: 'north-east' },
  { id: 'sk', name: 'Sikkim', zone: 'north-east' },
];

export const stateById = (id: string) => STATES.find((s) => s.id === id);

/**
 * What tends to work in each zone. Shown in the map tooltip and used as
 * planner context. Planning assumptions, to be replaced by your media team.
 */
export const ZONE_NOTES: Record<ZoneId, { strengths: string[]; languages: string; note: string }> = {
  north: {
    strengths: ['Print (Hindi dailies)', 'Television', 'Hoardings', 'Metro (Delhi NCR)'],
    languages: 'Hindi, Punjabi, English',
    note: 'Hindi print and TV carry deep into tier 2 and 3. Delhi NCR adds metro, airport and DOOH scale.',
  },
  south: {
    strengths: ['Regional TV', 'Cinema', 'Radio', 'Digital & social'],
    languages: 'Tamil, Telugu, Kannada, Malayalam',
    note: 'Four language markets, each planned on its own. Cinema and regional TV punch above their weight.',
  },
  east: {
    strengths: ['Print (regional dailies)', 'Railways', 'Hoardings', 'Television'],
    languages: 'Bengali, Odia, Hindi',
    note: 'Regional print and rail networks reach deep. Kolkata anchors metro, transit and festive OOH.',
  },
  west: {
    strengths: ['Hoardings & DOOH', 'Airport', 'Print', 'Search & social'],
    languages: 'Marathi, Gujarati, Hindi, English',
    note: 'Mumbai, Pune and Gujarat cities pair premium OOH and airports with strong digital response.',
  },
  central: {
    strengths: ['Television', 'Print (Hindi dailies)', 'Bus & auto branding', 'Radio'],
    languages: 'Hindi',
    note: 'Cost-efficient reach. Hindi print, TV and road transit do the heavy lifting beyond Indore and Bhopal.',
  },
  'north-east': {
    strengths: ['Regional print', 'Radio', 'Hoardings', 'Social media'],
    languages: 'Assamese, Bengali, English and state languages',
    note: 'Guwahati is the hub. Local print, radio and social extend plans across the seven sisters and Sikkim.',
  },
};
