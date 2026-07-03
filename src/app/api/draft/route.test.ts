import { beforeEach, describe, expect, test, vi } from 'vitest'

import { getSanityPreviewSecret } from '@/lib/sanity/env'
import { getDraftHomepage } from '@/lib/sanity/home-page'

import { GET } from './route'

const VALID_SECRET = 'preview-secret-0123456789abcdefg'

const { draftModeMock, enableMock, getDraftHomepageMock, getPreviewSecretMock } =
  vi.hoisted(() => ({
    draftModeMock: vi.fn(),
    enableMock: vi.fn(),
    getDraftHomepageMock: vi.fn(),
    getPreviewSecretMock: vi.fn(),
  }))

vi.mock('next/headers', () => ({
  draftMode: draftModeMock,
}))

vi.mock('@/lib/observability/logger', () => ({
  logEvent: vi.fn(),
}))

vi.mock('@/lib/sanity/env', () => ({
  getSanityPreviewSecret: getPreviewSecretMock,
}))

vi.mock('@/lib/sanity/home-page', () => ({
  getDraftHomepage: getDraftHomepageMock,
}))

function draftRequest(search: string): Request {
  return new Request(`https://teavision.test/api/draft${search}`)
}

describe('draft enable route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    draftModeMock.mockResolvedValue({ enable: enableMock })
    getPreviewSecretMock.mockReturnValue(VALID_SECRET)
    getDraftHomepageMock.mockResolvedValue({ id: 'homePage' })
  })

  test('returns 500 when the preview secret is not configured', async () => {
    getPreviewSecretMock.mockImplementationOnce(() => {
      throw new Error('Missing required environment variable')
    })

    const response = await GET(draftRequest('?secret=anything&slug=/'))
    const payload = await response.json()

    expect(response.status).toBe(500)
    expect(payload).toEqual({ error: 'Preview secret not configured' })
    expect(draftModeMock).not.toHaveBeenCalled()
    expect(getDraftHomepage).not.toHaveBeenCalled()
  })

  test('returns 401 for an invalid preview secret', async () => {
    const response = await GET(draftRequest('?secret=wrong-secret&slug=/'))
    const payload = await response.json()

    expect(response.status).toBe(401)
    expect(payload).toEqual({ error: 'Invalid preview secret' })
    expect(draftModeMock).not.toHaveBeenCalled()
    expect(getDraftHomepage).not.toHaveBeenCalled()
  })

  test.each([
    ['missing slug', `?secret=${VALID_SECRET}`],
    ['non-homepage path', `?secret=${VALID_SECRET}&slug=/tea`],
    [
      'absolute URL',
      `?secret=${VALID_SECRET}&slug=https://evil.test/`,
    ],
    [
      'protocol-relative URL',
      `?secret=${VALID_SECRET}&slug=//evil.test/`,
    ],
    [
      'encoded protocol-relative URL',
      `?secret=${VALID_SECRET}&slug=%2F%2Fevil.test/`,
    ],
  ])('returns 400 for an unsafe slug: %s', async (_label, search) => {
    const response = await GET(draftRequest(search))
    const payload = await response.json()

    expect(response.status).toBe(400)
    expect(payload).toEqual({ error: 'Invalid preview slug' })
    expect(draftModeMock).not.toHaveBeenCalled()
    expect(getDraftHomepage).not.toHaveBeenCalled()
  })

  test('returns 404 without enabling Draft Mode when the draft homepage is missing', async () => {
    getDraftHomepageMock.mockRejectedValueOnce(new Error('missing homePage'))

    const response = await GET(
      draftRequest(`?secret=${VALID_SECRET}&slug=/`),
    )
    const payload = await response.json()

    expect(response.status).toBe(404)
    expect(payload).toEqual({ error: 'Draft homepage not found' })
    expect(draftModeMock).not.toHaveBeenCalled()
    expect(getDraftHomepage).toHaveBeenCalledTimes(1)
  })

  test('enables Draft Mode and redirects to the homepage for a valid request', async () => {
    const response = await GET(
      draftRequest(`?secret=${VALID_SECRET}&slug=/`),
    )

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('https://teavision.test/')
    expect(getSanityPreviewSecret).toHaveBeenCalledTimes(1)
    expect(getDraftHomepage).toHaveBeenCalledTimes(1)
    expect(draftModeMock).toHaveBeenCalledTimes(1)
    expect(enableMock).toHaveBeenCalledTimes(1)
  })
})
