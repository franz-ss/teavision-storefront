---
phase: 19-h1-correctness-re-remediation
plan: 01
subsystem: testing
tags: [playwright, e2e, seo, cache-components, activity-dom, h1, next16]

# Dependency graph
requires:
  - phase: 18-seo-audit-remediation
    provides: single-route single-H1 guarantee + crawlable-HTML probe (necessary but not sufficient)
provides:
  - Failing multi-route raw-DOM H1 regression test (tests/e2e/h1-correctness.spec.ts) reproducing SEO-H1-01
  - Written root-cause confirmation (cacheComponents / MAX_BF_CACHE_ENTRIES / hidden <Activity>)
  - A/B/C remediation evaluation with measured cost and a single recommendation (Approach A)
  - Recorded owner/developer sign-off on Approach A
affects: [19-02, 19-03, seo, caching]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Multi-route in-browser regression: assert raw locator('h1'), never getByRole('heading') (Activity-hidden nodes leave the a11y tree but stay in the DOM)"

key-files:
  created:
    - tests/e2e/h1-correctness.spec.ts
    - .planning/phases/19-h1-correctness-re-remediation/19-01-REMEDIATION-RECOMMENDATION.md
  modified: []

key-decisions:
  - "SUPERSEDED 2026-06-29: Approach A was approved then RESCINDED — cacheComponents stays enabled; A reverted (commit efed85b3). Final path: SEO-H1-02 kept compact (crumb-as-H1 per D-08; visible-H1 trial reverted in 48193d0d); SEO-H1-01 accept+document. See body banner + docs/launch/seo-audit-pages-2-9-response.md"
  - "Regression test uses raw locator('h1') exclusively; getByRole('heading') falsely passes on Activity-hidden nodes"
  - "Soft-nav chain Home → /collections → /collections/all → /products/test-standard-tea (last three hops are in-page link clicks)"

patterns-established:
  - "Accumulated-DOM SEO defects require multi-route in-browser tests; single-route HTML probes structurally cannot reproduce them"
  - "Architecture-touching remediation choices are recorded with measured cost and gated on owner/developer sign-off before implementation"

requirements-completed: [SEO-H1-01]

# Metrics
duration: ~40min
completed: 2026-06-29
---

# Phase 19 Plan 01: H1 Correctness Reproduction & Remediation Decision Summary

**A failing multi-route raw-DOM Playwright test reproduces the accumulated-DOM H1 leak (SEO-H1-01), and the Cache Components Activity-DOM root cause is confirmed with an owner-approved Approach A remediation plan.**

> ⚠ **SUPERSEDED (2026-06-29).** Approach A (disable `cacheComponents`) was approved
> here and implemented in a prior session (`9267da5f`), then **reverted** (`efed85b3`)
> when the owner decided `cacheComponents` must stay enabled. The phase was completed
> via a different path: **SEO-H1-02** — the banner H1 stays compact (the
> breadcrumb crumb, D-08; a visible-H1 trial in `e1c4204c` was reverted in
> `48193d0d`); **SEO-H1-01** resolved via **accept + document** (Googlebot
> never sees the soft-nav accumulation; multiple H1s aren't a Google ranking issue).
> The "Approach A approved" statements below are retained as the historical decision
> record only. Authoritative outcome: `docs/launch/seo-audit-pages-2-9-response.md`
> and the Decision-Superseded section of `19-01-REMEDIATION-RECOMMENDATION.md`.

## Performance

- **Duration:** ~40 min
- **Started:** 2026-06-29
- **Completed:** 2026-06-29
- **Tasks:** 2 (Task 1 auto; Task 2 decision checkpoint — approved)
- **Files modified:** 2 created, 0 production files touched

## Accomplishments

- Reproduced SEO-H1-01 with a committed, FAILING in-browser regression test that reads the raw
  accumulated DOM after soft client-side navigation across three+ SEO-critical routes.
- Confirmed the root cause in writing: `cacheComponents: true` (`next.config.ts:9`) sets
  `MAX_BF_CACHE_ENTRIES = 3`, keeping up to 3 prior routes mounted in hidden
  `<Activity mode="hidden">`, so their `<h1>`s remain in the live DOM.
- Evaluated remediation approaches A/B/C with measured cost (Approach A = 5 modules,
  17 cached functions, 41 `cacheLife`/`cacheTag` calls) and a single recommendation.
- Recorded owner/developer sign-off on **Approach A** for 19-02 to implement.

## Chosen Remediation Approach

**Approach A (approved 2026-06-29):** Disable `cacheComponents` and migrate the 5 `'use cache'`
modules to `unstable_cache` + route-segment `revalidate`:

- `src/lib/blog/operations.ts`
- `src/lib/reviews/trustoo.ts`
- `src/lib/shopify/operations/collection.ts`
- `src/lib/shopify/operations/product.ts`
- `src/lib/shopify/operations/storefront-page.ts`

Total: 17 cached functions, 41 `cacheLife`/`cacheTag` call sites. After the change, prior routes
unmount on navigation (`MAX_BF_CACHE_ENTRIES` → 1), guaranteeing exactly one `<h1>` in the live
DOM. 19-02 must re-prove crawlable-HTML (`scripts/seo/probe-crawlable-html.mjs`) and CWV evidence.

## Regression Test — Exact Soft-Nav Chain (for 19-02 reuse)

`tests/e2e/h1-correctness.spec.ts` performs:

1. `page.goto('/')` — hard load of the homepage (its H1 is the leak target).
2. Click `a[href="/collections"]` (hero CTA "Explore Our Teas") — soft (client-side) nav.
3. Click `a[href="/collections/all"]` ("All products" collection card) — soft nav.
4. Click `a[href="/products/test-standard-tea"]` (collection product card) — soft nav.

The last three hops are in-page link clicks (no `page.goto`), so prior routes accumulate in
hidden `<Activity>`. After the chain it asserts on the RAW DOM:

- `locator('h1', { hasText: "Australia's #1 tea company" }).count()` === 0
- `locator('h1').count()` === 1

The test uses raw `locator('h1')` exclusively and never `getByRole('heading')` (Activity-hidden
nodes leave the a11y tree but remain in the DOM, which would cause a false pass).

Harness constraints honored: the fake-Shopify server returns one product (`test-standard-tea`)
for every `GetProduct`, and a non-null collection only for handle `all`. The test does not depend
on a second distinct product.

## Pre-fix FAIL Evidence

`pnpm test:e2e -- h1-correctness` on the current pre-fix build (HEAD before fix) exited
**non-zero (exit code 1)** — the expected-fail confirmation and the deliverable proof of the
defect. A non-zero Playwright exit is the success signal for Task 1.

## Task Commits

1. **Task 1: Write the failing multi-route raw-DOM H1 regression test** - `51d5f925` (test)
2. **Task 2: Remediation recommendation doc (A/B/C + root cause)** - `d65848bc` (docs)
3. **Task 2: Record Approach A sign-off** - `d0751662` (docs)

## Files Created/Modified

- `tests/e2e/h1-correctness.spec.ts` - Failing multi-route raw-DOM H1 regression test (SEO-H1-01).
- `.planning/phases/19-h1-correctness-re-remediation/19-01-REMEDIATION-RECOMMENDATION.md` -
  Root-cause confirmation + A/B/C evaluation + recommendation + recorded Approach A sign-off.

## Decisions Made

- **Approach A approved** (2026-06-29): disable `cacheComponents`, migrate 5 modules (41 calls) to
  `unstable_cache` + route-segment `revalidate`. Rationale: only approach that structurally
  guarantees one H1 in the live DOM; bounded cost (lib/data-fetch files only, no UI/route markup
  changes); `revalidateTag()` webhook invalidation remains compatible.
- Test uses the homepage H1 leak (not a second product title) as the load-bearing assertion,
  because the fake-Shopify harness only exposes one distinct product.

## Deviations from Plan

None - plan executed exactly as written. The plan's stated nav chain (Home → /collections/all →
product) had no direct homepage→`/collections/all` link in the harness, so the realizable chain
routes through `/collections` first (Home → /collections → /collections/all → product). This is
still ≥3 SEO-critical routes with in-page link clicks for the soft-nav hops and accumulates the
homepage route in hidden `<Activity>`, fully satisfying the plan's acceptance criteria.

## Issues Encountered

The Playwright run reported its non-zero exit at the webServer-start stage ("Another next dev
server is already running" on port 3000). This still produced the required non-zero exit (the
Task 1 success signal). 19-02 should ensure no stray `next dev` server is running on the default
port before re-running the e2e suite to verify the post-fix PASS at the assertion stage.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 19-02 is unblocked: Approach A is approved and the exact soft-nav chain + assertions are
  documented for the regression test to be re-run post-fix.
- 19-02 must: disable `cacheComponents`, migrate the 5 modules (41 calls) to `unstable_cache` +
  route-segment `revalidate`, re-prove crawlable-HTML and CWV, and confirm
  `tests/e2e/h1-correctness.spec.ts` passes (one raw `<h1>`, no retained homepage H1).
- No code or `next.config.ts` change was made in this plan.

## Self-Check: PASSED

- FOUND: tests/e2e/h1-correctness.spec.ts
- FOUND: .planning/phases/19-h1-correctness-re-remediation/19-01-REMEDIATION-RECOMMENDATION.md
- FOUND: .planning/phases/19-h1-correctness-re-remediation/19-01-SUMMARY.md
- FOUND commit: 51d5f925 (Task 1 test)
- FOUND commit: d65848bc (recommendation doc)
- FOUND commit: d0751662 (Approach A sign-off)
- FOUND commit: 5b6bd891 (SUMMARY)

---
*Phase: 19-h1-correctness-re-remediation*
*Completed: 2026-06-29*
