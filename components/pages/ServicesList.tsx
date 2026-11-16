'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { Service } from '@/content/services';
import { TLink } from '@/components/providers/Transition';
import { BlobFallback } from '@/components/three/BlobFallback';
import { cn } from '@/lib/cn';
import { useInView, useReducedMotion } from '@/lib/hooks';

const ServiceView = dynamic(() => import('@/components/three/ServiceScenes').then((m) => m.ServiceView), { ssr: false });
const ServiceCanvas = dynamic(() => import('@/components/three/ServiceScenes').then((m) => m.ServiceCanvas), { ssr: false });

/** Agenciex-style hover list: hovering a service dims the rest and swaps the sticky 3D object on the right. */
export function ServicesList({ services, channelNames }: { services: Service[]; channelNames: Record<string, string> }) {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const near = useInView(root, '300px');
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      setWebgl(!!(c.getContext('webgl2') || c.getContext('webgl')));
    } catch {}
  }, []);
  const s = services[active];

  return (
    <div ref={root} className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <ul onPointerLeave={() => setHovering(false)}>
        {services.map((svc, i) => (
          <li
            key={svc.id}
            id={svc.id}
            className={cn('scroll-mt-28 border-b border-line py-8 transition-opacity duration-500 first:border-t', hovering && active !== i ? 'lg:opacity-35' : 'opacity-100')}
            onPointerEnter={() => {
              setActive(i);
              setHovering(true);
            }}
            onFocusCapture={() => setActive(i)}
          >
            <div className="flex items-baseline gap-5">
              <span className="mono text-ink-60">{svc.index}</span>
              <div className="flex-1">
                <h2 className="display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1]">{svc.title}</h2>
                <p className="mono mt-3 text-ink-60">{svc.scope}</p>
                <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-ink-60">{svc.description}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mono mb-3 text-ink-60">What you get</p>
                    <ul className="space-y-1.5 text-[15px]">
                      {svc.deliverables.map((d) => (
                        <li key={d} className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mono mb-3 text-ink-60">Channels it touches</p>
                    <ul className="flex flex-wrap gap-2">
                      {svc.channels.map((c) => (
                        <li key={c}>
                          <TLink href={`/channels/${c}`} className="chip">
                            {channelNames[c] ?? c}
                          </TLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="hidden lg:block">
        <div className="sticky top-[110px] overflow-hidden rounded-[32px] bg-cream">
          <div className="relative aspect-square">
            {webgl && near ? <ServiceView kind={s.object} hovered={false} reduced={reduced} /> : <BlobFallback kind={s.object} />}
            <span className="mono absolute left-6 top-6 text-ink-60">{s.index} / 06</span>
          </div>
          <div className="p-8 pt-0">
            <p className="display text-[1.8rem] font-semibold">{s.title}</p>
            <p className="mt-2 text-ink-60">{s.short}</p>
          </div>
        </div>
      </div>
      {webgl && near ? <ServiceCanvas active={near} reduced={reduced} /> : null}
    </div>
  );
}
