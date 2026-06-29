import type { Mock } from 'vitest'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { shopifyFetch } from '@/lib/shopify/client'

import { getProduct } from './product'

vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}))

vi.mock('@/lib/shopify/client', () => ({
  shopifyFetch: vi.fn(),
}))

type ShopifyFetchCall = {
  query: unknown
  variables?: unknown
}

type ShopifyFetchMock = Mock<(options: ShopifyFetchCall) => Promise<unknown>>

const shopifyFetchMock = shopifyFetch as unknown as ShopifyFetchMock
const fetchMock = vi.fn() as Mock<typeof fetch>

function makeShopifyProductPayload() {
  return {
    product: {
      id: 'gid://shopify/Product/7087161278551',
      handle: '2003y-mini-ripe-pu-erh-tea-brick-250g-box',
      title: '2003Y Mini Ripe Pu-erh Tea Brick (250g/box)',
      description: '',
      descriptionHtml: '',
      tags: [],
      collections: { nodes: [] },
      images: { edges: [] },
      priceRange: {
        minVariantPrice: { amount: '40.65', currencyCode: 'AUD' },
      },
      options: [{ name: 'Title', values: ['Default Title'] }],
      ratingMetafield: null,
      ratingCountMetafield: null,
      bulkPricingTiersMetafield: null,
      variants: {
        pageInfo: { hasNextPage: false, endCursor: null },
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/41503540936791',
              title: 'Default Title',
              availableForSale: true,
              currentlyNotInStock: false,
              quantityRule: { minimum: 1, maximum: 100, increment: 1 },
              image: null,
              price: { amount: '40.65', currencyCode: 'AUD' },
              quantityPriceBreaks: { nodes: [] },
            },
          },
        ],
      },
    },
  }
}

describe('Shopify product operations', () => {
  beforeEach(() => {
    shopifyFetchMock.mockReset()
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  test('falls back to HulkApps volume tiers from eligible offers', async () => {
    shopifyFetchMock.mockResolvedValueOnce(makeShopifyProductPayload())
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          eligible_offer: {
            main_offer_type: 'volume',
            discount_type: 'each_qty',
            offer_levels: JSON.stringify([
              ['5', '5', '% Off', '', '0'],
              ['10', '10', '% Off', '', '0'],
              ['20', '12', '% Off', '', '0'],
              ['40', '15', '% Off', '', '0'],
            ]),
          },
        }),
        { status: 200 },
      ),
    )

    await expect(
      getProduct('2003y-mini-ripe-pu-erh-tea-brick-250g-box'),
    ).resolves.toMatchObject({
      bulkPricingTiers: [
        { minimumQuantity: 5, discountPercent: 5 },
        { minimumQuantity: 10, discountPercent: 10 },
        { minimumQuantity: 20, discountPercent: 12 },
        { minimumQuantity: 40, discountPercent: 15 },
      ],
    })
  })
})
