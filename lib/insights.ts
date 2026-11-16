import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

const DIR = path.join(process.cwd(), 'content', 'insights');

export const insightSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(8),
  excerpt: z.string().min(30).max(240),
  /** ISO date, e.g. 2026-10-06 */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  readMinutes: z.number().int().positive(),
  tags: z.array(z.string()).min(1).max(4),
  /** Media registry id (content/media.ts). */
  cover: z.string(),
  /** Channel slugs mentioned, for cross-links. */
  channels: z.array(z.string()).default([]),
});
export type InsightMeta = z.infer<typeof insightSchema>;
export type Insight = InsightMeta & { body: string };

export function getAllInsights(): Insight[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'));
      const parsed = insightSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Invalid insight frontmatter in content/insights/${file}: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
      }
      return { ...parsed.data, body: content.trim() };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const getInsight = (slug: string) => getAllInsights().find((i) => i.slug === slug);
