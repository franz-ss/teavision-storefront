import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  Collection,
  CollectionProductsResult,
  CollectionSummary,
} from '@/lib/shopify/types'

import { PageContent } from './page-content'

const shopifyMocks = vi.hoisted(() => ({
  getCollection: vi.fn<() => Promise<Collection | null>>(),
  getCollectionProductsWithFilters:
    vi.fn<() => Promise<CollectionProductsResult>>(),
  getCollectionSummaries: vi.fn<() => Promise<CollectionSummary[]>>(),
}))

vi.mock('server-only', () => ({}))

vi.mock('@/lib/shopify/operations/collection', () => ({
  COLLECTION_PRODUCT_PAGE_SIZE: 24,
  getCollection: shopifyMocks.getCollection,
  getCollectionProductsWithFilters:
    shopifyMocks.getCollectionProductsWithFilters,
  getCollectionSummaries: shopifyMocks.getCollectionSummaries,
}))

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('notFound')
  },
  usePathname: () => '/collections/bulk-tea-bags',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

const richHeroHtml = `
<section class="bulk-header">
  <h1>Ready-Made Bulk Tea Bags for Cafes, Hotels &amp; Retail</h1>
  <p>Teavision's most-loved blends in convenient <strong>biodegradable pyramid tea bags</strong>.</p>
  <img src="https://cdn.shopify.com/s/files/1/0786/8339/files/TeaVision-14_1.jpg?v=1761279097" alt="Teavision Bulk Tea Bags">
  <div>
    <a href="https://cdn.shopify.com/s/files/1/0786/8339/files/Teavision_Tea_Bag_Catalogue_1.pdf?v=1640138688">View our Tea Bag Manufacturing Catalogue</a>
    <a href="mailto:info@teavision.com.au?subject=Custom%20Tea%20Bag%20Enquiry">Speak to Our Team About Custom Tea Bags</a>
  </div>
  <a href="https://www.teavision.com.au/collections/all">Create Your Own White Label Tea Bag</a>
  <p>Minimum Order Quantity: <strong>6,000 Tea Bags Per Blend</strong></p>
</section>
`

function collectionFixture(overrides: Partial<Collection> = {}): Collection {
  return {
    id: 'gid://shopify/Collection/test',
    handle: 'bulk-tea-bags',
    title: 'Bulk Tea Bags',
    description: 'Bulk Tea Bags',
    descriptionHtml: '',
    featuredImage: null,
    updatedAt: '2026-06-11T00:00:00Z',
    seo: { title: null, description: null },
    ...overrides,
  }
}

function emptyProductsResult(): CollectionProductsResult {
  return {
    filters: [],
    pageInfo: { endCursor: null, hasNextPage: false },
    products: [],
  }
}

describe('PageContent collection rich hero rendering', () => {
  beforeEach(() => {
    shopifyMocks.getCollectionProductsWithFilters.mockResolvedValue(
      emptyProductsResult(),
    )
    shopifyMocks.getCollectionSummaries.mockResolvedValue([])
  })

  it('renders the strict rich hero block when Shopify description opts in', async () => {
    shopifyMocks.getCollection.mockResolvedValue(
      collectionFixture({
        description: 'Ready-Made Bulk Tea Bags',
        descriptionHtml: richHeroHtml,
      }),
    )

    const element = await PageContent({
      params: Promise.resolve({ handle: 'bulk-tea-bags' }),
      searchParams: Promise.resolve({}),
    })
    const html = renderToStaticMarkup(element)

    expect(html).toContain('data-testid="collection-rich-hero"')
    expect(html).toContain('Ready-Made Bulk Tea Bags for Cafes')
    expect(html).toContain('View our Tea Bag Manufacturing Catalogue')
    expect(html).toContain('Minimum Order Quantity: 6,000 Tea Bags Per Blend')
    expect(html).not.toContain('Read more about Bulk Tea Bags')
  })

  it('keeps the existing hero path for normal collection descriptions', async () => {
    shopifyMocks.getCollection.mockResolvedValue(
      collectionFixture({
        handle: 'wholesale-bulk-tea',
        title: 'Wholesale Bulk Tea',
        description: 'Browse loose leaf teas.',
        descriptionHtml:
          '<h2>Wholesale Bulk Tea</h2><p>Browse loose leaf teas.</p><ul><li>Black tea</li></ul>',
      }),
    )

    const element = await PageContent({
      params: Promise.resolve({ handle: 'wholesale-bulk-tea' }),
      searchParams: Promise.resolve({}),
    })
    const html = renderToStaticMarkup(element)

    expect(html).not.toContain('data-testid="collection-rich-hero"')
    expect(html).toContain('Wholesale collection')
  })
})
