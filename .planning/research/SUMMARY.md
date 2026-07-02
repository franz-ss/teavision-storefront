# Project Research - Summary

**Milestone:** v1.6 Sanity CMS Homepage Integration
**Date:** 2026-07-02

## Stack Additions

No first-pass production dependency additions are required.

Use the existing `next-sanity`, `@sanity/image-url`, `@portabletext/react`, Next 16 Cache Components, and sibling Sanity Studio 5 stack. Add Visual Editing / Presentation configuration only if selected for v1.6; otherwise ship secure Draft Mode plus webhook revalidation first.

## Feature Table Stakes

- Homepage singleton in `../teavision-cms`.
- Fixed section fields mapped to current homepage components.
- Seed script from current `src/components/homepage/content.ts`.
- Typed storefront read model in `src/lib/homepage`.
- GROQ query in `src/lib/sanity/queries/homepage.ts`.
- Existing homepage components refactored to receive content props.
- Sanity image handling that preserves crop/hotspot, dimensions, LQIP, and LCP discipline.
- Metadata/SEO behavior equal to or better than the current static baseline.
- Webhook revalidation for `home`, `home-root`, and `sanity-home`.
- Secure Draft Mode preview for `/`.
- Verification gate proving no SEO or PageSpeed score regression.

## Architecture Recommendation

Prefer a conservative three-boundary implementation:

1. `../teavision-cms` owns schema, singleton structure, editor validation, and seed scripts.
2. `src/lib/homepage` owns fetching, reshaping, fallback policy, cache tags, and app-facing types.
3. `src/components/homepage` stays presentational and receives already-normalized props.

Keep current manual cache/webhook behavior. Defer `defineLive` until after the no-regression migration ships, because it would change the cache model and introduce a broader live-preview surface.

## Watch Out For

- Any lower SEO or PageSpeed score blocks rollout.
- Hero image LCP is the most sensitive performance risk.
- Draft/stega content must never enter metadata, sitemap, robots, or JSON-LD.
- Sanity schema names are global even when filenames are folder-scoped.
- The existing `seo` object currently validates blog-only canonical paths.
- Static fallback should be explicit and temporary, not a permanent hidden escape hatch.

## Requirement Implications

Requirements should be grouped around:

- CMS schema and seed.
- Storefront data boundary.
- Component mapping and content parity.
- Image and performance safeguards.
- SEO and metadata safeguards.
- Preview and revalidation.
- Verification and rollout.

The strict no-regression rule belongs in the requirements, the roadmap success criteria, and every phase plan that touches homepage rendering, images, metadata, preview, or cache behavior.
