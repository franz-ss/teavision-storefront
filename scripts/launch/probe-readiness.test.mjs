import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  OPERATIONS_RUNBOOK_PATH,
  REQUIRED_OPERATIONS_RUNBOOK_HEADINGS,
  buildReadinessReport,
  parseArgs,
} from './probe-readiness.mjs'

const completeEnv = {
  SHOPIFY_STORE_DOMAIN: 'teavision.test',
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: 'present',
  SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID: 'present',
  SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET: 'present',
  SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI: 'https://teavision.test/account/callback',
  SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI:
    'https://teavision.test/account/logout',
  DISABLE_INDEXING: 'true',
  NEXT_PUBLIC_ANALYTICS_MODE: 'fake',
}

const requiredDocs = new Map([
  [
    'docs/testing/customer-accounts-setup.md',
    [
      '# Customer Accounts Setup And Launch Readiness',
      '## Manual Approval Gate',
      '## Protected Customer Data Access',
      '## Launch Checklist',
      'Live Shopify Customer Account OAuth is blocked until owner/admin approval is recorded.',
    ].join('\n'),
  ],
  [
    'docs/testing/cart-checkout-uat.md',
    [
      '# Cart and Checkout Hosted UAT',
      '## Checklist',
      '## Evidence To Capture',
      '## Residual Risks',
    ].join('\n'),
  ],
  [
    'docs/launch/analytics-and-indexing-runbook.md',
    [
      '# Analytics And Indexing Launch Runbook',
      '## Owner-Gated Purchase And Order Tracking',
      '## Search Console And Sitemap Submission',
      '## Evidence Log',
      'NEXT_PUBLIC_ANALYTICS_MODE=fake',
    ].join('\n'),
  ],
  [
    OPERATIONS_RUNBOOK_PATH,
    REQUIRED_OPERATIONS_RUNBOOK_HEADINGS.join('\n'),
  ],
  ['docs/launch/seo-route-evidence.md', '# SEO Evidence'],
  ['scripts/security/probe-production-security.mjs', ''],
  ['scripts/seo/probe-launch-seo.mjs', ''],
])

function fileExists(sourcePath) {
  return requiredDocs.has(sourcePath)
}

function readText(sourcePath) {
  return requiredDocs.get(sourcePath) ?? ''
}

test('pending owner gates do not fail automated code readiness', () => {
  const report = buildReadinessReport({
    env: completeEnv,
    fileExists,
    readText,
    ownerGates: [
      {
        id: 'hosted-checkout',
        label: 'Hosted checkout/payment/order',
        status: 'pending',
        evidence: 'Pending store-owner approval',
      },
    ],
  })

  assert.notEqual(report.summary, 'blocked')
  assert.equal(
    report.checks.some((check) => check.id.startsWith('owner-gate-status:')),
    false,
  )
})

test('malformed owner-gate status blocks automated readiness', () => {
  const report = buildReadinessReport({
    env: completeEnv,
    fileExists,
    readText,
    ownerGates: [
      {
        id: 'hosted-checkout',
        label: 'Hosted checkout/payment/order',
        status: 'done',
        evidence: 'Malformed status fixture',
      },
    ],
  })

  assert.equal(report.summary, 'blocked')
  assert.equal(
    report.checks.some(
      (check) =>
        check.id === 'owner-gate-status:hosted-checkout' &&
        check.status === 'blocked',
    ),
    true,
  )
})

test('docs mode warns before the operations runbook exists', () => {
  const report = buildReadinessReport({
    env: completeEnv,
    fileExists: (sourcePath) =>
      sourcePath === OPERATIONS_RUNBOOK_PATH ? false : fileExists(sourcePath),
    mode: 'docs',
    readText,
  })

  assert.equal(report.summary, 'degraded')
  assert.equal(
    report.checks.some(
      (check) =>
        check.id === 'operations-runbook-doc' &&
        check.status === 'degraded',
    ),
    true,
  )
})

test('docs mode blocks when an existing operations runbook is missing a required heading', () => {
  const report = buildReadinessReport({
    env: completeEnv,
    fileExists,
    mode: 'docs',
    readText: (sourcePath) =>
      sourcePath === OPERATIONS_RUNBOOK_PATH
        ? '# Operations Launch Runbook\n## Launch Watch'
        : readText(sourcePath),
  })

  assert.equal(report.summary, 'blocked')
  assert.equal(
    report.checks.some(
      (check) =>
        check.id.includes('## Alerts And Escalation') &&
        check.status === 'blocked',
    ),
    true,
  )
})

test('parses docs and json CLI flags without running the probe', () => {
  assert.deepEqual(parseArgs(['--mode', 'docs', '--json']), {
    json: true,
    launchMode: false,
    mode: 'docs',
  })
})
