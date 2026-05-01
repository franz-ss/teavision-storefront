# Product Detail Page (PDP) Redesign

**Date:** 2026-05-01
**Scope:** Fetch product images + options from Shopify, implement Embla gallery (main image + thumbnail strip), fix variant label, update price on variant select, add breadcrumb UI, restructure to two-column layout
**Driver:** All product details displayed properly — gallery, real variant options, correct pricing

---

## Problem

The current PDP:
- Shows only `featuredImage` — no multi-image gallery
- Hardcodes "Size" as the variant option label
- Shows `priceRange.minVariantPrice` always — doesn't update when a variant is selected
- Has no breadcrumb UI (only JSON-LD)
- `VariantSelector` component is dead code (never used)
- Layout is a basic 2-col grid with no image emphasis

## Solution

Approach A — core fix:
1. Fetch `images` array and `options` from Shopify
2. New `ProductGallery` client component: Embla carousel (main image) + thumbnail strip (fills full width, maintains aspect ratio)
3. Fix `ProductForm`: real option label + price updates when variant selected
4. Restructure page: breadcrumb above, left col = gallery, right col = sticky detail panel
5. Delete `VariantSelector` (dead code)

---

## Layout

```
[Home › Products › Earl Grey Supreme]         ← breadcrumb, above grid

┌──── Left col ────────────────┐  ┌── Right col (sticky) ──────┐
│  [Main image — 4:3]          │  │  Earl Grey Supreme          │
│                              │  │  $14.00                     │
│  [thumb][thumb][thumb][thumb]│  │                             │
│   ← fills full width, 1:1 → │  │  Weight                     │
└──────────────────────────────┘  │  [50g] [100g ✓] [200g]      │
                                  │                             │
                                  │  [Add to Cart]              │
                                  │                             │
                                  │  Description text…          │
                                  └─────────────────────────────┘
```

**Desktop:** `grid-cols-1 lg:grid-cols-[1fr_400px]`, right col `sticky top-8`
**Mobile:** single column, gallery first then details

---

## Data Changes

### `lib/shopify/types/index.ts`

Add `ProductOption` type:
```ts
export type ProductOption = {
  name: string
  values: string[]
}
```

Update `Product` type — add `images` and `options`, remove `featuredImage`:
```ts
export type Product = {
  id: string
  handle: string
  title: string
  description: string
  images: ShopifyImage[]          // replaces featuredImage
  priceRange: { minVariantPrice: Money }
  variants: ProductVariant[]
  options: ProductOption[]
}
```

`ProductSummary` and `featuredImage` on `ShopifyImage` are unchanged — collection grid cards are not affected.

### `lib/shopify/operations/product.ts`

Add to `GET_PRODUCT_QUERY`:
```graphql
images(first: 10) {
  edges {
    node {
      url
      altText
      width
      height
    }
  }
}
options {
  name
  values
}
```

Remove `featuredImage` from `GET_PRODUCT_QUERY` (covered by `images[0]`).

Update `ShopifyProductNode` type to include `images` edges and `options`.

Update `reshapeProduct` to flatten `images.edges[].node` into `images: ShopifyImage[]`.

Update `STUB_PRODUCT` to include `images: []` and `options: [{ name: 'Weight', values: ['250g', '1kg', '5kg'] }]`.

Update `generateMetadata` in `page.tsx` to use `product.images[0]?.url` instead of `product.featuredImage?.url`.

---

## Component Changes

### New: `components/product/product-gallery.tsx`

Client component (`'use client'`). Uses Embla Carousel.

**Props:**
```ts
type ProductGalleryProps = {
  images: ShopifyImage[]
  title: string
}
```

**Behaviour:**
- Embla instance on main image area
- Main image: `aspect-ratio: 4/3`, `object-cover`, full width
- Thumbnail strip: `grid-template-columns: repeat(N, 1fr)` where N = `images.length` (capped at 8 for display), `gap-2`, each thumbnail `aspect-square object-cover`
- Clicking a thumbnail calls `emblaApi.scrollTo(index)`
- Active thumbnail: `ring-2 ring-primary` highlight
- If `images.length === 0`: render a `bg-surface aspect-[4/3]` placeholder div
- No dots/arrows — thumbnails serve as navigation

**Install:** `pnpm add embla-carousel-react`

**Export** via `components/product/index.ts` barrel.

---

### Modified: `components/product/product-form.tsx`

**New props:**
```ts
type ProductFormProps = {
  variants: ProductVariant[]
  options: ProductOption[]
}
```

**Changes:**
1. **Variant label**: replace hardcoded `<legend>Size</legend>` with `<legend>{options[0]?.name ?? 'Option'}</legend>`
2. **Price display**: add `<Price>` inside this component showing the selected variant's price. Derive it as:
   ```ts
   const selectedVariant = variants.find((v) => v.id === selectedVariantId)
   ```
   Render `<Price price={selectedVariant.price} size="lg" />` above the variant selector. This replaces the `<Price>` currently rendered in `page.tsx`.
3. **`cn()` for className**: replace the template-string className on variant buttons with `cn()` from `@/lib/utils`

---

### Modified: `app/(storefront)/products/[handle]/page.tsx`

**Changes:**
1. Remove `Image` import (gallery component handles this)
2. Remove `Price` import (now inside `ProductForm`)
3. Add `Link` import from `next/link`
4. Add `ProductGallery` import
5. Add breadcrumb `<nav>` above the grid (same pattern as collection page)
6. Replace grid with two-column layout:
   - Left: `<ProductGallery images={product.images} title={product.title} />`
   - Right: `<div className="lg:sticky lg:top-8 flex flex-col gap-4">` containing title `<h1>`, `<ProductForm variants={product.variants} options={product.options} />`, description `<p>`
7. Pass `options={product.options}` to `<ProductForm>`
8. Update `generateMetadata` to use `product.images[0]?.url`

**JSON-LD structured data**: update `productJsonLd` image field to use `product.images[0]?.url`

---

### Deleted: `components/product/variant-selector.tsx`

Dead code — never imported or used. Delete the file.

Update `components/product/index.ts` to remove any `VariantSelector` export if present.

---

## className Convention

All `className` composition in touched files uses `cn()` from `@/lib/utils`. No `array.filter(Boolean).join(' ')` or template string concatenation.

---

## What This Does NOT Include

- Per-variant image swapping (selecting a variant does not change the gallery)
- Product tags or vendor display
- Metafields (brewing instructions, origin, steeping time)
- Image zoom / lightbox
- Related products
