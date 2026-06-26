---
status: resolved
phase: 18-seo-audit-remediation
source: [18-01-SUMMARY.md, 18-02-SUMMARY.md, 18-03-SUMMARY.md, 18-04-SUMMARY.md, 18-05-SUMMARY.md, 18-06-SUMMARY.md]
started: 2026-06-25T13:42:14Z
updated: 2026-06-26T00:33:00Z
---

## Current Test

[testing complete]

## Tests

### 1. URL Parity Register and Redirect Audit
expected: The SEO audit evidence includes a URL parity register with two-source-confirmed app-owned rows, owner/operator handoff rows, and the existing nested collection-product redirect. Running the URL audit probe passes, reports the documented optional owner-export warning, and does not add broad product, collection, or catch-all redirects.
result: pass

### 2. Collection and Product Heading Hierarchy
expected: Collection pages show a visible H1 in the banner content, keep the product grid before normal read-more/story content, preserve rich-hero exclusivity, and product pages render one primary H1 while imported Shopify rich-content headings are demoted below the page title.
result: pass

### 3. Metadata, Robots, Sitemap, Language, and Blog Indexation
expected: The root HTML renders lang="en-AU"; audit-target homepage, collection, and service/landing page titles avoid the unwanted root suffix; robots disallow account/login surfaces in both indexing modes; tagged blog listings are noindex/follow; and tag URLs are absent from the sitemap.
result: pass

### 4. Structured Data Coverage
expected: The contact page emits LocalBusiness JSON-LD only from visible phone, email, and address content; product aggregateRating appears only when the visible PDP rating and positive review count are present; and the launch SEO probe validates supported Service, FAQPage, LocalBusiness, and Product schema coverage without inventing unsupported fields.
result: pass
reported: "enabled probe reports product structured data | /products/test-standard-tea | FAIL | Product JSON-LD not found"
severity: major
resolved: "Plan 18-06 makes the default fake fixture path data-source-aware: missing `/products/test-standard-tea` on a real-data dev server now returns WARN with `--product-path/SEO_PROBE_PRODUCT_PATH` guidance, while explicit missing product paths and existing products without Product JSON-LD still fail."

### 5. Raw Crawlable HTML Probe
expected: The raw HTML crawlability probe starts or uses the production-like app, fetches representative collection and PDP routes before hydration, and passes only when the HTML includes crawl-critical content such as one H1, canonical metadata, meaningful content, and JSON-LD instead of skeleton-only output.
result: pass

### 6. Final SEO Evidence and Launch Gates
expected: The final SEO audit matrix maps every Phase 18 SEO audit finding group to proof and residual risk, while the performance/readiness reports keep strict local Lighthouse failures and owner/operator proof items visible as launch blockers rather than silently marking them complete.
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "The contact page emits LocalBusiness JSON-LD only from visible phone, email, and address content; product aggregateRating appears only when the visible PDP rating and positive review count are present; and the launch SEO probe validates supported Service, FAQPage, LocalBusiness, and Product schema coverage without inventing unsupported fields."
  status: resolved
  reason: "User reported: enabled probe reports product structured data | /products/test-standard-tea | FAIL | Product JSON-LD not found"
  resolution: "Plan 18-06 added product path source tracking, warning semantics for the default fake fixture path on non-fixture data sources, explicit-path hard failures, focused regression tests, and operator docs."
  severity: major
  test: 4
  root_cause: "The enabled launch SEO probe was run against a plain dev server whose Shopify data source did not contain the fake fixture handle /products/test-standard-tea. The route rendered Product not found with no JSON-LD, while the fake-provider production lifecycle emits Product JSON-LD for that fixture path."
  artifacts:
    - path: "scripts/seo/probe-launch-seo.mjs"
      issue: "Defaults product structured-data validation to /products/test-standard-tea and treats missing Product JSON-LD as a failure whenever Shopify credentials are present, even if the server is not using fake fixture data."
    - path: "src/app/(storefront)/products/[handle]/page.tsx"
      issue: "Product JSON-LD is emitted only after getProduct(handle) succeeds; missing product data correctly renders the not-found path with no Product schema."
    - path: "tests/fixtures/shopify/product.ts"
      issue: "Defines the fake test-standard-tea handle used by fake-provider production evidence."
  missing:
    - "Clarify and harden the probe contract so /products/test-standard-tea is only the default for fake-provider lifecycle runs, or require an explicit --product-path/SEO_PROBE_PRODUCT_PATH when probing a real Shopify-backed dev server."
    - "Make the enabled probe error distinguish a missing product route for the selected data source from a real Product JSON-LD omission on an existing product page."
  debug_session: ".planning/debug/product-json-ld-probe-path.md"
