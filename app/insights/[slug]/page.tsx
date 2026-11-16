import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brand } from '@/brand/brand.config';
import { TLink } from '@/components/providers/Transition';
import { ArrowLeft, ArrowUpRight } from '@/components/ui/Icons';
import { JsonLd } from '@/components/ui/JsonLd';
import { Mdx } from '@/components/ui/Mdx';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { getMedia } from '@/content/media';
import { getAllChannels } from '@/lib/channels';
import { getAllInsights, getInsight } from '@/lib/insights';
import { absoluteUrl, breadcrumbLd } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllInsights().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getInsight((await params).slug);
  return p ? { title: p.title, description: p.excerpt, alternates: { canonical: `/insights/${p.slug}` }, openGraph: { type: 'article', title: p.title, description: p.excerpt } } : {};
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getInsight((await params).slug);
  if (!p) notFound();
  const channels = getAllChannels().filter((c) => p.channels.includes(c.slug));
  return (
    <article className="bg-paper pb-[clamp(72px,9vw,140px)] pt-[calc(var(--nav-h)+clamp(40px,6vw,90px))]">
      <div className="wrap max-w-[860px]">
        <TLink href="/insights" className="mono inline-flex items-center gap-2 text-ink-60 hover:text-ink">
          <ArrowLeft size={14} /> Insights
        </TLink>
        <p className="mono mt-8 text-ink-60">
          {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {p.readMinutes} min read · {p.tags.join(', ')}
        </p>
        <SplitHeading as="h1" immediate className="t-1 mt-4">
          {p.title}
        </SplitHeading>
        <p className="lede mt-6">{p.excerpt}</p>
      </div>
      <div className="wrap mt-12 max-w-[1100px]">
        <SmartMedia media={getMedia(p.cover)} glyph="digital-pr" priority className="aspect-[16/8] rounded-[28px]" sizes="(min-width:1100px) 1100px, 100vw" />
      </div>
      <div className="wrap mt-14 max-w-[760px]">
        <Mdx source={p.body} />
        {channels.length ? (
          <div className="mt-14 border-t border-line pt-8">
            <p className="mono mb-4 text-ink-60">Channels in this piece</p>
            <ul className="flex flex-wrap gap-2">
              {channels.map((c) => (
                <li key={c.slug}>
                  <TLink href={`/channels/${c.slug}`} className="chip">
                    {c.name}
                  </TLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <TLink href="/planner" className="btn btn-brand mt-12">
          Try the planner <ArrowUpRight size={18} />
        </TLink>
      </div>
      <JsonLd
        data={[
          { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.excerpt, datePublished: p.date, author: { '@type': 'Organization', name: brand.name }, publisher: { '@type': 'Organization', name: brand.name }, mainEntityOfPage: absoluteUrl(`/insights/${p.slug}`) },
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: p.title, path: `/insights/${p.slug}` },
          ]),
        ]}
      />
    </article>
  );
}
