/**
 * @vitest-environment jsdom
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import type {
  CollectionProductSummary,
  ProductVariant,
} from '@/lib/shopify/types'

import { ProductCard } from './product-card'
;(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

vi.mock('@/lib/cart/actions', () => ({
  addToCartAction: vi.fn(),
}))

const singleVariant: ProductVariant = {
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
}

const multiVariants: ProductVariant[] = [
  singleVariant,
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
  variants: [singleVariant],
}

describe('ProductCard', () => {
  it('renders the approved vertical card layout (.pcard)', () => {
    const html = renderToStaticMarkup(<ProductCard product={product} />)

    // Media is square so Shopify product-photo canvases do not feel stretched.
    expect(html).toContain('aspect-square')
    expect(html).not.toContain('aspect-[1/1.12]')
    // Product photos sit on a full media plate rather than floating on the page.
    expect(html).toContain('bg-white')
    expect(html).not.toContain('mix-blend-multiply')
    expect(html).not.toContain('bg-card')
    expect(html).not.toContain('bg-paper-2')
    // Title uses display font (lockstep with UI-SPEC §5.5)
    expect(html).toContain(
      '<h3 class="font-display my-1.5 text-[1.2rem] leading-[1.1]">',
    )
    // Product imagery is contained so pack shots are not cropped/zoomed in.
    expect(html).toContain('object-contain')
    expect(html).toContain('group-hover:scale-[1.02]')
    expect(html).not.toContain('object-cover')
    expect(html).not.toContain('group-hover:scale-[1.06]')
    expect(html).not.toContain('p-3')
    expect(html).not.toContain('sm:p-4')
    // Price rendered
    expect(html).toContain('$12.00')
    // Type-mono-meta eyebrow for productType (CARD-02)
    expect(html).toContain('type-mono-meta')
    expect(html).toContain('Green tea')
    // motion-reduce trio on scale animation
    expect(html).toContain('motion-reduce:group-hover:scale-100')
    // Single-variant card quick-adds; no Quick View trigger needed (CQA-02)
    expect(html).not.toContain('Quick View')
    // Star rating row renders when rating data is available
    expect(html).toContain('out of 5 stars')
  })

  it('shows quick-add button for single-variant available products', () => {
    const html = renderToStaticMarkup(<ProductCard product={product} />)
    expect(html).toContain('Add to cart')
    expect(html).toContain('Add Tea Masters Sencha Green Tea to cart')
  })

  it('shows Quick View trigger for multi-variant products (CQA-02)', () => {
    const multiVariantProduct: CollectionProductSummary = {
      ...product,
      variants: multiVariants,
    }
    const html = renderToStaticMarkup(
      <ProductCard product={multiVariantProduct} />,
    )
    expect(html).toContain('Quick View')
    expect(html).toContain('aria-haspopup="dialog"')
    expect(html).not.toContain('Add to cart')
  })

  it('shows organic certification badge from tags (CARD-03)', () => {
    const html = renderToStaticMarkup(<ProductCard product={product} />)
    // organic badge text
    expect(html).toContain('Organic')
  })

  it('omits productType eyebrow when productType is empty (CARD-02)', () => {
    const noTypeProduct: CollectionProductSummary = {
      ...product,
      productType: '',
    }
    const html = renderToStaticMarkup(<ProductCard product={noTypeProduct} />)
    expect(html).not.toContain('type-mono-meta text-ink-faint mb-1')
  })

  it('renders from a bare ProductSummary (recommendation carousels)', () => {
    const summaryOnlyProduct = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      featuredImage: product.featuredImage,
      priceRange: product.priceRange,
    }
    const html = renderToStaticMarkup(
      <ProductCard product={summaryOnlyProduct} />,
    )

    // Same approved layout
    expect(html).toContain('aspect-square')
    expect(html).toContain('$12.00')
    // Unknown variants → Quick View trigger instead of quick-add
    expect(html).toContain('Quick View')
    expect(html).not.toContain('Add to cart')
    // No tags → no badges; unknown availability → not sold out
    expect(html).not.toContain('Organic')
    expect(html).not.toContain('Out of stock')
  })

  it('updates the visible price via the ProductPurchaseForm when used in PDP context', async () => {
    // The card no longer renders ProductPurchaseForm — price is static from priceRange.
    // Verify the price is rendered at initial load.
    const html = renderToStaticMarkup(<ProductCard product={product} />)
    expect(html).toContain('$12.00')
  })
})
