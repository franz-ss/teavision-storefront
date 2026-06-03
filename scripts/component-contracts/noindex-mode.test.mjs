import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'

const readSource = (path) => readFileSync(path, 'utf8')

test('noindex helper exposes an explicit server-side metadata overlay', () => {
  assert.equal(existsSync('src/lib/seo/noindex.ts'), true)

  const source = readSource('src/lib/seo/noindex.ts')

  assert.match(source, /export function isNoindexModeEnabled/)
  assert.match(source, /process\.env\.DISABLE_INDEXING/)
  assert.match(source, /=== 'true'/)
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
  assert.doesNotMatch(robots, /disallow:\s*['"]\/['"]/)
  assert.match(robots, /disallow:\s*\[['"]\/api\/['"]\]/)
})
