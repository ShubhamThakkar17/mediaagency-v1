import { brand } from '@/brand/brand.config';
import { copy } from '@/brand/copy';
import { TLink } from '@/components/providers/Transition';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Emph } from '@/components/ui/Emph';
import { ArrowUpRight, WhatsAppIcon } from '@/components/ui/Icons';
import { Logo } from '@/components/ui/Logo';
import { getAllChannels } from '@/lib/channels';
import { FooterWave } from './FooterWave';
import { Newsletter } from './Newsletter';

export function Footer() {
  const channels = getAllChannels();
  const waveCards = channels.filter((_, i) => i % 2 === 0).map((c) => ({ slug: c.slug, shortName: c.shortName, glyph: c.glyph }));
  const year = new Date().getFullYear();
  const wa = `https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent(`Hi ${brand.name}, I would like to plan a campaign.`)}`;

  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-white">
      <div className="bg-dots-light absolute inset-0 opacity-60" aria-hidden />
      <div className="wrap relative pt-[clamp(72px,9vw,128px)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="pill-label">{copy.footer.kicker}</span>
            <h2 className="display t-2 mt-6 max-w-[14ch] text-white">
              <Emph text={copy.footer.headline} />
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <TLink href={brand.primaryCta.href} className="btn btn-brand">
              {brand.primaryCta.label} <ArrowUpRight size={18} />
            </TLink>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn border border-white/25 text-white hover:bg-white hover:text-ink" data-whatsapp>
              <WhatsAppIcon size={18} /> WhatsApp us
            </a>
          </div>
        </div>
      </div>

      <div className="relative mt-10">
        <FooterWave cards={waveCards} />
      </div>

      <div className="wrap relative">
        <p className="display select-none whitespace-nowrap text-[clamp(2.6rem,11.5vw,11rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-white">
          <span className="text-brand">©</span> {year} {brand.name}
        </p>

        <div className="mt-14 grid gap-10 border-t border-white/15 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo className="text-white" />
            <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-white/75">{brand.descriptor}</p>
            <div className="mt-6">
              <p className="mono mb-3 text-white/70">{copy.footer.newsletterLabel}</p>
              <Newsletter />
            </div>
          </div>
          <nav aria-label="Footer">
            <p className="mono mb-4 text-white/70">Explore</p>
            <ul className="space-y-2.5 text-[15px]">
              {brand.nav.map((n) => (
                <li key={n.href}>
                  <TLink href={n.href} className="text-white/85 transition-colors hover:text-white">
                    {n.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Resources">
            <p className="mono mb-4 text-white/70">Resources</p>
            <ul className="space-y-2.5 text-[15px]">
              {brand.footerNav.map((n) => (
                <li key={n.href}>
                  <TLink href={n.href} className="text-white/85 transition-colors hover:text-white">
                    {n.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
          <address className="not-italic">
            <p className="mono mb-4 text-white/70">Contact</p>
            <div className="rounded-[20px] bg-white/[0.06] p-5 text-[15px] leading-relaxed text-white/85">
              {brand.hq.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <a href={`mailto:${brand.contact.email}`} className="mt-3 block text-white underline decoration-brand underline-offset-4">
                {brand.contact.email}
              </a>
              <a href={brand.contact.phoneHref} className="block text-white">
                {brand.contact.phoneDisplay}
              </a>
              <span className="mt-2 block text-sm text-white/70">{brand.hq.hours}</span>
            </div>
          </address>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 py-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.legalName}. {copy.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <DemoBadge tone="dark" />
            <TLink href="/credits" className="underline underline-offset-4 hover:text-white">
              Photo and map credits
            </TLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
