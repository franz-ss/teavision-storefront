import { parse, type DocumentNode } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { logEvent } from '@/lib/observability/logger'

import { shopifyFetch } from './client'

vi.mock('@/lib/observability/logger', () => ({
  logEvent: vi.fn(),
}))

type FetchCall = {
  body: {
    query: string
    variables?: unknown
  }
  cache?: RequestCache
  headers: Headers
  url: string
}

function createFetchMock(response: Response) {
  const calls: FetchCall[] = []

  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        body: JSON.parse(String(init?.body)) as FetchCall['body'],
        cache: init?.cache,
        headers: new Headers(init?.headers),
        url: String(input),
      })
      return response
    },
  )

  vi.stubGlobal('fetch', fetchMock)

  return { calls, fetchMock }
}

const logEventMock = logEvent as unknown as Mock<typeof logEvent>

describe('shopifyFetch', () => {
  beforeEach(() => {
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', '')
    vi.stubEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN', '')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_URL', '')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_MODE', '')
    logEventMock.mockClear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  test('fails fast when credentials are missing and no test override is set', async () => {
    await expect(
      shopifyFetch<{ ok: boolean }>({ query: 'query Test { ok }' }),
    ).rejects.toThrow('Missing Shopify credentials')
  })

  test('routes to the guarded test endpoint in test mode without production credentials', async () => {
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_URL', 'http://127.0.0.1:9010/graphql')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_MODE', 'true')
    const { calls } = createFetchMock(Response.json({ data: { ok: true } }))

    await expect(
      shopifyFetch<{ ok: boolean }>({ query: 'query Test { ok }' }),
    ).resolves.toEqual({ ok: true })

    expect(calls[0]?.url).toBe('http://127.0.0.1:9010/graphql')
    expect(calls[0]?.headers.get('X-Shopify-Storefront-Access-Token')).toBe(
      'test-token',
    )
  })

  test('rejects a test endpoint outside explicit test mode', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_URL', 'http://127.0.0.1:9010/graphql')

    await expect(
      shopifyFetch<{ ok: boolean }>({ query: 'query Test { ok }' }),
    ).rejects.toThrow('Shopify test endpoint requires explicit test mode')
  })

  test('rejects the guarded test endpoint in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_URL', 'http://127.0.0.1:9010/graphql')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_MODE', 'true')
    vi.stubEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'storefront-token')

    await expect(
      shopifyFetch<{ ok: boolean }>({ query: 'query Test { ok }' }),
    ).rejects.toThrow('Shopify test endpoint is not allowed in production')
  })

  test('allows the local test endpoint during explicit Playwright production test mode', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('PLAYWRIGHT_PRODUCTION_TEST_MODE', 'true')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_URL', 'http://127.0.0.1:9010/graphql')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_MODE', 'true')
    vi.stubEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'storefront-token')
    const { calls } = createFetchMock(Response.json({ data: { ok: true } }))

    await expect(
      shopifyFetch<{ ok: boolean }>({ query: 'query Test { ok }' }),
    ).resolves.toEqual({ ok: true })

    expect(calls[0]?.url).toBe('http://127.0.0.1:9010/graphql')
  })

  test('rejects non-local test endpoints', async () => {
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_URL', 'https://shopify.test/graphql')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_MODE', 'true')

    await expect(
      shopifyFetch<{ ok: boolean }>({ query: 'query Test { ok }' }),
    ).rejects.toThrow('Shopify test endpoint must be local')
  })

  test('requires a token for the guarded endpoint outside Vitest', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_URL', 'http://127.0.0.1:9010/graphql')
    vi.stubEnv('SHOPIFY_STOREFRONT_TEST_MODE', 'true')

    await expect(
      shopifyFetch<{ ok: boolean }>({ query: 'query Test { ok }' }),
    ).rejects.toThrow('Missing Shopify credentials')
  })

  test('uses the production Storefront API URL and token during normal runtime', async () => {
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'teavision-test.myshopify.com')
    vi.stubEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'storefront-token')
    const { calls } = createFetchMock(Response.json({ data: { ok: true } }))

    await shopifyFetch<{ ok: boolean }>({
      query: 'query Test { ok }',
      cache: 'no-store',
    })

    expect(calls[0]?.url).toBe(
      'https://teavision-test.myshopify.com/api/2026-04/graphql.json',
    )
    expect(calls[0]?.headers.get('X-Shopify-Storefront-Access-Token')).toBe(
      'storefront-token',
    )
    expect(calls[0]?.cache).toBe('no-store')
  })

  test('throws safe errors for non-OK HTTP responses', async () => {
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'teavision-test.myshopify.com')
    vi.stubEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'storefront-token')
    createFetchMock(new Response('{}', { status: 503, statusText: 'Down' }))

    await expect(
      shopifyFetch<{ ok: boolean }>({ query: 'query Test { ok }' }),
    ).rejects.toThrow('Shopify API error: 503 Down')
    expect(logEventMock).toHaveBeenCalledWith(
      'error',
      'shopify_storefront_failed',
      {
        operation: 'Test',
        status: 503,
        statusText: 'Down',
      },
    )
  })

  test('throws joined GraphQL errors', async () => {
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'teavision-test.myshopify.com')
    vi.stubEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'storefront-token')
    createFetchMock(
      Response.json({
        data: { ok: false },
        errors: [{ message: 'First' }, { message: 'Second' }],
      }),
    )

    await expect(
      shopifyFetch<{ ok: boolean }>({ query: 'query Test { ok }' }),
    ).rejects.toThrow('First\nSecond')
    expect(logEventMock).toHaveBeenCalledWith(
      'error',
      'shopify_storefront_failed',
      {
        errorCount: 2,
        operation: 'Test',
        status: 'graphql-errors',
      },
    )
  })

  test('serializes variables and TypedDocumentNode queries', async () => {
    vi.stubEnv('SHOPIFY_STORE_DOMAIN', 'teavision-test.myshopify.com')
    vi.stubEnv('SHOPIFY_STOREFRONT_ACCESS_TOKEN', 'storefront-token')
    const { calls } = createFetchMock(
      Response.json({ data: { product: { id: 'gid://shopify/Product/1' } } }),
    )
    const document = parse(
      'query Product($id: ID!) { product(id: $id) { id } }',
    ) as DocumentNode as TypedDocumentNode<
      { product: { id: string } },
      { id: string }
    >

    await shopifyFetch({
      query: document,
      variables: { id: 'gid://shopify/Product/1' },
    })

    expect(calls[0]?.body.query).toContain('query Product')
    expect(calls[0]?.body.variables).toEqual({
      id: 'gid://shopify/Product/1',
    })
  })
})
