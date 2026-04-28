# Project Initialization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Teavision Next.js storefront with foundation tooling, folder structure, and wireframe pages for Home, PDP, PLP, and Cart — no Shopify integration.

**Architecture:** `create-next-app` bootstrapped project with App Router and route groups. A `(storefront)` route group wraps all public pages with a shared header/footer layout. PDP and PLP use `'use cache'` with `cacheTag()` for future webhook-driven revalidation. All pages are wireframe-only with hardcoded placeholder content.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Prettier, ESLint, `experimental.dynamicIO: true`

---

## File Map

| File                                             | Purpose                                                |
| ------------------------------------------------ | ------------------------------------------------------ |
| `next.config.ts`                                 | `dynamicIO`, `remotePatterns` for Shopify CDN          |
| `.prettierrc`                                    | Prettier config with tailwindcss plugin                |
| `.env.example`                                   | Committed empty key stubs                              |
| `.env.local`                                     | Local env (gitignored)                                 |
| `app/layout.tsx`                                 | Root HTML shell — fonts, body, global CSS import       |
| `app/globals.css`                                | Tailwind directives + base layer overrides             |
| `app/(storefront)/layout.tsx`                    | Header + main + footer shell for all storefront routes |
| `app/(storefront)/page.tsx`                      | Home wireframe — static                                |
| `app/(storefront)/products/[handle]/page.tsx`    | PDP wireframe — `'use cache'`                          |
| `app/(storefront)/collections/[handle]/page.tsx` | PLP wireframe — `'use cache'`                          |
| `app/(storefront)/cart/page.tsx`                 | Cart wireframe — dynamic, no cache                     |
| `components/layout/header.tsx`                   | Wireframe header                                       |
| `components/layout/footer.tsx`                   | Wireframe footer                                       |
| `components/product/variant-selector.tsx`        | Client Component stub — variant picker                 |
| `lib/shopify/index.ts`                           | Stub — Storefront API client placeholder               |
| `lib/cart/index.ts`                              | Stub — cart server actions placeholder                 |

---

## Task 1: Bootstrap with create-next-app

**Files:**

- Create: entire project scaffold in `d:\Work\teavision\teavision.com.au\`

The project directory already contains a `docs/` folder. `create-next-app` will scaffold into this directory — existing files are not overwritten.

- [ ] **Step 1: Run create-next-app**

From `d:\Work\teavision\teavision.com.au\`:

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --yes
```

If prompted about the non-empty directory, confirm to proceed.

Expected: project scaffold created with `package.json`, `app/`, `public/`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Open `http://localhost:3000` — default Next.js homepage renders. Kill the server.

- [ ] **Step 4: Commit baseline**

```bash
git init
git add .
git commit -m "chore: bootstrap Next.js 15 with TypeScript, Tailwind, ESLint"
```

---

## Task 2: Configure next.config.ts

**Files:**

- Modify: `next.config.ts`

- [ ] **Step 1: Replace next.config.ts with project config**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore: configure dynamicIO and Shopify CDN remotePatterns"
```

---

## Task 3: Add Prettier

**Files:**

- Create: `.prettierrc`
- Modify: `package.json` (devDependencies + scripts)

- [ ] **Step 1: Install Prettier and Tailwind plugin**

```bash
npm install --save-dev prettier prettier-plugin-tailwindcss
```

- [ ] **Step 2: Create .prettierrc**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 3: Add format script to package.json**

Open `package.json`. In the `"scripts"` object, add:

```json
"format": "prettier --write ."
```

- [ ] **Step 4: Run formatter to verify**

```bash
npm run format
```

Expected: files reformatted with no errors.

- [ ] **Step 5: Commit**

```bash
git add .prettierrc package.json package-lock.json
git commit -m "chore: add Prettier with Tailwind class-sort plugin"
```

---

## Task 4: Environment variable stubs

**Files:**

- Create: `.env.example`
- Create: `.env.local`

- [ ] **Step 1: Create .env.example (committed)**

```bash
# .env.example
SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_ADMIN_API_ACCESS_TOKEN=
```

Save as `.env.example`.

- [ ] **Step 2: Create .env.local (gitignored)**

Copy `.env.example` to `.env.local`. Leave all values empty — they will be filled when Shopify integration begins.

```bash
cp .env.example .env.local
```

- [ ] **Step 3: Verify .env.local is gitignored**

Check `.gitignore` (created by `create-next-app`) already contains `.env.local`. If not, add it.

```bash
grep ".env.local" .gitignore
```

Expected: `.env*.local` or `.env.local` is present.

- [ ] **Step 4: Commit .env.example only**

```bash
git add .env.example
git commit -m "chore: add env var stubs for Shopify integration"
```

---

## Task 5: Root layout and global CSS

**Files:**

- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update globals.css with base layer overrides**

Replace `app/globals.css` entirely:

```css
@import 'tailwindcss';

@layer base {
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

- [ ] **Step 2: Update app/layout.tsx**

Replace `app/layout.tsx` entirely:

```typescript
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Teavision',
    default: 'Teavision — Australia's #1 Tea Supplier',
  },
  description: 'Bulk wholesale tea, herbs, and spices for cafes, restaurants, and retailers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "chore: set up root layout, fonts, and base CSS overrides"
```

---

## Task 6: Header and footer wireframes

**Files:**

- Create: `components/layout/header.tsx`
- Create: `components/layout/footer.tsx`
- Create: `app/(storefront)/layout.tsx`

- [ ] **Step 1: Create components/layout/header.tsx**

```typescript
import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b px-4 py-3">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between"
      >
        <Link href="/" className="font-semibold focus-visible:ring-2 focus-visible:ring-offset-2">
          Teavision
        </Link>
        <ul className="flex gap-6 text-sm" role="list">
          <li>
            <Link href="/collections/all" className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2">
              Shop
            </Link>
          </li>
          <li>
            <Link href="/pages/wholesale" className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2">
              Wholesale
            </Link>
          </li>
          <li>
            <Link href="/cart" className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2">
              Cart
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Create components/layout/footer.tsx**

```typescript
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Teavision. All rights reserved.
        </p>
        <nav aria-label="Footer navigation" className="mt-4 flex gap-4 text-sm">
          <Link href="/pages/contact" className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2">
            Contact
          </Link>
          <Link href="/pages/wholesale" className="hover:underline focus-visible:ring-2 focus-visible:ring-offset-2">
            Wholesale
          </Link>
        </nav>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Create app/(storefront)/layout.tsx**

```typescript
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/layout/header.tsx components/layout/footer.tsx app/"(storefront)"/layout.tsx
git commit -m "feat: add wireframe header, footer, and storefront layout"
```

---

## Task 7: Create stub directories and placeholder files

**Files:**

- Create: `components/product/.gitkeep`
- Create: `components/cart/.gitkeep`
- Create: `components/ui/.gitkeep`
- Create: `lib/shopify/index.ts`
- Create: `lib/cart/index.ts`
- Create: `lib/seo/.gitkeep`
- Create: `app/api/.gitkeep`

- [ ] **Step 1: Create empty component directories**

```bash
mkdir -p components/product components/cart components/ui
touch components/product/.gitkeep components/cart/.gitkeep components/ui/.gitkeep
```

- [ ] **Step 2: Create lib/shopify/index.ts stub**

```typescript
// Storefront API client — populated when Shopify integration begins
export {}
```

Save as `lib/shopify/index.ts`.

- [ ] **Step 3: Create lib/cart/index.ts stub**

```typescript
// Cart server actions — populated when Shopify integration begins
export {}
```

Save as `lib/cart/index.ts`.

- [ ] **Step 4: Create remaining empty directories**

```bash
mkdir -p lib/seo app/api
touch lib/seo/.gitkeep app/api/.gitkeep
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/ lib/ app/api/
git commit -m "chore: create stub directories for components, lib, and api"
```

---

## Task 8: Home page wireframe

**Files:**

- Create: `app/(storefront)/page.tsx`
- Delete: `app/page.tsx` (default create-next-app home — replaced by route group)

- [ ] **Step 1: Remove default app/page.tsx**

```bash
rm app/page.tsx
```

- [ ] **Step 2: Create app/(storefront)/page.tsx**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bulk Wholesale Tea, Herbs & Spices | Teavision',
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Australia&rsquo;s #1 Tea Supplier
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Bulk wholesale tea, herbs, and spices for cafes, restaurants, and retailers.
        </p>
        <a
          href="/collections/all"
          className="mt-8 inline-block rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Shop All Products
        </a>
      </section>

      {/* Featured collections placeholder */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-semibold">Shop by Category</h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4" role="list">
            {['Black Tea', 'Green Tea', 'Herbs & Spices', 'Custom Blends'].map((name) => (
              <li key={name}>
                <a
                  href="#"
                  className="block rounded border p-6 text-center font-medium hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured products placeholder */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-semibold">Featured Products</h2>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4" role="list">
            {[1, 2, 3, 4].map((i) => (
              <li key={i}>
                <a href="#" className="group block focus-visible:ring-2 focus-visible:ring-offset-2">
                  <div className="aspect-square rounded bg-gray-200" aria-hidden="true" />
                  <p className="mt-2 font-medium group-hover:underline">Product Placeholder {i}</p>
                  <p className="text-sm text-gray-500">$0.00</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Verify page renders in dev**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm: hero section, category grid, product grid render with header and footer. Kill the server.

- [ ] **Step 5: Commit**

```bash
git rm app/page.tsx
git add "app/(storefront)/page.tsx"
git commit -m "feat: add home page wireframe"
```

---

## Task 9: Variant selector (Client Component)

**Files:**

- Create: `components/product/variant-selector.tsx`

This is a standalone Client Component because variant selection requires click interactivity. It is a stub — no real data in this phase.

- [ ] **Step 1: Create components/product/variant-selector.tsx**

```typescript
'use client'

type Variant = {
  id: string
  title: string
  available: boolean
}

type VariantSelectorProps = {
  variants?: Variant[]
}

export function VariantSelector({ variants = [] }: VariantSelectorProps) {
  if (variants.length === 0) {
    return (
      <div className="rounded border border-dashed p-4 text-sm text-gray-400">
        Variant selector placeholder
      </div>
    )
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Size</legend>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Select size">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            disabled={!v.available}
            aria-label={`${v.title}${!v.available ? ', out of stock' : ''}`}
            className="rounded border px-4 py-2 text-sm font-medium hover:border-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {v.title}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/product/variant-selector.tsx
git commit -m "feat: add variant selector stub (client component)"
```

---

## Task 10: PDP wireframe

**Files:**

- Create: `app/(storefront)/products/[handle]/page.tsx`

Uses `'use cache'` with `cacheTag()` and `cacheLife()`. Fetches are parallelised with `Promise.all`. Requires `experimental.dynamicIO: true` (already configured in Task 2).

- [ ] **Step 1: Create app/(storefront)/products/[handle]/page.tsx**

```typescript
import type { Metadata } from 'next'
import { cacheLife, cacheTag } from 'next/cache'
import { VariantSelector } from '@/components/product/variant-selector'

type Product = {
  handle: string
  title: string
  description: string
  price: string
}

async function getProduct(handle: string): Promise<Product> {
  'use cache'
  cacheTag('product', `product-${handle}`)
  cacheLife('hours')

  return {
    handle,
    title: 'English Breakfast — Bulk Loose Leaf',
    description: 'Premium Assam-based black tea blend. Available in 250g, 1kg, 5kg, and 10kg.',
    price: '$18.00',
  }
}

async function getRelatedProducts(): Promise<Product[]> {
  'use cache'
  cacheTag('product')
  cacheLife('hours')

  return []
}

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  return { title: product.title }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params

  const [product] = await Promise.all([
    getProduct(handle),
    getRelatedProducts(),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image gallery placeholder */}
        <div
          className="aspect-square rounded bg-gray-100"
          role="img"
          aria-label="Product image placeholder"
        />

        {/* Product details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl font-semibold">{product.price}</p>

          <VariantSelector />

          <button
            type="button"
            aria-label="Add to cart"
            className="rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Add to Cart
          </button>

          <p className="text-gray-600">{product.description}</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. If `cacheTag`/`cacheLife` are not found at `'next/cache'`, try the unstable prefix:

```typescript
import {
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
} from 'next/cache'
```

- [ ] **Step 3: Verify page renders in dev**

```bash
npm run dev
```

Open `http://localhost:3000/products/any-handle`. Confirm: image placeholder, title, price, variant selector stub, add-to-cart button, description render. Kill the server.

- [ ] **Step 4: Commit**

```bash
git add "app/(storefront)/products/[handle]/page.tsx"
git commit -m "feat: add PDP wireframe with use cache and parallel fetches"
```

---

## Task 11: PLP wireframe

**Files:**

- Create: `app/(storefront)/collections/[handle]/page.tsx`

- [ ] **Step 1: Create app/(storefront)/collections/[handle]/page.tsx**

```typescript
import type { Metadata } from 'next'
import { cacheLife, cacheTag } from 'next/cache'

type Collection = {
  handle: string
  title: string
  description: string
}

type ProductCard = {
  id: string
  title: string
  price: string
  handle: string
}

async function getCollection(handle: string): Promise<Collection> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  return {
    handle,
    title: 'Black Tea',
    description: 'Premium black teas sourced from Assam, Darjeeling, and Sri Lanka.',
  }
}

async function getCollectionProducts(handle: string): Promise<ProductCard[]> {
  'use cache'
  cacheTag('collection', `collection-${handle}`)
  cacheLife('hours')

  return Array.from({ length: 8 }, (_, i) => ({
    id: String(i + 1),
    title: `Product Placeholder ${i + 1}`,
    price: '$0.00',
    handle: `product-placeholder-${i + 1}`,
  }))
}

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollection(handle)
  return { title: collection.title }
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params

  const [collection, products] = await Promise.all([
    getCollection(handle),
    getCollectionProducts(handle),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="md:grid md:grid-cols-[240px_1fr] md:gap-8">
        {/* Filter sidebar placeholder */}
        <aside aria-label="Filters">
          <h2 className="mb-4 font-semibold">Filter</h2>
          <div className="space-y-2">
            {['By Weight', 'By Origin', 'By Price'].map((label) => (
              <div key={label} className="rounded border border-dashed p-3 text-sm text-gray-400">
                {label} — placeholder
              </div>
            ))}
          </div>
        </aside>

        {/* Product grid */}
        <div>
          <h1 className="mb-2 text-2xl font-bold">{collection.title}</h1>
          <p className="mb-6 text-gray-600">{collection.description}</p>

          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3" role="list">
            {products.map((product) => (
              <li key={product.id}>
                <a
                  href={`/products/${product.handle}`}
                  className="group block focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <div className="aspect-square rounded bg-gray-100" aria-hidden="true" />
                  <p className="mt-2 font-medium group-hover:underline">{product.title}</p>
                  <p className="text-sm text-gray-500">{product.price}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify page renders in dev**

```bash
npm run dev
```

Open `http://localhost:3000/collections/any-handle`. Confirm: filter sidebar placeholder, collection title, product grid render. Kill the server.

- [ ] **Step 4: Commit**

```bash
git add "app/(storefront)/collections/[handle]/page.tsx"
git commit -m "feat: add PLP wireframe with use cache and parallel fetches"
```

---

## Task 12: Cart page wireframe

**Files:**

- Create: `app/(storefront)/cart/page.tsx`

Cart is dynamic — no caching. Checkout CTA is a placeholder `href="#"` until Shopify integration lands.

- [ ] **Step 1: Create app/(storefront)/cart/page.tsx**

```typescript
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Your Cart',
}

const PLACEHOLDER_ITEMS = [
  { id: '1', title: 'English Breakfast 1kg', variant: '1kg', price: '$42.00', quantity: 2 },
  { id: '2', title: 'Chamomile 250g', variant: '250g', price: '$18.00', quantity: 1 },
]

export default function CartPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>

      <ul className="divide-y" role="list">
        {PLACEHOLDER_ITEMS.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-6">
            {/* Product image placeholder */}
            <div
              className="h-20 w-20 flex-shrink-0 rounded bg-gray-100"
              role="img"
              aria-label={`${item.title} image`}
            />

            {/* Item details */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.title}</p>
              <p className="text-sm text-gray-500">{item.variant}</p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${item.title}`}
                className="flex h-8 w-8 items-center justify-center rounded border hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                &minus;
              </button>
              <span aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
              <button
                type="button"
                aria-label={`Increase quantity of ${item.title}`}
                className="flex h-8 w-8 items-center justify-center rounded border hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                +
              </button>
            </div>

            <p className="font-medium w-16 text-right">{item.price}</p>

            <button
              type="button"
              aria-label={`Remove ${item.title} from cart`}
              className="text-sm text-gray-400 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="mt-8 rounded border p-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>$102.00</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>

        {/* Checkout CTA — placeholder href until Shopify cart.checkoutUrl is wired */}
        <a
          href="#"
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
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify page renders in dev**

```bash
npm run dev
```

Open `http://localhost:3000/cart`. Confirm: line items, quantity controls, subtotal, checkout button render. Kill the server.

- [ ] **Step 4: Commit**

```bash
git add "app/(storefront)/cart/page.tsx"
git commit -m "feat: add cart page wireframe"
```

---

## Task 13: Final build verification

- [ ] **Step 1: Run full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 2: Run ESLint**

```bash
npm run lint
```

Expected: no errors or warnings.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: build completes with no errors. Output shows routes:

- `○ /` (static)
- `ƒ /products/[handle]` (dynamic — server)
- `ƒ /collections/[handle]` (dynamic — server)
- `ƒ /cart` (dynamic — server)

- [ ] **Step 4: Run formatter one final time**

```bash
npm run format
```

Expected: all files already formatted, no changes.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: verify build and format — initialization complete"
```
