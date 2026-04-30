import { shopifyFetch } from '@/lib/shopify/client'
import type { Money, ProductSummary, ShopifyImage } from '@/lib/shopify/types'

const PREDICTIVE_SEARCH_QUERY = /* GraphQL */ `
  query PredictiveSearch($query: String!) {
    predictiveSearch(query: $query, types: [PRODUCT]) {
      products {
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
`

type ShopifyPredictiveProductNode = {
  id: string
  handle: string
  title: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
}

type PredictiveSearchData = {
  predictiveSearch: {
    products: ShopifyPredictiveProductNode[]
  } | null
}

export async function searchProducts(query: string): Promise<ProductSummary[]> {
  if (!query) return []

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return []
  }

  const data = await shopifyFetch<PredictiveSearchData>({
    query: PREDICTIVE_SEARCH_QUERY,
    variables: { query },
  })

  if (!data.predictiveSearch) return []

  return data.predictiveSearch.products.map((node) => ({
    id: node.id,
    handle: node.handle,
    title: node.title,
    featuredImage: node.featuredImage,
    priceRange: node.priceRange,
  }))
}
