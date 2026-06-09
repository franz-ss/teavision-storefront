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
  type BulkPricingTier,
  type Money,
  type Product,
  type ProductOption,
  type ProductSummary,
} from '@/lib/shopify/types'

import {
  parseProductRating,
  reshapeImage,
  reshapeMoney,
  type MoneyLike,
  type ShopifyImageLike,
} from './mappers'

const SHOPIFY_PAGE_SIZE = 250
const HULK_VOLUME_DISCOUNT_ENDPOINT =
  'https://volumediscount.hulkapps.com/api/v2/shop/get_offer_table'
const HULK_PERCENT_DISCOUNT_TYPE = '% Off'
const HULK_VOLUME_DISCOUNT_STORE_ID =
  process.env.HULK_VOLUME_DISCOUNT_STORE_ID ?? 'mrteashop-com.myshopify.com'
export const PRODUCT_DETAIL_CACHE_VERSION = 'bulk-pricing-v2'

type ShopifyProductNode = NonNullable<GetProductQuery['product']>

type ShopifyVariantNode = NonNullable<
  GetProductVariantsQuery['product']
>['variants']['edges'][number]['node']

type LegacyVariantInventory = {
  quantityAvailable: number
}

type LegacyBulkPricingResult = {
  tiers: BulkPricingTier[]
  degraded: boolean
}

type ShopifyProductSummaryNode = {
  id: string
  handle: string
  title: string
  updatedAt?: string
  featuredImage?: ShopifyImageLike | null
  priceRange: { minVariantPrice: MoneyLike }
  ratingMetafield?: { value: string } | null
  ratingCountMetafield?: { value: string } | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getNumericShopifyId(gid: string): string | null {
  const parts = gid.split('/')
  const value = parts[parts.length - 1]

  return value && /^\d+$/.test(value) ? value : null
}

function formatPercentLabel(value: number): string {
  if (Number.isInteger(value)) return String(value)

  return value.toFixed(2).replace(/\.?0+$/, '')
}

function readNumberField(
  record: Record<string, unknown>,
  keys: string[],
): number | null {
  for (const key of keys) {
    const value = record[key]
    const numericValue =
      typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Number.parseFloat(value)
          : NaN

    if (Number.isFinite(numericValue)) return numericValue
  }

  return null
}

function readStringField(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }

  return undefined
}

function parseTierMoney(
  value: unknown,
  fallbackCurrencyCode: string,
): Money | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return {
      amount: value.toFixed(2),
      currencyCode: fallbackCurrencyCode,
    }
  }

  if (typeof value === 'string') {
    const amount = Number.parseFloat(value)
    if (!Number.isFinite(amount)) return undefined

    return {
      amount: amount.toFixed(2),
      currencyCode: fallbackCurrencyCode,
    }
  }

  if (!isRecord(value)) return undefined

  const amountValue = value.amount
  const amount =
    typeof amountValue === 'number'
      ? amountValue
      : typeof amountValue === 'string'
        ? Number.parseFloat(amountValue)
        : NaN

  if (!Number.isFinite(amount)) return undefined

  const currencyCode =
    typeof value.currencyCode === 'string' && value.currencyCode.length > 0
      ? value.currencyCode
      : fallbackCurrencyCode

  return {
    amount: amount.toFixed(2),
    currencyCode,
  }
}

function parseBulkPricingTier(
  value: unknown,
  fallbackCurrencyCode: string,
): BulkPricingTier | null {
  if (!isRecord(value)) return null

  const minimumQuantity = readNumberField(value, [
    'minimumQuantity',
    'minQuantity',
    'min',
    'quantity',
  ])
  if (minimumQuantity === null || minimumQuantity < 1) return null

  const discountPercent = readNumberField(value, [
    'discountPercent',
    'percentOff',
    'discount',
  ])
  const price = parseTierMoney(value.price, fallbackCurrencyCode)
  const label = readStringField(value, ['label', 'title'])

  if (!price && discountPercent === null) return null

  return {
    minimumQuantity: Math.floor(minimumQuantity),
    ...(price && { price }),
    ...(discountPercent !== null && { discountPercent }),
    ...(label && { label }),
  }
}

export function parseBulkPricingTiers(
  value: string | null | undefined,
  fallbackCurrencyCode: string,
): BulkPricingTier[] {
  if (!value) return []

  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((tier) => parseBulkPricingTier(tier, fallbackCurrencyCode))
      .filter((tier): tier is BulkPricingTier => tier !== null)
      .sort((a, b) => a.minimumQuantity - b.minimumQuantity)
  } catch {
    return []
  }
}

function parseHulkOfferLevel(level: unknown): BulkPricingTier | null {
  if (!Array.isArray(level) || level.length < 3) return null

  const minimumQuantityValue = level[0]
  const discountValue = level[1]
  const discountType = level[2]

  if (
    typeof discountType !== 'string' ||
    discountType.trim() !== HULK_PERCENT_DISCOUNT_TYPE
  ) {
    return null
  }

  const minimumQuantity =
    typeof minimumQuantityValue === 'number'
      ? minimumQuantityValue
      : typeof minimumQuantityValue === 'string'
        ? Number.parseFloat(minimumQuantityValue)
        : NaN
  const discountPercent =
    typeof discountValue === 'number'
      ? discountValue
      : typeof discountValue === 'string'
        ? Number.parseFloat(discountValue)
        : NaN

  if (
    !Number.isFinite(minimumQuantity) ||
    !Number.isFinite(discountPercent) ||
    minimumQuantity < 1 ||
    discountPercent <= 0
  ) {
    return null
  }

  const roundedMinimumQuantity = Math.floor(minimumQuantity)

  return {
    minimumQuantity: roundedMinimumQuantity,
    discountPercent,
    label: `Buy ${roundedMinimumQuantity} for ${formatPercentLabel(
      discountPercent,
    )}% Off`,
  }
}

function parseHulkOfferLevels(value: unknown): BulkPricingTier[] {
  if (typeof value !== 'string') return []

  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(parseHulkOfferLevel)
      .filter((tier): tier is BulkPricingTier => tier !== null)
      .sort((a, b) => a.minimumQuantity - b.minimumQuantity)
  } catch {
    return []
  }
}

function parseLegacyHulkBulkPricingTiers(value: unknown): BulkPricingTier[] {
  if (!isRecord(value)) return []

  const offer = value.eligible_offer
  if (!isRecord(offer)) return []

  if (
    offer.main_offer_type !== 'volume' ||
    offer.discount_type !== 'each_qty'
  ) {
    return []
  }

  return parseHulkOfferLevels(offer.offer_levels)
}

function parseLegacyVariantInventory(
  value: unknown,
): [string, LegacyVariantInventory] | null {
  if (!isRecord(value)) return null

  const variantId =
    typeof value.id === 'number'
      ? String(value.id)
      : typeof value.id === 'string'
        ? value.id
        : null
  const inventoryQuantity =
    typeof value.inventory_quantity === 'number'
      ? value.inventory_quantity
      : typeof value.inventory_quantity === 'string'
        ? Number.parseInt(value.inventory_quantity, 10)
        : NaN

  if (
    !variantId ||
    value.inventory_management !== 'shopify' ||
    value.inventory_policy === 'continue' ||
    !Number.isFinite(inventoryQuantity)
  ) {
    return null
  }

  return [
    variantId,
    {
      quantityAvailable: Math.max(0, Math.floor(inventoryQuantity)),
    },
  ]
}

function parseLegacyProductInventory(
  value: unknown,
): Map<string, LegacyVariantInventory> {
  if (!isRecord(value) || !Array.isArray(value.variants)) return new Map()

  return new Map(
    value.variants
      .map(parseLegacyVariantInventory)
      .filter(
        (entry): entry is [string, LegacyVariantInventory] => entry !== null,
      ),
  )
}

function reshapeQuantityPriceBreaks(
  variant: ShopifyVariantNode,
): BulkPricingTier[] {
  return variant.quantityPriceBreaks.nodes
    .map((priceBreak) => ({
      minimumQuantity: priceBreak.minimumQuantity,
      price: reshapeMoney(priceBreak.price),
    }))
    .sort((a, b) => a.minimumQuantity - b.minimumQuantity)
}

function reshapeVariant(
  variant: ShopifyVariantNode,
  legacyInventoryByVariantId: Map<string, LegacyVariantInventory>,
): Product['variants'][number] {
  const variantId = getNumericShopifyId(variant.id)
  const legacyInventory = variantId
    ? legacyInventoryByVariantId.get(variantId)
    : undefined

  return {
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    currentlyNotInStock: variant.currentlyNotInStock,
    quantityAvailable: legacyInventory?.quantityAvailable ?? null,
    quantityRule: {
      minimum: variant.quantityRule.minimum,
      maximum: variant.quantityRule.maximum ?? null,
      increment: variant.quantityRule.increment,
    },
    price: reshapeMoney(variant.price),
    quantityPriceBreaks: reshapeQuantityPriceBreaks(variant),
    image: variant.image ? reshapeImage(variant.image) : null,
  }
}

function reshapeProduct(
  p: ShopifyProductNode,
  variants: ShopifyVariantNode[],
  legacyInventoryByVariantId: Map<string, LegacyVariantInventory>,
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
    variants: variants.map((variant) =>
      reshapeVariant(variant, legacyInventoryByVariantId),
    ),
    bulkPricingTiers: parseBulkPricingTiers(
      p.bulkPricingTiersMetafield?.value,
      String(p.priceRange.minVariantPrice.currencyCode),
    ),
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
    ...(p.updatedAt && { updatedAt: String(p.updatedAt) }),
    featuredImage: p.featuredImage ? reshapeImage(p.featuredImage) : null,
    priceRange: {
      minVariantPrice: reshapeMoney(p.priceRange.minVariantPrice),
    },
    rating,
    reviewCount,
  }
}

function hasBulkPricingTiers(product: Product): boolean {
  return (
    product.bulkPricingTiers.length > 0 ||
    product.variants.some((variant) => variant.quantityPriceBreaks.length > 0)
  )
}

async function getLegacyHulkBulkPricingTiers(
  product: ShopifyProductNode,
  variants: ShopifyVariantNode[],
): Promise<LegacyBulkPricingResult> {
  const productId = getNumericShopifyId(product.id)
  const productVariants = variants
    .map((variant) => getNumericShopifyId(variant.id))
    .filter((variantId): variantId is string => variantId !== null)

  if (!productId || productVariants.length === 0) {
    return { tiers: [], degraded: false }
  }

  const productCollections = product.collections.nodes
    .map((collection) => getNumericShopifyId(collection.id))
    .filter((collectionId): collectionId is string => collectionId !== null)

  const params = new URLSearchParams({
    pid: productId,
    store_id: HULK_VOLUME_DISCOUNT_STORE_ID,
    ctags: '',
    product_variants: productVariants.join(','),
    product_collections: productCollections.join(','),
    product_tags: product.tags.join(', '),
  })

  try {
    const response = await fetch(HULK_VOLUME_DISCOUNT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })

    if (!response.ok) {
      console.warn('HulkApps volume discount request failed', {
        status: response.status,
        productId,
      })
      return { tiers: [], degraded: true }
    }

    const data: unknown = await response.json()
    return {
      tiers: parseLegacyHulkBulkPricingTiers(data),
      degraded: false,
    }
  } catch {
    console.warn('HulkApps volume discount request threw before completion', {
      productId,
    })
    return { tiers: [], degraded: true }
  }
}

async function getLegacyProductInventory(
  handle: string,
  variants: ShopifyVariantNode[],
): Promise<Map<string, LegacyVariantInventory>> {
  const needsLegacyInventory = variants.some(
    (variant) => variant.quantityRule.maximum === null,
  )

  if (!needsLegacyInventory) return new Map()

  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
  if (!storeDomain) return new Map()

  try {
    const response = await fetch(`https://${storeDomain}/products/${handle}.js`)

    if (!response.ok) return new Map()

    const data: unknown = await response.json()
    return parseLegacyProductInventory(data)
  } catch {
    return new Map()
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

export async function getProduct(
  handle: string,
  cacheVersion = 'default',
): Promise<Product | null> {
  'use cache'
  cacheTag('product', `product-${handle}`, `product-${handle}-${cacheVersion}`)

  const data = await shopifyFetch({
    query: GetProductDocument,
    variables: {
      handle,
      variantFirst: SHOPIFY_PAGE_SIZE,
      variantAfter: null,
    },
  })

  if (!data.product) {
    cacheLife('minutes')
    return null
  }

  const variants = await getProductVariantNodes(handle, data.product.variants)
  const legacyInventoryByVariantId = await getLegacyProductInventory(
    handle,
    variants,
  )
  const product = reshapeProduct(
    data.product,
    variants,
    legacyInventoryByVariantId,
  )

  if (hasBulkPricingTiers(product)) {
    cacheLife('hours')
    return product
  }

  const legacyBulkPricing = await getLegacyHulkBulkPricingTiers(
    data.product,
    variants,
  )

  if (legacyBulkPricing.degraded) {
    cacheLife('minutes')
    return product
  }

  cacheLife('hours')

  if (legacyBulkPricing.tiers.length === 0) return product

  return {
    ...product,
    bulkPricingTiers: legacyBulkPricing.tiers,
  }
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
