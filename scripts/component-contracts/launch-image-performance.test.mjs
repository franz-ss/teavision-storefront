import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)

const imageBudgets = [
  ['public/images/homepage/homepage-hero-tea-harvest-lcp.avif', 350000],
  ['public/images/homepage/bulk-wholesale-lcp.avif', 120000],
]

const sourceFiles = [
  'src/components/homepage/hero/hero.tsx',
  'src/components/product/product-gallery/product-gallery.tsx',
  'src/components/collection/product-card/product-card.tsx',
  'src/app/(storefront)/collections/[handle]/_components/hero.tsx',
  'src/app/(storefront)/collections/[handle]/_components/collection-rich-hero.tsx',
]

function sourcePath(relativePath) {
  return path.join(repoRoot, ...relativePath.split('/'))
}

async function readSource(relativePath) {
  return readFile(sourcePath(relativePath), 'utf8')
}

function imageBlocks(source) {
  return source.match(/<Image[\s\S]*?\/>/g) ?? []
}

test('launch-critical AVIF assets stay within byte budgets', async () => {
  for (const [relativePath, maxBytes] of imageBudgets) {
    const file = await stat(sourcePath(relativePath))
    assert.ok(file.isFile(), `${relativePath} should exist`)
    assert.ok(
      file.size <= maxBytes,
      `${relativePath} should be <= ${maxBytes} bytes, received ${file.size}`,
    )
  }
})

test('home and fake Shopify LCP routes use the launch AVIF sources', async () => {
  const homeContent = await readSource('src/components/homepage/content.ts')
  const fakeShopify = await readSource('tests/mocks/shopify-graphql-server.ts')

  assert.match(homeContent, /homepage-hero-tea-harvest-lcp\.avif/)
  assert.match(fakeShopify, /bulk-wholesale-lcp\.avif/)
})

test('launch image components avoid deprecated priority and invalid preload combinations', async () => {
  for (const relativePath of sourceFiles) {
    const source = await readSource(relativePath)
    const blocks = imageBlocks(source)

    assert.ok(blocks.length > 0, `${relativePath} should contain Image usage`)
    for (const block of blocks) {
      assert.doesNotMatch(
        block,
        /\bpriority\s*=/,
        `${relativePath} should not use deprecated Image priority`,
      )
      assert.ok(
        !(block.includes('preload') && block.includes('fetchPriority="high"')),
        `${relativePath} should not combine preload with high fetchPriority`,
      )
    }
  }

  const [homeHero, productGallery, productCard] = await Promise.all([
    readSource('src/components/homepage/hero/hero.tsx'),
    readSource('src/components/product/product-gallery/product-gallery.tsx'),
    readSource('src/components/collection/product-card/product-card.tsx'),
  ])

  assert.match(homeHero, /\bpreload\b/)
  assert.match(homeHero, /\bunoptimized\b/)
  assert.match(productGallery, /\bpreload\b/)
  assert.match(
    productGallery,
    /\bunoptimized=\{isLocalLaunchLcpImage\(image\.url\)\}/,
  )
  assert.match(productCard, /preload=\{priority\}/)
  assert.match(
    productCard,
    /\bunoptimized=\{isLocalLaunchLcpImage\(featuredImage\.url\)\}/,
  )
  assert.doesNotMatch(productCard, /loading=\{priority \? 'eager' : 'lazy'\}/)
  assert.doesNotMatch(
    productCard,
    /fetchPriority=\{priority \? 'high' : 'auto'\}/,
  )
})
