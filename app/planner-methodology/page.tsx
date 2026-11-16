import type { Metadata } from 'next';
import { copy } from '@/brand/copy';
import { TLink } from '@/components/providers/Transition';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight } from '@/components/ui/Icons';
import { PageHero } from '@/components/ui/PageHero';
import { CPL_BY_INDUSTRY, INDUSTRIES } from '@/data/industries';
import {
  ALLOCATION_EXPONENT,
  ASSUMED_FREQUENCY,
  CHANNEL_COUNT_BY_BUDGET,
  CITY_COUNT_FACTOR,
  GEO_SCALING_EXPONENT,
  INTENSITY,
  INTENSITY_META,
  MAX_SHARE_PCT,
  MIN_TRACKABLE_DIGITAL_PCT,
  OVERLAP_DISCOUNT,
  SCORE_WEIGHTS,
  STAGE_RULES,
} from '@/data/planner-weights';
import { STAGES } from '@/data/objectives';
import { TIERS } from '@/data/regions';
import { getAllChannels } from '@/lib/channels';
import { formatINR, formatINRCompact } from '@/lib/format-inr';

export const metadata: Metadata = {
  title: 'How the planner works',
  description: 'The scoring, allocation and estimate logic behind the media planner, with every assumption and placeholder rate listed.',
  alternates: { canonical: '/planner-methodology' },
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="display t-3 mb-6 mt-20 first:mt-0">{children}</h2>;
}

const th = 'mono border-b border-ink py-3 pr-4 text-left font-normal text-ink-60';
const td = 'border-b border-line py-3 pr-4 align-top';

export default function MethodologyPage() {
  const channels = getAllChannels();
  const pct = (n: number) => `${Math.round(n * 100)}%`;
  return (
    <>
      <PageHero label="Methodology" title={<Emph text="How the planner *does the maths.*" />} lede="The planner is a first cut, not a quote. Here is exactly how it scores channels, splits a budget and estimates reach, with every assumption on the table." />
      <article className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap max-w-[980px] text-[16px] leading-relaxed text-ink-60">
          <div className="rounded-[24px] bg-brand-100 p-6 text-ink">
            <p className="font-semibold">Every rate below is a planning placeholder (verified: false).</p>
            <p className="mt-1 text-[15px]">{copy.costDisclaimer} Our team replaces these with live rate cards when we build your real plan.</p>
          </div>

          <H2>1. Scoring every channel</H2>
          <p>Each of the 18 channels gets a score from 1 to 5 for your brief. It is a weighted blend of five fits:</p>
          <table className="mt-6 w-full text-[15px]">
            <thead>
              <tr>
                <th className={th}>Fit</th>
                <th className={th}>Weight</th>
                <th className={th}>What it measures</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              <tr><td className={td}>Industry</td><td className={td}>{pct(SCORE_WEIGHTS.industry)}</td><td className={td}>How well the channel works for your category.</td></tr>
              <tr><td className={td}>Objective</td><td className={td}>{pct(SCORE_WEIGHTS.objective)}</td><td className={td}>Awareness, consideration, leads, sales or launch buzz.</td></tr>
              <tr><td className={td}>Brand stage</td><td className={td}>{pct(SCORE_WEIGHTS.stage)}</td><td className={td}>Launching, growing, established or relaunching.</td></tr>
              <tr><td className={td}>Region</td><td className={td}>{pct(SCORE_WEIGHTS.region)}</td><td className={td}>Strength in the zones and market tiers you chose.</td></tr>
              <tr><td className={td}>Audience</td><td className={td}>{pct(SCORE_WEIGHTS.audience)}</td><td className={td}>Average affinity with the audiences you picked (neutral if none).</td></tr>
            </tbody>
          </table>
          <ul className="mt-6 space-y-2">
            {STAGES.map((s) => (
              <li key={s.id}>
                <span className="font-semibold text-ink">{s.label}:</span> {STAGE_RULES[s.id].summary}
              </li>
            ))}
          </ul>

          <H2>2. I have a budget: splitting it</H2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              The number of channels depends on the budget:{' '}
              {CHANNEL_COUNT_BY_BUDGET.map((b) => `${b.label}: ${b.min} to ${b.max}`).join('; ')}.
            </li>
            <li>Budget is shared in proportion to score^{ALLOCATION_EXPONENT}, so stronger fits get a clearly larger slice.</li>
            <li>Any channel that cannot reach its minimum effective spend (monthly minimum × months) is dropped and its share redistributed.</li>
            <li>For leads or sales, at least {MIN_TRACKABLE_DIGITAL_PCT}% stays in a trackable digital channel (social or search).</li>
            <li>No channel takes more than {MAX_SHARE_PCT}% of a plan with two or more channels. Spends are rounded to ₹1,000.</li>
            <li>Must-include and exclude choices are honoured when the budget allows. If not, the planner says why.</li>
          </ul>

          <H2>3. I know my channels: three scenarios</H2>
          <p>Each channel starts from its minimum effective monthly spend, multiplied by the months and by the intensity:</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {(Object.keys(INTENSITY) as (keyof typeof INTENSITY)[]).map((k) => (
              <div key={k} className="rounded-[20px] bg-cream p-5">
                <p className="display text-xl font-semibold text-ink">
                  {INTENSITY_META[k].label} · {INTENSITY[k]}×
                </p>
                <p className="mt-2 text-[14px]">{INTENSITY_META[k].blurb}</p>
              </div>
            ))}
          </div>
          <p className="mt-6">
            Geography then scales the cost. One city is 1×, a state about {CITY_COUNT_FACTOR.state}×, each zone {CITY_COUNT_FACTOR.perZone}× and pan-India {CITY_COUNT_FACTOR.panIndia}×. Physical media scales fully. Digital and talent-led channels are bought by audience, so their factor is softened to the power of {GEO_SCALING_EXPONENT.digital}. Market tier multipliers adjust the rate:{' '}
            {TIERS.map((t) => `${t.label} ${t.cpmMultiplier}`).join(', ')}.
          </p>

          <H2>4. Estimating impressions, reach and leads</H2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Impressions = spend ÷ (CPM × tier multiplier) × 1,000. The high CPM gives the low end of the range and the low CPM the high end.</li>
            <li>Reach = impressions ÷ how often one person sees the channel. Frequency grows with duration (months^0.7).</li>
            <li>Total reach is de-duplicated: {pct(OVERLAP_DISCOUNT.perExtraChannel)} is removed for each channel after the first, up to {pct(OVERLAP_DISCOUNT.max)}, and capped at a plausible share of the population in play.</li>
            <li>Leads = social and search spend ÷ the cost-per-lead range for your industry.</li>
          </ul>

          <H2>Placeholder rates by channel</H2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-[14.5px]">
              <thead>
                <tr>
                  <th className={th}>Channel</th>
                  <th className={th}>CPM range (₹)</th>
                  <th className={th}>Min. monthly</th>
                  <th className={th}>Lead time</th>
                  <th className={th}>Monthly frequency</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                {channels.map((c) => (
                  <tr key={c.slug}>
                    <td className={td}>
                      <TLink href={`/channels/${c.slug}`} className="underline decoration-line underline-offset-4 hover:decoration-brand">
                        {c.name}
                      </TLink>
                    </td>
                    <td className={td}>
                      {c.costs.cpm.low} to {c.costs.cpm.high}
                      {c.costs.note ? <span className="block text-[12.5px] text-ink-60">{c.costs.note}</span> : null}
                    </td>
                    <td className={td}>{formatINRCompact(c.costs.minMonthlyINR)}</td>
                    <td className={td}>{c.costs.leadTimeDays} days</td>
                    <td className={td}>{ASSUMED_FREQUENCY[c.slug] ?? '4'}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2>Placeholder cost per lead by industry</H2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[14.5px]">
              <thead>
                <tr>
                  <th className={th}>Industry</th>
                  <th className={th}>Range</th>
                  <th className={th}>Unit</th>
                </tr>
              </thead>
              <tbody className="text-ink">
                {INDUSTRIES.map((i) => (
                  <tr key={i.id}>
                    <td className={td}>{i.label}</td>
                    <td className={td}>
                      {formatINR(CPL_BY_INDUSTRY[i.id].low)} to {formatINR(CPL_BY_INDUSTRY[i.id].high)}
                    </td>
                    <td className={td}>{CPL_BY_INDUSTRY[i.id].unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2>Sources</H2>
          <p>Market-size figures on this site come from the Pitch Madison Advertising Report, WPP Media’s Sporting Nation report and Kofluence’s influencer marketing report, each linked where it appears. Channel rates and affinities are planning assumptions, not published data.</p>

          <TLink href="/planner" className="btn btn-brand mt-12">
            Try the planner <ArrowUpRight size={18} />
          </TLink>
        </div>
      </article>
    </>
  );
}
