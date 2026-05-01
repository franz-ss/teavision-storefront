# Design System Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the design system tokens and components (Button, Price, ProductCard) into the five existing storefront files, replacing inline Tailwind hardcoded color classes with token-driven components.

**Architecture:** Pure substitution — no new files, no new components. Each task modifies one file. Navigation links (`<Link>`, `<a>`) stay as links; only action `<button>` elements become `<Button>`. Hardcoded colors (`bg-black`, `bg-gray-50`, `text-gray-600`) are replaced with CSS custom property equivalents.

**Tech Stack:** Next.js 16.2.4, TypeScript, pnpm, `components/ui/button`, `components/ui/price`, `components/ui/product-card`

---

## File Map

| File                                             | Changes                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------ |
| `app/globals.css`                                | Add `body` background/color rule                                               |
| `components/product/product-form.tsx`            | Add-to-cart `<button>` → `<Button>`; variant button colors → tokens            |
| `app/(storefront)/page.tsx`                      | Inline product cards → `<ProductCard>`; section bg and text colors → tokens    |
| `app/(storefront)/products/[handle]/page.tsx`    | Price string → `<Price size="lg">`; hardcoded colors → tokens                  |
| `app/(storefront)/collections/[handle]/page.tsx` | Inline product cards → `<ProductCard>`; hardcoded colors → tokens              |
| `app/(storefront)/cart/page.tsx`                 | Remove `<button>` → `<Button variant="ghost" size="sm">`; link colors → tokens |

---

## Task 1: Body background token

**Files:**

- Modify: `app/globals.css`

- [ ] **Step 1: Add body rule to globals.css**

Open `app/globals.css`. Add the `body` rule inside `@layer base`, after the `p` block:

```css
@import 'tailwindcss';

:root {
  --color-background: #f5f0e8;
  --color-surface: #ede8de;
  --color-border: #d4c9b0;
  --color-primary: #6b7c5a;
  --color-primary-hover: #5a6b4a;
  --color-text: #3d3d35;
  --color-text-muted: #7a7868;
  --color-destructive: #8b4a42;
}

@layer base {
  *,
  ::before,
  ::after {
    --tw-ring-color: var(--color-primary);
  }

  body {
    background: var(--color-background);
    color: var(--color-text);
  }

  button,
  a,
  [role='button'] {
    touch-action: manipulation;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm exec tsc --noEmit && pnpm build 2>&1 | tail -5
```

Expected: no errors, build passes.

- [ ] **Step 3: Commit**

```bash
pnpm format
git add app/globals.css
git commit -m "feat: apply background and text tokens to body"
```

---

## Task 2: ProductForm — wire Button

**Files:**

- Modify: `components/product/product-form.tsx`

- [ ] **Step 1: Replace the file**

```typescript
'use client'

import { useState, useTransition } from 'react'
import { addToCartAction } from '@/lib/cart/actions'
import { Button } from '@/components/ui/button'
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
      <div
        className="rounded border border-dashed p-4 text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
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
              className="rounded border px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
              style={
                selectedVariantId === v.id
                  ? {
                      borderColor: 'var(--color-primary)',
                      background: 'var(--color-primary)',
                      color: 'var(--color-background)',
                    }
                  : { borderColor: 'var(--color-border)' }
              }
            >
              {v.title}
            </button>
          ))}
        </div>
      </fieldset>

      <Button
        onClick={handleAddToCart}
        isLoading={isPending}
        disabled={!selectedVariantId}
        size="lg"
      >
        Add to Cart
      </Button>
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
pnpm format
git add components/product/product-form.tsx
git commit -m "feat: wire Button into ProductForm, apply token colors to variant selector"
```

---

## Task 3: Home page — wire ProductCard

**Files:**

- Modify: `app/(storefront)/page.tsx`

- [ ] **Step 1: Replace the file**

```typescript
import Link from 'next/link'
import type { Metadata } from 'next'
import type { ProductSummary } from '@/lib/shopify/types'
import { ProductCard } from '@/components/ui/product-card'

export const metadata: Metadata = {
  title: 'Bulk Wholesale Tea, Herbs & Spices | Teavision',
}

const STUB_PRODUCTS: ProductSummary[] = [
  {
    id: '1',
    handle: 'product-placeholder-1',
    title: 'English Breakfast Loose Leaf',
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: '18.00', currencyCode: 'AUD' } },
  },
  {
    id: '2',
    handle: 'product-placeholder-2',
    title: 'Chamomile Flowers Whole',
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: '24.00', currencyCode: 'AUD' } },
  },
  {
    id: '3',
    handle: 'product-placeholder-3',
    title: 'Matcha Ceremonial Grade',
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: '48.00', currencyCode: 'AUD' } },
  },
  {
    id: '4',
    handle: 'product-placeholder-4',
    title: 'Earl Grey Loose Leaf',
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: '22.00', currencyCode: 'AUD' } },
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="px-4 py-20 text-center"
        style={{ background: 'var(--color-surface)' }}
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Australia&rsquo;s #1 Tea Supplier
        </h1>
        <p className="mt-4 text-lg" style={{ color: 'var(--color-text-muted)' }}>
          Bulk wholesale tea, herbs, and spices for cafes, restaurants, and
          retailers.
        </p>
        <Link
          href="/collections/all"
          className="mt-8 inline-block rounded px-6 py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-background)',
          }}
        >
          Shop All Products
        </Link>
      </section>

      {/* Featured collections placeholder */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-semibold">Shop by Category</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4" role="list">
            {['Black Tea', 'Green Tea', 'Herbs & Spices', 'Custom Blends'].map(
              (name) => (
                <li key={name}>
                  <a
                    href="#"
                    className="block rounded p-6 text-center font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ border: '1px solid var(--color-border)' }}
                  >
                    {name}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* Featured products */}
      <section className="px-4 py-12" style={{ background: 'var(--color-surface)' }}>
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-semibold">Featured Products</h2>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4" role="list">
            {STUB_PRODUCTS.map((product, i) => (
              <li key={product.id}>
                <ProductCard product={product} priority={i === 0} />
              </li>
            ))}
          </ul>
        </div>
      </section>
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
pnpm format
git add "app/(storefront)/page.tsx"
git commit -m "feat: wire ProductCard into home page, apply token colors"
```

---

## Task 4: PDP — wire Price

**Files:**

- Modify: `app/(storefront)/products/[handle]/page.tsx`

- [ ] **Step 1: Replace the file**

```typescript
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/shopify/operations/product'
import { ProductForm } from '@/components/product/product-form'
import { Price } from '@/components/ui/price'

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
        className="aspect-square rounded"
        style={{ background: 'var(--color-surface)' }}
        role="img"
        aria-label={product.featuredImage?.altText ?? `${product.title} image`}
      />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <Price price={product.priceRange.minVariantPrice} size="lg" />
        <ProductForm variants={product.variants} />
        <p style={{ color: 'var(--color-text-muted)' }}>{product.description}</p>
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

- [ ] **Step 3: Commit**

```bash
pnpm format
git add "app/(storefront)/products/[handle]/page.tsx"
git commit -m "feat: wire Price into PDP, apply token colors"
```

---

## Task 5: PLP — wire ProductCard

**Files:**

- Modify: `app/(storefront)/collections/[handle]/page.tsx`

- [ ] **Step 1: Replace the file**

```typescript
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import {
  getCollection,
  getCollectionProducts,
} from '@/lib/shopify/operations/collection'
import { ProductCard } from '@/components/ui/product-card'

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
              className="rounded border border-dashed p-3 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {label} — placeholder
            </div>
          ))}
        </div>
      </aside>

      <div>
        <h1 className="mb-2 text-2xl font-bold">{collection.title}</h1>
        <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
          {collection.description}
        </p>

        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3" role="list">
          {products.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} priority={i === 0} />
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

- [ ] **Step 3: Commit**

```bash
pnpm format
git add "app/(storefront)/collections/[handle]/page.tsx"
git commit -m "feat: wire ProductCard into PLP, apply token colors"
```

---

## Task 6: Cart — wire Button

**Files:**

- Modify: `app/(storefront)/cart/page.tsx`

Replace the Remove `<button>` with `<Button variant="ghost" size="sm">`. Update the empty-state `<Link>` CTA and checkout `<a>` to use token colors. Quantity +/− submit buttons keep their specialized square shape.

- [ ] **Step 1: Replace the file**

```typescript
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getCartAction,
  updateCartLineAction,
  removeCartLineAction,
} from '@/lib/cart/actions'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Your Cart',
}

export default async function CartPage() {
  const cart = await getCartAction()

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
        <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Your cart is empty.
        </p>
        <Link
          href="/collections/all"
          className="inline-block rounded px-6 py-3 font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-background)',
          }}
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
                className="h-20 w-20 flex-shrink-0 rounded"
                style={{ background: 'var(--color-surface)' }}
                role="img"
                aria-label={`${line.merchandise.product.title} image`}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {line.merchandise.product.title}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {line.merchandise.title}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <form action={decreaseAction}>
                  <button
                    type="submit"
                    aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ border: '1px solid var(--color-border)' }}
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
                    className="flex h-8 w-8 items-center justify-center rounded focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ border: '1px solid var(--color-border)' }}
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
                <Button variant="ghost" size="sm" type="submit">
                  Remove
                </Button>
              </form>
            </li>
          )
        })}
      </ul>

      <div
        className="mt-8 rounded p-6"
        style={{ border: '1px solid var(--color-border)' }}
      >
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>
            {cart.cost.subtotalAmount.currencyCode}{' '}
            {cart.cost.subtotalAmount.amount}
          </span>
        </div>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Shipping and taxes calculated at checkout.
        </p>

        <a
          href={cart.checkoutUrl}
          className="mt-4 block w-full rounded py-3 text-center font-medium focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-background)',
          }}
          aria-label="Proceed to checkout"
        >
          Checkout
        </a>

        <Link
          href="/collections/all"
          className="mt-3 block text-center text-sm hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ color: 'var(--color-text-muted)' }}
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

- [ ] **Step 3: Commit**

```bash
pnpm format
git add "app/(storefront)/cart/page.tsx"
git commit -m "feat: wire Button into cart, apply token colors throughout"
```

---

## Task 7: Final verification

- [ ] **Step 1: TypeScript**

```bash
pnpm exec tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: ESLint**

```bash
pnpm lint
```

Expected: zero errors.

- [ ] **Step 3: Build**

```bash
pnpm build 2>&1 | tail -15
```

Expected: build passes, all routes present.

- [ ] **Step 4: Prettier**

```bash
pnpm exec prettier --check .
```

If files flagged: `pnpm format && git add -A && git commit -m "style: final Prettier pass"`

- [ ] **Step 5: Smoke test in dev**

```bash
pnpm dev
```

Open `http://localhost:3000`. Verify:

- Cream (`#F5F0E8`) page background — not white
- Sage green buttons
- Product cards using `<ProductCard>` with token surface background
- Open `/products/english-breakfast` — price renders via `<Price>` with `Intl` formatting
- Open `/cart` — Remove button uses ghost style; quantity controls use token border color

Kill the server.
