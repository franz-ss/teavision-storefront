import { cacheLife, cacheTag } from 'next/cache'

import { shopifyFetch } from '@/lib/shopify/client'
import {
  GetCollectionDocument,
  GetCollectionProductsDocument,
  GetCollectionsDocument,
  ProductCollectionSortKeys,
  type Collection,
  type Money,
  type ProductSummary,
  type ShopifyImage,
} from '@/lib/shopify/types'

const SHOPIFY_PAGE_SIZE = 250

type MoneyLike = {
  amount: unknown
  currencyCode: string
}

type ShopifyImageLike = {
  url: unknown
  altText?: string | null
  width?: number | null
  height?: number | null
}

type ShopifyProductSummaryNode = {
  id: string
  handle: string
  title: string
  featuredImage?: ShopifyImageLike | null
  priceRange: { minVariantPrice: MoneyLike }
}

function reshapeMoney(money: MoneyLike): Money {
  return {
    amount: String(money.amount),
    currencyCode: String(money.currencyCode),
  }
}

function reshapeImage(image: ShopifyImageLike): ShopifyImage {
  return {
    url: String(image.url),
    altText: image.altText ?? null,
    width: image.width ?? null,
    height: image.height ?? null,
  }
}

function reshapeProductSummary(
  product: ShopifyProductSummaryNode,
): ProductSummary {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    featuredImage: product.featuredImage
      ? reshapeImage(product.featuredImage)
      : null,
    priceRange: {
      minVariantPrice: reshapeMoney(product.priceRange.minVariantPrice),
    },
  }
}

const STUB_COLLECTION: Collection = {
  handle: 'black-tea',
  title: 'Black Tea',
  description:
    'Premium black teas sourced from Assam, Darjeeling, and Sri Lanka.',
}

const STUB_PRODUCTS: ProductSummary[] = Array.from({ length: 8 }, (_, i) => ({
  id: `gid://shopify/Product/${i + 1}`,
  handle: `product-placeholder-${i + 1}`,
  title: `Product Placeholder ${i + 1}`,
  featuredImage: null,
  priceRange: {
    minVariantPrice: { amount: '0.00', currencyCode: 'AUD' },
  },
}))

export async function getCollection(
  handle: string,
): Promise<Collection | null> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return { ...STUB_COLLECTION, handle }
  }

  const data = await shopifyFetch({
    query: GetCollectionDocument,
    variables: { handle },
  })

  return data.collection
    ? {
        handle: data.collection.handle,
        title: data.collection.title,
        description: data.collection.description,
      }
    : null
}

export async function getCollections(
  first = SHOPIFY_PAGE_SIZE,
): Promise<string[]> {
  'use cache'
  cacheTag('collections')
  cacheLife('days')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return ['all', 'tea', 'herbs-spices']
  }

  const handles: string[] = []
  let after: string | null | undefined
  let hasNextPage = true

  while (hasNextPage) {
    const data = await shopifyFetch({
      query: GetCollectionsDocument,
      variables: { first, after },
    })

    handles.push(...data.collections.edges.map((edge) => edge.node.handle))
    hasNextPage = data.collections.pageInfo.hasNextPage
    after = data.collections.pageInfo.endCursor
  }

  return handles
}

export async function getCollectionProducts(
  handle: string,
  first = SHOPIFY_PAGE_SIZE,
  sortKey = ProductCollectionSortKeys.CollectionDefault,
  reverse = false,
): Promise<ProductSummary[]> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_PRODUCTS
  }

  const products: ProductSummary[] = []
  let after: string | null | undefined
  let hasNextPage = true

  while (hasNextPage) {
    const data = await shopifyFetch({
      query: GetCollectionProductsDocument,
      variables: { handle, first, after, sortKey, reverse },
    })

    if (!data.collection) return []

    products.push(
      ...data.collection.products.edges.map((edge) =>
        reshapeProductSummary(edge.node),
      ),
    )
    hasNextPage = data.collection.products.pageInfo.hasNextPage
    after = data.collection.products.pageInfo.endCursor
  }

  return products
}
