import type { Mock } from 'vitest'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { GET } from './route'

const cookieState = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieState),
}))

describe('account login start route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_MODE', 'true')
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_TEST_URL', 'http://127.0.0.1:9012')
    vi.stubEnv('SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID', 'test-client-id')
    vi.stubEnv(
      'SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI',
      'https://teavision.test/account/callback',
    )
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input).endsWith('/.well-known/openid-configuration')) {
          return Response.json({
            authorization_endpoint: 'http://127.0.0.1:9012/auth',
            end_session_endpoint: 'http://127.0.0.1:9012/logout',
            issuer: 'http://127.0.0.1:9012',
            jwks_uri: 'http://127.0.0.1:9012/jwks',
            token_endpoint: 'http://127.0.0.1:9012/token',
          })
        }

        return Response.json({
          customer_account_api_endpoint: 'http://127.0.0.1:9012/graphql',
        })
      }),
    )
  })

  test('sets pending auth and redirects with S256 PKCE', async () => {
    const response = await GET(
      new Request('https://teavision.test/account/login/start?returnTo=/cart'),
    )
    const location = response.headers.get('location')
    const cookieSet = cookieState.set as Mock

    expect(location).toContain('code_challenge_method=S256')
    expect(location).toContain('client_id=test-client-id')
    expect(cookieSet).toHaveBeenCalledWith(
      'teavision_customer_auth',
      expect.any(String),
      expect.objectContaining({ httpOnly: true }),
    )
  })

  test('canonicalizes localhost starts to the configured callback origin before setting state', async () => {
    vi.stubEnv(
      'SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI',
      'https://detonate-trickster-venus.ngrok-free.dev/account/callback',
    )

    const response = await GET(
      new Request('http://localhost:3000/account/login/start?returnTo=/account'),
    )

    expect(response.headers.get('location')).toBe(
      'https://detonate-trickster-venus.ngrok-free.dev/account/login/start?returnTo=%2Faccount&_accountOrigin=1',
    )
    expect(cookieState.set).not.toHaveBeenCalled()
    expect(fetch as unknown as Mock).not.toHaveBeenCalled()
  })
})
