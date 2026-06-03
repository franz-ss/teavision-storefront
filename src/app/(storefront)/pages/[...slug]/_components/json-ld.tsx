import type { ShopifyPage } from '@/lib/shopify/operations/storefront-page'
import { getPagePath } from '@/lib/shopify/operations/storefront-page'
import { serializeInlineJson } from '@/lib/seo/serialize-inline-json'
import { getSiteUrl } from '@/lib/seo/site-url'

export function JsonLd({
  description,
  page,
}: {
  description: string
  page: ShopifyPage
}) {
  const canonical = getPagePath(page.handle)
  const pageUrl = getSiteUrl(canonical)
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
            name: page.title,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'WebPage',
        name: page.title,
        description,
        url: pageUrl,
        dateModified: page.updatedAt,
        publisher: {
          '@type': 'Organization',
          name: 'Teavision',
        },
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
