import { cacheLife, cacheTag } from 'next/cache'
import { shopifyFetch } from '@/lib/shopify/client'
import type {
  Collection,
  Money,
  ProductSummary,
  ShopifyImage,
} from '@/lib/shopify/types'

const GET_COLLECTION_QUERY = /* GraphQL */ `
  query GetCollection($handle: String!) {
    collection(handle: $handle) {
      handle
      title
      description
    }
  }
`

const GET_COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  query GetCollectionProducts($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            id
            handle
            title
            featuredImage {
              url
              altText
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`

type ShopifyCollectionNode = {
  handle: string
  title: string
  description: string
}

type ShopifyProductSummaryNode = {
  id: string
  handle: string
  title: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
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

  const data = await shopifyFetch<{
    collection: ShopifyCollectionNode | null
  }>({
    query: GET_COLLECTION_QUERY,
    variables: { handle },
  })

  return data.collection
}

export async function getCollectionProducts(
  handle: string,
  first = 24,
  sortKey = 'COLLECTION_DEFAULT',
  reverse = false,
): Promise<ProductSummary[]> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_PRODUCTS
  }

  const data = await shopifyFetch<{
    collection: {
      products: { edges: Array<{ node: ShopifyProductSummaryNode }> }
    } | null
  }>({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first, sortKey, reverse },
  })

  if (!data.collection) return []

  return data.collection.products.edges.map((e) => ({
    id: e.node.id,
    handle: e.node.handle,
    title: e.node.title,
    featuredImage: e.node.featuredImage,
    priceRange: e.node.priceRange,
  }))
}
