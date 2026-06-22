const baseUrlInput = process.argv[2]

const routeList = [
  '/',
  '/collections/all',
  '/cart',
  '/account',
  '/account/login',
  '/pages/contact',
  '/api/search/suggestions?q=tea',
]

const productPath = process.env.PHASE15_PROBE_PRODUCT_PATH?.trim()
if (productPath) {
  routeList.push(productPath.startsWith('/') ? productPath : `/${productPath}`)
}

const expectedHeaders = [
  {
    name: 'strict-transport-security',
    label: 'Strict-Transport-Security',
    validate: (value) => Boolean(value),
  },
  {
    name: 'x-content-type-options',
    label: 'X-Content-Type-Options',
    validate: (value) => value === 'nosniff',
  },
  {
    name: 'referrer-policy',
    label: 'Referrer-Policy',
    validate: (value) => value === 'strict-origin-when-cross-origin',
  },
  {
    name: 'permissions-policy',
    label: 'Permissions-Policy',
    validate: (value) => Boolean(value),
  },
  {
    name: 'x-frame-options',
    label: 'X-Frame-Options',
    validate: (value) => value === 'SAMEORIGIN',
  },
  {
    name: 'content-security-policy-report-only',
    label: 'Content-Security-Policy-Report-Only',
    validate: (value) => Boolean(value),
  },
]

function printUsage() {
  console.error(
    'Usage: node scripts/security/probe-production-security.mjs <base-url>',
  )
}

function parseBaseUrl(value) {
  if (!value) return null

  try {
    return new URL(value)
  } catch {
    return null
  }
}

function escapeMarkdownCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')
}

function formatHeaderSummary(failures) {
  if (failures.length === 0) return 'required headers present'

  return failures.join('; ')
}

async function probeRoute(baseUrl, route) {
  const url = new URL(route, baseUrl)

  try {
    const response = await fetch(url)
    const failures = []

    if (response.headers.has('x-powered-by')) {
      failures.push('x-powered-by present')
    }

    if (response.headers.has('content-security-policy')) {
      failures.push('enforced content-security-policy present')
    }

    expectedHeaders.forEach((expectedHeader) => {
      const value = response.headers.get(expectedHeader.name)

      if (!expectedHeader.validate(value)) {
        failures.push(`${expectedHeader.label} invalid or missing`)
      }
    })

    return {
      headers: formatHeaderSummary(failures),
      result: failures.length === 0 ? 'PASS' : 'FAIL',
      route,
      status: response.status,
    }
  } catch (error) {
    return {
      headers: 'fetch failed',
      result: error instanceof Error ? `FAIL: ${error.message}` : 'FAIL',
      route,
      status: 'n/a',
    }
  }
}

const baseUrl = parseBaseUrl(baseUrlInput)

if (!baseUrl) {
  printUsage()
  process.exit(1)
}

const results = await Promise.all(
  routeList.map((route) => probeRoute(baseUrl, route)),
)

console.log('| Route | Status | Headers | Result |')
console.log('| --- | ---: | --- | --- |')
results.forEach((result) => {
  console.log(
    `| ${escapeMarkdownCell(result.route)} | ${escapeMarkdownCell(
      result.status,
    )} | ${escapeMarkdownCell(result.headers)} | ${escapeMarkdownCell(
      result.result,
    )} |`,
  )
})

if (results.some((result) => result.result !== 'PASS')) {
  process.exit(1)
}
