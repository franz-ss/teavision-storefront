import { afterEach, describe, expect, test, vi } from 'vitest'

vi.mock('server-only', () => ({}))

async function loadRateLimitModule() {
  vi.resetModules()
  return import('./index')
}

describe('rate-limit production posture', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('fails closed in production when the posture is implicit', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const { checkRateLimit } = await loadRateLimitModule()

    const result = await checkRateLimit({
      namespace: 'implicit-production',
      identifier: '203.0.113.10',
      limit: 5,
      windowMs: 60_000,
    })

    expect(result.limited).toBe(true)
    expect(result.remaining).toBe(0)
    expect(result.resetAt).toBeGreaterThan(Date.now())
  })

  test('allows normal counting when production has external protection', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('RATE_LIMIT_EXTERNAL_PROTECTION', 'true')
    const { checkRateLimit } = await loadRateLimitModule()

    const result = await checkRateLimit({
      namespace: 'external-protection',
      identifier: '203.0.113.11',
      limit: 2,
      windowMs: 60_000,
    })

    expect(result).toMatchObject({
      limited: false,
      remaining: 1,
    })
  })

  test('allows memory fallback when production has a trusted client IP header', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('RATE_LIMIT_ALLOW_MEMORY_FALLBACK', 'true')
    vi.stubEnv('RATE_LIMIT_TRUSTED_IP_HEADER', 'x-forwarded-for')
    const { checkRateLimit } = await loadRateLimitModule()

    const result = await checkRateLimit({
      namespace: 'trusted-memory-fallback',
      identifier: '203.0.113.12',
      limit: 2,
      windowMs: 60_000,
    })

    expect(result).toMatchObject({
      limited: false,
      remaining: 1,
    })
  })

  test('fails closed when production memory fallback lacks a trusted header', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('RATE_LIMIT_ALLOW_MEMORY_FALLBACK', 'true')
    const { checkRateLimit } = await loadRateLimitModule()

    const result = await checkRateLimit({
      namespace: 'untrusted-memory-fallback',
      identifier: '203.0.113.13',
      limit: 2,
      windowMs: 60_000,
    })

    expect(result).toMatchObject({
      limited: true,
      remaining: 0,
    })
  })
})

describe('rate-limit client IP headers', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('uses cf-connecting-ip and ignores spoofed forwarded headers when configured', async () => {
    vi.stubEnv('RATE_LIMIT_TRUSTED_IP_HEADER', 'cf-connecting-ip')
    const { getClientIpFromHeaders } = await loadRateLimitModule()

    expect(
      getClientIpFromHeaders(
        new Headers({
          'cf-connecting-ip': '203.0.113.20',
          'x-forwarded-for': '198.51.100.10, 198.51.100.11',
        }),
      ),
    ).toBe('203.0.113.20')
  })

  test('preserves fallback header precedence when no trusted header is configured', async () => {
    vi.stubEnv('NODE_ENV', 'test')
    const { getClientIpFromHeaders } = await loadRateLimitModule()

    expect(
      getClientIpFromHeaders(
        new Headers({
          'cf-connecting-ip': '203.0.113.30',
          'x-forwarded-for': '198.51.100.20, 198.51.100.21',
          'x-real-ip': '192.0.2.10',
        }),
      ),
    ).toBe('198.51.100.20')
  })
})
