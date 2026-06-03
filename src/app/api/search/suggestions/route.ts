import { getSearchaniseSearchResults } from '@/lib/searchanise/search'
import type { ProductSummary } from '@/lib/shopify/types'
import {
  checkRateLimit,
  getClientIpFromHeaders,
} from '@/lib/rate-limit'

const MAX_QUERY_LENGTH = 100
const MAX_SUGGESTIONS = 10
const MAX_DESCRIPTION_LENGTH = 140
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 60

function mapSuggestionProduct(product: ProductSummary): ProductSummary {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description?.slice(0, MAX_DESCRIPTION_LENGTH),
    availableForSale: product.availableForSale,
    featuredImage: product.featuredImage,
    priceRange: product.priceRange,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim().slice(0, MAX_QUERY_LENGTH) ?? ''

  if (!query) {
    return Response.json({ products: [] })
  }

  const rateLimit = await checkRateLimit({
    namespace: 'search-suggestions',
    identifier: getClientIpFromHeaders(request.headers),
    limit: RATE_LIMIT_MAX_REQUESTS,
    windowMs: RATE_LIMIT_WINDOW_MS,
  })

  if (rateLimit.limited) {
    return Response.json(
      {
        message: 'Too many search requests. Please wait a moment.',
        products: [],
      },
      { status: 429 },
    )
  }

  try {
    const result = await getSearchaniseSearchResults({
      query,
      page: 1,
      sort: 'relevance',
      filters: [],
      pageSize: MAX_SUGGESTIONS,
    })

    if (result.status !== 'success') {
      return Response.json(
        {
          message: result.message ?? 'Search suggestions are unavailable',
          products: [],
        },
        { status: 503 },
      )
    }

    return Response.json({
      products: result.products
        .slice(0, MAX_SUGGESTIONS)
        .map(mapSuggestionProduct),
    })
  } catch {
    return Response.json(
      { message: 'Search suggestions are unavailable', products: [] },
      { status: 500 },
    )
  }
}
