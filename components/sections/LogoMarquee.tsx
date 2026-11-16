import { copy } from '@/brand/copy';
import { demoLogos, type DemoLogo } from '@/content/demo';
import { Marquee } from '@/components/ui/Marquee';
import { renderable } from '@/lib/demo-guard';

function Mark({ kind }: { kind: DemoLogo['mark'] }) {
  const p = { fill: 'currentColor' };
  const shapes: Record<DemoLogo['mark'], React.ReactNode> = {
    circle: <circle cx="12" cy="12" r="9" {...p} />,
    square: <rect x="3" y="3" width="18" height="18" rx="5" {...p} />,
    triangle: <path d="M12 3 21 20H3Z" {...p} />,
    wave: <path d="M2 14c3-6 6-6 10 0s7 6 10 0v7H2Z" {...p} />,
    bars: (
      <>
        <rect x="3" y="10" width="4" height="11" rx="1" {...p} />
        <rect x="10" y="6" width="4" height="15" rx="1" {...p} />
        <rect x="17" y="2" width="4" height="19" rx="1" {...p} />
      </>
    ),
    ring: <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="3.5" />,
    diamond: <path d="m12 2 10 10-10 10L2 12Z" {...p} />,
    leaf: <path d="M4 20C4 9 11 4 21 3c0 10-6 17-17 17Z" {...p} />,
  };
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      {shapes[kind]}
    </svg>
  );
}

/** Fictional placeholder wordmarks. No real brands (BRIEF §2 row 8). */
export function LogoMarquee() {
  const logos = renderable(demoLogos, 'Logo marquee');
  return (
    <section className="border-y border-line bg-paper py-12" aria-label={copy.logos.title}>
      <p className="mono mb-8 text-center text-ink-60">{copy.logos.title}</p>
      <Marquee duration={44} gap={64}>
        {logos.map((l) => (
          <span key={l.name} className="flex shrink-0 items-center gap-2.5 text-ink/70 transition-colors hover:text-ink">
            <Mark kind={l.mark} />
            <span className="font-display text-[1.6rem] tracking-[-0.03em]" style={{ fontWeight: l.weight, fontStyle: l.italic ? 'italic' : undefined }}>
              {l.name}
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
