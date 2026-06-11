---
phase: 11-full-visual-redesign
plan: '05'
subsystem: layout-chrome
tags: [footer, error-pages, design-tokens, ink-treatment, accessibility]
dependency_graph:
  requires: [11-02, 11-03, 11-04]
  provides: [footer-ink-treatment, error-page-restyle]
  affects: [storefront-layout-chrome]
tech_stack:
  added: []
  patterns:
    - ink footer with paper/alpha opacity tokens
    - payment marks as bordered text chips instead of SVG icons
    - pill newsletter input on dark surface
key_files:
  created: []
  modified:
    - src/components/layout/footer/view/view.tsx
    - src/components/layout/footer/link-list/link-list.tsx
    - src/components/layout/footer/text-link/text-link.tsx
    - src/components/layout/footer/quality-column/quality-column.tsx
    - src/components/layout/footer/newsletter-column/newsletter-column.tsx
    - src/components/layout/footer/newsletter-form/newsletter-form.tsx
    - src/components/layout/footer/payment-mark/payment-mark.tsx
    - src/components/layout/footer/icons/icons.stories.tsx
    - src/components/layout/footer/link-list/link-list.stories.tsx
    - src/components/layout/footer/newsletter-column/newsletter-column.stories.tsx
    - src/components/layout/footer/newsletter-form/newsletter-form.stories.tsx
    - src/components/layout/footer/quality-column/quality-column.stories.tsx
    - src/components/layout/footer/text-link/text-link.stories.tsx
    - src/app/(storefront)/layout.tsx
    - src/app/error.tsx
    - src/app/global-error.tsx
    - src/app/not-found.tsx
decisions:
  - Payment marks refactored from SVG icons to bordered text chips matching the .ft mockup bottom row
  - quality-column blurb text replaced with <=30ch brand copy per UI-SPEC §5.2; HACCP/organic quality pills added
  - Newsletter form layout changed from side-by-side input+button to stacked (input then full-width Button) matching mockup
metrics:
  duration: ~25m
  completed: '2026-06-10'
  tasks: 2
  files: 17
---

# Phase 11 Plan 05: Footer Redesign + Error Pages Summary

**One-liner:** Ink footer with gold mono headings, pill newsletter input, quality badge pills, and text chip payment marks; error/404/global-error pages and skip link on the new design system.

## Tasks Completed

| Task | Name                                                    | Commit  | Files            |
| ---- | ------------------------------------------------------- | ------- | ---------------- |
| 1    | Footer ink restyle (keep all links + newsletter action) | a6b635d | 13 footer files  |
| 2    | Skip link + error/global-error/not-found pages          | 681e92f | 4 app root files |

## What Was Built

### Task 1 — Footer ink restyle

Applied the `.ft` treatment from `product-card-footer.js` and UI-SPEC §5.2:

- **view.tsx**: `bg-ink text-paper/75` wrapper; `max-w-wide px-gutter`; `lg:grid-cols-[1.6fr_1fr_1fr_1.4fr] gap-10 py-section` top grid; merged bottom row into a single `border-t border-paper/10 py-5.5` band with font-mono copyright/popular-searches left and payment chips right.
- **link-list.tsx**: column headings `font-mono text-[10.5px] tracking-[0.16em] uppercase text-gold mb-4.5`.
- **text-link.tsx**: `text-[0.95rem] text-paper/75 hover:text-paper focus-visible:ring-offset-ink`; removed exported `MENU_LINK_CLASS`/`BOTTOM_LINK_CLASS` constants (no longer needed).
- **quality-column.tsx**: 30ch brand blurb, HACCP/ACO/USDA/Ethically Sourced quality pills `rounded-full border border-paper/15 bg-paper/5 text-paper/80 type-mono-meta`, opacity-80 logo image.
- **newsletter-column.tsx**: gold heading, normal-leading copy; contact links in font-mono text-[12px] row.
- **newsletter-form.tsx**: pill input `bg-paper/5 border border-paper/20 rounded-full px-4.5 py-3.5 text-paper placeholder:text-paper/60 focus:border-gold focus:ring-0`; submit `<Button variant="inverse" size="sm">` full-width stacked; Server Action, honeypot, aria-live feedback unchanged.
- **payment-mark.tsx**: refactored from SVG marks to bordered text chips `border border-paper/15 rounded-[5px] px-2 py-1 text-[9.5px] uppercase font-mono text-paper/60` (SVG files in `payment-marks/` retained, now unused by this component).
- **All stories**: `bg-footer` → `bg-ink` decorator, `text-on-brand` → `text-paper/75`.

**Preserved:** `mrtea.com.au/account/login` link (data.ts untouched), newsletter Server Action + honeypot + aria-live states.

### Task 2 — Skip link + error/global-error/not-found pages

- **(storefront)/layout.tsx**: skip link `bg-paper text-ink border border-hairline rounded-sm`; target id `#main-content` and landmark order unchanged.
- **error.tsx**: `bg-paper` container, `bg-card` card panel, `font-display` heading `type-heading-02`, `text-ink-soft` copy, `<Button variant="brand">` primary action; `console.error(error)` logging intact.
- **global-error.tsx**: `<body className="bg-paper text-ink font-sans">`; same card pattern; renders its own `<html>/<body>`; error logging intact.
- **not-found.tsx**: `font-display text-7xl text-brand` 404 numeral, `type-heading-02` h1, `text-ink-soft` copy, `brand`/`secondary` buttons; `withNoindexRobots` metadata unchanged.

## Deviations from Plan

### Auto-fixed Issues

None.

### Design adaptations (within spec)

**1. Payment marks as text chips instead of SVG icons**

- **Decision:** The `.ft` mockup bottom row shows simple text labels (VISA, MASTERCARD, etc.) as bordered chips. The plan confirmed "bordered chips". SVG files were unused by the old `PaymentMark` and are retained but unused — will be cleaned in plan 11-14 sweep.

**2. Newsletter form layout: stacked not side-by-side**

- **Decision:** The `.ft` mockup shows input then button stacked vertically. Changed from the Phase 4 side-by-side layout to full-width stacked per mockup. Server Action wiring, honeypot, and aria-live feedback preserved exactly.

## Verification

- `pnpm lint`: pass (Tailwind class check + ESLint)
- `pnpm test:integration`: 10/10 pass
- `pnpm build`: fails with pre-existing CartCount Server Function bug (not introduced by this plan — confirmed by git-stash test that same error existed before changes)
- Acceptance criteria:
  - `grep -c "bg-ink" src/components/layout/footer/view/view.tsx` → 1
  - `text-gold` in link-list, newsletter-column, quality-column → confirmed
  - `mrtea.com.au/account/login` in data.ts → 1
  - No `bg-footer|text-footer|border-footer|text-on-brand` in footer/ → confirmed
  - No `bg-canvas|text-default|text-muted|text-subtle|border-default|type-display-0` in error/not-found/layout files → confirmed
  - `font-display|type-heading` in not-found.tsx → 2

## Self-Check

Files confirmed present:

- src/components/layout/footer/view/view.tsx (contains bg-ink)
- src/app/not-found.tsx (contains font-display + type-heading-02)
- src/app/error.tsx (no old tokens)
- src/app/global-error.tsx (body bg-paper text-ink)

Commits confirmed:

- a6b635d — Task 1 footer restyle
- 681e92f — Task 2 skip link + error pages

## Self-Check: PASSED
