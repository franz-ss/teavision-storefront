# Teavision Storefront — Project Initialization Design

**Date:** 2026-04-28
**Status:** Approved
**Scope:** Next.js project scaffold with wireframe routes — no Shopify integration in this phase.

---

## Approach

Scaffold from scratch using `create-next-app`. The Vercel Commerce template was considered and rejected: it uses its own Shopify client rather than GraphQL Codegen, and its own design primitives rather than the stack defined in the project reference. Starting from scratch means every architectural decision matches the documented approach from day one.

---

## Foundation & Tooling

**Bootstrapped with:** `create-next-app@latest` — TypeScript, Tailwind CSS, ESLint, App Router, no `src/` directory, no import alias changes from default.

**Added on top:**
- `prettier` + `prettier-plugin-tailwindcss` — class sorting; `.prettierrc` committed to repo
- `.env.local` stub with empty keys: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_ADMIN_API_ACCESS_TOKEN`
- `next.config.ts` — Shopify CDN domain added to `images.remotePatterns`; `experimental.dynamicIO: true` enabled to support the `'use cache'` directive

**Not included in this phase:** shadcn/ui (deferred), Shopify client (deferred), GraphQL Codegen (deferred), cart drawer (deferred).

**Installed skills (applied throughout):**
- `vercel-react-best-practices` — parallel data fetching, no barrel imports, `React.cache()` for deduplication, Server Components by default
- `next-cache-components` — `'use cache'` directive with `cacheTag()` / `revalidateTag()` instead of `unstable_cache`
- `web-design-guidelines` — accessibility, focus states, semantic HTML, typography, touch targets
- `building-components` — compositional component APIs, CSS custom properties, no hard-coded values

---

## Folder Structure

```
app/
  (storefront)/
    page.tsx                        # Home — static Server Component
    products/[handle]/
      page.tsx                      # PDP — cached Server Component
    collections/[handle]/
      page.tsx                      # PLP — cached Server Component
    cart/
      page.tsx                      # Cart — Server Component (wireframe)
  api/                              # Webhook handlers — empty for now
  layout.tsx                        # Root layout (html, body, fonts)

components/
  layout/
    header.tsx                      # Wireframe header
    footer.tsx                      # Wireframe footer
  product/                          # Product-specific components (empty)
  cart/                             # Cart components (empty — drawer deferred)
  ui/                               # Design system primitives (empty)

lib/
  shopify/                          # Storefront API client — stubs only
  cart/                             # Cart server actions — stubs only
  seo/                              # JSON-LD builders — empty
```

**No barrel exports** (`index.ts` re-exports) in any `components/` subfolder. Import directly from the file. This avoids the barrel-import bundle problem identified in `vercel-react-best-practices`.

---

## Routes

### Home (`/`)
- Fully static Server Component — no data fetching in this phase
- Placeholder sections: hero, featured collections strip, featured products grid
- Hardcoded placeholder content; real data wired in a later phase
- `text-wrap: balance` on all headings (web-design-guidelines)

### PDP (`/products/[handle]`)
- Server Component
- `'use cache'` directive at the data-fetch level with `cacheTag('product')` — enables webhook-driven revalidation later
- Product data and related products fetched in parallel, not sequential awaits (react-best-practices: eliminating waterfalls)
- Wireframe sections: image gallery placeholder, title + price, variant selector (Client Component), add-to-cart button, description
- All `<img>` placeholders have explicit `width` and `height` to prevent CLS (web-design-guidelines)

### PLP (`/collections/[handle]`)
- Server Component
- `'use cache'` directive with `cacheTag('collection')`
- Collection and products fetched in parallel
- Wireframe sections: collection header, product grid, filter sidebar placeholder

### Cart (`/cart`)
- Server Component wireframe — hardcoded placeholder content only (no real cart data in this phase)
- Wireframe sections: line items list, quantity controls, subtotal, checkout CTA
- Checkout CTA is a placeholder `<a>` — real `cart.checkoutUrl` wired in when Shopify integration lands
- Cart drawer deferred to a later phase

---

## Component Conventions

Derived from `building-components` and `web-design-guidelines`:

- **Semantic HTML first:** `<button>` for actions, `<Link>` for navigation — never `<div onClick>`
- **Focus states required:** all interactive elements get `focus-visible:ring-2 focus-visible:ring-offset-2` or equivalent — never `outline-none` without a replacement
- **Accessibility built in:** icon-only buttons get `aria-label`; decorative icons get `aria-hidden="true"`; form controls get `<label>` or `aria-label`
- **Touch targets:** `touch-action: manipulation` on interactive elements to prevent double-tap zoom delay
- **Compositional naming:** compound components use Root / Trigger / Content / Item naming convention (Radix/shadcn pattern) — prepares for when the design system is built out
- **CSS custom properties for theming:** no hard-coded colour or spacing values in components — use Tailwind tokens or CSS variables
- **No barrel exports:** import components directly from their file

---

## Caching Strategy

Driven by `next-cache-components`:

| Route | Caching | Tag |
|---|---|---|
| Home | Static (build time) | — |
| PDP | `'use cache'` | `product`, `product-{handle}` |
| PLP | `'use cache'` | `collection`, `collection-{handle}` |
| Cart | Dynamic (no cache) | — |

`cacheLife('hours')` profile used for product/collection data as a starting point. Webhook handlers (added in a later phase) call `revalidateTag('product-{handle}')` on Shopify product update events.

---

## What Is Not In Scope

- Shopify Storefront API integration
- GraphQL Codegen setup
- shadcn/ui
- Cart drawer
- Authentication (Customer Account API)
- SEO infrastructure (metadata, JSON-LD, sitemap)
- Analytics
- Third-party integrations (reviews, popups, email)
- Webhook handlers
