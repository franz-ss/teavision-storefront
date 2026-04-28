import { cacheLife, cacheTag } from 'next/cache'
import { shopifyFetch } from '@/lib/shopify/client'
import type {
  Money,
  Product,
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

type ShopifyProductNode = {
  id: string
  handle: string
  title: string
  description: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
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
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    featuredImage: p.featuredImage,
    priceRange: p.priceRange,
    variants: p.variants.edges.map((e) => e.node),
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
    'Premium Assam-based black tea blend. Available in 250g, 1kg, 5kg, and 10kg.',
  featuredImage: null,
  priceRange: { minVariantPrice: { amount: '18.00', currencyCode: 'AUD' } },
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
    return [reshapeProductSummary(STUB_PRODUCT)]
  }

  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProductSummaryNode }> }
  }>({
    query: GET_PRODUCTS_QUERY,
    variables: { first },
  })

  return data.products.edges.map((e) => reshapeProductSummary(e.node))
}
