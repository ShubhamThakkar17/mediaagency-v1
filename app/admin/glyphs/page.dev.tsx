import type { Metadata } from 'next';
import { ALL_GLYPH_IDS, Glyph, type GlyphTone } from '@/components/glyphs/Glyph';

export const metadata: Metadata = { title: 'Glyph library', robots: { index: false, follow: false } };

const TONES: { tone: GlyphTone; label: string; bg: string; text: string }[] = [
  { tone: 'light', label: 'light', bg: 'bg-paper', text: 'text-ink' },
  { tone: 'light', label: 'light / cream', bg: 'bg-cream', text: 'text-ink' },
  { tone: 'ink', label: 'ink', bg: 'bg-ink', text: 'text-cream' },
  { tone: 'brand', label: 'brand', bg: 'bg-brand', text: 'text-ink' },
];

/** Dev-only preview of every glyph at chip (48px) and poster (480px) size on each tone. */
export default function GlyphLibraryPage() {
  return (
    <main className="bg-paper text-ink mx-auto max-w-[1600px] px-4 py-16 md:px-8">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest opacity-60">/admin/glyphs · dev only</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Glyph library</h1>
        <p className="mt-3 max-w-2xl opacity-70">
          {ALL_GLYPH_IDS.length} looping SVG glyphs. Each row shows the 48px chip on every tone, then the 480px poster.
          Reduced motion shows the static frame; off-screen glyphs pause.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">All chips · 48px</h2>
        {TONES.map((t) => (
          <div key={t.label} className={`${t.bg} ${t.text} mb-2 flex flex-wrap gap-3 rounded-xl p-3`}>
            {ALL_GLYPH_IDS.map((id) => (
              <Glyph key={id} id={id} size={48} tone={t.tone} title={id} />
            ))}
          </div>
        ))}
      </section>

      <div className="space-y-16">
        {ALL_GLYPH_IDS.map((id, i) => (
          <section key={id} id={id} className="border-t border-line pt-8">
            <div className="mb-4 flex items-baseline gap-4">
              <span className="font-mono text-xs opacity-50">({String(i + 1).padStart(2, '0')})</span>
              <h2 className="font-mono text-lg">{id}</h2>
            </div>
            <div className="mb-6 flex flex-wrap gap-3">
              {TONES.map((t) => (
                <div key={t.label} className={`${t.bg} ${t.text} flex items-center gap-3 rounded-xl px-3 py-2`}>
                  <Glyph id={id} size={48} tone={t.tone} />
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">{t.label}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {TONES.filter((t) => t.label !== 'light / cream').map((t) => (
                <figure key={t.label} className={`${t.bg} ${t.text} shrink-0 rounded-2xl p-4`}>
                  <Glyph id={id} size={480} tone={t.tone} title={`${id} (${t.label})`} />
                  <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-widest opacity-70">
                    {t.label} · 480px
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
