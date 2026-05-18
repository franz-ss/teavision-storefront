import {
  CUSTOM_TEA_BLEND_DESCRIPTION,
  CUSTOM_TEA_BLEND_PAGE_PATH,
  CUSTOM_TEA_BLEND_PAGE_TITLE,
} from '@/lib/contact/custom-tea-blend'
import { getSiteUrl } from '@/lib/seo/site-url'

import { FAQS } from './custom-tea-blends-data'

function serializeJsonLd(value: unknown): string {
  return (JSON.stringify(value) ?? '').replace(/</g, '\\u003c')
}

export function CustomTeaBlendJsonLd() {
  const pageUrl = getSiteUrl(CUSTOM_TEA_BLEND_PAGE_PATH)
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
            name: CUSTOM_TEA_BLEND_PAGE_TITLE,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'Service',
        name: 'Custom Tea Blending',
        description: CUSTOM_TEA_BLEND_DESCRIPTION,
        provider: {
          '@type': 'Organization',
          name: 'Teavision',
        },
        areaServed: 'AU',
        url: pageUrl,
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.title,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.description,
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}
