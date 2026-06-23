import { describe, expect, test } from 'vitest'

import { GET } from './route'

const FORBIDDEN_PUBLIC_HEALTH_SUBSTRINGS = [
  'SHOPIFY',
  'TOKEN',
  'SECRET',
  'SANITY',
  'SENTRY_DSN',
  'CUSTOMER',
  'EMAIL',
  'PHONE',
  'ADDRESS',
  'checkoutUrl',
  'cartId',
  'provider',
  'env',
] as const

describe('health route', () => {
  test('returns the shallow public health payload without diagnostics', async () => {
    const response = GET()
    const payload = await response.json()
    const serializedPayload = JSON.stringify(payload)

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(payload).toMatchObject({
      status: 'ok',
      service: 'teavision-storefront',
      timestamp: expect.any(String),
    })
    expect(payload).toHaveProperty('release')

    for (const forbiddenValue of FORBIDDEN_PUBLIC_HEALTH_SUBSTRINGS) {
      expect(serializedPayload).not.toContain(forbiddenValue)
    }
  })
})
