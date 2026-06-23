import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'

const readSource = (path) => readFileSync(path, 'utf8')

test('noindex helper exposes an explicit server-side metadata overlay', () => {
  assert.equal(existsSync('src/lib/seo/noindex.ts'), true)

  const source = readSource('src/lib/seo/noindex.ts')
  const envSource = readSource('src/lib/env/server.ts')
  const envExampleSource = readSource('.env.example')

  assert.match(source, /export function isNoindexModeEnabled/)
  assert.match(source, /isNoindexModeEnabledFromEnv/)
  assert.match(envSource, /DISABLE_INDEXING/)
  assert.match(envExampleSource, /DISABLE_INDEXING=true/)
  assert.match(envSource, /truthyEnv/)
  assert.match(source, /export function withNoindexRobots/)
  assert.match(source, /index: false/)
  assert.match(source, /follow: false/)
  assert.match(source, /noarchive: true/)
  assert.doesNotMatch(source, /NEXT_PUBLIC_DISABLE_INDEXING/)
})

test('metadata, robots, and sitemap routes use shared noindex controls', () => {
  const layout = readSource('src/app/layout.tsx')
  const robots = readSource('src/app/robots.ts')
  const sitemap = readSource('src/app/sitemap.ts')

  assert.match(layout, /withNoindexRobots/)
  assert.match(robots, /isNoindexModeEnabled/)
  assert.match(sitemap, /isNoindexModeEnabled/)
  assert.match(
    sitemap,
    /if\s*\(\s*isNoindexModeEnabled\(\)\s*\)\s*{\s*return\s*\[\]\s*}/s,
  )
  assert.doesNotMatch(robots, /disallow:\s*['"]\/['"]/)
  assert.match(robots, /disallow:\s*\[['"]\/api\/['"]\]/)
})

test('sitemap static coverage is driven by the launch route matrix', () => {
  const sitemap = readSource('src/app/sitemap.ts')
  const matrix = readSource('src/lib/seo/launch-route-matrix.ts')
  const policies = readSource('src/lib/legal/policies.ts')

  assert.match(sitemap, /getLaunchSeoRouteExpectations/)
  assert.match(sitemap, /shouldAppearInSitemap/)
  assert.match(matrix, /LEGAL_POLICIES\.map/)
  assert.match(matrix, /policy\.sitemap/)

  for (const path of [
    '/pages/privacy-policy',
    '/pages/shipping-policy',
    '/pages/refund-policy',
    '/pages/terms-of-service',
    '/pages/cookie-preferences',
  ]) {
    assert.match(policies, new RegExp(path.replaceAll('/', '\\/')))
  }

  for (const path of [
    '/pages/bulk-wholesale-supply',
    '/pages/private-label-packing',
    '/pages/tea-bag-manufacturer',
    '/pages/new-product-development-order-form',
  ]) {
    assert.match(matrix, new RegExp(path.replaceAll('/', '\\/')))
  }

  assert.match(matrix, /path:\s*'\/search'/)
  assert.match(matrix, /path:\s*'\/search'[\s\S]*?shouldAppearInSitemap:\s*false/)
})
