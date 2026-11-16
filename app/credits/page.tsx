import type { Metadata } from 'next';
import { Emph } from '@/components/ui/Emph';
import { PageHero } from '@/components/ui/PageHero';
import { MEDIA } from '@/content/media';

export const metadata: Metadata = { title: 'Credits', description: 'Photo, video and map credits and licences.', alternates: { canonical: '/credits' } };

export default function CreditsPage() {
  const used = MEDIA.filter((m) => m.src);
  const empty = MEDIA.filter((m) => !m.src).length;
  return (
    <>
      <PageHero label="Credits" title={<Emph text="Thanks to *the photographers.*" />} lede={`Every photo on this site is listed below with its source and licence. ${empty} slots currently show our own animated artwork instead of a photo.`} />
      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-[14.5px]">
              <thead>
                <tr className="mono border-b border-ink text-left text-ink-60">
                  <th className="py-3 pr-4 font-normal">Slot</th>
                  <th className="py-3 pr-4 font-normal">What it shows</th>
                  <th className="py-3 pr-4 font-normal">Photographer</th>
                  <th className="py-3 font-normal">Licence</th>
                </tr>
              </thead>
              <tbody>
                {used.map((m) => (
                  <tr key={m.id} className="border-b border-line align-top">
                    <td className="mono py-3 pr-4 !normal-case text-ink-60">{m.id}</td>
                    <td className="py-3 pr-4">{m.alt}</td>
                    <td className="py-3 pr-4">
                      {m.creditUrl ? (
                        <a href={m.creditUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-brand underline-offset-4">
                          {m.credit}
                        </a>
                      ) : (
                        m.credit
                      )}
                    </td>
                    <td className="py-3">
                      {m.sourcePage ? (
                        <a href={m.sourcePage} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4">
                          {m.licence}
                        </a>
                      ) : (
                        m.licence
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="prose-brand mt-14 max-w-[70ch]">
            <h2>Map and type</h2>
            <p>
              India map outlines: <a href="https://github.com/VictorCazanave/svg-maps/tree/master/packages/india">@svg-maps/india</a> by Victor Cazanave, licensed{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. City positions are approximate. Map boundaries are illustrative and not an authoritative depiction of borders.
            </p>
            <p>Typefaces: Inter Tight, Inter and Geist Mono, under the SIL Open Font License, served by Google Fonts.</p>
            <p>Photos are hot-linked from Unsplash under the <a href="https://unsplash.com/license">Unsplash License</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
