/**
 * Site copy that is not channel or demo content. Indian English, short
 * confident sentences, no em dashes. `*word*` marks the bold word in a
 * headline (rendered by <Emph>).
 */
export const copy = {
  demoBadge: 'Template preview · sample content',
  hero: {
    label: 'Drag to spin',
    headline: ['Every screen.', 'Every street.', 'Every state.'],
    sub: 'A 360° media agency planning, buying and running campaigns across India, from print and prime time to metros, airports and Instagram.',
    primary: 'Plan my media',
    secondary: 'Explore channels',
  },
  stats: { channelsLabel: 'Channels, one team' },
  about: {
    label: 'About us',
    title: "We're a 360° *media agency.*",
    lead: 'One agency for every channel India watches.',
    body: 'We plan the mix, buy the media, make the creative and run it on the ground, in one team with one plan and one report. Whether you need a single city or the whole country, we get your brand seen where your customers actually are.',
    cta: 'More about us',
  },
  services: {
    label: 'Services',
    title: 'We plan, buy and run media *across India.*',
    lede: 'Six practices under one roof, so the plan, the creative and the execution never drift apart.',
  },
  universe: {
    label: 'Channel universe',
    title: 'Every channel *India watches.*',
    lede: 'Eighteen channels in six families. Scroll through them, then open any one for formats, audiences and indicative costs.',
    hint: 'Scroll',
  },
  map: {
    label: 'Pan-India reach',
    title: 'One plan, from metros *to mandis.*',
    lede: 'We plan from one desk and execute through on-ground partners in every zone. Pick a tier to see where a plan can run.',
    tabs: { metro: 'Metro', tier1: 'Tier 1', tier2: 'Tier 2 & 3', all: 'Pan-India' },
    hqLabel: 'HQ',
  },
  industries: {
    label: 'Industries',
    title: 'Media that fits *your category.*',
    channelsLabel: 'Channels we reach for first',
  },
  plannerBlock: {
    label: 'Media planner',
    title: 'Tell us your budget. *Or your channels.*',
    lede: 'A two-way planner built on the same logic our team uses for a first-cut plan. Indicative, instant and yours to share.',
    open: 'Open full planner',
  },
  results: {
    label: 'Results',
    title: 'What a joined-up *plan does.*',
    lede: 'When every channel reports into one plan, budgets stop overlapping and start compounding.',
  },
  logos: { title: 'Brands we work with' },
  features: {
    label: 'Why us',
    cta: 'Our services',
    rows: [
      {
        index: '01',
        title: 'Plans built on *data.*',
        body: 'Audience data, market sizes and past delivery shape the mix before a single rupee is committed. You see the reasoning, not just the rate card.',
        media: 'feature-data',
        glyph: 'data-chart',
      },
      {
        index: '02',
        title: 'Buying power, *pan-India.*',
        body: 'Relationships with media owners in every zone, from national broadcasters to the hoarding owner in a tier 3 town. Better sites, better rates, faster.',
        media: 'feature-pan-india',
        glyph: 'india-pin',
      },
      {
        index: '03',
        title: 'Proof for *every rupee.*',
        body: 'Site photos, spot logs, dashboards and lead reports land in one weekly view. If it ran, you can see it. If it worked, you can prove it.',
        media: 'feature-proof',
        glyph: 'receipt',
      },
    ],
  },
  campaigns: {
    label: 'Work',
    title: 'Campaigns *in motion.*',
    columns: ['Year', 'Campaign', 'Channels', 'Markets'],
    cta: 'See all work',
  },
  taglines: {
    top: ['Prime time to pin codes', 'Highways to Instagram', 'Front page to feed', 'Platform to phone', 'Metro to mandi', 'Stadium to story'],
  },
  testimonials: {
    label: 'Testimonials',
    title: 'What clients say *about us.*',
  },
  social: { label: 'Follow along' },
  catchup: {
    /** Name of the publishing hub (nav, page title, home teaser). */
    name: 'Media CatchUp',
    navLabel: 'CatchUp',
    label: 'Media CatchUp',
    title: 'Fresh from *the planning desk.*',
    lede: 'Articles, case studies, guides and market updates on planning and buying media across India.',
    homeTitle: 'Catch up on *what is working.*',
    homeLede: 'Short reads from our planners: what moved the market, how campaigns were built and what we would do next time.',
    cta: 'Visit Media CatchUp',
    all: 'Everything',
    read: 'Read',
    featured: 'Featured',
    concept: 'Concept',
  },
  footer: {
    kicker: 'Ready when you are',
    headline: 'Let’s put your brand *everywhere it matters.*',
    newsletterLabel: 'Media notes, once a month',
    newsletterPlaceholder: 'you@company.com',
    newsletterCta: 'Subscribe',
    newsletterThanks: 'Thank you. You are on the list.',
    rights: 'All rights reserved.',
    mapCredit: 'India map: @svg-maps/india (CC BY 4.0)',
  },
  floatingCta: 'Plan my media',
  costDisclaimer: 'Indicative ranges for planning. Final rates depend on city, inventory, season and negotiation.',
  plannerBadge: 'Indicative estimate',
  plannerBadgeLink: 'How we calculate',
  process: [
    { step: 'Plan', body: 'Audience, markets and mix, agreed against a clear goal.' },
    { step: 'Buy', body: 'Inventory shortlisted, negotiated and locked.' },
    { step: 'Create', body: 'Creative built to the spec of every surface.' },
    { step: 'Execute', body: 'Mounted, aired and published, with monitoring.' },
    { step: 'Prove', body: 'Photos, logs and results in one report.' },
  ],
  promises: [
    { title: 'Clarity over noise', body: 'A plan you can read in five minutes, with the reasoning written down.' },
    { title: 'Accountable to numbers', body: 'Every channel has a job and a number it answers to.' },
    { title: 'One team, end to end', body: 'Planning, buying, creative and on-ground work without hand-offs.' },
    { title: 'In it for the long run', body: 'We would rather keep a client for ten years than win an award this year.' },
  ],
  howWeWork: [
    { step: 'Listen', body: 'Your business, your buyer and what has and has not worked.' },
    { step: 'Shape', body: 'A mix, a budget split and a calendar you can challenge.' },
    { step: 'Create', body: 'Ideas and assets made for each medium and language.' },
    { step: 'Launch', body: 'Bought, booked and live, city by city.' },
    { step: 'Measure', body: 'Delivery and response, reported every week.' },
  ],
} as const;
