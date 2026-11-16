import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { getMedia } from '@/content/media';
import { channelFrontmatterSchema } from './channel-schema';
import type { ChannelData, ChannelLite } from './types';

const DIR = path.join(process.cwd(), 'content', 'channels');

let cache: ChannelData[] | null = null;

/**
 * Reads and validates every channel MDX file. Runs at build time (and in
 * Vitest). A schema error fails the build with the file name in the message.
 */
export function getAllChannels(): ChannelData[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx'));
  const channels = files.map((file) => {
    const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const parsed = channelFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
      throw new Error(`Invalid channel frontmatter in content/channels/${file}\n${issues}`);
    }
    const fm = parsed.data;
    if (`${fm.slug}.mdx` !== file) throw new Error(`content/channels/${file}: slug "${fm.slug}" must match the file name`);
    const hero = getMedia(fm.media.hero, fm.name);
    const card = fm.media.card ? getMedia(fm.media.card, fm.name) : hero;
    const video = fm.media.video ? getMedia(fm.media.video, fm.name) : undefined;
    const channel: ChannelData = {
      ...fm,
      media: { hero, card, video: video && video.src ? video : undefined },
      body: content.trim(),
    };
    return channel;
  });
  channels.sort((a, b) => a.order - b.order);
  const slugs = new Set(channels.map((c) => c.slug));
  for (const c of channels) {
    for (const r of c.related) {
      if (!slugs.has(r)) throw new Error(`content/channels/${c.slug}.mdx: related channel "${r}" does not exist`);
    }
  }
  cache = channels;
  return channels;
}

export function getChannel(slug: string): ChannelData | undefined {
  return getAllChannels().find((c) => c.slug === slug);
}

export function toLite(c: ChannelData): ChannelLite {
  return {
    slug: c.slug,
    order: c.order,
    name: c.name,
    shortName: c.shortName,
    category: c.category,
    tagline: c.tagline,
    glyph: c.glyph,
    posterStyle: c.posterStyle,
    funnel: c.funnel,
    audienceAffinity: c.audienceAffinity,
    zoneStrength: c.zoneStrength,
    tierStrength: c.tierStrength,
    industryFit: c.industryFit,
    objectiveFit: c.objectiveFit,
    costs: c.costs,
    roleKpi: c.roleKpi,
    card: c.media.card,
  };
}

export function getChannelsLite(): ChannelLite[] {
  return getAllChannels().map(toLite);
}
