import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildJsonSummary,
  calculateStatus,
  evaluateReadinessRows,
  getLighthouseCommand,
  getProductionLifecycleCommands,
  parseArgs,
  renderEvidenceDocument,
  renderLcpDiagnostics,
  renderMarkdownTable,
  summarizeLhr,
  warmupRoutes,
} from './probe-lighthouse.mjs'

test('parseArgs supports defaults and repeated url overrides', () => {
  const defaults = parseArgs([])
  assert.equal(defaults.baseUrl, 'http://127.0.0.1:4173')
  assert.equal(defaults.allowMetricFailures, false)
  assert.equal(defaults.jsonSummary, false)
  assert.equal(defaults.startServer, false)
  assert.equal(defaults.stdoutOnly, false)
  assert.equal(defaults.warmupRuns, 1)
  assert.deepEqual(defaults.routes.slice(0, 2), [
    '/',
    '/products/test-standard-tea',
  ])

  const parsed = parseArgs([
    '--start-server',
    '--stdout-only',
    '--allow-metric-failures',
    '--warmup-runs',
    '2',
    '--json-summary',
    '--base-url',
    'http://127.0.0.1:4999',
    '--url',
    '/',
    '--url=/cart',
  ])
  assert.equal(parsed.baseUrl, 'http://127.0.0.1:4999')
  assert.equal(parsed.allowMetricFailures, true)
  assert.equal(parsed.jsonSummary, true)
  assert.equal(parsed.startServer, true)
  assert.equal(parsed.stdoutOnly, true)
  assert.equal(parsed.warmupRuns, 2)
  assert.deepEqual(parsed.routes, ['/', '/cart'])
})

test('parseArgs supports cold-run shorthand and warmup assignment', () => {
  assert.equal(parseArgs(['--cold-run']).warmupRuns, 0)
  assert.equal(parseArgs(['--warmup-runs=3']).warmupRuns, 3)
  assert.throws(() => parseArgs(['--warmup-runs', '-1']), /Invalid/)
  assert.throws(() => parseArgs(['--warmup-runs=1x']), /Invalid/)
})

test('warmupRoutes fetches every route for each requested warmup run', async () => {
  const calls = []

  await warmupRoutes({
    baseUrl: 'http://127.0.0.1:4173',
    fetchImpl: async (url, options) => {
      calls.push({ options, url })
      return { ok: true, status: 200 }
    },
    routes: ['/', '/cart'],
    runs: 2,
  })

  assert.deepEqual(
    calls.map((call) => call.url),
    [
      'http://127.0.0.1:4173/',
      'http://127.0.0.1:4173/cart',
      'http://127.0.0.1:4173/',
      'http://127.0.0.1:4173/cart',
    ],
  )
  assert.deepEqual(calls[0].options, { cache: 'no-store' })
})

test('strict readiness fails on FAIL rows unless explicitly allowed', () => {
  const rows = [
    {
      cls: 0,
      lcpMs: 3000,
      route: '/',
      status: 'FAIL',
      tbtMs: 10,
    },
    {
      cls: 0,
      lcpMs: 1800,
      route: '/cart',
      status: 'PASS',
      tbtMs: 10,
    },
  ]

  assert.deepEqual(evaluateReadinessRows(rows), {
    blockingRows: [rows[0]],
    exitCode: 1,
    message: 'Performance readiness failed: 1 route(s) have FAIL metrics.',
  })
  assert.equal(
    evaluateReadinessRows(rows, { allowMetricFailures: true }).exitCode,
    0,
  )
})

test('json summary exposes route-level readiness counts', () => {
  const summary = buildJsonSummary([
    {
      cls: 0,
      lcpMs: 1800,
      route: '/',
      status: 'PASS',
      tbtMs: 10,
    },
    {
      cls: null,
      lcpMs: 1800,
      route: '/account',
      status: 'WARN',
      tbtMs: 10,
    },
    {
      cls: 0,
      lcpMs: 3600,
      route: '/products/test-standard-tea',
      status: 'FAIL',
      tbtMs: 10,
    },
  ])

  assert.deepEqual(summary, {
    blocking: 1,
    fail: 1,
    pass: 1,
    routes: [
      {
        cls: 0,
        lcpElement: null,
        lcpMs: 1800,
        lcpResourceUrl: null,
        observedUrl: '',
        route: '/',
        status: 'PASS',
        tbtMs: 10,
      },
      {
        cls: null,
        lcpElement: null,
        lcpMs: 1800,
        lcpResourceUrl: null,
        observedUrl: '',
        route: '/account',
        status: 'WARN',
        tbtMs: 10,
      },
      {
        cls: 0,
        lcpElement: null,
        lcpMs: 3600,
        lcpResourceUrl: null,
        observedUrl: '',
        route: '/products/test-standard-tea',
        status: 'FAIL',
        tbtMs: 10,
      },
    ],
    total: 3,
    warn: 1,
  })
})

test('parseArgs ignores the package-manager argument separator', () => {
  const parsed = parseArgs(['--', '--start-server'])

  assert.equal(parsed.baseUrl, 'http://127.0.0.1:4173')
  assert.equal(parsed.startServer, true)
})

test('production lifecycle command construction matches fake-provider server flow', () => {
  const commands = getProductionLifecycleCommands({
    baseUrl: 'http://127.0.0.1:4999',
  })
  const nextBuild = commands.find((command) => command.name === 'next build')
  const nextStart = commands.find((command) => command.name === 'next start')

  assert.equal(commands[0].name, 'fake Shopify')
  assert.deepEqual(commands[0].args, [
    '--import',
    'tsx',
    'tests/mocks/run-fake-shopify-server.ts',
  ])
  assert.equal(commands[1].name, 'fake Customer Account API')
  assert.deepEqual(commands[2].args, ['pnpm', 'exec', 'next', 'build'])
  assert.deepEqual(commands[3].args, [
    'pnpm',
    'exec',
    'next',
    'start',
    '-p',
    '4999',
  ])
  assert.equal(nextBuild?.env.DISABLE_INDEXING, 'true')
  assert.equal(nextStart?.env.DISABLE_INDEXING, 'true')
  assert.equal(commands[3].env.PLAYWRIGHT_PRODUCTION_TEST_MODE, 'true')
  assert.equal(
    commands[3].env.SHOPIFY_STOREFRONT_TEST_URL,
    'http://127.0.0.1:4517/graphql',
  )
})

test('production lifecycle can build launch-indexing mode explicitly', () => {
  const commands = getProductionLifecycleCommands({
    baseUrl: 'http://127.0.0.1:4999',
    disableIndexing: false,
  })
  const nextBuild = commands.find((command) => command.name === 'next build')
  const nextStart = commands.find((command) => command.name === 'next start')

  assert.equal(nextBuild?.env.DISABLE_INDEXING, 'false')
  assert.equal(nextStart?.env.DISABLE_INDEXING, 'false')
})

test('lighthouse command uses local dependency with mobile launch categories', () => {
  const command = getLighthouseCommand('http://127.0.0.1:4173/')

  assert.equal(command.command, 'corepack')
  assert.ok(command.args.includes('lighthouse'))
  assert.ok(command.args.includes('--output=json'))
  assert.ok(
    command.args.includes(
      '--only-categories=performance,accessibility,best-practices,seo',
    ),
  )
  assert.ok(command.args.includes('--form-factor=mobile'))
})

test('threshold status calculation returns pass, fail, and warn states', () => {
  assert.deepEqual(
    calculateStatus({ a11yScore: 100, cls: 0.02, lcpMs: 1200, tbtMs: 10 }),
    { mitigation: 'None', status: 'PASS' },
  )

  assert.equal(
    calculateStatus({ a11yScore: 100, cls: 0.11, lcpMs: 2600, tbtMs: 301 })
      .status,
    'FAIL',
  )

  assert.equal(
    calculateStatus({ a11yScore: null, cls: 0.01, lcpMs: 1200, tbtMs: 20 })
      .status,
    'WARN',
  )
})

test('summarizeLhr extracts required Lighthouse audits', () => {
  const row = summarizeLhr('/', {
    audits: {
      'cumulative-layout-shift': { numericValue: 0.01 },
      'largest-contentful-paint': { numericValue: 1800 },
      'largest-contentful-paint-element': {
        details: {
          items: [
            {
              node: {
                nodeLabel: 'Homepage hero image',
                selector: 'section img',
                snippet: '<img src="/images/homepage/homepage-hero.png">',
              },
              url: 'http://127.0.0.1:4173/_next/image?url=hero',
            },
          ],
        },
      },
      'total-blocking-time': { numericValue: 50 },
    },
    categories: {
      accessibility: { score: 0.97 },
    },
    finalDisplayedUrl: 'http://127.0.0.1:4173/',
  })

  assert.equal(row.route, '/')
  assert.equal(row.lcpMs, 1800)
  assert.equal(row.cls, 0.01)
  assert.equal(row.tbtMs, 50)
  assert.equal(row.a11yScore, 97)
  assert.equal(row.status, 'PASS')
  assert.deepEqual(row.lcpElement, {
    nodeLabel: 'Homepage hero image',
    selector: 'section img',
    snippet: '<img src="/images/homepage/homepage-hero.png">',
  })
  assert.equal(
    row.lcpResourceUrl,
    'http://127.0.0.1:4173/_next/image?url=hero',
  )
  assert.equal(row.observedUrl, 'http://127.0.0.1:4173/')
})

test('summarizeLhr falls back to snippet resource URLs when Lighthouse exposes no direct URL', () => {
  const row = summarizeLhr('/products/test-standard-tea', {
    audits: {
      'cumulative-layout-shift': { numericValue: 0 },
      'largest-contentful-paint': { numericValue: 1800 },
      'largest-contentful-paint-element': {
        details: {
          items: [
            {
              node: {
                snippet:
                  '<img alt="Tea" src="/_next/image?url=%2Ftea.png&w=828&q=68">',
              },
            },
          ],
        },
      },
      'total-blocking-time': { numericValue: 50 },
    },
    categories: {
      accessibility: { score: 1 },
    },
  })

  assert.equal(row.lcpResourceUrl, '/_next/image?url=%2Ftea.png&w=828&q=68')
})

test('json summary includes LCP diagnostics and observed URL fields', () => {
  const summary = buildJsonSummary([
    {
      cls: 0,
      lcpElement: {
        nodeLabel: 'Hero image',
        selector: '.hero img',
        snippet: '<img src="/hero.png">',
      },
      lcpMs: 1800,
      lcpResourceUrl: '/hero.png',
      observedUrl: 'http://127.0.0.1:4173/',
      route: '/',
      status: 'PASS',
      tbtMs: 10,
    },
  ])

  assert.deepEqual(summary.routes[0], {
    cls: 0,
    lcpElement: {
      nodeLabel: 'Hero image',
      selector: '.hero img',
      snippet: '<img src="/hero.png">',
    },
    lcpMs: 1800,
    lcpResourceUrl: '/hero.png',
    observedUrl: 'http://127.0.0.1:4173/',
    route: '/',
    status: 'PASS',
    tbtMs: 10,
  })
})

test('markdown table renders the launch evidence columns', () => {
  const markdown = renderMarkdownTable([
    {
      a11yScore: 99,
      cls: 0.005,
      lcpMs: 1400,
      mitigation: 'None',
      route: '/search?q=tea',
      status: 'PASS',
      tbtMs: 20,
    },
  ])

  assert.match(
    markdown,
    /\| Route \| LCP \| CLS \| TBT \| A11y \| Status \| Mitigation \|/,
  )
  assert.match(markdown, /\| \/search\?q=tea \| 1400ms \| 0\.005 \|/)
})

test('evidence document includes required headings and route list', () => {
  const document = renderEvidenceDocument({
    baseUrl: 'http://127.0.0.1:4173',
    generatedAt: '2026-06-23T00:00:00.000Z',
    routes: ['/', '/products/test-standard-tea'],
    rows: [
      {
        a11yScore: 99,
        cls: 0.005,
        lcpMs: 1400,
        lcpElement: null,
        lcpResourceUrl: null,
        mitigation: 'None',
        observedUrl: 'http://127.0.0.1:4173/',
        route: '/',
        status: 'PASS',
        tbtMs: 20,
      },
    ],
  })

  for (const heading of [
    '# Performance Evidence',
    '## Command',
    '## Representative Routes',
    '## Mobile Lighthouse Results',
    '## LCP Diagnostics',
    '## UX And Accessibility Polish',
    '## Remaining Mitigations',
  ]) {
    assert.ok(document.includes(heading), `missing ${heading}`)
  }

  assert.ok(document.includes('/products/test-standard-tea'))
})

test('LCP diagnostics render exposed details or explicit unavailable copy', () => {
  const diagnostics = renderLcpDiagnostics([
    {
      finalUrl: 'http://127.0.0.1:4173/cart',
      lcpElement: null,
      lcpResourceUrl: null,
      observedUrl: 'http://127.0.0.1:4173/cart',
      route: '/cart',
    },
    {
      lcpElement: {
        nodeLabel: 'Product image',
        selector: '.product img',
        snippet: '<img src="/product.png">',
      },
      lcpResourceUrl: '/product.png',
      observedUrl: 'http://127.0.0.1:4173/products/test-standard-tea',
      route: '/products/test-standard-tea',
    },
  ])

  assert.match(diagnostics, /Lighthouse did not expose it/)
  assert.match(diagnostics, /\.product img/)
  assert.match(diagnostics, /\/product\.png/)
})
