const SHOPIFY_API_VERSION = '2025-01'

type ShopifyFetchOptions<TVariables> = {
  query: string
  variables?: TVariables
  cache?: RequestCache
}

type ShopifyResponse<T> = {
  data: T
  errors?: Array<{ message: string }>
}

export async function shopifyFetch<T, TVariables = Record<string, unknown>>({
  query,
  variables,
  cache = 'no-store',
}: ShopifyFetchOptions<TVariables>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!domain || !token) {
    throw new Error('Missing Shopify credentials')
  }

  const response = await fetch(
    `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    },
  )

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
