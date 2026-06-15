import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { getSiteUrl } from '@/lib/seo/site-url'

import { FAQ, HERO, META_DESCRIPTION, PAGE_PATH } from '../_lib/data'

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
        '@type': 'Article',
        headline: HERO.title,
        description: META_DESCRIPTION,
        about: 'Bulk tea shelf life and storage',
        url: pageUrl,
        mainEntityOfPage: pageUrl,
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: FAQ.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: FAQ.answer,
            },
          },
        ],
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
