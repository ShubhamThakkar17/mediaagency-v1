import type { IndustryId } from '@/data/industries';

export type IndustryContent = {
  id: IndustryId;
  /** Two short lines on how this sector buys media in India. */
  description: string;
  /** Four channel slugs, strongest first. Must exist in content/channels. */
  topChannels: [string, string, string, string];
  /** Two illustrative metrics. Demo values: flagged and guarded. */
  metrics: [{ value: string; label: string; demo: boolean }, { value: string; label: string; demo: boolean }];
  /** Media registry id (content/media.ts). */
  media: string;
};

// TODO(content): replace this seed with considered copy for all 8 industries.
export const INDUSTRY_CONTENT: IndustryContent[] = [
  {
    id: 'real-estate',
    description:
      'Launches are won in a catchment. Hoardings own the approach roads while print and search bring the site visits.',
    topChannels: ['hoardings', 'print', 'search-performance', 'social-media'],
    metrics: [
      { value: '3.2X', label: 'site visits in launch month', demo: true },
      { value: '₹640', label: 'blended cost per lead', demo: true },
    ],
    media: 'ind-real-estate',
  },
];

export const industryContent = (id: IndustryId) => INDUSTRY_CONTENT.find((i) => i.id === id);
