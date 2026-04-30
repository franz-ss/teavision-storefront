# Collection Page — Full Products Design

**Date:** 2026-05-01
**Scope:** `/collections/[handle]` page — show all products, add breadcrumb UI, product count, empty state, 4-col grid
**Driver:** Show all products from the real Shopify store; improve page layout

---

## Problem

The current `/collections/[handle]` page:
- Fetches only 24 products — misses most of the catalogue
- Has no breadcrumb UI (only JSON-LD structured data)
- Has no product count display
- Has no empty state
- Grid tops out at 3 cols; doesn't use wider screens

## Solution

Fetch up to 250 products (Shopify's max per request). No pagination UI needed for a tea catalogue of this size. Restructure the header to **Option B** layout: compact header block (title + description), thin rule, toolbar row (count left, sort right). Expand grid to 4 cols on large screens. Add breadcrumb UI and empty state.

---

## Page Layout

```
[breadcrumb]  Home › Collections › Black Tea

[title]       Black Tea
[description] Premium black teas sourced from Assam, Darjeeling…

              ─────────────────────────────────────────────────
[toolbar]     48 products                          Sort by ▾

[grid]        □  □  □  □   (4 cols lg, 3 cols sm, 2 cols base)
              □  □  □  □
              …

[empty]       "No products in this collection yet."
              (centred, muted — shown only when products.length === 0)
```

---

## File Changes

### 1. `lib/shopify/operations/collection.ts`

Change default `first` parameter: `24` → `250`. One line.

### 2. `app/(storefront)/collections/[handle]/page.tsx`

In `CollectionContent`:

- Pass `first={250}` explicitly to `getCollectionProducts`
- Replace the current header block with:
  - **Breadcrumb** — `<nav aria-label="Breadcrumb">` with inline `<Link>` elements and `›` separators, muted text
  - **Title** — `<h1>` unchanged in level, styled `text-2xl font-bold`
  - **Description** — `<p>` muted, below title
  - **Toolbar row** — `border-t` div, flex, `{products.length} products` span left, `<SortSelect>` right
- Grid classes: add `lg:grid-cols-4` to existing `grid-cols-2 sm:grid-cols-3`
- Empty state: when `products.length === 0`, render a `<p>` inside the grid with `col-span-full` instead of product cards

### 3. `ProductCard` — no changes

The existing card (square image, `bg-surface` info block, `border-border` border) already matches the Option B card style. No new layout prop needed.

---

## Component Snippets

**Breadcrumb:**
```tsx
<nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
  <Link href="/">Home</Link>
  <span aria-hidden="true"> › </span>
  <Link href="/collections/all">Collections</Link>
  <span aria-hidden="true"> › </span>
  <span>{collection.title}</span>
</nav>
```

**Toolbar row:**
```tsx
<div className="border-t border-border mt-4 pt-3 mb-6 flex items-center justify-between">
  <span className="text-sm text-text-muted">{products.length} products</span>
  <Suspense fallback={null}>
    <SortSelect currentSort={sort} />
  </Suspense>
</div>
```

**Empty state (inside grid `<ul>`):**
```tsx
{products.length === 0 && (
  <li className="col-span-full py-16 text-center text-text-muted">
    No products in this collection yet.
  </li>
)}
```

---

## What This Does NOT Include

- Pagination or "load more"
- Facet filters (origin, caffeine, format, etc.)
- Collection hero image
- Changes to ProductCard
