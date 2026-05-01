import { shopifyFetch } from '@/lib/shopify/client'
import {
  SearchProductsDocument,
  type Money,
  type ProductSummary,
  type ShopifyImage,
} from '@/lib/shopify/types'

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

export async function searchProducts(query: string): Promise<ProductSummary[]> {
  if (!query) return []

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return []
  }

  const data = await shopifyFetch({
    query: SearchProductsDocument,
    variables: { query },
  })

  if (!data.predictiveSearch) return []

  return data.predictiveSearch.products.map(reshapeProductSummary)
}
