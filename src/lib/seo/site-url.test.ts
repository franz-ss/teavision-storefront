import { afterEach, describe, expect, test, vi } from 'vitest'

async function loadSiteUrlModule() {
  vi.resetModules()
  return import('./site-url')
}

describe('site URL config', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test('uses the canonical default outside production when unset', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('SITE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')

    const { getSiteUrl } = await loadSiteUrlModule()

    expect(getSiteUrl('/collections')).toBe(
      'https://www.teavision.com.au/collections',
    )
  })

  test('requires an explicit site URL in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SITE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')

    await expect(loadSiteUrlModule()).rejects.toThrow(
      'Missing required environment variable: SITE_URL',
    )
  })

  test('normalizes configured site URLs to an origin', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SITE_URL', 'https://example.com/path?q=1')

    const { SITE_URL, getSiteUrl } = await loadSiteUrlModule()

    expect(SITE_URL).toBe('https://example.com')
    expect(getSiteUrl('/products/sencha')).toBe(
      'https://example.com/products/sencha',
    )
  })

  test('normalizes the Teavision apex host to the strongest www URL', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SITE_URL', 'https://teavision.com.au/path?q=1')

    const { SITE_URL, getSiteUrl } = await loadSiteUrlModule()

    expect(SITE_URL).toBe('https://www.teavision.com.au')
    expect(getSiteUrl('/products/sencha')).toBe(
      'https://www.teavision.com.au/products/sencha',
    )
  })
})
