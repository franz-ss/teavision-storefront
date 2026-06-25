import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getTrustooProductRatings } from '@/lib/reviews/trustoo'
import { getProduct } from '@/lib/shopify/operations/product'
import { makeProduct } from '@/tests/fixtures/shopify/product'

import { ProductContent } from './page'

vi.mock('server-only', () => ({}))

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('notFound')
  },
}))

vi.mock('next/script', () => ({
  default: ({
    dangerouslySetInnerHTML,
    id,
  }: {
    dangerouslySetInnerHTML?: { __html: string }
    id?: string
  }) => (
    <script
      data-next-script={id}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  ),
}))

vi.mock('@/components/product', () => ({
  ProductForm: () => <div data-testid="product-form">Buy controls</div>,
  ProductGallery: ({ title }: { title: string }) => (
    <div data-testid="product-gallery">{title} gallery</div>
  ),
}))

vi.mock('@/lib/reviews/trustoo', () => ({
  getTrustooProductRatings: vi.fn(),
}))

vi.mock('@/lib/shopify/operations/product', () => ({
  PRODUCT_DETAIL_CACHE_VERSION: 'test-cache-version',
  getProduct: vi.fn(),
}))

vi.mock('./_components/customers-also-bought', () => ({
  CustomersAlsoBought: () => null,
}))

vi.mock('./_components/related-products', () => ({
  RelatedProducts: () => null,
}))

vi.mock('./_components/view-analytics', () => ({
  ProductViewAnalytics: () => null,
}))

describe('ProductContent heading hierarchy', () => {
  beforeEach(() => {
    vi.mocked(getTrustooProductRatings).mockResolvedValue({})
    vi.mocked(getProduct).mockResolvedValue(
      makeProduct({
        handle: 'only-product-title',
        title: 'Only Product Title',
        description: 'A product with imported rich description headings.',
        descriptionHtml:
          '<h1>Imported product title</h1><h2>Imported section</h2><p>Body copy</p>',
      }),
    )
  })

  it('keeps the product title as the only H1 and demotes imported description headings', async () => {
    const element = await ProductContent({
      params: Promise.resolve({ handle: 'only-product-title' }),
      searchParams: Promise.resolve({}),
    })
    const html = renderToStaticMarkup(element as ReactNode)

    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Only Product Title')
    expect(html).toContain(
      '<h3 class="type-heading-05 text-ink mt-5">Imported product title</h3>',
    )
    expect(html).toContain(
      '<h3 class="type-heading-05 text-ink mt-5">Imported section</h3>',
    )
    expect(html).not.toContain('<h1>Imported product title</h1>')
    expect(html).not.toContain('<h2>Imported section</h2>')
  })
})
