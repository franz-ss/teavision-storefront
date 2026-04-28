# Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install Storybook, define design tokens, and build four UI primitives (Button, Price, Badge, ProductCard) that replace inline Tailwind class repetition across the storefront.

**Architecture:** CSS custom properties in `app/globals.css` provide the token layer. Four focused files in `components/ui/` each have one responsibility. Stories live alongside components. `Button` is a Client Component; `Price`, `Badge`, and `ProductCard` are Server Components.

**Tech Stack:** Next.js 16.2.4, Storybook 8, `@storybook/nextjs`, `@storybook/addon-essentials`, `@storybook/addon-a11y`, TypeScript, Tailwind v4, pnpm

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `package.json` | Modify | Add Storybook scripts and deps |
| `.storybook/main.ts` | Create | Storybook config — framework, addons, stories glob |
| `.storybook/preview.ts` | Create | Import globals.css, set brand background |
| `app/globals.css` | Modify | Add `:root` design token block |
| `components/ui/button.tsx` | Create | Button — `'use client'`, forwardRef, variants, loading |
| `components/ui/button.stories.tsx` | Create | Button stories |
| `components/ui/price.tsx` | Create | Price — formats `Money`, sale state |
| `components/ui/price.stories.tsx` | Create | Price stories |
| `components/ui/badge.tsx` | Create | Badge — outOfStock, sale, new variants |
| `components/ui/badge.stories.tsx` | Create | Badge stories |
| `components/ui/product-card.tsx` | Create | ProductCard — links to PDP, optional badge |
| `components/ui/product-card.stories.tsx` | Create | ProductCard stories |

---

## Task 1: Install Storybook packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Storybook and framework packages**

```bash
pnpm add -D storybook @storybook/nextjs @storybook/addon-essentials @storybook/addon-a11y @storybook/react
```

- [ ] **Step 2: Add Storybook scripts to package.json**

Open `package.json`. In the `"scripts"` object, add:

```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install Storybook 8 with Next.js framework and a11y addon"
```

---

## Task 2: Storybook configuration

**Files:**
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`

- [ ] **Step 1: Create .storybook/main.ts**

```typescript
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
}

export default config
```

- [ ] **Step 2: Create .storybook/preview.ts**

```typescript
import type { Preview } from '@storybook/react'
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'brand',
      values: [
        { name: 'brand', value: '#F5F0E8' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
}

export default preview
```

- [ ] **Step 3: Verify Storybook starts**

```bash
pnpm storybook
```

Expected: Storybook dev server starts at `http://localhost:6006`. It will show "No stories found" — that is correct at this stage. Kill the server.

- [ ] **Step 4: Commit**

```bash
git add .storybook/
git commit -m "chore: configure Storybook with Next.js framework and brand background"
```

---

## Task 3: Design tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add token block to app/globals.css**

Open `app/globals.css`. Add the `:root` block immediately after `@import 'tailwindcss';` and before `@layer base`:

```css
@import 'tailwindcss';

:root {
  --color-background:    #F5F0E8;
  --color-surface:       #EDE8DE;
  --color-border:        #D4C9B0;
  --color-primary:       #6B7C5A;
  --color-primary-hover: #5A6B4A;
  --color-text:          #3D3D35;
  --color-text-muted:    #7A7868;
  --color-destructive:   #8B4A42;
}

@layer base {
  *,
  ::before,
  ::after {
    --tw-ring-color: var(--color-primary);
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

Note: the ring color is updated from `#000` to `var(--color-primary)` to match the brand palette.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify build passes**

```bash
pnpm build 2>&1 | tail -10
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: add design tokens to globals.css"
```

---

## Task 4: Button component

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/button.stories.tsx`

- [ ] **Step 1: Create components/ui/button.stories.tsx (story first)**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Add to Cart', variant: 'primary' },
}

export const Secondary: Story = {
  args: { children: 'Request Sample', variant: 'secondary' },
}

export const Ghost: Story = {
  args: { children: 'Continue shopping', variant: 'ghost' },
}

export const Loading: Story = {
  args: { children: 'Adding…', variant: 'primary', isLoading: true },
}

export const Disabled: Story = {
  args: { children: 'Add to Cart', variant: 'primary', disabled: true },
}

export const Small: Story = {
  args: { children: 'Shop All', variant: 'primary', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Shop All Products', variant: 'primary', size: 'lg' },
}

export const AsSubmit: Story = {
  args: { children: 'Submit', variant: 'primary', type: 'submit' },
}
```

- [ ] **Step 2: Verify Storybook fails to find Button**

```bash
pnpm storybook
```

Open `http://localhost:6006`. Expected: error in the Button stories — "Cannot find module './button'". Kill the server.

- [ ] **Step 3: Create components/ui/button.tsx**

```typescript
'use client'

import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-primary-hover)]',
  secondary:
    'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-surface)]',
  ghost:
    'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-7 py-3 text-base',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      className = '',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        className={[
          'inline-flex cursor-pointer items-center justify-center gap-2 rounded font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
```

- [ ] **Step 4: Verify Storybook renders Button stories**

```bash
pnpm storybook
```

Open `http://localhost:6006`. Expected: "UI/Button" appears in sidebar. All 8 stories render. Check the a11y panel — Primary and Secondary should pass; if any violation is flagged, fix it before continuing. Kill the server.

- [ ] **Step 5: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
pnpm format
git add components/ui/button.tsx components/ui/button.stories.tsx
git commit -m "feat: add Button component with variants, sizes, and loading state"
```

---

## Task 5: Price component

**Files:**
- Create: `components/ui/price.tsx`
- Create: `components/ui/price.stories.tsx`

- [ ] **Step 1: Create components/ui/price.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Price } from './price'

const meta: Meta<typeof Price> = {
  title: 'UI/Price',
  component: Price,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Price>

export const Standard: Story = {
  args: { price: { amount: '18.00', currencyCode: 'AUD' } },
}

export const Sale: Story = {
  args: {
    price: { amount: '42.00', currencyCode: 'AUD' },
    compareAtPrice: { amount: '52.00', currencyCode: 'AUD' },
  },
}

export const Large: Story = {
  args: { price: { amount: '180.00', currencyCode: 'AUD' }, size: 'lg' },
}

export const Small: Story = {
  args: { price: { amount: '18.00', currencyCode: 'AUD' }, size: 'sm' },
}
```

- [ ] **Step 2: Create components/ui/price.tsx**

```typescript
import type { Money } from '@/lib/shopify/types'

type PriceProps = {
  price: Money
  compareAtPrice?: Money
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl font-semibold',
}

export function Price({
  price,
  compareAtPrice,
  size = 'md',
  className = '',
}: PriceProps) {
  const formattedPrice = `${price.currencyCode} ${price.amount}`

  if (!compareAtPrice) {
    return (
      <span
        className={['tabular-nums', sizeStyles[size], className]
          .filter(Boolean)
          .join(' ')}
        style={{ color: 'var(--color-text)' }}
      >
        {formattedPrice}
      </span>
    )
  }

  const formattedCompare = `${compareAtPrice.currencyCode} ${compareAtPrice.amount}`

  return (
    <span
      className={['inline-flex items-baseline gap-2 tabular-nums', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className="text-sm line-through"
        style={{ color: 'var(--color-text-muted)' }}
        aria-label={`Was ${formattedCompare}`}
      >
        {formattedCompare}
      </span>
      <span
        className={sizeStyles[size]}
        style={{ color: 'var(--color-primary)' }}
        aria-label={`Now ${formattedPrice}`}
      >
        {formattedPrice}
      </span>
    </span>
  )
}
```

- [ ] **Step 3: Verify Storybook renders Price stories**

```bash
pnpm storybook
```

Open `http://localhost:6006`. Expected: "UI/Price" in sidebar, 4 stories render. Check a11y panel. Kill the server.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
pnpm format
git add components/ui/price.tsx components/ui/price.stories.tsx
git commit -m "feat: add Price component with sale state and size variants"
```

---

## Task 6: Badge component

**Files:**
- Create: `components/ui/badge.tsx`
- Create: `components/ui/badge.stories.tsx`

- [ ] **Step 1: Create components/ui/badge.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Badge>

export const OutOfStock: Story = { args: { variant: 'outOfStock' } }
export const Sale: Story = { args: { variant: 'sale' } }
export const New: Story = { args: { variant: 'new' } }

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Badge variant="sale" />
      <Badge variant="new" />
      <Badge variant="outOfStock" />
    </div>
  ),
}
```

- [ ] **Step 2: Create components/ui/badge.tsx**

```typescript
type BadgeVariant = 'outOfStock' | 'sale' | 'new'

type BadgeProps = {
  variant: BadgeVariant
  className?: string
}

const styles: Record<
  BadgeVariant,
  { background: string; color: string; label: string }
> = {
  outOfStock: {
    background: '#E8DDD5',
    color: 'var(--color-destructive)',
    label: 'Out of stock',
  },
  sale: {
    background: '#D8E2D0',
    color: 'var(--color-primary-hover)',
    label: 'Sale',
  },
  new: {
    background: 'var(--color-border)',
    color: 'var(--color-text-muted)',
    label: 'New',
  },
}

export function Badge({ variant, className = '' }: BadgeProps) {
  const { background, color, label } = styles[variant]
  return (
    <span
      className={[
        'inline-block rounded px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ background, color }}
    >
      {label}
    </span>
  )
}
```

- [ ] **Step 3: Verify Storybook renders Badge stories**

```bash
pnpm storybook
```

Open `http://localhost:6006`. Expected: "UI/Badge" in sidebar, 4 stories render. Check a11y panel — badge text contrast should pass. Kill the server.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
pnpm format
git add components/ui/badge.tsx components/ui/badge.stories.tsx
git commit -m "feat: add Badge component with outOfStock, sale, and new variants"
```

---

## Task 7: ProductCard component

**Files:**
- Create: `components/ui/product-card.tsx`
- Create: `components/ui/product-card.stories.tsx`

- [ ] **Step 1: Create components/ui/product-card.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ProductCard } from './product-card'
import type { ProductSummary } from '@/lib/shopify/types'

const stubProduct: ProductSummary = {
  id: 'gid://shopify/Product/1',
  handle: 'english-breakfast',
  title: 'English Breakfast — Bulk Loose Leaf',
  featuredImage: null,
  priceRange: {
    minVariantPrice: { amount: '18.00', currencyCode: 'AUD' },
  },
}

const meta: Meta<typeof ProductCard> = {
  title: 'UI/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
}
export default meta

type Story = StoryObj<typeof ProductCard>

export const Default: Story = {
  args: { product: stubProduct },
}

export const WithSaleBadge: Story = {
  args: { product: stubProduct, badge: 'sale' },
}

export const WithNewBadge: Story = {
  args: { product: stubProduct, badge: 'new' },
}

export const OutOfStock: Story = {
  args: { product: stubProduct, badge: 'outOfStock' },
}
```

- [ ] **Step 2: Create components/ui/product-card.tsx**

```typescript
import Image from 'next/image'
import Link from 'next/link'
import type { ProductSummary } from '@/lib/shopify/types'
import { Badge } from '@/components/ui/badge'
import { Price } from '@/components/ui/price'

type ProductCardProps = {
  product: ProductSummary
  badge?: 'outOfStock' | 'sale' | 'new'
  priority?: boolean
}

export function ProductCard({
  product,
  badge,
  priority = false,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block overflow-hidden rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        transition: 'border-color 0.15s',
      }}
    >
      <div
        className="relative aspect-square"
        style={{ background: 'var(--color-border)' }}
      >
        {product.featuredImage &&
        product.featuredImage.width &&
        product.featuredImage.height ? (
          <Image
            src={`${product.featuredImage.url}&width=400`}
            alt={product.featuredImage.altText ?? product.title}
            width={product.featuredImage.width}
            height={product.featuredImage.height}
            priority={priority}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" aria-hidden="true" />
        )}
        {badge && (
          <div className="absolute left-2 top-2">
            <Badge variant={badge} />
          </div>
        )}
      </div>

      <div className="p-3">
        <p
          className="truncate text-sm font-medium group-hover:underline"
          style={{ color: 'var(--color-text)' }}
        >
          {product.title}
        </p>
        <Price
          price={product.priceRange.minVariantPrice}
          size="sm"
          className="mt-1"
        />
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: Verify Storybook renders ProductCard stories**

```bash
pnpm storybook
```

Open `http://localhost:6006`. Expected: "UI/ProductCard" in sidebar. All 4 stories render showing card with placeholder image area. Badge appears in top-left when set. Check a11y panel. Kill the server.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
pnpm format
git add components/ui/product-card.tsx components/ui/product-card.stories.tsx
git commit -m "feat: add ProductCard component with image, badge, and price"
```

---

## Task 8: Final verification

- [ ] **Step 1: TypeScript check**

```bash
pnpm exec tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: ESLint**

```bash
pnpm lint
```

Expected: zero errors.

- [ ] **Step 3: Production build**

```bash
pnpm build 2>&1 | tail -15
```

Expected: build passes. Storybook files are not included in the Next.js build — they live in `.storybook/` which Next.js ignores.

- [ ] **Step 4: Full Storybook run**

```bash
pnpm storybook
```

Open `http://localhost:6006`. Verify all four components appear under "UI/":
- `UI/Button` — 8 stories, all render
- `UI/Price` — 4 stories, all render
- `UI/Badge` — 4 stories including AllVariants, all render
- `UI/ProductCard` — 4 stories, all render

Open the a11y panel for each component's default story. All should show 0 violations or flag only color contrast (acceptable since palette is intentionally low-contrast). Kill the server.

- [ ] **Step 5: Prettier**

```bash
pnpm format
```

If files change, commit:

```bash
git add -A
git commit -m "style: final Prettier pass"
```

- [ ] **Step 6: Final commit**

```bash
git status
```

Working tree should be clean. If not, stage and commit any remaining changes.
