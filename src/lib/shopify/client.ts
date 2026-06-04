import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

const SHOPIFY_API_VERSION = '2026-04'
const TEST_ENDPOINT_MODE = 'true'
const LOCAL_TEST_ENDPOINT_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

type ShopifyFetchOptions<T, TVariables> = {
  query: string | TypedDocumentNode<T, TVariables>
  variables?: TVariables
  cache?: RequestCache
}

type ShopifyResponse<T> = {
  data: T
  errors?: Array<{ message: string }>
}

type StorefrontEndpoint = {
  headers: Record<string, string>
  url: string
}

function isLocalTestEndpoint(url: string): boolean {
  try {
    return LOCAL_TEST_ENDPOINT_HOSTS.has(new URL(url).hostname)
  } catch {
    return false
  }
}

function getStorefrontEndpoint(): StorefrontEndpoint {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  const testUrl = process.env.SHOPIFY_STOREFRONT_TEST_URL
  const isTestEndpointEnabled =
    process.env.SHOPIFY_STOREFRONT_TEST_MODE === TEST_ENDPOINT_MODE

  if (testUrl && isTestEndpointEnabled) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Shopify test endpoint is not allowed in production')
    }

    if (!isLocalTestEndpoint(testUrl)) {
      throw new Error('Shopify test endpoint must be local')
    }

    if (!token && process.env.NODE_ENV !== 'test') {
      throw new Error('Missing Shopify credentials')
    }

    return {
      url: testUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token || 'test-token',
      },
    }
  }

  if (testUrl && !isTestEndpointEnabled) {
    throw new Error('Shopify test endpoint requires explicit test mode')
  }

  if (!domain || !token) {
    throw new Error('Missing Shopify credentials')
  }

  return {
    url: `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
  }
}

export async function shopifyFetch<T, TVariables = Record<string, unknown>>({
  query,
  variables,
  cache = 'no-store',
}: ShopifyFetchOptions<T, TVariables>): Promise<T> {
  const endpoint = getStorefrontEndpoint()

  const response = await fetch(endpoint.url, {
    method: 'POST',
    headers: endpoint.headers,
    body: JSON.stringify({
      query: typeof query === 'string' ? query : print(query),
      variables,
    }),
    cache,
  })

  if (!response.ok) {
    throw new Error(
      `Shopify API error: ${response.status} ${response.statusText}`,
    )
  }

  const json = (await response.json()) as ShopifyResponse<T>

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('\n'))
  }

  return json.data
}
