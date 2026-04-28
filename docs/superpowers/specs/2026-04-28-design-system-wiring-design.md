# Design System Wiring — Design Spec

**Date:** 2026-04-28
**Status:** Approved
**Scope:** Wire the four UI primitives (Button, Price, Badge, ProductCard) into the existing storefront pages. Pure substitution — no new components, no new routes.

---

## What Changes

### globals.css — body background

Add `body` rule so the cream background token is immediately visible:

```css
body {
  background: var(--color-background);
  color: var(--color-text);
}
```

### components/product/product-form.tsx

Replace the inline add-to-cart `<button>` with `<Button variant="primary" isLoading={isPending}>`. Import `Button` from `@/components/ui/button`.

### app/(storefront)/page.tsx

Replace the 4× inline product card markup (`<a href="#" className="group block...">`) with `<ProductCard product={...}>`. Import `ProductCard` from `@/components/ui/product-card`.

The existing grid uses `[1,2,3,4].map()` — replace this with a `STUB_PRODUCTS` array typed as `ProductSummary[]` so `<ProductCard>` receives the correct shape. Stub data mirrors the same pattern used in `lib/shopify/operations/collection.ts`.

### app/(storefront)/products/[handle]/page.tsx

Replace `{product.priceRange.minVariantPrice.currencyCode} {product.priceRange.minVariantPrice.amount}` with `<Price price={product.priceRange.minVariantPrice} size="lg">`. Import `Price` from `@/components/ui/price`.

### app/(storefront)/collections/[handle]/page.tsx

Replace the inline product card markup inside `products.map()` with `<ProductCard product={...}>`. Import `ProductCard` from `@/components/ui/product-card`. Pass `priority` to the first card (index 0) for LCP.

### app/(storefront)/cart/page.tsx

Replace the "Remove" `<button>` with `<Button variant="ghost" size="sm">`. Import `Button` from `@/components/ui/button`. All other interactive elements in the cart (quantity +/- submit buttons, checkout `<a>`, continue shopping `<Link>`) are navigation or have specialized shapes — leave unchanged.

---

## What Does NOT Change

- Hero "Shop All Products" `<a>` — navigation link, not an action button
- Category cards `<a>` — navigation
- Cart checkout `<a href={checkoutUrl}>` — external navigation to Shopify
- Cart "Continue shopping" `<Link>` — navigation
- Cart quantity +/− `<button type="submit">` — specialized square shape, form submit

---

## Success Criteria

- `pnpm exec tsc --noEmit` passes
- `pnpm build` passes
- `pnpm dev` — home page shows cream background, sage green buttons, product cards with tokens applied
- No inline `bg-black`, `bg-gray-50`, `text-gray-600` patterns remaining in the five updated files
