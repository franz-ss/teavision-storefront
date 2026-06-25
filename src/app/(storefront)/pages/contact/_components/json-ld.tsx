import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { getSiteUrl } from '@/lib/seo/site-url'

import { ADDRESS, EMAIL, PHONE } from '../_lib/page-data'

function getPostalAddress(address: string) {
  const [streetAddress, localityRegionPostcode] = address.split(', ')
  const addressParts = localityRegionPostcode?.split(' ') ?? []
  const postalCode = addressParts.at(-1) ?? ''
  const addressRegion = addressParts.at(-2) ?? ''
  const addressLocality = addressParts.slice(0, -2).join(' ')

  return {
    '@type': 'PostalAddress',
    streetAddress,
    addressLocality,
    addressRegion,
    postalCode,
    addressCountry: 'AU',
  }
}

export function JsonLd() {
  const pageUrl = getSiteUrl('/pages/contact')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: getSiteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Contact',
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'WebPage',
        name: 'Contact Teavision',
        description:
          'Contact Teavision for wholesale tea, custom blending, private label, samples, and supply enquiries across Australia.',
        url: pageUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Teavision',
        },
      },
      {
        '@type': 'LocalBusiness',
        name: 'Teavision',
        url: pageUrl,
        telephone: PHONE,
        email: EMAIL,
        address: getPostalAddress(ADDRESS),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeInlineJson(jsonLd) }}
    />
  )
}
