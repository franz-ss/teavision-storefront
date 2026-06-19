import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

import { discoverCustomerAccountEndpoints } from './discovery'
import type { CustomerAccountSession } from './types'

type CustomerAccountFetchOptions<T, TVariables> = {
  accessToken?: string
  cache?: RequestCache
  query: string | TypedDocumentNode<T, TVariables>
  session?: Pick<CustomerAccountSession, 'accessToken'>
  variables?: TVariables
}

type CustomerAccountResponse<T> = {
  data: T
  errors?: Array<{ message: string }>
}

const TOKEN_VALUE_PATTERN =
  /\b(?:shcat|shpat|shpca|customer-access-token|customer-refresh-token)[A-Za-z0-9._:-]*\b/g

function redactTokenValues(message: string, tokenValues: string[]): string {
  return tokenValues.reduce(
    (nextMessage, token) => nextMessage.replaceAll(token, '[redacted]'),
    message.replace(TOKEN_VALUE_PATTERN, '[redacted]'),
  )
}

export async function customerAccountFetch<
  TData,
  TVariables = Record<string, unknown>,
>({
  accessToken,
  cache = 'no-store',
  query,
  session,
  variables,
}: CustomerAccountFetchOptions<TData, TVariables>): Promise<TData> {
  const token = session?.accessToken ?? accessToken
  if (!token) {
    throw new Error('Missing Customer Account session')
  }

  const endpoints = await discoverCustomerAccountEndpoints()
  const response = await fetch(endpoints.graphqlEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: typeof query === 'string' ? query : print(query),
      variables,
    }),
    cache,
  })

  if (!response.ok) {
    throw new Error(
      `Shopify Customer Account API error: ${response.status} ${response.statusText}`,
    )
  }

  const json = (await response.json()) as CustomerAccountResponse<TData>

  if (json.errors?.length) {
    throw new Error(
      redactTokenValues(json.errors.map((error) => error.message).join('\n'), [
        token,
      ]),
    )
  }

  return json.data
}
