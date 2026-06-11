import { isValidElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getTrustooProductRatings } from '@/lib/reviews/trustoo'
import { getProductRecommendations } from '@/lib/shopify/operations/product'
import { makeProduct, makeProductSummary } from '@/tests/fixtures/shopify/product'

import { RelatedProducts } from './related-products'

let capturedHeading: ReactNode

vi.mock('@/components/product', () => ({
  RelatedProductsCarousel: ({ heading }: { heading?: ReactNode }) => {
    capturedHeading = heading
    return <div data-related-products-carousel>{heading}</div>
  },
}))

vi.mock('@/lib/reviews/trustoo', () => ({
  getTrustooProductRatings: vi.fn(),
}))

vi.mock('@/lib/shopify/operations/product', () => ({
  getProductRecommendations: vi.fn(),
}))

describe('RelatedProducts', () => {
  beforeEach(() => {
    capturedHeading = null
    vi.mocked(getTrustooProductRatings).mockResolvedValue({})
    vi.mocked(getProductRecommendations).mockResolvedValue([
      makeProductSummary({
        id: 'gid://shopify/Product/recommended-tea',
        handle: 'recommended-tea',
        title: 'Recommended Tea',
      }),
    ])
  })

  it('passes a keyed heading into the carousel', async () => {
    renderToStaticMarkup(await RelatedProducts({ product: makeProduct() }))

    if (!isValidElement(capturedHeading)) {
      throw new Error('Expected RelatedProducts to pass a heading element')
    }

    expect(capturedHeading.key).toBe('related-products-title')
  })
})
