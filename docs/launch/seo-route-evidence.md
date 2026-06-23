# SEO Route Evidence

This document records launch indexing evidence for the route matrix, sitemap,
robots, canonical, noindex, redirect, and structured-data checks. Search
Console proof remains owner-gated until property access is available.

## Command

```bash
node scripts/seo/probe-launch-seo.mjs --mode disabled
node scripts/seo/probe-launch-seo.mjs --mode enabled
node scripts/seo/probe-launch-seo.mjs --mode redirects
node scripts/seo/probe-launch-seo.mjs --mode runbook
```

## Date

Evidence updated on 2026-06-23 from local fake-provider production lifecycle
probes. Replace local rows with dated launch-host proof after cutover.

## Disabled-mode result

Local production proof passes in the final readiness audit with
`DISABLE_INDEXING=true`. The disabled lifecycle omits the robots sitemap line,
returns zero sitemap URLs, and renders noindex metadata on representative legal
routes.

## Enabled-mode result

Local production proof passes in the final readiness audit with
`DISABLE_INDEXING=false`. The enabled lifecycle exposes the robots sitemap line,
includes launch-indexable legal and static routes in `/sitemap.xml`, preserves
canonical links for representative pages, and verifies indexable routes do not
render noindex metadata. Product structured-data proof remains a warning until a
representative product path and Shopify storefront credentials are provided.

## Redirects result

Local source evidence is available through:

```bash
node scripts/seo/probe-launch-seo.mjs --mode redirects
```

The redirect matrix must include `/policies/privacy-policy` and
`/policies/terms-of-service` as permanent redirects to their canonical
`/pages/*` policy routes.

## Structured-data result

Product structured-data proof is pending a representative product path and
Shopify storefront credentials. When available, run:

```bash
SEO_PROBE_PRODUCT_PATH=/products/example-product node scripts/seo/probe-launch-seo.mjs --mode enabled
```

The script parses rendered `application/ld+json` safely and reports a warning
instead of blocking local evidence when credentials are absent.

## Owner-gated Search Console evidence

Google Search Console property access, sitemap submission, and URL inspection
proof are owner-gated. Do not mark submission complete until the owner provides
property access or dated proof.

| Check | Command | Expected | Status | Proof |
| --- | --- | --- | --- | --- |
| Disabled indexing | `node scripts/seo/probe-launch-seo.mjs --mode disabled` | No robots sitemap line, zero sitemap URLs, legal routes noindexed | Pass | 2026-06-23 final readiness audit against local fake-provider production lifecycle with `DISABLE_INDEXING=true` |
| Enabled indexing | `node scripts/seo/probe-launch-seo.mjs --mode enabled` | Robots sitemap line, matrix sitemap URLs, canonical checks, no noindex on indexable routes | Pass | 2026-06-23 final readiness audit against local fake-provider production lifecycle with `DISABLE_INDEXING=false`; launch-host proof still pending |
| Policy redirects | `node scripts/seo/probe-launch-seo.mjs --mode redirects` | Registry redirects include privacy and terms aliases | Pass | 2026-06-23 local command output: privacy and terms aliases present, 8 redirects total |
| Runbook evidence | `node scripts/seo/probe-launch-seo.mjs --mode runbook` | Required evidence headings and runbook evidence text are present | Pass | 2026-06-23 local command output |
| Structured data | `SEO_PROBE_PRODUCT_PATH=/products/example-product node scripts/seo/probe-launch-seo.mjs --mode enabled` | Product JSON-LD parses when a product page is renderable | Pending | Pending representative product path |
| Search Console | Owner Search Console access | Submit `/sitemap.xml` and inspect representative URLs after cutover | Owner-gated | Pending owner access |
