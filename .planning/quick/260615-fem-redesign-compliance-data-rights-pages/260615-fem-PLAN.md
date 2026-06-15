---
quick_id: 260615-fem
slug: redesign-compliance-data-rights-pages
date: 2026-06-15
mode: quick
status: in-progress
---

# Quick Task 260615-fem: Redesign compliance data-rights pages

## Problem

Four compliance pages are served by the shared `[...slug]` catch-all route and
render the sanitized Shopify `page.body`:

- `/pages/gdpr-compliance`
- `/pages/us-laws-compliance`
- `/pages/pipeda-compliance`
- `/pages/appi-compliance`

On the production Shopify (Liquid) site these are interactive data-subject-rights
request widgets injected by a privacy app. The headless sanitizer
(`src/lib/shopify/html-content.ts`) strips `form`, `input`, `button`, `select`,
and `script`, so in the headless storefront they degrade to bare, partly broken
text wrapped in the generic `POLICY_PROFILE` framing. For B2B trust pages this
reads as broken.

## Decision (user-approved)

- **Scope:** Purpose-built, per-jurisdiction data-rights page. Frontend-only, no
  backend. Replace the broken widget HTML for these four handles with a clear,
  on-brand rights page.
- **Request channel:** Pre-filled `mailto:info@teavision.com.au` per right.
- Design previewed and approved (hairline-divided numbered rights list, no card
  grid, no side-stripe accents, no gradient text; reuses Section / Eyebrow /
  Button and warm paper/brand/gold tokens).

## Tasks

1. **Add per-jurisdiction config** — `[...slug]/_lib/data-rights.ts`
   - `DataRightsProfile` per handle (jurisdiction, lede, law badges, coverage,
     rights[], process[], support copy) + `buildRequestHref(subject)` mailto
     helper + `resolveDataRightsProfile(handle)`.
   - files: `src/app/(storefront)/pages/[...slug]/_lib/data-rights.ts`
   - verify: `pnpm lint` clean; typecheck passes.
   - done: config exports resolve for all four handles, null otherwise.

2. **Add DataRights body component** — `[...slug]/_components/data-rights.tsx`
   - Renders the rights list (numbered, hairline-divided, mailto action per row,
     erasure warning note) and the "how requests work" band.
   - files: `src/app/(storefront)/pages/[...slug]/_components/data-rights.tsx`
   - verify: dev preview renders all four pages without console errors.
   - done: component renders from a `DataRightsProfile`.

3. **Wire into the route** — extend `hero.tsx` with an optional `meta` slot and
   branch `content.tsx` to render the bespoke data-rights body (jurisdiction
   kicker, last-reviewed + law badges, tailored support copy) for the four
   handles; all other `[...slug]` pages unchanged.
   - files: `[...slug]/_components/content.tsx`, `[...slug]/_components/hero.tsx`
   - verify: non-compliance `[...slug]` pages still render the Shopify body.
   - done: four compliance pages show the new layout; others untouched.

## must_haves

- truths:
  - The four compliance handles render the bespoke data-rights layout, not the
    stripped Shopify body.
  - Every right exposes a working `mailto:info@teavision.com.au` request.
  - All other `[...slug]` pages keep rendering the sanitized Shopify body.
- artifacts:
  - `src/app/(storefront)/pages/[...slug]/_lib/data-rights.ts`
  - `src/app/(storefront)/pages/[...slug]/_components/data-rights.tsx`
- key_links:
  - `src/app/(storefront)/pages/[...slug]/_components/content.tsx`
  - `src/app/(storefront)/pages/[...slug]/_components/hero.tsx`
