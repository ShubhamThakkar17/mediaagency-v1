'use client';
import { Document, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import { brand } from '@/brand/brand.config';
import { copy } from '@/brand/copy';
import { formatCountRange, formatINR, formatINRCompact, formatINRRange } from '@/lib/format-inr';
import { describeInput, type PlanResult } from '@/lib/planner';
import type { ChannelLite } from '@/lib/types';

// React-PDF's built-in Helvetica has no ₹ glyph, so amounts use "Rs".
const rs = (s: string) => s.replace(/₹/g, 'Rs ');

function colors() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
  return { brand: v('--brand', '#FF6036'), ink: v('--ink', '#151515'), cream: v('--cream', '#FFF6F3'), line: v('--line', '#E4E4E4'), muted: v('--ink-60', '#626262') };
}

function PlanDoc({ result, channels, url }: { result: PlanResult; channels: ChannelLite[]; url: string }) {
  const c = colors();
  const s = StyleSheet.create({
    page: { padding: 40, fontSize: 10, color: c.ink, fontFamily: 'Helvetica', lineHeight: 1.45 },
    cover: { padding: 48, backgroundColor: c.cream, color: c.ink, fontFamily: 'Helvetica' },
    pill: { alignSelf: 'flex-start', backgroundColor: c.brand, color: c.ink, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, fontSize: 8, letterSpacing: 1 },
    h1: { fontSize: 34, fontFamily: 'Helvetica-Bold', marginTop: 24, lineHeight: 1.1 },
    h2: { fontSize: 15, fontFamily: 'Helvetica-Bold', marginTop: 18, marginBottom: 8 },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 6 },
    muted: { color: c.muted },
    kpi: { backgroundColor: c.ink, color: '#FFFFFF', padding: 12, borderRadius: 8, marginTop: 12 },
    card: { flex: 1, borderWidth: 1, borderColor: c.line, borderRadius: 8, padding: 10 },
    foot: { position: 'absolute', bottom: 24, left: 40, right: 40, fontSize: 8, color: c.muted, flexDirection: 'row', justifyContent: 'space-between' },
  });
  const inputs = describeInput(result.input, channels);
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const Foot = () => (
    <View style={s.foot} fixed>
      <Text>
        {brand.name} · {copy.plannerBadge}
      </Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
  return (
    <Document title={`${brand.name} media plan`} author={brand.name}>
      <Page size="A4" style={s.cover}>
        <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold' }}>
          {brand.logo.base}
          <Text style={{ color: c.brand }}>{brand.logo.accent}</Text>
        </Text>
        <View style={{ marginTop: 160 }}>
          <Text style={s.pill}>MEDIA PLAN · {result.mode === 'budget' ? 'BUDGET TO CHANNELS' : 'CHANNELS TO BUDGET'}</Text>
          <Text style={s.h1}>{result.mode === 'budget' ? `A ${rs(formatINRCompact(result.totalINR))} plan, channel by channel.` : 'Three ways to run your chosen channels.'}</Text>
          <Text style={{ marginTop: 14, fontSize: 12, color: c.muted }}>{rs(result.kpiLine)}</Text>
        </View>
        <View style={{ position: 'absolute', bottom: 48, left: 48, right: 48 }}>
          <Text style={{ fontSize: 10 }}>Prepared {date}</Text>
          <Text style={{ fontSize: 9, color: c.muted, marginTop: 4 }}>{url}</Text>
        </View>
      </Page>
      <Page size="A4" style={s.page}>
        <Text style={s.h2}>Your inputs</Text>
        {inputs.map((r) => (
          <View key={r.label} style={s.row}>
            <Text style={{ width: 130, color: c.muted }}>{r.label}</Text>
            <Text style={{ flex: 1 }}>{rs(r.value)}</Text>
          </View>
        ))}
        {result.mode === 'budget' ? (
          <>
            <Text style={s.h2}>Recommended mix</Text>
            <View style={[s.row, { borderBottomColor: c.ink }]}>
              <Text style={{ flex: 2, color: c.muted }}>Channel</Text>
              <Text style={{ width: 50, textAlign: 'right', color: c.muted }}>Share</Text>
              <Text style={{ width: 90, textAlign: 'right', color: c.muted }}>Spend</Text>
              <Text style={{ width: 120, textAlign: 'right', color: c.muted }}>Impressions</Text>
            </View>
            {result.lines.map((l) => (
              <View key={l.slug} style={s.row} wrap={false}>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{l.name}</Text>
                  <Text style={[s.muted, { fontSize: 8.5 }]}>
                    {l.role}. {l.why}
                  </Text>
                </View>
                <Text style={{ width: 50, textAlign: 'right' }}>{l.sharePct.toFixed(1)}%</Text>
                <Text style={{ width: 90, textAlign: 'right' }}>{rs(formatINR(l.spendINR))}</Text>
                <Text style={{ width: 120, textAlign: 'right' }}>{formatCountRange(l.impressions.low, l.impressions.high)}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <View style={s.card}>
                <Text style={s.muted}>Impressions</Text>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12 }}>{formatCountRange(result.totals.impressions.low, result.totals.impressions.high)}</Text>
              </View>
              <View style={s.card}>
                <Text style={s.muted}>Reach</Text>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12 }}>{formatCountRange(result.totals.reach.low, result.totals.reach.high)}</Text>
              </View>
              {result.totals.leads ? (
                <View style={s.card}>
                  <Text style={s.muted}>Leads</Text>
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12 }}>{formatCountRange(result.totals.leads.low, result.totals.leads.high)}</Text>
                </View>
              ) : null}
            </View>
          </>
        ) : (
          <>
            <Text style={s.h2}>Scenarios</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {result.scenarios.map((sc) => (
                <View key={sc.id} style={s.card}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12 }}>{sc.label}</Text>
                  <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', marginTop: 4, color: c.brand }}>{rs(formatINRCompact(sc.totalINR))}</Text>
                  <Text style={[s.muted, { fontSize: 8.5 }]}>{rs(formatINRRange(sc.totalRange.low, sc.totalRange.high))}</Text>
                  {sc.lines.map((l) => (
                    <Text key={l.slug} style={{ fontSize: 8.5, marginTop: 3 }}>
                      {l.shortName}: {rs(formatINRCompact(l.spendINR))}
                    </Text>
                  ))}
                  <Text style={[s.muted, { fontSize: 8.5, marginTop: 6 }]}>Reach {formatCountRange(sc.totals.reach.low, sc.totals.reach.high)}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        <Text style={s.kpi}>{rs(result.kpiLine)}</Text>
        {result.warnings.length ? (
          <>
            <Text style={s.h2}>Notes</Text>
            {result.warnings.map((w) => (
              <Text key={w} style={s.muted}>
                · {rs(w)}
              </Text>
            ))}
          </>
        ) : null}
        <Foot />
      </Page>
      <Page size="A4" style={s.page}>
        <Text style={s.h2}>Assumptions</Text>
        {result.assumptions.map((a) => (
          <Text key={a} style={{ marginBottom: 5 }}>
            · {rs(a)}
          </Text>
        ))}
        <Text style={[s.muted, { marginTop: 10 }]}>{copy.costDisclaimer}</Text>
        <Text style={s.h2}>Talk to us</Text>
        <Text>{brand.name}</Text>
        {brand.hq.addressLines.map((l) => (
          <Text key={l} style={s.muted}>
            {l}
          </Text>
        ))}
        <Text style={{ marginTop: 6 }}>
          {brand.contact.email} · {brand.contact.phoneDisplay}
        </Text>
        <Text style={[s.muted, { marginTop: 6 }]}>{url}</Text>
        <Foot />
      </Page>
    </Document>
  );
}

export async function downloadPlanPdf(result: PlanResult, channels: ChannelLite[], url: string) {
  const blob = await pdf(<PlanDoc result={result} channels={channels} url={url} />).toBlob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-media-plan.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
