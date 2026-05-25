import { cacheLife, cacheTag } from 'next/cache'

import { shopifyFetch } from '@/lib/shopify/client'
import {
  GetProductDocument,
  GetProductRecommendationsDocument,
  GetProductsDocument,
  GetProductVariantsDocument,
  ProductRecommendationIntent,
  type GetProductQuery,
  type GetProductVariantsQuery,
  type Money,
  type Product,
  type ProductOption,
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

type ShopifyProductNode = NonNullable<GetProductQuery['product']>

type ShopifyVariantNode = NonNullable<
  GetProductVariantsQuery['product']
>['variants']['edges'][number]['node']

type ShopifyProductSummaryNode = {
  id: string
  handle: string
  title: string
  featuredImage?: ShopifyImageLike | null
  priceRange: { minVariantPrice: MoneyLike }
  ratingMetafield?: { value: string } | null
  ratingCountMetafield?: { value: string } | null
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

function parseProductRating(product: ShopifyProductSummaryNode): {
  rating?: number
  reviewCount?: number
} {
  let rating: number | undefined
  let reviewCount: number | undefined

  if (product.ratingMetafield?.value) {
    try {
      const parsed: unknown = JSON.parse(product.ratingMetafield.value)
      const value =
        typeof parsed === 'object' && parsed !== null && 'value' in parsed
          ? parsed.value
          : undefined
      const nextRating = parseFloat(typeof value === 'string' ? value : '')
      if (!Number.isNaN(nextRating)) rating = nextRating
    } catch {
      // Rating metafields are optional and can be malformed in Shopify.
    }
  }

  if (product.ratingCountMetafield?.value) {
    const nextReviewCount = parseInt(product.ratingCountMetafield.value, 10)
    if (!Number.isNaN(nextReviewCount)) reviewCount = nextReviewCount
  }

  return { rating, reviewCount }
}

function reshapeVariant(
  variant: ShopifyVariantNode,
): Product['variants'][number] {
  return {
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    price: reshapeMoney(variant.price),
    image: variant.image ? reshapeImage(variant.image) : null,
  }
}

function reshapeProduct(
  p: ShopifyProductNode,
  variants: ShopifyVariantNode[],
): Product {
  // SPR rating metafield stores a JSON object: { "value": "4.8", "scale_min": "1.0", "scale_max": "5.0" }
  let rating: number | undefined
  let reviewCount: number | undefined
  if (p.ratingMetafield?.value) {
    try {
      const parsed = JSON.parse(p.ratingMetafield.value) as { value?: unknown }
      const n = parseFloat(typeof parsed.value === 'string' ? parsed.value : '')
      if (!isNaN(n)) rating = n
    } catch {
      // metafield not present or malformed — leave undefined
    }
  }
  if (p.ratingCountMetafield?.value) {
    const n = parseInt(p.ratingCountMetafield.value, 10)
    if (!isNaN(n)) reviewCount = n
  }

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: String(p.descriptionHtml),
    tags: [...p.tags],
    images: p.images.edges.map((e) => reshapeImage(e.node)),
    priceRange: {
      minVariantPrice: reshapeMoney(p.priceRange.minVariantPrice),
    },
    options: p.options.map<ProductOption>((option) => ({
      name: option.name,
      values: [...option.values],
    })),
    variants: variants.map(reshapeVariant),
    rating,
    reviewCount,
  }
}

function reshapeProductSummary(p: ShopifyProductSummaryNode): ProductSummary {
  const { rating, reviewCount } = parseProductRating(p)

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    featuredImage: p.featuredImage ? reshapeImage(p.featuredImage) : null,
    priceRange: {
      minVariantPrice: reshapeMoney(p.priceRange.minVariantPrice),
    },
    rating,
    reviewCount,
  }
}

async function getProductVariantNodes(
  handle: string,
  firstPage: ShopifyProductNode['variants'],
): Promise<ShopifyVariantNode[]> {
  const variants = firstPage.edges.map((edge) => edge.node)
  let pageInfo = firstPage.pageInfo

  while (pageInfo.hasNextPage && pageInfo.endCursor) {
    const data = await shopifyFetch({
      query: GetProductVariantsDocument,
      variables: {
        handle,
        first: SHOPIFY_PAGE_SIZE,
        after: pageInfo.endCursor,
      },
    })

    const nextPage = data.product?.variants
    if (!nextPage) break

    variants.push(...nextPage.edges.map((edge) => edge.node))
    pageInfo = nextPage.pageInfo
  }

  return variants
}

async function fetchProductSummaryPages(
  limit?: number,
): Promise<ProductSummary[]> {
  const products: ProductSummary[] = []
  let after: string | null | undefined
  let hasNextPage = true

  while (hasNextPage && (limit === undefined || products.length < limit)) {
    const pageSize =
      limit === undefined
        ? SHOPIFY_PAGE_SIZE
        : Math.min(SHOPIFY_PAGE_SIZE, limit - products.length)

    const data = await shopifyFetch({
      query: GetProductsDocument,
      variables: { first: pageSize, after },
    })

    products.push(
      ...data.products.edges.map((edge) => reshapeProductSummary(edge.node)),
    )
    hasNextPage = data.products.pageInfo.hasNextPage
    after = data.products.pageInfo.endCursor
  }

  return products
}

export async function getProduct(handle: string): Promise<Product | null> {
  'use cache'
  cacheTag('product', `product-${handle}`)
  cacheLife('hours')

  const data = await shopifyFetch({
    query: GetProductDocument,
    variables: {
      handle,
      variantFirst: SHOPIFY_PAGE_SIZE,
      variantAfter: null,
    },
  })

  if (!data.product) return null

  const variants = await getProductVariantNodes(handle, data.product.variants)

  return reshapeProduct(data.product, variants)
}

export async function getProducts(first = 24): Promise<ProductSummary[]> {
  'use cache'
  cacheTag('product')
  cacheLife('hours')

  return fetchProductSummaryPages(first)
}

export async function getAllProducts(): Promise<ProductSummary[]> {
  'use cache'
  cacheTag('product')
  cacheLife('hours')

  return fetchProductSummaryPages()
}

export async function getProductRecommendations(
  productId: string,
  intent: 'RELATED' | 'COMPLEMENTARY' = 'RELATED',
): Promise<ProductSummary[]> {
  'use cache'
  cacheTag('product', `product-recommendations-${productId}`)
  cacheLife('hours')

  const recommendationIntent =
    intent === 'RELATED'
      ? ProductRecommendationIntent.Related
      : ProductRecommendationIntent.Complementary

  const data = await shopifyFetch({
    query: GetProductRecommendationsDocument,
    variables: { productId, intent: recommendationIntent },
  })

  return (data.productRecommendations ?? []).map(reshapeProductSummary)
}
