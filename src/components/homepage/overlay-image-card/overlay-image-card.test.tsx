import type { ComponentProps } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { PRODUCT_RANGE } from '../content'
import { OverlayImageCard } from './overlay-image-card'

type ImageProps = ComponentProps<'img'> & {
  fill?: boolean
}

vi.mock('next/image', () => ({
  default: vi.fn((props: ImageProps) => {
    void props
    return null
  }),
}))

describe('OverlayImageCard', () => {
  it('fades the hover scrim instead of swapping gradient backgrounds', () => {
    const html = renderToStaticMarkup(
      <OverlayImageCard card={PRODUCT_RANGE[0]} />,
    )

    expect(html).toContain('transition-opacity')
    expect(html).toContain('group-hover:opacity-100')
    expect(html).not.toContain('transition-[background]')
  })
})
