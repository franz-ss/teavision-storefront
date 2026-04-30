# Collection Page — Full Products Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show all Shopify collection products (up to 250) on `/collections/[handle]` with a compact header, breadcrumb, product count, sort toolbar, 4-col grid, and empty state.

**Architecture:** Two file changes only. Bump `getCollectionProducts` default limit to 250. Restructure the `CollectionContent` component in the page to add breadcrumb nav, a toolbar row (count + sort separated by a top border), a 4-col grid, and an empty state. No new components.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 4, Shopify Storefront GraphQL API, `'use cache'` directive

---

## File Map

| File | Change |
|---|---|
| `lib/shopify/operations/collection.ts` | Bump `first` default `24` → `250` |
| `app/(storefront)/collections/[handle]/page.tsx` | Add `Link` import; restructure `CollectionContent` return |

---

### Task 1: Bump collection product fetch limit

**Files:**
- Modify: `lib/shopify/operations/collection.ts`

- [ ] **Step 1: Edit the default parameter**

Open `lib/shopify/operations/collection.ts`. Find the `getCollectionProducts` function signature (currently line ~75):

```ts
export async function getCollectionProducts(
  handle: string,
  first = 24,
  sortKey = 'COLLECTION_DEFAULT',
  reverse = false,
): Promise<ProductSummary[]> {
```

Change `first = 24` to `first = 250`:

```ts
export async function getCollectionProducts(
  handle: string,
  first = 250,
  sortKey = 'COLLECTION_DEFAULT',
  reverse = false,
): Promise<ProductSummary[]> {
```

- [ ] **Step 2: Verify lint passes**

```bash
pnpm run lint
```

Expected: no errors or warnings related to this file.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/operations/collection.ts
git commit -m "feat: bump collection product fetch limit to 250"
```

---

### Task 2: Restructure collection page — breadcrumb, toolbar, grid, empty state

**Files:**
- Modify: `app/(storefront)/collections/[handle]/page.tsx`

- [ ] **Step 1: Add `Link` import**

The file currently imports from `next/navigation` but not `next/link`. Add it. The updated imports block at the top of the file:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import {
  getCollection,
  getCollectionProducts,
} from '@/lib/shopify/operations/collection'
import { SortSelect } from '@/components/collection'
import { ProductCard } from '@/components/ui'
```

- [ ] **Step 2: Verify lint on the import change**

```bash
pnpm run lint
```

Expected: no errors. (`import/order` requires a blank line between the `next/*` group and the `@/` internal group — which is already present above.)

- [ ] **Step 3: Replace the `CollectionContent` return value**

Find the `return (` inside `CollectionContent` (currently after the `breadcrumbJsonLd` definition). Replace the entire return statement with:

```tsx
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> › </span>
        <Link href="/collections/all">Collections</Link>
        <span aria-hidden="true"> › </span>
        <span>{collection.title}</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold">{collection.title}</h1>
      {collection.description && (
        <p className="text-text-muted mb-0">{collection.description}</p>
      )}

      <div className="border-border mt-4 mb-6 flex items-center justify-between border-t pt-3">
        <span className="text-text-muted text-sm">{products.length} products</span>
        <Suspense fallback={null}>
          <SortSelect currentSort={sort} />
        </Suspense>
      </div>

      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4" role="list">
        {products.length === 0 ? (
          <li className="col-span-full py-16 text-center text-text-muted">
            No products in this collection yet.
          </li>
        ) : (
          products.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} priority={i === 0} />
            </li>
          ))
        )}
      </ul>
    </>
  )
```

Also update the `getCollectionProducts` call inside `CollectionContent` to pass `250` explicitly (so the call site is clear regardless of the default):

```tsx
  const [collection, products] = await Promise.all([
    getCollection(handle),
    getCollectionProducts(handle, 250, sortKey, reverse),
  ])
```

- [ ] **Step 4: Verify lint passes**

```bash
pnpm run lint
```

Expected: no errors or new warnings.

- [ ] **Step 5: Visual check — start dev server**

```bash
pnpm run dev
```

Open `http://localhost:3000/collections/black-tea` (or any valid handle from the Shopify store).

Verify:
- Breadcrumb shows: `Home › Collections › [Collection Title]`
- Title and description render below breadcrumb
- Toolbar row shows product count on the left and sort dropdown on the right, separated by a thin top border
- Grid shows 4 columns on a wide screen, 3 on tablet, 2 on mobile
- Products render correctly with images and prices

If `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is not set, stub data will be used (8 placeholder products). Breadcrumb, toolbar, and grid layout are still fully testable with stubs.

- [ ] **Step 6: Verify empty state (optional — only if you have a collection with no products)**

If you have access to a collection handle with 0 products, navigate to it and confirm the message "No products in this collection yet." appears centred in the page.

If not, read the conditional in the JSX and confirm it's `products.length === 0` — that's sufficient.

- [ ] **Step 7: Commit**

```bash
git add app/\(storefront\)/collections/\[handle\]/page.tsx
git commit -m "feat: collection page — breadcrumb, product count, toolbar, 4-col grid, empty state"
```
