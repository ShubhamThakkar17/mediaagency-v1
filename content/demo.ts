/**
 * DEMO CONTENT (BRIEF §9). Everything in this file is sample content for the
 * template preview: fictional brands, illustrative numbers, invented quotes.
 * Each item carries `demo: true`. Replace an item with real, provable content
 * and set `demo: false`. With NEXT_PUBLIC_DEMO_MODE=false the build fails
 * while any `demo: true` item is still rendered (lib/demo-guard.ts).
 */

export type DemoStat = { id: string; value: number; prefix?: string; suffix?: string; label: string; demo: boolean };

/** Hero stats marquee. "18 channels" is computed from content, not listed here. */
export const demoStats: DemoStat[] = [
  { id: 'states', value: 28, suffix: ' + 8', label: 'States and UTs covered', demo: true },
  { id: 'cities', value: 700, suffix: '+', label: 'Cities reachable', demo: true },
  { id: 'plan', value: 1, label: 'Plan, one report', demo: true },
];

/** Cards overlaid on the About photos. */
export const demoAboutStats: DemoStat[] = [
  { id: 'years', value: 12, suffix: '+', label: 'Years planning media', demo: true },
  { id: 'rating', value: 4.9, label: 'Average client rating', demo: true },
];

/** Counters beside the India map. */
export const demoMapStats: DemoStat[] = [
  { id: 'cities', value: 700, suffix: '+', label: 'Cities and towns reachable', demo: true },
  { id: 'sites', value: 12000, suffix: '+', label: 'OOH and transit sites on our grid', demo: true },
  { id: 'languages', value: 11, label: 'Languages we adapt creative into', demo: true },
];

export type DemoResult = { id: string; value: number; prefix?: string; suffix: string; title: string; body: string; badge?: string; size: 'lg' | 'md'; demo: boolean };

export const demoResults: DemoResult[] = [
  { id: 'reach', value: 2, suffix: 'X', title: 'Reach for the same budget', body: 'When OOH, print and digital are planned together instead of in silos.', size: 'lg', badge: 'Hot', demo: true },
  { id: 'recall', value: 85, suffix: '%', title: 'Aided recall', body: 'In the launch city after a six-week burst.', size: 'md', demo: true },
  { id: 'markets', value: 25, suffix: '+', title: 'Markets live in one week', body: 'From plan sign-off to first site photo.', size: 'md', demo: true },
  { id: 'cpl', value: 38, suffix: '%', title: 'Lower cost per lead', body: 'After offline bursts lift search demand.', size: 'md', demo: true },
  { id: 'report', value: 1, suffix: '', title: 'Report, every channel', body: 'One view of spend, delivery and response.', size: 'md', demo: true },
];

export type DemoLogo = { name: string; mark: 'circle' | 'square' | 'triangle' | 'wave' | 'bars' | 'ring' | 'diamond' | 'leaf'; weight: 500 | 700; italic?: boolean; demo: boolean };

/** Fictional wordmarks. No real brands. */
export const demoLogos: DemoLogo[] = [
  { name: 'Northwind', mark: 'triangle', weight: 700, demo: true },
  { name: 'Lumen', mark: 'ring', weight: 500, demo: true },
  { name: 'Kaveri Foods', mark: 'wave', weight: 700, demo: true },
  { name: 'Asterix Infra', mark: 'bars', weight: 500, demo: true },
  { name: 'Saffron & Co.', mark: 'circle', weight: 700, italic: true, demo: true },
  { name: 'Udaan EV', mark: 'diamond', weight: 700, demo: true },
  { name: 'Meridian Health', mark: 'square', weight: 500, demo: true },
  { name: 'Suryoday Solar', mark: 'leaf', weight: 700, demo: true },
];

export type DemoCampaign = {
  id: string;
  year: number;
  title: string;
  /** Fictional client. */
  client: string;
  industry: string;
  /** Channel slugs. */
  channels: string[];
  markets: string;
  summary: string;
  /** Illustrative outcome line. */
  result: string;
  /** Media registry id. */
  media: string;
  /** Masonry card height hint. */
  shape: 'tall' | 'wide' | 'square';
  demo: boolean;
};

export const demoCampaigns: DemoCampaign[] = [
  {
    id: 'skyline-launch',
    year: 2026,
    title: 'The skyline that sold out a launch',
    client: 'Asterix Infra',
    industry: 'Real estate',
    channels: ['hoardings', 'print', 'search-performance', 'social-media'],
    markets: 'Ahmedabad, Gandhinagar',
    summary: 'A 3 km hoarding corridor on the approach road, front-page print on launch weekend and search to catch every enquiry.',
    result: '1,900 site visits in 21 days (illustrative)',
    media: 'work-1',
    shape: 'tall',
    demo: true,
  },
  {
    id: 'snack-in-every-lane',
    year: 2026,
    title: 'A snack in every lane',
    client: 'Kaveri Foods',
    industry: 'FMCG & D2C',
    channels: ['television', 'bus-brts-auto', 'influencers', 'radio'],
    markets: 'Tamil Nadu, Karnataka, Kerala',
    summary: 'Regional TV for scale, 600 branded autos for the last mile and food creators in three languages.',
    result: '2.1X distribution uplift in new towns (illustrative)',
    media: 'work-2',
    shape: 'wide',
    demo: true,
  },
  {
    id: 'charge-ahead',
    year: 2025,
    title: 'Charge ahead',
    client: 'Udaan EV',
    industry: 'Auto & EV',
    channels: ['metro-wraps', 'digital-ooh', 'social-media', 'stadiums-sports'],
    markets: 'Delhi NCR, Bengaluru, Pune',
    summary: 'Wrapped metro trains, DOOH near tech parks and a stadium test-ride zone for a scooter launch.',
    result: '14,000 test-ride bookings (illustrative)',
    media: 'work-3',
    shape: 'square',
    demo: true,
  },
  {
    id: 'care-next-door',
    year: 2025,
    title: 'Care, next door',
    client: 'Meridian Health',
    industry: 'Healthcare & hospitals',
    channels: ['print', 'radio', 'hoardings', 'search-performance'],
    markets: 'Mumbai, Thane, Navi Mumbai',
    summary: 'A new hospital introduced to its catchment with doctor-led print, drive-time radio and local search.',
    result: '46% of OPD walk-ins named the campaign (illustrative)',
    media: 'work-4',
    shape: 'tall',
    demo: true,
  },
  {
    id: 'admissions-open',
    year: 2025,
    title: 'Admissions, open everywhere',
    client: 'Northwind University',
    industry: 'Education',
    channels: ['print', 'cinema', 'social-media', 'railways'],
    markets: 'Pan-India, 40 feeder towns',
    summary: 'Results-week print in feeder towns, cinema before the summer blockbusters and station branding on key routes.',
    result: '31% more applications from tier 2 towns (illustrative)',
    media: 'work-5',
    shape: 'square',
    demo: true,
  },
  {
    id: 'sun-on-every-roof',
    year: 2024,
    title: 'Sun on every roof',
    client: 'Suryoday Solar',
    industry: 'Renewable energy',
    channels: ['print', 'bus-brts-auto', 'digital-pr', 'search-performance'],
    markets: 'Gujarat, Rajasthan, Madhya Pradesh',
    summary: 'Vernacular print and state-bus branding built trust, PR explained the subsidy, search closed the enquiry.',
    result: '₹410 cost per qualified lead (illustrative)',
    media: 'work-6',
    shape: 'wide',
    demo: true,
  },
];

export type DemoTestimonial = { id: string; quote: string; name: string; role: string; company: string; initials: string; rating: number; demo: boolean };

export const demoTestimonials: DemoTestimonial[] = [
  {
    id: 't1',
    quote: 'One plan covered our hoardings, print and search. For the first time we could see which rupee did what.',
    name: 'R. Mehta',
    role: 'Marketing Head',
    company: 'Asterix Infra',
    initials: 'RM',
    rating: 5,
    demo: true,
  },
  {
    id: 't2',
    quote: 'They took us from two cities to forty towns without the plan falling apart. Site photos arrived before we asked.',
    name: 'S. Iyer',
    role: 'Brand Director',
    company: 'Kaveri Foods',
    initials: 'SI',
    rating: 5,
    demo: true,
  },
  {
    id: 't3',
    quote: 'The metro wrap got the attention. The follow-up on social got the bookings. Both came from the same team.',
    name: 'A. Khan',
    role: 'Growth Lead',
    company: 'Udaan EV',
    initials: 'AK',
    rating: 5,
    demo: true,
  },
  {
    id: 't4',
    quote: 'We needed patients to trust a new hospital. The mix they chose was quiet, local and it worked.',
    name: 'Dr. P. Nair',
    role: 'Chief Operating Officer',
    company: 'Meridian Health',
    initials: 'PN',
    rating: 4.8,
    demo: true,
  },
  {
    id: 't5',
    quote: 'Clear costs upfront, a report every Monday and no surprises on the invoice. That is rare.',
    name: 'N. Shah',
    role: 'Founder',
    company: 'Suryoday Solar',
    initials: 'NS',
    rating: 5,
    demo: true,
  },
];

export const demoRating = { value: 4.9, count: 120, label: 'Average rating across client reviews', demo: true };

export type DemoTeamMember = { initials: string; role: string; focus: string; demo: boolean };

/** Placeholder team roles. No names, no faces. */
export const demoTeam: DemoTeamMember[] = [
  { initials: 'MP', role: 'Media Planning', focus: 'Mix, phasing, markets', demo: true },
  { initials: 'MB', role: 'Media Buying', focus: 'Rates, inventory, monitoring', demo: true },
  { initials: 'CR', role: 'Creative', focus: 'Ideas, film, design', demo: true },
  { initials: 'DG', role: 'Digital & Performance', focus: 'Social, search, leads', demo: true },
  { initials: 'BP', role: 'Brand Partnerships', focus: 'Talent, sports, creators', demo: true },
  { initials: 'OG', role: 'On-ground', focus: 'Activations, BTL, rural', demo: true },
];
