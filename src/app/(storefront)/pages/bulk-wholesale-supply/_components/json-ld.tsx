import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { getSiteUrl } from '@/lib/seo/site-url'

import {
  FAQ_ITEMS,
  PAGE_DESCRIPTION,
  PAGE_PATH,
  PAGE_TITLE,
} from '../_lib/data'

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
        name: 'Bulk Wholesale Tea & Ingredients Import',
        description: PAGE_DESCRIPTION,
        provider: {
          '@type': 'Organization',
          name: 'Teavision',
        },
        areaServed: 'AU',
        url: pageUrl,
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
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
