export type ServiceObject = 'torus' | 'capsules' | 'starburst' | 'blobs' | 'cube' | 'knot';

export type Service = {
  id: string;
  index: string;
  title: string;
  /** Shown under the title on cards. */
  scope: string;
  short: string;
  description: string;
  /** Four mono bullets revealed on hover. */
  bullets: [string, string, string, string];
  deliverables: string[];
  object: ServiceObject;
  /** Channel slugs this service most often touches. */
  channels: string[];
};

export const SERVICES: Service[] = [
  {
    id: 'media-planning-buying',
    index: '01',
    title: 'Media Planning & Buying',
    scope: 'ATL, OOH, transit',
    short: 'The right mix, bought well, in every market you need.',
    description:
      'We turn a business goal into a channel mix, then buy it. Print, TV, radio, cinema, hoardings and transit are planned together, so every rupee has a job and nothing overlaps by accident.',
    bullets: ['Audience and market mapping', 'Channel mix and phasing', 'Rate negotiation and buying', 'Site and spot monitoring'],
    deliverables: ['Media strategy and plan', 'City and site shortlists', 'Buying and scheduling', 'Monitoring photos and logs', 'Post-campaign report'],
    object: 'torus',
    channels: ['print', 'television', 'radio', 'cinema', 'hoardings', 'bus-brts-auto'],
  },
  {
    id: 'creative-production',
    index: '02',
    title: 'Creative & Production',
    scope: 'Films, print, OOH design, motion',
    short: 'Ideas built for the surface they will run on.',
    description:
      'A hoarding is read in three seconds. A reel is judged in one. Our creative team designs for each medium from the start, then adapts across languages and formats without losing the idea.',
    bullets: ['Campaign idea and scripts', 'Film and photo production', 'OOH and print adaptation', 'Regional language versions'],
    deliverables: ['Campaign platform', 'TVC and digital films', 'Print and OOH masters', 'Motion and DOOH loops', 'Language adaptations'],
    object: 'capsules',
    channels: ['television', 'cinema', 'hoardings', 'digital-ooh', 'print'],
  },
  {
    id: 'digital-social-performance',
    index: '03',
    title: 'Digital, Social & Performance',
    scope: 'Social, search, lead generation',
    short: 'Always-on reach that turns into leads and sales.',
    description:
      'Social content, paid social and search run as one system. We build the funnel, track every lead to its source and move budget weekly towards what is working.',
    bullets: ['Paid social and search', 'Content calendars and reels', 'Landing pages and tracking', 'Weekly optimisation'],
    deliverables: ['Channel and funnel plan', 'Creative and copy sets', 'Tracking and dashboards', 'Lead quality reviews', 'Monthly performance report'],
    object: 'starburst',
    channels: ['social-media', 'search-performance', 'influencers'],
  },
  {
    id: 'brand-partnerships',
    index: '04',
    title: 'Brand Partnerships',
    scope: 'Celebrities, sports, influencers',
    short: 'The right face, team or creator, on the right terms.',
    description:
      'We shortlist, negotiate and manage talent and sports properties. From a regional film star to a creator network or a stadium deal, we make the association work across every channel you run.',
    bullets: ['Talent shortlists and fit', 'Fee and rights negotiation', 'Sports and event tie-ups', 'Creator network campaigns'],
    deliverables: ['Partner strategy', 'Shortlist with rationale', 'Contracts and usage rights', 'Shoot and content plan', 'Amplification plan'],
    object: 'blobs',
    channels: ['brand-ambassadors', 'stadiums-sports', 'influencers'],
  },
  {
    id: 'on-ground-activations',
    index: '05',
    title: 'On-ground, BTL & Activations',
    scope: 'Events, sampling, retail, rural',
    short: 'Your brand, in person, where people shop and gather.',
    description:
      'Mall activations, society events, dealer meets, sampling drives and rural van campaigns. We staff, permit and run them, and report footfall and leads by location.',
    bullets: ['Mall and society activations', 'Sampling and roadshows', 'Dealer and trade events', 'Rural and haat campaigns'],
    deliverables: ['Activation concept', 'Permissions and logistics', 'Promoter teams', 'Daily footfall and lead logs', 'Photo and video record'],
    object: 'cube',
    channels: ['bus-brts-auto', 'railways', 'hoardings'],
  },
  {
    id: 'pr-content-articles',
    index: '06',
    title: 'PR, Content & Digital Articles',
    scope: 'Press, native, thought leadership',
    short: 'Stories that earn trust before the sales call.',
    description:
      'Press releases, founder stories, sponsored articles and native placements on the publications your buyers read. Built to rank on search and to be quoted by AI assistants.',
    bullets: ['Press and media relations', 'Sponsored and native articles', 'Founder and brand stories', 'Search-ready content'],
    deliverables: ['PR calendar', 'Press kits and releases', 'Article placements', 'Coverage tracker', 'Search visibility report'],
    object: 'knot',
    channels: ['digital-pr', 'print', 'social-media'],
  },
];

export const serviceById = (id: string) => SERVICES.find((s) => s.id === id);
