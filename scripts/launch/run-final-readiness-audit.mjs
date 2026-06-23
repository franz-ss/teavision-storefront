import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { startProductionLifecycle } from '../performance/probe-lighthouse.mjs'

export const DEFAULT_BASE_URL = 'http://127.0.0.1:4173'
export const DEFAULT_REPORT_PATH =
  'docs/launch/final-production-readiness-report.md'

export const AUTOMATED_CHECK_LABELS = [
  'lint',
  'typecheck',
  'build',
  'unit',
  'integration',
  'storybook',
  'contracts',
  'dependency audit',
  'security headers',
  'seo disabled',
  'seo enabled',
  'seo redirects',
  'seo runbook',
  'readiness',
  'production e2e',
  'performance',
  'browser smoke',
]

export const OWNER_GATE_STATUSES = new Set([
  'approved',
  'pending',
  'owner-blocked',
])

const OUTPUT_TAIL_LIMIT = 2000
const LOCAL_ENV_PATH = '.env.local'

const OWNER_GATE_DEFINITIONS = [
  {
    envPrefix: 'HOSTED_CHECKOUT',
    evidence:
      'Pending store-owner approval; see docs/testing/cart-checkout-uat.md',
    label: 'hosted checkout',
  },
  {
    envPrefix: 'PAYMENT',
    evidence:
      'Pending store-owner approval; see docs/testing/cart-checkout-uat.md',
    label: 'payment',
  },
  {
    envPrefix: 'SHIPPING_RATES',
    evidence:
      'Pending store-owner approval; see docs/testing/cart-checkout-uat.md',
    label: 'shipping rates',
  },
  {
    envPrefix: 'TAX',
    evidence:
      'Pending store-owner approval; see docs/testing/cart-checkout-uat.md',
    label: 'tax',
  },
  {
    envPrefix: 'ORDER_CREATION',
    evidence:
      'Pending store-owner approval; see docs/testing/cart-checkout-uat.md',
    label: 'order creation',
  },
  {
    envPrefix: 'SUCCESS_REDIRECT',
    evidence:
      'Pending store-owner approval; see docs/testing/cart-checkout-uat.md',
    label: 'success redirect',
  },
  {
    envPrefix: 'CUSTOMER_ACCOUNT_OAUTH',
    evidence:
      'Pending Shopify admin approval; see docs/testing/customer-accounts-setup.md',
    label: 'live Customer Account OAuth',
  },
  {
    envPrefix: 'PROTECTED_CUSTOMER_DATA',
    evidence:
      'Pending Shopify protected customer data approval evidence; see docs/testing/customer-accounts-setup.md',
    label: 'protected customer data',
  },
  {
    envPrefix: 'B2B_CUSTOMER_PRICING',
    evidence:
      'Pending authoritative Shopify customer/company-location pricing proof; see docs/testing/customer-accounts-setup.md',
    label: 'B2B/customer pricing',
  },
  {
    envPrefix: 'SEARCH_CONSOLE_SITEMAP',
    evidence:
      'Pending owner Search Console access; see docs/launch/analytics-and-indexing-runbook.md',
    label: 'Search Console sitemap submission',
  },
  {
    envPrefix: 'SEARCH_CONSOLE_URL_INSPECTION',
    evidence:
      'Pending owner Search Console access; see docs/launch/analytics-and-indexing-runbook.md',
    label: 'Search Console URL inspection',
  },
]

export function parseArgs(argv) {
  const args = {
    baseUrl: process.env.FINAL_READINESS_BASE_URL ?? DEFAULT_BASE_URL,
    dryRun: false,
    reportPath: process.env.FINAL_READINESS_REPORT_PATH ?? DEFAULT_REPORT_PATH,
    skipOwnerGated: false,
    skipPerformance: false,
    startServer: true,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]

    if (value === '--') {
      continue
    }

    if (value === '--dry-run') {
      args.dryRun = true
      continue
    }

    if (value === '--start-server') {
      args.startServer = true
      continue
    }

    if (value === '--no-start-server') {
      args.startServer = false
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

    if (value === '--skip-performance') {
      args.skipPerformance = true
      continue
    }

    if (value === '--skip-owner-gated') {
      args.skipOwnerGated = true
      continue
    }

    if (value === '--report-path') {
      args.reportPath = argv[index + 1] ?? args.reportPath
      index += 1
      continue
    }

    if (value.startsWith('--report-path=')) {
      args.reportPath = value.slice('--report-path='.length)
      continue
    }

    if (value === '--help') {
      args.help = true
      continue
    }
  }

  assertBaseUrl(args.baseUrl)

  return args
}

export function buildAutomatedCheckMatrix({
  baseUrl = DEFAULT_BASE_URL,
  skipPerformance = false,
} = {}) {
  const checks = [
    check('lint', ['pnpm', 'lint']),
    check('typecheck', ['pnpm', 'typecheck']),
    check('build', ['pnpm', 'build']),
    check('unit', ['pnpm', 'test:unit']),
    check('integration', ['pnpm', 'test:integration']),
    check('storybook', ['pnpm', 'test:stories']),
    check('contracts', ['pnpm', 'test:contracts']),
    check('dependency audit', ['pnpm', 'audit', '--audit-level', 'moderate']),
    check(
      'security headers',
      ['node', 'scripts/security/probe-production-security.mjs', baseUrl],
      {
        requiresBaseUrl: true,
      },
    ),
    check(
      'seo disabled',
      [
        'node',
        'scripts/seo/probe-launch-seo.mjs',
        '--mode',
        'disabled',
        '--base-url',
        baseUrl,
      ],
      { requiresBaseUrl: true },
    ),
    check(
      'seo enabled',
      [
        'node',
        'scripts/seo/probe-launch-seo.mjs',
        '--mode',
        'enabled',
        '--base-url',
        baseUrl,
      ],
      { requiresBaseUrl: true },
    ),
    check('seo redirects', [
      'node',
      'scripts/seo/probe-launch-seo.mjs',
      '--mode',
      'redirects',
    ]),
    check('seo runbook', [
      'node',
      'scripts/seo/probe-launch-seo.mjs',
      '--mode',
      'runbook',
    ]),
    check('readiness', [
      'node',
      'scripts/launch/probe-readiness.mjs',
      '--json',
    ]),
    check('production e2e', ['pnpm', 'test:e2e:production']),
    check(
      'performance',
      [
        'pnpm',
        'test:performance',
        '--',
        '--start-server',
        '--base-url',
        baseUrl,
        '--json-summary',
      ],
      skipPerformance ? { skipReason: 'Skipped by --skip-performance.' } : {},
    ),
    check('browser smoke', [
      'pnpm',
      'test:e2e:production',
      '--',
      'tests/e2e/production-smoke.spec.ts',
    ]),
  ]

  assertMatrixLabels(checks)

  return checks
}

export function buildOwnerGateRows({
  env = process.env,
  skipOwnerGated = false,
} = {}) {
  const rows = OWNER_GATE_DEFINITIONS.map((definition) => {
    const status =
      readOptionalEnv(env, `FINAL_READINESS_${definition.envPrefix}_STATUS`) ??
      'pending'
    const evidence =
      readOptionalEnv(
        env,
        `FINAL_READINESS_${definition.envPrefix}_EVIDENCE`,
      ) ?? definition.evidence

    return {
      evidence: skipOwnerGated
        ? `Owner-gated evaluation skipped by --skip-owner-gated. ${evidence}`
        : evidence,
      label: definition.label,
      status,
    }
  })

  validateOwnerGateRows(rows)

  return rows
}

export function validateOwnerGateRows(rows) {
  for (const row of rows) {
    if (!OWNER_GATE_STATUSES.has(row.status)) {
      throw new Error(
        `Unsupported owner-gated status "${row.status}" for ${row.label}. Use approved, pending, or owner-blocked.`,
      )
    }
  }
}

export async function runAutomatedChecks(
  checks,
  {
    baseUrl = DEFAULT_BASE_URL,
    fetchImpl = globalThis.fetch,
    isBaseUrlReachable,
    lifecycleFactory = startProductionLifecycle,
    runCommandImpl = runCommand,
    startServer = false,
  } = {},
) {
  const results = []
  let baseUrlReachable = null
  let lifecycle = null
  let lifecycleFailure = null

  async function ensureLifecycle() {
    if (lifecycle || lifecycleFailure) return

    try {
      lifecycle = await lifecycleFactory(baseUrl)
    } catch (error) {
      lifecycleFailure = `Owned production-like server failed to start for required live probe: ${formatError(
        error,
      )}`
    }
  }

  async function stopLifecycle() {
    if (!lifecycle) return

    await lifecycle.stop()
    lifecycle = null
    baseUrlReachable = null
  }

  try {
    for (const currentCheck of checks) {
      if (currentCheck.skipReason) {
        results.push(skippedResult(currentCheck, currentCheck.skipReason))
        continue
      }

      if (currentCheck.requiresBaseUrl) {
        if (startServer) {
          await ensureLifecycle()
        }

        if (lifecycleFailure) {
          results.push(failedResult(currentCheck, lifecycleFailure))
          continue
        }

        if (baseUrlReachable === null) {
          baseUrlReachable =
            typeof isBaseUrlReachable === 'boolean'
              ? isBaseUrlReachable
              : await checkBaseUrl(baseUrl, fetchImpl)
        }

        if (!baseUrlReachable) {
          results.push(
            failedResult(
              currentCheck,
              `${baseUrl} was not reachable for this required live-server probe.`,
            ),
          )
          continue
        }

        results.push(await runCommandImpl(currentCheck))
        continue
      }

      if (lifecycle) {
        await stopLifecycle()
      }

      results.push(await runCommandImpl(currentCheck))
    }
  } finally {
    await stopLifecycle()
  }

  return results
}

export function calculateAutomatedScore(results) {
  const nonSkipped = results.filter((result) => result.status !== 'SKIPPED')
  const passed = nonSkipped.filter((result) => result.status === 'PASS')
  const failed = nonSkipped.filter((result) => result.status === 'FAIL')
  const skipped = results.filter((result) => result.status === 'SKIPPED')
  const value =
    nonSkipped.length === 0
      ? 0
      : Math.round((passed.length / nonSkipped.length) * 100)

  return {
    failed: failed.length,
    passed: passed.length,
    skipped: skipped.length,
    text: `${value}/100`,
    total: nonSkipped.length,
    value,
  }
}

export function renderFinalReadinessReport({
  baseUrl = DEFAULT_BASE_URL,
  checkResults,
  generatedAt = new Date().toISOString(),
  ownerGates,
}) {
  const score = calculateAutomatedScore(checkResults)
  const ownerApproved = ownerGates.filter(
    (gate) => gate.status === 'approved',
  ).length
  const ownerPending = ownerGates.length - ownerApproved

  return `# Final Production Readiness Report

Generated ${generatedAt}.

Base URL for live-server probes: \`${baseUrl}\`.

## Automated Code Readiness Score

**Score:** ${score.text}

${renderScoreExplanation(score)}

Owner-gated Shopify/admin proof is listed separately below and does not reduce the automated code readiness score.

## Automated Check Matrix

| Check | Status | Command | Duration | Exit Code | Evidence |
| --- | --- | --- | ---: | ---: | --- |
${checkResults.map(renderCheckRow).join('\n')}

## Owner-Gated Launch Evidence

| Gate | Status | Evidence |
| --- | --- | --- |
${ownerGates.map(renderOwnerGateRow).join('\n')}

## Representative Surface Evidence

- Home, PDP, collection, cart, search, account, legal/static routes, and \`/api/health\` are represented by \`pnpm test:e2e:production\`, \`pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts\`, and \`docs/launch/production-e2e-evidence.md\`.
- Production e2e status summary: \`${getResultStatus(checkResults, 'production e2e')}\`; browser smoke status summary: \`${getResultStatus(checkResults, 'browser smoke')}\`.
- Local browser evidence uses fake Shopify and fake Customer Account providers and must not be treated as live hosted checkout, payment, order, OAuth, protected-data, B2B pricing, or Search Console proof.

## Operations Evidence

- Safe public health/readiness evidence: \`node scripts/launch/probe-readiness.mjs --json\` and \`docs/launch/operations-runbook.md\`.
- Monitoring/logging evidence: \`docs/launch/operations-runbook.md\` records Sentry/Vercel launch watch signals and redacted logging boundaries.
- Security headers evidence: \`node scripts/security/probe-production-security.mjs ${baseUrl}\`; current status summary: \`${getResultStatus(
    checkResults,
    'security headers',
  )}\`.
- SEO/indexing evidence: \`node scripts/seo/probe-launch-seo.mjs --mode disabled\`, \`--mode enabled\`, \`--mode redirects\`, and \`--mode runbook\`; current summaries: disabled \`${getResultStatus(
    checkResults,
    'seo disabled',
  )}\`, enabled \`${getResultStatus(checkResults, 'seo enabled')}\`, redirects \`${getResultStatus(
    checkResults,
    'seo redirects',
  )}\`, runbook \`${getResultStatus(checkResults, 'seo runbook')}\`.
- Analytics/indexing owner-gated proof remains in \`docs/launch/analytics-and-indexing-runbook.md\`; Search Console rows stay \`pending\`, \`owner-blocked\`, or \`approved\` only when owner evidence is recorded.
- Owner approval gates: \`docs/testing/cart-checkout-uat.md\`, \`docs/testing/customer-accounts-setup.md\`, and \`docs/launch/analytics-and-indexing-runbook.md\`.

## Performance And UX Evidence

- Performance command: \`pnpm test:performance -- --start-server --base-url ${baseUrl} --json-summary\`.
- Performance status summary: \`${getResultStatus(checkResults, 'performance')}\`.
- Current local Lighthouse evidence is recorded in \`docs/launch/performance-evidence.md\`. Metric \`FAIL\` rows make this check fail by default; use \`--allow-metric-failures\` only for evidence-only diagnostics with explicit launch-risk follow-up.
- UX/accessibility polish evidence is recorded through production smoke coverage and \`docs/launch/performance-evidence.md\`.

## Residual Risks

${renderResidualRisks({ checkResults, ownerPending })}

## Launch Decision

${renderLaunchDecision({ ownerPending, score })}
`
}

function renderScoreExplanation(score) {
  const skippedText =
    score.skipped === 0
      ? 'No automated checks were explicitly skipped.'
      : `${score.skipped} automated check(s) were explicitly skipped by CLI flag and excluded from the denominator.`

  if (score.total === 0) {
    return `No automated checks were executed. ${skippedText}`
  }

  if (score.failed > 0) {
    return `${score.passed}/${score.total} required automated checks passed; ${score.failed} failed. ${skippedText}`
  }

  return `${score.passed}/${score.total} required automated checks passed. ${skippedText}`
}

function getResultStatus(checkResults, label) {
  const result = checkResults.find((candidate) => candidate.label === label)

  if (!result) return 'not recorded'

  if (result.status === 'SKIPPED') {
    return `SKIPPED - ${result.skipReason ?? 'no reason recorded'}`
  }

  return `${result.status} - exit ${formatExitCode(result.exitCode)}`
}

function renderResidualRisks({ checkResults, ownerPending }) {
  const failed = checkResults.filter((result) => result.status === 'FAIL')
  const skipped = checkResults.filter((result) => result.status === 'SKIPPED')
  const lines = []

  if (failed.length > 0) {
    lines.push(
      `- Failed automated checks require remediation before code readiness can be treated as complete: ${failed
        .map((result) => result.label)
        .join(', ')}.`,
    )
  }

  if (skipped.length > 0) {
    lines.push(
      `- Explicitly skipped automated checks require a deliberate rerun before treating that evidence as covered: ${skipped
        .map((result) => result.label)
        .join(', ')}.`,
    )
  }

  lines.push(
    '- Local Lighthouse evidence currently records route-level metric statuses in `docs/launch/performance-evidence.md`; local metric FAIL rows are not owner approval and are not hidden.',
  )

  if (ownerPending > 0) {
    lines.push(
      `- ${ownerPending} owner-gated Shopify/admin proof item(s) remain pending or owner-blocked until dated owner evidence exists.`,
    )
  }

  return lines.join('\n')
}

function renderLaunchDecision({ ownerPending, score }) {
  if (score.total === 0) {
    return 'Not evaluated: every automated check was skipped, so command evidence must be recorded before launch readiness can be decided.'
  }

  if (score.failed > 0) {
    return 'Not launch-ready: one or more non-skipped automated checks failed.'
  }

  if (ownerPending > 0) {
    return 'Automated code readiness is green for required checks that were not explicitly skipped, but launch remains gated by pending or owner-blocked Shopify/admin proof.'
  }

  return 'Automated code readiness is green for required checks that were not explicitly skipped and owner-gated proof is approved.'
}

function renderCheckRow(result) {
  return `| ${escapeMarkdownCell(result.label)} | ${result.status} | \`${escapeMarkdownCell(
    result.commandText,
  )}\` | ${formatDuration(result.durationMs)} | ${formatExitCode(
    result.exitCode,
  )} | ${escapeMarkdownCell(result.outputTail || result.skipReason || 'ok')} |`
}

function renderOwnerGateRow(gate) {
  return `| ${escapeMarkdownCell(gate.label)} | ${gate.status} | ${escapeMarkdownCell(
    gate.evidence,
  )} |`
}

function check(label, commandParts, options = {}) {
  const [command, ...args] = commandParts

  return {
    args,
    command,
    commandText: commandParts.join(' '),
    label,
    requiresBaseUrl: options.requiresBaseUrl === true,
    skipReason: options.skipReason,
  }
}

function assertMatrixLabels(checks) {
  const labels = checks.map((currentCheck) => currentCheck.label)

  if (labels.join('\n') !== AUTOMATED_CHECK_LABELS.join('\n')) {
    throw new Error('Final readiness audit matrix labels changed unexpectedly.')
  }
}

function assertBaseUrl(value) {
  try {
    new URL(value)
  } catch {
    throw new Error(`Invalid base URL: ${value}`)
  }
}

async function checkBaseUrl(baseUrl, fetchImpl) {
  if (typeof fetchImpl !== 'function') return false

  try {
    const response = await fetchImpl(baseUrl, { method: 'HEAD' })
    return response.status < 500
  } catch {
    return false
  }
}

function runCommand(currentCheck) {
  const startedAt = Date.now()
  const child = spawn(currentCheck.command, currentCheck.args, {
    env: { ...loadLocalEnv(), ...process.env },
    shell: process.platform === 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''

  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')
  child.stdout.on('data', (chunk) => {
    output += chunk
  })
  child.stderr.on('data', (chunk) => {
    output += chunk
  })

  return new Promise((resolve) => {
    child.on('error', (error) => {
      resolve({
        ...baseResult(currentCheck, startedAt),
        exitCode: 1,
        outputTail: redactOutput(error.message),
        status: 'FAIL',
      })
    })

    child.on('exit', (code, signal) => {
      const exitCode = typeof code === 'number' ? code : 1

      resolve({
        ...baseResult(currentCheck, startedAt),
        exitCode,
        outputTail: tailOutput(output || signal || ''),
        status: exitCode === 0 ? 'PASS' : 'FAIL',
      })
    })
  })
}

function baseResult(currentCheck, startedAt) {
  return {
    commandText: currentCheck.commandText,
    durationMs: Date.now() - startedAt,
    label: currentCheck.label,
  }
}

function skippedResult(currentCheck, skipReason) {
  return {
    commandText: currentCheck.commandText,
    durationMs: 0,
    exitCode: null,
    label: currentCheck.label,
    outputTail: '',
    skipReason,
    status: 'SKIPPED',
  }
}

function failedResult(currentCheck, outputTail) {
  return {
    commandText: currentCheck.commandText,
    durationMs: 0,
    exitCode: 1,
    label: currentCheck.label,
    outputTail: redactOutput(outputTail),
    status: 'FAIL',
  }
}

function tailOutput(output) {
  const redacted = redactOutput(output.trim())

  if (redacted.length <= OUTPUT_TAIL_LIMIT) return redacted

  return redacted.slice(redacted.length - OUTPUT_TAIL_LIMIT)
}

function redactOutput(output) {
  return String(output)
    .replaceAll(
      /\b[A-Z0-9_]*(TOKEN|SECRET|PASSWORD|COOKIE|KEY)\b=[^\s]+/gi,
      '$1=[redacted]',
    )
    .replaceAll(/https:\/\/checkout[^\s)]+/gi, '[redacted-checkout-url]')
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error)
}

export function parseEnvFile(source) {
  const env = {}

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) continue

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)

    if (!match) continue

    env[match[1]] = unwrapEnvValue(match[2].trim())
  }

  return env
}

function loadLocalEnv(path = LOCAL_ENV_PATH) {
  if (!existsSync(path)) return {}

  return parseEnvFile(readFileSync(path, 'utf8'))
}

function unwrapEnvValue(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function readOptionalEnv(env, name) {
  const value = env[name]

  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}

function escapeMarkdownCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')
}

function formatDuration(value) {
  return value === 0 ? '0ms' : `${Math.max(1, Math.round(value))}ms`
}

function formatExitCode(value) {
  return value === null ? 'n/a' : String(value)
}

function printDryRun(checks) {
  console.log('| Check | Command |')
  console.log('| --- | --- |')

  for (const currentCheck of checks) {
    console.log(
      `| ${escapeMarkdownCell(currentCheck.label)} | \`${escapeMarkdownCell(
        currentCheck.commandText,
      )}\` |`,
    )
  }
}

function printUsage() {
  console.error(
    'Usage: node scripts/launch/run-final-readiness-audit.mjs [--dry-run] [--base-url URL] [--start-server] [--no-start-server] [--skip-performance] [--skip-owner-gated]',
  )
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv)

  if (args.help) {
    printUsage()
    return 0
  }

  const checks = buildAutomatedCheckMatrix({
    baseUrl: args.baseUrl,
    skipPerformance: args.skipPerformance,
  })

  if (args.dryRun) {
    printDryRun(checks)
    return 0
  }

  const ownerGates = buildOwnerGateRows({
    skipOwnerGated: args.skipOwnerGated,
  })
  const checkResults = await runAutomatedChecks(checks, {
    baseUrl: args.baseUrl,
    startServer: args.startServer,
  })
  const report = renderFinalReadinessReport({
    baseUrl: args.baseUrl,
    checkResults,
    ownerGates,
  })

  mkdirSync(dirname(args.reportPath), { recursive: true })
  writeFileSync(args.reportPath, report)
  console.log(`Wrote ${args.reportPath}`)

  return checkResults.some((result) => result.status === 'FAIL') ? 1 : 0
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().then(
    (exitCode) => {
      process.exitCode = exitCode
    },
    (error) => {
      console.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    },
  )
}
