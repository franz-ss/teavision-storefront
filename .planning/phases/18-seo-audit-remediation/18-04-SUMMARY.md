---
phase: 18-seo-audit-remediation
plan: 04
subsystem: seo
tags: [nextjs, structured-data, json-ld, schema, product-reviews]

requires:
  - phase: 18-seo-audit-remediation
    provides: Phase 18 URL, heading, metadata, robots, sitemap, and blog indexation decisions
provides:
  - Contact LocalBusiness JSON-LD backed by visible phone, email, and address details
  - Product aggregateRating JSON-LD gated on the same visible finite rating and positive review count
  - Service, LocalBusiness, FAQPage, Product, and optional AggregateRating probe coverage
  - Structured-data audit evidence table with unsupported schema gaps documented
affects: [seo-audit, structured-data, product-pages, contact-page, launch-probes]

tech-stack:
  added: []
  patterns:
    - Route-local JSON-LD components using serializeInlineJson()
    - Schema probe traversal for JSON-LD arrays and @graph objects
    - Visible-evidence gate before emitting Product aggregateRating

key-files:
  created:
    - src/app/(storefront)/pages/contact/_components/json-ld.tsx
    - src/app/(storefront)/pages/contact/_components/json-ld.test.tsx
  modified:
    - src/app/(storefront)/pages/contact/page.tsx
    - src/app/(storefront)/products/[handle]/page.tsx
    - src/app/(storefront)/products/[handle]/page.test.tsx
    - scripts/seo/probe-launch-seo.mjs
    - scripts/seo/probe-launch-seo.test.mjs
    - docs/launch/seo-audit-remediation.md

key-decisions:
  - "Contact LocalBusiness schema is limited to visible contact details plus universal site basics; unsupported hours, geo, price, review, and rating fields remain omitted."
  - "PDP aggregateRating and the visible rating row now share a finite rating plus positive reviewCount gate, so absent or zero review data emits neither visible rating summary nor rating schema."
  - "Service and FAQ schema were verified through route expectations and evidence docs rather than expanding route-local schema beyond visible content."

patterns-established:
  - "Structured-data probes can validate schema types inside JSON-LD arrays and @graph objects."
  - "Audit schema coverage is documented as route, visible source, automated check, status, and residual unsupported gap."

requirements-completed:
  - SEO-AUDIT-05

duration: 14 min
completed: 2026-06-25
---

# Phase 18 Plan 04: Structured Data Audit, Fill, and Validation Summary

**Evidence-backed LocalBusiness schema, conditional Product aggregateRating, and route-level Service/FAQ structured-data probes**

## Performance

- **Duration:** 14 min
- **Started:** 2026-06-25T11:34:56Z
- **Completed:** 2026-06-25T11:48:44Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Added `/pages/contact` JSON-LD with `BreadcrumbList`, `WebPage`, and `LocalBusiness`, with `PostalAddress` derived from visible contact page data only.
- Added Product `aggregateRating` only when the PDP has a finite rating and positive review count, and the visible rating row now uses that same gate.
- Extended `scripts/seo/probe-launch-seo.mjs` to parse JSON-LD arrays and `@graph` objects, check route-level `Service`, `LocalBusiness`, and `FAQPage`, and report Product aggregateRating independently.
- Added `## Structured Data Coverage` evidence mapping route, visible source, schema type, automated check, status, and residual unsupported schema gaps.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add LocalBusiness schema to the visible contact page** - `e5c053d0` (feat)
2. **Task 2: Gate Product aggregateRating on visible reliable review data** - `3e1b19ef` (feat)
3. **Task 3: Verify Service and FAQ schema coverage without inventing new content** - `b7dcf506` (feat)

**Plan metadata:** committed separately after state/roadmap updates.

## Files Created/Modified

- `src/app/(storefront)/pages/contact/_components/json-ld.tsx` - Emits contact page `BreadcrumbList`, `WebPage`, and visible-evidence `LocalBusiness`.
- `src/app/(storefront)/pages/contact/_components/json-ld.test.tsx` - Parses contact JSON-LD and asserts visible contact details map to `PostalAddress`.
- `src/app/(storefront)/pages/contact/page.tsx` - Renders contact `JsonLd`.
- `src/app/(storefront)/products/[handle]/page.tsx` - Gates visible PDP rating row and Product `aggregateRating` on finite rating plus positive review count.
- `src/app/(storefront)/products/[handle]/page.test.tsx` - Covers aggregateRating presence and absence for missing/zero review counts.
- `scripts/seo/probe-launch-seo.mjs` - Adds JSON-LD graph traversal, structured-data route expectations, and aggregateRating probe semantics.
- `scripts/seo/probe-launch-seo.test.mjs` - Covers graph parsing and audit-supported schema expectation coverage.
- `docs/launch/seo-audit-remediation.md` - Adds structured-data coverage/evidence matrix and residual unsupported schema gaps.

## Decisions Made

- Contact `LocalBusiness` schema uses visible phone, email, and address content only; opening hours, geo, price range, reviews, and rating fields stay omitted.
- Product `aggregateRating` is not emitted from partial review data. A PDP needs both finite `rating` and finite `reviewCount > 0` before the visible row and schema appear.
- Existing service and FAQ route schema remains unchanged where visible page data already supports it; the probe and documentation now verify coverage instead of adding hidden claims.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added contact JSON-LD parse coverage**
- **Found during:** Task 1 (Add LocalBusiness schema to the visible contact page)
- **Issue:** The task file list did not include a contact schema test, but threat `T-18-08` requires tests that parse emitted JSON-LD so malformed structured data does not reach crawlers.
- **Fix:** Added `src/app/(storefront)/pages/contact/_components/json-ld.test.tsx` to render and parse the contact JSON-LD script.
- **Files modified:** `src/app/(storefront)/pages/contact/_components/json-ld.test.tsx`
- **Verification:** `pnpm test:unit -- "src/app/(storefront)/pages/contact/_components/json-ld.test.tsx"` - PASS, 1 test.
- **Committed in:** `e5c053d0`

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Added required safety coverage for the planned structured-data surface. No unsupported schema or product behavior scope was added.

## Issues Encountered

- The plan's contact verify glob did not match under Vitest/PowerShell (`No test files found`). The concrete route-local test path was run instead and passed.
- `node scripts/seo/probe-launch-seo.mjs --mode enabled` requires an HTTP server. I started a temporary `pnpm dev` server with `DISABLE_INDEXING=false`, `SITE_URL=https://www.teavision.com.au`, and `NEXT_PUBLIC_SITE_URL=https://www.teavision.com.au`, ran the probe, then stopped the server.

## Verification

- `pnpm test:unit -- "src/app/(storefront)/pages/contact/_components/json-ld.test.tsx"` - PASS, 1 test.
- `pnpm test:unit -- "src/app/(storefront)/products/[handle]/page.test.tsx"` - PASS, 4 tests.
- `node --test scripts/seo/probe-launch-seo.test.mjs` - PASS, 5 tests.
- `node scripts/seo/probe-launch-seo.mjs --mode enabled` - PASS exit 0; new `LocalBusiness`, `FAQPage`, and `Service` structured-data checks passed. Expected WARN remained for optional `SEO_PROBE_PRODUCT_PATH` because no live product path was supplied.
- `pnpm lint` - PASS.
- Pre-commit hooks ran on all three task commits and passed Tailwind class checks, ESLint, and component contract tests.

## Known Stubs

None blocking. Stub scan found no TODO/FIXME/placeholder/coming-soon text in plan-touched files. The `=[]`/`={}` matches are internal probe accumulators/default argument objects in `scripts/seo/probe-launch-seo.mjs`, not UI-rendered stubs.

## Authentication Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 18-04 is complete. Plan 18-05 can use the structured-data probe coverage and audit evidence table when building the final crawlable HTML, Core Web Vitals, and audit-to-evidence pack.

## Self-Check: PASSED

- Summary file created at `.planning/phases/18-seo-audit-remediation/18-04-SUMMARY.md`.
- Created files exist: `src/app/(storefront)/pages/contact/_components/json-ld.tsx`, `src/app/(storefront)/pages/contact/_components/json-ld.test.tsx`.
- Task commits exist: `e5c053d0`, `3e1b19ef`, `b7dcf506`.
- Post-commit deletion checks found no tracked file deletions.
- Final working tree only has the pre-existing untracked `tmp/` directory.

---
*Phase: 18-seo-audit-remediation*
*Completed: 2026-06-25*
