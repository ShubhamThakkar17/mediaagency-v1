# Build report · Media360 v1

**Status:** all ten modules are built, tested and pushed to `claude/serene-feynman-cc9px7` (currently the repo's only branch). The site builds with zero environment variables. **It is not deployed yet:** see the first item below for the one step left.

## Definition of done (BRIEF §15)

- [ ] **Live Vercel URL.** Not done. The repo is not connected to a Vercel project, no `VERCEL_TOKEN` was available for the CLI, and my attempt to create the project through the Vercel connector was blocked by this session's permission system. Following §14 option C, I added a Deploy with Vercel button to README.md. **To deploy (3 clicks):**
  1. Open https://vercel.com/new/clone?repository-url=https://github.com/ShubhamThakkar17/mediaagency-v1 (or vercel.com/new → Import `mediaagency-v1`).
  2. Keep the detected settings: Framework *Next.js*, build `pnpm build`, Node 20+. Add no env vars.
  3. Click **Deploy**. After that, every push builds a preview automatically.

  If the import asks for a production branch, choose `claude/serene-feynman-cc9px7`, or merge it into `main` first.
- [x] **Home page:** every §5.1 section with its motion: preloader, 3D cylinder hero, stats marquee, about with parallax, 6 services with 3D objects, pinned horizontal channel universe, India reach map with pulse waves and tier tabs, pinned full-orange industries, planner block, rolling-digit bento, logo marquee, sticky 01–03 stack, campaigns table with cursor preview, twin marquees, stacked testimonial deck, social row and the footer wave with riding cards. It follows the Agenciex layout rhythm (screenshots in `qa/screenshots/home-desktop-*.png`).
- [x] **Cylinder** spins with drag, horizontal wheel, touch and keyboard (←/→ snap one card, Enter opens). Below 768px or under reduced motion it becomes a snap carousel. Covered by the Playwright drag and keyboard test and the reduced-motion test.
- [x] **All 18 channel glyphs** (plus 4 extras) animate, pause off-screen and show a static frame under reduced motion. `/admin/glyphs` exists in dev only.
- [x] **All 18 channel pages** render a hero with media, formats, funnel, audience chart, zone map and tiers, best-for, costs with the disclaimer, process, market context (where sourced), long-form copy, FAQs with FAQPage JSON-LD, CTA, related channels and prev/next.
- [x] **Planner** works in both modes. The URL restores state, the PDF downloads, WhatsApp share opens a `wa.me` link, and the lead API returns success with no env vars (all covered by Playwright).
- [x] **Zero broken images.** 37 of 46 media slots hold verified Unsplash photos (`MEDIA_REPORT.md`: 37 ok, 0 failed). The rest show the branded fallback. A Playwright test forces every Unsplash URL to 404 and confirms no broken image appears.
- [x] **Demo content** is labelled with a "Template preview · sample content" badge, and noindex plus a disallow-all robots.txt are on in demo mode. The guard works: `NEXT_PUBLIC_DEMO_MODE=false pnpm build` fails with `[demo-guard] … "About map counters"`, and unit tests cover it.
- [x] **Brand-hardcode check passes** (`pnpm check:brand`). Switching the theme preset reskins the site: `qa/screenshots/theme-indigo.png` and `theme-forest.png`.
- [x] **lint, typecheck, Vitest (69 tests), Playwright (8 smoke tests) and build all pass.** Lighthouse scores are below.
- [x] **Docs:** README.md, CLONING.md, DECISIONS.md, MEDIA_REPORT.md, IMAGE_PROMPTS.md, .env.example and this report.
- [x] **Placeholders** are listed below.

## Lighthouse (mobile, local production build)

Lighthouse 12 mobile preset (simulated slow 4G, 4× CPU throttle), run against `pnpm start` in the build container.

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 74 | 100 | 100 | 66* | 5.0 s | 290 ms | 0 |
| `/channels/hoardings` | 71 | 100 | 100 | 69* | 7.6 s | 230 ms | 0 |
| `/planner` | 79 | 100 | 100 | 66* | 5.3 s | 110 ms | 0 |

\* SEO is held down on purpose: demo mode sets `noindex`, so the "page is crawlable" audit fails. Every other SEO audit passes. With demo mode off it should score in the 90s.

**Performance misses the 85 target.** I fixed what I could without cutting motion:
- Recharts and the planner drawer now load on demand, which took about 100 kB off every page.
- Below 768px the hero carousel shows glyph posters, so a text block is the LCP element rather than a photo. The headline itself animates word by word, so it isn't one block.

What remains is mostly main-thread JavaScript from the motion stack (GSAP with four plugins, Lenis and Motion, about 200 kB shared) under a 4× CPU throttle, plus remote Unsplash images on channel heroes. Recommended next steps, in order:
1. Load GSAP's ScrollTrigger and SplitText per section with dynamic imports instead of in the shared bundle.
2. Use Motion's `LazyMotion` with `domAnimation`.
3. Serve channel hero images at 800 px on mobile, or self-host them with `next/image`.
4. Measure on the real Vercel deployment, which serves from the edge and is usually 10 to 15 points better than this container.

## What is placeholder, and what to replace first

1. **Brand identity** (`brand/brand.config.ts`): name, legal entity, address, email, phone and WhatsApp number are all placeholders (`hello@example.com`, `+91 00000 00000`). Replace these before anything else: every CTA, the PDF and the WhatsApp links use them.
2. **Demo proof** (`content/demo.ts`, plus metrics in `content/industries.ts`): stats (28 + 8, 700+ cities, 12+ years, 4.9 rating), fictional client logos, testimonials, six concept campaigns, results-bento numbers, map counters and team roles. Replace them with real, provable items, then set `NEXT_PUBLIC_DEMO_MODE=false`.
3. **Rates** (`content/channels/*.mdx` `costs`, `data/industries.ts` CPL ranges, `data/planner-weights.ts`): every CPM, minimum spend, lead time, cost per lead, frequency and overlap assumption is a planning placeholder (`verified: false`). `/admin/data-audit` (dev) lists them all. Have the media team swap in rate cards.
4. **Channel scores** (affinity, funnel, zone, tier, industry and objective fits in each channel file) are reasoned planning assumptions, not research data.
5. **Images:** 9 slots use the animated fallback (6 optional videos, `work-3`, `work-4`, `insight-1`), and IMAGE_PROMPTS.md has an AI-image prompt for each. Weaker picks worth swapping: `about-portrait` (a blank bus-shelter lightbox), `about-team` (an empty meeting room), `ch-television` (TV switched off) and `insight-3` (a railway platform, not a metro).
6. **Legal pages** (`/privacy`, `/terms`) are template text for your lawyer to review.
7. **Market figures** (`data/market.ts`) are sourced and checked against trade coverage of each report. Re-check them against the original reports before launch.

## Notes

- **No pull request was opened.** In this environment a PR needs your explicit go-ahead. The work is all on the branch. Ask, and I will open "Media360 v1: full site build".
- `qa/screenshots/` has desktop and mobile home captures, inner pages, both planner modes and the two theme presets. Full-page captures of very tall pages sometimes repeat a tile near the bottom. That is a Chromium capture artifact; the pages themselves are fine.
- Run everything locally with `pnpm install && pnpm check`, then `pnpm test:e2e`.
