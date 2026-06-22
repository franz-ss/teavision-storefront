import { beforeEach, describe, expect, test, vi } from 'vitest'

import { GET } from './route'

const {
  checkRateLimitMock,
  getClientIpFromHeadersMock,
  getSearchaniseSearchResultsMock,
} = vi.hoisted(() => ({
  checkRateLimitMock: vi.fn(),
  getClientIpFromHeadersMock: vi.fn(() => '203.0.113.40'),
  getSearchaniseSearchResultsMock: vi.fn(),
}))

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: checkRateLimitMock,
  getClientIpFromHeaders: getClientIpFromHeadersMock,
}))

vi.mock('@/lib/searchanise/search', () => ({
  getSearchaniseSearchResults: getSearchaniseSearchResultsMock,
}))

async function readJson(response: Response): Promise<unknown> {
  return response.json()
}

describe('search suggestions route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    checkRateLimitMock.mockResolvedValue({
      limited: false,
      remaining: 59,
      resetAt: 1_900_000_000_000,
    })
    getSearchaniseSearchResultsMock.mockResolvedValue({
      products: [],
      status: 'success',
    })
  })

  test('returns an empty product list without rate-limit work for blank queries', async () => {
    const response = await GET(
      new Request('https://teavision.test/api/search/suggestions?q='),
    )

    await expect(readJson(response)).resolves.toEqual({ products: [] })
    expect(checkRateLimitMock).not.toHaveBeenCalled()
    expect(getSearchaniseSearchResultsMock).not.toHaveBeenCalled()
  })

  test('returns safe copy and status 429 when rate limited', async () => {
    checkRateLimitMock.mockResolvedValueOnce({
      limited: true,
      remaining: 0,
      resetAt: 1_900_000_000_000,
    })

    const response = await GET(
      new Request('https://teavision.test/api/search/suggestions?q=sencha'),
    )
    const payload = await readJson(response)

    expect(response.status).toBe(429)
    expect(payload).toEqual({
      message: 'Too many search requests. Please wait a moment.',
      products: [],
    })
    expect(JSON.stringify(payload)).not.toContain('RATE_LIMIT')
    expect(getSearchaniseSearchResultsMock).not.toHaveBeenCalled()
  })

  test('returns safe copy and status 500 when Searchanise throws', async () => {
    getSearchaniseSearchResultsMock.mockRejectedValueOnce(
      new Error('provider exploded'),
    )

    const response = await GET(
      new Request('https://teavision.test/api/search/suggestions?q=sencha'),
    )
    const payload = await readJson(response)

    expect(response.status).toBe(500)
    expect(payload).toEqual({
      message: 'Search suggestions are unavailable',
      products: [],
    })
    expect(JSON.stringify(payload)).not.toContain('provider exploded')
    expect(JSON.stringify(payload)).not.toContain('RATE_LIMIT')
  })
})
