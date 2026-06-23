import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'

const DEFAULT_BASE_URL = 'http://127.0.0.1:3000'
const VALID_MODES = new Set(['disabled', 'enabled', 'redirects', 'runbook'])

const SOURCE_PATHS = {
  evidence: 'docs/launch/seo-route-evidence.md',
  launchMatrix: 'src/lib/seo/launch-route-matrix.ts',
  nextConfig: 'next.config.ts',
  policies: 'src/lib/legal/policies.ts',
  runbook: 'docs/launch/analytics-and-indexing-runbook.md',
}

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.SEO_PROBE_BASE_URL ?? DEFAULT_BASE_URL,
    mode: 'enabled',
    productPath: process.env.SEO_PROBE_PRODUCT_PATH ?? '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]

    if (value === '--mode') {
      args.mode = argv[index + 1] ?? args.mode
      index += 1
      continue
    }

    if (value.startsWith('--mode=')) {
      args.mode = value.slice('--mode='.length)
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

    if (value === '--product-path') {
      args.productPath = argv[index + 1] ?? args.productPath
      index += 1
      continue
    }

    if (value.startsWith('--product-path=')) {
      args.productPath = value.slice('--product-path='.length)
      continue
    }

    if (!value.startsWith('--')) {
      args.baseUrl = value
    }
  }

  if (!VALID_MODES.has(args.mode)) {
    throw new Error(
      `Unsupported mode "${args.mode}". Use one of: ${[...VALID_MODES].join(
        ', ',
      )}`,
    )
  }

  return args
}

function readSource(path) {
  return readFileSync(path, 'utf8')
}

function extractStringLiterals(block) {
  return [...block.matchAll(/'([^']+)'/g)].map((match) => match[1])
}

function parseStaticExpectations(matrixSource) {
  const arrayMatch = matrixSource.match(
    /STATIC_LAUNCH_ROUTE_EXPECTATIONS\s*=\s*\[([\s\S]*?)\]\s*satisfies/,
  )

  if (!arrayMatch) {
    throw new Error('Could not find STATIC_LAUNCH_ROUTE_EXPECTATIONS')
  }

  return [...arrayMatch[1].matchAll(/\{([\s\S]*?)\}/g)].map((match) => {
    const block = match[1]
    const path = requiredMatch(block, /path:\s*'([^']+)'/, 'static path')
    const canonicalPath = requiredMatch(
      block,
      /canonicalPath:\s*'([^']+)'/,
      `canonical for ${path}`,
    )

    return {
      canonicalPath,
      expectedStatus: Number(
        requiredMatch(block, /expectedStatus:\s*(\d+)/, `status for ${path}`),
      ),
      kind: 'static',
      path,
      shouldAppearInSitemap:
        requiredMatch(
          block,
          /shouldAppearInSitemap:\s*(true|false)/,
          `sitemap flag for ${path}`,
        ) === 'true',
      shouldIndexWhenEnabled:
        requiredMatch(
          block,
          /shouldIndexWhenEnabled:\s*(true|false)/,
          `index flag for ${path}`,
        ) === 'true',
    }
  })
}

function parseLegalPolicies(policySource) {
  return [
    ...policySource.matchAll(
      /href:\s*'([^']+)'[\s\S]*?sitemap:\s*(true|false),[\s\S]*?redirectSources:\s*\[([\s\S]*?)\]/g,
    ),
  ].map((match) => ({
    href: match[1],
    redirectSources: extractStringLiterals(match[3]),
    sitemap: match[2] === 'true',
  }))
}

function materializeExpectations() {
  const matrixSource = readSource(SOURCE_PATHS.launchMatrix)
  const policySource = readSource(SOURCE_PATHS.policies)
  const staticExpectations = parseStaticExpectations(matrixSource)
  const legalPolicies = parseLegalPolicies(policySource)

  const legalExpectations = legalPolicies.map((policy) => ({
    canonicalPath: policy.href,
    expectedStatus: 200,
    kind: 'legal',
    path: policy.href,
    shouldAppearInSitemap: policy.sitemap,
    shouldIndexWhenEnabled: policy.sitemap,
  }))

  const redirectExpectations = legalPolicies.flatMap((policy) =>
    policy.redirectSources.map((source) => ({
      canonicalPath: policy.href,
      expectedStatus: 308,
      kind: 'redirect',
      path: source,
      shouldAppearInSitemap: false,
      shouldIndexWhenEnabled: false,
    })),
  )

  return {
    all: [...staticExpectations, ...legalExpectations, ...redirectExpectations],
    legal: legalExpectations,
    redirects: redirectExpectations,
    static: staticExpectations,
  }
}

function requiredMatch(source, pattern, label) {
  const match = source.match(pattern)

  if (!match) {
    throw new Error(`Could not parse ${label}`)
  }

  return match[1]
}

function parseBaseUrl(value) {
  try {
    return new URL(value)
  } catch {
    throw new Error(`Invalid base URL: ${value}`)
  }
}

function escapeMarkdownCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ')
}

function printResults(results) {
  console.log('| Check | Target | Status | Detail |')
  console.log('| --- | --- | --- | --- |')

  for (const result of results) {
    console.log(
      `| ${escapeMarkdownCell(result.check)} | ${escapeMarkdownCell(
        result.target,
      )} | ${result.status} | ${escapeMarkdownCell(result.detail)} |`,
    )
  }
}

async function fetchText(baseUrl, path, init = {}) {
  const response = await fetch(new URL(path, baseUrl), init)
  const text = await response.text()

  return { response, text }
}

function getLocPaths(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => {
      try {
        return new URL(match[1]).pathname
      } catch {
        return ''
      }
    })
    .filter(Boolean)
}

function getCanonicalHref(html, baseUrl) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? []
  const canonicalTag = tags.find((tag) => /rel=["']canonical["']/i.test(tag))
  const href = canonicalTag?.match(/href=["']([^"']+)["']/i)?.[1]

  if (!href) return null

  try {
    return new URL(href, baseUrl).pathname
  } catch {
    return null
  }
}

function hasNoindexMeta(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? []

  return tags.some(
    (tag) =>
      /name=["']robots["']/i.test(tag) &&
      /content=["'][^"']*noindex/i.test(tag),
  )
}

function extractJsonLd(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean)
    .map((script) => JSON.parse(script))
}

function hasProductJsonLd(values) {
  return values.some((value) => {
    if (Array.isArray(value)) return hasProductJsonLd(value)

    return value && typeof value === 'object' && value['@type'] === 'Product'
  })
}

function hasShopifyCredentials() {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  )
}

function pass(check, target, detail) {
  return { check, detail, status: 'PASS', target }
}

function warn(check, target, detail) {
  return { check, detail, status: 'WARN', target }
}

function fail(check, target, detail) {
  return { check, detail, status: 'FAIL', target }
}

function runRunbookMode() {
  const results = []
  const evidenceExists = existsSync(SOURCE_PATHS.evidence)
  const runbookExists = existsSync(SOURCE_PATHS.runbook)
  const evidence = evidenceExists ? readSource(SOURCE_PATHS.evidence) : ''
  const runbook = runbookExists ? readSource(SOURCE_PATHS.runbook) : ''

  results.push(
    evidenceExists
      ? pass('SEO evidence doc exists', SOURCE_PATHS.evidence, 'found')
      : fail('SEO evidence doc exists', SOURCE_PATHS.evidence, 'missing'),
  )
  results.push(
    runbookExists
      ? pass('analytics/indexing runbook exists', SOURCE_PATHS.runbook, 'found')
      : fail('analytics/indexing runbook exists', SOURCE_PATHS.runbook, 'missing'),
  )

  for (const heading of [
    '## Command',
    '## Date',
    '## Disabled-mode result',
    '## Enabled-mode result',
    '## Redirects result',
    '## Structured-data result',
    '## Owner-gated Search Console evidence',
  ]) {
    results.push(
      evidence.includes(heading)
        ? pass('SEO evidence heading', heading, 'present')
        : fail('SEO evidence heading', heading, 'missing'),
    )
  }

  for (const text of ['Search Console', 'Evidence Log']) {
    results.push(
      runbook.includes(text)
        ? pass('runbook launch evidence text', text, 'present')
        : fail('runbook launch evidence text', text, 'missing'),
    )
  }

  return results
}

function runRedirectsMode() {
  const expectations = materializeExpectations()
  const nextConfig = readSource(SOURCE_PATHS.nextConfig)
  const matrix = readSource(SOURCE_PATHS.launchMatrix)
  const results = []
  const redirectPaths = expectations.redirects.map((expectation) => expectation.path)

  results.push(
    nextConfig.includes('getPolicyRedirects')
      ? pass('Next config policy redirects', SOURCE_PATHS.nextConfig, 'registry helper used')
      : fail('Next config policy redirects', SOURCE_PATHS.nextConfig, 'registry helper missing'),
  )
  results.push(
    matrix.includes('REDIRECT_ROUTE_EXPECTATIONS')
      ? pass('route matrix redirect expectations', SOURCE_PATHS.launchMatrix, 'export present')
      : fail('route matrix redirect expectations', SOURCE_PATHS.launchMatrix, 'export missing'),
  )

  for (const path of [
    '/policies/privacy-policy',
    '/policies/terms-of-service',
  ]) {
    const expectation = expectations.redirects.find(
      (candidate) => candidate.path === path,
    )

    results.push(
      expectation
        ? pass('policy redirect expectation', path, `308 -> ${expectation.canonicalPath}`)
        : fail('policy redirect expectation', path, 'missing'),
    )
  }

  results.push(
    redirectPaths.length > 0
      ? pass('policy redirect count', 'LEGAL_POLICIES redirectSources', `${redirectPaths.length} redirects`)
      : fail('policy redirect count', 'LEGAL_POLICIES redirectSources', 'no redirects found'),
  )

  return results
}

async function runDisabledMode(baseUrl) {
  const expectations = materializeExpectations()
  const results = []
  const { response: robotsResponse, text: robotsText } = await fetchText(
    baseUrl,
    '/robots.txt',
  )
  const { response: sitemapResponse, text: sitemapText } = await fetchText(
    baseUrl,
    '/sitemap.xml',
  )

  results.push(
    robotsResponse.ok
      ? pass('disabled robots fetch', '/robots.txt', `status ${robotsResponse.status}`)
      : fail('disabled robots fetch', '/robots.txt', `status ${robotsResponse.status}`),
  )
  results.push(
    !/^\s*Sitemap:/im.test(robotsText)
      ? pass('disabled robots sitemap omission', '/robots.txt', 'no Sitemap line')
      : fail('disabled robots sitemap omission', '/robots.txt', 'Sitemap line present'),
  )

  const sitemapLocs = getLocPaths(sitemapText)
  results.push(
    sitemapResponse.ok || sitemapResponse.status === 404
      ? pass('disabled sitemap fetch', '/sitemap.xml', `status ${sitemapResponse.status}`)
      : fail('disabled sitemap fetch', '/sitemap.xml', `status ${sitemapResponse.status}`),
  )
  results.push(
    sitemapLocs.length === 0
      ? pass('disabled sitemap URL count', '/sitemap.xml', '0 URLs')
      : fail('disabled sitemap URL count', '/sitemap.xml', `${sitemapLocs.length} URLs found`),
  )

  for (const expectation of expectations.legal.slice(0, 2)) {
    const { response, text } = await fetchText(baseUrl, expectation.path)
    const ok = response.ok && hasNoindexMeta(text)
    results.push(
      ok
        ? pass('disabled route noindex metadata', expectation.path, 'noindex present')
        : fail(
            'disabled route noindex metadata',
            expectation.path,
            `status ${response.status}; noindex ${hasNoindexMeta(text)}`,
          ),
    )
  }

  return results
}

async function runEnabledMode(baseUrl, productPath) {
  const expectations = materializeExpectations()
  const results = []
  const sitemapExpectations = expectations.all.filter(
    (expectation) => expectation.shouldAppearInSitemap,
  )
  const { response: robotsResponse, text: robotsText } = await fetchText(
    baseUrl,
    '/robots.txt',
  )
  const { response: sitemapResponse, text: sitemapText } = await fetchText(
    baseUrl,
    '/sitemap.xml',
  )
  const sitemapLocs = getLocPaths(sitemapText)

  results.push(
    robotsResponse.ok
      ? pass('enabled robots fetch', '/robots.txt', `status ${robotsResponse.status}`)
      : fail('enabled robots fetch', '/robots.txt', `status ${robotsResponse.status}`),
  )
  results.push(
    /^\s*Sitemap:/im.test(robotsText)
      ? pass('enabled robots sitemap line', '/robots.txt', 'Sitemap line present')
      : fail('enabled robots sitemap line', '/robots.txt', 'Sitemap line missing'),
  )
  results.push(
    sitemapResponse.ok
      ? pass('enabled sitemap fetch', '/sitemap.xml', `status ${sitemapResponse.status}`)
      : fail('enabled sitemap fetch', '/sitemap.xml', `status ${sitemapResponse.status}`),
  )

  for (const expectation of sitemapExpectations) {
    results.push(
      sitemapLocs.includes(expectation.path)
        ? pass('enabled sitemap path', expectation.path, 'present')
        : fail('enabled sitemap path', expectation.path, 'missing'),
    )
  }

  for (const expectation of expectations.redirects) {
    const { response } = await fetchText(baseUrl, expectation.path, {
      redirect: 'manual',
    })
    const location = response.headers.get('location') ?? ''
    const locationPath = location ? new URL(location, baseUrl).pathname : ''
    const ok =
      response.status === expectation.expectedStatus &&
      locationPath === expectation.canonicalPath

    results.push(
      ok
        ? pass('policy redirect live check', expectation.path, `${response.status} -> ${locationPath}`)
        : fail('policy redirect live check', expectation.path, `${response.status} -> ${locationPath || 'no location'}`),
    )
  }

  for (const expectation of [...expectations.static, ...expectations.legal].filter(
    (candidate) =>
      candidate.shouldIndexWhenEnabled && candidate.path !== '/',
  )) {
    const { response, text } = await fetchText(baseUrl, expectation.path)
    const canonicalPath = getCanonicalHref(text, baseUrl)
    const ok = response.ok && canonicalPath === expectation.canonicalPath

    results.push(
      ok
        ? pass('enabled canonical live check', expectation.path, canonicalPath)
        : fail(
            'enabled canonical live check',
            expectation.path,
            `status ${response.status}; canonical ${canonicalPath ?? 'missing'}`,
          ),
    )
  }

  results.push(await probeProductStructuredData(baseUrl, productPath))

  return results
}

async function probeProductStructuredData(baseUrl, productPath) {
  const normalizedPath = productPath.trim()

  if (!normalizedPath) {
    return warn(
      'product structured data',
      'SEO_PROBE_PRODUCT_PATH',
      'skipped; set a product path to check rendered Product JSON-LD',
    )
  }

  const path = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`

  try {
    const { response, text } = await fetchText(baseUrl, path)

    if (!response.ok && !hasShopifyCredentials()) {
      return warn(
        'product structured data',
        path,
        `skipped; status ${response.status} and Shopify credentials are absent`,
      )
    }

    const values = extractJsonLd(text)

    return hasProductJsonLd(values)
      ? pass('product structured data', path, 'Product JSON-LD parsed')
      : fail('product structured data', path, 'Product JSON-LD not found')
  } catch (error) {
    if (!hasShopifyCredentials()) {
      return warn(
        'product structured data',
        path,
        `skipped; Shopify credentials are absent (${formatError(error)})`,
      )
    }

    return fail('product structured data', path, formatError(error))
  }
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error)
}

function hasFailures(results) {
  return results.some((result) => result.status === 'FAIL')
}

try {
  const args = parseArgs(process.argv.slice(2))
  const baseUrl = parseBaseUrl(args.baseUrl)
  const results =
    args.mode === 'runbook'
      ? runRunbookMode()
      : args.mode === 'redirects'
        ? runRedirectsMode()
        : args.mode === 'disabled'
          ? await runDisabledMode(baseUrl)
          : await runEnabledMode(baseUrl, args.productPath)

  printResults(results)

  if (hasFailures(results)) {
    process.exitCode = 1
  }
} catch (error) {
  console.error(formatError(error))
  process.exitCode = 1
}
