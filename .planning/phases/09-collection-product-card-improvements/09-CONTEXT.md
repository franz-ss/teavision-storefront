# Phase 9: Collection Product Card Improvements — Context

**Gathered:** 2026-06-03
**Status:** Ready for planning
**Source:** Impeccable design brief (UI analysis)

<domain>
## Phase Boundary

This phase improves the existing `ProductCard` and `ProductPurchaseForm` components in `src/components/collection/product-card/` to better serve B2B buyers scanning catalogue listings. No new components, no GraphQL changes, no new routes. All changes are targeted edits to 3 files plus the Storybook story.

**Files in scope:**
- `src/components/collection/product-card/product-card.tsx`
- `src/components/collection/product-card/product-purchase-form.tsx`
- `src/components/collection/product-card/product-card.stories.tsx`

**Out of scope:**
- `ProductList` (`src/app/(storefront)/collections/[handle]/_components/product-list.tsx`) — no changes needed
- GraphQL queries — `productType` and `tags` are already in `CollectionProductSummary`
- New components — inline changes only
- Product detail page purchase form — `showQuantity` defaults to `true`, so PDP behavior is unchanged

</domain>

<decisions>
## Implementation Decisions

### D-01: Wider image column
- Mobile: `7.5rem → 10rem`
- sm breakpoint: `12rem → 16rem`
- lg breakpoint: `14rem → 20rem`
- Rationale: Product photography is the primary brand asset. Current widths (120px / 192px / 224px) treat the image as a decorative sidebar. B2B buyers identifying ingredients by appearance need more image surface.

### D-02: Product-type eyebrow label
- Source field: `product.productType` from `CollectionProductSummary`
- Render only when `productType` is non-empty (truthy after `.trim()`)
- Style: `type-eyebrow text-muted` — compact uppercase label above the title
- Placement: immediately above `<h3>` in the identity zone

### D-03: Organic / certification badges from tags
- Extract from `product.tags`: check for tags containing (case-insensitive) `"organic"`, `"aco"`, `"certified"`, `"haccp"`
- Helper function `getCertificationBadges(tags: string[]): string[]` — returns badge label strings (e.g., `"Organic"`, `"ACO"`, `"HACCP"`)
- Cap at 2 badges maximum to control density
- Render using existing `Badge` component; use `variant="secondary"` or whichever variant suits compact labels — research should confirm the available variants
- Placement: below title/rating in the identity zone, before purchase controls

### D-04: Remove "More info" button
- Delete `<Button href={productUrl} variant="secondary" size="sm">More info</Button>` entirely
- The `<h3>` title is already a link to `productUrl`; a second "More info" link to the same URL is redundant noise
- This frees visual space and focuses attention on the `Add to cart` CTA

### D-05: Two-zone content layout
- Current: `grid content-start gap-5` — flat stack
- New: `grid grid-rows-[auto_1fr] min-h-full` with inner flex structure that pins purchase controls to the bottom
- Identity zone (top): eyebrow, title, rating, badges
- Purchase zone (bottom): price display + purchase form
- Goal: cards with and without purchase forms have consistent visual rhythm; purchase controls don't interrupt product identity scanning

### D-06: Hide quantity stepper in collection card context
- Add `showQuantity?: boolean` prop to `ProductPurchaseForm` (default `true` to preserve PDP behavior)
- When `showQuantity` is `false`, do not render `<QuantityStepper>` or its enclosing `<div>` — the `<Button type="submit">` (Add to cart) sits directly beside the quantity-1 default
- `ProductCard` passes `showQuantity={false}` to `ProductPurchaseForm`
- Rationale: quantity adjustment belongs in cart; the stepper adds ~40px height to every card and competes with product metadata

### D-07: Storybook coverage
- Update `product-card.stories.tsx` to cover:
  - Card with `productType` eyebrow (non-empty `productType`)
  - Card with certification badges (tags including `"organic"`)
  - Card with no eyebrow and no badges (empty `productType`, no cert tags)
  - Card without purchase form (sold-out / no variants)
  - Quick-check that no `QuantityStepper` renders in the default story

### Claude's Discretion
- Exact `Badge` variant to use for certification labels (determine from existing Badge component API)
- Two-zone layout implementation detail: `flex-col justify-between` vs `grid grid-rows` — choose whichever achieves the pinned-bottom purchase zone without breaking existing responsive behavior
- Whether `getCertificationBadges` lives inline in `product-card.tsx` or as a named export helper in the same file (prefer inline module-level function since it's single-owner)
- Exact tag matching strings (confirm from real Shopify data or research)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Component files
- `src/components/collection/product-card/product-card.tsx` — file being modified (current state)
- `src/components/collection/product-card/product-purchase-form.tsx` — file being modified (current state)
- `src/components/collection/product-card/product-card.stories.tsx` — Storybook story to update
- `src/components/ui/badge/badge.tsx` (or index.ts) — confirm available `variant` values before using Badge for cert labels
- `src/components/ui/index.ts` — confirm Badge is exported

### Type definitions
- `src/lib/shopify/types/index.ts` — `CollectionProductSummary` type (has `productType: string` and `tags: string[]`)

### Conventions
- `CLAUDE.md` — project conventions (no default exports, use `cn()`, design tokens only)
- `docs/conventions.md` — folder map, naming rules, component anatomy

### Design tokens
- `app/globals.css` — canonical token source; use `type-eyebrow`, `text-muted`, `border-default` etc.

</canonical_refs>

<specifics>
## Specific Implementation Notes

- `CollectionProductSummary.productType` is a `string` — it can be an empty string; always guard with `.trim()` before rendering
- `CollectionProductSummary.tags` is `string[]` — may be empty array
- The `Badge` component is imported via `@/components/ui` barrel
- The `QuantityStepper` import in `product-purchase-form.tsx` should be removed (not just hidden) when `showQuantity=false` to avoid unused conditional imports — or keep the import but conditionally render; either is fine since the prop default keeps PDP unchanged
- Accessibility: eyebrow label needs no special ARIA treatment; it's presentational context above a heading
- Motion: existing `motion-reduce:` classes on the image `<Image>` must be preserved unchanged

</specifics>

<deferred>
## Deferred Ideas

- Short `description` excerpt on the card — available on `ProductSummary` but not in scope for this phase; would require evaluating truncation length and text contrast at scale
- Progressive purchase form disclosure (hover to expand controls) — interaction-model change that risks hiding purchase controls from keyboard/touch users; deferred pending UAT
- Image aspect-ratio locking — current `h-full object-cover` approach works with flexible row heights; a locked aspect ratio would need `aspect-[X/Y]` and a different layout container

</deferred>

---

*Phase: 09-collection-product-card-improvements*
*Context gathered: 2026-06-03 via impeccable design brief*
