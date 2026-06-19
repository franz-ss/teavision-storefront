import { beforeEach, describe, expect, test, vi } from 'vitest'

import { sealCustomerSession } from '@/lib/shopify/customer-account/session'

import { GET, POST } from './route'

const cookieState = vi.hoisted(() => ({
  values: new Map<string, string>(),
  delete: vi.fn((name: string) => {
    cookieState.values.delete(name)
  }),
  get: vi.fn((name: string) => {
    const value = cookieState.values.get(name)
    return value ? { value } : undefined
  }),
  set: vi.fn((name: string, value: string) => {
    cookieState.values.set(name, value)
  }),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieState),
}))

describe('account logout route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cookieState.values.clear()
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_MODE', 'true')
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_URL', 'http://127.0.0.1:9014')
    vi.stubEnv(
      'SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET',
      'test-session-secret-with-at-least-32-characters',
    )
    vi.stubEnv(
      'SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI',
      'https://teavision.test/account/login',
    )
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input).endsWith('/.well-known/openid-configuration')) {
          return Response.json({
            authorization_endpoint: 'http://127.0.0.1:9014/auth',
            end_session_endpoint: 'http://127.0.0.1:9014/logout',
            issuer: 'http://127.0.0.1:9014',
            jwks_uri: 'http://127.0.0.1:9014/jwks',
            token_endpoint: 'http://127.0.0.1:9014/token',
          })
        }

        return Response.json({
          customer_account_api_endpoint: 'http://127.0.0.1:9014/graphql',
        })
      }),
    )
  })

  test('GET clears session and redirects through Shopify logout endpoint', async () => {
    cookieState.values.set(
      'teavision_customer_session',
      sealCustomerSession({
        accessToken: 'customer-access-token',
        expiresAt: Date.now() + 60000,
        idToken: 'id-token',
        refreshToken: 'customer-refresh-token',
      }),
    )

    const response = await GET(
      new Request('https://teavision.test/account/logout'),
    )
    const location = response.headers.get('location')

    expect(location).toContain('http://127.0.0.1:9014/logout')
    expect(location).toContain('id_token_hint=id-token')
    expect(cookieState.delete).toHaveBeenCalledWith(
      'teavision_customer_session',
    )
  })

  test('POST clears local cookies when there is no session', async () => {
    const response = await POST(
      new Request('https://teavision.test/account/logout', { method: 'POST' }),
    )

    expect(response.headers.get('location')).toBe(
      'https://teavision.test/account/login?reason=logged-out',
    )
    expect(cookieState.delete).toHaveBeenCalledWith(
      'teavision_customer_session',
    )
  })
})
