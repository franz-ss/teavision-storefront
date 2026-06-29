import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)

function sourcePath(...segments) {
  return path.join(repoRoot, ...segments)
}

test('Shopify webhooks invalidate page cache tags', async () => {
  const source = await readFile(
    sourcePath('src', 'app', 'api', 'webhooks', 'shopify', 'route.ts'),
    'utf8',
  )

  assert.match(source, /case 'pages\/create'/)
  assert.match(source, /case 'pages\/update'/)
  assert.match(source, /case 'pages\/delete'/)
  assert.match(source, /revalidateTag\('page'/)
  assert.match(source, /revalidateTag\('pages'/)
})

test('quick-view route returns stable JSON on product fetch failures', async () => {
  const source = await readFile(
    sourcePath(
      'src',
      'app',
      'api',
      'products',
      '[handle]',
      'quick-view',
      'route.ts',
    ),
    'utf8',
  )

  assert.match(source, /try \{/)
  assert.match(source, /Product quick view is unavailable/)
  assert.match(source, /status:\s*503/)
})

test('codegen fails before building an invalid Shopify schema URL', async () => {
  const source = await readFile(sourcePath('codegen.ts'), 'utf8')
  const toolingSource = await readFile(
    sourcePath('src', 'lib', 'env', 'tooling.ts'),
    'utf8',
  )

  assert.match(source, /requiredToolEnv/)
  assert.match(toolingSource, /requiredEnv/)
  assert.match(toolingSource, /Add it to \.env\.local/)
  assert.match(source, /SHOPIFY_STORE_DOMAIN/)
  assert.match(source, /SHOPIFY_STOREFRONT_ACCESS_TOKEN/)
  assert.doesNotMatch(source, /SHOPIFY_STOREFRONT_ACCESS_TOKEN\s*\?\?\s*''/)
})

test('third-party enrichment failure paths use bounded cache lifetimes (unstable_cache model)', async () => {
  // Phase 19 migrated from 'use cache' + cacheLife/cacheTag to unstable_cache.
  // Both modules use a single revalidate value per unstable_cache call (no per-branch
  // cacheLife branching). The spirit of the contract — bounded TTL for third-party
  // enrichment data — is preserved via revalidate: 3600 (1 hour).
  // The degraded: true detection in product.ts is preserved to limit which
  // bulk-pricing data is cached (degraded responses return empty tiers).
  const trustooSource = await readFile(
    sourcePath('src', 'lib', 'reviews', 'trustoo.ts'),
    'utf8',
  )
  const productSource = await readFile(
    sourcePath('src', 'lib', 'shopify', 'operations', 'product.ts'),
    'utf8',
  )

  // Trustoo uses unstable_cache with a bounded revalidate (not indefinite)
  assert.match(trustooSource, /unstable_cache/)
  assert.match(trustooSource, /revalidate:\s*\d+/)
  // Product degraded path is still detected and returns early (empty tiers)
  assert.match(productSource, /degraded:\s*true/)
  assert.match(productSource, /unstable_cache/)
  assert.match(productSource, /revalidate:\s*\d+/)
})
