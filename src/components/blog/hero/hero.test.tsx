import type { ComponentProps } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Hero } from './hero'

type ImageProps = ComponentProps<'img'> & {
  blurDataURL?: string
  fill?: boolean
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

vi.mock('@/lib/blog/listing', () => ({
  DEFAULT_LISTING_DESCRIPTION: 'Tea journal description',
}))

function lastImageProps(): ImageProps {
  const call = imageMock.mock.calls.at(-1)
  if (!call) throw new Error('Expected next/image to render')

  return call[0]
}

describe('Hero', () => {
  beforeEach(() => {
    imageMock.mockClear()
  })

  it('does not enable a blur placeholder for empty-string LQIP', () => {
    renderToStaticMarkup(
      <Hero
        image={{
          altText: 'Tea fields',
          lqip: '',
          url: 'https://cdn.sanity.io/images/project/dataset/hero.jpg',
        }}
        preload={false}
      />,
    )

    expect(lastImageProps()).toMatchObject({
      blurDataURL: undefined,
      placeholder: 'empty',
      preload: false,
    })
  })

  it('uses a blur placeholder when valid LQIP exists', () => {
    renderToStaticMarkup(
      <Hero
        image={{
          altText: 'Tea fields',
          lqip: 'data:image/jpeg;base64,hero',
          url: 'https://cdn.sanity.io/images/project/dataset/hero.jpg',
        }}
      />,
    )

    expect(lastImageProps()).toMatchObject({
      blurDataURL: 'data:image/jpeg;base64,hero',
      placeholder: 'blur',
      preload: true,
    })
  })
})
