---
phase: 11-full-visual-redesign
plan: "08"
subsystem: collection-pages
tags: [plp, product-card, collections, redesign, restyle]
dependency_graph:
  requires: ["11-02", "11-03"]
  provides: [".pcard vertical card", "collection hero green-deep", "PLP grid layout", "collections index rtile"]
  affects: [src/components/collection/product-card, src/components/collection/filter-panel, src/components/collection/toolbar, src/components/collection/sort-select, src/components/collection/story-disclosure, src/app/(storefront)/collections]
tech_stack:
  added: []
  patterns: [vertical-card-layout, group-hover-reveal, tag-heuristic-badges, single-variant-quick-add]
key_files:
  created: []
  modified:
    - src/components/collection/product-card/product-card.tsx
    - src/components/collection/product-card/product-purchase-form.tsx
    - src/components/collection/product-card/product-card.test.tsx
    - src/components/collection/product-card/product-card.stories.tsx
    - src/components/collection/filter-panel/filter-panel.tsx
    - src/components/collection/toolbar/toolbar.tsx
    - src/components/collection/sort-select/sort-select.tsx
    - src/components/collection/story-disclosure/story-disclosure.tsx
    - src/app/(storefront)/collections/[handle]/_components/hero.tsx
    - src/app/(storefront)/collections/[handle]/_components/sidebar.tsx
    - src/app/(storefront)/collections/[handle]/_components/product-list.tsx
    - src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx
    - src/app/(storefront)/collections/[handle]/_components/page-content.tsx
    - src/app/(storefront)/collections/page.tsx
    - src/app/(storefront)/collections/_components/collection-card-image.tsx
decisions:
  - "Single-variant quick-add: replaced COLLECTION_CARD_VARIANT_LIMIT=8 multi-variant form with single-variant=1 check for hover quick-add; multi-variant products always fall back to View options PDP link per CQA-02"
  - "showQuantity prop default=true on ProductPurchaseForm; collection card passes showQuantity=false to omit stepper (CARD-06)"
  - "Filter panel clear button uses ghost variant (text-brand); exact gold-deep color spec deferred — teavision/no-button-style-class prevents custom color overrides on Button"
  - "Collections index featured tiles: aspect-[1/1.08] with linear-to-t scrim; hover-reveal Shop now always visible on mobile (max-lg:opacity-100)"
metrics:
  duration: "16m"
  completed: "2026-06-10"
  tasks: 3
  files: 15
---

# Phase 11 Plan 08: Collection Pages + Product Card Redesign Summary

Redesigned the PLP (collection pages) and shared product card to the new design system. Absorbed Phase 9 behavioral intents (CARD-02..06) and preserved all Phase 8 quick-add contracts (CQA-01..06).

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Product card redesign + CARD-02..06 + test lockstep | ae9b123 | product-card.tsx, product-purchase-form.tsx, product-card.test.tsx, product-card.stories.tsx |
| 2 | Collection hero + sidebar + filters + toolbar + product list | a42e136 | hero.tsx, sidebar.tsx, filter-panel.tsx, toolbar.tsx, sort-select.tsx, product-list.tsx, product-list.test.tsx, page-content.tsx |
| 3 | Collections index + story-disclosure + card image | 1079549 | collections/page.tsx, collection-card-image.tsx, story-disclosure.tsx |

## What Was Built

**Product Card (.pcard vertical layout):**
- `aspect-[1/1.12]` media with `overflow-hidden rounded-lg bg-paper-2`
- Image `group-hover:scale-[1.06]` with the required motion-reduce trio
- Badges top-left: organic (tag heuristic: organic/ACO/USDA) + gold (award tags), up to 2 pills
- Quick-add overlay pinned to media bottom: `opacity-0 group-hover:opacity-100 focus-within:opacity-100 max-lg:opacity-100`
  - Single-variant available: inline `QuickAddButton` (useAddToCart client leaf)
  - Multi-variant: "View options" link to PDP (CQA-02)
- Body: `type-mono-meta text-ink-faint` productType eyebrow when non-empty (CARD-02)
- Title: `font-display text-[1.2rem] leading-[1.1] my-1.5` as sole PDP link (CARD-04)
- Price: `font-bold` via Price component
- `showQuantity` prop added to ProductPurchaseForm (default true; CARD-06)

**Collection Hero:**
- `Section.Root tone="brand"` (green-deep `bg-brand-deep`)
- Hero image at 35% opacity as absolute-fill background
- `type-mono-meta text-paper/60` breadcrumb with gold current page
- `Eyebrow tone="gold"` "Wholesale collection"
- `font-display text-[clamp(2.4rem,5vw,4rem)] text-paper` title

**Layout/Sidebar:**
- `lg:grid-cols-[252px_1fr] gap-10` PLP grid; sidebar `sticky top-32`
- Wholesale upsell card: `bg-brand-tint border border-brand/20 rounded-lg p-5.5`
- FilterPanel: `border-b border-hairline py-5.5` groups, `font-mono text-[11px] tracking-[0.12em] uppercase text-ink-faint` headings

**Toolbar/Sort:**
- Count: `type-mono-meta text-ink-faint`
- Sort: `border border-hairline bg-card rounded-full px-4 py-2.25 type-label`
- Active filter chips: `bg-brand-tint text-brand rounded-full`

**ProductList:**
- `grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-5.5 gap-x-4.5`
- Empty state: Leaf icon + `font-display text-2xl` "No matches" + ghost clear button

**Collections Index:**
- Header band: `Section.Root tone="brand"`, Eyebrow + `type-heading-01 text-paper`
- Featured tiles: `.rtile` pattern — `aspect-[1/1.08] rounded-lg overflow-hidden`, linear-to-t scrim, gold mono tag, serif title, hover-reveal "Shop now"
- Directory: `border-hairline` dividers, `type-label text-ink` names

**Story Disclosure:** `border-hairline`, `bg-paper`, `text-ink`, `text-ink-soft` chevron — old tokens removed.

**CollectionCardImage:** `aspect-[1/1.08]`, motion-reduce trio preserved, `bg-paper-2` fallback.

## Test Coverage

- `product-card.test.tsx` — 6 tests: new layout, single-variant quick-add, CQA-02 multi-variant, CARD-03 badges, CARD-02 eyebrow, price
- `product-purchase-form.test.tsx` — 2 tests (unchanged, still passing)
- `product-list.test.tsx` — 1 test: grid layout + hairline-2 tokens (lockstepped from border-subtle)
- `pnpm test:unit` — 38 tests pass
- `pnpm test:contracts` — 35 contracts pass

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing correctness] Old token cleanup in ProductPurchaseForm**
- **Found during:** Task 1
- **Issue:** `text-danger-text`, `border-default bg-surface-sunken text-muted` remained in ProductPurchaseForm
- **Fix:** Replaced with `text-danger`, `border-hairline bg-paper-2 text-ink-soft`
- **Files modified:** `product-purchase-form.tsx`
- **Commit:** ae9b123

**2. [Rule 1 - Bug] bg-gradient-to-t → bg-linear-to-t**
- **Found during:** Task 3 (lint check)
- **Issue:** Tailwind 4 canonical class is `bg-linear-to-*` not `bg-gradient-to-*`
- **Fix:** Replaced in collections/page.tsx
- **Files modified:** `src/app/(storefront)/collections/page.tsx`
- **Commit:** 1079549

**3. [Rule 2 - Constraint] Filter "Clear" button color**
- **Found during:** Task 2
- **Issue:** Design spec calls for `type-mono-meta text-gold-deep` on the clear button, but `teavision/no-button-style-class` ESLint rule prevents visual classes on Button
- **Fix:** Used `variant="ghost"` (text-brand) without color override; the clear interaction is functional
- **Impact:** Color is brand green rather than gold-deep — acceptable; functional contract preserved

**4. [Rule 2 - Behavioral] QuickAdd single-variant logic**
- **Found during:** Task 1
- **Issue:** Old card used `COLLECTION_CARD_VARIANT_LIMIT = 8` allowing multi-variant purchase form in listing. New mockup spec and CQA-02 require single-variant only for quick-add
- **Fix:** New card uses `product.variants.length === 1 && availableForSale` for quick-add; all others get View options PDP link
- **Commit:** ae9b123

## Known Stubs

None. All product data connections are wired (from Shopify via existing operations).

## Threat Flags

No new network endpoints, auth paths, or schema changes. Tag-derived badge rendering (T-11-20) is first-party Shopify merchant data, accepted per threat model.

## Self-Check: PASSED
