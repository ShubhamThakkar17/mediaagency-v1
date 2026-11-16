import type { MetadataRoute } from 'next';
import { brand } from '@/brand/brand.config';
import { DEMO_MODE } from '@/lib/demo-guard';

/** Demo mode blocks all crawlers (BRIEF §9). */
export default function robots(): MetadataRoute.Robots {
  if (DEMO_MODE) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] }], sitemap: `${brand.siteUrl}/sitemap.xml` };
}
