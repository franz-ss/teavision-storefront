/**
 * @vitest-environment jsdom
 */
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import type {
  CollectionProductSummary,
  ProductVariant,
} from '@/lib/shopify/types'

import { ProductCard } from './product-card'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true

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
  {
    id: 'gid://shopify/ProductVariant/masters-sencha-1kg',
    title: '1kg',
    availableForSale: true,
    quantityAvailable: 4,
    quantityRule: {
      minimum: 1,
      maximum: 4,
      increment: 1,
    },
    price: { amount: '88.00', currencyCode: 'AUD' },
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
  tags: ['Organic', 'ACO Certified', 'Wholesale'],
  featuredImage: {
    url: 'https://cdn.shopify.com/s/files/1/0000/0001/products/tea-1.jpg?v=1',
    altText: 'Loose leaf green tea',
    width: 900,
    height: 900,
  },
  priceRange: {
    minVariantPrice: { amount: '12.00', currencyCode: 'AUD' },
  },
  rating: 4.8,
  reviewCount: 37,
  variants,
}

describe('ProductCard', () => {
  it('renders the approved inline listing layout', () => {
    const html = renderToStaticMarkup(<ProductCard product={product} />)

    expect(html).toContain('sm:h-45')
    expect(html).toContain('sm:w-45')
    expect(html).toContain('flex-col')
    expect(html).toContain('justify-between')
    expect(html).toContain('4.8 out of 5 stars, 37 reviews')
    expect(html).toContain('$12.00')
    expect(html).toContain('Size')
    expect(html).toContain('Product Qty')
    expect(html).toContain('Add to cart')

    expect(html).not.toContain('Green tea')
    expect(html).not.toContain('Organic')
    expect(html).not.toContain('ACO')
    expect(html).not.toContain('From')
    expect(html).not.toContain('ShoppingCart')
  })

  it('updates the visible price when a different size is selected', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)

    await act(async () => {
      root.render(<ProductCard product={product} />)
    })

    expect(host.textContent).toContain('$12.00')

    const select = host.querySelector('select')
    if (!select) throw new Error('Expected variant select to render')

    await act(async () => {
      select.value = 'gid://shopify/ProductVariant/masters-sencha-1kg'
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })

    expect(host.textContent).toContain('$88.00')
    expect(host.textContent).not.toContain('$12.00')

    await act(async () => {
      root.unmount()
    })
    host.remove()
  })
})
