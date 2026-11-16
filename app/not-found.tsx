import { Glyph } from '@/components/glyphs/Glyph';
import { TLink } from '@/components/providers/Transition';
import { ArrowUpRight } from '@/components/ui/Icons';

export default function NotFound() {
  return (
    <section className="bg-dots relative grid min-h-[92vh] place-items-center overflow-hidden bg-paper px-4 pt-[var(--nav-h)] text-center">
      <div className="glow bottom-[-30%] left-1/2 h-[60%] w-[60%] -translate-x-1/2 !opacity-25" aria-hidden />
      <div className="relative flex flex-col items-center">
        <div className="size-[clamp(180px,30vw,300px)]">
          <Glyph id="lost-signal" title="A television showing no signal" />
        </div>
        <span className="pill-label mt-6">Error 404</span>
        <h1 className="display t-1 mt-6 max-w-[14ch]">
          We lost the <b>signal.</b>
        </h1>
        <p className="lede mt-5 max-w-[44ch]">This page is off air. Try one of our eighteen channels instead.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <TLink href="/" className="btn btn-brand">
            Back to home <ArrowUpRight size={18} />
          </TLink>
          <TLink href="/channels" className="btn btn-outline">
            Browse channels
          </TLink>
        </div>
      </div>
    </section>
  );
}
