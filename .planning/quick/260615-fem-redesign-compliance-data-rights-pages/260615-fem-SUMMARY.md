---
quick_id: 260615-fem
slug: redesign-compliance-data-rights-pages
date: 2026-06-15
status: complete
---

# Quick Task 260615-fem: Compliance pages — verbatim copy of production

## Goal

Reproduce the four compliance pages to match the production site exactly:

- `/pages/gdpr-compliance`
- `/pages/us-laws-compliance`
- `/pages/pipeda-compliance`
- `/pages/appi-compliance`

These are served by the shared `[...slug]` catch-all route. On production they
are a privacy-app (ConsentMo) data-rights widget. In this headless build the
Shopify `page.body` is sanitized (`src/lib/shopify/html-content.ts` strips
`form`/`input`/`button`/`script`), so the pages rendered broken. The task is to
reproduce the production content faithfully.

## Course correction

The first attempt redesigned the pages and invented content (rights wording,
response windows, law badges, a "how requests work" band). That was wrong: the
ask was to copy production. This summary reflects the corrected implementation —
a verbatim copy.

## What changed (final)

- **Added** `src/app/(storefront)/pages/[...slug]/_lib/compliance.ts`
  - Verbatim production content per handle: the compliance notice, the sections
    (Data Rectification, Data Portability, Access to Personal Data, and Do not
    Sell / Right to be Forgotten where production includes them), exact link
    labels, the email-confirm label, and the US jurisdiction statement.
  - Per-page differences preserved: PIPEDA has only three sections; US adds Do
    not Sell + the four-state list; APPI adds the third-party Do-not-Sell
    variant; GDPR has Right to be Forgotten but no Do not Sell.
- **Added** `src/app/(storefront)/pages/[...slug]/_components/compliance.tsx`
  - Renders the notice + Privacy Policy & Terms of Service link, then each
    section with its description, action button(s), and an "Enter your email to
    confirm your identity" field. Controls are styled with the design system
    but inert (the privacy app that powers them does not run headless).
- **Edited** `content.tsx` — branches compliance handles to `Compliance`
  (replacing the stripped Shopify body); all other `[...slug]` pages unchanged.
- **Edited** `hero.tsx` — reverted the temporary `meta` slot; compliance pages
  use the standard policy hero (no invented lede/badges).
- **Removed** the invented `_lib/data-rights.ts` and `_components/data-rights.tsx`.

## Verification

- `pnpm typecheck` clean; `pnpm lint` clean.
- Dev preview:
  - GDPR: notice + Privacy link (→ /pages/terms-conditions), 4 sections, 6
    actions each with an email field, no jurisdiction line; no console errors.
  - US: adds "Do not Sell My Personal Information" + the four-state statement.
  - PIPEDA: only Rectification, Portability ("PIPEDA requests"), Access.
  - APPI: adds "Do not Sell My Personal Information to Third Party".
  - Regression: `/pages/how-to-store-bulk-tea` still renders the Shopify body.

## Notes

- The request controls are inert by design decision (matches production 1:1;
  the ConsentMo backend is not available in headless). If functional handling
  is wanted later, that is a separate backend feature.
- The notice's "Privacy Policy & Terms of Service" link points at
  `/pages/terms-conditions` (the production link targets the privacy app).
