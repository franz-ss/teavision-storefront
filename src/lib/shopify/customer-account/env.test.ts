import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { getCustomerAccountConfig } from './env'

describe('getCustomerAccountConfig', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('PLAYWRIGHT_PRODUCTION_TEST_MODE', '')
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID', 'test-client-id')
    vi.stubEnv(
      'SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI',
      'http://localhost:4173/account/login',
    )
    vi.stubEnv(
      'SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI',
      'http://localhost:4173/account/callback',
    )
    vi.stubEnv(
      'SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET',
      'test-session-secret-with-at-least-32-characters',
    )
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_MODE', 'true')
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_URL', 'http://127.0.0.1:4518')
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'fake-shopify.test')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('rejects the guarded test endpoint in production', () => {
    expect(() => getCustomerAccountConfig()).toThrow(
      'Missing Shopify Customer Account setup: test endpoint is not allowed in production',
    )
  })

  test('allows the local test endpoint during explicit Playwright production test mode', () => {
    vi.stubEnv('PLAYWRIGHT_PRODUCTION_TEST_MODE', 'true')

    expect(getCustomerAccountConfig()).toMatchObject({
      testMode: true,
      testUrl: 'http://127.0.0.1:4518',
    })
  })
})
