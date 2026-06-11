import type { ComponentProps } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ArticleCard } from './article-card'

type ImageProps = ComponentProps<'img'> & {
  blurDataURL?: string
  placeholder?: 'blur' | 'empty'
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

const article = {
  excerpt: 'A practical guide to tea selection.',
  featuredImage: {
    altText: 'Loose leaf tea',
    height: 800,
    lqip: 'data:image/jpeg;base64,card',
    url: 'https://cdn.sanity.io/images/project/dataset/card.jpg',
    width: 1200,
  },
  publishedAt: '2026-06-01T00:00:00.000Z',
  readingTimeMinutes: 3,
  tags: ['Wholesale'],
  title: 'Selecting wholesale tea',
}

function lastImageProps(): ImageProps {
  const call = imageMock.mock.calls.at(-1)
  if (!call) throw new Error('Expected next/image to render')

  return call[0]
}

describe('ArticleCard', () => {
  beforeEach(() => {
    imageMock.mockClear()
  })

  it('uses Sanity LQIP for blur placeholders without preloading by default', () => {
    renderToStaticMarkup(
      <ArticleCard
        article={article}
        href="/blogs/teavision-blogs/selecting-wholesale-tea"
        publishedLabel="1 Jun 2026"
      />,
    )

    expect(lastImageProps()).toMatchObject({
      blurDataURL: 'data:image/jpeg;base64,card',
      placeholder: 'blur',
      preload: false,
    })
  })

  it('falls back to an empty placeholder when LQIP is absent', () => {
    renderToStaticMarkup(
      <ArticleCard
        article={{
          ...article,
          featuredImage: { ...article.featuredImage, lqip: null },
        }}
        href="/blogs/teavision-blogs/selecting-wholesale-tea"
        publishedLabel="1 Jun 2026"
      />,
    )

    expect(lastImageProps()).toMatchObject({
      blurDataURL: undefined,
      placeholder: 'empty',
    })
  })
})
