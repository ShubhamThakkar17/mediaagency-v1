# Decisions

One line per judgement call made during the build, with the reason.

## Process and tooling
- **Branch:** worked on `claude/serene-feynman-cc9px7` because this environment only allows pushes to that branch. No PR was opened: a PR needs your go-ahead in this environment (brief §14.1 assumed one).
- **Next.js 15.5 + React 19, TypeScript 5.9:** TypeScript 7 was the npm default but is too new for the Next 15 toolchain, so I pinned 5.9.
- **Playwright pinned to the pre-installed browser build (1.63)** so tests run without downloading browsers.
- **Dev-only pages use the `.dev.tsx` extension** (`/admin/glyphs`, `/admin/data-audit`). `next.config.ts` drops that extension from `pageExtensions` in production, so they never ship.
- **Parallel work:** content, media, glyphs and the planner engine were built by parallel workers after M1. Two workers hit a usage limit and were restarted on Opus from their saved files.

## Design system
- **Headline classes are `t-hero`, `t-1`, `t-2`, `t-3`**, not `h-1`/`h-2`, because Tailwind's `h-1` (height: 4px) collided and collapsed headlines.
- **Theme presets are CSS variables written into `<head>`**, plus `[data-theme]` blocks for every preset, so `?theme=indigo` previews a preset on any page without a rebuild.
- **`onBrand` token added** (text colour on the brand fill) so indigo and forest presets keep AA contrast on buttons and pills.
- **Logo is typeset, not an image:** `logo.base` + `logo.accent` in config. The favicon is generated from the accent.

## Motion
- **Cylinder radius is `3.3 × card width`** rather than the touching-cards value (2.84×). Neighbouring cards otherwise hid each other's channel names.
- **Cylinder falls back to a snap carousel below 768px and under reduced motion** (CSS media queries, so there is no layout shift on hydration).
- **Hero headline animates with CSS keyframes, not SplitText,** so it stays server-rendered HTML and remains the LCP candidate.
- **Preloader shows only on `/`, once per session,** decided by an inline script before first paint. It has a 4-second CSS failsafe and `?nopreload` to skip it.
- **One reveal observer for the whole site** (`[data-reveal]`). Zero-area elements (clip reveals, growing bars) are observed through their parent, because a fully clipped element never reports an intersection.
- **Industries section pins only on desktop with motion allowed.** On mobile or under reduced motion it is a normal list with tap-to-select.
- **Footer wave uses MotionPathPlugin's raw-path sampling** to place cards each frame. Scroll velocity briefly speeds up the timeline.

## 3D
- **drei `<View>` is rendered inside each card,** with one fixed `<Canvas>` and `View.Port`. Passing `track` to a View rendered outside the Canvas is ignored by drei v10.
- **Lightformer environment instead of a drei `Environment` preset,** because presets download HDR files from a CDN at runtime. Lightformers need no network.
- **Fallback is a CSS gradient blob** (no WebGL, Save-Data, or before load). I chose this over pre-rendered PNGs (allowed by the brief) to keep the build simple and asset-free.

## Content and data
- **Channel frontmatter refers to media by registry id** (`media.hero: ch-print`), not inline MediaRef objects, so credits live in one file (`content/media.ts`).
- **Extra frontmatter fields `summary` and `bestFor`** were added to the schema for the page hero and best-for chips.
- **Market figures:** all ten §11 figures kept their values. A content worker checked them against trade coverage of each report (Social Samosa for Pitch Madison, WPP Media's own page, Campaign India for Kofluence) and set `verified: true`. The links are in `data/market.ts`. Wording change: the sports figure is labelled "India sports economy, 2025 (sponsorship, endorsement and media spends)", which is how the source describes ₹18,864 crore.
- **City positions are projected onto the @svg-maps/india viewBox with a fitted Mercator transform** (calibrated against small UTs). 51 of 52 cities fall inside their state's outline; Chandigarh sits on the border of its 3px-wide UT.
- **Zones** follow media-planning practice (for example Rajasthan in North, Madhya Pradesh and Chhattisgarh in Central), not administrative zonal councils.

## Planner
- **Spends round to ₹1,000.** On an odd-thousand budget split between two channels, one line can sit ₹1,000 above an exact 50%. The test asserts the cap in rupees, not in rounded percentages.
- **Reach de-duplication:** 7% overlap per extra channel (capped at 45%), and reach capped at a share of the population in play. Frequency grows as months^0.7. All of this is documented on `/planner-methodology`, which reads the constants directly so it cannot drift.
- **Mode B geography:** a city-count factor (city 1, state 2.5, each zone 3.5, pan-India 16) applies fully to physical media and as factor^0.5 to digital and talent-led channels.
- **Intensity selection in Mode B is UI state only** (Elevate highlighted by default). The URL carries the channels, and all three scenarios are always shown.
- **PDF uses Helvetica with "Rs" for amounts,** because React-PDF's built-in fonts have no ₹ glyph. Embedding a font file was not worth the weight.
- **Recharts and the planner drawer load on demand,** which took about 100 kB off every page.

## Media
- **37 of 46 slots filled** with Unsplash photos whose URLs were read from fetched pages. Nine slots (6 optional videos, `work-3`, `work-4`, `insight-1`) use the animated fallback because no compliant free photo was found. They have prompts in IMAGE_PROMPTS.md.
- **No stock faces as staff:** `about-team` is an empty meeting room, and the team strip uses initials.

## Honesty and SEO
- **Demo mode is on by default** and sets `noindex` plus a disallow-all `robots.txt`. That is why Lighthouse SEO reads about 66: the crawlability audit fails on purpose. With demo mode off, the same audit passes.
- **The demo guard throws at render time,** so `NEXT_PUBLIC_DEMO_MODE=false pnpm build` fails while sample content remains. I verified this by running that build. It failed on "About map counters", which is still sample content.
