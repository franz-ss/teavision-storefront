---
phase: 11-full-visual-redesign
plan: 18
subsystem: cart
tags: [cart, pricing, layout, optimistic-ui, accessibility]
dependency_graph:
  requires: []
  provides:
    [
      cart-column-alignment,
      cart-compare-at-visibility,
      cart-optimistic-qty,
      cart-container-width,
    ]
  affects: [src/components/ui/price/price.tsx, src/app/(storefront)/cart]
tech_stack:
  added: []
  patterns: [useOptimistic, useTransition, CSS-grid-5col]
key_files:
  created: []
  modified:
    - src/app/(storefront)/cart/_components/cart-view.tsx
    - src/app/(storefront)/cart/_components/cart-line-actions.tsx
    - src/app/(storefront)/cart/page.tsx
    - src/components/ui/price/price.tsx
    - src/app/(storefront)/cart/_components/cart-view.test.tsx
decisions:
  - 'Phase 11-18: Cart line rows use xl:grid at desktop to match 5-col header; mobile keeps flex with stacked name/price/stepper layout.'
  - 'Phase 11-18: CartLineActions uses useOptimistic+useTransition for stepper clicks; remove button keeps useActionState for its own isPending/isLoading feedback.'
  - 'Phase 11-18: price.tsx compare-at size sm/md raised from text-[10px]/text-[11px] text-ink-faint to text-sm text-ink-soft so slashed prices are legible at cart density.'
metrics:
  duration: 389s
  completed_date: '2026-06-10'
  tasks: 2
  files: 5
---

# Phase 11 Plan 18: Cart Regressions (UAT-13) Summary

Cart column alignment, compare-at price visibility, optimistic quantity updates, and container width — four regression fixes from UAT test 13 closing.

## One-liner

Fixed four cart regressions from plans 11-03 and 11-11: unified 5-column grid layout between header and rows, raised compare-at price styling to legible text-sm text-ink-soft, wrapped stepper in useOptimistic+useTransition for instant feedback, and removed the base-variant container mismatch.

## Tasks Completed

| #   | Name                                                                           | Commit  | Files                                   |
| --- | ------------------------------------------------------------------------------ | ------- | --------------------------------------- |
| RED | Failing tests for compare-at visibility and grid alignment                     | 089d011 | cart-view.test.tsx                      |
| 1   | Unify cart line layout, restore visible compare-at prices, fix container width | 74f7784 | cart-view.tsx, price.tsx, cart/page.tsx |
| 2   | Optimistic quantity updates                                                    | 133bbb9 | cart-line-actions.tsx                   |

## What Was Built

**Task 1 — Layout, Compare-at, Container**

- `cart-view.tsx`: `<li>` elements now carry `xl:grid xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem] xl:items-start xl:gap-x-6` — identical to the table header — with cols mapped to image / name+meta / unit-price / stepper / line-total. Mobile layout is preserved as the existing `flex gap-3.5` with inline price/stepper/total below the name.
- `price.tsx`: `comparePriceTextVariants` `sm` and `md` sizes changed from `text-[10px]`/`text-[11px]` (invisible) to `text-sm`; base tone changed from `text-ink-faint` to `text-ink-soft`. This makes slashed prices legible at cart density without being visually dominant.
- `cart/page.tsx`: `Section.Container variant="base"` removed; container now defaults to `max-w-wide` (1480px) matching the header and all other storefront sections.

**Task 2 — Optimistic Quantity**

- `cart-line-actions.tsx`: Replaced per-form-element submit with `useOptimistic` + `useTransition`. The displayed quantity updates to `optimisticQuantity` instantly on click; buttons remain enabled during the transition. The `useActionState`-backed formAction is still used by the remove button for its own correct isPending/isLoading state. No client-side cart storage was introduced.

## Deviations from Plan

None — plan executed exactly as written.

## TDD Gate Compliance

- RED commit: 089d011 (`test(11-18): add failing tests for cart compare-at visibility and grid alignment`) — 2 tests failing
- GREEN commit: 74f7784 (`feat(11-18): fix cart column alignment, compare-at visibility, container width`) — all 40 tests passing

## Known Stubs

None.

## Threat Flags

None — no new network endpoints, auth paths, or trust-boundary mutations introduced.

## Self-Check: PASSED

- [x] `src/app/(storefront)/cart/_components/cart-view.tsx` exists and committed at 74f7784
- [x] `src/app/(storefront)/cart/_components/cart-line-actions.tsx` exists and committed at 133bbb9
- [x] `src/app/(storefront)/cart/page.tsx` exists and committed at 74f7784
- [x] `src/components/ui/price/price.tsx` exists and committed at 74f7784
- [x] `pnpm test:unit` — 40/40 passing
- [x] `pnpm test:integration` — 10/10 passing
- [x] `pnpm lint` — passed
- [x] `pnpm typecheck` — passed
