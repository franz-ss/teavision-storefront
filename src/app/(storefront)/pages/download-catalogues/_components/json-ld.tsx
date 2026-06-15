import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { getSiteUrl } from '@/lib/seo/site-url'

import { CATALOGUES, HERO, PAGE_PATH } from '../_lib/data'

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
            name: HERO.title,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: HERO.title,
        itemListElement: CATALOGUES.map((catalogue, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'DigitalDocument',
            name: catalogue.title,
            description: catalogue.description,
            encodingFormat: 'application/pdf',
            url: getSiteUrl(catalogue.href),
          },
        })),
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
