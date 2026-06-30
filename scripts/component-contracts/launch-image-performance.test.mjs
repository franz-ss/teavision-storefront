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

// The homepage hero is the one launch-critical LCP image where `preload` and
// `fetchPriority="high"` are intentionally combined: Next.js emits a
// `<link rel="preload" as="image" fetchpriority="high">` (and the same
// fetchpriority on the rendered <img>), which is what the real-PSI "LCP
// request discovery" audit requires (20-PSI-EVIDENCE.md). Every other
// launch-critical Image usage keeps the existing guard against combining the
// two.
const HERO_PATH = 'src/components/homepage/hero/hero.tsx'

test('launch image components avoid deprecated priority and invalid preload combinations', async () => {
  for (const relativePath of sourceFiles) {
    const source = await readSource(relativePath)
    const blocks = imageBlocks(source)

    assert.ok(blocks.length > 0, `${relativePath} should contain Image usage`)
    assert.doesNotMatch(
      source,
      /isLocalLaunchLcpImage|unoptimized/,
      `${relativePath} should not branch around normal Image optimization for local launch assets`,
    )

    for (const block of blocks) {
      assert.doesNotMatch(
        block,
        /\bpriority\s*=/,
        `${relativePath} should not use deprecated Image priority`,
      )
      const combinesPreloadAndFetchPriority =
        block.includes('preload') && block.includes('fetchPriority="high"')
      if (relativePath === HERO_PATH) {
        continue
      }
      assert.ok(
        !combinesPreloadAndFetchPriority,
        `${relativePath} should not combine preload with high fetchPriority`,
      )
    }
  }

  const heroSource = await readSource(HERO_PATH)
  const heroBlocks = imageBlocks(heroSource)
  const heroLcpBlock = heroBlocks.find((block) => block.includes('fill'))
  assert.ok(heroLcpBlock, `${HERO_PATH} should contain the fill hero Image`)
  assert.match(
    heroLcpBlock,
    /\bpreload\b/,
    `${HERO_PATH} LCP image should keep preload`,
  )
  assert.match(
    heroLcpBlock,
    /fetchPriority="high"/,
    `${HERO_PATH} LCP image should carry fetchPriority="high" so the preload link emits fetchpriority=high`,
  )

  const [homeHero, productGallery, productCard] = await Promise.all([
    readSource('src/components/homepage/hero/hero.tsx'),
    readSource('src/components/product/product-gallery/product-gallery.tsx'),
    readSource('src/components/collection/product-card/product-card.tsx'),
  ])

  assert.match(homeHero, /\bpreload\b/)
  assert.match(productGallery, /\bpreload\b/)
  assert.match(productCard, /preload=\{priority\}/)
  assert.doesNotMatch(productGallery, /isLocalLaunchLcpImage/)
  assert.doesNotMatch(productCard, /isLocalLaunchLcpImage/)
  assert.doesNotMatch(
    productCard,
    /loading=\{priority \? 'eager' : 'lazy'\}/,
  )
  assert.doesNotMatch(
    productCard,
    /fetchPriority=\{priority \? 'high' : 'auto'\}/,
  )
})
