import assert from 'node:assert/strict'
import test from 'node:test'

import {
  AUTOMATED_CHECK_LABELS,
  applyPerformanceAcceptance,
  buildAutomatedCheckMatrix,
  buildOwnerGateRows,
  calculateAutomatedScore,
  parseArgs,
  parseEnvFile,
  renderFinalReadinessReport,
  runAutomatedChecks,
  validatePerformanceAcceptanceDocument,
} from './run-final-readiness-audit.mjs'

function result(label, status) {
  return {
    commandText: `pnpm ${label}`,
    durationMs: 10,
    exitCode: status === 'SKIPPED' ? null : status === 'PASS' ? 0 : 1,
    label,
    outputTail: status === 'PASS' ? 'ok' : 'failed',
    skipReason: status === 'SKIPPED' ? 'fixture skip' : undefined,
    status,
  }
}

test('matrix labels and commands match the final readiness contract', () => {
  const matrix = buildAutomatedCheckMatrix({
    baseUrl: 'http://127.0.0.1:4173',
  })

  assert.deepEqual(
    matrix.map((check) => check.label),
    AUTOMATED_CHECK_LABELS,
  )
  assert.ok(
    matrix.some(
      (check) =>
        check.label === 'dependency audit' &&
        check.commandText === 'pnpm audit --audit-level moderate',
    ),
  )
  assert.ok(
    matrix.some(
      (check) =>
        check.label === 'security headers' &&
        check.commandText ===
          'node scripts/security/probe-production-security.mjs http://127.0.0.1:4173',
    ),
  )
  assert.ok(
    matrix.some(
      (check) =>
        check.label === 'performance' &&
        check.commandText ===
          'pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173 --json-summary',
    ),
  )
  assert.equal(
    matrix.find((check) => check.label === 'security headers')
      ?.lifecycleProfile,
    'noindex',
  )
  assert.equal(
    matrix.find((check) => check.label === 'seo disabled')?.lifecycleProfile,
    'noindex',
  )
  assert.equal(
    matrix.find((check) => check.label === 'seo enabled')?.lifecycleProfile,
    'indexable',
  )
})

test('parseArgs supports required runner flags', () => {
  assert.deepEqual(
    parseArgs([
      '--dry-run',
      '--base-url',
      'http://127.0.0.1:4999',
      '--skip-performance',
      '--skip-owner-gated',
      '--no-start-server',
      '--performance-acceptance',
      'docs/launch/performance-acceptance.md',
    ]),
    {
      baseUrl: 'http://127.0.0.1:4999',
      dryRun: true,
      performanceAcceptancePath: 'docs/launch/performance-acceptance.md',
      reportPath: 'docs/launch/final-production-readiness-report.md',
      skipOwnerGated: true,
      skipPerformance: true,
      startServer: false,
    },
  )

  assert.equal(parseArgs([]).startServer, true)
  assert.equal(parseArgs([]).performanceAcceptancePath, null)
  assert.equal(parseArgs(['--start-server']).startServer, true)
})

test('parseEnvFile reads local env values without exposing comments', () => {
  assert.deepEqual(
    parseEnvFile(
      [
        '# comment',
        'SHOPIFY_STORE_DOMAIN=teavision.test',
        'SHOPIFY_STOREFRONT_ACCESS_TOKEN="token-value"',
        "SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID='client-id'",
      ].join('\n'),
    ),
    {
      SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID: 'client-id',
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: 'token-value',
      SHOPIFY_STORE_DOMAIN: 'teavision.test',
    },
  )
})

test('score is 100 when every non-skipped automated check passes', () => {
  const score = calculateAutomatedScore([
    result('lint', 'PASS'),
    result('performance', 'SKIPPED'),
    result('browser smoke', 'PASS'),
  ])

  assert.equal(score.text, '100/100')
  assert.equal(score.passed, 2)
  assert.equal(score.total, 2)
  assert.equal(score.skipped, 1)
})

test('report renderer does not print a perfect score when a check fails', () => {
  const report = renderFinalReadinessReport({
    checkResults: [
      result('lint', 'PASS'),
      result('typecheck', 'FAIL'),
      result('performance', 'SKIPPED'),
    ],
    ownerGates: buildOwnerGateRows({
      env: {},
    }),
  })

  assert.doesNotMatch(report, /100\/100/)
  assert.match(report, /50\/100/)
  assert.match(report, /typecheck/)
})

test('failing performance result prevents a launch-ready report', () => {
  const report = renderFinalReadinessReport({
    checkResults: [
      result('lint', 'PASS'),
      result('performance', 'FAIL'),
      result('browser smoke', 'PASS'),
    ],
    ownerGates: buildOwnerGateRows({
      env: {},
    }),
  })

  assert.doesNotMatch(report, /100\/100/)
  assert.match(report, /67\/100/)
  assert.match(
    report,
    /no dated owner, staging, or field Core Web Vitals acceptance artifact was supplied/,
  )
  assert.match(report, /performance `FAIL` rows remain blocking/)
  assert.match(report, /Not launch-ready/)
})

const validPerformanceAcceptance = `# Performance Acceptance

## Decision
Status: accepted-non-blocking
Date: 2026-06-24
Approver: Store Owner
Evidence source: Staging Lighthouse URL

## Local Lab Failures Accepted
- \`/\`: accepted
- \`/products/test-standard-tea\`: accepted

## Rationale
Staging and field evidence are accepted for launch.
`

test('valid performance acceptance converts a failing performance row to accepted PASS evidence', () => {
  const accepted = applyPerformanceAcceptance(
    [result('lint', 'PASS'), result('performance', 'FAIL')],
    'docs/launch/performance-acceptance.md',
    {
      existsImpl: () => true,
      readFileImpl: () => validPerformanceAcceptance,
    },
  )
  const performance = accepted.find(
    (current) => current.label === 'performance',
  )

  assert.equal(performance?.status, 'PASS')
  assert.equal(performance?.exitCode, 0)
  assert.match(
    performance?.outputTail ?? '',
    /^Accepted non-blocking by dated performance acceptance:/,
  )

  const report = renderFinalReadinessReport({
    checkResults: accepted,
    ownerGates: [],
  })

  assert.match(
    report,
    /Performance acceptance status: Accepted non-blocking by dated performance acceptance:/,
  )
})

test('performance acceptance requires an ISO date', () => {
  assert.throws(
    () =>
      validatePerformanceAcceptanceDocument(
        validPerformanceAcceptance.replace('Date: 2026-06-24', 'Date:'),
      ),
    /Date/,
  )
})

test('performance acceptance requires an approver', () => {
  assert.throws(
    () =>
      validatePerformanceAcceptanceDocument(
        validPerformanceAcceptance.replace(
          'Approver: Store Owner',
          'Approver:',
        ),
      ),
    /Approver/,
  )
})

test('performance acceptance requires an evidence source', () => {
  assert.throws(
    () =>
      validatePerformanceAcceptanceDocument(
        validPerformanceAcceptance.replace(
          'Evidence source: Staging Lighthouse URL',
          'Evidence source:',
        ),
      ),
    /Evidence source/,
  )
})

test('report renderer includes the required final report headings', () => {
  const report = renderFinalReadinessReport({
    checkResults: [result('lint', 'PASS')],
    ownerGates: buildOwnerGateRows({
      env: {},
    }),
  })

  for (const heading of [
    '# Final Production Readiness Report',
    '## Automated Code Readiness Score',
    '## Automated Check Matrix',
    '## Owner-Gated Launch Evidence',
    '## Representative Surface Evidence',
    '## Operations Evidence',
    '## Performance And UX Evidence',
    '## Residual Risks',
    '## Launch Decision',
  ]) {
    assert.ok(report.includes(heading), `missing ${heading}`)
  }
})

test('report renderer links inherited Phase 15 and Phase 16 evidence sources', () => {
  const report = renderFinalReadinessReport({
    checkResults: [
      result('security headers', 'PASS'),
      result('seo disabled', 'PASS'),
      result('seo enabled', 'PASS'),
      result('seo redirects', 'PASS'),
      result('seo runbook', 'PASS'),
      result('production e2e', 'PASS'),
      result('performance', 'PASS'),
      result('browser smoke', 'PASS'),
    ],
    ownerGates: buildOwnerGateRows({
      env: {},
    }),
  })

  for (const source of [
    'scripts/security/probe-production-security.mjs',
    'scripts/seo/probe-launch-seo.mjs',
    'docs/launch/analytics-and-indexing-runbook.md',
    'docs/launch/operations-runbook.md',
    'docs/launch/production-e2e-evidence.md',
    'docs/launch/performance-evidence.md',
  ]) {
    assert.ok(report.includes(source), `missing ${source}`)
  }

  assert.match(
    report,
    /Search Console rows stay `pending`, `owner-blocked`, or `approved`/,
  )
})

test('enabled SEO pass keeps Search Console proof owner-gated', () => {
  const report = renderFinalReadinessReport({
    checkResults: [result('seo enabled', 'PASS')],
    ownerGates: buildOwnerGateRows({
      env: {},
    }),
  })

  assert.match(report, /100\/100/)
  assert.match(report, /Owner-gated Shopify\/admin proof is listed separately/)
  assert.match(report, /Search Console sitemap submission \| pending/)
  assert.match(report, /Search Console URL inspection \| pending/)
  assert.match(
    report,
    /Automated code readiness is green[\s\S]*pending or owner-blocked Shopify\/admin proof/,
  )
})

test('all-skipped report is not treated as launch-ready', () => {
  const report = renderFinalReadinessReport({
    checkResults: [result('lint', 'SKIPPED'), result('typecheck', 'SKIPPED')],
    ownerGates: buildOwnerGateRows({
      env: {},
    }),
  })

  assert.match(report, /0\/100/)
  assert.match(report, /Not evaluated: every automated check was skipped/)
})

test('skipped checks are excluded from score denominator and listed', () => {
  const report = renderFinalReadinessReport({
    checkResults: [
      result('lint', 'PASS'),
      result('security headers', 'SKIPPED'),
    ],
    ownerGates: buildOwnerGateRows({
      env: {},
    }),
  })

  assert.match(report, /100\/100/)
  assert.match(report, /SKIPPED/)
  assert.match(report, /security headers/)
})

test('owner-gated table renders required launch proof rows', () => {
  const report = renderFinalReadinessReport({
    checkResults: [result('lint', 'PASS')],
    ownerGates: buildOwnerGateRows({
      env: {
        FINAL_READINESS_HOSTED_CHECKOUT_STATUS: 'owner-blocked',
      },
    }),
  })

  for (const label of [
    'hosted checkout',
    'payment',
    'shipping rates',
    'tax',
    'order creation',
    'success redirect',
    'live Customer Account OAuth',
    'protected customer data',
    'B2B/customer pricing',
    'Search Console sitemap submission',
    'Search Console URL inspection',
  ]) {
    assert.ok(report.includes(label), `missing ${label}`)
  }

  assert.match(report, /owner-blocked/)
})

test('owner-gated pending states do not reduce automated score', () => {
  const report = renderFinalReadinessReport({
    checkResults: [result('lint', 'PASS')],
    ownerGates: buildOwnerGateRows({
      env: {},
    }),
  })

  assert.match(report, /100\/100/)
  assert.match(report, /Owner-gated Shopify\/admin proof is listed separately/)
})

test('owner-gated status rejects unsupported values', () => {
  assert.throws(
    () =>
      buildOwnerGateRows({
        env: {
          FINAL_READINESS_PAYMENT_STATUS: 'complete',
        },
      }),
    /Unsupported owner-gated status/,
  )
})

test('unreachable base URL fails required live-server probes', async () => {
  const matrix = buildAutomatedCheckMatrix({
    baseUrl: 'http://127.0.0.1:4173',
  }).filter((check) => check.requiresBaseUrl)

  const results = await runAutomatedChecks(matrix, {
    baseUrl: 'http://127.0.0.1:4173',
    isBaseUrlReachable: false,
    lifecycleFactory: async () => ({
      async stop() {},
    }),
    startServer: true,
  })

  assert.equal(results.length, 3)
  assert.equal(
    results.every((current) => current.status === 'FAIL'),
    true,
  )
  assert.match(results[0].outputTail, /required live-server probe/)
})

test('required live probes use distinct indexing lifecycle profiles', async () => {
  const matrix = buildAutomatedCheckMatrix({
    baseUrl: 'http://127.0.0.1:4173',
  }).filter((check) => check.requiresBaseUrl)
  const lifecycleStarts = []
  let lifecycleStops = 0

  const results = await runAutomatedChecks(matrix, {
    baseUrl: 'http://127.0.0.1:4173',
    isBaseUrlReachable: true,
    lifecycleFactory: async (_baseUrl, options) => {
      lifecycleStarts.push(options)

      return {
        async stop() {
          lifecycleStops += 1
        },
      }
    },
    runCommandImpl: async (currentCheck) => result(currentCheck.label, 'PASS'),
    startServer: true,
  })

  assert.deepEqual(
    lifecycleStarts.map((options) => options.disableIndexing),
    [true, false],
  )
  assert.equal(lifecycleStops, 2)
  assert.deepEqual(
    results.map((current) => current.label),
    ['security headers', 'seo disabled', 'seo enabled'],
  )
})

test('no-start-server required live probes fail when the base URL is unreachable', async () => {
  const matrix = buildAutomatedCheckMatrix({
    baseUrl: 'http://127.0.0.1:4173',
  }).filter((check) => check.requiresBaseUrl)
  let lifecycleStarted = false

  const results = await runAutomatedChecks(matrix, {
    baseUrl: 'http://127.0.0.1:4173',
    isBaseUrlReachable: false,
    lifecycleFactory: async () => {
      lifecycleStarted = true

      return {
        async stop() {},
      }
    },
    startServer: false,
  })

  assert.equal(lifecycleStarted, false)
  assert.equal(results.length, 3)
  assert.equal(
    results.every((current) => current.status === 'FAIL'),
    true,
  )
  assert.match(results[0].outputTail, /was not reachable/)
})
