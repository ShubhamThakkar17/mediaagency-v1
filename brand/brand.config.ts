/**
 * Single source of truth for brand identity.
 * Rename the agency, swap contacts and pick a theme preset here.
 * See CLONING.md for the full rebrand checklist.
 */
import type { ThemePresetId } from './theme';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000';

export const brand = {
  /** Full name, shown in metadata and the footer. */
  name: 'Media360',
  /** The logo is typeset: `base` in ink, `accent` in the brand colour. */
  logo: { base: 'Media', accent: '360' },
  tagline: 'Every screen. Every street. Every state.',
  descriptor: '360° media agency · pan-India',
  description:
    'A 360° media agency planning, buying and running campaigns across India, from print and prime time to metros, airports and Instagram.',
  legalName: 'Media360 Advertising (placeholder entity)',
  /** One of the presets in brand/theme.ts: saffron | indigo | forest. */
  themePreset: (process.env.NEXT_PUBLIC_THEME_PRESET as ThemePresetId | undefined) ?? ('saffron' as ThemePresetId),
  siteUrl: siteUrl.replace(/\/$/, ''),
  /** The India map pulses outward from this city. Must match an id in data/cities.ts. */
  hq: {
    cityId: 'ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    addressLines: ['Placeholder Tower, S.G. Highway', 'Ahmedabad, Gujarat 380054'],
    hours: 'Mon to Sat, 10:00 to 19:00 IST',
  },
  contact: {
    email: 'hello@example.com',
    phoneDisplay: '+91 00000 00000',
    phoneHref: 'tel:+910000000000',
    /** Digits only, country code first. Used for wa.me links. */
    whatsapp: '910000000000',
  },
  socials: [
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
    { id: 'x', label: 'X', href: 'https://x.com/' },
  ],
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Channels', href: '/channels' },
    { label: 'Planner', href: '/planner' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'CatchUp', href: '/catchup' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  footerNav: [
    { label: 'Media CatchUp', href: '/catchup' },
    { label: 'How the planner works', href: '/planner-methodology' },
    { label: 'Credits', href: '/credits' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
  primaryCta: { label: 'Plan my media', href: '/planner' },
} as const;

export type Brand = typeof brand;
