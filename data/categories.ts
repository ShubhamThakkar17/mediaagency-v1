export const CATEGORIES = [
  {
    id: 'ATL',
    label: 'ATL',
    title: 'Above the line',
    blurb: 'Mass reach and stature.',
    bestFor: 'Best for fast national or regional reach, trust and launches that need scale.',
  },
  {
    id: 'OOH',
    label: 'OOH',
    title: 'Out-of-home',
    blurb: 'Own the street.',
    bestFor: 'Best for city dominance, catchment targeting and round-the-clock presence.',
  },
  {
    id: 'Transit',
    label: 'Transit',
    title: 'Transit media',
    blurb: 'Move with the commute.',
    bestFor: 'Best for daily frequency with commuters, from metro coaches to state buses and trains.',
  },
  {
    id: 'Travel',
    label: 'Travel',
    title: 'Airports & airlines',
    blurb: 'Premium dwell time.',
    bestFor: 'Best for affluent flyers and business decision-makers with time to look.',
  },
  {
    id: 'Fame',
    label: 'Fame',
    title: 'Sports, stars & creators',
    blurb: 'Borrowed attention, earned trust.',
    bestFor: 'Best for cultural relevance, credibility and talk value at scale.',
  },
  {
    id: 'Digital',
    label: 'Digital',
    title: 'Digital',
    blurb: 'Targeted, measurable, always on.',
    bestFor: 'Best for precise audiences, leads and sales you can track to the rupee.',
  },
] as const;
export type CategoryId = (typeof CATEGORIES)[number]['id'];
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];
export const categoryTitle = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.title ?? id;
