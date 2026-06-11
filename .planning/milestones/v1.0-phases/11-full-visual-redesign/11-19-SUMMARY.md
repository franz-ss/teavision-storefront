---
phase: 11-full-visual-redesign
plan: 19
subsystem: pdp
tags: [spacing, polish, uat-gap-closure]
dependency_graph:
  requires: []
  provides: [pdp-spacing-parity]
  affects: [pdp, product-form, quantity-stepper, bulk-savings, product-gallery]
tech_stack:
  added: []
  patterns: [per-element spacing rhythm, shape prop variant]
key_files:
  created: []
  modified:
    - src/app/(storefront)/products/[handle]/page.tsx
    - src/components/product/product-form/product-form.tsx
    - src/components/ui/quantity-stepper/quantity-stepper.tsx
    - src/components/product/bulk-savings/bulk-savings.tsx
    - src/components/product/product-gallery/product-gallery.tsx
decisions:
  - 'QuantityStepper gets a shape prop (pill default / rectangle) — only the PDP buy row passes shape=rectangle; cart and other consumers keep the pill unchanged'
  - 'Button size=lg height delta (#11) deferred — no-button-style-class ESLint rule blocks py-4.5 override on Button className; 4px difference is low severity'
  - 'Per-element margins replace gap-6 on the PDP info column so each sibling gets the exact design value instead of a uniform 24px gap'
metrics:
  duration: 12m
  completed_date: '2026-06-10'
  tasks_completed: 1
  files_changed: 5
---

# Phase 11 Plan 19: PDP Spacing/Alignment Parity Sweep Summary

PDP info-column rhythm corrected from uniform 24px gap to the design's varied 14–26px per-element spacing, buy-row stepper changed to 4px-radius rectangle, post-grid sections spaced with clamp(50px,7vw,90px), and 13 additional 2px-class deltas brought to pixel parity.

## Tasks Completed

| #   | Task                               | Commit  | Files                                                                                   |
| --- | ---------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| 1   | PDP spacing/alignment parity sweep | 9cffaa6 | page.tsx, product-form.tsx, quantity-stepper.tsx, bulk-savings.tsx, product-gallery.tsx |

## Deltas Applied

All 17 deltas from `.planning/debug/pdp-spacing.md` addressed:

| #   | Delta                                 | Fix                                                                                  | File                                   |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------- |
| 1   | Grid top offset 8px                   | `pt-2` on grid wrapper                                                               | page.tsx                               |
| 2   | Eyebrow→H1 14px                       | `gap-3.5` on title block                                                             | page.tsx                               |
| 3   | H1→rating 14px                        | `gap-3.5` on title block                                                             | page.tsx                               |
| 4   | Rating→tags 16px                      | `mt-4` on tags div                                                                   | page.tsx                               |
| 5   | Price 22px above/below                | `mt-5.5` on price and description                                                    | page.tsx                               |
| 6   | Description→opts 26px                 | `mt-6.5` on ProductForm                                                              | page.tsx                               |
| 7   | Buy→assurance 18px                    | `-mt-1.5` on assurance div                                                           | product-form.tsx                       |
| 8   | Assurance→bulk tiers 26px             | `mt-0.5` on BulkSavings                                                              | product-form.tsx                       |
| 9   | Bulk heading→grid 12px                | `gap-3` (from gap-4)                                                                 | bulk-savings.tsx                       |
| 10  | Stepper rectangle shape               | `shape="rectangle"` prop, 4px radius, 46px buttons                                   | quantity-stepper.tsx, product-form.tsx |
| 11  | Button height 52px                    | **Deferred** — ESLint `no-button-style-class` rule blocks py-4.5 on Button className | —                                      |
| 12  | Unit label 13px plain                 | `text-[13px]` no uppercase/tracking                                                  | page.tsx                               |
| 13  | Thumbnail radius 8px                  | `rounded-[8px]` (from rounded-lg)                                                    | product-gallery.tsx                    |
| 14  | Variant tile py-[13px]                | `py-3.25` (from py-3)                                                                | product-form.tsx                       |
| 15  | Assurance gaps 14px/26px              | `gap-x-6.5 gap-y-3.5`                                                                | product-form.tsx                       |
| 16  | Disclosure bottom 22px                | `mb-5.5`/`pb-5.5` (from mb-5/pb-5)                                                   | page.tsx                               |
| 17  | Post-grid rhythm clamp(50px,7vw,90px) | `mt-[clamp(50px,7vw,90px)]` on Reviews and Recommendations                           | page.tsx                               |

## Decisions Made

- **QuantityStepper shape prop**: Added `shape?: 'pill' | 'rectangle'` with `pill` as default. Existing consumers (cart) are unaffected. The PDP buy row passes `shape="rectangle"` to get the design's 4px-radius rectangle with 46px-wide buttons stretching to full row height.
- **Button height delta deferred**: Delta #11 (add-to-cart button height 48px→52px) cannot be fixed via `className` due to the `no-button-style-class` ESLint rule enforcing Button styling only through variants. Fixing globally (Button `size="lg"`) would affect all `size="lg"` buttons across the site. This is a low-severity delta (4px) noted for a future Button variant audit.
- **ProductForm className prop**: Added `className` to `ProductFormProps` so callers can apply spacing (e.g. `mt-6.5`) without wrapping in a layout div.
- **Disclosures offset adjusted**: With gap-6 removed from the info column, the disclosures div changed from `mt-2` to `mt-8` to preserve the verified 32px offset (gap-6 + mt-2 = 24+8 = 32px, now explicit `mt-8`).

## Deviations from Plan

### Auto-fixed Issues

None — plan executed as written.

### Deferred Issues

**1. [Delta #11 - Low] Button height 48px vs design's ~52px**

- **Found during:** Task 1
- **Issue:** `no-button-style-class` ESLint rule prevents `py-4.5` on Button's `className` prop; would need a new Button size variant or global change to `size="lg"`
- **Impact:** 4px height difference on the add-to-cart button in the PDP buy row
- **Deferred to:** Future Button variant audit (low severity, site-wide scope)

## Verification

- `pnpm test:unit`: 40/40 passed
- `pnpm lint`: passed (Tailwind class check + ESLint)
- `pnpm typecheck`: passed
- `pnpm test:contracts`: 35/35 passed
- Manual: PDP visual comparison vs design/extracted-design.html required at desktop + 375px

## Known Stubs

None — no stub patterns introduced.

## Threat Flags

None — purely presentational spacing changes; no new network endpoints, auth paths, or schema changes.

## Self-Check: PASSED

- All 5 modified files exist and were committed in 9cffaa6
- Unit tests: 40/40 green
- Contracts: 35/35 green
- Lint + typecheck: clean
