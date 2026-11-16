# BRIEF.md: 360° pan-India media agency website (motion-heavy mockup template)

> **Kickoff prompt to paste into Claude Code (the only prompt you will get):**
>
> "Read BRIEF.md in full and build the entire site end to end, all modules, in one run. Do not stop for my approval between modules. Make sensible decisions, log them in DECISIONS.md, commit and push as you go, deploy to Vercel, and finish with REPORT.md containing the live preview URL."

---

## 0. Operating rules for this run (read first)

1. **Autonomous, single run.** Build every module in §13 without pausing for approval. Do not ask me questions. If something is ambiguous, pick the option closest to this brief and the Agenciex reference, then write one line in `DECISIONS.md` (what you decided and why).
2. **Stop only for hard blockers.** These are: you cannot push to GitHub, or the build cannot pass for a reason outside the code. In that case, finish everything else, then explain the blocker and the exact fix in `REPORT.md`.
3. **Track progress with your todo list.** Create it from §13 at the start and tick items off as you go.
4. **Parallelise.** Once M1 (scaffold + design system) is committed, and if your environment supports subagents, run M3 (content + media), M4 (motion glyph library) and M6 (planner engine + tests) in parallel. Then integrate.
5. **Commit after every module** with a clear message and push each time, so Vercel builds a preview at every step.
6. **`pnpm build` must pass with zero environment variables set.** Every integration (email, Sheets, analytics, stock-photo APIs) is optional and env-gated.
7. **Never invent facts and present them as real.** This is a mockup template. Stats, client logos, testimonials, awards and case studies are **demo content**. They live in `/content/demo.ts` with `demo: true`, and a `DemoBadge` appears when `NEXT_PUBLIC_DEMO_MODE=true` (the default). See §9.

Repo: **https://github.com/ShubhamThakkar17/mediaagency-v1** (assume it is empty or near-empty; keep any existing README content).

---

## 1. What you are building

A premium, **fully animated** marketing website for a **360° media agency with pan-India execution**. It covers every media channel India watches: print, TV, radio, cinema, hoardings, DOOH, transit, metro, railways, airports, airlines, stadiums and sports, celebrities, influencers, social, search and performance, digital PR.

The site has three jobs:
1. **Wow**: motion graphics everywhere, including the spinning 3D channel cylinder, scroll-driven scenes, animated channel glyphs, video loops, a live India map, rolling numbers and a wave-ribbon footer.
2. **Educate**: one page per channel covering formats, who it reaches, where it works, indicative costs and its role in the funnel.
3. **Convert**: a two-way **Media Planner**:
   - **Budget → Channels**: "I have ₹X. Which channels should I use?"
   - **Channels → Budget**: "I want these channels. Roughly how much will it cost?"

**It is a reusable template.** All brand identity, copy, colours, contacts, channel data and planner rates live in config and content files. Components must not hard-code brand strings. Write `CLONING.md` explaining how to rebrand it in under an hour.

**Placeholder brand:** name **"Media360"**, tagline **"Every screen. Every street. Every state."**, descriptor "360° media agency · pan-India". Everything sits in `/brand/brand.config.ts`, so I will rename it later.

---

## 2. Design reference: Agenciex (https://agenciex.framer.website/)

Recreate the **feel, layout rhythm and motion language** of this Framer template. Do not copy its code, images, logos or copy text. Below is my teardown of the reference, top to bottom, with what each section becomes on our site.

| # | Agenciex section | What it looks like | Our version |
|---|---|---|---|
| 0 | Preloader | Light dotted-grid page; cards fly in and assemble into a curved band; small wordmark with "00% → 100%" progress line | Same idea: the 18 channel cards assemble into the cylinder while a counter runs 00→100% under the wordmark. Total ≤ 1.6 s, skippable, only once per session |
| 1 | Nav | Logo left (black word + orange "x"); centred **pill nav** in a white rounded container, active item filled orange; right "Get in touch" outline pill with icon | Same. Logo "Media**360**" with "360" in orange. Links: Home, Channels, Planner, Services, Work, About, Contact. Right CTA: `Plan my media`. Nav becomes glass (backdrop-blur) after scroll and hides on scroll down, shows on scroll up |
| 2 | Hero | **3D cylinder of ~12 poster cards** seen from slightly above. The front cards are big and the rear cards are visible through the gap. "DRAG TO SPIN" label. Dotted-grid background with a soft orange glow at the bottom | **The centrepiece.** A cylinder of **18 channel poster cards** (see §6). It auto-rotates slowly; drag, wheel and touch add inertia. Hovering a card lifts it and shows `Explore →`; clicking opens `/channels/[slug]`. Headline below (see §5.1) |
| 3 | Stats | 4 orange counter cards (12+ years, 350+ brands, 98%, 40+), repeated in a looping strip | 4 orange counter cards in an infinite marquee: `18 channels`, `28 states + 8 UTs`, `700+ cities reachable`, `1 plan, 1 report` (the last three are demo values, see §9) |
| 4 | About | Orange pill label, big headline "We're a brand studio.", short paragraph, a narrow portrait photo plus a wide team photo, overlaid stat cards ("12+" orange card, "4.9" glass card) | Pill `ABOUT US`, "We're a 360° media agency." Photos parallax at different speeds; stat cards count up on enter |
| 5 | Services | Pill label, centred headline "We help brands launch, stand out and sell more.", 3 pale-peach cards, each with a **glossy orange 3D object** (torus, blob cluster, starburst) and a round orange arrow button | Headline "We plan, buy and run media across India." **6 cards** in a 3×2 grid (desktop) or swipeable row (mobile). Each has its own glossy orange 3D object built in React Three Fiber that slowly rotates and reacts to the cursor (§7.3) |
| 6 | Industries | Full-bleed **orange section**: a dark card on the left with a stacked mockup image; a big list of industries on the right (active white, others faded); details and 2 metrics below | Same structure. 8 industries (§5.1-H). As you scroll, the active industry changes (sticky pin) and the left card image cross-fades with a 3D tilt |
| 7 | Results bento | "Helping brands grow…", peach cards with big **rolling-digit** numbers (2X, 85%, 25+), one card with an orange "HOT" badge | "What a joined-up plan does." 3 to 5 bento cards with slot-machine rolling digits (demo values) |
| 8 | Logo strip | "Brands we work with" plus 4 placeholder logos | An infinite marquee of **generic placeholder marks** (generate simple SVG wordmarks such as "Northwind", "Lumen", "Kaveri Foods" and "Asterix Infra"; no real brands) |
| 9 | 01–03 feature rows | Peach background with a blurred orange glow; a numbered circle "01", headline with one bold word ("Ideas with **a plan.**"), body, black pill "Our services" button, photo on the right with an orange icon card overlapping its corner | Three rows that **stack while sticky** (each row pins and the next slides over it, scaling the previous down to 0.92): "Plans built on **data.**", "Buying power, **pan-India.**", "Proof for **every rupee.**" |
| 10 | Awards table | Pill "AWARDS", "Work that gets noticed.", table (Year / Recognition / Platform / Project) with ↗ arrows | "Campaigns in motion." Table columns: Year / Campaign / Channels / Markets. **On hover a floating preview image follows the cursor.** Rows are demo data |
| 11 | Taglines marquee | Short taglines scrolling | Two marquees running in opposite directions, built from channel names and short lines ("Prime time to pin codes", "Highways to Instagram") |
| 12 | Testimonials | "What clients say about us", rating, an **orange quote card stacked on top of a deck of cards**, prev/next buttons, "01 / 05" | Same stacked-deck slider. Cards fan slightly on hover and can be dragged to swipe. Demo quotes with generic names and **no photos of real people** (use initials avatars) |
| 13 | Social row | 4 equal cells: Facebook ↗, Twitter ↗, Dribbble ↗, Instagram ↗ | Instagram, LinkedIn, YouTube, X. The cell fills orange from the bottom on hover |
| 14 | Footer | Dark `#151515` background; an **orange wave ribbon** running across with image cards riding along the wave; giant "© 2026 Agenciex" with an orange © | Same. Channel cards travel along the SVG wave path (GSAP MotionPath) in a continuous loop, faster with scroll velocity. Giant "© 2026 Media360". Footer nav and contact below |

**Global visual language (match it):**
- Light theme: white and `#FFF6F3` cream sections on a **dotted grid** (`radial-gradient` dots, 24px spacing, ~6% opacity). One dark section (footer) and one full-orange section (industries).
- **Orange pill labels** (`ABOUT US`, uppercase, 11px, letter-spaced) above every section headline.
- Big, tight, medium-weight sans headlines with one word in bold ("Ideas with **a plan.**").
- Rounded cards (radius 20–28px), soft peach fills, no harsh borders.
- Round orange icon buttons with ↗ or → arrows.
- Soft blurred orange glows behind content.
- A floating **"Plan my media"** pill fixed at bottom-centre (where Agenciex has its "Download this template" pill), which opens the planner drawer.

---

## 3. Design tokens (`/brand/theme.ts` → CSS variables → Tailwind)

| Token | Hex | Use |
|---|---|---|
| `brand` | `#FF6036` | primary orange: pills, CTAs, active nav, accents, the industries section |
| `brand-600` | `#E84E25` | hover/pressed |
| `brand-100` | `#FFDDD4` | light orange tints, chips |
| `cream` | `#FFF6F3` | section backgrounds, cards |
| `paper` | `#FFFFFF` | base |
| `mist` | `#F7F7F7` | alt background |
| `ink` | `#151515` | text and the dark footer |
| `ink-60` | `#626262` | body text |
| `line` | `#E4E4E4` | hairlines, table rows |

**Type:** Display **Inter Tight** (500/600/700, tracking -0.03em, `clamp()` up to ~7.5rem in the hero and footer). Body **Inter** 400/500. Labels/meta **Geist Mono** or JetBrains Mono, uppercase. Load them with `next/font`.

**Theme presets:** ship `theme.ts` with 3 presets (`saffron` default as above, `indigo`, `forest`) to prove the site can be reskinned. Switching the preset in config must restyle the whole site, including the 3D materials and glyph colours.

**Copy rules:** Indian English (centre, programme), lakh/crore. Format INR with Indian grouping (`₹12,50,000`, `₹50 L`, `₹1.25 Cr`) via `lib/format-inr.ts`. **No em dashes in site copy**; use full stops or commas. Use short, confident sentences.

**Accessibility:** WCAG 2.1 AA contrast (orange text on white only at ≥ 24px, or use ink), visible focus rings, a keyboard-operable cylinder (arrow keys rotate it, Enter opens the card), and full `prefers-reduced-motion` fallbacks (see §7.6).

---

## 4. Stack

- **Next.js 15 (App Router) + TypeScript strict + Tailwind CSS v4**, pnpm
- **GSAP 3** (all plugins are free now) with **ScrollTrigger, SplitText, MotionPathPlugin, Flip**, registered once in `lib/gsap.ts`; use `@gsap/react` `useGSAP` for cleanup
- **Lenis** smooth scroll, synced with ScrollTrigger
- **Motion** (`motion/react`) for component-level micro-interactions and layout transitions
- **React Three Fiber + drei** for the glossy 3D service objects (one shared `<Canvas>` using drei `<View>` tracking, lazy-loaded, client-only)
- **Recharts** for planner and channel charts (styled with brand tokens)
- **zod** + **react-hook-form** for forms and planner state
- **@react-pdf/renderer** for the client-side media-plan PDF
- **@svg-maps/india** (or another CC-licensed India SVG from npm) for the reach map; add attribution in the footer credits
- **Vitest** (planner engine) and **Playwright** (smoke tests)
- ESLint + Prettier. Deploy target **Vercel**.

---

## 5. Pages and sections

```
/                         Home (all sections below)
/channels                 Channel universe: filterable grid + category tabs
/channels/[slug]          18 channel pages (SSG)
/planner                  Full Media Planner (two modes)
/planner-methodology      How estimates are calculated, assumptions, sources
/services                 6 services (Agenciex services pattern, expanded)
/work                     Campaign showcase (demo/concept, clearly labelled)
/about                    Agency story, approach, India reach
/contact                  Form + WhatsApp + map card
/insights, /insights/[slug]   MDX blog, 3 seed posts
/privacy, /terms, 404     (the 404 page has an animated "lost signal" TV glyph)
```

### 5.1 Home `/` (in this order)

**A. Preloader**: see §2 row 0.

**B. Hero**
- Dotted-grid background, soft orange radial glow bottom-centre, very subtle film grain.
- **3D channel cylinder** (§7.2): 18 poster cards.
- Under the cylinder: mono label `DRAG TO SPIN · 18 CHANNELS`.
- Headline (SplitText, words rise in with stagger): **"Every screen. Every street. Every state."** Subline: "A 360° media agency planning, buying and running campaigns across India, from print and prime time to metros, airports and Instagram."
- Two pills: `Plan my media` (orange, opens `/planner`) and `Explore channels` (outline).
- **Scroll-out:** as the user scrolls, the cylinder tilts back, scales to 0.8 and fades. The headline parallaxes up faster.

**C. Stats marquee**: see §2 row 3. Counters count up the first time they enter view.

**D. About**: see §2 row 4. Copy: "One agency for every channel India watches." Paragraph: "We plan the mix, buy the media, make the creative and run it on the ground, in one team with one plan and one report. Whether you need a single city or the whole country, we get your brand seen where your customers actually are."

**E. Services (6 cards with 3D objects)**
1. Media Planning & Buying (ATL, OOH, transit)
2. Creative & Production (films, print, OOH design, motion)
3. Digital, Social & Performance
4. Brand Partnerships (celebrities, sports, influencers)
5. On-ground, BTL & Activations
6. PR, Content & Digital Articles
Each card has a 1-line description, 4 mono bullets on hover (card expands), and an orange arrow button linking to `/services#slug`.

**F. Channel universe (pinned horizontal scroll)**
Headline: "Every channel India watches." The section pins and the content scrolls horizontally through **6 category panels**: ATL (Print, TV, Radio, Cinema) · OOH (Hoardings, DOOH) · Transit (Bus/BRTS/Auto, Metro wraps, Inside metro, Railways) · Travel (Airports, Airlines) · Fame (Stadiums & sports, Brand ambassadors, Influencers) · Digital (Social, Search & performance, Digital PR).
Each panel has a looping muted background video or a Ken Burns image (§8), the category's animated glyphs (§7.4), the channel names as large links, and a "best for" line. A progress bar tracks the horizontal position. On mobile it becomes a vertical stack with snap.

**G. India reach map**
SVG India map. City dots (approximately 40 major cities plus tier-2 hubs) **pulse in waves** radiating from a configurable HQ city (default Ahmedabad, set in `brand.config.ts`). Tabs: `Metro`, `Tier 1`, `Tier 2 & 3`, `Pan-India` change the highlighted dots. Hovering a state shows a tooltip with the channel strengths for that zone from `/data/regions.ts`. Counters beside the map are demo values.

**H. Industries (full-orange section)**: see §2 row 6. Industries: Real estate · Healthcare & hospitals · Education · FMCG & D2C · BFSI & fintech · Auto & EV · Renewable energy · Retail, fashion & jewellery. Each has a 2-line description, its top 4 recommended channels as chips, and 2 demo metrics.

**I. Media Planner block** (the conversion centrepiece on the home page)
Headline: "Tell us your budget. Or your channels." A compact version of the planner (§10) with the two-mode toggle, an industry select, a budget slider or channel chips, and a live animated donut plus 3 headline numbers. Button: `Open full planner →` (it carries state through URL params).

**J. Results bento**: see §2 row 7.

**K. Logo marquee**: see §2 row 8.

**L. 01–03 sticky feature stack**: see §2 row 9. The orange icon card overlapping each photo has a small animated glyph (data chart, India pin, receipt with tick).

**M. Campaigns table with cursor preview**: see §2 row 10. 6 demo rows link to `/work`.

**N. Twin taglines marquee**: see §2 row 11.

**O. Testimonials stacked deck**: see §2 row 12.

**P. Social row**: see §2 row 13.

**Q. Footer (dark)**: see §2 row 14. Also includes: contact card, WhatsApp button, newsletter field (no-op if no env), credits link (`/credits` lists every photo/video source and licence).

### 5.2 Channel page `/channels/[slug]`
Built from `/content/channels/*.mdx` frontmatter (schema in §6). Sections:
1. **Hero**: full-bleed video or image with an orange duotone overlay, mono label `(05) OUT-OF-HOME`, big H1 (SplitText), one-line promise, 3 quick stats (formats count, typical lead time, minimum effective monthly budget). The channel's glyph animates large in the corner.
2. **Formats**: animated icon grid (e.g. Hoardings: billboard, unipole, gantry, bridge panel, highway hoarding, mall facade).
3. **Where it sits in the funnel**: an animated bar per stage (awareness, consideration, conversion, loyalty).
4. **Who it reaches**: an audience affinity bar chart plus zone/tier strength mini-map.
5. **Best for**: industry chips (fit ≥ 4) and brand stages.
6. **Indicative costs**: unit, range, minimum effective budget, lead time. Always add: *"Indicative ranges for planning. Final rates depend on city, inventory, season and negotiation."* and link to `/planner-methodology`.
7. **How we run it, pan-India**: a 5-step animated process line (Plan → Buy → Create → Execute → Prove).
8. **Market context**: 1–2 sourced figures (§11) where available. Otherwise omit the block; never fabricate one.
9. **FAQs** (accordion + FAQPage JSON-LD).
10. **CTA**: "Plan a campaign with {channel}" opens `/planner?mode=budget&include={slug}`.
11. Next/previous channel, with a page transition where the card image expands (Motion `layoutId` or GSAP Flip).

### 5.3 Other pages
- `/channels`: a big filterable grid of the 18 cards (category tabs animate with Flip), plus the full channel × audience heatmap.
- `/services`: an Agenciex-style hover list; hovering a service dims the others and swaps a sticky image/3D object on the right.
- `/work`: a masonry grid of demo/concept campaigns with a filter by channel; every card is tagged `Concept`.
- `/about`: a giant SplitText headline, story, 4 promises (Clarity over noise · Accountable to numbers · One team, end to end · In it for the long run), a "How we work" wave timeline (Listen → Shape → Create → Launch → Measure), the India map again, and a team strip with placeholder cards using initials (no stock faces presented as staff).
- `/contact`: form (name, company, phone, email, city, industry, budget band, message), a WhatsApp CTA, and a static map card for the HQ city.

---

## 6. Content model

### 6.1 Channels (18, in this order; also the cylinder order)
01 Print Media · 02 Television · 03 Radio · 04 Cinema · 05 Hoardings & Billboards · 06 Digital OOH Screens · 07 Bus, BRTS & Auto Branding · 08 Metro Train Wraps · 09 Inside Metro (stations & coaches) · 10 Railways & Train Branding · 11 Airport Branding · 12 Airline & In-flight · 13 Stadiums & Sports · 14 Brand Ambassadors & Celebrities · 15 Influencers & Creators · 16 Social Media · 17 Search & Performance · 18 Digital Articles, Native & PR

### 6.2 `ChannelData` (MDX frontmatter, validated with zod at build time)
```ts
type ChannelData = {
  slug: string; order: number; name: string; shortName: string;
  category: 'ATL' | 'OOH' | 'Transit' | 'Travel' | 'Fame' | 'Digital';
  tagline: string; glyph: GlyphId; posterStyle: 'photo-duotone' | 'type-poster' | 'glyph-poster';
  media: { hero: MediaRef; card: MediaRef; video?: MediaRef };
  formats: { name: string; icon: string }[];
  funnel: { awareness: 1|2|3|4|5; consideration: 1|2|3|4|5; conversion: 1|2|3|4|5; loyalty: 1|2|3|4|5 };
  audienceAffinity: Record<AudienceId, 1|2|3|4|5>;
  zoneStrength: Record<ZoneId, 1|2|3|4|5>;          // North, South, East, West, Central, North-East
  tierStrength: { metro: number; tier1: number; tier2: number; tier3Rural: number };
  industryFit: Record<IndustryId, 1|2|3|4|5>;
  objectiveFit: Record<ObjectiveId, 1|2|3|4|5>;
  costs: {
    unitLabel: string;                               // e.g. "per site per month", "per 10-sec spot"
    cpm: { low: number; high: number };              // INR CPM-equivalent used by the planner
    minMonthlyINR: number; leadTimeDays: number;
    verified: false;                                 // all placeholders in this mockup
  };
  roleKpi: string;                                   // e.g. "Reach and recall", "Leads and CPL"
  market?: { label: string; value: string; source: SourceRef };
  faqs: { q: string; a: string }[];
  related: string[];
};
type MediaRef = { src: string; alt: string; credit: string; creditUrl: string; licence: 'Unsplash' | 'Pexels' | 'Own' | 'Generated' };
type SourceRef = { publisher: string; report: string; year: number; url: string };
```

### 6.3 Enumerations (`/data`)
- **Industries (8)**: as in §5.1-H.
- **Objectives (5)**: Awareness · Consideration & trust · Leads & enquiries · Sales & footfall · Launch buzz.
- **Brand stage (4)**: New / launching · Growing · Established · Relaunch.
- **Audiences (8)**: Gen Z (18–24) · Urban young professionals · Families · Bharat (tier 3 & rural) · Business decision-makers · Affluent / HNI · Daily commuters · Sports fans.
- **Regions**: zones → states → tiers. `cpmMultiplier`: Metro 1.3, Tier 1 1.0, Tier 2 0.8, Tier 3/rural 0.6 (planning assumptions, labelled as such).
- **Duration**: 1, 3, 6, 12 months.

### 6.4 Seed affinity matrix (planning assumptions; 5 = strongest)
- Print: Decision-makers 5, Families 4, Affluent 4, Bharat 4, Gen Z 1
- Television: Families 5, Bharat 5, Sports fans 4, Gen Z 2
- Radio: Commuters 5, Urban professionals 3, Bharat 3
- Cinema: Gen Z 5, Urban professionals 4, Families 4
- Hoardings: Commuters 5, Families 4, Bharat 3
- DOOH: Urban professionals 4, Affluent 4, Commuters 4
- Bus/BRTS/Auto: Commuters 5, Bharat 3, Families 3
- Metro wraps & inside metro: Commuters 5, Urban professionals 5, Gen Z 4
- Railways: Bharat 5, Families 4, Commuters 4
- Airport & airline: Affluent 5, Decision-makers 5
- Stadiums & sports: Sports fans 5, Gen Z 4, Families 3
- Brand ambassadors: Families 4, Bharat 4, Gen Z 4
- Influencers: Gen Z 5, Urban professionals 4, Bharat 3
- Social: Gen Z 5, Urban professionals 5
- Search & performance: Decision-makers 4, every other segment 3 (intent-led)
- Digital PR: Decision-makers 5, Affluent 4

### 6.5 Seed costs (all `verified:false`; planning placeholders for the mockup)
| Channel | Min monthly (₹) | CPM-equivalent (₹, low–high) | Lead time (days) |
|---|---|---|---|
| Print | 3,00,000 | 150–600 | 3 |
| Television | 10,00,000 | 60–250 | 10 |
| Radio | 2,00,000 | 40–150 | 5 |
| Cinema | 2,00,000 | 150–400 | 7 |
| Hoardings & billboards | 1,50,000 | 30–120 | 10 |
| Digital OOH | 1,00,000 | 80–300 | 5 |
| Bus, BRTS & auto | 1,00,000 | 20–80 | 10 |
| Metro train wraps | 5,00,000 | 40–150 | 21 |
| Inside metro | 1,50,000 | 60–200 | 10 |
| Railways & trains | 3,00,000 | 15–60 | 21 |
| Airport | 5,00,000 | 300–1,200 | 14 |
| Airline & in-flight | 4,00,000 | 400–1,500 | 21 |
| Stadiums & sports | 10,00,000 | 100–500 | 30 |
| Brand ambassadors | 25,00,000 (fee) | 50–200 (on amplified reach) | 30 |
| Influencers & creators | 1,00,000 | 100–400 | 7 |
| Social media | 50,000 | 60–200 | 2 |
| Search & performance | 50,000 | 150–600 (CPC ₹10–60) | 2 |
| Digital articles & PR | 1,00,000 | 200–800 | 5 |

Also add **CPL ranges by industry** for social and search (placeholders), e.g. Real estate ₹300–1,500, Education ₹150–600, Healthcare ₹200–800, BFSI ₹250–1,000, FMCG/D2C ₹80–300 (cost per purchase/lead), Auto ₹300–1,200, Renewable energy ₹250–1,000, Retail ₹100–400.

Build a dev-only page `/admin/data-audit` (excluded from production builds) that lists every `verified:false` value so a media team can replace them with real rate cards.

---

## 7. Motion system (the heart of this build)

### 7.1 Principles
- Every section has **one hero motion** and subtle supporting motion. Motion must be smooth (60 fps on a mid-range laptop), never block reading, and never delay LCP.
- Easing tokens in `lib/motion.ts`: `out-expo` (0.16, 1, 0.3, 1), `in-out-quart`, plus spring presets. Durations: 0.4 / 0.8 / 1.2 s.
- Scroll reveals by default: headlines use SplitText (lines mask up, 0.06 s stagger), paragraphs fade up 24px, images clip-path reveal (inset 100% → 0) with a 1.1 → 1.0 scale.
- Animate only transform, opacity and clip-path. Use `will-change` sparingly. Kill ScrollTriggers on route change.

### 7.2 The 3D channel cylinder (hero)
- **Pure CSS 3D** (no WebGL) so it is light and crisp: a container with `perspective: 1600px`, a `rotateX(-8deg)` tilt to view from slightly above like Agenciex, and 18 cards placed at `rotateY(i * 20deg) translateZ(R)` where R is computed from card width so cards nearly touch. Cards use `backface-visibility: visible` so the rear cards show through the gap, darkened via an angle-based brightness filter.
- **Physics:** velocity-based rotation with friction (0.95 per frame), auto-rotate at 0.04 deg/frame when idle, pointer drag adds velocity, wheel/trackpad horizontal adds velocity, and touch swipe works. Clamp the max speed.
- **Cards** are mini **motion posters** in 3 styles, rotating through the set:
  - `photo-duotone`: photo with orange/ink duotone (CSS `mix-blend-mode` or an SVG filter), channel name in big tight type, mono index `(05)`.
  - `type-poster`: cream card, giant typographic channel name with orange concentric-ring motif (like "Atlas House" / "Echo house").
  - `glyph-poster`: ink or orange card with the channel's **animated glyph** (§7.4) playing inside.
- Hover: the card translates outward 30px with a brighter shadow, and an `Explore →` chip appears. Click: Flip transition into the channel page hero.
- Keyboard: focusable region; ←/→ rotate one card; Enter opens the front card. `aria-roledescription="carousel"`.
- Reduced motion or small screens: a horizontal snap carousel with a slight perspective curve and no auto-rotate.

### 7.3 Glossy 3D service objects (R3F)
One lazy-loaded shared Canvas with drei `<View>` per card. Six procedural objects in brand orange with `MeshPhysicalMaterial` (clearcoat 1, roughness 0.15) and a soft studio `Environment` preset: torus (planning), stacked capsules (production), starburst of rounded cylinders (digital), blob cluster with `MeshDistortMaterial` (partnerships), rounded cube with a cut-out (on-ground), a swirl knot (PR). Slow idle rotation, a pointer-follow tilt, and a squash on hover. Pause rendering when off-screen (`frameloop="demand"` plus IntersectionObserver). Fallback: pre-rendered PNGs via `scripts/render-objects.ts` if WebGL is unavailable, or CSS gradient blobs if that is too heavy to do in this run.

### 7.4 Animated channel glyph library (`/components/glyphs`)
**18 small SVG motion graphics**, one per channel, in brand colours. Each uses CSS/GSAP timelines, loops seamlessly, pauses off-screen and has a static frame for reduced motion. Each must work at 48px (chips) and 480px (posters).
- Print: a newspaper unfolds; headline lines type in.
- TV: an old CRT with scanlines; the channel changes; an orange "LIVE" dot blinks.
- Radio: a transistor with sound waves pulsing outward.
- Cinema: a film reel spins; a projector beam flickers.
- Hoardings: a billboard on a pole; the poster flips panel by panel (trivision).
- DOOH: a portrait screen cycling 3 ad frames with a slide transition.
- Bus/BRTS/Auto: an auto-rickshaw drives across with its branded canopy; wheels spin.
- Metro wraps: a metro train glides along a track; the wrap colour sweeps on.
- Inside metro: a platform with a row of panel lightboxes lighting up in sequence.
- Railways: a train snakes across with carriages appearing.
- Airport: a departure board with flipping split-flap letters, then a plane icon.
- Airline: a plane crosses a dotted route arc between two pins.
- Stadiums & sports: a cricket ball follows an arc; an LED perimeter board scrolls.
- Brand ambassadors: a star burst; a camera flash; a spotlight cone sweeps.
- Influencers: a phone with a reel progress bar; hearts float up.
- Social: a feed scrolls; like/comment counters tick up.
- Search & performance: a search bar types a query; a results bar chart rises; a cursor clicks.
- Digital PR: an article card with a headline highlight sweep; share icons pop.
Build `/admin/glyphs` (dev-only) to preview all 18 at both sizes.

### 7.5 Other signature motions
- Rolling slot-machine digits for stats.
- Infinite marquees (CSS keyframes; pause on hover; respect reduced motion).
- Sticky stacking cards (01–03).
- A pinned horizontal scroll (channel universe).
- An India map pulse wave.
- A cursor-follow image preview (campaign table).
- A stacked-deck testimonial slider with drag.
- A footer wave ribbon with cards on a MotionPath, plus a scroll-velocity boost.
- A **magnetic** effect on primary buttons (they move up to 6px toward the cursor).
- A custom cursor: a small orange dot that grows into a ring with "Drag" on the cylinder and "View" on cards (desktop only; disabled on touch).
- Page transitions: an orange panel wipes up, then the page reveals (≤ 600 ms).
- Number tweening in the planner (allocations animate when inputs change; the donut segments morph).

### 7.6 Reduced motion and performance
- Under `prefers-reduced-motion: reduce`: no auto-rotate, no marquees (static rows), no parallax or pinning (sections stack normally), glyphs show their static frame, and Lenis is disabled.
- Performance budget: Lighthouse mobile ≥ 85 Performance and ≥ 95 Accessibility/Best Practices/SEO on Home; LCP < 2.5 s. The hero headline is the LCP element and renders as server HTML; the cylinder hydrates after. R3F, maps and Recharts are dynamically imported below the fold.

---

## 8. Images and video from the web

**Goal:** high-quality, India-relevant photos and short video loops, with **zero broken images** in the deployed site.

1. **Sources:** Unsplash and Pexels only (free licences, attribution recorded). Hotlink via `images.unsplash.com` / `images.pexels.com` / `videos.pexels.com` (add `remotePatterns` in `next.config`). Use Unsplash's `?w=&q=&auto=format&fit=crop` params for sizing.
2. **Finding them:** use your web search/fetch tools to find specific photo or video pages (e.g. "Mumbai billboard night", "Delhi metro train", "Indian railway station crowd", "airport terminal India", "cricket stadium floodlights", "Indian newspaper", "auto rickshaw Mumbai street", "multiplex cinema seats", "radio studio microphone", "phone social media scrolling", "Indian city traffic dusk", "team meeting agency office"). **Only use a media URL you actually obtained from a fetched page or API response. Never construct or guess photo IDs.** If `UNSPLASH_ACCESS_KEY` or `PEXELS_API_KEY` is set, `scripts/fetch-media.ts` may use the APIs instead.
3. **Registry:** every asset goes in `/content/media.ts` (`MediaRef[]` with `sourcePage` URL, photographer and licence). The `/credits` page renders it.
4. **Verification:** `scripts/check-media.mjs` sends a HEAD request for every URL and writes `MEDIA_REPORT.md`. If the sandbox network blocks it, mark them `unchecked` in the report and continue.
5. **Runtime safety net:** every image/video goes through `<SmartMedia>`, which shows a branded animated fallback (orange gradient mesh + that channel's glyph) on error, so a dead URL never looks broken. Videos are muted, `playsInline`, `loop`, `preload="metadata"` with a poster, and load only when near the viewport. Use **no autoplay video on mobile data** (respect `navigator.connection.saveData`).
6. **Rules:** no real brands' ad campaigns, no recognisable celebrities or public figures, no logos of real brands, leagues or teams, and no stock faces presented as our staff or clients. For the ambassadors/celebrity channel, use a stage, spotlights, a crowd or camera flashes rather than a person.
7. Write `IMAGE_PROMPTS.md` with an AI-image prompt for every slot still using a fallback, in this style: *photoreal, Indian city context, blue hour or warm studio light, orange #FF6036 accent on the media surface, ink and cream tones, 3:2, no real brand logos, no legible text.*

---

## 9. Demo content and honesty

- All stats, client logos, testimonials, campaign rows and case studies are demo. They live in `/content/demo.ts` (`demo: true`), generic and obviously placeholder (fictional brand names, initials avatars).
- `NEXT_PUBLIC_DEMO_MODE=true` (the default) shows a small, tasteful pill in the footer and on the testimonials/work sections: "Template preview · sample content". Turning it off hides the pill, and the build then **fails** if any `demo: true` item is still rendered (a guard in `lib/demo-guard.ts`). This prevents a real launch with fake proof.
- While in demo mode, add `noindex` via metadata and `robots.txt`.
- Market figures (§11) must carry a source and are not demo.

---

## 10. Media Planner (`/planner` + home block + floating drawer)

### 10.1 UX
- Mode toggle at the top: **"I have a budget"** / **"I know my channels"**. State lives in URL params, so a plan can be shared with one link.
- Shared inputs: Industry · Objective · Brand stage · Regions (HQ city / state / zones / Pan-India, plus tiers) · Audiences (optional multi-select) · Duration.
- **Mode A, Budget → Channels:** an INR budget slider on a log scale from ₹1 L to ₹10 Cr, plus a numeric input with Indian formatting. Optional "must include" and "exclude" channel chips.
- **Mode B, Channels → Budget:** pick channels from 18 cards (each shows its glyph). Intensity tiers: **Launch · Elevate · Dominate**.
- **Live results panel** (sticky on the right on desktop, a bottom sheet on mobile), animating on every change:
  - Mode A: a donut of the recommended mix plus a table (channel, %, ₹, est. impressions range, role, a one-line "why").
  - Mode B: 3 scenario cards (Launch / Elevate / Dominate) with total ₹ range, per-channel split, impressions and reach ranges.
  - Both: total impressions range, estimated reach range, a KPI line (reach/recall for awareness; lead range and CPL for performance), and "Channels we'd add".
  - Badge: "Indicative estimate · How we calculate" links to `/planner-methodology`.
- **Actions:** `Copy share link` · `Download plan (PDF)` (client-side React-PDF: cover, inputs, mix, scenarios, assumptions, contact) · `Send on WhatsApp` (`wa.me/<brand number>?text=<encoded summary>`) · `Get a detailed plan from our team` (lead modal: name, company, phone, email, city, message).

### 10.2 Engine (`/lib/planner`, pure TypeScript, no React, unit-tested)
```
score(ch) = wI*industryFit + wO*objectiveFit + wS*stageFit
          + wR*regionStrength(zones, tiers) + wA*avg(audienceAffinity[selected])
```
- Weights and multipliers are in `/data/planner-weights.ts`.
- Stage rules: New/launching boosts awareness channels (OOH, cinema, TV, influencers, PR). Established tilts to performance. Relaunch boosts PR, OOH and social.
- **Mode A:** N channels by budget (< ₹5 L: 2–3; ₹5–25 L: 3–5; ₹25 L–1 Cr: 4–7; > ₹1 Cr: 5–9). Allocate ∝ score^1.5. Drop any channel below `minMonthlyINR × months` and redistribute. Keep ≥ 10% in a trackable digital channel when the objective is leads or sales. Cap any single channel at 50% unless it is the only one.
- **Mode B:** per channel, Launch = `minMonthlyINR × months`, Elevate = 2.5×, Dominate = 6× (configurable), × the region multiplier × a city-count factor.
- Impressions = spend ÷ (CPM × region multiplier) × 1000, using the low and high CPM to give a range. Reach = impressions ÷ the channel's assumed frequency. Leads = performance spend ÷ the CPL range.
- Every result returns its `assumptions[]` for the PDF and methodology page.
- **Vitest:** at least 10 persona snapshot tests (e.g. "Ahmedabad real-estate launch ₹40 L / 3 months", "Pan-India D2C established ₹2 Cr", "Gujarat solar B2B ₹8 L leads", "Mumbai hospital ₹15 L awareness", "Channels only: metro + airport + social, Elevate"). Also test edge cases: tiny budgets, a single channel, every channel excluded.

### 10.3 Lead capture (optional, env-gated)
- `POST /api/lead`: zod validation, honeypot, a simple in-memory IP rate limit. If `SHEETS_WEBHOOK_URL` is set, POST the lead JSON there (ship `integrations/google-apps-script/Code.gs` + README). If `RESEND_API_KEY` + `LEAD_EMAIL_TO` are set, send a notification email. If neither is set, log the lead server-side and return success, so the demo always works.
- Capture UTM params, referrer and landing page in a first-party cookie and attach them to leads.
- Analytics: GA4 / Meta Pixel only if their IDs are set. Events: `planner_mode`, `planner_result`, `plan_pdf`, `plan_share`, `whatsapp_click`, `lead_submit`.

---

## 11. Market figures (sourced; verify before display)

Seed `/data/market.ts` with these. Show each with its source in small mono text. Use them on `/channels`, on the relevant channel pages, and in one home stat (not demo):
- India ad spend 2025: **₹1,55,105 crore**, about +12% vs 2024. 2026 forecast **₹1,74,605 crore**, digital about 64%. Source: Pitch Madison Advertising Report 2026.
- 2025 by medium (same report): TV ₹32,855 cr · Print ₹20,866 cr · Outdoor ₹4,835 cr · Radio ₹2,515 cr · Cinema ₹877 cr.
- Sports advertising ecosystem 2025: about ₹18,864 crore, cricket about 89%. Source: WPP Media "Sporting Nation" 2026.
- Influencer marketing 2025: about ₹3,000–3,500 crore. Source: Kofluence 2026.

If you can fetch the source and a number does not match, use the source's number and log the change in `DECISIONS.md`. If you cannot verify a figure, keep it but add `verified: false`, which hides it while demo mode is off.

---

## 12. Template architecture, SEO, quality

```
/brand      brand.config.ts (name, tagline, HQ city, contacts, WhatsApp, socials, logo), theme.ts (presets), copy.ts
/content    channels/*.mdx, services.ts, industries.ts, demo.ts, media.ts, insights/*.mdx
/data       regions.ts, audiences.ts, planner-weights.ts, market.ts
/lib        planner/, motion.ts, gsap.ts, format-inr.ts, demo-guard.ts
/components sections/, glyphs/, three/, ui/
/scripts    check-media.mjs, fetch-media.ts, check-hardcoded-brand.ts
```
- `scripts/check-hardcoded-brand.ts`: fails CI if "Media360" appears outside `/brand`, `/content` or `/data`.
- SEO: metadata per page, OG images via `next/og` (cream background, orange pill, channel name), JSON-LD (`Organization`, `ProfessionalService` with `areaServed: India`, `Service` per channel, `FAQPage`, `BreadcrumbList`), `sitemap.xml`, `robots.txt` (noindex in demo mode), `llms.txt`.
- **Playwright smoke tests:** home renders and the cylinder responds to drag; reduced-motion home renders without errors; a channel page renders; the planner returns results in both modes and the share URL restores state; the lead API happy path works.
- Docs: `README.md` (run, build, env, deploy), `CLONING.md`, `DECISIONS.md`, `MEDIA_REPORT.md`, `IMAGE_PROMPTS.md`, `.env.example`.

`.env.example`:
```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEMO_MODE=true
LEAD_EMAIL_TO=
LEAD_EMAIL_FROM=
RESEND_API_KEY=
SHEETS_WEBHOOK_URL=
SHEETS_WEBHOOK_SECRET=
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_META_PIXEL_ID=
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=
VERCEL_TOKEN=
```

---

## 13. Build plan: run all modules in one go

| Module | Contents | Can run in parallel after |
|---|---|---|
| **M1 Scaffold & design system** | Next.js + Tailwind v4 + tokens + theme presets + fonts, layout, nav, footer shell, Lenis + GSAP setup, `SmartMedia`, page transition, cursor, dotted-grid/glow backgrounds, docs skeleton | (first) |
| **M2 Hero cylinder + preloader** | §7.2 and the preloader, including fallbacks and keyboard control | M1 |
| **M3 Content & media** | 18 channel MDX files with real, useful copy; `/data` seeds; demo content; media sourcing + `media.ts` + `check-media` + credits page + `IMAGE_PROMPTS.md` | M1 |
| **M4 Glyph library** | 18 animated SVG glyphs + `/admin/glyphs` | M1 |
| **M5 Home sections** | Every section in §5.1 with its motion | M2, M3, M4 |
| **M6 Planner** | Engine + Vitest, UI (both modes), home block, floating drawer, PDF, share, WhatsApp, lead API | M1 (engine), M3 (UI data) |
| **M7 Inner pages** | `/channels`, `/channels/[slug]`, `/services`, `/work`, `/about`, `/contact`, `/insights`, `/planner-methodology`, `/credits`, 404 | M3, M4 |
| **M8 3D service objects** | §7.3 + fallbacks | M1 |
| **M9 Polish & QA** | Reduced motion, a11y, SEO, demo guard, brand-hardcode check, Lighthouse, Playwright, mobile pass at 375 / 768 / 1280 / 1440 widths | all |
| **M10 Ship** | Push, deploy to Vercel, verify the live URL, write `REPORT.md` | all |

**Self-review before shipping:** run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`. Start the production server and take Playwright screenshots of Home (desktop + mobile), one channel page and the planner in both modes. Save them to `/qa/screenshots/` and look at them yourself. Fix anything that looks broken, misaligned, empty or unlike the Agenciex reference before shipping.

---

## 14. Git and deployment

1. Work on `main` if you are allowed to push to it. If your environment forces a branch, push the branch and open a PR titled "Media360 v1: full site build". Vercel builds a preview for the branch either way.
2. **Deploy, in order of preference:**
   - **A. Vercel Git integration (preferred).** If the repo is already connected to a Vercel project, every push deploys automatically. Get the deployment URL from the GitHub commit status / PR checks (`gh pr checks` or the commit's status API) and put it in `REPORT.md`.
   - **B. Vercel CLI.** If `VERCEL_TOKEN` is available and `api.vercel.com` is reachable: `pnpm dlx vercel pull --yes --environment=preview --token=$VERCEL_TOKEN`, then `vercel build` and `vercel deploy --prebuilt --token=$VERCEL_TOKEN`. For production use `--prod`.
   - **C. Neither works.** Do not try workarounds. Make sure the repo builds cleanly, add a **"Deploy with Vercel"** button to `README.md` (`https://vercel.com/new/clone?repository-url=https://github.com/ShubhamThakkar17/mediaagency-v1`), and in `REPORT.md` give me the 3-click steps to import the repo on Vercel.
3. Vercel settings: framework Next.js, build `pnpm build`, Node 20+, no required env vars.

---

## 15. Definition of done (`REPORT.md` must tick each)

- [ ] Live Vercel URL (or the exact reason why not, plus steps).
- [ ] The home page has every section in §5.1 with its motion, and it looks and feels like the Agenciex reference adapted to media.
- [ ] The cylinder spins with drag, wheel, touch and keyboard, and the reduced-motion fallback works.
- [ ] All 18 glyphs animate; `/admin/glyphs` exists in dev.
- [ ] All 18 channel pages render with media, formats, funnel, audiences, costs disclaimer and FAQs.
- [ ] The planner works in both modes, the URL restores state, the PDF downloads, WhatsApp share opens, and the lead API returns success with no env vars.
- [ ] Zero broken images (`SmartMedia` fallback verified by temporarily breaking a URL in a test).
- [ ] Demo content is labelled, the demo guard works, and noindex is on in demo mode.
- [ ] The brand-hardcode check passes; switching the theme preset reskins the site (screenshot in `/qa`).
- [ ] lint, typecheck, Vitest, Playwright and build all pass. Lighthouse scores are recorded in `REPORT.md`.
- [ ] `README.md`, `CLONING.md`, `DECISIONS.md`, `MEDIA_REPORT.md`, `IMAGE_PROMPTS.md` and `.env.example` are complete.
- [ ] `REPORT.md` lists what is placeholder and what I should replace first (name, contacts, rates, demo content, AI images).
