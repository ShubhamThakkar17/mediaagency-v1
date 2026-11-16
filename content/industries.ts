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

export const INDUSTRY_CONTENT: IndustryContent[] = [
  {
    id: 'real-estate',
    description:
      'Launches are won in a catchment. Hoardings own the approach roads while print, search and social bring the site visits.',
    topChannels: ['hoardings', 'print', 'search-performance', 'social-media'],
    metrics: [
      { value: '3.2X', label: 'site visits in launch month', demo: true },
      { value: '₹640', label: 'blended cost per lead', demo: true },
    ],
    media: 'ind-real-estate',
  },
  {
    id: 'healthcare',
    description:
      'Patients choose on trust and proximity. Print and digital PR build the reputation, then search captures people looking for care nearby.',
    topChannels: ['print', 'search-performance', 'digital-pr', 'social-media'],
    metrics: [
      { value: '+41%', label: 'appointment enquiries', demo: true },
      { value: '₹380', label: 'cost per appointment lead', demo: true },
    ],
    media: 'ind-healthcare',
  },
  {
    id: 'education',
    description:
      'Admissions run on a calendar. Print carries results and deadlines, while search, social and metro media reach students and parents every day.',
    topChannels: ['print', 'search-performance', 'social-media', 'inside-metro'],
    metrics: [
      { value: '2.4X', label: 'applications in admission season', demo: true },
      { value: '₹290', label: 'cost per qualified enquiry', demo: true },
    ],
    media: 'ind-education',
  },
  {
    id: 'fmcg-d2c',
    description:
      'Household brands need reach and repetition. Television builds scale, and social, creators and a trusted face turn it into trial.',
    topChannels: ['television', 'social-media', 'influencers', 'brand-ambassadors'],
    metrics: [
      { value: '68%', label: 'target reach in 4 weeks', demo: true },
      { value: '4.1X', label: 'return on ad spend', demo: true },
    ],
    media: 'ind-fmcg-d2c',
  },
  {
    id: 'bfsi',
    description:
      'Money moves on credibility. Digital PR and airports reach decision-makers, and search turns that confidence into applications.',
    topChannels: ['search-performance', 'digital-pr', 'airport', 'inside-metro'],
    metrics: [
      { value: '+52%', label: 'qualified applications', demo: true },
      { value: '₹710', label: 'cost per qualified lead', demo: true },
    ],
    media: 'ind-bfsi',
  },
  {
    id: 'auto-ev',
    description:
      'A vehicle launch needs fame first and test drives second. Television and sport create desire, then search books the showroom visit.',
    topChannels: ['television', 'search-performance', 'stadiums-sports', 'airport'],
    metrics: [
      { value: '1,850', label: 'test drives booked', demo: true },
      { value: '+36%', label: 'showroom walk-ins', demo: true },
    ],
    media: 'ind-auto-ev',
  },
  {
    id: 'renewable-energy',
    description:
      'Solar is a considered purchase. Search and digital PR answer the questions, while social and regional print reach home and business owners.',
    topChannels: ['search-performance', 'digital-pr', 'social-media', 'print'],
    metrics: [
      { value: '2.7X', label: 'rooftop enquiries', demo: true },
      { value: '₹560', label: 'cost per site survey lead', demo: true },
    ],
    media: 'ind-renewable-energy',
  },
  {
    id: 'retail',
    description:
      'Footfall follows the festive calendar. Hoardings and print announce the offer, and radio and social keep the store top of mind.',
    topChannels: ['hoardings', 'print', 'radio', 'social-media'],
    metrics: [
      { value: '+48%', label: 'festive week footfall', demo: true },
      { value: '22%', label: 'lift in average bill value', demo: true },
    ],
    media: 'ind-retail',
  },
];

export const industryContent = (id: IndustryId) => INDUSTRY_CONTENT.find((i) => i.id === id);
