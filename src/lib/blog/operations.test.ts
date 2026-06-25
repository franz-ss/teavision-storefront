import { readFileSync } from 'node:fs'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { generateListingMetadata } from '@/app/(storefront)/blogs/[blog]/_lib/metadata'
import { getSanityImageUrl, sanityFetch } from '@/lib/sanity/client'
import type {
  SanityBlogListingResult,
  SanityBlogPostSummary,
  SanityDefaultBlogListingResult,
  SanityImageWithAlt,
} from '@/lib/sanity/types'

import {
  DEFAULT_BLOG_HANDLE,
  getBlogPath,
  getDefaultBlogListing,
} from './operations'

vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}))

vi.mock('@/lib/sanity/client', () => ({
  getSanityImageUrl: vi.fn(),
  sanityFetch: vi.fn(),
}))

vi.mock('@/lib/seo/noindex', () => ({
  withNoindexRobots: vi.fn((metadata) => metadata),
}))

function makeImage(id: string, lqip: string | null): SanityImageWithAlt {
  return {
    alt: `${id} alt`,
    attribution: null,
    caption: null,
    image: {
      asset: {
        _id: `image-${id}`,
        url: `https://cdn.sanity.io/images/project/dataset/${id}.jpg`,
        metadata: {
          dimensions: {
            width: 1200,
            height: 800,
            aspectRatio: 1.5,
          },
          lqip,
        },
      },
    },
  }
}

function makePost(id: string): SanityBlogPostSummary {
  return {
    _id: id,
    author: { name: 'Tea Editor' },
    bodyText: null,
    categories: [{ title: 'Green Tea' }],
    excerpt: `${id} excerpt`,
    featuredImage: makeImage(id, `data:image/jpeg;base64,${id}`),
    publishedAt: '2026-06-01T00:00:00.000Z',
    seo: null,
    slug: id,
    tags: ['Wholesale'],
    title: `${id} title`,
  }
}

describe('getDefaultBlogListing', () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockReset()
    vi.mocked(getSanityImageUrl).mockReset()
    vi.mocked(getSanityImageUrl).mockImplementation((_source, options = {}) => {
      const width = options.width ? `w=${options.width}` : null
      const quality = options.quality ? `q=${options.quality}` : null
      const fit = options.fit ? `fit=${options.fit}` : null

      return ['https://cdn.sanity.io/generated.jpg', width, quality, fit]
        .filter((part): part is string => Boolean(part))
        .join('?')
    })
  })

  it('carries LQIP and uses bounded image options by listing use case', async () => {
    const result: SanityDefaultBlogListingResult = {
      allTagArrays: [{ categories: ['Green Tea'], tags: ['Wholesale'] }],
      articles: [makePost('latest')],
      blog: {
        _id: 'blog',
        description: 'Tea journal',
        featuredPosts: [makePost('featured')],
        heroImage: makeImage('hero', 'data:image/jpeg;base64,hero'),
        seo: null,
        slug: 'teavision-blogs',
        title: 'Tea Journal',
      },
      totalCount: 1,
    }
    vi.mocked(sanityFetch).mockResolvedValue(result)

    const listing = await getDefaultBlogListing('teavision-blogs', 1)

    expect(listing?.heroImage).toMatchObject({
      lqip: 'data:image/jpeg;base64,hero',
      url: expect.stringContaining('w=1920'),
    })
    expect(listing?.featuredArticles[0]?.featuredImage).toMatchObject({
      lqip: 'data:image/jpeg;base64,featured',
      url: expect.stringContaining('w=900'),
    })
    expect(listing?.paginated.articles[0]?.featuredImage).toMatchObject({
      lqip: 'data:image/jpeg;base64,latest',
      url: expect.stringContaining('w=640'),
    })

    expect(vi.mocked(getSanityImageUrl)).toHaveBeenCalledWith(
      expect.objectContaining({
        asset: expect.objectContaining({ _id: 'image-hero' }),
      }),
      { fit: 'max', quality: 75, width: 1920 },
    )
    expect(vi.mocked(getSanityImageUrl)).toHaveBeenCalledWith(
      expect.objectContaining({
        asset: expect.objectContaining({ _id: 'image-featured' }),
      }),
      { fit: 'max', quality: 75, width: 900 },
    )
    expect(vi.mocked(getSanityImageUrl)).toHaveBeenCalledWith(
      expect.objectContaining({
        asset: expect.objectContaining({ _id: 'image-latest' }),
      }),
      { fit: 'max', quality: 68, width: 640 },
    )
  })

  it('clamps an out-of-range page and refetches the last page of articles', async () => {
    const emptyWindow: SanityDefaultBlogListingResult = {
      allTagArrays: [],
      articles: [],
      blog: {
        _id: 'blog',
        description: 'Tea journal',
        featuredPosts: [],
        heroImage: null,
        seo: null,
        slug: 'teavision-blogs',
        title: 'Tea Journal',
      },
      totalCount: 7,
    }
    const lastPageWindow: SanityDefaultBlogListingResult = {
      ...emptyWindow,
      articles: [makePost('last-page')],
    }
    vi.mocked(sanityFetch)
      .mockResolvedValueOnce(emptyWindow)
      .mockResolvedValueOnce(lastPageWindow)

    const listing = await getDefaultBlogListing('teavision-blogs', 999)

    expect(listing?.paginated.currentPage).toBe(2)
    expect(listing?.paginated.totalPages).toBe(2)
    expect(listing?.paginated.articles[0]?.title).toBe('last-page title')
    expect(vi.mocked(sanityFetch)).toHaveBeenNthCalledWith(
      2,
      expect.any(String),
      expect.objectContaining({ offset: 6, limit: 12 }),
    )
  })
})

describe('generateListingMetadata', () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockReset()
    vi.mocked(getSanityImageUrl).mockReset()
    vi.mocked(getSanityImageUrl).mockReturnValue(
      'https://cdn.sanity.io/generated.jpg',
    )
  })

  it('noindexes tagged blog listings while allowing crawlers to follow links', async () => {
    const result: SanityBlogListingResult = {
      articles: [makePost('article')],
      blog: {
        _id: 'blog',
        description: 'Tea journal',
        featuredPosts: [],
        heroImage: null,
        seo: {
          canonicalPath: null,
          metaDescription: 'Tea journal metadata',
          metaTitle: 'Tea Journal',
          noIndex: false,
          ogImage: null,
        },
        slug: 'teavision-blogs',
        title: 'Tea Journal',
      },
    }
    vi.mocked(sanityFetch).mockResolvedValue(result)

    const metadata = await generateListingMetadata({
      params: Promise.resolve({
        blog: 'teavision-blogs',
        tag: 'green-tea',
      }),
      searchParams: Promise.resolve({}),
    })

    expect(metadata.robots).toEqual({ index: false, follow: true })
    expect(metadata.alternates?.canonical).toBe(
      '/blogs/teavision-blogs/tagged/green-tea',
    )
  })
})

describe('blog listing URL handoff', () => {
  it('keeps the default listing path while documenting the /blog owner handoff', () => {
    const remediation = readFileSync(
      'docs/launch/seo-audit-remediation.md',
      'utf8',
    )

    expect(getBlogPath(DEFAULT_BLOG_HANDLE)).toBe('/blogs/teavision-blogs')
    expect(remediation).toContain('### Blog Listing URL')
    expect(remediation).toContain('owner/SEO handoff')
  })
})
