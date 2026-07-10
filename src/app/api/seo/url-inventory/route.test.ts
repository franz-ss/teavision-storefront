import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { getBlog } from '@/lib/blog/operations'
import {
  getSeoUrlExportSecret,
  isSeoUrlExportEnabledFromEnv,
} from '@/lib/env/server'
import { logEvent } from '@/lib/observability/logger'
import {
  buildUrlInventoryRows,
  serializeUrlInventoryCsv,
  type UrlInventoryRow,
} from '@/lib/seo/url-inventory'
import { getCollectionSummaries } from '@/lib/shopify/operations/collection'
import { getAllProducts } from '@/lib/shopify/operations/product'
import { getPages } from '@/lib/shopify/operations/storefront-page'

import { GET } from './route'

const VALID_SECRET = 'phase24-valid-secret-0123456789abcdef'
const SAME_LENGTH_WRONG_SECRET = 'x'.repeat(VALID_SECRET.length)
const PREVIEW_REQUEST_URL =
  'https://phase24-preview.vercel.app/api/seo/url-inventory'
const CANONICAL_URL = 'https://www.teavision.com.au/products/green-tea'
const CSV_BODY =
  '"url","type","lastModified","shouldAppearInSitemap","shouldIndexWhenEnabled"\r\n' +
  `"${CANONICAL_URL}","product","","true","true"\r\n`

const {
  buildUrlInventoryRowsMock,
  getAllProductsMock,
  getBlogMock,
  getCollectionSummariesMock,
  getPagesMock,
  getSeoUrlExportSecretMock,
  isSeoUrlExportEnabledFromEnvMock,
  logEventMock,
  serializeUrlInventoryCsvMock,
} = vi.hoisted(() => ({
  buildUrlInventoryRowsMock: vi.fn(),
  getAllProductsMock: vi.fn(),
  getBlogMock: vi.fn(),
  getCollectionSummariesMock: vi.fn(),
  getPagesMock: vi.fn(),
  getSeoUrlExportSecretMock: vi.fn(),
  isSeoUrlExportEnabledFromEnvMock: vi.fn(),
  logEventMock: vi.fn(),
  serializeUrlInventoryCsvMock: vi.fn(),
}))

vi.mock('@/lib/env/server', () => ({
  getSeoUrlExportSecret: getSeoUrlExportSecretMock,
  isSeoUrlExportEnabledFromEnv: isSeoUrlExportEnabledFromEnvMock,
}))

vi.mock('@/lib/observability/logger', () => ({
  logEvent: logEventMock,
}))

vi.mock('@/lib/seo/url-inventory', () => ({
  buildUrlInventoryRows: buildUrlInventoryRowsMock,
  serializeUrlInventoryCsv: serializeUrlInventoryCsvMock,
}))

vi.mock('@/lib/shopify/operations/product', () => ({
  getAllProducts: getAllProductsMock,
}))

vi.mock('@/lib/shopify/operations/collection', () => ({
  getCollectionSummaries: getCollectionSummariesMock,
}))

vi.mock('@/lib/shopify/operations/storefront-page', () => ({
  getPages: getPagesMock,
}))

vi.mock('@/lib/blog/operations', () => ({
  DEFAULT_BLOG_HANDLE: 'teavision-blogs',
  getBlog: getBlogMock,
}))

const SUCCESS_ROWS: UrlInventoryRow[] = [
  {
    url: CANONICAL_URL,
    type: 'product',
    lastModified: '',
    shouldAppearInSitemap: true,
    shouldIndexWhenEnabled: true,
  },
]

function exportRequest(authorization?: string): Request {
  return new Request(PREVIEW_REQUEST_URL, {
    headers: authorization ? { Authorization: authorization } : undefined,
  })
}

function expectSecurityHeaders(response: Response): void {
  expect(response.headers.get('cache-control')).toBe(
    'private, no-store, max-age=0',
  )
  expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow')
}

function expectNoSourceCalls(): void {
  expect(getAllProducts).not.toHaveBeenCalled()
  expect(getCollectionSummaries).not.toHaveBeenCalled()
  expect(getPages).not.toHaveBeenCalled()
  expect(getBlog).not.toHaveBeenCalled()
}

async function expectJsonFailure(
  response: Response,
  status: number,
  error: string,
): Promise<void> {
  expect(response.status).toBe(status)
  expectSecurityHeaders(response)
  await expect(response.json()).resolves.toEqual({ error })
  expect(response.headers.get('content-type')).not.toContain('text/csv')
  expect(response.headers.get('content-disposition')).toBeNull()
}

function serializedLogCalls(): string {
  return JSON.stringify(vi.mocked(logEvent).mock.calls)
}

function expectLogsToExclude(values: readonly string[]): void {
  const calls = serializedLogCalls()

  for (const value of values) {
    if (!value) continue
    expect(calls).not.toContain(value)
  }
}

describe('SEO URL inventory route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    isSeoUrlExportEnabledFromEnvMock.mockReturnValue(true)
    getSeoUrlExportSecretMock.mockReturnValue(VALID_SECRET)
    getAllProductsMock.mockResolvedValue([{ marker: 'raw-product-payload' }])
    getCollectionSummariesMock.mockResolvedValue([
      { marker: 'raw-collection-payload' },
    ])
    getPagesMock.mockResolvedValue([{ marker: 'raw-page-payload' }])
    getBlogMock.mockResolvedValue({ marker: 'raw-blog-payload' })
    buildUrlInventoryRowsMock.mockReturnValue(SUCCESS_ROWS)
    serializeUrlInventoryCsvMock.mockReturnValue(CSV_BODY)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  test.each([
    ['missing', ''],
    ['false', 'false'],
    ['uppercase TRUE', 'TRUE'],
  ])('conceals the route when the flag is %s', async (_label, flagValue) => {
    vi.stubEnv('SEO_URL_EXPORT_ENABLED', flagValue)
    isSeoUrlExportEnabledFromEnvMock.mockReturnValueOnce(false)

    const response = await GET(exportRequest(`Bearer ${VALID_SECRET}`))

    await expectJsonFailure(response, 404, 'Not found')
    expect(isSeoUrlExportEnabledFromEnv).toHaveBeenCalledTimes(1)
    expect(getSeoUrlExportSecret).not.toHaveBeenCalled()
    expectNoSourceCalls()
    expect(logEvent).toHaveBeenCalledWith('info', 'seo_url_export_rejected', {
      reason: 'feature-disabled',
    })
  })

  test.each([
    ['missing', undefined],
    ['trimmed short', 'configured-too-short'],
  ])(
    'fails closed when the configured secret is %s',
    async (_label, secret) => {
      getSeoUrlExportSecretMock.mockReturnValueOnce(secret)

      const response = await GET(exportRequest(`Bearer ${VALID_SECRET}`))

      await expectJsonFailure(response, 500, 'URL inventory export unavailable')
      expectNoSourceCalls()
      expectLogsToExclude([VALID_SECRET, 'configured-too-short'])
    },
  )

  test.each([
    ['missing', undefined],
    ['wrong scheme', `Basic ${VALID_SECRET}`],
    ['missing token', 'Bearer'],
    ['extra part', `Bearer ${VALID_SECRET} extra`],
    ['wrong length', 'Bearer wrong'],
    ['same length but wrong', `Bearer ${SAME_LENGTH_WRONG_SECRET}`],
  ])('rejects a %s authorization credential', async (_label, authorization) => {
    const response = await GET(exportRequest(authorization))

    await expectJsonFailure(response, 401, 'Unauthorized')
    expectNoSourceCalls()
    expectLogsToExclude([
      VALID_SECRET,
      SAME_LENGTH_WRONG_SECRET,
      authorization ?? '',
      PREVIEW_REQUEST_URL,
    ])
  })

  test('does not accept a query-string secret fallback', async () => {
    const request = new Request(`${PREVIEW_REQUEST_URL}?secret=${VALID_SECRET}`)

    const response = await GET(request)

    await expectJsonFailure(response, 401, 'Unauthorized')
    expectNoSourceCalls()
  })

  test('returns a canonical CSV attachment independently of noindex mode', async () => {
    vi.stubEnv('DISABLE_INDEXING', 'true')

    const response = await GET(exportRequest(`bEaReR ${VALID_SECRET}`))
    const body = await response.text()

    expect(response.status).toBe(200)
    expectSecurityHeaders(response)
    expect(response.headers.get('content-type')).toBe('text/csv; charset=utf-8')
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="teavision-url-inventory.csv"',
    )
    expect(body).toBe(CSV_BODY)
    expect(body).toContain(CANONICAL_URL)
    expect(body).not.toContain('phase24-preview.vercel.app')
    expect(getAllProducts).toHaveBeenCalledTimes(1)
    expect(getCollectionSummaries).toHaveBeenCalledTimes(1)
    expect(getCollectionSummaries).toHaveBeenCalledWith(250)
    expect(getPages).toHaveBeenCalledTimes(1)
    expect(getBlog).toHaveBeenCalledTimes(1)
    expect(getBlog).toHaveBeenCalledWith('teavision-blogs')
    expect(buildUrlInventoryRows).toHaveBeenCalledTimes(1)
    expect(serializeUrlInventoryCsv).toHaveBeenCalledWith(SUCCESS_ROWS)
    expect(logEvent).toHaveBeenCalledWith('info', 'seo_url_export_completed', {
      countsByType: {
        static: 0,
        legal: 0,
        page: 0,
        product: 1,
        collection: 0,
        blog: 0,
        article: 0,
      },
      totalCount: 1,
    })
    expectLogsToExclude([
      VALID_SECRET,
      'Authorization',
      PREVIEW_REQUEST_URL,
      CSV_BODY,
      CANONICAL_URL,
      'green-tea',
      'raw-product-payload',
      'raw-collection-payload',
      'raw-page-payload',
      'raw-blog-payload',
    ])
  })

  test.each([
    ['products', () => getAllProductsMock.mockRejectedValueOnce(new Error())],
    [
      'collections',
      () => getCollectionSummariesMock.mockRejectedValueOnce(new Error()),
    ],
    ['pages', () => getPagesMock.mockRejectedValueOnce(new Error())],
    ['blog', () => getBlogMock.mockRejectedValueOnce(new Error())],
  ])(
    'fails closed when the %s source rejects',
    async (source, rejectSource) => {
      rejectSource()

      const response = await GET(exportRequest(`Bearer ${VALID_SECRET}`))

      await expectJsonFailure(response, 502, 'URL inventory unavailable')
      expect(buildUrlInventoryRows).not.toHaveBeenCalled()
      expect(serializeUrlInventoryCsv).not.toHaveBeenCalled()
      expect(logEvent).toHaveBeenCalledWith('error', 'seo_url_export_failed', {
        reason: 'source-unavailable',
        source,
      })
    },
  )

  test('fails closed when the canonical blog is missing', async () => {
    getBlogMock.mockResolvedValueOnce(null)

    const response = await GET(exportRequest(`Bearer ${VALID_SECRET}`))

    await expectJsonFailure(response, 502, 'URL inventory unavailable')
    expect(buildUrlInventoryRows).not.toHaveBeenCalled()
    expect(serializeUrlInventoryCsv).not.toHaveBeenCalled()
    expect(logEvent).toHaveBeenCalledWith('error', 'seo_url_export_failed', {
      reason: 'source-incomplete',
      source: 'blog',
    })
  })

  test('secures an inventory assembly exception without leaking it', async () => {
    const sensitiveSentinel = 'sensitive-builder-exception-value'
    buildUrlInventoryRowsMock.mockImplementationOnce(() => {
      throw new Error(sensitiveSentinel)
    })

    const response = await GET(exportRequest(`Bearer ${VALID_SECRET}`))

    await expectJsonFailure(response, 502, 'URL inventory unavailable')
    expect(serializeUrlInventoryCsv).not.toHaveBeenCalled()
    expect(logEvent).toHaveBeenCalledWith('error', 'seo_url_export_failed', {
      reason: 'inventory-build-failed',
      source: 'assembly',
    })
    expectLogsToExclude([
      sensitiveSentinel,
      VALID_SECRET,
      PREVIEW_REQUEST_URL,
      CSV_BODY,
    ])
  })

  test('secures a CSV serialization exception without leaking it', async () => {
    const sensitiveSentinel = 'sensitive-serializer-exception-value'
    serializeUrlInventoryCsvMock.mockImplementationOnce(() => {
      throw new Error(sensitiveSentinel)
    })

    const response = await GET(exportRequest(`Bearer ${VALID_SECRET}`))

    await expectJsonFailure(response, 502, 'URL inventory unavailable')
    expect(logEvent).toHaveBeenCalledWith('error', 'seo_url_export_failed', {
      reason: 'csv-serialization-failed',
      source: 'serialization',
    })
    expectLogsToExclude([
      sensitiveSentinel,
      VALID_SECRET,
      PREVIEW_REQUEST_URL,
      CSV_BODY,
      CANONICAL_URL,
    ])
  })
})
