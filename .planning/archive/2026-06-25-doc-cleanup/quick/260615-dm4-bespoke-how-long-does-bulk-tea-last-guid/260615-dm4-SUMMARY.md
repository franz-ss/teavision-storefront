---
quick_id: 260615-dm4
slug: bespoke-how-long-does-bulk-tea-last-guid
date: 2026-06-15
status: complete
commit: 88cd2ff
---

# Quick Task 260615-dm4: Bespoke /pages/how-long-does-bulk-tea-last

## What changed

`/pages/how-long-does-bulk-tea-last` previously fell through the `[...slug]`
catch-all (generic brand hero + raw Shopify rich-text body + boilerplate support
CTA). It now has a bespoke, scannable buyer-guide route matching the other
service/guide pages.

### Added — `src/app/(storefront)/pages/how-long-does-bulk-tea-last/`
- `page.tsx` — indexable `metadata` (title, description, canonical, `og:type=article`).
- `_lib/data.ts` — all on-page copy (verbatim from production), hero badges, and the FAQ pair.
- `_components/page-content.tsx` — composition root + JSON-LD.
- `_components/hero-section.tsx` — brand band, gold eyebrow, Spectral headline, the two verbatim intro paragraphs, three credibility badges (ACO Organic, HACCP Program, Ships from Australia).
- `_components/longevity-section.tsx` — "Why our order lasts" prose (P3–P5) beside a `12–36 months` emphasis callout on a `bg-brand-tint` panel.
- `_components/factors-section.tsx` — "Factors to consider" prose, then a semantic `<dl>` factor rail (Light / Humidity / Odours) with mono gold index numbers and full hairline rules. No side-stripes, no identical icon cards.
- `_components/prepare-section.tsx` — "How to prepare" prose (P11–P12).
- `_components/cta-section.tsx` — brand band: italic gold Spectral "Think tea, think TeaVision" sign-off, the verbatim closing paragraph with the full range list, and two action buttons (Browse the range → `/collections`, Talk to our experts → `/pages/contact`).
- `_components/json-ld.tsx` — BreadcrumbList + Article + FAQPage schema.
- `_components/page-content.stories.tsx` — Default/Desktop/Mobile stories asserting all section headings, the three factor items, and the CTA links (Mobile also asserts no horizontal overflow).

### Changed
- `src/app/(storefront)/pages/[...slug]/page.tsx` — added `how-long-does-bulk-tea-last` to `RESERVED_HANDLES` so the catch-all no longer statically generates the path (the handle is a live Shopify page and would otherwise collide).

## Decisions honored
- Design approved via two visual mockups before implementation.
- **Copy is verbatim** from the production page (user instruction). Layout/grouping
  only; the single structural change is splitting the existing P8 at sentence
  boundaries so its light sentence anchors the "Light" factor. No words changed,
  no per-type shelf-life figures invented (an earlier table direction was dropped
  once verbatim fidelity was required).
- Primitives only (`Section`, `Eyebrow`, `Badge`, `Button`), design tokens only,
  `cn()` discipline, no new image assets.

## Verification
- `pnpm lint` clean; `pnpm typecheck` clean; pre-commit component-contract tests (37) pass.
- Dev server: `GET /pages/how-long-does-bulk-tea-last` → 200, title "How Long Does Bulk Tea Last? | Teavision".
- Browser preview (desktop + mobile): hero, longevity callout, three-factor `<dl>` rail, prepare prose, and CTA all render as approved; copy matches production verbatim; no horizontal overflow at 375px.
