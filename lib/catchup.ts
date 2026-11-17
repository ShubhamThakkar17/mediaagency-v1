import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * Media CatchUp: the agency's publishing hub (articles, case studies, guides,
 * market updates). Posts live in content/catchup/*.mdx.
 */
const DIR = path.join(process.cwd(), 'content', 'catchup');

export const CATCHUP_TYPES = [
  { id: 'article', label: 'Articles', singular: 'Article' },
  { id: 'case-study', label: 'Case studies', singular: 'Case study' },
  { id: 'guide', label: 'Guides', singular: 'Guide' },
  { id: 'market-update', label: 'Market updates', singular: 'Market update' },
] as const;
export type CatchupType = (typeof CATCHUP_TYPES)[number]['id'];
export const catchupTypeLabel = (t: CatchupType) => CATCHUP_TYPES.find((x) => x.id === t)?.singular ?? t;

const caseStudySchema = z
  .object({
    /** Fictional client (case studies here are concept work). */
    client: z.string().min(2),
    industry: z.string().min(2),
    markets: z.string().min(2),
    duration: z.string().min(2),
    budgetBand: z.string().min(2),
    /** Channel slugs used. */
    channels: z.array(z.string()).min(2).max(6),
    /** Illustrative outcomes. */
    results: z.array(z.object({ value: z.string().min(1).max(12), label: z.string().min(3).max(60) })).min(2).max(4),
  })
  .strict();

export const catchupSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    type: z.enum(CATCHUP_TYPES.map((t) => t.id) as [CatchupType, ...CatchupType[]]),
    title: z.string().min(8).max(110),
    excerpt: z.string().min(30).max(240),
    /** ISO date, e.g. 2026-10-06 */
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    readMinutes: z.number().int().positive(),
    tags: z.array(z.string()).min(1).max(4),
    /** Media registry id (content/media.ts). */
    cover: z.string(),
    /** Channel slugs mentioned, for cross-links. */
    channels: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    /** Sample content (BRIEF §9). Required true for concept case studies. */
    demo: z.boolean().default(false),
    caseStudy: caseStudySchema.optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (v.type === 'case-study' && !v.caseStudy) ctx.addIssue({ code: 'custom', message: 'case studies need a caseStudy block', path: ['caseStudy'] });
    if (v.type === 'case-study' && !v.demo) ctx.addIssue({ code: 'custom', message: 'concept case studies must set demo: true', path: ['demo'] });
  });

export type CatchupMeta = z.infer<typeof catchupSchema>;
export type CatchupPost = CatchupMeta & { body: string };

export function getAllPosts(): CatchupPost[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'));
      const parsed = catchupSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Invalid frontmatter in content/catchup/${file}: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
      }
      if (`${parsed.data.slug}.mdx` !== file) throw new Error(`content/catchup/${file}: slug must match the file name`);
      return { ...parsed.data, body: content.trim() };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const getPost = (slug: string) => getAllPosts().find((p) => p.slug === slug);
