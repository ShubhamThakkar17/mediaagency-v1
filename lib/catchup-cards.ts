import 'server-only';
import { getMedia } from '@/content/media';
import { getAllChannels } from './channels';
import { catchupTypeLabel, type CatchupPost } from './catchup';
import type { PostCardData } from '@/components/catchup/PostCard';

/** Card data for client components (no MDX body). */
export function toCards(posts: CatchupPost[]): PostCardData[] {
  const glyphOf = new Map(getAllChannels().map((c) => [c.slug, c.glyph]));
  return posts.map((p) => {
    const firstChannel = p.caseStudy?.channels[0] ?? p.channels[0];
    return {
      slug: p.slug,
      type: p.type,
      typeLabel: catchupTypeLabel(p.type),
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      readMinutes: p.readMinutes,
      cover: getMedia(p.cover, p.title),
      glyph: (firstChannel && glyphOf.get(firstChannel)) || 'digital-pr',
      demo: p.demo,
      result: p.caseStudy?.results[0],
    };
  });
}
