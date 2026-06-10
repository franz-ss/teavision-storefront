---
phase: 11-full-visual-redesign
plan: 21
subsystem: storefront-pages
tags: [new-page, bulk-wholesale, content, design-system, seo]
dependency_graph:
  requires: [11-17]
  provides: [/pages/bulk-wholesale-supply route with 10 sections]
  affects: [UAT test 15, contact section reuse, JSON-LD structured data]
tech_stack:
  added: []
  patterns:
    [
      Section.Root/Container/Intro,
      Accordion,
      Button,
      Eyebrow,
      ContactSection,
      JSON-LD,
      withNoindexRobots,
    ]
key_files:
  created:
    - src/app/(storefront)/pages/bulk-wholesale-supply/page.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/_lib/data.ts
    - src/app/(storefront)/pages/bulk-wholesale-supply/_components/banner-section.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/_components/hero-section.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/_components/features-grid-3.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/_components/logistics-section.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/_components/import-features-section.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/_components/why-choose-section.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/_components/process-section.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/_components/faq-section.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/_components/cta-section.tsx
    - src/app/(storefront)/pages/bulk-wholesale-supply/_components/json-ld.tsx
  modified: []
decisions:
  - 'Banner section uses Section.Root tone=brand with a full-bleed overlay image + bg-ink/55 scrim — matching the our-story hero pattern for image band backgrounds'
  - 'Logistics check items use structured data (bold/rest pairs) in component rather than _lib/data to keep JSX bold rendering clean without fragile string-splitting'
  - 'Process steps use 5-col grid on desktop (lg:grid-cols-5) to lay out horizontally with wrap/stack fallback on mobile — no horizontal scrollbar per 11-15 mobile-chip decision'
  - 'pnpm build fails site-wide due to pre-existing footer new Date().getFullYear() prerender error (introduced in 11-20); new page TypeScript and lint are clean'
metrics:
  duration: 683s
  completed: '2026-06-10T14:47:54Z'
  tasks: 2
  files: 12
---

# Phase 11 Plan 21: Bulk Wholesale Supply Page Summary

**One-liner:** New /pages/bulk-wholesale-supply route with 10 production-spec sections — image banner, hero split with video, feature grids, logistics media-text, accordion, process steps, FAQ, CTA band, and shared contact form — built on the Phase 11 design system.

## What Was Built

UAT test 15 gap closed: the `/pages/bulk-wholesale-supply` route now exists as a proper App Router page instead of falling through to the generic Shopify `[...slug]` renderer.

### Route structure

- `page.tsx` — metadata with `withNoindexRobots`, `openGraph`, `alternates.canonical`; 10-section composition
- `_lib/data.ts` — all copy constants, image URLs, and typed arrays (feature cards, FAQ, accordion items, process steps)
- `_components/json-ld.tsx` — `BreadcrumbList`, `Service`, `FAQPage` structured data via `serializeInlineJson`
- 9 section components — one per file, named exports only

### Section inventory

| #   | Component               | Pattern                                                            |
| --- | ----------------------- | ------------------------------------------------------------------ |
| 1   | `BannerSection`         | Full-bleed image, `Section.Root tone="brand"` + overlay scrim      |
| 2   | `HeroSection`           | 2-col split — eyebrow, H2, dual CTAs; desktop image / mobile video |
| 3   | `FeaturesGrid3`         | 3-col card grid (ACO, Container Imports, Price Advantage)          |
| 4   | `LogisticsSection`      | Image left + check-item list right                                 |
| 5   | `ImportFeaturesSection` | 2-col check-icon cards                                             |
| 6   | `WhyChooseSection`      | Image left + numbered `Accordion` (5 items)                        |
| 7   | `ProcessSection`        | 5-col numbered process cards (wrap on mobile)                      |
| 8   | `FaqSection`            | `Accordion` with 6 Q&A items                                       |
| 9   | `CtaSection`            | Centered CTA band with `text-brand` heading                        |
| 10  | `ContactSection`        | Shared component with `submitContactFormAction`                    |

## Verification

- `pnpm lint` — PASS (0 errors)
- `pnpm typecheck` — PASS
- `pnpm test:contracts` — PASS (35/35)
- `pnpm build` — FAIL (pre-existing, see Deferred Issues below)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Raw `<section>` element replaced with `Section.Root`**

- **Found during:** Task 1 lint run
- **Issue:** `banner-section.tsx` initially used a raw `<section>` element, triggering the `teavision/no-raw-section` ESLint rule
- **Fix:** Changed to `Section.Root tone="brand" spacing="none"` with image overlay; removed explicit `text-paper` from root (picked up from tone) to also satisfy `teavision/no-section-root-tone-class`
- **Files modified:** `_components/banner-section.tsx`
- **Commit:** 57c59c1 (amended inline before commit)

## Deferred Issues

| Category                 | Item                                                                                                                                                                                                                                          | Deferred at |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Pre-existing build error | `src/components/layout/footer/view/view.tsx:42` uses `new Date().getFullYear()` outside a Cache Component, causing `next-prerender-current-time` errors on all routes during `pnpm build`. Introduced in plan 11-20. Not caused by this plan. | Plan 11-21  |

## Known Stubs

None — all copy is verbatim from the authoritative content spec. All images reference production Shopify CDN URLs per spec.

## Threat Flags

None — the page is a static informational route with no new network endpoints, auth paths, or schema changes. Contact form reuses the existing `submitContactFormAction` Server Action boundary.

## Self-Check: PASSED

Files exist:

- src/app/(storefront)/pages/bulk-wholesale-supply/page.tsx — FOUND
- src/app/(storefront)/pages/bulk-wholesale-supply/\_lib/data.ts — FOUND
- src/app/(storefront)/pages/bulk-wholesale-supply/\_components/banner-section.tsx — FOUND
- src/app/(storefront)/pages/bulk-wholesale-supply/\_components/json-ld.tsx — FOUND
- src/app/(storefront)/pages/bulk-wholesale-supply/\_components/why-choose-section.tsx — FOUND
- src/app/(storefront)/pages/bulk-wholesale-supply/\_components/faq-section.tsx — FOUND

Commits exist:

- 57c59c1 — feat(11-21): scaffold bulk-wholesale-supply route + sections 1-5
- 549acf9 — feat(11-21): add sections 6-10 to bulk-wholesale-supply page
