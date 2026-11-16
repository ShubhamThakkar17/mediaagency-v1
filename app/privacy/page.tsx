import type { Metadata } from 'next';
import { brand } from '@/brand/brand.config';
import { PageHero } from '@/components/ui/PageHero';

export const metadata: Metadata = { title: 'Privacy', description: 'How we handle the information you share with us.', alternates: { canonical: '/privacy' } };

export default function PrivacyPage() {
  return (
    <>
      <PageHero label="Privacy" title="Privacy policy" lede="Template text. Have your legal team review and replace it before launch." />
      <section className="bg-paper pb-[clamp(72px,9vw,140px)]">
        <div className="wrap prose-brand max-w-[760px]">
          <h2>What we collect</h2>
          <p>When you use the planner or a form, we collect what you type in: your name, company, phone, email, city and message, plus the planner inputs if you choose to send them.</p>
          <p>We also store a first-party cookie with the campaign source that brought you here (UTM parameters, referrer and landing page) so we know which channels work for us.</p>
          <h2>How we use it</h2>
          <ul>
            <li>To reply to your enquiry and prepare a media plan.</li>
            <li>To understand which of our own campaigns bring enquiries.</li>
          </ul>
          <p>We do not sell your data. Analytics tools load only if they are configured, and only for aggregate measurement.</p>
          <h2>Your rights</h2>
          <p>
            You can ask us to see, correct or delete your data at any time by writing to <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>. We handle requests in line with the Digital Personal Data Protection Act, 2023.
          </p>
          <h2>Contact</h2>
          <p>
            {brand.legalName}, {brand.hq.addressLines.join(', ')}.
          </p>
        </div>
      </section>
    </>
  );
}
