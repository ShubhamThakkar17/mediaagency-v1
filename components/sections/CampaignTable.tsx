'use client';
import { useEffect, useRef, useState } from 'react';
import { copy } from '@/brand/copy';
import { TLink } from '@/components/providers/Transition';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartMedia } from '@/components/ui/SmartMedia';
import type { GlyphId, MediaRef } from '@/lib/types';

export type CampaignRow = { id: string; year: number; title: string; channels: string; markets: string; media: MediaRef; glyph: GlyphId };

/** Year / Campaign / Channels / Markets, with a preview image that follows the cursor (BRIEF §2 row 10). */
export function CampaignTable({ rows }: { rows: CampaignRow[] }) {
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });

  useEffect(() => {
    const p = pos.current;
    const loop = () => {
      p.x += (p.tx - p.x) * 0.16;
      p.y += (p.ty - p.y) * 0.16;
      if (preview.current) preview.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${(p.tx - p.x) * 0.04}deg)`;
      p.raf = requestAnimationFrame(loop);
    };
    p.raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(p.raf);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    pos.current.tx = e.clientX;
    pos.current.ty = e.clientY;
  };

  return (
    <section className="section bg-paper" aria-labelledby="campaigns-title">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading label={copy.campaigns.label} id="campaigns-title" title={<Emph text={copy.campaigns.title} />} />
          <DemoBadge />
        </div>
        <div className="mt-14" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
          <div className="mono hidden grid-cols-[90px_1.6fr_1.2fr_1fr_48px] gap-6 border-b border-ink pb-4 text-ink-60 md:grid">
            {copy.campaigns.columns.map((c) => (
              <span key={c}>{c}</span>
            ))}
            <span />
          </div>
          <ul>
            {rows.map((r, i) => (
              <li key={r.id}>
                <TLink
                  href={`/work#${r.id}`}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setActive(i);
                  }}
                  onFocus={() => setActive(null)}
                  className="group grid grid-cols-[1fr_44px] items-center gap-x-6 gap-y-1 border-b border-line py-6 transition-colors hover:border-ink md:grid-cols-[90px_1.6fr_1.2fr_1fr_48px] md:py-7"
                  data-cursor="View"
                >
                  <span className="mono text-ink-60 md:!text-[13px]">{r.year}</span>
                  <span className="display col-start-1 text-[1.5rem] font-semibold transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 md:col-start-auto md:text-[1.9rem]">{r.title}</span>
                  <span className="col-start-1 text-[15px] text-ink-60 md:col-start-auto">{r.channels}</span>
                  <span className="col-start-1 text-[15px] text-ink-60 md:col-start-auto">{r.markets}</span>
                  <span className="col-start-2 row-span-4 row-start-1 grid size-11 place-items-center rounded-full border border-line transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand md:col-start-auto md:row-span-1 md:row-start-auto">
                    <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <TLink href="/work" className="btn btn-outline">
              {copy.campaigns.cta} <ArrowUpRight size={18} />
            </TLink>
          </div>
        </div>
      </div>
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-[240px] w-[320px] overflow-hidden rounded-[20px] shadow-2xl transition-[opacity,scale] duration-300 ease-[var(--ease-out-expo)] md:block"
        style={{ opacity: active === null ? 0 : 1, scale: active === null ? '0.8' : '1' }}
      >
        {rows.map((r, i) => (
          <div key={r.id} className="absolute inset-0 transition-opacity duration-300" style={{ opacity: active === i ? 1 : 0 }}>
            <SmartMedia media={r.media} glyph={r.glyph} className="size-full" sizes="320px" maxWidth={800} />
          </div>
        ))}
      </div>
    </section>
  );
}
