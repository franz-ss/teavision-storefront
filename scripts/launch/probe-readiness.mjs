import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const DEFAULT_MODE = 'default'
const VALID_MODES = new Set([DEFAULT_MODE, 'docs'])
const OWNER_GATE_STATUSES = new Set(['approved', 'pending', 'owner-blocked'])

const REQUIRED_CUSTOMER_ACCOUNT_ENV = [
  'SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID',
  'SHOPIFY_CUSTOMER_ACCOUNT_SESSION_SECRET',
  'SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI',
  'SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI',
]

const REQUIRED_STATIC_PATHS = [
  {
    id: 'customer-accounts-doc',
    label: 'Customer Account setup doc',
    path: 'docs/testing/customer-accounts-setup.md',
  },
  {
    id: 'cart-checkout-uat-doc',
    label: 'Cart checkout UAT doc',
    path: 'docs/testing/cart-checkout-uat.md',
  },
  {
    id: 'analytics-indexing-runbook',
    label: 'Analytics and indexing runbook',
    path: 'docs/launch/analytics-and-indexing-runbook.md',
  },
  {
    id: 'security-probe-script',
    label: 'Security header probe',
    path: 'scripts/security/probe-production-security.mjs',
  },
  {
    id: 'seo-probe-script',
    label: 'SEO launch probe',
    path: 'scripts/seo/probe-launch-seo.mjs',
  },
]

const REQUIRED_DOC_HEADINGS = [
  {
    path: 'docs/testing/customer-accounts-setup.md',
    headings: [
      '# Customer Accounts Setup And Launch Readiness',
      '## Manual Approval Gate',
      '## Protected Customer Data Access',
      '## Launch Checklist',
    ],
  },
  {
    path: 'docs/testing/cart-checkout-uat.md',
    headings: [
      '# Cart and Checkout Hosted UAT',
      '## Checklist',
      '## Evidence To Capture',
      '## Residual Risks',
    ],
  },
  {
    path: 'docs/launch/analytics-and-indexing-runbook.md',
    headings: [
      '# Analytics And Indexing Launch Runbook',
      '## Owner-Gated Purchase And Order Tracking',
      '## Search Console And Sitemap Submission',
      '## Evidence Log',
    ],
  },
]

export const OPERATIONS_RUNBOOK_PATH = 'docs/launch/operations-runbook.md'

export const REQUIRED_OPERATIONS_RUNBOOK_HEADINGS = [
  '# Operations Launch Runbook',
  '## Launch Watch',
  '## Alerts And Escalation',
  '## Rollback',
  '## Platform Recovery',
  '## Reversible Env Gates',
  '## Owner Approval Gates',
  '## Week-One Monitoring Checklist',
  '## Evidence Log',
]

const OWNER_GATE_CONFIG = [
  {
    id: 'hosted-checkout-payment-order',
    label: 'Hosted checkout/payment/shipping/tax/order/success redirect',
    statusEnv: 'READINESS_HOSTED_CHECKOUT_STATUS',
    evidenceEnv: 'READINESS_HOSTED_CHECKOUT_EVIDENCE',
    defaultEvidence:
      'Pending store-owner approval; see docs/testing/cart-checkout-uat.md',
  },
  {
    id: 'live-customer-account-oauth',
    label: 'Live Customer Account OAuth',
    statusEnv: 'READINESS_CUSTOMER_ACCOUNT_OAUTH_STATUS',
    evidenceEnv: 'READINESS_CUSTOMER_ACCOUNT_OAUTH_EVIDENCE',
    defaultEvidence:
      'Pending Shopify admin approval; see docs/testing/customer-accounts-setup.md',
  },
  {
    id: 'protected-customer-data-access',
    label: 'Protected customer data access',
    statusEnv: 'READINESS_PROTECTED_CUSTOMER_DATA_STATUS',
    evidenceEnv: 'READINESS_PROTECTED_CUSTOMER_DATA_EVIDENCE',
    defaultEvidence:
      'Pending Shopify protected customer data approval evidence',
  },
  {
    id: 'b2b-customer-pricing-parity',
    label: 'B2B/customer pricing parity',
    statusEnv: 'READINESS_B2B_PRICING_PARITY_STATUS',
    evidenceEnv: 'READINESS_B2B_PRICING_PARITY_EVIDENCE',
    defaultEvidence:
      'Pending authoritative Shopify customer/company-location proof',
  },
  {
    id: 'search-console-proof',
    label: 'Search Console sitemap submission and URL inspection',
    statusEnv: 'READINESS_SEARCH_CONSOLE_STATUS',
    evidenceEnv: 'READINESS_SEARCH_CONSOLE_EVIDENCE',
    defaultEvidence:
      'Pending owner Search Console access; see docs/launch/analytics-and-indexing-runbook.md',
  },
]

export function parseArgs(argv) {
  const args = {
    json: false,
    launchMode: process.env.READINESS_LAUNCH_MODE === 'owner-approved',
    mode: DEFAULT_MODE,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]

    if (value === '--json') {
      args.json = true
      continue
    }

    if (value === '--launch') {
      args.launchMode = true
      continue
    }

    if (value === '--mode') {
      args.mode = argv[index + 1] ?? args.mode
      index += 1
      continue
    }

    if (value.startsWith('--mode=')) {
      args.mode = value.slice('--mode='.length)
      continue
    }

    if (value === '--help') {
      args.help = true
      continue
    }
  }

  if (!VALID_MODES.has(args.mode)) {
    throw new Error(
      `Unsupported readiness mode "${args.mode}". Use one of: ${[
        ...VALID_MODES,
      ].join(', ')}`,
    )
  }

  return args
}

export function buildReadinessReport({
  env = process.env,
  fileExists = existsSync,
  launchMode = false,
  mode = DEFAULT_MODE,
  ownerGates = buildOwnerGates(env),
  readText = readSource,
} = {}) {
  const docs = readReadinessDocs({ fileExists, readText })
  const checks =
    mode === 'docs'
      ? buildDocumentationChecks({ fileExists, readText })
      : [
          ...buildConfigChecks({ docs, env, fileExists, launchMode }),
          ...buildDocumentationChecks({ fileExists, readText }),
        ]

  const ownerGateStatusChecks = validateOwnerGateStatuses(ownerGates)
  const summary = summarizeReadiness([...checks, ...ownerGateStatusChecks])

  return {
    checks: [...checks, ...ownerGateStatusChecks],
    ownerGates,
    summary,
  }
}

export function summarizeReadiness(checks) {
  if (checks.some((check) => check.status === 'blocked')) {
    return 'blocked'
  }

  if (checks.some((check) => check.status === 'degraded')) {
    return 'degraded'
  }

  return 'ok'
}

export function buildOwnerGates(env = process.env) {
  return OWNER_GATE_CONFIG.map((gate) => ({
    id: gate.id,
    label: gate.label,
    status: optionalEnv(env, gate.statusEnv) ?? 'pending',
    evidence: optionalEnv(env, gate.evidenceEnv) ?? gate.defaultEvidence,
  }))
}

function buildConfigChecks({ docs, env, fileExists, launchMode }) {
  const checks = [
    requiredEnvCheck(env, 'SHOPIFY_STORE_DOMAIN', 'Shopify store domain'),
    requiredEnvCheck(
      env,
      'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
      'Shopify Storefront access token',
    ),
    customerAccountConfigCheck(env, docs.customerAccountsSetup),
    indexingLaunchCheck({ env, fileExists, launchMode }),
    analyticsModeCheck({ docs, env, launchMode }),
  ]

  for (const requiredPath of REQUIRED_STATIC_PATHS) {
    checks.push(
      fileExists(requiredPath.path)
        ? ok(requiredPath.id, requiredPath.label, `${requiredPath.path} exists`)
        : blocked(
            requiredPath.id,
            requiredPath.label,
            `${requiredPath.path} is missing`,
          ),
    )
  }

  return checks
}

function buildDocumentationChecks({ fileExists, readText }) {
  const checks = []

  for (const doc of REQUIRED_DOC_HEADINGS) {
    checks.push(...headingChecks({ fileExists, headings: doc.headings, path: doc.path, readText }))
  }

  if (!fileExists(OPERATIONS_RUNBOOK_PATH)) {
    checks.push(
      degraded(
        'operations-runbook-doc',
        'Operations runbook',
        `${OPERATIONS_RUNBOOK_PATH} pending in plan 17-01 task 4`,
      ),
    )
    return checks
  }

  checks.push(
    ...headingChecks({
      fileExists,
      headings: REQUIRED_OPERATIONS_RUNBOOK_HEADINGS,
      path: OPERATIONS_RUNBOOK_PATH,
      readText,
    }),
  )

  return checks
}

function headingChecks({ fileExists, headings, path: sourcePath, readText }) {
  if (!fileExists(sourcePath)) {
    return [
      blocked(
        `doc-exists:${sourcePath}`,
        'Required launch doc',
        `${sourcePath} is missing`,
      ),
    ]
  }

  const source = readText(sourcePath)

  return headings.map((heading) =>
    source.includes(heading)
      ? ok(`doc-heading:${sourcePath}:${heading}`, heading, 'present')
      : blocked(
          `doc-heading:${sourcePath}:${heading}`,
          heading,
          `${sourcePath} is missing required heading`,
        ),
  )
}

function customerAccountConfigCheck(env, customerAccountsSetupSource) {
  const present = REQUIRED_CUSTOMER_ACCOUNT_ENV.filter((name) =>
    hasEnv(env, name),
  )
  const missing = REQUIRED_CUSTOMER_ACCOUNT_ENV.filter(
    (name) => !hasEnv(env, name),
  )

  if (missing.length === 0) {
    return ok(
      'customer-account-config',
      'Customer Account config',
      `${present.length} server config keys present`,
    )
  }

  if (isCustomerAccountOwnerGated(customerAccountsSetupSource)) {
    return degraded(
      'customer-account-config',
      'Customer Account config',
      `${missing.length} keys missing; owner-gated live OAuth evidence documented`,
    )
  }

  return blocked(
    'customer-account-config',
    'Customer Account config',
    `${missing.length} required server config keys missing`,
  )
}

function indexingLaunchCheck({ env, fileExists, launchMode }) {
  if (!launchMode) {
    return ok(
      'indexing-launch-evidence',
      'Launch indexing evidence',
      'launch mode not requested',
    )
  }

  const indexingEnabled = optionalEnv(env, 'DISABLE_INDEXING') === 'false'
  const evidenceExists = fileExists('docs/launch/seo-route-evidence.md')

  if (indexingEnabled && evidenceExists) {
    return ok(
      'indexing-launch-evidence',
      'Launch indexing evidence',
      'DISABLE_INDEXING=false with SEO evidence recorded',
    )
  }

  return degraded(
    'indexing-launch-evidence',
    'Launch indexing evidence',
    'owner-approved launch mode should record DISABLE_INDEXING=false evidence before cutover',
  )
}

function analyticsModeCheck({ docs, env, launchMode }) {
  const analyticsMode = optionalEnv(env, 'NEXT_PUBLIC_ANALYTICS_MODE')

  if (!launchMode || analyticsMode !== 'fake') {
    return ok(
      'analytics-launch-mode',
      'Analytics launch mode',
      launchMode
        ? 'analytics mode is not fake'
        : 'owner-approved launch mode not requested',
    )
  }

  const documentedFakeMode = docs.analyticsRunbook.includes(
    'NEXT_PUBLIC_ANALYTICS_MODE=fake',
  )

  return documentedFakeMode
    ? degraded(
        'analytics-launch-mode',
        'Analytics launch mode',
        'fake mode remains documented for local/CI; owner-approved launch should record the destination decision',
      )
    : blocked(
        'analytics-launch-mode',
        'Analytics launch mode',
        'fake analytics mode in launch mode without documentation',
      )
}

function validateOwnerGateStatuses(ownerGates) {
  return ownerGates
    .filter((gate) => !OWNER_GATE_STATUSES.has(gate.status))
    .map((gate) =>
      blocked(
        `owner-gate-status:${gate.id}`,
        `Owner gate status: ${gate.label}`,
        `unsupported status "${gate.status}"; use approved, pending, or owner-blocked`,
      ),
    )
}

function readReadinessDocs({ fileExists, readText }) {
  return {
    analyticsRunbook: readIfExists(
      fileExists,
      readText,
      'docs/launch/analytics-and-indexing-runbook.md',
    ),
    customerAccountsSetup: readIfExists(
      fileExists,
      readText,
      'docs/testing/customer-accounts-setup.md',
    ),
  }
}

function readIfExists(fileExists, readText, sourcePath) {
  return fileExists(sourcePath) ? readText(sourcePath) : ''
}

function isCustomerAccountOwnerGated(source) {
  return (
    source.includes('Live Shopify Customer Account OAuth is blocked') &&
    source.includes('owner/admin approval')
  )
}

function requiredEnvCheck(env, name, label) {
  return hasEnv(env, name)
    ? ok(`env:${name}`, label, `${name} present`)
    : blocked(`env:${name}`, label, `${name} missing`)
}

function hasEnv(env, name) {
  return optionalEnv(env, name) !== undefined
}

function optionalEnv(env, name) {
  const value = env[name]

  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()

  return trimmed ? trimmed : undefined
}

function ok(id, label, detail) {
  return { id, label, status: 'ok', detail }
}

function degraded(id, label, detail) {
  return { id, label, status: 'degraded', detail }
}

function blocked(id, label, detail) {
  return { id, label, status: 'blocked', detail }
}

function readSource(sourcePath) {
  return readFileSync(sourcePath, 'utf8')
}

function escapeMarkdownCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')
}

function printMarkdownTable(checks) {
  console.log('| Check | Status | Detail |')
  console.log('| --- | --- | --- |')

  for (const check of checks) {
    console.log(
      `| ${escapeMarkdownCell(check.label)} | ${escapeMarkdownCell(
        check.status,
      )} | ${escapeMarkdownCell(check.detail)} |`,
    )
  }
}

function printUsage() {
  console.error(
    'Usage: node scripts/launch/probe-readiness.mjs [--mode docs] [--json] [--launch]',
  )
}

function runCli() {
  try {
    const args = parseArgs(process.argv.slice(2))

    if (args.help) {
      printUsage()
      return
    }

    const report = buildReadinessReport(args)

    if (args.json) {
      console.log(JSON.stringify(report, null, 2))
    } else {
      printMarkdownTable(report.checks)
    }

    if (report.summary === 'blocked') {
      process.exitCode = 1
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}

const entrypointPath = process.argv[1] ? path.resolve(process.argv[1]) : ''
const currentPath = fileURLToPath(import.meta.url)

if (entrypointPath === currentPath) {
  runCli()
}
