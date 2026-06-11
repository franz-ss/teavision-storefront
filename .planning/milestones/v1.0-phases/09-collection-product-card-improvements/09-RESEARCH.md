# Phase 9: Collection Product Card Improvements — Research

**Researched:** 2026-06-03
**Domain:** React component editing — layout, typography tokens, badge system, Storybook
**Confidence:** HIGH

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01 Image column widths:** mobile `7.5rem → 10rem`, sm `12rem → 16rem`, lg `14rem → 20rem`
- **D-02 Eyebrow label:** source `product.productType`, guard with `.trim()`, style `type-eyebrow text-muted`, placed immediately above `<h3>`
- **D-03 Certification badges:** extract tags matching (case-insensitive) `"organic"`, `"aco"`, `"certified"`, `"haccp"`; cap at 2; use existing `Badge` component; placement below title/rating before purchase controls
- **D-04 Remove "More info" button:** delete the `<Button href={productUrl} variant="secondary" size="sm">More info</Button>` element entirely
- **D-05 Two-zone content layout:** identity zone (eyebrow, title, rating, badges) at top; purchase zone (price + form) at bottom; replace current `grid content-start gap-5` with a layout that pins purchase controls to the bottom
- **D-06 `showQuantity` prop:** add `showQuantity?: boolean` (default `true`) to `ProductPurchaseForm`; when `false` do not render `<QuantityStepper>` or its enclosing `<div>`; `ProductCard` passes `showQuantity={false}`
- **D-07 Storybook:** update `product-card.stories.tsx` to cover: eyebrow with non-empty productType, certification badges, no eyebrow/no badges, sold-out (no purchase form), no QuantityStepper in default story

### Claude's Discretion

- Exact `Badge` variant for certification labels (research must confirm available variants)
- Two-zone layout implementation detail: `flex-col justify-between` vs `grid grid-rows` — whichever achieves pinned-bottom without breaking responsive behavior
- Whether `getCertificationBadges` lives inline in `product-card.tsx` or as a named export (prefer inline module-level since single-owner)
- Exact tag matching strings (confirm from real Shopify data or research)

### Deferred Ideas (OUT OF SCOPE)

- Short `description` excerpt on the card
- Progressive purchase form disclosure (hover to expand)
- Image aspect-ratio locking (`aspect-[X/Y]`)
  </user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                   | Research Support                                                                                                                                                                                               |
| ------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CARD-01 | Wider image column (mobile ≥ 10rem, sm ≥ 16rem, lg ≥ 20rem)   | Grid col template strings verified in current component; new values are straight Tailwind arbitrary values                                                                                                     |
| CARD-02 | `productType` eyebrow label above title when non-empty        | `type-eyebrow` utility confirmed in globals.css; `productType: string` confirmed on `CollectionProductSummary`                                                                                                 |
| CARD-03 | Certification badges from tags, up to 2                       | `tags: string[]` confirmed on `CollectionProductSummary`; Badge component has `type-eyebrow` base class but fixed variant set — implementation requires extending `BadgeVariant` or using `className` override |
| CARD-04 | Remove "More info" button                                     | Button identified at line 91–93 of product-card.tsx; straightforward deletion                                                                                                                                  |
| CARD-05 | Two-zone content layout                                       | Current content column is `grid content-start gap-5`; new structure needs identity zone + purchase zone separation                                                                                             |
| CARD-06 | `showQuantity` prop on `ProductPurchaseForm` (default `true`) | `QuantityStepper` block confirmed at lines 98–107 of product-purchase-form.tsx; prop addition is straightforward                                                                                               |
| CARD-07 | Updated Storybook stories                                     | Existing stories identified; `Default` and `MultiVariant` play tests check for `spinbutton` role — those assertions must be updated                                                                            |

</phase_requirements>

---

## Summary

Phase 9 is a targeted in-place edit to three files: `product-card.tsx`, `product-purchase-form.tsx`, and `product-card.stories.tsx`. No new components, no GraphQL changes, no new routes. All locked decisions in CONTEXT.md are directly implementable from the existing codebase. The research answers every open question raised in the phase brief.

The single architectural wrinkle is the `Badge` component. Its `BadgeVariant` type is a closed union (`'outOfStock' | 'sale' | 'new'`) with `children` omitted from props — the component auto-renders a fixed label string from an internal lookup map. Certification badge text ("Organic", "ACO", "HACCP", "Certified") is not in that map. The implementation must either: (a) add a `certification` variant with a dynamic label, or (b) extend `Badge` to accept custom `children` for certification use, or (c) render certification labels as a plain `<span>` using the same `type-eyebrow` CVA classes without a new variant. Option (c) avoids touching the shared `Badge` component and is the lowest-risk path.

The `type-eyebrow` utility exists in globals.css and is already used as the base class inside `badgeVariants`. The current card's `min-h-11` on the price paragraph was an alignment shim for the "More info" button — once that button is removed and the two-zone layout takes over, the `min-h-11` is no longer needed. The Storybook `play` tests in `Default` and `MultiVariant` assert on `spinbutton` role (the QuantityStepper input); those assertions must be updated for the `showQuantity={false}` world.

**Primary recommendation:** For certification badges, render inline `<span>` elements using the same `type-eyebrow` CVA styling rather than adding a new `Badge` variant, keeping the shared component's API clean. For the two-zone layout, use `flex flex-col` with `justify-between` on the content column rather than `grid grid-rows` — it is simpler to maintain and achieves the same pinned-bottom effect.

---

## Architectural Responsibility Map

| Capability                           | Primary Tier          | Secondary Tier | Rationale                                                                                        |
| ------------------------------------ | --------------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| Card layout (image widths, two-zone) | Frontend Server (RSC) | —              | `ProductCard` is a Server Component; layout is pure markup                                       |
| Eyebrow label rendering              | Frontend Server (RSC) | —              | Reads `productType` string from prop; no interactivity                                           |
| Certification badge extraction       | Frontend Server (RSC) | —              | Pure function over `tags[]` prop; no browser API needed                                          |
| Purchase form (`showQuantity` prop)  | Browser / Client      | —              | `ProductPurchaseForm` is already `'use client'`; `showQuantity` is a new render branch inside it |
| Storybook story fixtures             | Build-time            | —              | Static mock data; no runtime tier                                                                |

---

## Standard Stack

### Core (all already installed)

| Library                        | Version   | Purpose               | Why Standard                                |
| ------------------------------ | --------- | --------------------- | ------------------------------------------- |
| React 19                       | 19.x      | Component model       | Project baseline [VERIFIED: codebase]       |
| Next.js 16 App Router          | 16.x      | Server Components     | Project baseline [VERIFIED: AGENTS.md]      |
| Tailwind 4                     | 4.x       | Utility styling       | Project baseline [VERIFIED: AGENTS.md]      |
| class-variance-authority (cva) | installed | Variant class maps    | Already used in Badge [VERIFIED: badge.tsx] |
| `cn()` from `@/lib/utils`      | —         | className composition | Project convention [VERIFIED: CLAUDE.md]    |

### No new installs needed

This phase adds no new dependencies.

---

## Architecture Patterns

### System Architecture Diagram

```
CollectionProductSummary (Server prop)
         |
    ProductCard (RSC)
    ├── image column (wider grid template)
    └── content column (two-zone flex)
         ├── identity zone (top)
         │    ├── eyebrow: productType (trim guard)
         │    ├── h3 title (Link)
         │    ├── StarRating (optional)
         │    └── cert badges: getCertificationBadges(tags) → span[]
         └── purchase zone (bottom, mt-auto)
              ├── price display ("From X")
              └── ProductPurchaseForm (client leaf)
                   ├── variant Select (if multi-variant)
                   ├── QuantityStepper (only if showQuantity=true)
                   └── Add to cart Button
```

### Recommended File Structure

No new files. All edits are in-place in existing files:

```
src/components/collection/product-card/
├── product-card.tsx           (EDIT: layout, eyebrow, badges, remove More info)
├── product-purchase-form.tsx  (EDIT: add showQuantity prop)
└── product-card.stories.tsx   (EDIT: add new stories, update play assertions)
```

### Pattern 1: `getCertificationBadges` helper

**What:** Module-level pure function in `product-card.tsx` — not exported, single-owner.
**When to use:** Called once inside `ProductCard` to derive the badge label list from `product.tags`.

```typescript
// Source: CONTEXT.md D-03, verified against CollectionProductSummary.tags: string[]
const CERT_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /organic/i, label: 'Organic' },
  { pattern: /\baco\b/i, label: 'ACO' },
  { pattern: /certified/i, label: 'Certified' },
  { pattern: /\bhaccp\b/i, label: 'HACCP' },
]

function getCertificationBadges(tags: string[]): string[] {
  const found: string[] = []
  for (const { pattern, label } of CERT_PATTERNS) {
    if (tags.some((tag) => pattern.test(tag))) {
      found.push(label)
      if (found.length === 2) break
    }
  }
  return found
}
```

**Note:** Using word-boundary (`\b`) on `aco` and `haccp` prevents false matches on tags like "macro" or "shachok". [ASSUMED: tag matching precision — confirm against real Shopify data; the CONTEXT.md decision does not specify word-boundary requirement]

### Pattern 2: `showQuantity` prop on `ProductPurchaseForm`

**What:** Conditional render of the QuantityStepper + its wrapper `<div>` based on a new boolean prop.
**Default is `true`** — PDP behavior is completely unchanged.

```typescript
// Source: CONTEXT.md D-06, verified against product-purchase-form.tsx lines 98-119
type ProductPurchaseFormProps = {
  variants: ProductVariant[]
  productTitle: string
  addToCart?: AddToCart
  onCartChanged?: () => void
  showQuantity?: boolean   // NEW — defaults to true
}

// Inside render, the quantity+button row becomes:
<div className="flex flex-wrap items-center gap-3">
  {showQuantity !== false && (
    <QuantityStepper
      value={quantity}
      onChange={(nextQuantity) => {
        setQuantity(nextQuantity)
        resetFeedback()
      }}
      disabled={isPending || !canAddToCart}
      label={`Quantity for ${productTitle}`}
    />
  )}
  <div className="min-w-36 flex-1 sm:flex-none">
    <Button ...>Add to cart</Button>
  </div>
</div>
```

When `showQuantity` is `false`, `quantity` state still exists (initialized to `1`), and `addItem(selectedVariant.id, 1)` is called with the hardcoded default. This is correct for listing context.

### Pattern 3: Two-zone content column layout

**What:** Replace `grid content-start gap-5` with a flex column that separates identity (top) from purchase controls (bottom).

```tsx
// Source: CONTEXT.md D-05
// BEFORE:
<div className="grid min-w-0 content-start gap-5 p-4 sm:p-5 lg:p-6">
  ...all content flat...
</div>

// AFTER:
<div className="flex min-h-full min-w-0 flex-col p-4 sm:p-5 lg:p-6">
  {/* Identity zone — grows to push purchase zone down */}
  <div className="flex-1 space-y-3">
    {/* eyebrow */}
    {/* h3 title */}
    {/* StarRating */}
    {/* cert badges */}
  </div>

  {/* Purchase zone — always at bottom */}
  <div className="mt-4">
    {/* price */}
    {/* ProductPurchaseForm */}
  </div>
</div>
```

`flex-col` + `flex-1` identity zone + bottom purchase zone is simpler and more robust across variable content heights than `grid grid-rows-[auto_1fr]`.

### Pattern 4: Certification badge rendering

**What:** Since `Badge` has a closed `BadgeVariant` union and omits `children`, render inline `<span>` elements with the same `type-eyebrow` styling for certification labels rather than adding a new Badge variant.

```tsx
// Source: badge.tsx — BadgeVariant = 'outOfStock' | 'sale' | 'new'; children omitted
// Using the same CVA base class manually:
{
  certBadges.length > 0 && (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {certBadges.map((label) => (
        <span
          key={label}
          className="type-eyebrow border-default bg-surface-sunken text-muted inline-block rounded-sm border px-1.5 py-0.5"
        >
          {label}
        </span>
      ))}
    </div>
  )
}
```

This matches the `new` Badge variant styling (`border-default bg-surface-sunken text-muted`) and uses the `type-eyebrow` base — visually consistent without modifying the shared Badge component.

**Alternative:** Add `variant="certification"` to Badge with a dynamic label. This is cleaner API-wise but touches the shared component and requires a story update for Badge itself. The CONTEXT.md discretion leaves this to implementer — this research recommends the inline span approach for minimum blast radius.

### Anti-Patterns to Avoid

- **Adding `'use client'` to `ProductCard`**: it is and must remain a Server Component. The `showQuantity={false}` prop is a simple RSC-to-client-leaf prop pass.
- **Using Tailwind template literals for className**: `cn()` must be used for all conditional composition.
- **Raw hex values**: use token classes (`bg-surface-sunken`, `text-muted`, `border-default`) not raw colors.
- **Keeping `min-h-11` on the price paragraph**: once the "More info" button is removed and two-zone layout takes over, the height shim is vestigial. Remove it to avoid ghost spacing.
- **Modifying `quantity` initial state**: when `showQuantity={false}`, `useState(1)` is the right default and `addItem(selectedVariant.id, quantity)` continues to work correctly — quantity is 1.

---

## Don't Hand-Roll

| Problem               | Don't Build                     | Use Instead                                     | Why                                                    |
| --------------------- | ------------------------------- | ----------------------------------------------- | ------------------------------------------------------ |
| Variant class maps    | Manual string interpolation     | `cva` (already used in badge.tsx)               | Type-safe, already installed                           |
| className composition | Template literals / filter-join | `cn()` from `@/lib/utils`                       | Project rule; Tailwind merge safe                      |
| Typography tokens     | Hardcoded font-size/weight      | `type-eyebrow`, `type-caption` from globals.css | Token already exists; matches Badge base class exactly |

---

## Common Pitfalls

### Pitfall 1: Storybook `play` tests assert `spinbutton` role

**What goes wrong:** The `Default` story (line 88) and `MultiVariant` story (line 128) both call `canvas.getByRole('spinbutton', { name: 'Quantity for ...' })` which will fail after `showQuantity={false}` is passed in the collection card context — but NOT in the stories unless the stories are updated to pass `showQuantity={false}` to the form.

**Why it happens:** The stub product stories render `ProductCard`, which will pass `showQuantity={false}` to `ProductPurchaseForm` after this phase. The spinbutton will no longer be in the DOM.

**How to avoid:** Update the `Default` and `MultiVariant` story `play` assertions to use `queryByRole` with a `.not.toBeInTheDocument()` check for the spinbutton, or add a dedicated `WithQuantityStepper` story that passes `showQuantity={true}` explicitly to test that branch.

**Warning signs:** Storybook interaction test failure: "Unable to find role='spinbutton'"

### Pitfall 2: `Badge` `children` prop is omitted by type

**What goes wrong:** Attempting to render `<Badge variant="outOfStock">Custom label</Badge>` fails because `BadgeProps` extends `Omit<ComponentProps<'span'>, 'children'>` — `children` is intentionally removed. The component renders fixed labels from the internal `labels` lookup.

**Why it happens:** `BadgeVariant` enum is a closed set designed for status badges (sold-out, sale, new). Certification labels are arbitrary text.

**How to avoid:** Do not use the `Badge` component for certification labels. Use inline `<span>` with identical styling class names, or add a new variant (see Pattern 4 above). [VERIFIED: badge.tsx line 8 — `Omit<ComponentProps<'span'>, 'children'>`]

### Pitfall 3: `min-h-11` ghost spacing after removing "More info"

**What goes wrong:** The current price paragraph has `min-h-11 items-center` styling (line 83 of product-card.tsx). This was a height shim so the price row aligns with the "More info" button on the right. After removing the button and restructuring to two zones, leaving `min-h-11` creates 44px of phantom minimum height in the purchase zone.

**Why it happens:** Alignment shims tied to sibling elements must be revisited when the sibling is removed.

**How to avoid:** Remove `min-h-11` from the price paragraph as part of the two-zone restructure. The `flex-1` identity zone handles spacing.

### Pitfall 4: `sizes` attribute on `<Image>` not updated with new column widths

**What goes wrong:** The `<Image>` component has `sizes="(min-width: 1024px) 14rem, (min-width: 640px) 12rem, 7.5rem"` (line 49 of product-card.tsx). If the grid column widths change but `sizes` is not updated, the browser fetches the wrong image resolution.

**Why it happens:** `sizes` is a hint to the browser about rendered image width — it must match the actual CSS layout sizes.

**How to avoid:** Update `sizes` to `"(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 10rem"` in sync with the D-01 column width changes. [VERIFIED: product-card.tsx line 49]

### Pitfall 5: `motion-reduce:` classes on image must be preserved

**What goes wrong:** The image `<Image>` has `motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100` (line 50). Accidentally removing these during a JSX restructure breaks the reduced-motion accessibility feature.

**Why it happens:** Line edits to the image block can strip trailing utility classes.

**How to avoid:** Treat line 50 of product-card.tsx as read-only during the image-width edit. Only the `sizes` attribute changes; the `className` on `<Image>` is unchanged.

---

## Code Examples

### Current state of content column (to be replaced)

```tsx
// Source: product-card.tsx lines 62-101 [VERIFIED]
<div className="grid min-w-0 content-start gap-5 p-4 sm:p-5 lg:p-6">
  <div className="min-w-0">
    <h3 className="type-heading-04 text-strong wrap-break-word">
      <Link href={productUrl} ...>{product.title}</Link>
    </h3>
    {product.rating !== undefined && <StarRating ... className="mt-3" />}
    <div className="mt-4 flex flex-wrap gap-2">
      <p className="type-body-sm mr-auto flex min-h-11 items-center gap-1.5">
        <span className="text-muted">From</span>
        <Price price={product.priceRange.minVariantPrice} size="sm" className="text-strong" />
      </p>
      <Button href={productUrl} variant="secondary" size="sm">More info</Button>   {/* DELETE */}
      {product.availableForSale ? (
        <ProductPurchaseForm variants={product.variants} productTitle={product.title} />
      ) : null}
    </div>
  </div>
</div>
```

### Current image column grid template (to be updated)

```tsx
// Source: product-card.tsx line 33 [VERIFIED]
// BEFORE:
<div className="grid min-h-full grid-cols-[7.5rem_1fr] sm:grid-cols-[12rem_1fr] lg:grid-cols-[14rem_1fr]">

// AFTER (D-01):
<div className="grid min-h-full grid-cols-[10rem_1fr] sm:grid-cols-[16rem_1fr] lg:grid-cols-[20rem_1fr]">
```

### `type-eyebrow` token definition

```css
/* Source: src/app/globals.css lines 392-399 [VERIFIED] */
@utility type-eyebrow {
  font-family: var(--font-sans);
  font-size: 0.75rem; /* 12px */
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1rem;
  text-transform: uppercase;
}
```

This is identical to the base class already applied inside `badgeVariants` in badge.tsx — certification label spans will be visually consistent with existing Badge components.

### Current `ProductPurchaseForm` QuantityStepper block (to be conditionally rendered)

```tsx
// Source: product-purchase-form.tsx lines 98-119 [VERIFIED]
<div className="flex flex-wrap items-center gap-3">
  <QuantityStepper                          // wrap this in {showQuantity !== false && ...}
    value={quantity}
    onChange={(nextQuantity) => {
      setQuantity(nextQuantity)
      resetFeedback()
    }}
    disabled={isPending || !canAddToCart}
    label={`Quantity for ${productTitle}`}
  />
  <div className="min-w-36 flex-1 sm:flex-none">
    <Button type="submit" ...>Add to cart</Button>
  </div>
</div>
```

### Existing story fixture already has `productType` and `tags`

```typescript
// Source: product-card.stories.tsx lines 43-60 [VERIFIED]
const stubProduct: CollectionProductSummary = {
  // ...
  productType: 'Green tea', // already present — eyebrow will render from Default story
  tags: ['Wholesale', 'Loose leaf'], // no cert tags — Default story will show no cert badges
  // ...
}
```

The Default story already tests the eyebrow scenario (non-empty `productType: 'Green tea'`). A separate "WithProductType" story variant is not strictly needed — but CONTEXT.md D-07 asks for explicit eyebrow, badge, and no-eyebrow/no-badge story coverage, so at minimum: update Default to be eyebrow-present, add WithCertBadges (tags: `['Organic', 'ACO Certified']`), add NoBrandingInfo (empty `productType`, plain tags).

---

## State of the Art

| Old Approach                                                     | Current Approach                                             | When Changed | Impact                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------ | ------------ | --------------------------------------------- |
| Flat `grid content-start gap-5` content column                   | Two-zone flex column (this phase)                            | Phase 9      | Purchase controls pinned to bottom of card    |
| Full `ProductPurchaseForm` (with quantity stepper) on every card | `showQuantity={false}` suppresses stepper in listing context | Phase 9      | Shorter cards; stepper still available on PDP |
| "More info" button next to price                                 | Title link is sole PDP navigation                            | Phase 9      | Reduces noise; focuses CTA                    |

---

## Assumptions Log

| #   | Claim                                                                                                                    | Section                | Risk if Wrong                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | Word-boundary regex (`\baco\b`, `\bhaccp\b`) is appropriate for tag matching                                             | Pattern 1 code example | Could miss or over-match tags if Shopify stores them differently (e.g., "ACO Certified" as a single tag) — adjust pattern to check the whole tag for substring match instead |
| A2  | `flex-col` + `flex-1` identity zone achieves the two-zone pinned-bottom layout equivalent to `grid grid-rows-[auto_1fr]` | Pattern 3              | Both achieve the goal; if browser wrapping behavior differs at narrow widths the grid-rows approach is the fallback                                                          |

---

## Open Questions

1. **What do real Teavision product tags look like for organic/certification products?**
   - What we know: `tags: string[]` confirmed on type; CONTEXT.md specifies matching keywords `"organic"`, `"aco"`, `"certified"`, `"haccp"` (case-insensitive)
   - What's unclear: Whether tags are single-word (`"Organic"`) or multi-word phrases (`"ACO Certified"`), and whether word-boundary regex or substring `.includes()` is appropriate
   - Recommendation: Use `tag.toLowerCase().includes(keyword)` rather than regex for maximum compatibility; this matches "ACO Certified" with the "aco" keyword without needing word boundaries

2. **Should the `Badge` component be extended with a `certification` variant or left unchanged?**
   - What we know: Badge has a closed `BadgeVariant` union; `children` is omitted; adding a variant requires a badge.tsx edit + badge.stories.tsx update
   - What's unclear: Whether the project prefers Badge API purity or consistency of using the Badge component everywhere
   - Recommendation: Use inline `<span>` (Pattern 4) for this phase; revisit Badge extensibility in a future component API phase

---

## Environment Availability

Step 2.6: SKIPPED — this phase is code/config-only changes to three existing files. No external dependencies beyond the existing project toolchain (`pnpm build`, `pnpm lint`, `pnpm build-storybook`).

---

## Validation Architecture

No dedicated test runner outside Storybook (per AGENTS.md). Validation is Storybook interaction tests + typecheck + lint + build.

### Test Framework

| Property           | Value                                                       |
| ------------------ | ----------------------------------------------------------- |
| Framework          | Storybook (`@storybook/nextjs-vite`) with `@storybook/test` |
| Config file        | `.storybook/` (existing)                                    |
| Quick run command  | `pnpm storybook` (dev, port 6006)                           |
| Full suite command | `pnpm build-storybook`                                      |

### Phase Requirements → Test Map

| Req ID  | Behavior                                                        | Test Type       | Automated Command                                             | File Exists?                 |
| ------- | --------------------------------------------------------------- | --------------- | ------------------------------------------------------------- | ---------------------------- |
| CARD-01 | Image column is wider at all breakpoints                        | Visual / manual | Storybook visual check                                        | Story exists (Default)       |
| CARD-02 | Eyebrow label renders when `productType` non-empty              | Storybook play  | `canvas.getByText('Green tea')` in updated Default story      | Update existing              |
| CARD-03 | Up to 2 cert badges render when tags match                      | Storybook play  | New `WithCertBadges` story; assert badge text visible         | New story needed             |
| CARD-04 | "More info" button absent                                       | Storybook play  | `queryByRole('link', { name: /more info/i })` not in document | Update existing Default play |
| CARD-05 | Two-zone layout: identity top, purchase bottom                  | Visual / manual | Storybook visual check                                        | Existing stories             |
| CARD-06 | No QuantityStepper in collection card context                   | Storybook play  | `queryByRole('spinbutton')` not in document in Default story  | Update existing Default play |
| CARD-07 | Stories cover eyebrow, badges, no-eyebrow, sold-out, no-stepper | Storybook story | New stories: WithCertBadges, NoBrandingInfo                   | New stories needed           |

### Wave 0 Gaps

- Update `Default` and `MultiVariant` story play assertions — currently assert `spinbutton` visible, must change to assert absent (after `showQuantity={false}`)
- New story: `WithCertBadges` — tags `['Organic', 'ACO Certified']`, assert badge text renders
- New story: `NoBrandingInfo` — empty `productType: ''`, plain tags `['Wholesale']`, assert eyebrow absent
- The `SoldOut` story already covers no-purchase-form case; verify "More info" assertion is updated too

---

## Security Domain

Step 2.6 security: this phase renders user-supplied strings from Shopify (`productType`, `tags`) as text content in JSX — React's default escaping prevents XSS. No new form surfaces, no new API calls, no new auth boundaries. No ASVS category applies beyond V5 input handling, which React handles at the framework level.

---

## Sources

### Primary (HIGH confidence)

- `src/components/collection/product-card/product-card.tsx` — verified current component structure, image widths, More info button, existing layout
- `src/components/collection/product-card/product-purchase-form.tsx` — verified QuantityStepper location (lines 98–107), existing prop surface
- `src/components/collection/product-card/product-card.stories.tsx` — verified stub fixture (productType, tags), existing play assertions
- `src/components/ui/badge/badge.tsx` — verified `BadgeVariant` union, `children` omitted, `type-eyebrow` base class, `labels` map, existing variants
- `src/lib/shopify/types/index.ts` — verified `CollectionProductSummary` has `productType: string` and `tags: string[]`
- `src/app/globals.css` — verified `type-eyebrow` utility at lines 392–399 (0.75rem, font-weight 600, letter-spacing 0.08em, uppercase), `text-muted` token
- `.planning/phases/08-optimized-collection-quick-add/08-01-SUMMARY.md` — verified Phase 8 restored `ProductPurchaseForm` inline; confirmed `More info` remains for all products; confirmed QuantityStepper renders inline

### Secondary (MEDIUM confidence)

- `AGENTS.md` — project architecture, Next.js 16 / React 19 / Tailwind 4 confirmed
- `CLAUDE.md` / `docs/conventions.md` — confirmed `cn()` requirement, no default exports, token class names only

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all relevant files read directly from codebase
- Architecture: HIGH — component boundaries verified, no new infrastructure
- Pitfalls: HIGH — all four pitfalls derived from verified file contents (lines cited)
- Badge variant decision: HIGH — Badge source code confirms the constraint; inline span recommendation is certain

**Research date:** 2026-06-03
**Valid until:** 60 days (stable component codebase, no external dependencies)
