---
quick_id: 260615-fem
slug: redesign-compliance-data-rights-pages
date: 2026-06-15
status: complete
---

# Quick Task 260615-fem: Redesign compliance data-rights pages — Summary

## What changed

The four compliance handles served by the `[...slug]` catch-all route now render
a bespoke, per-jurisdiction data-rights page instead of the sanitized (and
partly broken) Shopify privacy-app widget HTML:

- `/pages/gdpr-compliance`
- `/pages/us-laws-compliance`
- `/pages/pipeda-compliance`
- `/pages/appi-compliance`

### Files

- **Added** `src/app/(storefront)/pages/[...slug]/_lib/data-rights.ts`
  - Per-jurisdiction `DataRightsProfile` config (jurisdiction label, lede, law
    badges, optional coverage note, rights, process notes, support copy).
  - `buildRequestHref(subject)` builds a pre-filled
    `mailto:info@teavision.com.au` link (encoded subject + body template).
  - `isDataRightsHandle` / `resolveDataRightsProfile` helpers.
- **Added** `src/app/(storefront)/pages/[...slug]/_components/data-rights.tsx`
  - Server component: numbered, hairline-divided rights list with a mailto
    action per right (erasure rights use the outlined `secondary` button plus a
    `danger-tint` warning note), followed by a "How requests work" band.
- **Edited** `src/app/(storefront)/pages/[...slug]/_components/hero.tsx`
  - Added an optional `meta` slot rendered under the lede (used for the
    last-reviewed date and law badges).
- **Edited** `src/app/(storefront)/pages/[...slug]/_components/content.tsx`
  - Branches on `resolveDataRightsProfile(handle)`: data-rights handles get the
    jurisdiction kicker, hero meta, bespoke `DataRights` body, and tailored
    support copy. All other `[...slug]` pages are unchanged.

## Design

Follows the approved preview and the project DESIGN.md: warm paper/brand/gold
tokens, Spectral/Hanken/Space Mono type, no card grid, no side-stripe accents,
no gradient text. Requests route via pre-filled email (no backend), per the
agreed scope.

## Verification

- `pnpm typecheck` — clean.
- `pnpm lint` (tailwind class check + eslint) — clean.
- Dev preview:
  - GDPR page renders 5 rights, encoded mailto links, erasure warning, EU/UK
    badges, last-reviewed date; no console errors.
  - US page renders the "Do not sell or share" right, CCPA-CPRA/VCDPA/CPA/CTDPA
    badges, coverage note, and 45-day window.
  - Mobile (375px) hero and rights stack correctly.
  - Regression: `/pages/how-to-store-bulk-tea` still renders the full Shopify
    body with no data-rights band.

## Notes / follow-ups

- Requests are routed to email by design. If functional in-headless request
  handling (forms → server action → Shopify customer API / deletion) is wanted
  later, that is a separate, larger backend feature.
- "Last reviewed" uses the Shopify page `updatedAt` (currently 19 Dec 2023 for
  GDPR). Re-saving the page in Shopify will refresh the date.
