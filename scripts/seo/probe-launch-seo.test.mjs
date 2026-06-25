import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import assert from 'node:assert/strict'

const SCRIPT_PATH = 'scripts/seo/probe-launch-seo.mjs'
const REGISTER_PATH = 'docs/launch/seo-url-parity-register.md'

function runProbe(args, env = {}) {
  return spawnSync(process.execPath, [SCRIPT_PATH, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {
      ...process.env,
      ...env,
    },
  })
}

test('url-audit mode validates the URL parity register with warnings only for optional owner exports', () => {
  const result = runProbe(['--mode', 'url-audit'], {
    SEO_URL_MIGRATION_EXPORT: '',
  })

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Two-source confirmation/)
  assert.match(result.stdout, /app-owned register rows/)
  assert.match(result.stdout, /WARN/)
  assert.match(result.stdout, /missing optional owner export/)
  assert.doesNotMatch(result.stdout, /FAIL/)
})

test('url-audit mode fails when a coded redirect lacks a register row', () => {
  const directory = mkdtempSync(join(tmpdir(), 'seo-url-audit-'))
  const registerPath = join(directory, 'seo-url-parity-register.md')
  const register = readFileSync(REGISTER_PATH, 'utf8').replace(
    /^\| `\/collections\/:handle\/products\/:productHandle` .*\r?\n/m,
    '',
  )

  writeFileSync(registerPath, register)

  try {
    const result = runProbe(['--mode', 'url-audit'], {
      SEO_URL_PARITY_REGISTER_PATH: registerPath,
      SEO_URL_MIGRATION_EXPORT: '',
    })

    assert.equal(result.status, 1)
    assert.match(result.stdout, /coded redirect register row/)
    assert.match(result.stdout, /missing register row/)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
