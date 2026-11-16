import type { MetadataRoute } from 'next';
import { brand } from '@/brand/brand.config';
import { getAllChannels } from '@/lib/channels';
import { getAllInsights } from '@/lib/insights';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = brand.siteUrl;
  const now = new Date();
  const pages = ['', '/channels', '/planner', '/planner-methodology', '/services', '/work', '/about', '/contact', '/insights', '/credits', '/privacy', '/terms'];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })),
    ...getAllChannels().map((c) => ({ url: `${base}/channels/${c.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...getAllInsights().map((p) => ({ url: `${base}/insights/${p.slug}`, lastModified: new Date(p.date), changeFrequency: 'yearly' as const, priority: 0.5 })),
  ];
}
