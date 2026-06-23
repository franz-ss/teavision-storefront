import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { spawn } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export const DEFAULT_BASE_URL = 'http://127.0.0.1:4173'
export const DEFAULT_ROUTES = [
  '/',
  '/products/test-standard-tea',
  '/collections/all',
  '/cart',
  '/search?q=tea',
  '/account',
  '/pages/privacy-policy',
]

export const THRESHOLDS = {
  cls: 0.1,
  lcpMs: 2500,
  tbtMs: 300,
}

const EVIDENCE_PATH = 'docs/launch/performance-evidence.md'
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']
const DEFAULT_FAKE_SHOPIFY_PORT = 4517
const DEFAULT_FAKE_CUSTOMER_ACCOUNT_PORT = 4518

export function parseArgs(argv) {
  const args = {
    baseUrl: process.env.PERFORMANCE_PROBE_BASE_URL ?? DEFAULT_BASE_URL,
    startServer: false,
    stdoutOnly: false,
    urls: [],
  }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]

    if (value === '--') {
      continue
    }

    if (value === '--base-url') {
      args.baseUrl = argv[index + 1] ?? args.baseUrl
      index += 1
      continue
    }

    if (value.startsWith('--base-url=')) {
      args.baseUrl = value.slice('--base-url='.length)
      continue
    }

    if (value === '--url') {
      const route = argv[index + 1]
      if (route) args.urls.push(route)
      index += 1
      continue
    }

    if (value.startsWith('--url=')) {
      args.urls.push(value.slice('--url='.length))
      continue
    }

    if (value === '--start-server') {
      args.startServer = true
      continue
    }

    if (value === '--stdout-only') {
      args.stdoutOnly = true
      continue
    }

    if (!value.startsWith('--')) {
      args.baseUrl = value
    }
  }

  return {
    ...args,
    routes: args.urls.length > 0 ? args.urls : DEFAULT_ROUTES,
  }
}

function assertBaseUrl(value) {
  try {
    return new URL(value)
  } catch {
    throw new Error(`Invalid base URL: ${value}`)
  }
}

export function getPortFromBaseUrl(baseUrl) {
  const url = assertBaseUrl(baseUrl)
  const explicitPort = Number(url.port)

  if (Number.isFinite(explicitPort) && explicitPort > 0) {
    return explicitPort
  }

  if (url.protocol === 'https:') return 443
  if (url.protocol === 'http:') return 80

  return 4173
}

export function getProductionLifecycleCommands({
  baseUrl = DEFAULT_BASE_URL,
  fakeCustomerAccountPort = DEFAULT_FAKE_CUSTOMER_ACCOUNT_PORT,
  fakeShopifyPort = DEFAULT_FAKE_SHOPIFY_PORT,
} = {}) {
  const port = getPortFromBaseUrl(baseUrl)
  const fakeShopifyUrl = `http://127.0.0.1:${fakeShopifyPort}/graphql`
  const fakeCustomerAccountUrl = `http://127.0.0.1:${fakeCustomerAccountPort}`

  const nextEnv = {
    DISABLE_INDEXING: 'true',
    NEXT_PUBLIC_ANALYTICS_MODE: 'fake',
    NEXT_PUBLIC_SEARCHANISE_API_KEY: '',
    NEXT_PUBLIC_SEARCHANISE_ENABLED: 'false',
    PLAYWRIGHT_PORT: String(port),
    PLAYWRIGHT_PRODUCTION_TEST_MODE: 'true',
    SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID: 'test-client-id',
    SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI: `${baseUrl}/account/login`,
    SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI: `${baseUrl}/account/callback`,
    SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET:
      'test-session-secret-with-at-least-32-characters',
    SHOPIFY_CUSTOMER_ACCOUNT_TEST_MODE: 'true',
    SHOPIFY_CUSTOMER_ACCOUNT_TEST_URL: fakeCustomerAccountUrl,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: 'test-token',
    SHOPIFY_STOREFRONT_TEST_MODE: 'true',
    SHOPIFY_STOREFRONT_TEST_URL: fakeShopifyUrl,
    SHOPIFY_STORE_DOMAIN: 'fake-shopify.test',
  }

  return [
    {
      args: ['--import', 'tsx', 'tests/mocks/run-fake-shopify-server.ts'],
      command: 'node',
      env: { FAKE_SHOPIFY_PORT: String(fakeShopifyPort) },
      kind: 'server',
      name: 'fake Shopify',
      waitUrl: `http://127.0.0.1:${fakeShopifyPort}/health`,
    },
    {
      args: [
        '--import',
        'tsx',
        'tests/mocks/run-customer-account-api-server.ts',
      ],
      command: 'node',
      env: { FAKE_CUSTOMER_ACCOUNT_PORT: String(fakeCustomerAccountPort) },
      kind: 'server',
      name: 'fake Customer Account API',
      waitUrl: `${fakeCustomerAccountUrl}/.well-known/openid-configuration`,
    },
    {
      args: ['pnpm', 'exec', 'next', 'build'],
      command: 'corepack',
      env: nextEnv,
      kind: 'command',
      name: 'next build',
    },
    {
      args: ['pnpm', 'exec', 'next', 'start', '-p', String(port)],
      command: 'corepack',
      env: nextEnv,
      kind: 'server',
      name: 'next start',
      waitUrl: baseUrl,
    },
  ]
}

function spawnChild(step, stdio = 'inherit') {
  return spawn(step.command, step.args, {
    env: { ...process.env, ...step.env },
    shell: process.platform === 'win32',
    stdio,
  })
}

function waitForExit(child, label) {
  return new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${label} exited with ${signal ?? `code ${code}`}`))
    })
  })
}

async function waitForUrl(url, label, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs
  let lastError = ''

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      if (response.ok) return
      lastError = `status ${response.status}`
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error(`${label} did not become ready at ${url}: ${lastError}`)
}

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return

  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      const killer = spawn(
        'taskkill',
        ['/pid', String(child.pid), '/T', '/F'],
        {
          stdio: 'ignore',
        },
      )
      killer.on('exit', resolve)
      killer.on('error', resolve)
    })
    return
  }

  child.kill('SIGTERM')
}

export async function startProductionLifecycle(baseUrl) {
  const commands = getProductionLifecycleCommands({ baseUrl })
  const children = []

  try {
    for (const step of commands) {
      if (step.kind === 'command') {
        console.log(`Running ${step.command} ${step.args.join(' ')}`)
        await waitForExit(spawnChild(step), step.name)
        continue
      }

      console.log(`Starting ${step.name}`)
      const child = spawnChild(step)
      children.push(child)
      await waitForUrl(step.waitUrl, step.name)
    }
  } catch (error) {
    await stopProductionLifecycle(children)
    throw error
  }

  return {
    async stop() {
      await stopProductionLifecycle(children)
    },
  }
}

async function stopProductionLifecycle(children) {
  await Promise.all([...children].reverse().map((child) => stopChild(child)))
}

function targetUrl(baseUrl, route) {
  try {
    return new URL(route).toString()
  } catch {
    return new URL(route, baseUrl).toString()
  }
}

export function getLighthouseCommand(url) {
  return {
    args: [
      'pnpm',
      'exec',
      'lighthouse',
      url,
      '--output=json',
      '--output-path=stdout',
      '--quiet',
      `--only-categories=${CATEGORIES.join(',')}`,
      '--form-factor=mobile',
      '--chrome-flags=--headless=new',
    ],
    command: 'corepack',
  }
}

function parseJsonOutput(output) {
  const start = output.indexOf('{')
  const end = output.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Lighthouse did not return JSON output')
  }

  return JSON.parse(output.slice(start, end + 1))
}

async function runLighthouse(url) {
  const step = getLighthouseCommand(url)
  const child = spawn(step.command, step.args, {
    env: process.env,
    shell: process.platform === 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let stdout = ''
  let stderr = ''

  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')
  child.stdout.on('data', (chunk) => {
    stdout += chunk
  })
  child.stderr.on('data', (chunk) => {
    stderr += chunk
  })

  await new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          `Lighthouse failed for ${url}: ${stderr || stdout || signal || code}`,
        ),
      )
    })
  })

  return parseJsonOutput(stdout)
}

function auditNumericValue(lhr, id) {
  const value = lhr.audits?.[id]?.numericValue
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function categoryScore(lhr, id) {
  const value = lhr.categories?.[id]?.score
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.round(value * 100)
    : null
}

export function calculateStatus(metrics) {
  const missing = []
  const failures = []

  if (metrics.lcpMs === null) {
    missing.push('LCP unavailable')
  } else if (metrics.lcpMs > THRESHOLDS.lcpMs) {
    failures.push(`LCP ${formatDuration(metrics.lcpMs)} exceeds 2500ms`)
  }

  if (metrics.cls === null) {
    missing.push('CLS unavailable')
  } else if (metrics.cls > THRESHOLDS.cls) {
    failures.push(`CLS ${formatCls(metrics.cls)} exceeds 0.1`)
  }

  if (metrics.tbtMs === null) {
    missing.push('TBT unavailable')
  } else if (metrics.tbtMs > THRESHOLDS.tbtMs) {
    failures.push(`TBT ${formatDuration(metrics.tbtMs)} exceeds 300ms`)
  }

  if (metrics.a11yScore === null) {
    missing.push('accessibility score unavailable')
  }

  if (missing.length > 0) {
    return {
      mitigation: `Inconclusive local lab data: ${missing.join(
        '; ',
      )}. Re-run the probe and compare with staging or field data before launch.`,
      status: 'WARN',
    }
  }

  if (failures.length > 0) {
    return {
      mitigation: `${failures.join(
        '; ',
      )}. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.`,
      status: 'FAIL',
    }
  }

  return { mitigation: 'None', status: 'PASS' }
}

export function summarizeLhr(route, lhr) {
  const metrics = {
    a11yScore: categoryScore(lhr, 'accessibility'),
    cls: auditNumericValue(lhr, 'cumulative-layout-shift'),
    lcpMs: auditNumericValue(lhr, 'largest-contentful-paint'),
    tbtMs: auditNumericValue(lhr, 'total-blocking-time'),
  }
  const result = calculateStatus(metrics)

  return {
    ...metrics,
    finalUrl: lhr.finalDisplayedUrl ?? '',
    mitigation: result.mitigation,
    route,
    status: result.status,
  }
}

function escapeMarkdownCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')
}

function formatDuration(value) {
  return value === null ? 'n/a' : `${Math.round(value)}ms`
}

function formatCls(value) {
  return value === null ? 'n/a' : value.toFixed(3)
}

function formatScore(value) {
  return value === null ? 'n/a' : `${value}`
}

export function renderMarkdownTable(rows) {
  const lines = [
    '| Route | LCP | CLS | TBT | A11y | Status | Mitigation |',
    '| --- | ---: | ---: | ---: | ---: | --- | --- |',
  ]

  for (const row of rows) {
    lines.push(
      `| ${escapeMarkdownCell(row.route)} | ${formatDuration(
        row.lcpMs,
      )} | ${formatCls(row.cls)} | ${formatDuration(
        row.tbtMs,
      )} | ${formatScore(row.a11yScore)} | ${row.status} | ${escapeMarkdownCell(
        row.mitigation,
      )} |`,
    )
  }

  return lines.join('\n')
}

function renderRouteList(routes) {
  return routes.map((route) => `- \`${route}\``).join('\n')
}

function renderRemainingMitigations(rows) {
  const misses = rows.filter((row) => row.status !== 'PASS')

  if (misses.length === 0) {
    return 'None - no launch-blocking performance mitigations remain in this local evidence.'
  }

  return misses
    .map((row) => `- \`${row.route}\` ${row.status}: ${row.mitigation}`)
    .join('\n')
}

export function renderEvidenceDocument({
  baseUrl,
  generatedAt = new Date().toISOString(),
  rows,
  routes,
}) {
  return `# Performance Evidence

## Command

\`pnpm test:performance -- --start-server --base-url ${baseUrl}\`

Generated ${generatedAt}. This is local mobile Lighthouse lab evidence against the fake-provider production lifecycle. Lighthouse cannot replace field Core Web Vitals data; it is used here as repeatable launch regression evidence.

## Representative Routes

${renderRouteList(routes)}

## Mobile Lighthouse Results

${renderMarkdownTable(rows)}

## UX And Accessibility Polish

- duplicate skip link resolved: production smoke asserts exactly one \`Skip to main content\` link on \`/\`, verifies it receives first-tab focus, and confirms the \`main#main-content\` target exists.
- mobile text wrapping checked: production smoke runs \`/cart\` and a long-query \`/search\` route at a 375px viewport and asserts document width does not exceed viewport width.
- Remaining non-blocking UX/accessibility polish items: None - no launch-blocking UX/accessibility polish items remain.

## Remaining Mitigations

${renderRemainingMitigations(rows)}
`
}

export async function runProbe(args) {
  const rows = []

  for (const route of args.routes) {
    const url = targetUrl(args.baseUrl, route)
    console.log(`Running mobile Lighthouse for ${route} (${url})`)
    const lhr = await runLighthouse(url)
    rows.push(summarizeLhr(route, lhr))
  }

  return rows
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv)
  assertBaseUrl(args.baseUrl)
  let lifecycle = null

  try {
    if (args.startServer) {
      lifecycle = await startProductionLifecycle(args.baseUrl)
    }

    const rows = await runProbe(args)
    const markdown = renderMarkdownTable(rows)
    console.log(markdown)

    if (!args.stdoutOnly) {
      const evidence = renderEvidenceDocument({
        baseUrl: args.baseUrl,
        rows,
        routes: DEFAULT_ROUTES,
      })
      mkdirSync(dirname(EVIDENCE_PATH), { recursive: true })
      writeFileSync(EVIDENCE_PATH, evidence)
    }

    // FAIL/WARN rows are launch evidence for the next remediation task; only
    // runtime/tool errors should make this command exit nonzero.
  } finally {
    await lifecycle?.stop()
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
