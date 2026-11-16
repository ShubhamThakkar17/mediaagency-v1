import { brand } from '@/brand/brand.config';
import type { ChannelData } from './types';

const abs = (p: string) => `${brand.siteUrl}${p}`;

export function organizationLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': abs('/#organization'),
      name: brand.name,
      url: brand.siteUrl,
      description: brand.description,
      slogan: brand.tagline,
      email: brand.contact.email,
      sameAs: brand.socials.map((s) => s.href),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': abs('/#service'),
      name: brand.name,
      url: brand.siteUrl,
      description: brand.description,
      areaServed: { '@type': 'Country', name: 'India' },
      address: { '@type': 'PostalAddress', addressLocality: brand.hq.city, addressRegion: brand.hq.state, addressCountry: 'IN' },
      telephone: brand.contact.phoneDisplay,
      parentOrganization: { '@id': abs('/#organization') },
    },
  ];
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function channelServiceLd(c: ChannelData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${c.name} advertising`,
    serviceType: c.name,
    description: c.summary,
    url: abs(`/channels/${c.slug}`),
    areaServed: { '@type': 'Country', name: 'India' },
    provider: { '@id': abs('/#organization') },
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export const absoluteUrl = abs;
