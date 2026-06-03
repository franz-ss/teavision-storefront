import type { Money, ShopifyImage } from '@/lib/shopify/types'

export type MoneyLike = {
  amount: unknown
  currencyCode: string
}

export type ShopifyImageLike = {
  url: unknown
  altText?: string | null
  width?: number | null
  height?: number | null
}

export type ProductRatingSource = {
  ratingMetafield?: { value: string } | null
  ratingCountMetafield?: { value: string } | null
}

export function reshapeMoney(money: MoneyLike): Money {
  return {
    amount: String(money.amount),
    currencyCode: String(money.currencyCode),
  }
}

export function reshapeImage(image: ShopifyImageLike): ShopifyImage {
  return {
    url: String(image.url),
    altText: image.altText ?? null,
    width: image.width ?? null,
    height: image.height ?? null,
  }
}

export function parseProductRating(product: ProductRatingSource): {
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
