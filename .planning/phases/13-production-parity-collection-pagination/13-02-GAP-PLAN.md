# Product Grid Anchor Offset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Phase 13 UAT gap 2 so collection pager navigation lands with the product grid visible below the sticky header.

**Architecture:** Keep pagination href generation unchanged and fix the fragment target. Move `id="product-grid"` onto the actual product grid `<ul>` and add a responsive Tailwind scroll-margin offset sized for the sticky storefront header. Extend the existing `ProductList` unit test so coverage checks both the fragment href and the target offset.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, Tailwind 4 utilities, Vitest server-rendered component tests.

---

### Task 1: Cover the Anchor Offset

**Files:**
- Modify: `src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx`

- [ ] **Step 1: Update the existing D-26 test**

Replace the existing test named `pager links include the product-grid anchor for scroll-to-grid (D-26)` with:

```tsx
  it('pager links include the product-grid anchor and target offset for scroll-to-grid (D-26)', () => {
    const html = renderToStaticMarkup(
      <ProductList
        products={[product]}
        currentPage={2}
        totalPages={5}
        buildPageHref={(page) => `/collections/all?page=${page}`}
      />,
    )

    expect(html).toContain('#product-grid')
    expect(html).toContain('id="product-grid"')
    expect(html).toContain('scroll-mt-24')
    expect(html).toContain('lg:scroll-mt-32')
  })
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
pnpm test:unit src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx
```

Expected: FAIL because the rendered target does not yet include `scroll-mt-24` or `lg:scroll-mt-32`.

### Task 2: Offset the Fragment Target

**Files:**
- Modify: `src/app/(storefront)/collections/[handle]/_components/product-list.tsx`

- [ ] **Step 1: Move the anchor id onto the grid and add scroll margin**

Change the product-list markup from:

```tsx
    <div>
      {/* Anchor target for scroll-to-grid on pager clicks (D-26) */}
      <div id="product-grid" />
      <ul
        className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4.5 sm:gap-y-5.5 lg:grid-cols-3"
        role="list"
      >
```

to:

```tsx
    <div>
      <ul
        id="product-grid"
        className="grid scroll-mt-24 grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4.5 sm:gap-y-5.5 lg:scroll-mt-32 lg:grid-cols-3"
        role="list"
      >
```

- [ ] **Step 2: Run the focused test to verify it passes**

Run:

```bash
pnpm test:unit src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx
```

Expected: PASS.

### Task 3: Verify the User Flow

**Files:**
- Verify: `src/app/(storefront)/collections/[handle]/_components/product-list.tsx`

- [ ] **Step 1: Run lint and unit coverage**

Run:

```bash
pnpm lint
pnpm test:unit src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx
```

Expected: both commands pass.

- [ ] **Step 2: Manually verify desktop and mobile pager navigation**

Run:

```bash
pnpm dev
```

Open:

```txt
http://localhost:3000/collections/all
```

Click a numbered pager link and confirm the URL changes to a `?page=N#product-grid` URL and the top row of product cards is visible below the sticky header. Repeat at 375px and 1280px viewport widths.

- [ ] **Step 3: Commit the fix**

Run:

```bash
git add src/app/(storefront)/collections/[handle]/_components/product-list.tsx src/app/(storefront)/collections/[handle]/_components/product-list.test.tsx
git commit -m "fix(13): offset collection pagination grid anchor"
```

Expected: commit succeeds after tests pass.

## Self-Review

- Spec coverage: Covers Phase 13 D-26 scroll-to-grid behavior and preserves existing `?page=N#product-grid` hrefs.
- Placeholder scan: No placeholders remain.
- Type consistency: No new types or component APIs are introduced.
