import type { Metadata } from 'next';
import { TLink } from '@/components/providers/Transition';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight } from '@/components/ui/Icons';
import { PageHero } from '@/components/ui/PageHero';
import { SmartMedia } from '@/components/ui/SmartMedia';
import { getMedia } from '@/content/media';
import { getAllInsights } from '@/lib/insights';

export const metadata: Metadata = { title: 'Insights', description: 'Practical notes on planning media across India.', alternates: { canonical: '/insights' } };

const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function InsightsPage() {
  const posts = getAllInsights();
  return (
    <>
      <PageHero label="Insights" title={<Emph text="Notes from *the planning desk.*" />} lede="Short, practical pieces on budgets, channels and markets. No jargon, no fluff." />
      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <ul className="wrap grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug} data-reveal="fade">
              <TLink href={`/insights/${p.slug}`} className="group block" data-cursor="View">
                <div className="overflow-hidden rounded-[24px]">
                  <SmartMedia media={getMedia(p.cover)} glyph="digital-pr" className="aspect-[4/3] transition-transform duration-700 group-hover:scale-[1.04]" sizes="(min-width:768px) 30vw, 90vw" />
                </div>
                <p className="mono mt-5 text-ink-60">
                  {fmt(p.date)} · {p.readMinutes} min read
                </p>
                <h2 className="display mt-2 text-[1.6rem] font-semibold leading-tight">{p.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-60">{p.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-medium">
                  Read <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
                </span>
              </TLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
