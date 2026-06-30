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

function fontConfig(source, name) {
  const match = source.match(
    new RegExp(`const ${name} = [^(]+\\((\\{[\\s\\S]*?\\n\\})\\)`),
  )
  assert.ok(match, `Expected ${name} font config to exist`)
  return match[1]
}

test('root layout fonts use optional display with the correct preload posture', async () => {
  const source = await readFile(sourcePath('src', 'app', 'layout.tsx'), 'utf8')
  const spectral = fontConfig(source, 'spectral')
  const hankenGrotesk = fontConfig(source, 'hankenGrotesk')
  const spaceMono = fontConfig(source, 'spaceMono')
  const caveat = fontConfig(source, 'caveat')

  for (const [name, config] of [
    ['spectral', spectral],
    ['hankenGrotesk', hankenGrotesk],
    ['spaceMono', spaceMono],
    ['caveat', caveat],
  ]) {
    assert.match(
      config,
      /display:\s*'optional'/,
      `${name} should use optional display`,
    )
    assert.doesNotMatch(
      config,
      /display:\s*'swap'/,
      `${name} should not use swap display`,
    )
  }

  assert.match(spectral, /weight:\s*\[\s*'400',\s*'500'\s*\]/)
  assert.match(spectral, /style:\s*\[\s*'normal'\s*\]/)
  assert.doesNotMatch(spectral, /'italic'/)

  // Space Mono drives always-visible, above-the-fold chrome (header utility bar,
  // footer, mega panels, cart badge). It MUST be preloaded: without it,
  // `optional` misses its window on first paint and locks the fallback monospace
  // in until a manual refresh. preload:false here was the original bug.
  assert.match(spaceMono, /variable:\s*'--font-space-mono'/)
  assert.match(spaceMono, /preload:\s*true/)

  // Caveat is a decorative script font and currently unused — no preload needed.
  assert.match(caveat, /variable:\s*'--font-caveat'/)
  assert.match(caveat, /preload:\s*false/)
})
