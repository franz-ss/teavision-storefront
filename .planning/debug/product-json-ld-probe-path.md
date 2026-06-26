# Product JSON-LD Probe Path Diagnosis

Date: 2026-06-26T00:15:50Z
Phase: 18-seo-audit-remediation
UAT test: 4 - Structured Data Coverage

## Symptom

`node scripts/seo/probe-launch-seo.mjs --mode enabled --base-url http://127.0.0.1:3000` reported:

```text
product structured data | /products/test-standard-tea | FAIL | Product JSON-LD not found
```

## Reproduction Evidence

- `scripts/seo/probe-launch-seo.mjs` defaults `productPath` to `/products/test-standard-tea`.
- `tests/fixtures/shopify/product.ts` defines `test-standard-tea` as the fake Shopify fixture handle.
- `scripts/seo/probe-crawlable-html.mjs --start-server --base-url http://127.0.0.1:4173` passed `Product JSON-LD` for `/products/test-standard-tea` against the fake-provider production lifecycle.
- Direct fetch against the dev server at `http://127.0.0.1:3000/products/test-standard-tea` returned status 200 with title `Product not found | Teavision`, no JSON-LD script, and no Product schema.

## Root Cause

The enabled launch SEO probe was run against a plain dev server whose Shopify data source did not contain the fake fixture handle `/products/test-standard-tea`. Because Shopify credentials were present, `probeProductStructuredData()` treated the missing Product JSON-LD as a hard failure instead of a skipped fixture-path check. The PDP renderer emits Product JSON-LD when `getProduct(handle)` returns a product; the failing dev-server route was a not-found page, so there was no product schema to parse.

## Files Involved

- `scripts/seo/probe-launch-seo.mjs` - defaults product structured-data validation to `/products/test-standard-tea` and fails when credentials exist but that route has no Product JSON-LD.
- `src/app/(storefront)/products/[handle]/page.tsx` - emits Product JSON-LD after `getProduct(handle)` succeeds and calls `notFound()` when no product exists.
- `tests/fixtures/shopify/product.ts` - owns the fake `test-standard-tea` product used by fake-provider production evidence.
- `src/lib/shopify/env.ts` - selects real Shopify credentials unless explicit local test endpoint mode is enabled.

## Suggested Fix Direction

Clarify and harden the probe contract so the default fake fixture product path is only used with the fake-provider lifecycle, or require an explicit `--product-path`/`SEO_PROBE_PRODUCT_PATH` when probing a real/dev Shopify-backed server. The failure message should distinguish "product route is not found for this data source" from "product page exists but Product JSON-LD is missing."

## Resolution

Status: resolved
Resolved: 2026-06-26T00:33:00Z
Plan: `.planning/phases/18-seo-audit-remediation/18-06-PLAN.md`
Summary: `.planning/phases/18-seo-audit-remediation/18-06-SUMMARY.md`

- `scripts/seo/probe-launch-seo.mjs` now tracks whether the product path came from the default fixture, CLI, or `SEO_PROBE_PRODUCT_PATH`.
- Missing default `/products/test-standard-tea` on a non-fixture data source now returns WARN with `--product-path/SEO_PROBE_PRODUCT_PATH` guidance.
- Explicit missing product paths still return FAIL, and existing product pages without Product JSON-LD still return FAIL.
- Verification passed with `node --test scripts/seo/probe-launch-seo.test.mjs`, enabled probe against `http://127.0.0.1:3000`, crawlable fake-provider HTML proof, and Prettier doc checks.
