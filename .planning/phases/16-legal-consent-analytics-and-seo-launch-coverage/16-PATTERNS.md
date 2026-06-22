# Phase 16: Pattern Map

**Mapped:** 2026-06-23
**Purpose:** Closest local analogs for Phase 16 legal, consent, analytics, and SEO launch planning.

## Route And Policy Patterns

| New Surface | Closest Existing Analog | Notes For Executor |
|-------------|-------------------------|--------------------|
| Code-owned legal policy pages under `src/app/(storefront)/pages/*/page.tsx` | `src/app/(storefront)/pages/terms-conditions/page.tsx` and `src/app/(storefront)/pages/terms-conditions/_components/terms-conditions-content.tsx` | Keep page shells server-rendered. Use `withNoindexRobots`, canonical metadata, `Section.Root`, and token classes. Do not rely on Shopify page content for launch availability. |
| Generic Shopify page exclusion | `src/app/(storefront)/pages/[...slug]/page.tsx` | Extend `RESERVED_HANDLES` so legal policy handles do not fall through to Shopify content. Dynamic route `params` already follows the Next 16 promise pattern. |
| Policy profile vocabulary | `src/app/(storefront)/pages/[...slug]/_lib/page-profile.ts` and `_lib/compliance.ts` | Reuse existing policy/support vocabulary where useful, but create a central `src/lib/legal/policies.ts` registry for Phase 16 route, footer, redirect, and evidence checks. |
| Footer legal link source | `src/components/layout/footer/data.ts` | Replace legacy external terms URL and partial policy links with registry-aligned canonical `/pages/*` entries. |

## Consent And Interaction Patterns

| New Surface | Closest Existing Analog | Notes For Executor |
|-------------|-------------------------|--------------------|
| Consent banner in storefront shell | `src/app/(storefront)/layout.tsx` plus existing header/footer layout pattern | Keep the layout server-rendered and mount only a small client leaf for banner/preferences. Do not put `'use client'` on the layout. |
| Preference dialog | `src/components/ui/dialog/dialog.tsx` | Use existing `Dialog`, `Button`, `Checkbox` or `Radio`, and focus-ring behavior. Icon-only close controls need accessible labels. |
| Cookie preferences route | `src/app/(storefront)/pages/cookie-preferences/page.tsx` | Server page shell with a client preference component. The page is the stable URL for changing preferences after first choice. |
| Consent persistence | New `src/lib/consent/storage.ts` | Store only category booleans and version/timestamp. Do not store PII or secrets. Default analytics and marketing to denied. |

## Analytics Patterns

| New Surface | Closest Existing Analog | Notes For Executor |
|-------------|-------------------------|--------------------|
| Cart mutation signal | `src/lib/cart/events.ts`, `src/components/product/use-add-to-cart.ts`, `src/app/(storefront)/cart/_components/line-actions.tsx` | Use successful cart actions and `CART_CHANGED_EVENT` as local hooks. Do not send production events in tests. |
| Checkout-start event | `src/app/(storefront)/cart/_components/checkout-form.tsx` | Emit checkout-start on local form submit before `/cart/checkout`. Do not instrument purchase/order without owner approval. |
| Lead events | `src/lib/contact/actions.ts` and contact/newsletter client forms | Emit non-PII success events only. Never forward name, email, phone, message, company, product list, or form body text into analytics payloads. |
| Product page analytics metadata | `src/app/(storefront)/products/[handle]/_lib/shopify-analytics.ts` and product page script placement | Treat existing Shopify analytics context as input to the new consent-aware adapter, not as final destination loading. Review current `next/script` placement before adding destinations. |
| CSP analytics hosts | `src/lib/security/headers.ts` and `src/lib/security/headers.test.ts` | Add GA4/GTM/Meta/Klaviyo/Shopify pixel hosts only when env-gated destinations and consent tests exist. Preserve report-only CSP from Phase 15. |

## SEO And Evidence Patterns

| New Surface | Closest Existing Analog | Notes For Executor |
|-------------|-------------------------|--------------------|
| Robots and sitemap launch flip | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/lib/seo/noindex.ts` | Preserve `DISABLE_INDEXING`. Verify both disabled and enabled launch states. |
| Existing noindex contract | `scripts/component-contracts/noindex-mode.test.mjs` | Extend or pair with `scripts/seo/probe-launch-seo.mjs` for legal routes, canonical URLs, sitemap inclusion, robots output, redirects, and structured-data safety. |
| Site URL/canonical helpers | `src/lib/seo/site-url.ts` | Use central helpers for canonical URL construction. Do not hard-code production URL strings outside registry/test expectations unless the helper is unavailable. |
| Safe JSON-LD output | `src/lib/seo/serialize-inline-json.ts`, `src/app/(storefront)/products/[handle]/page.tsx` | Route evidence should verify structured-data presence/safety without rewriting product JSON-LD. |

## Required Local Docs

- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`
- `node_modules/next/dist/docs/01-app/02-guides/scripts.md`

