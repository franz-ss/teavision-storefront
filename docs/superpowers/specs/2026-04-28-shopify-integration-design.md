# Teavision Storefront — Shopify Integration Design

**Date:** 2026-04-28
**Status:** Approved
**Scope:** Connect the wireframe storefront to Shopify's Storefront API — products, collections, cart, and checkout redirect. Stub data used until real credentials are available; swapping in live data requires only an env var change.

---

## Approach

Option A: thin `shopifyFetch<T>` wrapper + GraphQL Codegen + env-gated stubs.

A single typed fetch primitive wraps all Shopify API calls. GraphQL operations are defined as `.graphql` files and typed by Codegen from the public Shopify schema (no live credentials needed to run codegen). Each operation function returns stub data when `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is absent, and real Shopify data when it is present. No page component changes are required to switch between modes.

Shopify's official `@shopify/storefront-api-client` SDK was considered and rejected for this phase: it pairs poorly with GraphQL Codegen's type generation and makes the stub strategy harder to implement cleanly.

---

## GraphQL Codegen Setup

**Schema source:** Shopify's public Storefront API schema, pinned to version `2025-01`. Downloaded once via codegen introspection or from Shopify's published schema JSON. No live store credentials required.

**Config file:** `codegen.ts` at the project root. Documents: `lib/shopify/queries/**/*.graphql`. Output: `lib/shopify/types/generated.ts`. Preset: `@graphql-codegen/client-preset` — generates typed `DocumentNode` objects and operation result/variable types only. No React hooks, no Apollo, no urql.

**pnpm script:** `"codegen": "graphql-codegen"` — run once at setup, re-run when queries change.

**API version:** `2025-01` pinned in both `codegen.ts` and `client.ts`. Never use `unstable`.

---

## File Structure

```
lib/shopify/
  client.ts               # shopifyFetch<T> — single HTTP primitive
  operations/
    product.ts            # getProduct, getProducts
    collection.ts         # getCollection, getCollectionProducts
    cart.ts               # getCart, createCart, addToCart, updateCartLine, removeCartLine
  queries/
    product.graphql
    collection.graphql
    cart.graphql
  types/
    generated.ts          # codegen output — never edit manually
    index.ts              # hand-written domain types: Product, Collection, Cart, CartLine

lib/cart/
  actions.ts              # 'use server' cart server actions (replaces stub)
```

**No barrel exports.** Page components import from `lib/shopify/operations/product` directly, never from `lib/shopify/index`.

---

## Shopify Client (`lib/shopify/client.ts`)

`shopifyFetch<T>` accepts a typed query document and variables. Sends a POST to:

```
https://{SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json
```

Headers: `Content-Type: application/json`, `X-Shopify-Storefront-Access-Token: {token}`.

Returns `{ data: T }` on success. Throws on network error, non-200 response, or GraphQL `errors` array. When `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is falsy, throws immediately so the operation function falls through to its stub branch.

---

## Domain Types (`lib/shopify/types/index.ts`)

Hand-written flat types that the rest of the app imports. Operation functions map raw Shopify GraphQL responses to these shapes. No page component imports from `generated.ts`.

```typescript
type Money = { amount: string; currencyCode: string }

type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: Money
}

type Product = {
  id: string
  handle: string
  title: string
  description: string
  featuredImage: { url: string; altText: string | null; width: number; height: number } | null
  priceRange: { minVariantPrice: Money }
  variants: ProductVariant[]
}

type Collection = {
  handle: string
  title: string
  description: string
}

type CartLine = {
  id: string
  quantity: number
  merchandise: { product: Pick<Product, 'handle' | 'title' | 'featuredImage'>; title: string; price: Money }
}

type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { totalAmount: Money; subtotalAmount: Money }
  lines: CartLine[]
}
```

---

## GraphQL Queries

**`product.graphql`** — fetches: `handle`, `title`, `description`, `featuredImage` (url, altText, width, height), `priceRange.minVariantPrice`, `variants` (id, title, availableForSale, price).

**`collection.graphql`** — fetches: `handle`, `title`, `description`, `products(first: 24)` — each product: id, handle, title, featuredImage, priceRange.

**`cart.graphql`** — five operations: `GetCart`, `CartCreate`, `CartLinesAdd`, `CartLinesUpdate`, `CartLinesRemove`. Each returns the full cart fragment: id, checkoutUrl, totalQuantity, cost, lines with merchandise details. `CartLinesUpdate` handles quantity changes; `CartLinesRemove` handles deletion — Shopify does not remove lines when quantity is set to 0 via update.

---

## Operation Functions

Each operation in `lib/shopify/operations/` follows this pattern:

```typescript
export async function getProduct(handle: string): Promise<Product | null> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_PRODUCT  // hardcoded stub matching the Product type
  }
  const { data } = await shopifyFetch<GetProductQuery>({
    query: GetProductDocument,
    variables: { handle },
  })
  return data.product ? reshapeProduct(data.product) : null
}
```

`reshape*` functions map raw Shopify GraphQL response objects to domain types. They live in the same file as the operation.

---

## Cart Server Actions (`lib/cart/actions.ts`)

All functions are `'use server'`. `cartId` stored in an HTTP-only cookie named `teavision_cart`.

| Function | Behaviour |
|---|---|
| `getCart()` | Reads cookie → calls `getCart` operation → returns `Cart \| null` |
| `addToCart(variantId, quantity)` | Gets or creates cart → `CartLinesAdd` → returns `Cart` |
| `updateCartLine(lineId, quantity)` | `CartLinesUpdate` with new quantity → returns `Cart` |
| `removeCartLine(lineId)` | `CartLinesRemove` mutation → returns `Cart` |

**Stub mode:** when no token, `getCart()` returns hardcoded placeholder cart so the cart page renders during development.

**Error handling:**
- Expired cart (`getCart` returns null for a known cartId) → clear cookie, return null
- Variant unavailable → surface as a typed error, not an unhandled exception
- Out of stock → same
- Network error → bubble up to the Server Component, show error UI

---

## Page Integration

**PDP** — `getProduct(handle)` replaces the hardcoded stub in `ProductContent`. `VariantSelector` receives real `variants` from the product. Add-to-cart button calls `addToCart` as a form action (no `onClick`). The `'use cache'` / `cacheTag` / `cacheLife` structure is unchanged.

**PLP** — `getCollection(handle)` and `getCollectionProducts(handle)` replace hardcoded stubs in `CollectionContent`. Product grid renders real products with `next/image` using Shopify CDN URLs. Filter sidebar remains a placeholder — Shopify native filters deferred post-POC.

**Cart page** — `getCart()` called at the top of the Server Component. Empty state shown when cart is null or `totalQuantity === 0`. Quantity controls call `updateCartLine` / `removeCartLine` as form actions. Checkout CTA: `<a href={cart.checkoutUrl}>`.

**Image handling:** `next/image` with `cdn.shopify.com` remote pattern (already configured). Shopify image width transforms via URL param (`?width=800`) — no custom loader needed.

---

## Stub Data Strategy

Stub data is defined inline in each operation file, typed to match the domain type exactly. When `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is absent, operations return stubs immediately — no network call is made. Swapping to live data: populate `.env.local` with real credentials. No code changes required.

---

## POC Success Criteria

1. A real product (or stub mirroring real shape) renders on `/products/[handle]` — title, price, variants, image
2. A real collection renders on `/collections/[handle]` — product grid populated
3. Add a product to cart — `addToCart` server action fires, cart cookie set, cart page reflects the item
4. Quantity controls work — update and remove modify the cart
5. Checkout CTA links to `cart.checkoutUrl` — lands on Shopify hosted checkout with correct line items

---

## Out of Scope

- Vercel preview deployment (separate step after local validation)
- Collection filter UI (deferred post-POC)
- Cart drawer (deferred)
- Authentication (Customer Account API)
- Webhook-driven cache revalidation
- Playwright E2E tests (Phase 5)
- Admin API usage
- Search
