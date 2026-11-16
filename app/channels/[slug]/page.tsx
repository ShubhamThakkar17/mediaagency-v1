import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { copy } from '@/brand/copy';
import { AudienceChartLazy } from '@/components/channel/AudienceChartLazy';
import { Bars } from '@/components/channel/Bars';
import { ChannelHero } from '@/components/channel/ChannelHero';
import { ZoneMap } from '@/components/channel/ZoneMap';
import { TLink } from '@/components/providers/Transition';
import { Faq } from '@/components/ui/Faq';
import { FormatIcon } from '@/components/ui/FormatIcon';
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@/components/ui/Icons';
import { JsonLd } from '@/components/ui/JsonLd';
import { Mdx } from '@/components/ui/Mdx';
import { PosterCard } from '@/components/ui/PosterCard';
import { ProcessLine } from '@/components/ui/ProcessLine';
import { AUDIENCES } from '@/data/audiences';
import { INDUSTRIES } from '@/data/industries';
import { stageLabel } from '@/data/objectives';
import { marketFiguresFor } from '@/data/market';
import { bestStagesFor } from '@/data/planner-weights';
import { TIERS, ZONES } from '@/data/regions';
import { getAllChannels, getChannel, toLite } from '@/lib/channels';
import { visibleFigures } from '@/lib/demo-guard';
import { formatINR, formatINRCompact } from '@/lib/format-inr';
import { getIndiaStates } from '@/lib/india-map';
import { breadcrumbLd, channelServiceLd, faqLd } from '@/lib/seo';

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllChannels().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getChannel(slug);
  if (!c) return {};
  return {
    title: `${c.name} advertising in India`,
    description: c.summary,
    alternates: { canonical: `/channels/${c.slug}` },
    openGraph: { title: `${c.name} advertising in India`, description: c.tagline },
  };
}

const FUNNEL_LABELS = { awareness: 'Awareness', consideration: 'Consideration', conversion: 'Conversion', loyalty: 'Loyalty' } as const;

function Block({ index, label, title, children, className }: { index: string; label: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={className ?? 'section border-t border-line bg-paper'} aria-label={label}>
      <div className="wrap grid gap-10 lg:grid-cols-[0.75fr_2fr] lg:gap-16">
        <div>
          <p className="mono text-ink-60">
            ({index}) {label}
          </p>
          <h2 className="display t-3 mt-4 max-w-[14ch]">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export default async function ChannelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = getAllChannels();
  const i = all.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const c = all[i];
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const bestIndustries = INDUSTRIES.filter((ind) => c.industryFit[ind.id] >= 4).sort((a, b) => c.industryFit[b.id] - c.industryFit[a.id]);
  const stages = bestStagesFor(c);
  const figures = visibleFigures(marketFiguresFor(c.slug)).slice(0, 2);
  const related = c.related.map((s) => all.find((x) => x.slug === s)!).filter(Boolean);
  const states = getIndiaStates();

  return (
    <>
      <ChannelHero channel={c} />

      <section className="border-b border-line bg-paper py-10">
        <div className="wrap grid gap-4 sm:grid-cols-3">
          {[
            { k: 'Formats', v: String(c.formats.length) },
            { k: 'Typical lead time', v: `${c.costs.leadTimeDays} days` },
            { k: 'Minimum effective monthly budget', v: formatINRCompact(c.costs.minMonthlyINR) },
          ].map((s) => (
            <div key={s.k} className="rounded-[22px] bg-cream p-6">
              <p className="mono text-ink-60">{s.k}</p>
              <p className="display mt-2 text-[2.4rem] font-semibold leading-none">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <Block index="01" label="Formats" title={`What you can buy in ${c.shortName.toLowerCase()}.`}>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {c.formats.map((f, k) => (
            <li key={f.name} data-reveal="fade" style={{ ['--reveal-delay' as string]: `${k * 0.06}s` }} className="group flex flex-col gap-6 rounded-[22px] border border-line bg-paper p-5 transition-colors hover:border-brand hover:bg-cream">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-100 text-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:scale-110">
                <FormatIcon name={f.icon} size={24} />
              </span>
              <span className="font-semibold leading-snug">{f.name}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block index="02" label="Funnel" title="Where it sits in the funnel.">
        <Bars rows={(Object.keys(FUNNEL_LABELS) as (keyof typeof FUNNEL_LABELS)[]).map((k) => ({ label: FUNNEL_LABELS[k], value: c.funnel[k] }))} />
        <p className="mt-6 text-[15px] text-ink-60">
          Role in a plan: <span className="font-semibold text-ink">{c.roleKpi}</span>.
        </p>
      </Block>

      <Block index="03" label="Audiences" title="Who it reaches.">
        <div className="grid gap-10 xl:grid-cols-[1.3fr_1fr]">
          <AudienceChartLazy data={AUDIENCES.map((a) => ({ name: a.short, value: c.audienceAffinity[a.id] }))} />
          <div className="grid grid-cols-[1fr_1fr] gap-6 xl:grid-cols-1">
            <div className="mx-auto w-full max-w-[260px]">
              <ZoneMap states={states} strength={c.zoneStrength} label={`${c.name} strength by zone: ${ZONES.map((z) => `${z.label} ${c.zoneStrength[z.id]} of 5`).join(', ')}`} />
            </div>
            <div className="space-y-3">
              <p className="mono text-ink-60">By market tier</p>
              <Bars tone="ink" rows={TIERS.map((t) => ({ label: t.label, value: c.tierStrength[t.id] }))} />
            </div>
          </div>
        </div>
      </Block>

      <Block index="04" label="Best for" title="Where it earns its keep.">
        <div className="space-y-8">
          <ul className="flex flex-wrap gap-2">
            {c.bestFor.map((b) => (
              <li key={b} className="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-paper">
                {b}
              </li>
            ))}
          </ul>
          <div>
            <p className="mono mb-3 text-ink-60">Industries</p>
            <ul className="flex flex-wrap gap-2">
              {bestIndustries.map((ind) => (
                <li key={ind.id} className="chip !h-auto !py-2">
                  {ind.label}
                  <span className="mono !text-[10px] text-ink-60">{c.industryFit[ind.id]}/5</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono mb-3 text-ink-60">Brand stages</p>
            <ul className="flex flex-wrap gap-2">
              {stages.map((s) => (
                <li key={s} className="chip !border-brand !bg-brand-100">
                  {stageLabel(s)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Block>

      <Block index="05" label="Indicative costs" title="What it costs to do properly.">
        <div className="rounded-[26px] bg-cream p-6 sm:p-8">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="mono text-ink-60">Buying unit</dt>
              <dd className="mt-1 text-lg font-semibold">{c.costs.unitLabel}</dd>
            </div>
            <div>
              <dt className="mono text-ink-60">CPM-equivalent range</dt>
              <dd className="mt-1 text-lg font-semibold">
                ₹{c.costs.cpm.low} to ₹{c.costs.cpm.high} per 1,000 impressions{c.costs.note ? <span className="block text-[14px] font-normal text-ink-60">{c.costs.note}</span> : null}
              </dd>
            </div>
            <div>
              <dt className="mono text-ink-60">Minimum effective budget</dt>
              <dd className="mt-1 text-lg font-semibold">{formatINR(c.costs.minMonthlyINR)} a month</dd>
            </div>
            <div>
              <dt className="mono text-ink-60">Lead time</dt>
              <dd className="mt-1 text-lg font-semibold">{c.costs.leadTimeDays} days from sign-off</dd>
            </div>
          </dl>
          <p className="mt-8 border-t border-line pt-5 text-[14px] italic text-ink-60">
            {copy.costDisclaimer}{' '}
            <TLink href="/planner-methodology" className="font-medium not-italic text-ink underline decoration-brand underline-offset-4">
              How we estimate
            </TLink>
          </p>
        </div>
      </Block>

      <section className="section on-dark bg-ink text-paper" aria-label="How we run it">
        <div className="wrap">
          <p className="mono text-white/60">(06) How we run it, pan-India</p>
          <h2 className="display t-2 mt-4 mb-14 max-w-[18ch]">From plan to proof, in five steps.</h2>
          <ProcessLine steps={copy.process} tone="dark" />
        </div>
      </section>

      {figures.length ? (
        <Block index="07" label="Market context" title="The size of the stage.">
          <div className="grid gap-4 sm:grid-cols-2">
            {figures.map((f) => (
              <figure key={f.id} className="rounded-[24px] border border-line p-6">
                <p className="display text-[2.4rem] font-semibold leading-none">{f.value}</p>
                <figcaption className="mt-3 text-[15px]">
                  {f.label}
                  {f.note ? `, ${f.note}` : ''}
                  <a href={f.source.url} target="_blank" rel="noopener noreferrer" className="mono mt-3 block !normal-case !tracking-normal text-ink-60 underline decoration-brand underline-offset-4">
                    Source: {f.source.publisher}, {f.source.report}
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </Block>
      ) : null}

      <Block index={figures.length ? '08' : '07'} label="In depth" title={`${c.shortName}, in practice.`}>
        <Mdx source={c.body} />
      </Block>

      <Block index={figures.length ? '09' : '08'} label="FAQs" title="Questions we hear.">
        <Faq items={c.faqs} />
      </Block>

      <section className="section bg-paper">
        <div className="wrap">
          <div className="relative overflow-hidden rounded-[32px] bg-brand p-8 text-on-brand sm:p-14">
            <div className="bg-dots-light absolute inset-0" aria-hidden />
            <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="display t-2 max-w-[16ch]">Plan a campaign with {c.shortName.toLowerCase()}.</h2>
              <TLink href={`/planner?mode=budget&include=${c.slug}`} className="btn btn-ink" data-testid="channel-cta">
                Open the planner <ArrowUpRight size={18} />
              </TLink>
            </div>
          </div>

          {related.length ? (
            <div className="mt-20">
              <p className="mono mb-6 text-ink-60">Pairs well with</p>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <TLink href={`/channels/${r.slug}`} expand className="block transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5" data-cursor="View">
                      <PosterCard channel={toLite(r)} sizes="(min-width:768px) 30vw, 45vw" />
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <nav aria-label="Channel navigation" className="mt-20 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
            <TLink href={`/channels/${prev.slug}`} expand className="group flex items-center gap-4 rounded-[22px] bg-cream p-5">
              <span className="grid size-12 place-items-center rounded-full bg-paper transition-transform group-hover:-translate-x-1">
                <ArrowLeft />
              </span>
              <span>
                <span className="mono block text-ink-60">Previous</span>
                <span className="display text-xl font-semibold">{prev.name}</span>
              </span>
            </TLink>
            <TLink href={`/channels/${next.slug}`} expand className="group flex items-center justify-end gap-4 rounded-[22px] bg-cream p-5 text-right">
              <span>
                <span className="mono block text-ink-60">Next</span>
                <span className="display text-xl font-semibold">{next.name}</span>
              </span>
              <span className="grid size-12 place-items-center rounded-full bg-brand text-on-brand transition-transform group-hover:translate-x-1">
                <ArrowRight />
              </span>
            </TLink>
          </nav>
        </div>
      </section>

      <JsonLd
        data={[
          channelServiceLd(c),
          faqLd(c.faqs),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Channels', path: '/channels' },
            { name: c.name, path: `/channels/${c.slug}` },
          ]),
        ]}
      />
    </>
  );
}
