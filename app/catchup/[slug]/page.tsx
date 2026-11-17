import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brand } from '@/brand/brand.config';
import { copy } from '@/brand/copy';
import { PostCard } from '@/components/catchup/PostCard';
import { TLink } from '@/components/providers/Transition';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { ArrowLeft, ArrowUpRight } from '@/components/ui/Icons';
import { JsonLd } from '@/components/ui/JsonLd';
import { Mdx } from '@/components/ui/Mdx';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { SplitHeading } from '@/components/ui/SplitHeading';
import { getMedia } from '@/content/media';
import { catchupTypeLabel, getAllPosts, getPost } from '@/lib/catchup';
import { toCards } from '@/lib/catchup-cards';
import { getAllChannels } from '@/lib/channels';
import { renderableOne } from '@/lib/demo-guard';
import { absoluteUrl, breadcrumbLd } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt, alternates: { canonical: `/catchup/${p.slug}` }, openGraph: { type: 'article', title: p.title, description: p.excerpt } } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const found = getPost((await params).slug);
  if (!found) notFound();
  const p = renderableOne(found, `${copy.catchup.name}: ${found.slug}`);
  const all = getAllChannels();
  const byslug = new Map(all.map((c) => [c.slug, c]));
  const channelSlugs = [...new Set([...(p.caseStudy?.channels ?? []), ...p.channels])];
  const channels = channelSlugs.map((s) => byslug.get(s)).filter((c): c is NonNullable<typeof c> => !!c);
  const more = toCards(getAllPosts().filter((x) => x.slug !== p.slug && !(x.demo && process.env.NEXT_PUBLIC_DEMO_MODE === 'false')))
    .sort((a, b) => Number(b.type === p.type) - Number(a.type === p.type))
    .slice(0, 3);
  const cs = p.caseStudy;
  const date = new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <article className="bg-paper pt-[calc(var(--nav-h)+clamp(40px,6vw,90px))]">
      <div className="wrap max-w-[900px]">
        <TLink href="/catchup" className="mono inline-flex items-center gap-2 text-ink-60 hover:text-ink">
          <ArrowLeft size={14} /> {copy.catchup.name}
        </TLink>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="pill-label">{catchupTypeLabel(p.type)}</span>
          {p.demo ? <DemoBadge /> : null}
        </div>
        <SplitHeading as="h1" immediate className="t-1 mt-6">
          {p.title}
        </SplitHeading>
        <p className="lede mt-6">{p.excerpt}</p>
        <p className="mono mt-6 text-ink-60">
          {date} · {p.readMinutes} min read · {p.tags.join(', ')}
        </p>
      </div>

      <div className="wrap mt-12 max-w-[1160px]">
        <SmartMedia media={getMedia(p.cover, p.title)} glyph={channels[0]?.glyph ?? 'digital-pr'} priority className="aspect-[16/8] rounded-[28px]" sizes="(min-width:1160px) 1160px, 100vw" />
      </div>

      {cs ? (
        <section aria-label="Campaign facts" className="wrap mt-10 max-w-[1160px]">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-[26px] bg-cream p-6 sm:grid-cols-3 sm:p-8">
              {[
                ['Client', cs.client],
                ['Industry', cs.industry],
                ['Markets', cs.markets],
                ['Duration', cs.duration],
                ['Budget band', cs.budgetBand],
                ['Channels', cs.channels.map((s) => byslug.get(s)?.shortName ?? s).join(', ')],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="mono text-ink-60">{k}</dt>
                  <dd className="mt-1 font-medium leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="on-brand rounded-[26px] bg-brand p-6 text-on-brand sm:p-8">
              <p className="mono opacity-80">Results (illustrative)</p>
              <ul className="mt-4 grid grid-cols-2 gap-5">
                {cs.results.map((r) => (
                  <li key={r.label}>
                    <span className="display block text-[2.4rem] font-semibold leading-none">{r.value}</span>
                    <span className="mt-1.5 block text-[13.5px] leading-snug opacity-85">{r.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <div className="wrap mt-14 max-w-[760px]">
        <Mdx source={p.body} />
        {channels.length ? (
          <div className="mt-14 border-t border-line pt-8">
            <p className="mono mb-4 text-ink-60">Channels in this story</p>
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
        <div className="mt-12 flex flex-wrap gap-3">
          <TLink href="/planner" className="btn btn-brand">
            Plan a campaign like this <ArrowUpRight size={18} />
          </TLink>
          <TLink href="/contact" className="btn btn-outline">
            Talk to our team
          </TLink>
        </div>
      </div>

      {more.length ? (
        <section className="section mt-10 bg-cream" aria-labelledby="more-title">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <h2 id="more-title" className="display t-3">
                More from {copy.catchup.name}
              </h2>
              <TLink href="/catchup" className="btn btn-sm btn-outline hidden sm:inline-flex">
                View all
              </TLink>
            </div>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {more.map((m) => (
                <li key={m.slug}>
                  <PostCard post={m} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <div className="pb-[clamp(72px,9vw,140px)]" />
      )}

      <JsonLd
        data={[
          { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.excerpt, datePublished: p.date, articleSection: catchupTypeLabel(p.type), author: { '@type': 'Organization', name: brand.name }, publisher: { '@type': 'Organization', name: brand.name }, mainEntityOfPage: absoluteUrl(`/catchup/${p.slug}`) },
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: copy.catchup.name, path: '/catchup' },
            { name: p.title, path: `/catchup/${p.slug}` },
          ]),
        ]}
      />
    </article>
  );
}
