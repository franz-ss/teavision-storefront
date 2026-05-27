import type { Collection, CollectionProductSummary } from '@/lib/shopify/types'

type JsonLdProps = {
  baseUrl: string
  collection: Collection
  collectionUrl: string
  products: CollectionProductSummary[]
}

function serializeJsonLd(value: unknown): string {
  return (JSON.stringify(value) ?? '').replace(/</g, '\\u003c')
}

export function JsonLd({
  baseUrl,
  collection,
  collectionUrl,
  products,
}: JsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Collections',
            item: `${baseUrl}/collections/all`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: collection.title,
            item: collectionUrl,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: collection.title,
        description: collection.description,
        url: collectionUrl,
        dateModified: collection.updatedAt,
      },
      {
        '@type': 'ItemList',
        name: `${collection.title} products`,
        itemListElement: products.slice(0, 24).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${baseUrl}/products/${product.handle}`,
          item: {
            '@type': 'Product',
            name: product.title,
            image: product.featuredImage?.url,
            offers: {
              '@type': 'Offer',
              price: product.priceRange.minVariantPrice.amount,
              priceCurrency: product.priceRange.minVariantPrice.currencyCode,
            },
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  )
}
