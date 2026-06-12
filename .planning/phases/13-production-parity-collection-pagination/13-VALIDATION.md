---
phase: 13
slug: production-parity-collection-pagination
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-12
updated: 2026-06-12
---

# Phase 13 — Validation Strategy

> Retroactive Nyquist validation contract for production-parity collection pagination.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x |
| **Config file** | `vitest.config.mts` |
| **Quick run command** | `pnpm vitest run src/app/(storefront)/collections/[handle]/_lib/page-helpers.test.ts src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx src/lib/shopify/operations/collection.test.ts` |
| **Full suite command** | `pnpm test:unit` |
| **Estimated runtime** | ~8 seconds targeted, ~15 seconds unit suite |

---

## Sampling Rate

- **After every task commit:** Run the quick command for changed collection pagination surfaces.
- **After every plan wave:** Run `pnpm test:unit`.
- **Before `$gsd-verify-work`:** `pnpm typecheck`, `pnpm lint`, `pnpm test:unit`, `pnpm test:stories`, and `pnpm build` must be green, with `pnpm codegen` run when GraphQL changes.
- **Max feedback latency:** ~15 seconds for automated unit feedback.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 1 | PLP-PAGE-01 | T-13-01, T-13-05 | Invalid page params normalize to page 1; public PLP hrefs emit `?page=N`, never cursor values | unit | `pnpm vitest run src/app/(storefront)/collections/[handle]/_lib/page-helpers.test.ts` | yes | green |
| 13-01-02 | 01 | 1 | PLP-PAGE-03 | T-13-06, T-13-10 | Cursor index uses id/cursor-only chunking and product payload fetches stay bounded to one page | unit | `pnpm vitest run src/lib/shopify/operations/collection.test.ts` | yes | green |
| 13-01-03 | 01 | 1 | PLP-PAGE-04 | - | Shared pagination primitive renders current/adjacent/last pages and replaces "Next products" | unit, Storybook | `pnpm vitest run src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx && pnpm test:stories` | yes | green |
| 13-01-04 | 01 | 1 | PLP-PAGE-02 | T-13-13, T-13-14 | Canonicals point at launch-parity parent URLs; prev/next links are emitted without cursor URLs | route/unit | `pnpm vitest run src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx` | yes | green |
| 13-01-05 | 01 | 1 | PLP-PAGE-05 | T-13-01, T-13-05 | Out-of-range pages redirect to last valid page; stale cursors redirect strictly downward; valid empty page 1 renders empty state | unit | `pnpm vitest run src/app/(storefront)/collections/[handle]/_components/page-content.test.tsx` | yes | green |
| 13-01-06 | 01 | 1 | PLP-PAGE-06 | - | Standard project checks and route-level verification cover pagination, SEO, operation behavior, and Storybook surface | unit, story, build, route | `pnpm test:unit && pnpm test:stories && pnpm build` | yes | green |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

Existing Vitest and Storybook infrastructure covers the phase. No Wave 0 framework installation was required.

---

## Manual-Only Verifications

All Nyquist coverage gaps have automated verification. Phase-level human UAT remains documented in `13-VERIFICATION.md` for browser visual appearance, scroll landing quality, and Storybook visual inspection.

---

## Validation Audit 2026-06-12

| Metric | Count |
|--------|-------|
| Gaps found | 1 |
| Resolved | 1 |
| Escalated | 0 |

### Gap Resolved

| Requirement | Gap | Resolution |
|-------------|-----|------------|
| PLP-PAGE-06 | No Shopify operation test directly covered cursor-index chunking, page-1 short-circuiting, or page-N cursor resolution. | Added `src/lib/shopify/operations/collection.test.ts` with focused tests for `getCollectionPageIndex()` and `getCollectionProductsPage()`. |

---

## Validation Sign-Off

- [x] All tasks have automated verification or existing test infrastructure.
- [x] Sampling continuity: no 3 consecutive tasks lack automated verification.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags in validation commands.
- [x] Feedback latency < 15 seconds for targeted automated tests.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved 2026-06-12
