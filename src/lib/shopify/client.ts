import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

import { logEvent } from '@/lib/observability/logger'

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

function getOperationLabel<T, TVariables>(
  query: string | TypedDocumentNode<T, TVariables>,
): string | undefined {
  if (typeof query === 'string') {
    return query.match(/\b(?:query|mutation)\s+([A-Za-z0-9_]+)/)?.[1]
  }

  const operationDefinition = query.definitions.find(
    (definition) =>
      definition.kind === 'OperationDefinition' && definition.name?.value,
  )

  return operationDefinition?.kind === 'OperationDefinition'
    ? operationDefinition.name?.value
    : undefined
}

export async function shopifyFetch<T, TVariables = Record<string, unknown>>({
  query,
  variables,
  cache = 'no-store',
}: ShopifyFetchOptions<T, TVariables>): Promise<T> {
  const endpoint = getStorefrontEndpoint()
  const operation = getOperationLabel(query)

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
    logEvent('error', 'shopify_storefront_failed', {
      operation,
      status: response.status,
      statusText: response.statusText,
    })

    throw new Error(
      `Shopify API error: ${response.status} ${response.statusText}`,
    )
  }

  const json = (await response.json()) as ShopifyResponse<T>

  if (json.errors?.length) {
    logEvent('error', 'shopify_storefront_failed', {
      errorCount: json.errors.length,
      operation,
      status: 'graphql-errors',
    })

    throw new Error(json.errors.map((e) => e.message).join('\n'))
  }

  return json.data
}
