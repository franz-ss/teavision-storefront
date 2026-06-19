import { getCustomerAccountDiscoveryBaseUrl } from './env'
import type { CustomerAccountEndpoints } from './types'

type OpenIdConfigurationResponse = {
  authorization_endpoint?: string
  end_session_endpoint?: string
  issuer?: string
  jwks_uri?: string
  token_endpoint?: string
}

type CustomerAccountApiDiscoveryResponse = {
  customer_account_api_endpoint?: string
}

function requireString(
  value: string | undefined,
  field: string,
  source: string,
): string {
  if (value) return value

  throw new Error(
    `Missing Shopify Customer Account setup: ${source} did not include ${field}`,
  )
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(
      `Missing Shopify Customer Account setup: discovery failed for ${url}`,
    )
  }

  return (await response.json()) as T
}

export async function discoverCustomerAccountEndpoints(): Promise<CustomerAccountEndpoints> {
  const baseUrl = getCustomerAccountDiscoveryBaseUrl()
  const [openIdConfiguration, customerAccountApi] = await Promise.all([
    fetchJson<OpenIdConfigurationResponse>(
      `${baseUrl}/.well-known/openid-configuration`,
    ),
    fetchJson<CustomerAccountApiDiscoveryResponse>(
      `${baseUrl}/.well-known/customer-account-api`,
    ),
  ])

  return {
    authorizationEndpoint: requireString(
      openIdConfiguration.authorization_endpoint,
      'authorization_endpoint',
      'OpenID discovery',
    ),
    graphqlEndpoint: requireString(
      customerAccountApi.customer_account_api_endpoint,
      'customer_account_api_endpoint',
      'Customer Account API discovery',
    ),
    issuer: requireString(
      openIdConfiguration.issuer,
      'issuer',
      'OpenID discovery',
    ),
    jwksUri: requireString(
      openIdConfiguration.jwks_uri,
      'jwks_uri',
      'OpenID discovery',
    ),
    logoutEndpoint: requireString(
      openIdConfiguration.end_session_endpoint,
      'end_session_endpoint',
      'OpenID discovery',
    ),
    tokenEndpoint: requireString(
      openIdConfiguration.token_endpoint,
      'token_endpoint',
      'OpenID discovery',
    ),
  }
}
