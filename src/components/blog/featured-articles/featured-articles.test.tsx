import type { ComponentProps } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { BlogArticleSummary } from '@/lib/blog/operations'

import { FeaturedArticles } from './featured-articles'

type ImageProps = ComponentProps<'img'> & {
  preload?: boolean
}

const imageMock = vi.hoisted(() =>
  vi.fn((props: ImageProps) => {
    void props
    return null
  }),
)

vi.mock('next/image', () => ({
  default: imageMock,
}))

vi.mock('@/lib/blog/operations', () => ({
  formatArticleDate: () => '01/06/2026',
  getArticlePath: () => '/blogs/teavision-blogs/selecting-wholesale-tea',
}))

const featuredArticle: BlogArticleSummary = {
  authorName: 'Tea Editor',
  excerpt: 'A practical guide to tea selection.',
  featuredImage: {
    altText: 'Loose leaf tea',
    height: 800,
    lqip: 'data:image/jpeg;base64,featured',
    url: 'https://cdn.sanity.io/images/project/dataset/featured.jpg',
    width: 1200,
  },
  handle: 'selecting-wholesale-tea',
  id: 'featured',
  publishedAt: '2026-06-01T00:00:00.000Z',
  readingTimeMinutes: 3,
  seo: {
    canonicalPath: null,
    description: null,
    noIndex: false,
    ogImage: null,
    title: null,
  },
  tags: ['Wholesale'],
  title: 'Selecting wholesale tea',
}

describe('FeaturedArticles', () => {
  beforeEach(() => {
    imageMock.mockClear()
  })

  it('does not preload featured card images on the listing route', () => {
    renderToStaticMarkup(
      <FeaturedArticles
        articles={[featuredArticle]}
        blogHandle="teavision-blogs"
      />,
    )

    const firstCall = imageMock.mock.calls[0]
    if (!firstCall) throw new Error('Expected featured image to render')

    expect(firstCall[0]).toMatchObject({
      preload: false,
    })
  })
})
