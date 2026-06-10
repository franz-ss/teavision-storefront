---
status: diagnosed
trigger: "Phase 11 UAT test 13 cart page regressions: (1) price/quantity columns misaligned under table headers, (2) slashed compare-at prices missing on cart lines, (3) quantity stepper shows loading cycle instead of optimistic update, (4) container max-width mismatch between cart section and adjacent sections"
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: ALL FOUR ROOT CAUSES CONFIRMED (see Resolution)
test: n/a — diagnosis complete
expecting: n/a
next_action: return diagnosis to orchestrator (find_root_cause_only — no fix applied)

## Symptoms

expected: |
  1. Cart line columns (photo, name, price/kg, quantity/kg, total) align under desktop table headers
  2. Discount slashed (compare-at) prices visible on cart lines
  3. Quantity +/- updates feel instant (optimistic UI)
  4. Cart section width matches adjacent sections / rest of site
actual: |
  1. Price and quantity columns no longer align under headers (regression from 11-11 restyle)
  2. Slashed compare-at prices no longer appear (regression — worked before)
  3. Every +/- click triggers visible loading cycle
  4. Container max-width mismatch between cart section and adjacent sections
errors: none (visual/UX regressions)
reproduction: Open /cart with items having bulk/compare-at discounts; observe desktop xl layout, click quantity steppers
started: After Phase 11 plans 11-03 (4d9d062, Price restyle) and 11-11 (c4888d1, cart-view restyle), both 2026-06-10

## Eliminated

- hypothesis: "Compare-at price data plumbing (GraphQL/operations) was broken in Phase 11"
  evidence: cart.graphql still queries compareAtAmountPerQuantity; operations/cart.ts still reshapes it; last change to query/operations was 981b1e5 (2026-06-09, pre-Phase-11 'enrich cart lines with bulk pricing'). Phase 11 never touched the data layer.
  timestamp: 2026-06-10
- hypothesis: "11-11 removed the compareAtPrice props from Price usages in cart-view"
  evidence: Full diff of c4888d1 shows both the unit Price and line-total Price still receive compareAtPrice={lineDisplayPricing.unitCompareAtPrice / totalCompareAtPrice}; getLineDisplayPricing helpers untouched. Markup for slashed price is still emitted to the DOM.
  timestamp: 2026-06-10
- hypothesis: "Price component stopped rendering the compare-at span"
  evidence: src/components/ui/price/price.tsx lines 84-101 still render the line-through compare span whenever compareAtPrice is passed.
  timestamp: 2026-06-10

## Evidence

- timestamp: 2026-06-10
  checked: cart-view.tsx HEAD vs c4888d1^ (pre-11-11)
  found: |
    PRE: each <li> used xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem] xl:gap-x-6 — identical template to the header — with dedicated cells: unit Price at xl:col-start-3, CartLineActions occupying col 4, line total at xl:col-start-5.
    POST: header keeps the 5-col grid (cart-view.tsx line 331) but each <li> (line 363) is now `flex gap-3.5`: a 4.75rem (h-19/w-19, not 6rem) image + one flex-1 column containing name, unit price, total, and stepper all nested. No grid on rows.
  implication: ISSUE 1 ROOT CAUSE — 11-11 restyled rows to drawer flex layout but left the old 5-column table header untouched; columns structurally cannot align.
- timestamp: 2026-06-10
  checked: price.tsx diff at 4d9d062 (11-03) + cart-view Price usage diff at c4888d1 (11-11)
  found: |
    11-03 changed compare-at styling from `font-display text-sm leading-5 text-muted line-through` (14px serif) to `font-mono text-[10px] text-ink-faint line-through` (10px mono, faint oklch(56%) on paper).
    11-11 demoted the desktop unit price from its own bold stacked column (className/priceClassName "text-strong font-semibold") to an inline 11px meta row under the title (className="text-ink-faint" priceClassName="type-mono-meta" = 11px uppercase mono). 11-11 also deleted the per-discount "-$X.XX" lines under the desktop total column.
  implication: ISSUE 2 ROOT CAUSE — slashed prices are still in the DOM but rendered at 10px font-mono text-ink-faint next to an 11px mono price; combined de-emphasis makes them perceptually invisible ("no longer appear"). Compounded regression from 11-03 + 11-11, not a logic removal.
- timestamp: 2026-06-10
  checked: cart-line-actions.tsx, src/lib/cart/actions.ts, cart/page.tsx, icon-button.tsx
  found: |
    Stepper uses useActionState(cartLineFormAction); displayed quantity is the server prop `quantity` (line 89) — no useOptimistic/useTransition. Both +/- IconButtons are `disabled={... || isPending}` and IconButton has `disabled:opacity-40`; Remove shows isLoading spinner.
    cartLineFormAction → updateCartLineAction → Shopify mutation → revalidatePath('/cart'). page.tsx wraps CartContent (async getCartAction fetch) in <Suspense fallback={<CartLoadingSkeleton />}>; revalidation re-renders the route and the boundary re-suspends while the cart refetches.
  implication: ISSUE 3 ROOT CAUSE — every click does a full Shopify round-trip + route revalidation before any visual change; meanwhile buttons dim (opacity-40) and the Suspense skeleton can flash. No optimistic layer exists.
- timestamp: 2026-06-10
  checked: section.tsx, globals.css tokens, container usage across src/app
  found: |
    Section.Container variants: default=max-w-wide, base=max-w-base. Tokens: --container-base: 80rem (1280px), --container-wide: 92.5rem (1480px). cart/page.tsx is the ONLY page using variant="base" (grep across src/app). Header inner containers use max-w-wide; all other storefront page sections use the default (wide) variant. CartRecommendations renders inside the same base container.
  implication: ISSUE 4 ROOT CAUSE — cart content (including recommendations) is constrained to 1280px while header/nav and every adjacent page band use 1480px → visible width mismatch.

## Resolution

root_cause: |
  1. ALIGNMENT: c4888d1 (plan 11-11) replaced the cart line <li> grid (xl:grid-cols-[6rem_minmax(0,1fr)_7rem_10rem_7rem], matching the header) with a drawer-style `flex gap-3.5` layout, but kept the 5-column desktop table header. Header and rows no longer share a column template.
  2. SLASHED PRICES: Compare-at markup is still rendered (data + props intact), but 4d9d062 (11-03) restyled compare-at to 10px font-mono text-ink-faint and c4888d1 (11-11) demoted the unit price to an 11px faint mono meta row and removed the per-discount "-$" lines — compounding to make slashed prices effectively invisible.
  3. LOADING CYCLE: cart-line-actions.tsx renders the server-provided quantity with useActionState only; cartLineFormAction does a Shopify mutation + revalidatePath('/cart'), and page.tsx's Suspense boundary (CartLoadingSkeleton) re-suspends on revalidation. No useOptimistic/useTransition layer, buttons disabled at opacity-40 during the round-trip.
  4. WIDTH MISMATCH: cart/page.tsx is the only route using Section.Container variant="base" (80rem/1280px); header and all adjacent sections use the default wide container (92.5rem/1480px).
fix: n/a (find_root_cause_only)
verification: n/a
files_changed: []
