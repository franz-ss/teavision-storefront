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

test('account login bridge keeps the shared account geometry stable', async () => {
  const wrapperFiles = [
    sourcePath('src', 'app', '(storefront)', 'account', 'layout.tsx'),
    sourcePath('src', 'app', '(storefront)', 'account', 'page.tsx'),
    sourcePath('src', 'app', '(storefront)', 'account', 'loading.tsx'),
    sourcePath('src', 'app', '(storefront)', 'account', 'login', 'page.tsx'),
  ]
  const wrapperSources = await Promise.all(
    wrapperFiles.map((filePath) => readFile(filePath, 'utf8')),
  )

  for (const source of wrapperSources) {
    assert.ok(
      /min-h-\[34rem\]/.test(source) || /min-h-136/.test(source),
      'account wrappers should keep 34rem minimum height',
    )
    assert.ok(
      /md:min-h-\[32rem\]/.test(source) || /md:min-h-128/.test(source),
      'account wrappers should keep 32rem medium breakpoint minimum height',
    )
  }

  const login = wrapperSources[3]
  const loginPanel = await readFile(
    sourcePath(
      'src',
      'app',
      '(storefront)',
      'account',
      '_components',
      'login-panel',
      'login-panel.tsx',
    ),
    'utf8',
  )

  assert.match(loginPanel, /min-h-72/)
  assert.match(loginPanel, /content-start/)
  assert.match(loginPanel, /prefetch=\{false\}/)
  assert.doesNotMatch(login, /<Section\.Root/)
  assert.doesNotMatch(login, /<Section\.Container/)
})
