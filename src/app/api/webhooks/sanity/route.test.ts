import { revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { logEvent } from '@/lib/observability/logger'

import { POST } from './route'

const {
  getSanityRevalidateSecretMock,
  logEventMock,
  parseBodyMock,
  revalidateTagMock,
} = vi.hoisted(() => ({
  getSanityRevalidateSecretMock: vi.fn(),
  logEventMock: vi.fn(),
  parseBodyMock: vi.fn(),
  revalidateTagMock: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidateTag: revalidateTagMock,
}))

vi.mock('next-sanity/webhook', () => ({
  parseBody: parseBodyMock,
}))

vi.mock('@/lib/observability/logger', () => ({
  logEvent: logEventMock,
}))

vi.mock('@/lib/sanity/env', () => ({
  getSanityRevalidateSecret: getSanityRevalidateSecretMock,
}))

function webhookRequest(): Request {
  return new Request('https://teavision.test/api/webhooks/sanity', {
    method: 'POST',
  })
}

describe('Sanity webhook route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getSanityRevalidateSecretMock.mockReturnValue('sanity-webhook-secret')
    parseBodyMock.mockResolvedValue({
      body: { _type: 'blog' },
      isValidSignature: true,
    })
  })

  test('revalidates only homepage tags for signed homePage payloads', async () => {
    parseBodyMock.mockResolvedValueOnce({
      body: { _type: 'homePage', slug: { current: '/' } },
      isValidSignature: true,
    })

    const response = await POST(webhookRequest())

    await expect(response.json()).resolves.toEqual({ revalidated: true })
    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledWith('homePage', { expire: 0 })
    expect(revalidateTag).toHaveBeenCalledWith('sanity-homepage', {
      expire: 0,
    })
    expect(revalidateTag).not.toHaveBeenCalledWith('blog', { expire: 0 })
    expect(logEvent).toHaveBeenCalledWith(
      'info',
      'sanity_webhook_received',
      expect.objectContaining({
        documentType: 'homePage',
        hasArticleSlug: false,
        hasBlogSlug: false,
        status: 'accepted',
      }),
    )
  })

  test('preserves existing blog tag revalidation behavior', async () => {
    parseBodyMock.mockResolvedValueOnce({
      body: { _type: 'blog', slug: { current: 'teavision-blogs' } },
      isValidSignature: true,
    })

    const response = await POST(webhookRequest())

    await expect(response.json()).resolves.toEqual({ revalidated: true })
    expect(revalidateTag).toHaveBeenCalledWith('blog', { expire: 0 })
    expect(revalidateTag).toHaveBeenCalledWith('blog-teavision-blogs', {
      expire: 0,
    })
    expect(revalidateTag).not.toHaveBeenCalledWith('homePage', { expire: 0 })
    expect(revalidateTag).not.toHaveBeenCalledWith('sanity-homepage', {
      expire: 0,
    })
  })

  test('preserves existing blog post tag revalidation behavior', async () => {
    parseBodyMock.mockResolvedValueOnce({
      body: {
        _type: 'blogPost',
        blog: { current: 'teavision-blogs' },
        slug: { current: 'article-slug' },
      },
      isValidSignature: true,
    })

    const response = await POST(webhookRequest())

    await expect(response.json()).resolves.toEqual({ revalidated: true })
    expect(revalidateTag).toHaveBeenCalledWith('blog', { expire: 0 })
    expect(revalidateTag).toHaveBeenCalledWith('blog-teavision-blogs', {
      expire: 0,
    })
    expect(revalidateTag).toHaveBeenCalledWith(
      'article-teavision-blogs-article-slug',
      { expire: 0 },
    )
  })

  test('rejects invalid signatures without revalidating tags', async () => {
    parseBodyMock.mockResolvedValueOnce({
      body: { _type: 'homePage' },
      isValidSignature: false,
    })

    const response = await POST(webhookRequest())

    await expect(response.json()).resolves.toEqual({
      error: 'Invalid webhook signature',
    })
    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  test('rejects invalid payloads without revalidating tags', async () => {
    parseBodyMock.mockRejectedValueOnce(new Error('invalid payload'))

    const response = await POST(webhookRequest())

    await expect(response.json()).resolves.toEqual({
      error: 'Invalid webhook payload',
    })
    expect(response.status).toBe(400)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  test('rejects missing webhook secret without parsing the body', async () => {
    getSanityRevalidateSecretMock.mockImplementationOnce(() => {
      throw new Error('missing secret')
    })

    const response = await POST(webhookRequest())

    await expect(response.json()).resolves.toEqual({
      error: 'Webhook secret not configured',
    })
    expect(response.status).toBe(500)
    expect(parseBody).not.toHaveBeenCalled()
    expect(revalidateTag).not.toHaveBeenCalled()
  })
})
