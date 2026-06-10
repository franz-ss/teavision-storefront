import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { getSiteUrl } from '@/lib/seo/site-url'

const PAGE_PATH = '/pages/private-label-packing'
const PAGE_TITLE = 'Private Label Packing | Teavision'
const PAGE_DESCRIPTION =
  "Australia's #1 private label tea partner. Custom blends, tea bag manufacturing, extract powders, and full packaging under your brand. Low MOQs, export-ready docs."

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
        name: 'Private Label Tea Packing',
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
