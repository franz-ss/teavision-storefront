import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

import { getStorefrontEndpoint } from './env'

type ShopifyFetchOptions<T, TVariables> = {
  query: string | TypedDocumentNode<T, TVariables>
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
