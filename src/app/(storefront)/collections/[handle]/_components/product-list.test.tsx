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
  it('uses parent-owned spacing and dividers for product rows', () => {
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

    expect(html).toContain('space-y-8')
    expect(html).toContain('divide-y')
    expect(html).toContain('[&amp;&gt;li]:border-subtle')
    expect(html).toContain('[&amp;&gt;li:not(:last-child)]:pb-8')
    expect(html).not.toContain('py-5')
    expect(html).not.toContain('<li class="border-default border-b')
    expect(html).not.toContain('first:pt-0')
    expect(html).not.toContain('last:border-b-0')
  })
})
