# Teavision Design System — Design Spec

**Date:** 2026-04-28
**Status:** Approved
**Scope:** Design tokens + four UI primitives + Storybook setup. Replaces inline Tailwind class repetition in wireframe pages.

---

## Palette

Sand/sage green, muted, low contrast. Placeholder values — swap for real brand assets when available.

| Token | Value | Use |
|---|---|---|
| `--color-background` | `#F5F0E8` | Page background |
| `--color-surface` | `#EDE8DE` | Cards, input backgrounds |
| `--color-border` | `#D4C9B0` | Borders, dividers |
| `--color-primary` | `#6B7C5A` | CTAs, active states, sale badge |
| `--color-primary-hover` | `#5A6B4A` | Primary button hover |
| `--color-text` | `#3D3D35` | Body text |
| `--color-text-muted` | `#7A7868` | Secondary text, placeholders |
| `--color-destructive` | `#8B4A42` | Errors, remove actions, out-of-stock badge |

All tokens defined in `app/globals.css` inside `:root`. No hex values in component files.

---

## Storybook Setup

**Package:** `@storybook/nextjs` (Storybook 8)
**Addons:** `@storybook/addon-essentials` (bundled), `@storybook/addon-a11y`
**Config location:** `.storybook/main.ts` and `.storybook/preview.ts`
**Stories location:** `components/ui/*.stories.tsx`

`preview.ts` imports `app/globals.css` so token variables and base styles are present in every story. Storybook background set to `--color-background`.

**Scripts added to `package.json`:**
- `"storybook": "storybook dev -p 6006"` — dev server
- `"build-storybook": "storybook build"` — static build

---

## File Structure

```
components/ui/
  button.tsx              # Button primitive
  button.stories.tsx
  price.tsx               # Price display
  price.stories.tsx
  badge.tsx               # Status badge
  badge.stories.tsx
  product-card.tsx        # Product card (links to PDP)
  product-card.stories.tsx
.storybook/
  main.ts
  preview.ts
```

No `index.ts` barrel file. Import directly from the file path.

---

## Components

### Button `'use client'`

Handles `onClick` and `isLoading` state — must be a Client Component. `Price`, `Badge`, and `ProductCard` are Server Components (purely presentational, no interactivity).

```typescript
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}
```

- Default `type="button"` — pass `type="submit"` explicitly
- `isLoading` shows spinner, disables button, sets `aria-label` to `"Loading…"` if no children override
- `variant="primary"` — `--color-primary` fill, cream text
- `variant="secondary"` — transparent fill, `--color-primary` border and text
- `variant="ghost"` — no border, `--color-text-muted` text
- All interactive states via CSS: `hover:`, `focus-visible:ring-2`, `disabled:opacity-50`
- Forwards `ref` (use `React.forwardRef`)

**Stories:** default, all variants, all sizes, loading state, disabled, as submit button.

### Price

```typescript
type PriceProps = {
  price: Money          // { amount: string; currencyCode: string }
  compareAtPrice?: Money
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

- Renders `{currencyCode} {amount}` (e.g. `AUD 18.00`)
- `compareAtPrice` renders struck-through in `--color-text-muted`, sale price in `--color-primary`
- `font-variant-numeric: tabular-nums` so prices align in grids
- No currency formatting library — `amount` is already a string from Shopify

**Stories:** standard price, sale price with compare, large size, small size.

### Badge

```typescript
type BadgeProps = {
  variant: 'outOfStock' | 'sale' | 'new'
  className?: string
}
```

- `outOfStock` — muted terracotta background (`#E8DDD5`), `--color-destructive` text
- `sale` — muted green background (`#D8E2D0`), `--color-primary-hover` text
- `new` — `--color-border` background, `--color-text-muted` text
- All caps, small, tight tracking — not a button, no interactive state

**Stories:** all three variants side by side.

### ProductCard

```typescript
type ProductCardProps = {
  product: ProductSummary   // from lib/shopify/types
  badge?: 'outOfStock' | 'sale' | 'new'
  priority?: boolean        // next/image priority prop for above-fold cards
}
```

- Renders as `<Link href="/products/{handle}">` — full card is clickable
- Image: `next/image` when `featuredImage` is present with non-null dimensions; grey placeholder div otherwise
- Title, price (via `<Price>`)
- Optional `<Badge>` in top-left corner of image area
- Hover state: `--color-primary` border
- `focus-visible:ring-2` on the Link

**Stories:** with image, without image, with each badge variant, without badge.

---

## Token Usage in Existing Pages

After the design system is built, existing pages should be updated to use components:

| Current inline pattern | Replace with |
|---|---|
| `className="rounded bg-black px-6 py-3 font-medium text-white..."` | `<Button variant="primary">` |
| `{currencyCode} {amount}` | `<Price price={...}>` |
| Product card markup in home page + PLP | `<ProductCard product={...}>` |

This refactor is a separate task after the design system itself is built and reviewed in Storybook.

---

## Out of Scope

- MDX documentation pages
- Design token doc story page
- Input, Select, or other form primitives (added when forms are built)
- Cart-specific components (CartLine, QuantityControl)
- shadcn/ui
- Dark mode
