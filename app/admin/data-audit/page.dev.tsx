import type { Metadata } from 'next';
import { CPL_BY_INDUSTRY, INDUSTRIES } from '@/data/industries';
import { MARKET_FIGURES } from '@/data/market';
import { MEDIA } from '@/content/media';
import { getAllChannels } from '@/lib/channels';
import { formatINR } from '@/lib/format-inr';

// Dev-only (the .dev.tsx extension keeps it out of production builds).
export const metadata: Metadata = { title: 'Data audit', robots: { index: false } };

const td = 'border-b border-line px-3 py-2 align-top';

export default function DataAudit() {
  const channels = getAllChannels();
  return (
    <div className="wrap pb-24 pt-32">
      <h1 className="display t-2">Data audit</h1>
      <p className="lede mt-3">Every value marked verified: false. Replace with real rate cards, then set verified: true.</p>

      <h2 className="display t-3 mt-14">Channel costs ({channels.length} unverified)</h2>
      <p className="mt-1 text-sm text-ink-60">Source: content/channels/*.mdx, frontmatter `costs`.</p>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="mono text-left text-ink-60">
            <th className={td}>File</th>
            <th className={td}>Unit</th>
            <th className={td}>CPM low</th>
            <th className={td}>CPM high</th>
            <th className={td}>Min monthly</th>
            <th className={td}>Lead time</th>
            <th className={td}>Note</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((c) => (
            <tr key={c.slug}>
              <td className={td}>content/channels/{c.slug}.mdx</td>
              <td className={td}>{c.costs.unitLabel}</td>
              <td className={td}>₹{c.costs.cpm.low}</td>
              <td className={td}>₹{c.costs.cpm.high}</td>
              <td className={td}>{formatINR(c.costs.minMonthlyINR)}</td>
              <td className={td}>{c.costs.leadTimeDays} d</td>
              <td className={td}>{c.costs.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="display t-3 mt-14">Cost per lead by industry</h2>
      <p className="mt-1 text-sm text-ink-60">Source: data/industries.ts `CPL_BY_INDUSTRY`.</p>
      <table className="mt-4 w-full text-sm">
        <tbody>
          {INDUSTRIES.filter((i) => !CPL_BY_INDUSTRY[i.id].verified).map((i) => (
            <tr key={i.id}>
              <td className={td}>{i.label}</td>
              <td className={td}>
                {formatINR(CPL_BY_INDUSTRY[i.id].low)} to {formatINR(CPL_BY_INDUSTRY[i.id].high)} {CPL_BY_INDUSTRY[i.id].unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="display t-3 mt-14">Unverified market figures</h2>
      <ul className="mt-4 space-y-1 text-sm">
        {MARKET_FIGURES.filter((f) => !f.verified).map((f) => (
          <li key={f.id}>
            {f.id}: {f.label} {f.value} ({f.source.report})
          </li>
        ))}
        {MARKET_FIGURES.every((f) => f.verified) ? <li>None. All market figures were verified against their sources.</li> : null}
      </ul>

      <h2 className="display t-3 mt-14">Planning assumptions (always placeholders)</h2>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
        <li>Affinity, funnel, zone, tier, industry and objective scores in every channel file.</li>
        <li>Weights, intensities, frequency, overlap and population figures in data/planner-weights.ts.</li>
        <li>Tier CPM multipliers in data/regions.ts.</li>
      </ul>

      <h2 className="display t-3 mt-14">Media slots without an asset ({MEDIA.filter((m) => !m.src).length})</h2>
      <ul className="mt-4 space-y-1 text-sm">
        {MEDIA.filter((m) => !m.src).map((m) => (
          <li key={m.id}>
            {m.id}: {m.brief}
          </li>
        ))}
      </ul>
    </div>
  );
}
