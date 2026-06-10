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
})
