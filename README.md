# Media360 · 360° media agency website template

A fully animated marketing site for a pan-India media agency: a spinning 3D channel cylinder, 18 channel pages, a two-way media planner, an India reach map, glossy 3D service objects and a library of 22 animated channel glyphs. Everything brand-specific lives in config, so the template can be rebranded in under an hour (see [CLONING.md](./CLONING.md)).

> **Template preview.** Stats, client logos, testimonials and campaigns are sample content, and every rate is a planning placeholder. See [REPORT.md](./REPORT.md) for what to replace first.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ShubhamThakkar17/mediaagency-v1)

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · GSAP 3 (ScrollTrigger, SplitText, MotionPath, Flip) · Lenis · Motion · React Three Fiber + drei · Recharts · zod + react-hook-form · @react-pdf/renderer · Vitest · Playwright. pnpm, Node 20+.

## Run

```bash
pnpm install
```

```bash
pnpm dev
```

Open http://localhost:3000. Dev-only tools: `/admin/glyphs` (all glyphs at 48px and 480px) and `/admin/data-audit` (every placeholder rate). Both are excluded from production builds.

Useful URL flags: `?nopreload` skips the preloader, and `?theme=indigo` or `?theme=forest` previews another theme preset.

## Quality checks

```bash
pnpm check
```

That runs lint, typecheck, Vitest (69 tests), the brand-hardcode check and a production build. Individually:

| Command | What it does |
|---|---|
| `pnpm lint` | ESLint (next/core-web-vitals + TypeScript) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest: planner engine personas and edge cases, URL state, INR formatting, demo guard |
| `pnpm check:brand` | Fails if the brand name is hard-coded outside `/brand`, `/content`, `/data` |
| `pnpm build` | Production build. Passes with **zero** environment variables |
| `pnpm test:e2e` | Playwright smoke tests (needs `pnpm build` first; starts `pnpm start` on port 3210) |
| `pnpm check:media` | HEAD-checks every image URL and rewrites `MEDIA_REPORT.md` |
| `pnpm fetch:media` | With `UNSPLASH_ACCESS_KEY` / `PEXELS_API_KEY`, suggests photos for empty media slots |

## Environment variables

All optional. See [.env.example](./.env.example).

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and OG images. Falls back to the Vercel URL |
| `NEXT_PUBLIC_DEMO_MODE` | `true` by default: sample-content badges and `noindex`. Set `false` for launch: the build then **fails** while any `demo: true` content is rendered |
| `NEXT_PUBLIC_THEME_PRESET` | `saffron` (default), `indigo` or `forest` |
| `SHEETS_WEBHOOK_URL`, `SHEETS_WEBHOOK_SECRET` | Send leads to Google Sheets ([setup](./integrations/google-apps-script/README.md)) |
| `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM` | Email each lead via Resend |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Load GA4 / Meta Pixel. Events: `planner_mode`, `planner_result`, `plan_pdf`, `plan_share`, `whatsapp_click`, `lead_submit` |
| `UNSPLASH_ACCESS_KEY`, `PEXELS_API_KEY` | Only used by `pnpm fetch:media` |

With no lead integrations set, `/api/lead` logs the lead on the server and returns success, so the demo always works.

## Deploy

Vercel: framework Next.js, build command `pnpm build`, Node 20+, no required env vars. Import the repo at vercel.com/new, or use the button above.

## Project map

```
/brand       brand.config.ts (name, contacts, HQ, nav), theme.ts (3 presets), copy.ts (site copy)
/content     channels/*.mdx (18), insights/*.mdx (3), services.ts, industries.ts, demo.ts, media.ts
/data        audiences, industries (+CPL), objectives, regions, cities, categories, market, planner-weights
/lib         planner/ (pure engine + tests), channels.ts (zod-validated loader), format-inr, demo-guard, gsap, motion, seo
/components  sections/ (home), channel/, planner/, glyphs/, three/, layout/, providers/, ui/
/app         routes, /api/lead, sitemap, robots, llms.txt, OG images
/scripts     check-media, fetch-media, check-hardcoded-brand, QA screenshot helpers
/tests       e2e (Playwright), unit (Vitest)
/qa          screenshots from the last QA pass
```

Docs: [CLONING.md](./CLONING.md) · [DECISIONS.md](./DECISIONS.md) · [MEDIA_REPORT.md](./MEDIA_REPORT.md) · [IMAGE_PROMPTS.md](./IMAGE_PROMPTS.md) · [REPORT.md](./REPORT.md) · [BRIEF.md](./BRIEF.md)

Credits: India map outlines from [@svg-maps/india](https://github.com/VictorCazanave/svg-maps) (CC BY 4.0). Photos from Unsplash, listed on `/credits`.
