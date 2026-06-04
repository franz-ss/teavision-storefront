import type { Mock } from 'vitest'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { getProduct } from '@/lib/shopify/operations/product'
import { makeProduct } from '@/tests/fixtures/shopify/product'

import { GET } from './route'

vi.mock('@/lib/shopify/operations/product', () => ({
  getProduct: vi.fn(),
}))

const getProductMock = getProduct as unknown as Mock<
  (handle: string) => Promise<ReturnType<typeof makeProduct> | null>
>

function routeContext(handle: string) {
  return { params: Promise.resolve({ handle }) }
}

describe('quick-view route', () => {
  beforeEach(() => {
    getProductMock.mockReset()
  })

  test('returns quick-view product details for a product', async () => {
    getProductMock.mockResolvedValue(
      makeProduct({ handle: 'test-standard-tea' }),
    )

    const response = await GET(
      new Request('http://localhost'),
      routeContext('test-standard-tea'),
    )
    const payload = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(200)
    expect(payload).toMatchObject({
      description: expect.any(String),
      handle: 'test-standard-tea',
      id: expect.any(String),
      title: expect.any(String),
    })
    expect(payload).toHaveProperty('variants')
    expect(payload).not.toHaveProperty('descriptionHtml')
    expect(payload).not.toHaveProperty('tags')
  })

  test('returns 404 for a missing product', async () => {
    getProductMock.mockResolvedValue(null)

    const response = await GET(
      new Request('http://localhost'),
      routeContext('missing'),
    )

    await expect(response.json()).resolves.toEqual({
      message: 'Product not found',
    })
    expect(response.status).toBe(404)
  })

  test('returns 503 when the product fetch fails', async () => {
    getProductMock.mockRejectedValue(new Error('Shopify unavailable'))

    const response = await GET(
      new Request('http://localhost'),
      routeContext('tea'),
    )

    await expect(response.json()).resolves.toEqual({
      message: 'Product quick view is unavailable',
    })
    expect(response.status).toBe(503)
  })
})
