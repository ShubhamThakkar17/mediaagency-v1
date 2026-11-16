import type { Metadata } from 'next';
import { brand } from '@/brand/brand.config';
import { LeadForm } from '@/components/planner/LeadModal';
import { Emph } from '@/components/ui/Emph';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { PageHero } from '@/components/ui/PageHero';
import { cityById } from '@/data/cities';
import { projectIndia } from '@/lib/geo';
import { getIndiaStates } from '@/lib/india-map';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Talk to ${brand.name} about a campaign in one city or across India.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const hq = cityById(brand.hq.cityId);
  const pt = hq ? projectIndia(hq.lat, hq.lng) : { x: 300, y: 300 };
  const wa = `https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent(`Hi ${brand.name}, I would like to discuss a campaign.`)}`;
  return (
    <>
      <PageHero label="Contact" title={<Emph text="Tell us *where you want to be seen.*" />} lede="Share a few details and a planner will call you within one working day. Or message us on WhatsApp now." />
      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-[30px] bg-cream p-6 sm:p-10">
            <h2 className="display mb-8 text-[1.9rem] font-semibold">Start a brief</h2>
            <LeadForm extraFields submitLabel="Send brief" />
          </div>
          <div className="flex flex-col gap-5">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-[30px] bg-brand p-7 text-on-brand" data-whatsapp>
              <span>
                <span className="mono block opacity-80">Fastest reply</span>
                <span className="display mt-2 block text-[1.9rem] font-semibold">WhatsApp us</span>
              </span>
              <span className="grid size-14 place-items-center rounded-full bg-ink text-paper transition-transform group-hover:rotate-12">
                <WhatsAppIcon size={26} />
              </span>
            </a>
            <div className="overflow-hidden rounded-[30px] bg-ink text-paper">
              <div className="relative bg-[#1f1f1f] p-6">
                <svg viewBox={`${pt.x - 150} ${pt.y - 110} 300 220`} className="h-[220px] w-full" role="img" aria-label={`Map showing ${brand.hq.city}`}>
                  {getIndiaStates().map((s) => (
                    <path key={s.id} d={s.d} fill={s.id === 'gj' ? '#3a3a3a' : '#2a2a2a'} stroke="#151515" strokeWidth={1.4} />
                  ))}
                  <circle cx={pt.x} cy={pt.y} r={16} fill="var(--brand)" opacity={0.25} />
                  <circle cx={pt.x} cy={pt.y} r={6} fill="var(--brand)" stroke="#fff" strokeWidth={2} />
                </svg>
                <span className="mono absolute left-6 top-6 text-white/60">HQ · {brand.hq.city}</span>
              </div>
              <address className="p-7 not-italic">
                {brand.hq.addressLines.map((l) => (
                  <span key={l} className="block text-[16px]">
                    {l}
                  </span>
                ))}
                <a href={`mailto:${brand.contact.email}`} className="mt-4 block underline decoration-brand underline-offset-4">
                  {brand.contact.email}
                </a>
                <a href={brand.contact.phoneHref} className="block">
                  {brand.contact.phoneDisplay}
                </a>
                <span className="mt-3 block text-sm text-white/60">{brand.hq.hours}</span>
              </address>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
