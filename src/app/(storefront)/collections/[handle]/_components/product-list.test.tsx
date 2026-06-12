import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import type {
  CollectionProductSummary,
  ProductVariant,
} from '@/lib/shopify/types'

import { ProductList } from './product-list'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

vi.mock('@/lib/cart/actions', () => ({
  addToCartAction: vi.fn(),
}))

const variants: ProductVariant[] = [
  {
    id: 'gid://shopify/ProductVariant/masters-sencha-50g',
    title: '50g Sample',
    availableForSale: true,
    quantityAvailable: 10,
    quantityRule: {
      minimum: 1,
      maximum: 10,
      increment: 1,
    },
    price: { amount: '12.00', currencyCode: 'AUD' },
    quantityPriceBreaks: [],
    image: null,
  },
]

const product: CollectionProductSummary = {
  id: 'gid://shopify/Product/masters-sencha',
  handle: 'tea-masters-sencha',
  title: 'Tea Masters Sencha Green Tea',
  availableForSale: true,
  productType: 'Green tea',
  tags: [],
  featuredImage: null,
  priceRange: {
    minVariantPrice: { amount: '12.00', currencyCode: 'AUD' },
  },
  rating: 4.8,
  reviewCount: 37,
  variants,
}

describe('ProductList', () => {
  it('uses a CSS grid layout with hairline-2 separators for product rows', () => {
    const html = renderToStaticMarkup(
      <ProductList
        products={[
          product,
          {
            ...product,
            id: 'gid://shopify/Product/organic-rose',
            handle: 'organic-rose-petals',
            title: 'Organic Rose Petals',
          },
        ]}
      />,
    )

    expect(html).toContain('grid-cols-2')
    expect(html).toContain('lg:grid-cols-3')
    expect(html).toContain('gap-y-5.5')
    expect(html).toContain('gap-x-4.5')
    expect(html).toContain('border-hairline-2')
    // Old listing layout classes must be gone (migrated to new grid)
    expect(html).not.toContain('space-y-8')
    expect(html).not.toContain('divide-y')
  })

  it('renders numbered pagination with aria-label when totalPages > 1', () => {
    const html = renderToStaticMarkup(
      <ProductList
        products={[product]}
        currentPage={2}
        totalPages={5}
        buildPageHref={(page) => `/collections/all?page=${page}`}
      />,
    )

    // Should NOT contain "Next products" button anymore
    expect(html).not.toContain('Next products')
    // Should contain aria-label for pagination nav
    expect(html).toContain('Collection pagination')
    // Current page should be aria-current="page"
    expect(html).toContain('aria-current="page"')
    // Should have a link to the last page (true last page visible)
    expect(html).toContain('Page 5')
  })

  it('does not render pagination when totalPages is 1', () => {
    const html = renderToStaticMarkup(
      <ProductList
        products={[product]}
        currentPage={1}
        totalPages={1}
        buildPageHref={(page) => `/collections/all?page=${page}`}
      />,
    )

    expect(html).not.toContain('Collection pagination')
    expect(html).not.toContain('Next products')
  })

  it('pager links include the product-grid anchor and target offset for scroll-to-grid (D-26)', () => {
    const html = renderToStaticMarkup(
      <ProductList
        products={[product]}
        currentPage={2}
        totalPages={5}
        buildPageHref={(page) => `/collections/all?page=${page}`}
      />,
    )

    expect(html).toContain('#product-grid')
    expect(html).toContain('id="product-grid"')
    expect(html).toContain('scroll-mt-24')
    expect(html).toContain('lg:scroll-mt-32')
  })
})
