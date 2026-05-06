import { cacheLife, cacheTag } from 'next/cache'

import { shopifyFetch } from '@/lib/shopify/client'
import {
  GetCollectionDocument,
  GetCollectionProductsDocument,
  GetCollectionSummariesDocument,
  GetCollectionsDocument,
  ProductCollectionSortKeys,
  type Collection,
  type CollectionSummary,
  type GetCollectionQuery,
  type GetCollectionSummariesQuery,
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

type ShopifyCollectionNode = NonNullable<GetCollectionQuery['collection']>

type ShopifyCollectionSummaryNode =
  GetCollectionSummariesQuery['collections']['edges'][number]['node']

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

function textFromHtml(html: string): string {
  return html
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

function looksLikeCss(value: string): boolean {
  return /\/\*|--[a-z0-9-]+:|@media|#[a-z0-9_-]+\s*\{/i.test(value)
}

function cleanCollectionDescription(
  description: string,
  descriptionHtml: string,
  seoDescription: string | null | undefined,
): string {
  const trimmedSeoDescription = seoDescription?.replace(/\s+/g, ' ').trim()
  if (trimmedSeoDescription && !looksLikeCss(trimmedSeoDescription)) {
    return trimmedSeoDescription
  }

  const trimmedDescription = description.replace(/\s+/g, ' ').trim()
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

export async function getCollectionProducts(
  handle: string,
  first = SHOPIFY_PAGE_SIZE,
  sortKey = ProductCollectionSortKeys.CollectionDefault,
  reverse = false,
): Promise<ProductSummary[]> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

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
