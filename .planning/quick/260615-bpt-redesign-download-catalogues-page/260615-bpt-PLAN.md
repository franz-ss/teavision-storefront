---
quick_id: 260615-bpt
slug: redesign-download-catalogues-page
date: 2026-06-15
mode: quick
---

# Quick Task 260615-bpt: Redesign /pages/download-catalogues

## Goal

Replace the generic `[...slug]` catch-all treatment of `/pages/download-catalogues`
(plain hero + Shopify rich-text body + boilerplate support CTA) with a bespoke,
conversion-focused route matching the other service pages, presenting the six real
catalogue PDFs in `public/vendor/catalogues/` as a designed download library.

Design approved via visual mockup. Locked decisions:

- Keep existing copy; match production page closely (`teavision.com.au/pages/download-catalogues`).
- Curated-pack CTA links to `/pages/contact` (no new inline form).
- Typographic cover plates (brand-green tiles), no new image assets.
- Catalogue list follows the header mega-nav ordering; ACO certificate last and visually distinct.

## Tasks

### 1. Add bespoke route + reserve the handle
- `src/app/(storefront)/pages/download-catalogues/page.tsx` — route with `generateMetadata` (indexable, canonical) rendering `PageContent` + JSON-LD.
- Add `download-catalogues` to `RESERVED_HANDLES` in `src/app/(storefront)/pages/[...slug]/page.tsx` so the catch-all no longer statically generates it.
- **verify:** `pnpm build` resolves the concrete route; `/pages/download-catalogues` renders the new page.
- **done:** route exists, handle reserved.

### 2. Build the page sections
- `_lib/data.ts` — hero copy, six catalogues (title, plate label, production description, href, file size, icon, certificate flag), CTA copy.
- `_components/` — `hero-section.tsx`, `catalogues-section.tsx`, `catalogue-row.tsx`, `cta-section.tsx`, `page-content.tsx`, `json-ld.tsx`.
- Uses `Section`, `Eyebrow`, `Badge`, `Button` primitives, design tokens only, `cn()` for conditional classes, lucide icons.
- **verify:** `pnpm lint` clean; page renders hero + 6 download rows + CTA in the preview.
- **done:** bespoke page matches the approved mockup.

## must_haves

- truths:
  - `/pages/download-catalogues` is served by a concrete route, not the catch-all.
  - All six catalogue PDFs are downloadable from the page.
- artifacts:
  - `src/app/(storefront)/pages/download-catalogues/page.tsx`
  - `src/app/(storefront)/pages/download-catalogues/_lib/data.ts`
  - `src/app/(storefront)/pages/download-catalogues/_components/*`
- key_links:
  - `public/vendor/catalogues/*.pdf` (six files)
  - `src/app/(storefront)/pages/[...slug]/page.tsx` RESERVED_HANDLES
