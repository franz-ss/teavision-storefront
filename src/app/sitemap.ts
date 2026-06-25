import type { MetadataRoute } from 'next'

import {
  DEFAULT_BLOG_HANDLE,
  getArticlePath,
  getBlog,
  getBlogPath,
  isLocalCanonicalPath,
} from '@/lib/blog/operations'
import { getLaunchSeoRouteExpectations } from '@/lib/seo/launch-route-matrix'
import { isNoindexModeEnabled } from '@/lib/seo/noindex'
import { SITE_URL } from '@/lib/seo/site-url'
import { getAllProducts } from '@/lib/shopify/operations/product'
import { getCollectionSummaries } from '@/lib/shopify/operations/collection'

const STATIC_LAST_MODIFIED = '2026-06-02'

function getSitemapUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}

const STATIC_PAGES: MetadataRoute.Sitemap = getLaunchSeoRouteExpectations()
  .filter(
    (expectation) =>
      expectation.expectedStatus === 200 && expectation.shouldAppearInSitemap,
  )
  .map((expectation) => ({
    url: getSitemapUrl(expectation.path),
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: expectation.path === '/' ? 1.0 : 0.5,
  }))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isNoindexModeEnabled()) {
    return []
  }

  const [products, collections, blog] = await Promise.all([
    getAllProducts(),
    getCollectionSummaries(250),
    getBlog(DEFAULT_BLOG_HANDLE),
  ])

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.handle}`,
    lastModified: product.updatedAt ?? STATIC_LAST_MODIFIED,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const collectionUrls: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      url: `${SITE_URL}/collections/${collection.handle}`,
      lastModified: collection.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
  )

  const indexedArticles =
    blog?.articles.filter((article) => {
      const localPath = getArticlePath(DEFAULT_BLOG_HANDLE, article.handle)

      return (
        !article.seo.noIndex &&
        isLocalCanonicalPath(article.seo.canonicalPath, localPath, SITE_URL)
      )
    }) ?? []

  const latestArticleDate = indexedArticles[0]?.publishedAt
    ? new Date(indexedArticles[0].publishedAt)
    : STATIC_LAST_MODIFIED

  const blogUrls: MetadataRoute.Sitemap =
    blog && !blog.seo.noIndex
      ? [
          {
            url: `${SITE_URL}${getBlogPath(DEFAULT_BLOG_HANDLE)}`,
            lastModified: latestArticleDate,
            changeFrequency: 'monthly',
            priority: 0.5,
          },
        ]
      : []

  const articleUrls: MetadataRoute.Sitemap = indexedArticles.map((article) => ({
    url: `${SITE_URL}${getArticlePath(DEFAULT_BLOG_HANDLE, article.handle)}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [
    ...STATIC_PAGES,
    ...blogUrls,
    ...productUrls,
    ...collectionUrls,
    ...articleUrls,
  ]
}
