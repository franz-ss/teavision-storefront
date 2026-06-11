---
phase: 11-full-visual-redesign
plan: 11
subsystem: cart
tags: [cart, visual-redesign, design-tokens, bulk-pricing]
dependency_graph:
  requires: ['11-02', '11-03']
  provides: [cart-visual-redesign]
  affects:
    [
      cart-page,
      cart-view,
      cart-skeleton,
      cart-checkout-form,
      cart-recommendations,
      cart-error,
    ]
tech_stack:
  added: []
  patterns:
    [
      drawer-visual-language,
      hairline-divided-lines,
      pill-stepper,
      serif-headings,
    ]
key_files:
  created: []
  modified:
    - src/app/(storefront)/cart/_components/cart-view.tsx
    - src/app/(storefront)/cart/_components/cart-view.test.tsx
    - src/app/(storefront)/cart/_components/cart-view.stories.tsx
    - src/app/(storefront)/cart/_components/cart-line-actions.tsx
    - src/app/(storefront)/cart/_components/cart-line-actions.stories.tsx
    - src/app/(storefront)/cart/_components/cart-loading-skeleton.tsx
    - src/app/(storefront)/cart/_components/cart-checkout-form.tsx
    - src/app/(storefront)/cart/_components/cart-recommendations.tsx
    - src/app/(storefront)/cart/page.tsx
    - src/app/(storefront)/cart/error.tsx
decisions:
  - 'Unit price display preserved in line info area for BULK-07 bulk pricing context despite drawer mockup not showing it explicitly'
  - 'Remove button implemented as Button ghost sm (codebase rules prohibit raw button and Button className visual overrides)'
  - "e2e test failure (cart badge 5 items in cart) confirmed pre-existing before this plan's changes"
metrics:
  duration: 801s
  completed: '2026-06-10'
  tasks: 2
  files: 10
---

# Phase 11 Plan 11: Cart Page Visual Redesign Summary

**One-liner:** Cart page restyled with CartDrawer visual language: hairline-divided flex lines, 76px rounded-lg thumbs, Spectral serif name, Space Mono meta, pill quantity stepper, brand checkout button, and paper-card summary.

## Tasks Completed

| Task | Description                                                    | Commit  | Files                                                                                                          |
| ---- | -------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| 1    | Cart view + lockstep test + stories                            | c4888d1 | cart-view.tsx, cart-view.test.tsx, cart-view.stories.tsx, cart-line-actions.tsx, cart-line-actions.stories.tsx |
| 2    | Skeleton mirror + checkout form + recommendations + page/error | bd9e45f | cart-loading-skeleton.tsx, cart-checkout-form.tsx, cart-recommendations.tsx, page.tsx, error.tsx               |

## What Was Built

### Cart View (`cart-view.tsx`)

- Line items: `flex gap-3.5 py-5 border-b border-hairline` layout replacing card/grid
- Thumb: `h-19 w-19 shrink-0 rounded-lg bg-paper-2 overflow-hidden` (76px per spec)
- Product name: `font-display text-[1.05rem] leading-snug` (Spectral serif)
- Variant/meta: `type-mono-meta text-ink-faint` (Space Mono)
- Unit price preserved inline under meta for BULK-07 bulk pricing context
- Discount savings: `type-mono-meta text-brand` (was `text-success-text`)
- Line total: `font-bold` in right-side price column
- Summary sidebar: `bg-card border-t border-hairline rounded-lg p-6`, `font-display text-2xl` subtotal, Truck icon freight note, full-width `brand` lg checkout
- Empty state: `Leaf` icon, `text-ink-soft` copy, ghost "Browse teas" button
- Savings banner: `bg-ink text-paper` (was `bg-inverse text-on-brand`)

### Cart Line Actions (`cart-line-actions.tsx`)

- Pill stepper: `inline-flex items-center rounded-full border border-hairline`
- Stepper buttons: `size-11 text-ink-soft hover:text-brand rounded-full`
- Count: `min-w-7 text-center font-mono text-[13px] tabular-nums`
- Remove: `Button variant="ghost" size="sm"` (codebase prevents raw button + Button className visual styling)

### Cart Loading Skeleton (`cart-loading-skeleton.tsx`)

- Mirrors new flex line structure with `h-19 w-19` thumb and pill stepper placeholder
- All shimmer blocks: `bg-paper-2 animate-pulse motion-reduce:animate-none rounded-lg`
- Summary sidebar: `bg-card rounded-lg border-t border-hairline p-6 xl:sticky xl:top-24`
- Mobile bar: `bg-card border-t border-hairline` with rounded-full button placeholder

### Other Files

- **checkout-form.tsx**: `text-brand hover:text-brand-deep` terms link (was `text-link hover:text-link-hover`)
- **recommendations.tsx**: `border-hairline` section divider (was `border-default`)
- **page.tsx**: `type-heading-01 font-display` page heading; `Section.Container variant="base"` (max-w-base)
- **error.tsx**: `bg-card border-hairline rounded-lg`, `font-display text-ink` heading, `text-ink-soft` copy, `brand` retry button

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Unit price display preserved for BULK-07**

- **Found during:** Task 1
- **Issue:** New drawer layout removed separate unit-price column; test asserted `aria-label="Was $40.65"` (unit compare-at) must be present for bulk discount pricing context
- **Fix:** Added unit price `Price` component inline under variant meta in the line info area
- **Files modified:** cart-view.tsx
- **Commit:** c4888d1

**2. [Rule 3 - Blocking Issue] Button className lint restriction on remove button**

- **Found during:** Task 1
- **Issue:** `teavision/no-raw-button` prohibits `<button>`, but `teavision/no-button-style-class` prohibits visual styling in Button className — the mono-meta remove treatment couldn't be fully applied
- **Fix:** Used `Button variant="ghost" size="sm"` which is the valid existing pattern; ghost variant provides brand color affordance; exact mono-meta treatment deferred to a potential Button variant addition in plan 11-14
- **Files modified:** cart-line-actions.tsx
- **Commit:** c4888d1

### Pre-existing Issues (not caused by this plan)

**e2e test failure: `5 items in cart` not found**

- The e2e cart-checkout.spec.ts test fails at the `CartBadge` sr-only text assertion after add-to-cart
- Confirmed pre-existing: test fails identically on the previous commit (before any Task 1/2 changes)
- Root cause: Likely a Suspense revalidation timing issue in the header CartCount after Server Action
- Impact: Test line 16 fails; cart page functionality (lines 18+) cannot be verified by e2e
- This is an out-of-scope pre-existing issue per deviation Rule scope boundary

## Test Results

- `pnpm test:unit`: 38/38 tests passed
- `pnpm lint`: passed (Tailwind class check + ESLint)
- `pnpm typecheck`: passed (no TypeScript errors)
- `pnpm lint:tailwind`: passed
- `pnpm test:e2e`: 1 failure (pre-existing, not caused by this plan)

## Known Stubs

None. All data paths (bulk pricing, discount allocations, cart Server Actions, checkout handoff) remain wired to real Shopify data.

## Threat Flags

No new threat surface introduced. Cart Server Actions (`src/lib/cart/actions.ts`) untouched per T-11-26 mitigation. Discount allocations remain Shopify-reported per T-11-27.

## Self-Check: PASSED
