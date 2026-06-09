import { cacheLife, cacheTag } from 'next/cache'

import { shopifyFetch } from '@/lib/shopify/client'
import {
  GetCollectionDocument,
  GetCollectionMenuDocument,
  GetCollectionProductsDocument,
  GetCollectionSummariesDocument,
  GetCollectionsDocument,
  ProductCollectionSortKeys,
  type Collection,
  type CollectionProductFilter,
  type CollectionProductsResult,
  type CollectionProductSummary,
  type CollectionSummary,
  type GetCollectionQuery,
  type GetCollectionMenuQuery,
  type GetCollectionProductsQuery,
  type GetCollectionSummariesQuery,
  type ProductFilter,
  type ProductSummary,
  type ProductVariant,
} from '@/lib/shopify/types'

import {
  parseProductRating,
  reshapeImage,
  reshapeMoney,
  type MoneyLike,
  type ShopifyImageLike,
} from './mappers'

const SHOPIFY_PAGE_SIZE = 250
export const COLLECTION_PRODUCT_PAGE_SIZE = 24

type ShopifyProductSummaryNode = {
  id: string
  handle: string
  title: string
  featuredImage?: ShopifyImageLike | null
  priceRange: { minVariantPrice: MoneyLike }
  ratingMetafield?: { value: string } | null
  ratingCountMetafield?: { value: string } | null
}

type ShopifyCollectionProductNode = NonNullable<
  GetCollectionProductsQuery['collection']
>['products']['edges'][number]['node']

type ShopifyCollectionProductVariantNode =
  ShopifyCollectionProductNode['variants']['edges'][number]['node']

type ShopifyCollectionProductFilterNode = NonNullable<
  GetCollectionProductsQuery['collection']
>['products']['filters'][number]

type ShopifyCollectionNode = NonNullable<GetCollectionQuery['collection']>

type ShopifyCollectionSummaryNode =
  GetCollectionSummariesQuery['collections']['edges'][number]['node']

type ShopifyCollectionMenuItem = NonNullable<
  GetCollectionMenuQuery['menu']
>['items'][number]

type ShopifyCollectionMenuResource = Extract<
  NonNullable<ShopifyCollectionMenuItem['resource']>,
  { __typename?: 'Collection' }
>

type ShopifyCollectionMenuTreeItem = {
  resource?: ShopifyCollectionMenuItem['resource'] | null
  items?: ShopifyCollectionMenuTreeItem[]
}

function textFromHtml(html: string): string {
  return removeCitationMarkers(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function removeCitationMarkers(value: string): string {
  return value.replace(/:contentReference\[[^\]]+\]\{[^}]+\}/g, ' ')
}

function looksLikeCss(value: string): boolean {
  return /\/\*|--[a-z0-9-]+:|@media|#[a-z0-9_-]+\s*\{/i.test(value)
}

function cleanCollectionDescription(
  description: string,
  descriptionHtml: string,
  seoDescription: string | null | undefined,
): string {
  const trimmedSeoDescription = seoDescription
    ? removeCitationMarkers(seoDescription).replace(/\s+/g, ' ').trim()
    : undefined
  if (trimmedSeoDescription && !looksLikeCss(trimmedSeoDescription)) {
    return trimmedSeoDescription
  }

  const trimmedDescription = removeCitationMarkers(description)
    .replace(/\s+/g, ' ')
    .trim()
  if (trimmedDescription && !looksLikeCss(trimmedDescription)) {
    return trimmedDescription
  }

  const htmlText = textFromHtml(descriptionHtml)
  if (htmlText && !looksLikeCss(htmlText)) {
    return htmlText
  }

  return ''
}

function reshapeProductSummary(
  product: ShopifyProductSummaryNode,
): ProductSummary {
  const { rating, reviewCount } = parseProductRating(product)

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
    rating,
    reviewCount,
  }
}

function reshapeCollectionProductSummary(
  product: ShopifyCollectionProductNode,
): CollectionProductSummary {
  return {
    ...reshapeProductSummary(product),
    availableForSale: product.availableForSale,
    productType: product.productType,
    tags: product.tags,
    variants: product.variants.edges.map((edge) =>
      reshapeCollectionProductVariant(edge.node),
    ),
  }
}

function reshapeCollectionProductVariant(
  variant: ShopifyCollectionProductVariantNode,
): ProductVariant {
  return {
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    currentlyNotInStock: variant.currentlyNotInStock,
    quantityAvailable: null,
    quantityRule: {
      minimum: variant.quantityRule.minimum,
      maximum: variant.quantityRule.maximum ?? null,
      increment: variant.quantityRule.increment,
    },
    price: reshapeMoney(variant.price),
    quantityPriceBreaks: [],
    image: variant.image ? reshapeImage(variant.image) : null,
  }
}

function reshapeCollectionProductFilter(
  filter: ShopifyCollectionProductFilterNode,
): CollectionProductFilter {
  return {
    id: filter.id,
    label: filter.label,
    type: filter.type,
    values: filter.values.map((value) => ({
      id: value.id,
      label: value.label,
      count: value.count,
      input: JSON.stringify(value.input),
    })),
  }
}

function reshapeCollection(collection: ShopifyCollectionNode): Collection {
  const descriptionHtml = String(collection.descriptionHtml)
  const description = cleanCollectionDescription(
    collection.description,
    descriptionHtml,
    collection.seo?.description,
  )

  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description,
    descriptionHtml,
    featuredImage: collection.image ? reshapeImage(collection.image) : null,
    updatedAt: String(collection.updatedAt),
    seo: {
      title: collection.seo?.title ?? null,
      description: collection.seo?.description ?? null,
    },
  }
}

function reshapeCollectionSummary(
  collection: ShopifyCollectionSummaryNode,
): CollectionSummary {
  const description = cleanCollectionDescription(
    collection.description,
    '',
    collection.seo?.description,
  )

  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description,
    featuredImage: collection.image ? reshapeImage(collection.image) : null,
    updatedAt: String(collection.updatedAt),
    seo: {
      title: collection.seo?.title ?? null,
      description: collection.seo?.description ?? null,
    },
  }
}

function isCollectionMenuResource(
  resource: ShopifyCollectionMenuTreeItem['resource'],
): resource is ShopifyCollectionMenuResource {
  return resource?.__typename === 'Collection'
}

function collectCollectionMenuSummaries(
  items: ShopifyCollectionMenuTreeItem[],
  collections: CollectionSummary[],
): void {
  items.forEach((item) => {
    if (isCollectionMenuResource(item.resource)) {
      collections.push(reshapeCollectionSummary(item.resource))
    }

    collectCollectionMenuSummaries(item.items ?? [], collections)
  })
}

function uniqueCollectionsByHandle(
  collections: CollectionSummary[],
): CollectionSummary[] {
  const seenHandles = new Set<string>()

  return collections.filter((collection) => {
    if (seenHandles.has(collection.handle)) return false

    seenHandles.add(collection.handle)
    return true
  })
}

async function fetchCollectionSummaries(
  first: number,
): Promise<CollectionSummary[]> {
  const collections: CollectionSummary[] = []
  let after: string | null | undefined
  let hasNextPage = true

  while (hasNextPage) {
    const data = await shopifyFetch({
      query: GetCollectionSummariesDocument,
      variables: { first, after },
    })

    collections.push(
      ...data.collections.edges.map((edge) =>
        reshapeCollectionSummary(edge.node),
      ),
    )
    hasNextPage = data.collections.pageInfo.hasNextPage
    after = data.collections.pageInfo.endCursor
  }

  return collections
}

export async function getCollection(
  handle: string,
): Promise<Collection | null> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  const data = await shopifyFetch({
    query: GetCollectionDocument,
    variables: { handle },
  })

  return data.collection ? reshapeCollection(data.collection) : null
}

export async function getCollections(
  first = SHOPIFY_PAGE_SIZE,
): Promise<string[]> {
  'use cache'
  cacheTag('collections')
  cacheLife('days')

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

export async function getCollectionSummaries(
  first = SHOPIFY_PAGE_SIZE,
): Promise<CollectionSummary[]> {
  'use cache'
  cacheTag('collections')
  cacheLife('days')

  return fetchCollectionSummaries(first)
}

export async function getCollectionMenuSummaries(
  handle: string,
): Promise<CollectionSummary[]> {
  'use cache'
  cacheTag('collections', `collection-menu-${handle}`)
  cacheLife('days')

  const data = await shopifyFetch({
    query: GetCollectionMenuDocument,
    variables: { handle },
  })

  if (!data.menu) return []

  const collections: CollectionSummary[] = []
  collectCollectionMenuSummaries(data.menu.items, collections)

  return uniqueCollectionsByHandle(collections)
}

export async function getCollectionProducts(
  handle: string,
  first = COLLECTION_PRODUCT_PAGE_SIZE,
  sortKey = ProductCollectionSortKeys.CollectionDefault,
  reverse = false,
): Promise<ProductSummary[]> {
  const result = await getCollectionProductsWithFilters(
    handle,
    first,
    sortKey,
    reverse,
  )

  return result.products
}

export async function getCollectionProductsWithFilters(
  handle: string,
  first = COLLECTION_PRODUCT_PAGE_SIZE,
  sortKey = ProductCollectionSortKeys.CollectionDefault,
  reverse = false,
  filters: ProductFilter[] = [],
  after?: string | null,
): Promise<CollectionProductsResult> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  const data = await shopifyFetch({
    query: GetCollectionProductsDocument,
    variables: { handle, first, after, sortKey, reverse, filters },
  })

  if (!data.collection) {
    return {
      products: [],
      filters: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    }
  }

  const products = data.collection.products.edges.map((edge) =>
    reshapeCollectionProductSummary(edge.node),
  )
  const productFilters = data.collection.products.filters.map(
    reshapeCollectionProductFilter,
  )

  return {
    products,
    filters: productFilters,
    pageInfo: {
      hasNextPage: data.collection.products.pageInfo.hasNextPage,
      endCursor: data.collection.products.pageInfo.endCursor ?? null,
    },
  }
}
