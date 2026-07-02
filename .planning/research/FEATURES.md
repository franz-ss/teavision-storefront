# Project Research - Features

**Milestone:** v1.6 Sanity CMS Homepage Integration
**Date:** 2026-07-02

## Table Stakes

### Homepage Singleton

Editors need one obvious "Home page" document in `../teavision-cms`.

Required behavior:

- A singleton document, likely `_id == "homePage"` and `_type == "homePage"`.
- A Studio structure item that opens the singleton directly.
- No generic list of multiple home pages.
- Initial content seeded from the current code-owned homepage constants.
- Required sections and field validation strong enough to preserve current layout quality.

### Fixed Section Model

The first pass should be a typed section model, not a free-form page builder.

Required behavior:

- Hero
- Product range
- Newsletter intro
- Private label
- Organic herbs
- Supply chain
- Certification coverage
- Supply chain protection
- Testimonials
- Tea Journal intro/settings
- Contact intro
- Catalogue CTA
- FAQ
- SEO

This maps directly to existing components under `src/components/homepage`.

### Storefront Read Model

The storefront needs a typed app-facing model that hides Sanity nullability from components.

Required behavior:

- GROQ query in `src/lib/sanity/queries/homepage.ts`.
- Operation boundary in `src/lib/homepage/operations.ts`.
- Types in `src/lib/homepage/types.ts`.
- Section components receive explicit `content` props.
- Static fallback exists only as a controlled migration path until the singleton is seeded.

### Images

Required behavior:

- Reuse existing `imageWithAlt`.
- Query image `asset`, `metadata.dimensions`, `metadata.lqip`, `crop`, and `hotspot`.
- Build URLs from the full Sanity image field, not just the asset reference, so crop/hotspot survive.
- Keep stable dimensions/aspect ratios to prevent CLS.
- Enforce alt text in Studio for meaningful editor-owned images.
- Preserve the v1.5 homepage hero LCP strategy.

### SEO

Required behavior:

- Keep current homepage title, description, canonical `/`, noindex launch gate, and Open Graph behavior as fallbacks.
- If CMS SEO fields are enabled, generate metadata through a cached helper.
- Never allow stega/source-map characters in metadata.
- Keep Organization and WebSite JSON-LD code-owned unless there is a specific schema requirement.
- Verify one visible H1 and crawlable HTML.

### Revalidation

Required behavior:

- Extend the existing Sanity webhook route.
- For `_type == "homePage"`, revalidate `home`, `home-root`, and `sanity-home`.
- Keep blog tags untouched.
- Avoid logging raw document content or secrets.

### Preview

Required behavior:

- Secure Draft Mode route for `/`.
- Read token required for draft reads.
- `useCdn: false` and draft perspective for preview.
- Disable Draft Mode route with `prefetch={false}` wherever linked.
- Presentation / Visual Editing optional after baseline Draft Mode works.

## Differentiators Worth Including

- Editor-friendly previews on nested objects.
- Section enable/disable toggles with fixed order.
- URL validators that allow only safe site-relative URLs, `https://`, `mailto:`, and `tel:`.
- Length limits for headings, card titles, CTA labels, FAQ answers, and testimonials.
- A seed script that can update the singleton without destructive recreation.
- Verification scripts that compare rendered metadata and SEO/PageSpeed baselines before rollout.

## Anti-Features

Avoid these in v1.6:

- Generic page-builder arrays with arbitrary section order.
- CMS-owned Shopify product, price, cart, checkout, discount, or inventory data.
- Client-side content fetching or client-side homepage state.
- A second Sanity Studio inside the storefront app.
- New visual styling controls in Sanity.
- Deprecated `next/image` `priority`.
- A hidden fallback that silently serves old static content forever after CMS cutover.
- Any launch path that accepts lower SEO or PageSpeed scores.

## Open Questions For Requirements

- Should v1.6 include full Presentation Tool / Visual Editing, or stop at secure Draft Mode?
- Should CMS editors be allowed to enable/disable sections in v1, or only edit content in the fixed current section set?
- Should SEO fields be editable in Sanity in v1, or should v1 keep metadata code-owned with CMS support deferred?
- Should the hardcoded homepage constants remain as an explicit emergency fallback after launch, or only as seed/test fixtures?

## Sources

- Local plan: `docs/sanity-homepage-cms-integration-plan.md`
- Storefront homepage: `src/app/(storefront)/page.tsx`
- Storefront content constants: `src/components/homepage/content.ts`
- Sanity: https://www.sanity.io/docs/nextjs/introduction
- Sanity: https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router
- Sanity: https://www.sanity.io/docs/apis-and-sdks/presenting-images
