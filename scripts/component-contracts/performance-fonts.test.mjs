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

test('root layout keeps launch-critical fonts lightweight', async () => {
  const source = await readFile(sourcePath('src', 'app', 'layout.tsx'), 'utf8')
  const spectral = fontConfig(source, 'spectral')
  const spaceMono = fontConfig(source, 'spaceMono')
  const caveat = fontConfig(source, 'caveat')

  assert.match(spectral, /weight:\s*\[\s*'400',\s*'500'\s*\]/)
  assert.match(spectral, /style:\s*\[\s*'normal'\s*\]/)
  assert.doesNotMatch(spectral, /'italic'/)
  assert.match(spaceMono, /variable:\s*'--font-space-mono'/)
  assert.match(spaceMono, /preload:\s*false/)
  assert.match(caveat, /variable:\s*'--font-caveat'/)
  assert.match(caveat, /preload:\s*false/)
})
