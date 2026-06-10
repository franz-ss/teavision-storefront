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

test('IconButton small size keeps a 44px touch target', async () => {
  const source = await readFile(
    sourcePath('src', 'components', 'ui', 'icon-button', 'icon-button.tsx'),
    'utf8',
  )

  assert.match(source, /sm:\s*'h-11 w-11'/)
})

test('Button small size keeps a 44px touch target', async () => {
  const source = await readFile(
    sourcePath('src', 'components', 'ui', 'button', 'button.tsx'),
    'utf8',
  )

  assert.match(source, /sm:\s*'type-label min-h-11 px-4\.5 text-\[0\.86rem\]'/)
})

test('DisclosureButton requires disclosure state attributes', async () => {
  const source = await readFile(
    sourcePath(
      'src',
      'components',
      'ui',
      'disclosure-button',
      'disclosure-button.tsx',
    ),
    'utf8',
  )

  assert.match(source, /type DisclosureButtonStateProps/)
  assert.match(source, /'aria-controls': string/)
  assert.match(source, /'aria-expanded': boolean/)
})

test('IconButton variants stay named visual styles', async () => {
  const source = await readFile(
    sourcePath('src', 'components', 'ui', 'icon-button', 'icon-button.tsx'),
    'utf8',
  )

  assert.doesNotMatch(source, /plain:/)
})

test('Button exposes a secondary variant for dark surfaces', async () => {
  const source = await readFile(
    sourcePath('src', 'components', 'ui', 'button', 'button.tsx'),
    'utf8',
  )

  assert.match(source, /inverseSecondary:/)
})

test('Button variant styles share repeated frame classes', async () => {
  const source = await readFile(
    sourcePath('src', 'components', 'ui', 'button', 'button.tsx'),
    'utf8',
  )

  const centeredFrameMatches =
    source.match(/items-center justify-center gap-2\.5/g) ?? []
  const roundedFrameMatches = source.match(/rounded-full/g) ?? []

  assert.equal(centeredFrameMatches.length, 1)
  assert.ok(roundedFrameMatches.length >= 1)
})

test('Button variants stay limited to action styles', async () => {
  const buttonSource = await readFile(
    sourcePath('src', 'components', 'ui', 'button', 'button.tsx'),
    'utf8',
  )
  const storiesSource = await readFile(
    sourcePath('src', 'components', 'ui', 'button', 'button.stories.tsx'),
    'utf8',
  )

  for (const roleVariant of [
    'nav',
    'menuItem',
    'mobileMenuItem',
    'option',
    'thumbnail',
    'plain',
  ]) {
    assert.doesNotMatch(buttonSource, new RegExp(`${roleVariant}:`))
    assert.doesNotMatch(storiesSource, new RegExp(`'${roleVariant}'`))
  }
})

test('homepage CTAs use approved brand and inverse button variants', async () => {
  const heroSource = await readFile(
    sourcePath('src', 'components', 'homepage', 'hero', 'hero.tsx'),
    'utf8',
  )
  const homepageContentSource = await readFile(
    sourcePath('src', 'components', 'homepage', 'content.ts'),
    'utf8',
  )

  // Hero primary CTA: inverse (paper/ink on dark hero background)
  assert.match(heroSource, /variant="inverse"/)
  // Hero secondary CTA: inverseSecondary (ghost outline on dark hero per design)
  assert.match(heroSource, /variant="inverseSecondary"/)
  assert.match(
    homepageContentSource,
    /ctaCatalogueData[\s\S]*variant: 'inverseSecondary'/,
  )
})

test('Button inverse stories render on the dark Storybook background', async () => {
  const storiesSource = await readFile(
    sourcePath('src', 'components', 'ui', 'button', 'button.stories.tsx'),
    'utf8',
  )

  assert.match(
    storiesSource,
    /const inverseStoryBackgrounds[\s\S]*options:[\s\S]*dark: \{ name: 'dark', value: 'var\(--color-ink\)' \}/,
  )
  assert.match(
    storiesSource,
    /const inverseStoryGlobals[\s\S]*backgrounds: \{ value: 'dark' \}/,
  )
  assert.match(storiesSource, /Inverse[\s\S]*globals: inverseStoryGlobals/)
  assert.match(
    storiesSource,
    /Inverse[\s\S]*backgrounds: inverseStoryBackgrounds/,
  )
  assert.match(
    storiesSource,
    /InverseSecondary[\s\S]*globals: inverseStoryGlobals/,
  )
  assert.match(
    storiesSource,
    /InverseSecondary[\s\S]*backgrounds: inverseStoryBackgrounds/,
  )
})

test('hover zoom image treatments respect reduced motion', async () => {
  const files = [
    sourcePath(
      'src',
      'app',
      '(storefront)',
      'collections',
      '_components',
      'collection-card-image.tsx',
    ),
    // overlay-image-card (range tiles) intentionally has NO image zoom —
    // the design's .rtile hover only deepens the gradient scrim
    sourcePath(
      'src',
      'components',
      'homepage',
      'tea-journal',
      'tea-journal.tsx',
    ),
    sourcePath('src', 'components', 'ui', 'article-card', 'article-card.tsx'),
    sourcePath(
      'src',
      'components',
      'product',
      'recommendation-product-card',
      'recommendation-product-card.tsx',
    ),
  ]

  for (const file of files) {
    const source = await readFile(file, 'utf8')
    const zoomLines = source
      .split('\n')
      .filter((line) => line.includes('group-hover:scale'))

    assert.ok(zoomLines.length > 0, file)

    for (const line of zoomLines) {
      assert.match(line, /motion-reduce:transform-none/, file)
      assert.match(line, /motion-reduce:transition-none/, file)
      assert.match(line, /motion-reduce:group-hover:scale-100/, file)
    }
  }
})

test('Storybook build config treats internal infrastructure chunks as baseline', async () => {
  const source = await readFile(sourcePath('.storybook', 'main.ts'), 'utf8')

  assert.match(source, /chunkSizeWarningLimit:\s*1400/)
  assert.match(source, /pluginTimings:\s*false/)
})
