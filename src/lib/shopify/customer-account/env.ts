import { optionalEnv, truthyEnv } from '@/lib/env/read'
import { isProductionRuntime, isTestRuntime } from '@/lib/env/runtime'
import { getShopifyStoreDomain } from '@/lib/shopify/env'

const CUSTOMER_ACCOUNT_API_VERSION = '2026-04'
const LOCAL_TEST_ENDPOINT_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

export type CustomerAccountConfig = {
  clientId: string
  logoutRedirectUri: string
  redirectUri: string
  sessionSecret: string
  shopDomain: string
  testMode: boolean
  testUrl?: string
}

function isLocalTestEndpoint(url: string): boolean {
  try {
    return LOCAL_TEST_ENDPOINT_HOSTS.has(new URL(url).hostname)
  } catch {
    return false
  }
}

function readRequiredCustomerEnv(name: string): string {
  const value = optionalEnv(name)
  if (value) return value

  throw new Error(
    `Missing Shopify Customer Account setup: ${name} is required. Configure Customer Account API credentials, callback URLs, and session secret before using account routes.`,
  )
}

export function getCustomerAccountConfig(): CustomerAccountConfig {
  const testUrl = optionalEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_URL')
  const testMode = truthyEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_MODE')

  if (testUrl && !testMode) {
    throw new Error(
      'Missing Shopify Customer Account setup: test endpoint requires explicit test mode',
    )
  }

  if (testUrl && testMode) {
    if (isProductionRuntime()) {
      throw new Error(
        'Missing Shopify Customer Account setup: test endpoint is not allowed in production',
      )
    }

    if (!isLocalTestEndpoint(testUrl)) {
      throw new Error(
        'Missing Shopify Customer Account setup: test endpoint must be local',
      )
    }
  }

  const shopDomain = getShopifyStoreDomain()
  const shouldAllowTestDefaults = testMode && isTestRuntime()

  return {
    clientId:
      optionalEnv('SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID') ??
      (shouldAllowTestDefaults
        ? 'test-client-id'
        : readRequiredCustomerEnv('SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID')),
    logoutRedirectUri:
      optionalEnv('SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI') ??
      (shouldAllowTestDefaults
        ? 'https://example.test/account/login'
        : readRequiredCustomerEnv(
            'SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI',
          )),
    redirectUri:
      optionalEnv('SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI') ??
      (shouldAllowTestDefaults
        ? 'https://example.test/account/callback'
        : readRequiredCustomerEnv('SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI')),
    sessionSecret:
      optionalEnv('SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET') ??
      (shouldAllowTestDefaults
        ? 'test-session-secret-with-at-least-32-characters'
        : readRequiredCustomerEnv('SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET')),
    shopDomain:
      shopDomain ??
      (shouldAllowTestDefaults
        ? 'test-shop.myshopify.com'
        : readRequiredCustomerEnv('SHOPIFY_STORE_DOMAIN')),
    testMode,
    testUrl,
  }
}

export function getCustomerAccountDiscoveryBaseUrl(): string {
  const config = getCustomerAccountConfig()

  if (config.testUrl && config.testMode) return config.testUrl

  return `https://${config.shopDomain}/account/customer/api/${CUSTOMER_ACCOUNT_API_VERSION}`
}
