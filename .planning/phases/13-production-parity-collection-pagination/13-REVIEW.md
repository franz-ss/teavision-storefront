---
phase: 13-production-parity-collection-pagination
reviewed: 2026-06-12T03:15:00Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - src/app/(storefront)/collections/[handle]/_components/product-list.tsx
  - src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx
findings:
  critical: 0
  warning: 1
  info: 2
  total: 3
status: issues_found
---

# Phase 13: Code Review Report (gap closure 13-02-GAP)

**Reviewed:** 2026-06-12T03:15:00Z
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

Scoped review of commit `6d25b81` ("fix(13): offset collection pagination grid anchor"), which moved `id="product-grid"` from a bare `<div>` onto the product grid `<ul>` and added `scroll-mt-24 lg:scroll-mt-32` so pager navigation lands below the sticky header (D-26). A prior standard-depth review covered the broader phase 13 file set; this report covers only the two gap-change files.

The fix itself is correct and was verified against the actual layout:

- **Offset arithmetic checked against the sticky header** (`src/components/layout/header/header.tsx`): mobile header is `h-19` (76px) vs `scroll-mt-24` (96px); desktop adds the `h-9.5` (38px) utility bar for 114px total vs `lg:scroll-mt-32` (128px). Both offsets clear the header with margin to spare, and `lg:scroll-mt-32` matches the existing sidebar convention (`lg:top-32` in `sidebar.tsx:31`).
- **Anchor uniqueness verified:** `id="product-grid"` now appears exactly once in the rendered tree; the old bare `<div id="product-grid" />` was removed with no stale references elsewhere in `src/`.
- **Pagination wiring verified:** `Pagination` (`src/components/ui/pagination/pagination.tsx`) accepts `aria-label` and `buildPageHref`; `getPaginationHref` (`page-helpers.ts:508`) emits path + query with no hash, so the `#product-grid` append produces valid single-hash URLs.
- **Tests pass:** `pnpm test:unit` — 115 tests across 31 files, all green, including the extended D-26 test.

No Critical issues. One Warning on test reliability and two Info items.

## Warnings

### WR-01: D-26 regression test cannot detect the regression it guards against

**File:** `src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx:122-125`
**Issue:** The four assertions are independent substring checks against the entire HTML document:

```ts
expect(html).toContain('#product-grid')
expect(html).toContain('id="product-grid"')
expect(html).toContain('scroll-mt-24')
expect(html).toContain('lg:scroll-mt-32')
```

Nothing verifies that the `scroll-mt-*` utilities live on the **same element** as `id="product-grid"`. The exact regression this fix repairs — the anchor sitting on one element while the scroll offset sits on another (or on a bare `<div>` with no box, as in the pre-fix code) — would keep this test green. For example, reverting the component to `<div id="product-grid" />` while leaving `scroll-mt-24` on the `<ul>` passes all four assertions but reintroduces D-26 (`scroll-margin-top` only takes effect on the element being scrolled to). This gives false confidence in the precise behavior the test is named for.
**Fix:** Assert the id and scroll-margin classes co-occur on one element, e.g.:

```ts
expect(html).toMatch(
  /<ul[^>]*id="product-grid"[^>]*class="[^"]*scroll-mt-24[^"]*lg:scroll-mt-32[^"]*"/,
)
```

(or extract the `<ul ...>` open tag first and run the class/id assertions against that substring).

## Info

### IN-01: Sticky-header offset values are duplicated magic numbers

**File:** `src/app/(storefront)/collections/[handle]/_components/product-list.tsx:48`
**Issue:** `scroll-mt-24` / `lg:scroll-mt-32` hard-code the sticky header height arithmetic (`h-19` + `lg:h-9.5` in `header.tsx`) that is already independently encoded in `sidebar.tsx:31` (`lg:top-32`). A future header height change requires finding and updating at least three call sites with no compiler or test signal connecting them.
**Fix:** Define a header-offset custom property/`@theme` token in `app/globals.css` (e.g., `--spacing-header-offset`) and use `scroll-mt-(--spacing-header-offset)` / `top-(--spacing-header-offset)` in both consumers, so the coupling lives in one place.

### IN-02: Hash append assumes upstream href never carries its own fragment

**File:** `src/app/(storefront)/collections/[handle]/_components/product-list.tsx:63`
**Issue:** `` `${buildPageHref(page)}#product-grid` `` is correct for the current producer (`getPaginationHref` emits only path + query), but the `buildPageHref?: (page: number) => string` prop contract does not document that the returned href must be fragment-free. A future caller returning a URL with a hash would silently produce a malformed double-fragment URL.
**Fix:** Add a one-line comment or JSDoc on the prop (`// must return an href without a fragment; #product-grid is appended here`). No code change needed today.

---

_Reviewed: 2026-06-12T03:15:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
