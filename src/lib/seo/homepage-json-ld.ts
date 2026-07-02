import { SITE_URL } from '@/lib/seo/site-url'

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Teavision',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '1300-729-617',
    contactType: 'sales',
    areaServed: 'AU',
  },
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Teavision',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}
