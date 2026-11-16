'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { copy } from '@/brand/copy';
import { SERVICES, type Service } from '@/content/services';
import { TLink } from '@/components/providers/Transition';
import { BlobFallback } from '@/components/three/BlobFallback';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight } from '@/components/ui/Icons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useInView, useReducedMotion } from '@/lib/hooks';

const ServiceView = dynamic(() => import('@/components/three/ServiceScenes').then((m) => m.ServiceView), { ssr: false });
const ServiceCanvas = dynamic(() => import('@/components/three/ServiceScenes').then((m) => m.ServiceCanvas), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function ServiceCard({ s, hovered, onHover, webgl, reduced }: { s: Service; hovered: boolean; onHover: (v: boolean) => void; webgl: boolean; reduced: boolean }) {
  return (
    <article
      className="group relative flex w-[82vw] max-w-[380px] shrink-0 snap-center flex-col rounded-[28px] bg-cream p-3 sm:w-auto sm:max-w-none"
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      data-cursor="View"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_50%_60%,var(--paper)_0%,var(--cream)_70%)]">
        {webgl ? <ServiceView kind={s.object} hovered={hovered} reduced={reduced} /> : <BlobFallback kind={s.object} />}
        <span className="mono absolute left-4 top-4 text-ink-60">{s.index}</span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
        <p className="mono text-ink-60">{s.scope}</p>
        <h3 className="display mt-2 text-[1.6rem] font-semibold leading-[1.05]">{s.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-60">{s.short}</p>
        <ul className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] max-lg:grid-rows-[1fr]">
          <li className="overflow-hidden">
            <ul className="mt-4 space-y-2 border-t border-line pt-4">
              {s.bullets.map((b) => (
                <li key={b} className="mono flex items-center gap-2 !normal-case !tracking-normal !text-[12.5px] text-ink">
                  <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <div className="mt-auto flex items-center justify-end pt-5">
          <TLink href={`/services#${s.id}`} className="arrow-btn" aria-label={`${s.title}: learn more`}>
            <ArrowUpRight size={20} />
          </TLink>
        </div>
      </div>
    </article>
  );
}

export function Services() {
  const section = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [webgl, setWebgl] = useState(false);
  const near = useInView(section, '400px');
  const [load, setLoad] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (near && !load) {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (!conn?.saveData && hasWebGL()) {
        setLoad(true);
        setWebgl(true);
      }
    }
  }, [near, load]);

  return (
    <section ref={section} className="section relative bg-paper" aria-labelledby="services-title">
      <div className="glow left-1/2 top-[30%] h-[40%] w-[50%] -translate-x-1/2 !opacity-15" aria-hidden />
      <div className="wrap relative">
        <SectionHeading align="center" label={copy.services.label} id="services-title" title={<Emph text={copy.services.title} />} lede={copy.services.lede} />
      </div>
      <div className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:wrap sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-[clamp(16px,4vw,48px)] lg:grid-cols-3 lg:gap-5">
        {SERVICES.map((s) => (
          <ServiceCard key={s.id} s={s} hovered={hovered === s.id} webgl={webgl} reduced={reduced} onHover={(v) => setHovered(v ? s.id : null)} />
        ))}
      </div>
      {load ? <ServiceCanvas active={near} reduced={reduced} /> : null}
    </section>
  );
}
