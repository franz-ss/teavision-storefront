import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/shopify/operations/product'
import { getCollections } from '@/lib/shopify/operations/collection'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'

const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1.0,
  },
  {
    url: `${baseUrl}/search`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${baseUrl}/blogs/journal`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${baseUrl}/pages/wholesale`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${baseUrl}/pages/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${baseUrl}/pages/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collectionHandles] = await Promise.all([
    getProducts(250),
    getCollections(250),
  ])

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.handle}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const collectionUrls: MetadataRoute.Sitemap = collectionHandles.map(
    (handle) => ({
      url: `${baseUrl}/collections/${handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
  )

  return [...STATIC_PAGES, ...productUrls, ...collectionUrls]
}
