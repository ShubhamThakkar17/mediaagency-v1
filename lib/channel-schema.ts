import { z } from 'zod';
import { AUDIENCE_IDS } from '@/data/audiences';
import { CATEGORY_IDS } from '@/data/categories';
import { INDUSTRY_IDS } from '@/data/industries';
import { OBJECTIVE_IDS } from '@/data/objectives';
import { ZONE_IDS } from '@/data/regions';
import { GLYPH_IDS, POSTER_STYLES } from './types';

const level = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);

function levelRecord<T extends string>(keys: readonly [T, ...T[]]) {
  const shape = Object.fromEntries(keys.map((k) => [k, level])) as Record<T, typeof level>;
  return z.object(shape).strict();
}

const sourceRef = z.object({
  publisher: z.string().min(1),
  report: z.string().min(1),
  year: z.number().int(),
  url: z.string().url(),
});

/** Frontmatter of content/channels/*.mdx. Media is referenced by registry id. */
export const channelFrontmatterSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    order: z.number().int().min(1).max(18),
    name: z.string().min(2),
    shortName: z.string().min(2).max(22),
    category: z.enum(CATEGORY_IDS),
    tagline: z.string().min(8).max(120),
    summary: z.string().min(40).max(420),
    glyph: z.enum(GLYPH_IDS),
    posterStyle: z.enum(POSTER_STYLES),
    media: z.object({ hero: z.string(), card: z.string().optional(), video: z.string().optional() }),
    formats: z.array(z.object({ name: z.string().min(2), icon: z.string().min(2) })).min(4).max(9),
    funnel: z.object({ awareness: level, consideration: level, conversion: level, loyalty: level }),
    audienceAffinity: levelRecord(AUDIENCE_IDS),
    zoneStrength: levelRecord(ZONE_IDS),
    tierStrength: z.object({
      metro: z.number().min(1).max(5),
      tier1: z.number().min(1).max(5),
      tier2: z.number().min(1).max(5),
      tier3Rural: z.number().min(1).max(5),
    }),
    industryFit: levelRecord(INDUSTRY_IDS),
    objectiveFit: levelRecord(OBJECTIVE_IDS),
    costs: z.object({
      unitLabel: z.string().min(3),
      cpm: z.object({ low: z.number().positive(), high: z.number().positive() }),
      minMonthlyINR: z.number().positive(),
      leadTimeDays: z.number().int().positive(),
      note: z.string().optional(),
      verified: z.literal(false),
    }),
    roleKpi: z.string().min(3),
    bestFor: z.array(z.string().min(3)).min(2).max(5),
    market: z.object({ label: z.string(), value: z.string(), source: sourceRef }).optional(),
    faqs: z.array(z.object({ q: z.string().min(8), a: z.string().min(20) })).min(3).max(8),
    related: z.array(z.string()).min(2).max(4),
  })
  .strict();

export type ChannelFrontmatter = z.infer<typeof channelFrontmatterSchema>;
