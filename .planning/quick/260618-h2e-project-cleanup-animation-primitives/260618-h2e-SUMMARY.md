---
status: complete
date: 2026-06-18
commit: 9c7a54b
---

# Quick Task 260618-h2e Summary

## Completed

- Added `AnimatedElement` as the generic UI primitive for decorative animated media.
- Updated homepage catalogue, newsletter, business, and blog newsletter bands to use generic animation variants.
- Removed retired homepage artwork helper folders, duplicate image aliases, and the obsolete design-bundle extraction script.
- Preserved the current simplified 404 page without reintroducing the retired illustration helper.
- Updated conventions, design guidance, active planning notes, and cleanup documentation for the CMS-ready path.

## Removed Components and Files

- Legacy brush illustration helper under `src/components/homepage/`.
- Legacy curved-label helper under `src/components/homepage/`.
- Temporary content-named animated image helper under `src/components/homepage/`.
- Retired duplicate PNG aliases under `public/images/`.
- Retired one-off extraction script under `scripts/`.

## Breaking Changes

- Consumers must import `AnimatedElement` from `@/components/ui` instead of retired homepage artwork helpers.
- Old duplicate image aliases are unavailable; current sections use the semantic asset filenames already present in `public/images/`.

## Migration Considerations

- CMS content should provide decorative media metadata separately from section copy and CTA data.
- Use generic animation variants, currently `float-primary` and `float-secondary`, rather than naming schema fields after specific content.
- Future CMS-backed sections can swap image URLs, dimensions, and responsive sizing without changing the animation primitive.

## Verification

- Stale-reference scans for retired helper names and old asset aliases: no matches.
- `pnpm vitest run "src/app/(storefront)/blogs/[blog]/_components/listing-content.test.tsx"`
- `pnpm lint`
- `pnpm typecheck`
- Commit hook: `pnpm lint` and `pnpm test:contracts`
