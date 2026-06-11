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

test('collection page renders server content without a visible loading fallback', async () => {
  const source = await readFile(
    sourcePath('src', 'app', '(storefront)', 'collections', '[handle]', 'page.tsx'),
    'utf8',
  )

  assert.doesNotMatch(source, /Loading collection/)
  assert.doesNotMatch(source, /fallback=\{/)
})

test('collection product listing keeps deliberate spacing below the hero', async () => {
  const source = await readFile(
    sourcePath(
      'src',
      'app',
      '(storefront)',
      'collections',
      '[handle]',
      '_components',
      'page-content.tsx',
    ),
    'utf8',
  )

  assert.match(source, /className="pt-8 md:pt-10"/)
  assert.doesNotMatch(source, /className="pt-0 md:pt-0"/)
})
