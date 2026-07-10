import { timingSafeEqual } from 'crypto'

import { connection } from 'next/server'

import { DEFAULT_BLOG_HANDLE, getBlog } from '@/lib/blog/operations'
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

const MIN_EXPORT_SECRET_LENGTH = 32
const URL_INVENTORY_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
} as const

type InventorySource = 'products' | 'collections' | 'pages' | 'blog'

class InventorySourceError extends Error {
  constructor(readonly source: InventorySource) {
    super('URL inventory source unavailable')
  }
}

function jsonError(error: string, status: number): Response {
  return Response.json({ error }, { status, headers: URL_INVENTORY_HEADERS })
}

function getBearerToken(authorization: string | null): string | null {
  if (!authorization) return null

  const parts = authorization.trim().split(/\s+/)

  return parts.length === 2 && parts[0]?.toLowerCase() === 'bearer'
    ? (parts[1] ?? null)
    : null
}

function isValidBearerToken(
  candidateSecret: string | null,
  expectedSecret: string,
): boolean {
  if (!candidateSecret) return false

  const candidate = Buffer.from(candidateSecret)
  const expected = Buffer.from(expectedSecret)

  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  )
}

async function loadSource<T>(
  source: InventorySource,
  promise: Promise<T>,
): Promise<T> {
  try {
    return await promise
  } catch {
    throw new InventorySourceError(source)
  }
}

async function loadInventorySources() {
  const [products, collections, pages, blog] = await Promise.all([
    loadSource('products', getAllProducts()),
    loadSource('collections', getCollectionSummaries(250)),
    loadSource('pages', getPages()),
    loadSource('blog', getBlog(DEFAULT_BLOG_HANDLE)),
  ])

  return { products, collections, pages, blog }
}

function countRowsByType(rows: readonly UrlInventoryRow[]) {
  const counts = {
    static: 0,
    legal: 0,
    page: 0,
    product: 0,
    collection: 0,
    blog: 0,
    article: 0,
  }

  for (const row of rows) {
    counts[row.type] += 1
  }

  return counts
}

export async function GET(request: Request): Promise<Response> {
  await connection()

  if (!isSeoUrlExportEnabledFromEnv()) {
    logEvent('info', 'seo_url_export_rejected', {
      reason: 'feature-disabled',
    })
    return jsonError('Not found', 404)
  }

  const expectedSecret = getSeoUrlExportSecret()
  if (!expectedSecret || expectedSecret.length < MIN_EXPORT_SECRET_LENGTH) {
    logEvent('error', 'seo_url_export_rejected', {
      reason: expectedSecret ? 'short-secret' : 'missing-secret',
    })
    return jsonError('URL inventory export unavailable', 500)
  }

  const candidateSecret = getBearerToken(request.headers.get('authorization'))
  if (!isValidBearerToken(candidateSecret, expectedSecret)) {
    logEvent('warn', 'seo_url_export_rejected', {
      reason: 'invalid-authorization',
    })
    return jsonError('Unauthorized', 401)
  }

  let sources: Awaited<ReturnType<typeof loadInventorySources>>

  try {
    sources = await loadInventorySources()
  } catch (error) {
    logEvent('error', 'seo_url_export_failed', {
      reason: 'source-unavailable',
      source: error instanceof InventorySourceError ? error.source : 'blog',
    })
    return jsonError('URL inventory unavailable', 502)
  }

  if (!sources.blog) {
    logEvent('error', 'seo_url_export_failed', {
      reason: 'source-incomplete',
      source: 'blog',
    })
    return jsonError('URL inventory unavailable', 502)
  }

  let rows: UrlInventoryRow[]
  try {
    rows = buildUrlInventoryRows({ ...sources, blog: sources.blog })
  } catch {
    logEvent('error', 'seo_url_export_failed', {
      reason: 'inventory-build-failed',
      source: 'assembly',
    })
    return jsonError('URL inventory unavailable', 502)
  }

  let csv: string
  try {
    csv = serializeUrlInventoryCsv(rows)
  } catch {
    logEvent('error', 'seo_url_export_failed', {
      reason: 'csv-serialization-failed',
      source: 'serialization',
    })
    return jsonError('URL inventory unavailable', 502)
  }

  logEvent('info', 'seo_url_export_completed', {
    countsByType: countRowsByType(rows),
    totalCount: rows.length,
  })

  return new Response(csv, {
    status: 200,
    headers: {
      ...URL_INVENTORY_HEADERS,
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition':
        'attachment; filename="teavision-url-inventory.csv"',
    },
  })
}
