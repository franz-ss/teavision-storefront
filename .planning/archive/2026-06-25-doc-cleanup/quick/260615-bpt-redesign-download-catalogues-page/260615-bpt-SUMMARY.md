---
quick_id: 260615-bpt
slug: redesign-download-catalogues-page
date: 2026-06-15
status: complete
commit: 40e9e7a
---

# Quick Task 260615-bpt: Redesign /pages/download-catalogues

## What changed

`/pages/download-catalogues` previously fell through the `[...slug]` catch-all
(generic hero + raw Shopify rich-text body + boilerplate support CTA). It now has
a bespoke, conversion-focused route matching the other service pages.

### Added — `src/app/(storefront)/pages/download-catalogues/`
- `page.tsx` — route with indexable `generateMetadata` (title, description, canonical).
- `_lib/data.ts` — hero copy, six catalogues, CTA copy.
- `_components/page-content.tsx` — composition root + JSON-LD.
- `_components/hero-section.tsx` — brand band, gold eyebrow, Fraunces headline, three credibility badges (HACCP, ACO Organic, Private Label).
- `_components/catalogues-section.tsx` + `catalogue-row.tsx` — single-column download index of the six PDFs in `public/vendor/catalogues/`, each with a typographic brand-green cover plate (gold lucide icon + Fraunces label), production description, `PDF · size` meta, and an ink Download button (`target=_blank`, `download`). The ACO certificate uses a distinct gold plate.
- `_components/json-ld.tsx` — BreadcrumbList + ItemList of DigitalDocument downloads.

### Changed
- `src/app/(storefront)/pages/[...slug]/page.tsx` — added `download-catalogues` to `RESERVED_HANDLES` so the catch-all no longer statically generates the path.

## Decisions honored
- Design approved via visual mockup before implementation.
- Kept existing copy; matched the production page closely.
- Curated-pack CTA links to `/pages/contact` (no new inline form).
- Typographic cover plates (no new image assets).

## Deviation from production (flagged)
Production lists 5 catalogues; this page includes all **6** PDFs that exist in the
repo and the header mega-nav, adding "Beverage, Natural Sweeteners, Juices"
(`beverage-rtd-catalogue.pdf`) so the page is consistent with the site's own
catalogue navigation. Its one-line description is the only non-production copy.
Trivially reversible by removing the `beverage` entry from `_lib/data.ts` if the
client prefers a strict 5-catalogue match.

## Verification
- `pnpm lint` clean; `pnpm typecheck` clean; pre-commit component-contract tests (37) pass.
- Dev server: `/pages/download-catalogues` returns 200, title "Explore & Download Our Catalogues", six download rows, ACO + Beverage present.
- Desktop screenshot matches the approved mockup; ACO plate renders gold with brand-deep text; CTA buttons route to `/pages/contact` and `/collections`; a catalogue PDF resolves 200 `application/pdf`.
