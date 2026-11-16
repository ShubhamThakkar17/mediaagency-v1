import { brand } from '@/brand/brand.config';
import { getAllChannels } from '@/lib/channels';
import { getAllInsights } from '@/lib/insights';
import { SERVICES } from '@/content/services';

export const dynamic = 'force-static';

/** llms.txt: a plain-text map of the site for AI assistants. */
export function GET() {
  const u = (p: string) => `${brand.siteUrl}${p}`;
  const lines = [
    `# ${brand.name}`,
    '',
    `> ${brand.description}`,
    '',
    'Planner estimates on this site are indicative and based on placeholder rates. They are not quotes.',
    '',
    '## Key pages',
    `- [Channels](${u('/channels')}): 18 media channels in India with formats, audiences and indicative costs`,
    `- [Media planner](${u('/planner')}): budget to channels, or channels to budget`,
    `- [How the planner works](${u('/planner-methodology')}): scoring, allocation and every assumption`,
    `- [Services](${u('/services')})`,
    `- [About](${u('/about')})`,
    `- [Contact](${u('/contact')})`,
    '',
    '## Channels',
    ...getAllChannels().map((c) => `- [${c.name}](${u(`/channels/${c.slug}`)}): ${c.tagline}`),
    '',
    '## Services',
    ...SERVICES.map((s) => `- [${s.title}](${u(`/services#${s.id}`)}): ${s.short}`),
    '',
    '## Insights',
    ...getAllInsights().map((p) => `- [${p.title}](${u(`/insights/${p.slug}`)}): ${p.excerpt}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
