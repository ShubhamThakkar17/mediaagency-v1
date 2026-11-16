# Rebrand this template in under an hour

Components never hard-code brand strings. Everything you change lives in `/brand`, `/content` and `/data`. `pnpm check:brand` confirms nothing slipped through.

## 1. Identity (10 minutes) · `brand/brand.config.ts`

- `name`, `logo.base` + `logo.accent` (the logo is typeset; the accent part is drawn in the brand colour and also becomes the favicon), `tagline`, `descriptor`, `description`, `legalName`.
- `hq`: `cityId` must match an id in `data/cities.ts` (the India map pulses from it), plus address lines and hours.
- `contact`: email, phone, and `whatsapp` as digits with country code (used for every wa.me link).
- `socials`, `nav`, `footerNav`, `primaryCta`.

Then run `pnpm check:brand OldName` to catch any leftover mention of the old name in code.

## 2. Colours (5 minutes) · `brand/theme.ts`

Pick a preset with `themePreset` in brand.config.ts (or `NEXT_PUBLIC_THEME_PRESET`), or edit/add a preset. Tokens: `brand`, `brand600`, `brand100`, `onBrand` (text on the brand colour: keep it AA-compliant), `cream`, `paper`, `mist`, `ink`, `ink60`, `line`. Glyphs, charts, the 3D objects, the PDF and OG images all read these. Preview any preset on any page with `?theme=<id>`.

## 3. Copy (15 minutes) · `brand/copy.ts`

Every headline and section label on the home and inner pages. `*word*` marks the bold word in a headline. Keep Indian English and avoid em dashes.

## 4. Proof (10 minutes) · `content/demo.ts`

Replace sample stats, logos, testimonials, campaigns and team roles with real ones and set `demo: false` on each. Delete what you cannot prove. When you are ready, set `NEXT_PUBLIC_DEMO_MODE=false`: the badge disappears, indexing is allowed, and the build fails while any `demo: true` item is still on a page.

Industry metrics in `content/industries.ts` follow the same rule.

## 5. Rates (with your media team) · `content/channels/*.mdx`, `data/`

- Each channel's `costs` block (CPM range, minimum monthly spend, lead time). Keep `verified: false` until a rate card backs it.
- `data/industries.ts`: cost-per-lead ranges.
- `data/planner-weights.ts`: scoring weights, intensities, frequency, overlap and population assumptions.
- `/admin/data-audit` (dev only) lists every placeholder.

Run `pnpm test`: persona snapshots will change when rates change. Review the diff and accept it with `pnpm exec vitest run -u`.

## 6. Photos (10 minutes) · `content/media.ts`

Swap any `src` for your own photography (`licence: 'Own'`) or stock. Empty slots show the branded animated fallback. `IMAGE_PROMPTS.md` has an AI-image prompt for each one. Run `pnpm check:media` afterwards.

## 7. Channels and content

Add, remove or rewrite channels in `content/channels/` (the zod schema in `lib/channel-schema.ts` validates every file at build time). Services live in `content/services.ts`, blog posts in `content/insights/`.

## 8. Ship

Set `NEXT_PUBLIC_SITE_URL`, the lead integrations you want (see README), then deploy.
