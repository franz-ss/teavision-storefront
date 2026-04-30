# Best Practices Setup Design

**Date:** 2026-04-30  
**Scope:** ESLint hardening, conventions documentation, scaffolding scripts, barrel files, CLAUDE.md enhancements  
**Driver:** Solo project — prevent convention drift over time, across AI sessions, and as the codebase grows

---

## Problem

The project has solid foundations (TypeScript strict, Prettier, domain-driven component folders, named exports, Tailwind design tokens) but conventions exist only in developer memory and CLAUDE.md prose. Three failure modes:

1. Returning after time away and forgetting where things go or how they're structured
2. AI assistants drifting from established patterns (no default exports, no 'use client' on parents, token class names only)
3. Project grows and inconsistent patterns make navigation harder

## Solution Overview

Three-layer approach — no pre-commit hooks (solo dev, not worth the friction):

1. **ESLint hardening** — automated violation detection on `npm run lint`
2. **Plain Node scaffolding scripts** — correct file shape on every new component/lib module
3. **Conventions doc + CLAUDE.md additions** — canonical reference for humans and AI

---

## 1. ESLint Hardening

### New dependencies

- `eslint-plugin-import` — import ordering and no-default-export
- `eslint-plugin-react-hooks` — exhaustive deps (may already be present via `eslint-config-next`, make it explicit)

### Rule additions to `eslint.config.mjs`

**Import ordering** (`import/order`):
Groups enforced in this sequence, blank line between groups:
1. Node built-ins (`node:fs`, `node:path`)
2. External packages (`react`, `next`, `next/*`)
3. Internal path aliases (`@/lib/*`, `@/components/*`)
4. Relative imports (`./button`, `../ui/badge`)

**No default exports** (`import/no-default-export`):
- Applied to all `components/**/*.tsx` and `lib/**/*.ts` files
- Override (allow default exports) for: `app/**/page.tsx`, `app/**/layout.tsx`, `app/**/error.tsx`, `app/**/not-found.tsx`, `app/**/loading.tsx`, `app/**/route.ts`, `app/**/robots.ts`, `app/**/sitemap.ts`, `*.stories.tsx`

**React Hooks exhaustive deps** (`react-hooks/exhaustive-deps`):
- Set to `warn` — flags stale closures without blocking the build

### What does NOT change

- No `--max-warnings` flag on the lint script
- No pre-commit hook
- No CI lint gate
- Storybook and Next.js recommended rules remain unchanged

---

## 2. Scaffolding Scripts

Two scripts in `scripts/`. Added to `package.json` as:
```json
"create:component": "node scripts/create-component.mjs",
"create:lib": "node scripts/create-lib.mjs"
```

### `scripts/create-component.mjs`

**Usage:** `npm run create:component -- ui/price-tag`

**Argument:** `<domain>/<component-name>` in kebab-case

**Behaviour:**
1. Validates the domain folder (`components/<domain>/`) exists — exits with error if not
2. Infers PascalCase name from kebab-case arg (`price-tag` → `PriceTag`)
3. Creates `components/<domain>/<component-name>.tsx` with:
   - No directive (Server Component by default)
   - Correct import order skeleton
   - Empty props type (`type <Name>Props = {}`)
   - Named export function (no `displayName` — only needed for `forwardRef` components, added manually when needed)
4. Creates `components/<domain>/<component-name>.stories.tsx` with:
   - `export default meta` (the Meta object — required by Storybook)
   - `Meta` and `StoryObj` typed to the component
   - `autodocs` tag
   - One named story export (`export const Default: Story = { args: {} }`)
5. Updates `components/<domain>/index.ts` — appends `export { <Name> } from './<component-name>'`
   - Creates `index.ts` if it doesn't exist

**Does NOT:**
- Create new domain folders (intentional — prevents typo-driven orphan directories)
- Overwrite existing files

### `scripts/create-lib.mjs`

**Usage:** `npm run create:lib -- blog/operations`

**Argument:** `<domain>/<module-name>` in kebab-case

**Behaviour:**
1. Validates the domain folder (`lib/<domain>/`) exists — exits with error if not
2. Creates `lib/<domain>/<module-name>.ts` with a placeholder export
3. Does NOT create or update any barrel file

---

## 3. Barrel Files

Each `components/` subdomain gets an `index.ts` re-exporting everything in that subdomain.

**Scope:** `components/ui/`, `components/layout/`, `components/product/`, `components/collection/`, `components/cart/`

**Pattern:**
```ts
export { Badge } from './badge'
export { Button } from './button'
export { Price } from './price'
export { ProductCard } from './product-card'
```

**Result:** imports become `@/components/ui` instead of `@/components/ui/button`

**`lib/` does NOT get barrels.** Operations and actions are imported by explicit path to keep the dependency graph readable and avoid circular import risk.

---

## 4. `docs/conventions.md`

Single canonical reference. Short enough to scan in 2 minutes.

### Sections

**Folder map** — one-line description per directory, what belongs, what doesn't:
- `components/ui/` — reusable presentational primitives, no business logic, no data fetching
- `components/layout/` — page structure (Header, Footer, nav shells)
- `components/product/` — product-domain feature components
- `components/collection/` — collection-domain feature components
- `components/cart/` — cart-domain feature components
- `lib/shopify/operations/` — data fetch functions (getProduct, getCollection, etc.)
- `lib/shopify/queries/` — `.graphql` source files only
- `lib/shopify/types/generated/` — codegen output, never edit manually
- `lib/shopify/types/index.ts` — hand-written exported types (Cart, Product, Variant)
- `lib/cart/actions.ts` — Server Actions for cart mutations
- `lib/blog/` — blog data helpers and stubs
- `lib/seo/` — SEO utility helpers

**Naming rules:**
- File names: kebab-case (`product-card.tsx`, `sort-select.tsx`)
- Component exports: PascalCase named exports (`ProductCard`, `SortSelect`)
- Server Action exports: camelCase verb + "Action" suffix (`addToCartAction`, `getCartAction`)
- Lib operation exports: camelCase verb + noun (`getProduct`, `getCollection`)
- These are different things — kebab file, PascalCase export

**Component anatomy (exact order):**
1. `'use client'` directive (only if needed)
2. External imports (react, next, packages)
3. Internal imports (`@/lib/*`, `@/components/*`)
4. Type definitions (`type FooProps = { ... }`)
5. Module-level constants (variant maps, style lookup objects)
6. Component function
7. `ComponentName.displayName = 'ComponentName'` — only when using `React.forwardRef`; omit for plain function components
8. No default export

**`'use client'` decision rule:**
Add `'use client'` only if the component handles user events (`onClick`, `onChange`, form submission) or uses browser-only APIs (`useState`, `useEffect`, `useRef`, `useTransition`). If in doubt, omit it — Server Components are the default.

**`'use server'` rule:**
Only on Server Actions files (`lib/*/actions.ts`). Never on a component file.

**Styling rules:**
- Tailwind utilities only — no CSS modules, no `style={{}}`, no inline hex values
- Use token class names: `bg-background`, `text-primary`, `ring-ring` — not `bg-[#f5f0e8]`
- className array pattern: `[base, conditional, extra].filter(Boolean).join(' ')`
- Palette is warm/botanical — never introduce cool grays

**Where new things go (decision table):**

| I'm adding a… | Put it in… |
|---|---|
| Reusable UI primitive (button, badge, price) | `components/ui/` |
| Domain feature component | `components/<domain>/` |
| Page layout wrapper | `components/layout/` |
| Shopify data fetch function | `lib/shopify/operations/<domain>.ts` |
| Shopify GraphQL query | `lib/shopify/queries/<domain>.graphql` |
| Cart/checkout mutation | `lib/cart/actions.ts` |
| New exported type | `lib/shopify/types/index.ts` |
| SEO helper | `lib/seo/` |

**Scaffolding shortcuts:**
```bash
npm run create:component -- ui/my-component       # new UI component + story + barrel update
npm run create:component -- product/my-feature    # new domain component + story + barrel update
npm run create:lib -- blog/operations             # new lib module
```

---

## 5. CLAUDE.md Additions

### Add at top of file
```
@docs/conventions.md
```

### Add "Do not" section
Explicit anti-patterns — these override any default AI behavior:

- No default exports on components or lib modules (Next.js special files excepted)
- No `any` type — use `unknown` and narrow, or define a proper type
- No raw hex/rgb values in className — use design token class names only
- No `'use client'` on parent/wrapper components — push it to the interactive leaf
- No new CSS modules, styled-components, or `style={{}}` attributes
- No direct imports from `lib/shopify/types/generated/` — import via `lib/shopify/types/index.ts`
- No creating new top-level directories in `components/` or `lib/` without updating `docs/conventions.md`

### Add "Before adding a file" checklist
1. Does a similar file already exist that should be extended instead?
2. Which directory does it belong in? (check `docs/conventions.md` folder map)
3. Does it need a Storybook story? (yes if it lives in `components/`)
4. Use `npm run create:component` or `npm run create:lib` to scaffold it

### Add scripts reference
```
npm run create:component -- <domain>/<name>   # scaffold component + story
npm run create:lib -- <domain>/<name>          # scaffold lib module
```

---

## What This Does NOT Include

- Pre-commit hooks (Husky, lint-staged) — solo project, not worth the friction
- CI/CD lint gates
- Absolute import enforcement beyond the existing `@/` alias
- Testing requirements beyond Storybook stories
- Any changes to the Prettier config (already correct)
- Any changes to TypeScript config (already strict)
- Plop.js or other scaffolding frameworks
- New component domains (cart/, seo/ are already placeholders)
