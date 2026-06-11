import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { getSiteUrl } from '@/lib/seo/site-url'

const PAGE_PATH = '/pages/tea-bag-manufacturer'
const PAGE_TITLE = 'Tea Bag Manufacturer | Teavision'
const PAGE_DESCRIPTION =
  'Custom tea bags and blends for global brands. Over 10 million tea bags produced annually with private label packaging and international shipping from Australia. MOQ from 8,000 bags.'

export function JsonLd() {
  const pageUrl = getSiteUrl(PAGE_PATH)
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
            name: PAGE_TITLE,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Tea Bag Manufacturing',
        description: PAGE_DESCRIPTION,
        provider: {
          '@type': 'Organization',
          name: 'Teavision',
        },
        areaServed: 'AU',
        url: pageUrl,
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
