import assert from 'node:assert/strict'
import test from 'node:test'

import {
  AUTOMATED_CHECK_LABELS,
  buildAutomatedCheckMatrix,
  buildOwnerGateRows,
  calculateAutomatedScore,
  parseArgs,
  parseEnvFile,
  renderFinalReadinessReport,
  runAutomatedChecks,
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
        check.label === 'performance' &&
        check.commandText ===
          'pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173',
    ),
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
    ]),
    {
      baseUrl: 'http://127.0.0.1:4999',
      dryRun: true,
      reportPath: 'docs/launch/final-production-readiness-report.md',
      skipOwnerGated: true,
      skipPerformance: true,
    },
  )
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

  assert.match(report, /Search Console rows stay `pending`, `owner-blocked`, or `approved`/)
})

test('all-skipped report is not treated as launch-ready', () => {
  const report = renderFinalReadinessReport({
    checkResults: [
      result('lint', 'SKIPPED'),
      result('typecheck', 'SKIPPED'),
    ],
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

test('unreachable base URL skips live-server probes with reasons', async () => {
  const matrix = buildAutomatedCheckMatrix({
    baseUrl: 'http://127.0.0.1:4173',
  }).filter((check) => check.requiresBaseUrl)

  const results = await runAutomatedChecks(matrix, {
    baseUrl: 'http://127.0.0.1:4173',
    isBaseUrlReachable: false,
  })

  assert.equal(results.length, 3)
  assert.equal(results.every((current) => current.status === 'SKIPPED'), true)
  assert.ok(results[0].skipReason.includes('was not reachable'))
})
