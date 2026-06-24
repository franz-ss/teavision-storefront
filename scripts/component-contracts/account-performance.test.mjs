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
  const layout = await readFile(
    sourcePath('src', 'app', '(storefront)', 'account', 'layout.tsx'),
    'utf8',
  )
  const page = await readFile(
    sourcePath('src', 'app', '(storefront)', 'account', 'page.tsx'),
    'utf8',
  )
  const loading = await readFile(
    sourcePath('src', 'app', '(storefront)', 'account', 'loading.tsx'),
    'utf8',
  )
  const login = await readFile(
    sourcePath('src', 'app', '(storefront)', 'account', 'login', 'page.tsx'),
    'utf8',
  )

  for (const source of [layout, page, loading, login]) {
    assert.match(source, /min-h-136/)
    assert.match(source, /md:min-h-128/)
  }

  assert.doesNotMatch(login, /<Section\.Root/)
  assert.doesNotMatch(login, /<Section\.Container/)
})
