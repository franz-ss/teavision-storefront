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

test('rate-limit helper documents production fallback explicitly', async () => {
  const source = await readFile(
    sourcePath('src', 'lib', 'rate-limit', 'index.ts'),
    'utf8',
  )
  const envSource = await readFile(
    sourcePath('src', 'lib', 'env', 'server.ts'),
    'utf8',
  )

  assert.match(source, /export type RateLimitStore/)
  assert.match(source, /shouldWarnAboutRateLimitMemoryFallback/)
  assert.match(envSource, /RATE_LIMIT_EXTERNAL_PROTECTION/)
  assert.match(envSource, /RATE_LIMIT_ALLOW_MEMORY_FALLBACK/)
  assert.match(envSource, /RATE_LIMIT_TRUSTED_IP_HEADER/)
  assert.match(envSource, /isRateLimitProductionExplicit/)
  assert.match(envSource, /getRateLimitTrustedIpHeader/)
  assert.match(source, /console\.warn/)
})

test('contact and search use the shared rate-limit helper', async () => {
  const contactSource = await readFile(
    sourcePath('src', 'lib', 'contact', 'actions.ts'),
    'utf8',
  )
  const searchSource = await readFile(
    sourcePath('src', 'app', 'api', 'search', 'suggestions', 'route.ts'),
    'utf8',
  )

  assert.match(contactSource, /checkRateLimit/)
  assert.match(searchSource, /checkRateLimit/)
  assert.match(searchSource, /status:\s*429/)
})
