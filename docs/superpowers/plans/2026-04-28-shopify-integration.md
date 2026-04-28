# Shopify Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the wireframe storefront to Shopify's Storefront API with env-gated stub data so development continues without live credentials.

**Architecture:** A single `shopifyFetch<T>` primitive wraps all API calls. GraphQL operations live in `lib/shopify/operations/` and check `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — returning stub data when absent and calling the real API when present. Cart state is managed via an HTTP-only cookie. No page component changes are required to switch from stub to live.

**Tech Stack:** Next.js 16.2.4, TypeScript, pnpm, GraphQL (plain string queries), `@graphql-codegen/cli` + `@graphql-codegen/client-preset` (configured but not run until credentials arrive), Next.js Server Actions

---

## File Map

| File                                             | Action       | Purpose                                                                       |
| ------------------------------------------------ | ------------ | ----------------------------------------------------------------------------- |
| `package.json`                                   | Modify       | Add graphql + codegen deps and script                                         |
| `codegen.ts`                                     | Create       | Codegen config (runs when credentials arrive)                                 |
| `lib/shopify/client.ts`                          | Replace stub | `shopifyFetch<T>` HTTP primitive                                              |
| `lib/shopify/types/index.ts`                     | Create       | Hand-written domain types                                                     |
| `lib/shopify/queries/product.graphql`            | Create       | Product GraphQL queries                                                       |
| `lib/shopify/queries/collection.graphql`         | Create       | Collection GraphQL queries                                                    |
| `lib/shopify/queries/cart.graphql`               | Create       | Cart GraphQL queries + mutations                                              |
| `lib/shopify/operations/product.ts`              | Create       | `getProduct`, `getProducts` with stubs                                        |
| `lib/shopify/operations/collection.ts`           | Create       | `getCollection`, `getCollectionProducts` with stubs                           |
| `lib/shopify/operations/cart.ts`                 | Create       | `getCart`, `createCart`, `addCartLines`, `updateCartLines`, `removeCartLines` |
| `lib/cart/actions.ts`                            | Replace stub | `'use server'` cart actions                                                   |
| `components/product/product-form.tsx`            | Create       | Client Component — variant selector + add-to-cart                             |
| `app/(storefront)/products/[handle]/page.tsx`    | Modify       | Wire to `getProduct` + `ProductForm`                                          |
| `app/(storefront)/collections/[handle]/page.tsx` | Modify       | Wire to `getCollection` + `getCollectionProducts`                             |
| `app/(storefront)/cart/page.tsx`                 | Modify       | Wire to `getCartAction` + form actions                                        |

---

## Task 1: Install dependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Install graphql runtime and codegen packages**

```bash
pnpm add graphql
pnpm add -D @graphql-codegen/cli @graphql-codegen/client-preset
```

- [ ] **Step 2: Verify install**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install graphql and codegen dependencies"
```

---

## Task 2: Codegen config

**Files:**

- Create: `codegen.ts`

Note: This config is wired up now but `pnpm codegen` will only succeed once `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` are in `.env.local`. The `lib/shopify/types/generated.ts` file will not exist until then — operations in this plan use inline TypeScript types instead.

- [ ] **Step 1: Create codegen.ts**

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: {
    [`https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`]: {
      headers: {
        'X-Shopify-Storefront-Access-Token':
          process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? '',
      },
    },
  },
  documents: ['lib/shopify/queries/**/*.graphql'],
  generates: {
    'lib/shopify/types/generated.ts': {
      preset: 'client',
    },
  },
}

export default config
```

- [ ] **Step 2: Add codegen script to package.json**

In `package.json`, add to `"scripts"`:

```json
"codegen": "graphql-codegen"
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add codegen.ts package.json
git commit -m "chore: add GraphQL Codegen config (runs when credentials available)"
```

---

## Task 3: GraphQL queries

**Files:**

- Create: `lib/shopify/queries/product.graphql`
- Create: `lib/shopify/queries/collection.graphql`
- Create: `lib/shopify/queries/cart.graphql`

- [ ] **Step 1: Create lib/shopify/queries/product.graphql**

```graphql
query GetProduct($handle: String!) {
  product(handle: $handle) {
    id
    handle
    title
    description
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
}

query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        handle
        title
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```

- [ ] **Step 2: Create lib/shopify/queries/collection.graphql**

```graphql
query GetCollection($handle: String!) {
  collection(handle: $handle) {
    handle
    title
    description
  }
}

query GetCollectionProducts($handle: String!, $first: Int!) {
  collection(handle: $handle) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
}
```

- [ ] **Step 3: Create lib/shopify/queries/cart.graphql**

```graphql
fragment CartFields on Cart {
  id
  checkoutUrl
  totalQuantity
  cost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              handle
              title
              featuredImage {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
}

query GetCart($cartId: ID!) {
  cart(id: $cartId) {
    ...CartFields
  }
}

mutation CartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart {
      ...CartFields
    }
    userErrors {
      field
      message
    }
  }
}

mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFields
    }
    userErrors {
      field
      message
    }
  }
}

mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFields
    }
    userErrors {
      field
      message
    }
  }
}

mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      ...CartFields
    }
    userErrors {
      field
      message
    }
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/shopify/queries/
git commit -m "feat: add Shopify GraphQL query and mutation definitions"
```

---

## Task 4: Domain types

**Files:**

- Create: `lib/shopify/types/index.ts`

- [ ] **Step 1: Create lib/shopify/types/index.ts**

```typescript
export type Money = {
  amount: string
  currencyCode: string
}

export type ShopifyImage = {
  url: string
  altText: string | null
  width: number
  height: number
}

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: Money
}

export type Product = {
  id: string
  handle: string
  title: string
  description: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
  variants: ProductVariant[]
}

export type ProductSummary = {
  id: string
  handle: string
  title: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
}

export type Collection = {
  handle: string
  title: string
  description: string
}

export type CartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: Money
    product: {
      handle: string
      title: string
      featuredImage: ShopifyImage | null
    }
  }
}

export type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: Money
    subtotalAmount: Money
  }
  lines: CartLine[]
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/types/index.ts
git commit -m "feat: add Shopify domain types"
```

---

## Task 5: shopifyFetch client

**Files:**

- Replace: `lib/shopify/client.ts`

- [ ] **Step 1: Replace lib/shopify/client.ts**

```typescript
const SHOPIFY_API_VERSION = '2025-01'

type ShopifyFetchOptions<TVariables> = {
  query: string
  variables?: TVariables
  cache?: RequestCache
}

type ShopifyResponse<T> = {
  data: T
  errors?: Array<{ message: string }>
}

export async function shopifyFetch<T, TVariables = Record<string, unknown>>({
  query,
  variables,
  cache = 'no-store',
}: ShopifyFetchOptions<TVariables>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!domain || !token) {
    throw new Error('Missing Shopify credentials')
  }

  const response = await fetch(
    `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    },
  )

  if (!response.ok) {
    throw new Error(
      `Shopify API error: ${response.status} ${response.statusText}`,
    )
  }

  const json = (await response.json()) as ShopifyResponse<T>

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('\n'))
  }

  return json.data
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/client.ts
git commit -m "feat: add shopifyFetch typed HTTP primitive"
```

---

## Task 6: Product operations

**Files:**

- Create: `lib/shopify/operations/product.ts`

- [ ] **Step 1: Create lib/shopify/operations/product.ts**

```typescript
import { cacheLife, cacheTag } from 'next/cache'
import { shopifyFetch } from '@/lib/shopify/client'
import type {
  Money,
  Product,
  ProductSummary,
  ShopifyImage,
} from '@/lib/shopify/types'

const GET_PRODUCT_QUERY = /* GraphQL */ `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      featuredImage {
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

const GET_PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

type ShopifyProductNode = {
  id: string
  handle: string
  title: string
  description: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        availableForSale: boolean
        price: Money
      }
    }>
  }
}

type ShopifyProductSummaryNode = {
  id: string
  handle: string
  title: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
}

function reshapeProduct(p: ShopifyProductNode): Product {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: p.description,
    featuredImage: p.featuredImage,
    priceRange: p.priceRange,
    variants: p.variants.edges.map((e) => e.node),
  }
}

function reshapeProductSummary(p: ShopifyProductSummaryNode): ProductSummary {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    featuredImage: p.featuredImage,
    priceRange: p.priceRange,
  }
}

const STUB_PRODUCT: Product = {
  id: 'gid://shopify/Product/1',
  handle: 'english-breakfast',
  title: 'English Breakfast — Bulk Loose Leaf',
  description:
    'Premium Assam-based black tea blend. Available in 250g, 1kg, 5kg, and 10kg.',
  featuredImage: null,
  priceRange: { minVariantPrice: { amount: '18.00', currencyCode: 'AUD' } },
  variants: [
    {
      id: 'gid://shopify/ProductVariant/1',
      title: '250g',
      availableForSale: true,
      price: { amount: '18.00', currencyCode: 'AUD' },
    },
    {
      id: 'gid://shopify/ProductVariant/2',
      title: '1kg',
      availableForSale: true,
      price: { amount: '42.00', currencyCode: 'AUD' },
    },
    {
      id: 'gid://shopify/ProductVariant/3',
      title: '5kg',
      availableForSale: false,
      price: { amount: '180.00', currencyCode: 'AUD' },
    },
  ],
}

export async function getProduct(handle: string): Promise<Product | null> {
  'use cache'
  cacheTag('product', `product-${handle}`)
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_PRODUCT
  }

  const data = await shopifyFetch<{ product: ShopifyProductNode | null }>({
    query: GET_PRODUCT_QUERY,
    variables: { handle },
  })

  return data.product ? reshapeProduct(data.product) : null
}

export async function getProducts(first = 24): Promise<ProductSummary[]> {
  'use cache'
  cacheTag('product')
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return [reshapeProductSummary(STUB_PRODUCT)]
  }

  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProductSummaryNode }> }
  }>({
    query: GET_PRODUCTS_QUERY,
    variables: { first },
  })

  return data.products.edges.map((e) => reshapeProductSummary(e.node))
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/operations/product.ts
git commit -m "feat: add product operations with stub data fallback"
```

---

## Task 7: Collection operations

**Files:**

- Create: `lib/shopify/operations/collection.ts`

- [ ] **Step 1: Create lib/shopify/operations/collection.ts**

```typescript
import { cacheLife, cacheTag } from 'next/cache'
import { shopifyFetch } from '@/lib/shopify/client'
import type {
  Collection,
  Money,
  ProductSummary,
  ShopifyImage,
} from '@/lib/shopify/types'

const GET_COLLECTION_QUERY = /* GraphQL */ `
  query GetCollection($handle: String!) {
    collection(handle: $handle) {
      handle
      title
      description
    }
  }
`

const GET_COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            featuredImage {
              url
              altText
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`

type ShopifyCollectionNode = {
  handle: string
  title: string
  description: string
}

type ShopifyProductSummaryNode = {
  id: string
  handle: string
  title: string
  featuredImage: ShopifyImage | null
  priceRange: { minVariantPrice: Money }
}

const STUB_COLLECTION: Collection = {
  handle: 'black-tea',
  title: 'Black Tea',
  description:
    'Premium black teas sourced from Assam, Darjeeling, and Sri Lanka.',
}

const STUB_PRODUCTS: ProductSummary[] = Array.from({ length: 8 }, (_, i) => ({
  id: `gid://shopify/Product/${i + 1}`,
  handle: `product-placeholder-${i + 1}`,
  title: `Product Placeholder ${i + 1}`,
  featuredImage: null,
  priceRange: {
    minVariantPrice: { amount: '0.00', currencyCode: 'AUD' },
  },
}))

export async function getCollection(
  handle: string,
): Promise<Collection | null> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return { ...STUB_COLLECTION, handle }
  }

  const data = await shopifyFetch<{
    collection: ShopifyCollectionNode | null
  }>({
    query: GET_COLLECTION_QUERY,
    variables: { handle },
  })

  return data.collection
}

export async function getCollectionProducts(
  handle: string,
  first = 24,
): Promise<ProductSummary[]> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_PRODUCTS
  }

  const data = await shopifyFetch<{
    collection: {
      products: { edges: Array<{ node: ShopifyProductSummaryNode }> }
    } | null
  }>({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first },
  })

  if (!data.collection) return []

  return data.collection.products.edges.map((e) => ({
    id: e.node.id,
    handle: e.node.handle,
    title: e.node.title,
    featuredImage: e.node.featuredImage,
    priceRange: e.node.priceRange,
  }))
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/operations/collection.ts
git commit -m "feat: add collection operations with stub data fallback"
```

---

## Task 8: Cart operations

**Files:**

- Create: `lib/shopify/operations/cart.ts`

- [ ] **Step 1: Create lib/shopify/operations/cart.ts**

```typescript
import { shopifyFetch } from '@/lib/shopify/client'
import type { Cart, Money, ShopifyImage } from '@/lib/shopify/types'

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                handle
                title
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`

const GET_CART_QUERY = /* GraphQL */ `
  ${CART_FIELDS}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`

const CART_CREATE_MUTATION = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

type ShopifyCartLineNode = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: Money
    product: {
      handle: string
      title: string
      featuredImage: ShopifyImage | null
    }
  }
}

type ShopifyCart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { totalAmount: Money; subtotalAmount: Money }
  lines: { edges: Array<{ node: ShopifyCartLineNode }> }
}

type ShopifyUserError = { field: string[] | null; message: string }

function reshapeCart(cart: ShopifyCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    cost: cart.cost,
    lines: cart.lines.edges.map((e) => ({
      id: e.node.id,
      quantity: e.node.quantity,
      merchandise: e.node.merchandise,
    })),
  }
}

function handleUserErrors(errors: ShopifyUserError[]): void {
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join('\n'))
  }
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: 'no-store',
  })
  return data.cart ? reshapeCart(data.cart) : null
}

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: ShopifyUserError[] }
  }>({
    query: CART_CREATE_MUTATION,
    variables: { input: {} },
    cache: 'no-store',
  })
  handleUserErrors(data.cartCreate.userErrors)
  return reshapeCart(data.cartCreate.cart)
}

export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: ShopifyUserError[] }
  }>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  handleUserErrors(data.cartLinesAdd.userErrors)
  return reshapeCart(data.cartLinesAdd.cart)
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: ShopifyUserError[] }
  }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  })
  handleUserErrors(data.cartLinesUpdate.userErrors)
  return reshapeCart(data.cartLinesUpdate.cart)
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: ShopifyUserError[] }
  }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })
  handleUserErrors(data.cartLinesRemove.userErrors)
  return reshapeCart(data.cartLinesRemove.cart)
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/shopify/operations/cart.ts
git commit -m "feat: add cart operations (getCart, createCart, add/update/remove lines)"
```

---

## Task 9: Cart server actions

**Files:**

- Replace: `lib/cart/actions.ts`

- [ ] **Step 1: Replace lib/cart/actions.ts**

```typescript
'use server'

import { cookies } from 'next/headers'
import {
  getCart,
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
} from '@/lib/shopify/operations/cart'
import type { Cart } from '@/lib/shopify/types'

const CART_COOKIE = 'teavision_cart'

const STUB_CART: Cart = {
  id: 'stub-cart-1',
  checkoutUrl: '#',
  totalQuantity: 2,
  cost: {
    totalAmount: { amount: '102.00', currencyCode: 'AUD' },
    subtotalAmount: { amount: '102.00', currencyCode: 'AUD' },
  },
  lines: [
    {
      id: 'stub-line-1',
      quantity: 2,
      merchandise: {
        id: 'gid://shopify/ProductVariant/2',
        title: '1kg',
        price: { amount: '42.00', currencyCode: 'AUD' },
        product: {
          handle: 'english-breakfast',
          title: 'English Breakfast 1kg',
          featuredImage: null,
        },
      },
    },
    {
      id: 'stub-line-2',
      quantity: 1,
      merchandise: {
        id: 'gid://shopify/ProductVariant/4',
        title: '250g',
        price: { amount: '18.00', currencyCode: 'AUD' },
        product: {
          handle: 'chamomile',
          title: 'Chamomile 250g',
          featuredImage: null,
        },
      },
    },
  ],
}

async function getOrCreateCart(): Promise<Cart> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value

  if (cartId) {
    const cart = await getCart(cartId)
    if (cart) return cart
    cookieStore.delete(CART_COOKIE)
  }

  const cart = await createCart()
  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
  return cart
}

export async function getCartAction(): Promise<Cart | null> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_CART
  }
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) return null
  return getCart(cartId)
}

export async function addToCartAction(
  variantId: string,
  quantity: number,
): Promise<Cart> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_CART
  }
  const cart = await getOrCreateCart()
  return addCartLines(cart.id, [{ merchandiseId: variantId, quantity }])
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number,
): Promise<Cart> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_CART
  }
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) throw new Error('No cart found')
  return updateCartLines(cartId, [{ id: lineId, quantity }])
}

export async function removeCartLineAction(lineId: string): Promise<Cart> {
  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return STUB_CART
  }
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) throw new Error('No cart found')
  return removeCartLines(cartId, [lineId])
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/cart/actions.ts
git commit -m "feat: add cart server actions with stub fallback"
```

---

## Task 10: ProductForm client component

**Files:**

- Create: `components/product/product-form.tsx`

This component replaces the separate `VariantSelector` + add-to-cart button on the PDP. It manages selected variant state and calls `addToCartAction`.

- [ ] **Step 1: Create components/product/product-form.tsx**

```typescript
'use client'

import { useState, useTransition } from 'react'
import { addToCartAction } from '@/lib/cart/actions'
import type { ProductVariant } from '@/lib/shopify/types'

type ProductFormProps = {
  variants: ProductVariant[]
}

export function ProductForm({ variants }: ProductFormProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.find((v) => v.availableForSale)?.id ?? variants[0]?.id ?? '',
  )
  const [isPending, startTransition] = useTransition()

  function handleAddToCart() {
    if (!selectedVariantId) return
    startTransition(async () => {
      await addToCartAction(selectedVariantId, 1)
    })
  }

  if (variants.length === 0) {
    return (
      <div className="rounded border border-dashed p-4 text-sm text-gray-400">
        No variants available
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Size</legend>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={!v.availableForSale}
              aria-pressed={selectedVariantId === v.id}
              aria-label={`${v.title}${!v.availableForSale ? ', out of stock' : ''}`}
              onClick={() => setSelectedVariantId(v.id)}
              className={`rounded border px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                selectedVariantId === v.id
                  ? 'border-black bg-black text-white'
                  : 'hover:border-gray-800'
              }`}
            >
              {v.title}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        disabled={isPending || !selectedVariantId}
        aria-label={isPending ? 'Adding to cart…' : 'Add to cart'}
        onClick={handleAddToCart}
        className="rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
      >
        {isPending ? 'Adding…' : 'Add to Cart'}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/product/product-form.tsx
git commit -m "feat: add ProductForm client component (variant selector + add to cart)"
```

---

## Task 11: Wire PDP to real data

**Files:**

- Replace: `app/(storefront)/products/[handle]/page.tsx`

- [ ] **Step 1: Replace app/(storefront)/products/[handle]/page.tsx**

```typescript
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/shopify/operations/product'
import { ProductForm } from '@/components/product/product-form'

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: 'Product not found' }
  return { title: product.title }
}

async function ProductContent({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) notFound()

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div
        className="aspect-square rounded bg-gray-100"
        role="img"
        aria-label={
          product.featuredImage?.altText ?? `${product.title} image`
        }
      />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-xl font-semibold">
          {product.priceRange.minVariantPrice.currencyCode}{' '}
          {product.priceRange.minVariantPrice.amount}
        </p>

        <ProductForm variants={product.variants} />

        <p className="text-gray-600">{product.description}</p>
      </div>
    </div>
  )
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Suspense fallback={<div aria-live="polite">Loading product…</div>}>
        <ProductContent params={params} />
      </Suspense>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify page renders in dev**

```bash
pnpm dev
```

Open `http://localhost:3000/products/any-handle`. Confirm: stub product title, price, and three variant buttons render. Kill the server.

- [ ] **Step 4: Commit**

```bash
git add "app/(storefront)/products/[handle]/page.tsx"
git commit -m "feat: wire PDP to getProduct and ProductForm"
```

---

## Task 12: Wire PLP to real data

**Files:**

- Replace: `app/(storefront)/collections/[handle]/page.tsx`

- [ ] **Step 1: Replace app/(storefront)/collections/[handle]/page.tsx**

```typescript
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
  getCollection,
  getCollectionProducts,
} from '@/lib/shopify/operations/collection'

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollection(handle)
  if (!collection) return { title: 'Collection not found' }
  return { title: collection.title }
}

async function CollectionContent({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params

  const [collection, products] = await Promise.all([
    getCollection(handle),
    getCollectionProducts(handle),
  ])

  if (!collection) notFound()

  return (
    <div className="md:grid md:grid-cols-[240px_1fr] md:gap-8">
      <aside aria-label="Filters">
        <h2 className="mb-4 font-semibold">Filter</h2>
        <div className="space-y-2">
          {['By Weight', 'By Origin', 'By Price'].map((label) => (
            <div
              key={label}
              className="rounded border border-dashed p-3 text-sm text-gray-400"
            >
              {label} — placeholder
            </div>
          ))}
        </div>
      </aside>

      <div>
        <h1 className="mb-2 text-2xl font-bold">{collection.title}</h1>
        <p className="mb-6 text-gray-600">{collection.description}</p>

        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3" role="list">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.handle}`}
                className="group block focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {product.featuredImage ? (
                  <Image
                    src={`${product.featuredImage.url}&width=400`}
                    alt={product.featuredImage.altText ?? product.title}
                    width={product.featuredImage.width}
                    height={product.featuredImage.height}
                    className="aspect-square w-full rounded object-cover"
                  />
                ) : (
                  <div
                    className="aspect-square rounded bg-gray-100"
                    aria-hidden="true"
                  />
                )}
                <p className="mt-2 font-medium group-hover:underline">
                  {product.title}
                </p>
                <p className="text-sm text-gray-500">
                  {product.priceRange.minVariantPrice.currencyCode}{' '}
                  {product.priceRange.minVariantPrice.amount}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function CollectionPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Suspense
        fallback={<div aria-live="polite">Loading collection…</div>}
      >
        <CollectionContent params={params} />
      </Suspense>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify page renders in dev**

```bash
pnpm dev
```

Open `http://localhost:3000/collections/any-handle`. Confirm: stub collection title and 8 placeholder product cards render. Kill the server.

- [ ] **Step 4: Commit**

```bash
git add "app/(storefront)/collections/[handle]/page.tsx"
git commit -m "feat: wire PLP to getCollection and getCollectionProducts"
```

---

## Task 13: Wire cart page to real data

**Files:**

- Replace: `app/(storefront)/cart/page.tsx`

- [ ] **Step 1: Replace app/(storefront)/cart/page.tsx**

```typescript
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getCartAction,
  updateCartLineAction,
  removeCartLineAction,
} from '@/lib/cart/actions'

export const metadata: Metadata = {
  title: 'Your Cart',
}

export default async function CartPage() {
  const cart = await getCartAction()

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
        <p className="mb-6 text-gray-500">Your cart is empty.</p>
        <Link
          href="/collections/all"
          className="inline-block rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>

      <ul className="divide-y" role="list">
        {cart.lines.map((line) => {
          const decreaseAction = updateCartLineAction.bind(
            null,
            line.id,
            Math.max(1, line.quantity - 1),
          )
          const increaseAction = updateCartLineAction.bind(
            null,
            line.id,
            line.quantity + 1,
          )
          const removeAction = removeCartLineAction.bind(null, line.id)

          return (
            <li key={line.id} className="flex items-center gap-4 py-6">
              <div
                className="h-20 w-20 flex-shrink-0 rounded bg-gray-100"
                role="img"
                aria-label={`${line.merchandise.product.title} image`}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {line.merchandise.product.title}
                </p>
                <p className="text-sm text-gray-500">
                  {line.merchandise.title}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <form action={decreaseAction}>
                  <button
                    type="submit"
                    aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded border hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    &minus;
                  </button>
                </form>
                <span aria-label={`Quantity: ${line.quantity}`}>
                  {line.quantity}
                </span>
                <form action={increaseAction}>
                  <button
                    type="submit"
                    aria-label={`Increase quantity of ${line.merchandise.product.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded border hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    +
                  </button>
                </form>
              </div>

              <p className="w-20 text-right font-medium">
                {line.merchandise.price.currencyCode}{' '}
                {line.merchandise.price.amount}
              </p>

              <form action={removeAction}>
                <button
                  type="submit"
                  aria-label={`Remove ${line.merchandise.product.title} from cart`}
                  className="text-sm text-gray-400 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  Remove
                </button>
              </form>
            </li>
          )
        })}
      </ul>

      <div className="mt-8 rounded border p-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>
            {cart.cost.subtotalAmount.currencyCode}{' '}
            {cart.cost.subtotalAmount.amount}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <a
          href={cart.checkoutUrl}
          className="mt-4 block w-full rounded bg-black py-3 text-center font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Proceed to checkout"
        >
          Checkout
        </a>
        <Link
          href="/collections/all"
          className="mt-3 block text-center text-sm text-gray-500 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify cart page renders in dev**

```bash
pnpm dev
```

Open `http://localhost:3000/cart`. Confirm: stub cart with two line items renders, quantity controls and remove buttons are present. Kill the server.

- [ ] **Step 4: Commit**

```bash
git add "app/(storefront)/cart/page.tsx"
git commit -m "feat: wire cart page to getCartAction and server form actions"
```

---

## Task 14: Final verification

- [ ] **Step 1: TypeScript check**

```bash
pnpm exec tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: ESLint**

```bash
pnpm lint
```

Expected: zero errors or warnings.

- [ ] **Step 3: Production build**

```bash
pnpm build
```

Expected: build passes. Routes output:

```
○ /           (Static)
◐ /products/[handle]     (Partial Prerender)
◐ /collections/[handle]  (Partial Prerender)
○ /cart       (Static or server)
```

- [ ] **Step 4: Format**

```bash
pnpm format
```

If any files change, commit them:

```bash
git add -A
git commit -m "style: final Prettier pass"
```

- [ ] **Step 5: Final commit**

```bash
git status
```

If working tree is clean, no commit needed.

---

## Activating live data (not part of this plan)

When Shopify credentials are available:

1. Add to `.env.local`:

   ```
   SHOPIFY_STORE_DOMAIN=mrteashop-com.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token>
   ```

2. Run codegen to generate typed operations:

   ```bash
   pnpm codegen
   ```

3. Verify `lib/shopify/types/generated.ts` was created.

4. No other code changes are required — the stub guard in each operation returns real data automatically once the token is present.
