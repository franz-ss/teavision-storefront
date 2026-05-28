import type { MetadataRoute } from 'next'

import {
  DEFAULT_BLOG_HANDLE,
  getArticlePath,
  getBlog,
  getBlogPath,
  getTagPath,
  getUniqueArticleTags,
  isLocalCanonicalPath,
} from '@/lib/blog/operations'
import { getAllProducts } from '@/lib/shopify/operations/product'
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
  const [products, collectionHandles, blog] = await Promise.all([
    getAllProducts(),
    getCollections(250),
    getBlog(DEFAULT_BLOG_HANDLE),
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

  const indexedArticles =
    blog?.articles.filter((article) => {
      const localPath = getArticlePath(DEFAULT_BLOG_HANDLE, article.handle)

      return (
        !article.seo.noIndex &&
        isLocalCanonicalPath(article.seo.canonicalPath, localPath, baseUrl)
      )
    }) ?? []

  const blogUrls: MetadataRoute.Sitemap =
    blog && !blog.seo.noIndex
      ? [
          {
            url: `${baseUrl}${getBlogPath(DEFAULT_BLOG_HANDLE)}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
          },
        ]
      : []

  const articleUrls: MetadataRoute.Sitemap = indexedArticles.map((article) => ({
    url: `${baseUrl}${getArticlePath(DEFAULT_BLOG_HANDLE, article.handle)}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  const latestArticleDate = indexedArticles[0]?.publishedAt
    ? new Date(indexedArticles[0].publishedAt)
    : new Date()

  const tagUrls: MetadataRoute.Sitemap =
    blog && !blog.seo.noIndex
      ? getUniqueArticleTags(indexedArticles).map((tag) => ({
          url: `${baseUrl}${getTagPath(DEFAULT_BLOG_HANDLE, tag)}`,
          lastModified: latestArticleDate,
          changeFrequency: 'monthly',
          priority: 0.4,
        }))
      : []

  return [
    ...STATIC_PAGES,
    ...blogUrls,
    ...productUrls,
    ...collectionUrls,
    ...articleUrls,
    ...tagUrls,
  ]
}
