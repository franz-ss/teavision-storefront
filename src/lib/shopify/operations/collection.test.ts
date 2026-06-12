import type { Mock } from 'vitest'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { shopifyFetch } from '@/lib/shopify/client'
import {
  GetCollectionCursorIndexDocument,
  GetCollectionProductsDocument,
  ProductCollectionSortKeys,
} from '@/lib/shopify/types'

import {
  COLLECTION_PRODUCT_PAGE_SIZE,
  getCollectionPageIndex,
  getCollectionProductsPage,
} from './collection'

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

function makeCursorPayload({
  cursors,
  endCursor,
  hasNextPage,
}: {
  cursors: string[]
  endCursor: string | null
  hasNextPage: boolean
}) {
  return {
    collection: {
      products: {
        edges: cursors.map((cursor) => ({ cursor })),
        pageInfo: { endCursor, hasNextPage },
      },
    },
  }
}

function makeProductsPayload(productHandles: string[]) {
  return {
    collection: {
      products: {
        filters: [],
        pageInfo: {
          endCursor: productHandles.at(-1) ?? null,
          hasNextPage: false,
        },
        edges: productHandles.map((handle, index) => ({
          node: {
            id: `gid://shopify/Product/${index + 1}`,
            handle,
            title: `Test Product ${index + 1}`,
            availableForSale: true,
            productType: 'Tea',
            tags: [],
            featuredImage: null,
            priceRange: {
              minVariantPrice: {
                amount: '12.00',
                currencyCode: 'AUD',
              },
            },
            ratingMetafield: null,
            ratingCountMetafield: null,
            variants: {
              edges: [
                {
                  node: {
                    id: `gid://shopify/ProductVariant/${index + 1}`,
                    title: 'Default Title',
                    availableForSale: true,
                    currentlyNotInStock: false,
                    quantityRule: {
                      minimum: 1,
                      maximum: null,
                      increment: 1,
                    },
                    price: {
                      amount: '12.00',
                      currencyCode: 'AUD',
                    },
                    image: null,
                  },
                },
              ],
            },
          },
        })),
      },
    },
  }
}

describe('Shopify collection pagination operations', () => {
  beforeEach(() => {
    shopifyFetchMock.mockReset()
  })

  test('getCollectionPageIndex chunks cursor-only requests and computes true totals', async () => {
    const firstChunk = Array.from(
      { length: 250 },
      (_, index) => `cursor-${index + 1}`,
    )
    const secondChunk = Array.from(
      { length: 13 },
      (_, index) => `cursor-${index + 251}`,
    )
    shopifyFetchMock
      .mockResolvedValueOnce(
        makeCursorPayload({
          cursors: firstChunk,
          endCursor: 'cursor-250',
          hasNextPage: true,
        }),
      )
      .mockResolvedValueOnce(
        makeCursorPayload({
          cursors: secondChunk,
          endCursor: 'cursor-263',
          hasNextPage: false,
        }),
      )

    await expect(getCollectionPageIndex('all')).resolves.toMatchObject({
      totalCount: 263,
      totalPages: 11,
    })

    expect(shopifyFetchMock).toHaveBeenCalledTimes(2)
    expect(shopifyFetchMock).toHaveBeenNthCalledWith(1, {
      query: GetCollectionCursorIndexDocument,
      variables: {
        handle: 'all',
        first: 250,
        after: undefined,
        sortKey: ProductCollectionSortKeys.CollectionDefault,
        reverse: false,
        filters: [],
      },
    })
    expect(shopifyFetchMock).toHaveBeenNthCalledWith(2, {
      query: GetCollectionCursorIndexDocument,
      variables: {
        handle: 'all',
        first: 250,
        after: 'cursor-250',
        sortKey: ProductCollectionSortKeys.CollectionDefault,
        reverse: false,
        filters: [],
      },
    })
  })

  test('getCollectionProductsPage fetches page 1 with one bounded product payload query', async () => {
    shopifyFetchMock.mockResolvedValueOnce(makeProductsPayload(['first-tea']))

    await expect(getCollectionProductsPage('all', 1)).resolves.toMatchObject({
      products: [{ handle: 'first-tea' }],
    })

    expect(shopifyFetchMock).toHaveBeenCalledTimes(1)
    expect(shopifyFetchMock).toHaveBeenCalledWith({
      query: GetCollectionProductsDocument,
      variables: {
        handle: 'all',
        first: COLLECTION_PRODUCT_PAGE_SIZE,
        after: null,
        sortKey: ProductCollectionSortKeys.CollectionDefault,
        reverse: false,
        filters: [],
      },
    })
  })

  test('getCollectionProductsPage resolves page N from cursor index before one bounded product query', async () => {
    const cursors = Array.from(
      { length: 72 },
      (_, index) => `cursor-${index + 1}`,
    )
    shopifyFetchMock
      .mockResolvedValueOnce(
        makeCursorPayload({
          cursors,
          endCursor: 'cursor-72',
          hasNextPage: false,
        }),
      )
      .mockResolvedValueOnce(makeProductsPayload(['page-three-tea']))

    await expect(getCollectionProductsPage('all', 3)).resolves.toMatchObject({
      products: [{ handle: 'page-three-tea' }],
    })

    expect(shopifyFetchMock).toHaveBeenCalledTimes(2)
    expect(shopifyFetchMock).toHaveBeenNthCalledWith(1, {
      query: GetCollectionCursorIndexDocument,
      variables: {
        handle: 'all',
        first: 250,
        after: undefined,
        sortKey: ProductCollectionSortKeys.CollectionDefault,
        reverse: false,
        filters: [],
      },
    })
    expect(shopifyFetchMock).toHaveBeenNthCalledWith(2, {
      query: GetCollectionProductsDocument,
      variables: {
        handle: 'all',
        first: COLLECTION_PRODUCT_PAGE_SIZE,
        after: 'cursor-48',
        sortKey: ProductCollectionSortKeys.CollectionDefault,
        reverse: false,
        filters: [],
      },
    })
  })
})
