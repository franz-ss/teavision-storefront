import { beforeEach, describe, expect, test, vi } from 'vitest'

import {
  DEFAULT_BLOG_HANDLE,
  getArticlePath,
  type BlogIndex,
} from '@/lib/blog/operations'
import { getCollectionSummaries } from '@/lib/shopify/operations/collection'
import { getAllProducts } from '@/lib/shopify/operations/product'

import sitemap from './sitemap'

const { getBlogMock, isNoindexModeEnabledMock } = vi.hoisted(() => ({
  getBlogMock: vi.fn(),
  isNoindexModeEnabledMock: vi.fn(),
}))

vi.mock('@/lib/blog/operations', () => ({
  CANONICAL_BLOG_LISTING_PATH: '/blog',
  DEFAULT_BLOG_HANDLE: 'teavision-blogs',
  getArticlePath: (blogHandle: string, articleHandle: string) =>
    `/blogs/${blogHandle}/${articleHandle}`,
  getBlog: getBlogMock,
  isLocalCanonicalPath: (
    canonicalPath: string | null,
    localPath: string,
    baseUrl: string,
  ) =>
    !canonicalPath ||
    canonicalPath === localPath ||
    canonicalPath === `${baseUrl}${localPath}`,
}))

vi.mock('@/lib/seo/noindex', () => ({
  isNoindexModeEnabled: isNoindexModeEnabledMock,
}))

vi.mock('@/lib/shopify/operations/collection', () => ({
  getCollectionSummaries: vi.fn(),
}))

vi.mock('@/lib/shopify/operations/product', () => ({
  getAllProducts: vi.fn(),
}))

function createBlog(): BlogIndex {
  return {
    id: 'blog',
    handle: DEFAULT_BLOG_HANDLE,
    title: 'Tea Journal',
    description: '',
    heroImage: null,
    seo: {
      title: null,
      description: null,
      canonicalPath: null,
      noIndex: false,
      ogImage: null,
    },
    articles: [
      {
        id: 'article',
        handle: 'selecting-wholesale-tea',
        title: 'Selecting wholesale tea',
        excerpt: '',
        featuredImage: null,
        publishedAt: '2026-07-01T00:00:00.000Z',
        tags: [],
        authorName: null,
        seo: {
          title: null,
          description: null,
          canonicalPath: null,
          noIndex: false,
          ogImage: null,
        },
        readingTimeMinutes: 1,
      },
    ],
    featuredArticles: [],
  }
}

describe('sitemap blog paths', () => {
  beforeEach(() => {
    isNoindexModeEnabledMock.mockReturnValue(false)
    getBlogMock.mockResolvedValue(createBlog())
    vi.mocked(getAllProducts).mockResolvedValue([])
    vi.mocked(getCollectionSummaries).mockResolvedValue([])
  })

  test('uses /blog for the listing and preserves article URLs', async () => {
    const entries = await sitemap()
    const paths = entries.map((entry) => new URL(entry.url).pathname)

    expect(paths).toContain('/blog')
    expect(paths).not.toContain('/blogs/teavision-blogs')
    expect(paths).toContain(
      getArticlePath(DEFAULT_BLOG_HANDLE, 'selecting-wholesale-tea'),
    )
  })
})
