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

test('Next config applies the shared security header baseline', async () => {
  const nextConfigSource = await readFile(sourcePath('next.config.ts'), 'utf8')
  const securityHeadersSource = await readFile(
    sourcePath('src', 'lib', 'security', 'headers.ts'),
    'utf8',
  )

  assert.match(nextConfigSource, /poweredByHeader:\s*false/)
  assert.match(nextConfigSource, /headers\(\)/)
  assert.match(securityHeadersSource, /Strict-Transport-Security/)
  assert.match(securityHeadersSource, /Content-Security-Policy-Report-Only/)
  assert.match(securityHeadersSource, /X-Content-Type-Options/)
  assert.match(securityHeadersSource, /Permissions-Policy/)
  assert.doesNotMatch(securityHeadersSource, /googletagmanager\.com/)
  assert.doesNotMatch(securityHeadersSource, /google-analytics\.com/)
  assert.doesNotMatch(securityHeadersSource, /facebook\.net/)
  assert.doesNotMatch(securityHeadersSource, /klaviyo/)
})
