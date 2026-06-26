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

test('collection page fallback is real content, not a visible loading shell', async () => {
  const source = await readFile(
    sourcePath(
      'src',
      'app',
      '(storefront)',
      'collections',
      '[handle]',
      'page.tsx',
    ),
    'utf8',
  )

  assert.doesNotMatch(source, /Loading collection/)
  assert.doesNotMatch(source, /LoadingSkeleton/)
  assert.doesNotMatch(source, /staticShell/)
  assert.doesNotMatch(source, /getCollectionHandleSamples/)
})

test('base collection page resolves to content after search params settle', async () => {
  const source = await readFile(
    sourcePath(
      'src',
      'app',
      '(storefront)',
      'collections',
      '[handle]',
      'page.tsx',
    ),
    'utf8',
  )

  assert.doesNotMatch(source, /searchParams\.then[\s\S]*:\s*null/)
  assert.match(
    source,
    /<PageContent\s+params=\{params\}\s+searchParams=\{searchParams\}\s*\/>/,
  )
  assert.equal(source.match(/<PageContent\b/g)?.length, 1)
})

test('product page fallback is real content, not a broad skeleton shell', async () => {
  const source = await readFile(
    sourcePath(
      'src',
      'app',
      '(storefront)',
      'products',
      '[handle]',
      'page.tsx',
    ),
    'utf8',
  )

  assert.doesNotMatch(source, /Loading product/)
  assert.doesNotMatch(source, /<Skeleton\b/)
  assert.doesNotMatch(source, /getProductHandleSamples/)
})

test('base product page resolves to content after search params settle', async () => {
  const source = await readFile(
    sourcePath(
      'src',
      'app',
      '(storefront)',
      'products',
      '[handle]',
      'page.tsx',
    ),
    'utf8',
  )

  assert.doesNotMatch(source, /searchParams\.then[\s\S]*:\s*null/)
  assert.match(
    source,
    /<ProductContent\s+params=\{params\}\s+searchParams=\{searchParams\}\s*\/>/,
  )
  assert.equal(source.match(/<ProductContent\b/g)?.length, 1)
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
