import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { readFile } from 'node:fs/promises'

const repoRoot = process.cwd()

function sourcePath(...segments) {
  return path.join(repoRoot, ...segments)
}

async function readSource(...segments) {
  return readFile(sourcePath(...segments), 'utf8')
}

const AUDIT_TARGET_TITLE_FILES = [
  [
    'src',
    'app',
    '(storefront)',
    'pages',
    'bulk-wholesale-supply',
    '_lib',
    'data.ts',
  ],
  ['src', 'app', '(storefront)', 'pages', 'contact', 'page.tsx'],
  ['src', 'app', '(storefront)', 'pages', 'custom-tea-blends', 'page.tsx'],
  ['src', 'app', '(storefront)', 'pages', 'faq', '_lib', 'data.ts'],
  ['src', 'app', '(storefront)', 'pages', 'faq', 'page.tsx'],
  ['src', 'app', '(storefront)', 'pages', 'private-label-packing', 'page.tsx'],
  ['src', 'app', '(storefront)', 'pages', 'tea-bag-manufacturer', 'page.tsx'],
  ['src', 'app', '(storefront)', 'pages', 'wholesale', 'page.tsx'],
]

test('SEO-audit target page titles do not carry the automatic brand suffix', async () => {
  for (const segments of AUDIT_TARGET_TITLE_FILES) {
    const source = await readSource(...segments)

    assert.doesNotMatch(
      source,
      /(?:PAGE_TITLE|FAQ_PAGE_TITLE|CUSTOM_TEA_BLEND_META_TITLE)\s*=\s*['"][^'"]*\|\s*Teavision['"]/,
      segments.join('/'),
    )
    assert.doesNotMatch(
      source,
      /title:\s*(?:\{\s*absolute:\s*)?['"][^'"]*\|\s*Teavision['"]/,
      segments.join('/'),
    )
  }
})

test('blog listing fallback cannot add a second H1 beside the real blog title', async () => {
  const listingPageSource = await readSource(
    'src',
    'app',
    '(storefront)',
    'blogs',
    '[blog]',
    '_components',
    'listing-page.tsx',
  )

  assert.match(listingPageSource, /fallback=\{<Hero[^}]*headingLevel="p"/s)
})

test('bulk wholesale supply page exposes its hero title as the visible H1', async () => {
  const heroSource = await readSource(
    'src',
    'app',
    '(storefront)',
    'pages',
    'bulk-wholesale-supply',
    '_components',
    'hero-section.tsx',
  )

  assert.match(heroSource, /<h1\b/)
  assert.doesNotMatch(heroSource, /<h2\b[^>]*type-heading-01/)
})
