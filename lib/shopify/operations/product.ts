import { cacheLife, cacheTag } from 'next/cache'

import { shopifyFetch } from '@/lib/shopify/client'
import type {
  Money,
  Product,
  ProductOption,
  ProductSummary,
  ShopifyImage,
} from '@/lib/shopify/types'

const GET_PRODUCT_QUERY = /* GraphQL */ `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      tags
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      options {
        name
        values
      }
      ratingMetafield: metafield(namespace: "reviews", key: "rating") {
        value
      }
      ratingCountMetafield: metafield(namespace: "reviews", key: "rating_count") {
        value
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

const GET_PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts($first: Int!) {
    products(first: $first) {
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
`

const GET_PRODUCT_RECOMMENDATIONS_QUERY = /* GraphQL */ `
  query GetProductRecommendations($productId: ID!, $intent: ProductRecommendationIntent) {
    productRecommendations(productId: $productId, intent: $intent) {
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
`

type ShopifyProductNode = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  tags: string[]
  images: {
    edges: Array<{ node: ShopifyImage }>
  }
  priceRange: { minVariantPrice: Money }
  options: ProductOption[]
  ratingMetafield: { value: string } | null
  ratingCountMetafield: { value: string } | null
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        availableForSale: boolean
        price: Money
      }
    }>
  }
}

type ShopifyProductSummaryNode = {
  id: string
  handle: string
  title: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
}

function reshapeProduct(p: ShopifyProductNode): Product {
  // SPR rating metafield stores a JSON object: { "value": "4.8", "scale_min": "1.0", "scale_max": "5.0" }
  let rating: number | undefined
  let reviewCount: number | undefined
  if (p.ratingMetafield?.value) {
    try {
      const parsed = JSON.parse(p.ratingMetafield.value) as { value?: string }
      const n = parseFloat(parsed.value ?? '')
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
    descriptionHtml: p.descriptionHtml,
    tags: p.tags,
    images: p.images.edges.map((e) => e.node),
    priceRange: p.priceRange,
    options: p.options,
    variants: p.variants.edges.map((e) => e.node),
    rating,
    reviewCount,
  }
}

function reshapeProductSummary(p: ShopifyProductSummaryNode): ProductSummary {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    featuredImage: p.featuredImage,
    priceRange: p.priceRange,
  }
}

const STUB_PRODUCT: Product = {
  id: 'gid://shopify/Product/1',
  handle: 'english-breakfast',
  title: 'English Breakfast — Bulk Loose Leaf',
  description:
    'Premium Assam-based black tea blend. Available in 250g, 1kg, and 5kg.',
  descriptionHtml:
    '<p>Premium Assam-based black tea blend. Available in 250g, 1kg, and 5kg.</p>',
  tags: ['Package_250|1000|5000', 'certified_organic', 'origin_India', 'filter_Type_Black Tea', 'filter_Caffeine_High', 'tea-bags'],
  images: [],
  priceRange: { minVariantPrice: { amount: '18.00', currencyCode: 'AUD' } },
  options: [{ name: 'Weight', values: ['250g', '1kg', '5kg'] }],
  variants: [
    {
      id: 'gid://shopify/ProductVariant/1',
      title: '250g',
      availableForSale: true,
      price: { amount: '18.00', currencyCode: 'AUD' },
    },
    {
      id: 'gid://shopify/ProductVariant/2',
      title: '1kg',
      availableForSale: true,
      price: { amount: '42.00', currencyCode: 'AUD' },
    },
    {
      id: 'gid://shopify/ProductVariant/3',
      title: '5kg',
      availableForSale: false,
      price: { amount: '180.00', currencyCode: 'AUD' },
    },
  ],
}

export async function getProduct(handle: string): Promise<Product | null> {
  'use cache'
  cacheTag('product', `product-${handle}`)
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_PRODUCT
  }

  const data = await shopifyFetch<{ product: ShopifyProductNode | null }>({
    query: GET_PRODUCT_QUERY,
    variables: { handle },
  })

  return data.product ? reshapeProduct(data.product) : null
}

export async function getProducts(first = 24): Promise<ProductSummary[]> {
  'use cache'
  cacheTag('product')
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return [
      {
        id: STUB_PRODUCT.id,
        handle: STUB_PRODUCT.handle,
        title: STUB_PRODUCT.title,
        featuredImage: null,
        priceRange: STUB_PRODUCT.priceRange,
      },
    ]
  }

  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProductSummaryNode }> }
  }>({
    query: GET_PRODUCTS_QUERY,
    variables: { first },
  })

  return data.products.edges.map((e) => reshapeProductSummary(e.node))
}

export async function getProductRecommendations(
  productId: string,
  intent: 'RELATED' | 'COMPLEMENTARY' = 'RELATED',
): Promise<ProductSummary[]> {
  'use cache'
  cacheTag('product', `product-recommendations-${productId}`)
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return []
  }

  const data = await shopifyFetch<{
    productRecommendations: ShopifyProductSummaryNode[]
  }>({
    query: GET_PRODUCT_RECOMMENDATIONS_QUERY,
    variables: { productId, intent },
  })

  return (data.productRecommendations ?? []).map(reshapeProductSummary)
}
