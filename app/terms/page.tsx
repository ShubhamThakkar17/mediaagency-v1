import type { Metadata } from 'next';
import { brand } from '@/brand/brand.config';
import { PageHero } from '@/components/ui/PageHero';

export const metadata: Metadata = { title: 'Terms', description: 'Terms of use for this website and the media planner.', alternates: { canonical: '/terms' } };

export default function TermsPage() {
  return (
    <>
      <PageHero label="Terms" title="Terms of use" lede="Template text. Have your legal team review and replace it before launch." />
      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap prose-brand max-w-[760px]">
          <h2>Planner estimates</h2>
          <p>The media planner gives indicative estimates for planning only. Rates, reach and lead numbers are based on placeholder assumptions and are not a quote, an offer or a guarantee of results. Final costs depend on city, inventory, season and negotiation.</p>
          <h2>Sample content</h2>
          <p>While this site is in template preview, client names, campaigns, testimonials and statistics marked as sample content are illustrative and fictional.</p>
          <h2>Third-party content</h2>
          <p>Photos are used under their respective licences, listed on the credits page. Market figures are attributed to their publishers.</p>
          <h2>Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
