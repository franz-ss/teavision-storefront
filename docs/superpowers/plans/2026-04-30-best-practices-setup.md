# Best Practices Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the project against convention drift via ESLint rules, barrel files, scaffolding scripts, a canonical conventions doc, and CLAUDE.md additions.

**Architecture:** Three independent layers — ESLint catches violations automatically on `npm run lint`; barrel files enforce consistent import paths; scaffolding scripts produce correctly-shaped files on every new component or lib module. Conventions doc and CLAUDE.md additions serve as the authoritative reference for humans and AI.

**Tech Stack:** ESLint v9 flat config, `eslint-plugin-import`, Node.js ESM scripts, TypeScript, Next.js 16 App Router

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `package.json` | Modify | Add `eslint-plugin-import` dep + `create:component`, `create:lib` scripts |
| `eslint.config.mjs` | Modify | Add import/order, no-default-export, react-hooks/exhaustive-deps rules |
| `components/ui/index.ts` | Create | Barrel — re-exports all ui components |
| `components/layout/index.ts` | Create | Barrel — re-exports Header, Footer |
| `components/product/index.ts` | Create | Barrel — re-exports ProductForm, VariantSelector |
| `components/collection/index.ts` | Create | Barrel — re-exports SortSelect |
| `components/cart/index.ts` | Create | Barrel — empty placeholder |
| `app/(storefront)/layout.tsx` | Modify | Use layout barrel import |
| `app/(storefront)/page.tsx` | Modify | Use ui barrel import |
| `app/(storefront)/cart/page.tsx` | Modify | Use ui barrel import |
| `app/(storefront)/collections/[handle]/page.tsx` | Modify | Use ui + collection barrel imports |
| `app/(storefront)/products/[handle]/page.tsx` | Modify | Use ui + product barrel imports |
| `app/(storefront)/search/page.tsx` | Modify | Use ui barrel import |
| `components/product/product-form.tsx` | Modify | Use ui barrel import |
| `components/ui/product-card.tsx` | Modify | Use relative imports within domain |
| `scripts/create-component.mjs` | Create | Scaffold component + story + barrel update |
| `scripts/create-lib.mjs` | Create | Scaffold lib module |
| `docs/conventions.md` | Create | Canonical conventions reference |
| `CLAUDE.md` | Modify | Add @docs/conventions.md, do-not section, checklist, scripts ref |

---

## Task 1: Install eslint-plugin-import

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the plugin**

```bash
npm install --save-dev eslint-plugin-import
```

Expected output: `added 1 package` (or similar). The package resolves to `eslint-plugin-import` v2.31+.

- [ ] **Step 2: Verify install**

```bash
node -e "import('eslint-plugin-import').then(m => console.log('ok', Object.keys(m.default.rules).slice(0,3)))"
```

Expected: `ok [ 'default', 'named', 'namespace' ]` (or similar rule names — confirms flat config export exists)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add eslint-plugin-import"
```

---

## Task 2: Update ESLint config with new rules

**Files:**
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Replace the entire eslint.config.mjs with the hardened config**

```js
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'
import importPlugin from 'eslint-plugin-import'

import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  ...storybook.configs['flat/recommended'],

  // Import ordering — all files
  {
    plugins: { import: importPlugin },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
        },
      ],
    },
  },

  // No default exports — components and lib files only
  {
    files: ['components/**/*.tsx', 'lib/**/*.ts'],
    rules: {
      'import/no-default-export': 'error',
    },
  },

  // Allow default exports where Next.js or Storybook requires them
  {
    files: [
      'app/**/page.tsx',
      'app/**/layout.tsx',
      'app/**/error.tsx',
      'app/**/not-found.tsx',
      'app/**/loading.tsx',
      'app/**/route.ts',
      'app/**/robots.ts',
      'app/**/sitemap.ts',
      '**/*.stories.tsx',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Explicit react-hooks exhaustive-deps (already set by eslint-config-next but made explicit)
  {
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
])

export default eslintConfig
```

- [ ] **Step 2: Run lint to see the current violation list**

```bash
npm run lint 2>&1 | head -80
```

Note every reported file and rule — these all need to be fixed in Task 3 before committing.

- [ ] **Step 3: Commit**

```bash
git add eslint.config.mjs
git commit -m "chore: harden eslint — import order, no-default-export, exhaustive-deps"
```

---

## Task 3: Fix existing ESLint violations

**Files:**
- Modify: any files reported by `npm run lint` after Task 2

The violations will almost all be `import/order` — missing blank lines between import groups. Fix each file by adding blank lines between the groups.

- [ ] **Step 1: Run lint and see the full list**

```bash
npm run lint
```

- [ ] **Step 2: Fix import order in app/(storefront)/layout.tsx**

Current:
```tsx
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
```

Correct (these are both internal — no change needed to grouping, just verify no external imports are mixed in without blank lines):
```tsx
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
```

If there are external imports (e.g. `import Link from 'next/link'`) above the internal ones, add a blank line between the external and internal groups.

- [ ] **Step 3: Fix import order in any component files that mix external and internal imports without blank lines**

Pattern: anywhere you see external packages (`react`, `next/*`, npm packages) followed immediately by internal (`@/`) or relative (`./`) imports with no blank line — add the blank line.

Example fix:
```tsx
// Before (violation)
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// After (correct)
import { useState } from 'react'

import { Button } from '@/components/ui/button'
```

- [ ] **Step 4: Run lint again — must be clean**

```bash
npm run lint
```

Expected: no errors. Fix any remaining violations before proceeding.

- [ ] **Step 5: Commit all fixed files**

```bash
git add -A
git commit -m "fix: correct import order to satisfy new eslint rules"
```

---

## Task 4: Create barrel files for all component domains

**Files:**
- Create: `components/ui/index.ts`
- Create: `components/layout/index.ts`
- Create: `components/product/index.ts`
- Create: `components/collection/index.ts`
- Create: `components/cart/index.ts`

- [ ] **Step 1: Create components/ui/index.ts**

```ts
export { Badge } from './badge'
export type { BadgeVariant } from './badge'
export { Button } from './button'
export { Price } from './price'
export { ProductCard } from './product-card'
```

- [ ] **Step 2: Create components/layout/index.ts**

```ts
export { Footer } from './footer'
export { Header } from './header'
```

- [ ] **Step 3: Create components/product/index.ts**

```ts
export { ProductForm } from './product-form'
export { VariantSelector } from './variant-selector'
```

- [ ] **Step 4: Create components/collection/index.ts**

```ts
export { SortSelect } from './sort-select'
```

- [ ] **Step 5: Create components/cart/index.ts**

```ts
export {}
```

- [ ] **Step 6: Run lint — should be clean**

```bash
npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add components/ui/index.ts components/layout/index.ts components/product/index.ts components/collection/index.ts components/cart/index.ts
git commit -m "feat: add barrel index.ts to all component domains"
```

---

## Task 5: Update existing imports to use barrels

**Files:**
- Modify: `app/(storefront)/layout.tsx`
- Modify: `app/(storefront)/page.tsx`
- Modify: `app/(storefront)/cart/page.tsx`
- Modify: `app/(storefront)/collections/[handle]/page.tsx`
- Modify: `app/(storefront)/products/[handle]/page.tsx`
- Modify: `app/(storefront)/search/page.tsx`
- Modify: `components/product/product-form.tsx`
- Modify: `components/ui/product-card.tsx`

- [ ] **Step 1: Update app/(storefront)/layout.tsx**

Change:
```tsx
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
```
To:
```tsx
import { Footer, Header } from '@/components/layout'
```

- [ ] **Step 2: Update app/(storefront)/page.tsx**

Change:
```tsx
import { ProductCard } from '@/components/ui/product-card'
```
To:
```tsx
import { ProductCard } from '@/components/ui'
```

- [ ] **Step 3: Update app/(storefront)/cart/page.tsx**

Change:
```tsx
import { Button } from '@/components/ui/button'
import { Price } from '@/components/ui/price'
```
To:
```tsx
import { Button, Price } from '@/components/ui'
```

- [ ] **Step 4: Update app/(storefront)/collections/[handle]/page.tsx**

Change:
```tsx
import { ProductCard } from '@/components/ui/product-card'
import { SortSelect } from '@/components/collection/sort-select'
```
To:
```tsx
import { SortSelect } from '@/components/collection'
import { ProductCard } from '@/components/ui'
```

(Note: `@/components/collection` is internal, `@/components/ui` is also internal — keep them in the same group, alphabetical order by path.)

- [ ] **Step 5: Update app/(storefront)/products/[handle]/page.tsx**

Change:
```tsx
import { ProductForm } from '@/components/product/product-form'
import { Price } from '@/components/ui/price'
```
To:
```tsx
import { ProductForm } from '@/components/product'
import { Price } from '@/components/ui'
```

- [ ] **Step 6: Update app/(storefront)/search/page.tsx**

Change:
```tsx
import { ProductCard } from '@/components/ui/product-card'
```
To:
```tsx
import { ProductCard } from '@/components/ui'
```

- [ ] **Step 7: Update components/product/product-form.tsx**

Change:
```tsx
import { Button } from '@/components/ui/button'
```
To:
```tsx
import { Button } from '@/components/ui'
```

- [ ] **Step 8: Update components/ui/product-card.tsx — switch to relative imports within domain**

Within the same `components/ui/` domain, use relative imports to avoid any future circular-import risk. Change:
```tsx
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { Price } from '@/components/ui/price'
```
To:
```tsx
import { Badge, type BadgeVariant } from './badge'
import { Price } from './price'
```

- [ ] **Step 9: Run lint — must be clean**

```bash
npm run lint
```

Fix any import-order violations surfaced by the new import paths.

- [ ] **Step 10: Commit**

```bash
git add app/ components/
git commit -m "refactor: use barrel imports for all component domains"
```

---

## Task 6: Create scripts/create-component.mjs

**Files:**
- Create: `scripts/create-component.mjs`

- [ ] **Step 1: Create the scripts/ directory and the script file**

```bash
mkdir -p scripts
```

Create `scripts/create-component.mjs`:

```js
#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const arg = process.argv[2]

if (!arg || !arg.includes('/')) {
  console.error('Usage: npm run create:component -- <domain>/<component-name>')
  console.error('Example: npm run create:component -- ui/price-tag')
  process.exit(1)
}

const [domain, componentKebab] = arg.split('/')
const root = fileURLToPath(new URL('..', import.meta.url))
const domainDir = join(root, 'components', domain)

if (!existsSync(domainDir)) {
  console.error(`Domain folder does not exist: components/${domain}/`)
  console.error(`Available domains: ui, layout, product, collection, cart`)
  process.exit(1)
}

const componentName = componentKebab
  .split('-')
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join('')

const componentPath = join(domainDir, `${componentKebab}.tsx`)
const storyPath = join(domainDir, `${componentKebab}.stories.tsx`)
const barrelPath = join(domainDir, 'index.ts')

if (existsSync(componentPath)) {
  console.error(`Already exists: components/${domain}/${componentKebab}.tsx`)
  process.exit(1)
}

const domainTitle = domain.charAt(0).toUpperCase() + domain.slice(1)

writeFileSync(
  componentPath,
  `type ${componentName}Props = {
  className?: string
}

export function ${componentName}({ className = '' }: ${componentName}Props) {
  return (
    <div className={className}>
      {/* ${componentName} */}
    </div>
  )
}
`,
)

writeFileSync(
  storyPath,
  `import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ${componentName} } from './${componentKebab}'

const meta: Meta<typeof ${componentName}> = {
  title: '${domainTitle}/${componentName}',
  component: ${componentName},
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ${componentName}>

export const Default: Story = {
  args: {},
}
`,
)

const exportLine = `export { ${componentName} } from './${componentKebab}'\n`

if (!existsSync(barrelPath)) {
  writeFileSync(barrelPath, exportLine)
} else {
  const existing = readFileSync(barrelPath, 'utf8')
  if (!existing.includes(`'./${componentKebab}'`)) {
    appendFileSync(barrelPath, exportLine)
  }
}

console.log(`✓ components/${domain}/${componentKebab}.tsx`)
console.log(`✓ components/${domain}/${componentKebab}.stories.tsx`)
console.log(`✓ components/${domain}/index.ts updated`)
```

- [ ] **Step 2: Smoke-test the script — create a throwaway component**

```bash
node scripts/create-component.mjs ui/test-widget
```

Expected output:
```
✓ components/ui/test-widget.tsx
✓ components/ui/test-widget.stories.tsx
✓ components/ui/index.ts updated
```

Verify the files exist:
```bash
cat components/ui/test-widget.tsx
cat components/ui/test-widget.stories.tsx
tail -1 components/ui/index.ts
```

Expected `index.ts` last line: `export { TestWidget } from './test-widget'`

- [ ] **Step 3: Test the "domain not found" error case**

```bash
node scripts/create-component.mjs nonexistent/foo 2>&1
```

Expected: `Domain folder does not exist: components/nonexistent/` with exit code 1.

- [ ] **Step 4: Test the "already exists" error case**

```bash
node scripts/create-component.mjs ui/test-widget 2>&1
```

Expected: `Already exists: components/ui/test-widget.tsx` with exit code 1.

- [ ] **Step 5: Delete the throwaway test files**

```bash
rm components/ui/test-widget.tsx components/ui/test-widget.stories.tsx
```

Then remove the last line from `components/ui/index.ts` (the `TestWidget` export).

- [ ] **Step 6: Run lint — must be clean**

```bash
npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add scripts/create-component.mjs
git commit -m "feat: add create:component scaffold script"
```

---

## Task 7: Create scripts/create-lib.mjs

**Files:**
- Create: `scripts/create-lib.mjs`

- [ ] **Step 1: Create the script**

Create `scripts/create-lib.mjs`:

```js
#!/usr/bin/env node
import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const arg = process.argv[2]

if (!arg || !arg.includes('/')) {
  console.error('Usage: npm run create:lib -- <domain>/<module-name>')
  console.error('Example: npm run create:lib -- blog/operations')
  process.exit(1)
}

const [domain, moduleName] = arg.split('/')
const root = fileURLToPath(new URL('..', import.meta.url))
const domainDir = join(root, 'lib', domain)

if (!existsSync(domainDir)) {
  console.error(`Domain folder does not exist: lib/${domain}/`)
  process.exit(1)
}

const filePath = join(domainDir, `${moduleName}.ts`)

if (existsSync(filePath)) {
  console.error(`Already exists: lib/${domain}/${moduleName}.ts`)
  process.exit(1)
}

writeFileSync(filePath, `export {}\n`)

console.log(`✓ lib/${domain}/${moduleName}.ts`)
```

- [ ] **Step 2: Smoke-test the script**

```bash
node scripts/create-lib.mjs blog/test-module
```

Expected: `✓ lib/blog/test-module.ts`

```bash
cat lib/blog/test-module.ts
```

Expected: `export {}`

- [ ] **Step 3: Test error cases**

```bash
node scripts/create-lib.mjs nonexistent/foo 2>&1
```

Expected: `Domain folder does not exist: lib/nonexistent/`

- [ ] **Step 4: Delete the throwaway file**

```bash
rm lib/blog/test-module.ts
```

- [ ] **Step 5: Commit**

```bash
git add scripts/create-lib.mjs
git commit -m "feat: add create:lib scaffold script"
```

---

## Task 8: Add scripts to package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add the two scripts to the "scripts" block**

Open `package.json`. In the `"scripts"` object, add after `"build-storybook"`:

```json
"create:component": "node scripts/create-component.mjs",
"create:lib": "node scripts/create-lib.mjs"
```

Full scripts block should now be:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "format": "prettier --write .",
  "codegen": "dotenv -e .env.local graphql-codegen",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build",
  "create:component": "node scripts/create-component.mjs",
  "create:lib": "node scripts/create-lib.mjs"
},
```

- [ ] **Step 2: Verify the scripts run via npm**

```bash
npm run create:component -- ui/smoke-test
```

Expected:
```
✓ components/ui/smoke-test.tsx
✓ components/ui/smoke-test.stories.tsx
✓ components/ui/index.ts updated
```

- [ ] **Step 3: Clean up smoke test**

```bash
rm components/ui/smoke-test.tsx components/ui/smoke-test.stories.tsx
```

Remove the last line (`export { SmokeTest } from './smoke-test'`) from `components/ui/index.ts`.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "chore: add create:component and create:lib npm scripts"
```

---

## Task 9: Create docs/conventions.md

**Files:**
- Create: `docs/conventions.md`

- [ ] **Step 1: Create the file**

Create `docs/conventions.md`:

```markdown
# Conventions

Canonical reference for this codebase. Check here before adding files.

---

## Folder map

| Directory | What belongs here | What does NOT belong |
|---|---|---|
| `components/ui/` | Reusable presentational primitives — no business logic, no data fetching | Domain-specific components, Server Actions |
| `components/layout/` | Page structure shells — Header, Footer, nav | Feature components, data fetching |
| `components/product/` | Product-domain feature components | Reusable primitives, Shopify queries |
| `components/collection/` | Collection-domain feature components | Reusable primitives |
| `components/cart/` | Cart-domain feature components | Reusable primitives |
| `lib/shopify/operations/` | Data fetch functions — `getProduct`, `getCollection`, etc. | Mutations, Server Actions |
| `lib/shopify/queries/` | `.graphql` source files only | TypeScript, generated code |
| `lib/shopify/types/generated/` | Auto-generated by codegen — never edit manually | Anything hand-written |
| `lib/shopify/types/index.ts` | Hand-written exported types — `Cart`, `Product`, `Variant` | Generated types |
| `lib/cart/actions.ts` | Server Actions for cart mutations | Read-only operations |
| `lib/blog/` | Blog data helpers and stubs | Shopify queries |
| `lib/seo/` | SEO utility helpers | Data fetching |

---

## Naming rules

| Thing | Convention | Example |
|---|---|---|
| File names | kebab-case | `product-card.tsx`, `sort-select.tsx` |
| Component exports | PascalCase named export | `export function ProductCard(` |
| Server Action exports | camelCase + "Action" suffix | `addToCartAction`, `getCartAction` |
| Lib operation exports | camelCase verb + noun | `getProduct`, `getCollection` |

File name and export name are different things. `product-card.tsx` exports `ProductCard`.

---

## Component anatomy

Exact order inside every component file:

1. `'use client'` directive — only if needed (see decision rule below)
2. External imports — `react`, `next/*`, npm packages
3. Internal imports — `@/lib/*`, `@/components/*`
4. Relative imports — `./foo`, `../bar` (within-domain only)
5. Type definitions — `type FooProps = { ... }`
6. Module-level constants — variant maps, style lookup objects
7. Component function — `export function Foo(...)`
8. `Foo.displayName = 'Foo'` — only for `React.forwardRef` components; omit otherwise
9. No default export

---

## `'use client'` decision rule

Add `'use client'` only if the component:
- Handles user events (`onClick`, `onChange`, form submission), OR
- Uses browser-only APIs (`useState`, `useEffect`, `useRef`, `useTransition`)

If in doubt, omit it. Server Components are the default.

## `'use server'` rule

Only on Server Actions files (`lib/*/actions.ts`). Never on a component file.

---

## Styling rules

- Tailwind utilities only — no CSS modules, no `style={{}}`, no inline hex values
- Use token class names: `bg-background`, `text-primary`, `ring-ring` — not `bg-[#f5f0e8]`
- Build className with array pattern: `[base, conditional, extra].filter(Boolean).join(' ')`
- Palette is warm/botanical — never introduce cool grays

---

## Where new things go

| I'm adding a… | Put it in… |
|---|---|
| Reusable UI primitive (button, badge, price display) | `components/ui/` |
| Domain feature component | `components/<domain>/` |
| Page layout wrapper | `components/layout/` |
| Shopify data fetch function | `lib/shopify/operations/<domain>.ts` |
| Shopify GraphQL query | `lib/shopify/queries/<domain>.graphql` |
| Cart/checkout mutation | `lib/cart/actions.ts` |
| New exported type | `lib/shopify/types/index.ts` |
| SEO helper | `lib/seo/` |

---

## Scaffolding shortcuts

```bash
npm run create:component -- ui/my-component       # component + story + barrel update
npm run create:component -- product/my-feature    # domain component + story + barrel update
npm run create:lib -- blog/operations             # new lib module
```

---

## Import style

- Use barrel imports for cross-domain component imports: `@/components/ui`, `@/components/product`
- Use relative imports for within-domain: `./badge`, `./price` (avoids circular import risk)
- Use direct file paths for `lib/` imports: `@/lib/cart/actions`, `@/lib/shopify/operations/product`
- `lib/` does NOT have barrels — import by explicit path
```

- [ ] **Step 2: Verify it renders correctly in your editor (scan for broken markdown)**

Quick visual check — make sure all table pipes align and code blocks open/close correctly.

- [ ] **Step 3: Commit**

```bash
git add docs/conventions.md
git commit -m "docs: add conventions reference"
```

---

## Task 10: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add @docs/conventions.md reference at the very top of CLAUDE.md**

The file currently starts with:
```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
```

Change to:
```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@docs/conventions.md
```

- [ ] **Step 2: Add "Do not" section after the existing ## Commands section**

After the closing ``` of the Commands block, add:

```markdown
## Do not

These anti-patterns are explicitly banned — they override any default AI behavior:

- No default exports on components or lib modules (Next.js special files are excepted)
- No `any` type — use `unknown` and narrow, or define a proper type
- No raw hex/rgb values in className — use design token class names only (`text-primary` not `text-[#3d3d35]`)
- No `'use client'` on parent/wrapper components — push it down to the interactive leaf
- No new CSS modules, styled-components, or `style={{}}` attributes
- No direct imports from `lib/shopify/types/generated/` — import via `lib/shopify/types/index.ts`
- No creating new top-level directories in `components/` or `lib/` without updating `docs/conventions.md`

## Before adding a file

1. Does a similar file already exist that should be extended instead?
2. Which directory does it belong in? (check `docs/conventions.md` folder map)
3. Does it need a Storybook story? (yes if it lives in `components/`)
4. Scaffold it: `npm run create:component -- <domain>/<name>` or `npm run create:lib -- <domain>/<name>`
```

- [ ] **Step 3: Run lint — must be clean**

```bash
npm run lint
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add conventions reference and do-not rules to CLAUDE.md"
```

---

## Final verification

- [ ] **Step 1: Full lint pass**

```bash
npm run lint
```

Expected: zero errors, zero warnings (or only pre-existing warnings unrelated to this work).

- [ ] **Step 2: Smoke-test the full scaffold flow**

```bash
npm run create:component -- ui/tag-label
```

Expected files created:
- `components/ui/tag-label.tsx` — named export `TagLabel`, no default export
- `components/ui/tag-label.stories.tsx` — `export default meta`, named `Default` story
- `components/ui/index.ts` — last line is `export { TagLabel } from './tag-label'`

```bash
npm run lint
```

Expected: clean (the generated files must pass lint).

Cleanup:
```bash
rm components/ui/tag-label.tsx components/ui/tag-label.stories.tsx
```

Remove the `TagLabel` line from `components/ui/index.ts`.

- [ ] **Step 3: Verify CLAUDE.md loads conventions**

Open a new Claude Code session in this project and confirm `docs/conventions.md` is loaded via the `@docs/conventions.md` reference. The conventions should appear in the context window.
