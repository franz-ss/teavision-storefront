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
    sourcePath('components', 'ui', 'icon-button', 'icon-button.tsx'),
    'utf8',
  )

  assert.match(source, /sm:\s*'h-11 w-11'/)
})

test('Button small size keeps a 44px touch target', async () => {
  const source = await readFile(
    sourcePath('components', 'ui', 'button', 'button.tsx'),
    'utf8',
  )

  assert.match(source, /sm:\s*'type-label min-h-11 px-3'/)
})

test('DisclosureButton requires disclosure state attributes', async () => {
  const source = await readFile(
    sourcePath(
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
    sourcePath('components', 'ui', 'icon-button', 'icon-button.tsx'),
    'utf8',
  )

  assert.doesNotMatch(source, /plain:/)
})

test('Button exposes a secondary variant for dark surfaces', async () => {
  const source = await readFile(
    sourcePath('components', 'ui', 'button', 'button.tsx'),
    'utf8',
  )

  assert.match(source, /inverseSecondary:/)
})

test('Button variant styles share repeated frame classes', async () => {
  const source = await readFile(
    sourcePath('components', 'ui', 'button', 'button.tsx'),
    'utf8',
  )

  const centeredFrameMatches =
    source.match(/items-center justify-center gap-2/g) ?? []
  const roundedFrameMatches = source.match(/rounded-md/g) ?? []

  assert.equal(centeredFrameMatches.length, 1)
  assert.equal(roundedFrameMatches.length, 1)
})

test('Button variants stay limited to action styles', async () => {
  const buttonSource = await readFile(
    sourcePath('components', 'ui', 'button', 'button.tsx'),
    'utf8',
  )
  const storiesSource = await readFile(
    sourcePath('components', 'ui', 'button', 'button.stories.tsx'),
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

test('homepage dark-surface CTAs use inverse button variants', async () => {
  const heroSource = await readFile(
    sourcePath('components', 'homepage', 'hero', 'hero.tsx'),
    'utf8',
  )
  const cataloguesSource = await readFile(
    sourcePath(
      'components',
      'homepage',
      'catalogues',
      'catalogues.tsx',
    ),
    'utf8',
  )

  assert.match(heroSource, /<Button href="\/pages\/wholesale" variant="inverse"/)
  assert.match(heroSource, /variant="inverseSecondary"/)
  assert.match(cataloguesSource, /variant="inverseSecondary"/)
})

test('Button inverse stories render on the dark Storybook background', async () => {
  const storiesSource = await readFile(
    sourcePath('components', 'ui', 'button', 'button.stories.tsx'),
    'utf8',
  )

  assert.match(
    storiesSource,
    /const inverseStoryBackgrounds[\s\S]*options:[\s\S]*dark: \{ name: 'dark', value: 'var\(--tv-bg-inverse\)' \}/,
  )
  assert.match(
    storiesSource,
    /const inverseStoryGlobals[\s\S]*backgrounds: \{ value: 'dark' \}/,
  )
  assert.match(storiesSource, /Inverse[\s\S]*globals: inverseStoryGlobals/)
  assert.match(storiesSource, /Inverse[\s\S]*backgrounds: inverseStoryBackgrounds/)
  assert.match(storiesSource, /InverseSecondary[\s\S]*globals: inverseStoryGlobals/)
  assert.match(
    storiesSource,
    /InverseSecondary[\s\S]*backgrounds: inverseStoryBackgrounds/,
  )
})

test('hover zoom image treatments respect reduced motion', async () => {
  const files = [
    sourcePath('app', '(storefront)', 'collections', 'page.tsx'),
    sourcePath(
      'components',
      'homepage',
      'overlay-image-card',
      'overlay-image-card.tsx',
    ),
    sourcePath(
      'components',
      'homepage',
      'tea-journal',
      'tea-journal.tsx',
    ),
    sourcePath('components', 'ui', 'article-card', 'article-card.tsx'),
    sourcePath('components', 'ui', 'product-card', 'product-card.tsx'),
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
