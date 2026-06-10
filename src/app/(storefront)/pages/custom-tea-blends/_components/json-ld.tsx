import {
  CUSTOM_TEA_BLEND_DESCRIPTION,
  CUSTOM_TEA_BLEND_PAGE_PATH,
  CUSTOM_TEA_BLEND_PAGE_TITLE,
} from '@/lib/contact/custom-tea-blend'
import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { getSiteUrl } from '@/lib/seo/site-url'

export function JsonLd() {
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
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeInlineJson(jsonLd) }}
    />
  )
}
