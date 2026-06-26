---
status: complete
phase: 18-seo-audit-remediation
source: [18-01-SUMMARY.md, 18-02-SUMMARY.md, 18-03-SUMMARY.md, 18-04-SUMMARY.md, 18-05-SUMMARY.md]
started: 2026-06-25T13:42:14Z
updated: 2026-06-26T00:12:40Z
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
result: issue
reported: "enabled probe reports product structured data | /products/test-standard-tea | FAIL | Product JSON-LD not found"
severity: major

### 5. Raw Crawlable HTML Probe
expected: The raw HTML crawlability probe starts or uses the production-like app, fetches representative collection and PDP routes before hydration, and passes only when the HTML includes crawl-critical content such as one H1, canonical metadata, meaningful content, and JSON-LD instead of skeleton-only output.
result: pass

### 6. Final SEO Evidence and Launch Gates
expected: The final SEO audit matrix maps every Phase 18 SEO audit finding group to proof and residual risk, while the performance/readiness reports keep strict local Lighthouse failures and owner/operator proof items visible as launch blockers rather than silently marking them complete.
result: pass

## Summary

total: 6
passed: 5
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "The contact page emits LocalBusiness JSON-LD only from visible phone, email, and address content; product aggregateRating appears only when the visible PDP rating and positive review count are present; and the launch SEO probe validates supported Service, FAQPage, LocalBusiness, and Product schema coverage without inventing unsupported fields."
  status: failed
  reason: "User reported: enabled probe reports product structured data | /products/test-standard-tea | FAIL | Product JSON-LD not found"
  severity: major
  test: 4
  artifacts: []
  missing: []
