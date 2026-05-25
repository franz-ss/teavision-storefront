import { cacheLife, cacheTag } from 'next/cache'

export type ProductReviewSummary = {
  rating: number
  reviewCount: number
}

type TrustooRatingRow = {
  rating?: unknown
  total_reviews?: unknown
}

type TrustooRatingsResponse = {
  code?: unknown
  data?: unknown
}

const TRUSTOO_PRODUCT_RATINGS_URL =
  'https://api.trustoo.io/api/v1/reviews/get_products_rating'

function isTrustooRatingRow(value: unknown): value is TrustooRatingRow {
  return typeof value === 'object' && value !== null
}

function parseRating(value: unknown): number {
  const rating =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? parseFloat(value)
        : 0

  return Number.isFinite(rating) ? rating : 0
}

function parseReviewCount(value: unknown): number {
  const reviewCount =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? parseInt(value, 10)
        : 0

  return Number.isFinite(reviewCount) ? reviewCount : 0
}

function toProductReviewSummary(row: TrustooRatingRow): ProductReviewSummary {
  return {
    rating: parseRating(row.rating),
    reviewCount: parseReviewCount(row.total_reviews),
  }
}

export async function getTrustooProductRatings(
  handles: string[],
): Promise<Record<string, ProductReviewSummary>> {
  'use cache'
  cacheTag('trustoo-reviews')
  cacheLife('hours')

  const shop = process.env.NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN
  const uniqueHandles = Array.from(new Set(handles.filter(Boolean)))

  if (!shop || uniqueHandles.length === 0) return {}

  const searchParams = new URLSearchParams({
    shop,
    product_handle: uniqueHandles.join(','),
  })

  try {
    const response = await fetch(
      `${TRUSTOO_PRODUCT_RATINGS_URL}?${searchParams.toString()}`,
      { cache: 'no-store' },
    )

    if (!response.ok) return {}

    const json = (await response.json()) as TrustooRatingsResponse
    if (json.code !== 0 || !Array.isArray(json.data)) return {}

    return json.data.reduce<Record<string, ProductReviewSummary>>(
      (ratings, row, index) => {
        if (!isTrustooRatingRow(row)) return ratings

        const handle = uniqueHandles[index]
        if (!handle) return ratings

        ratings[handle] = toProductReviewSummary(row)
        return ratings
      },
      {},
    )
  } catch {
    return {}
  }
}
