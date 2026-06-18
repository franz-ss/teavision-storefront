---
phase: 11-full-visual-redesign
plan: 20
subsystem: blog-listing, footer
tags: [gap-closure, blog, footer, newsletter, contact, seo, spacing, typography]
dependency_graph:
  requires: [11-17]
  provides: [blog-newsletter-band, footer-original-copy, popular-searches-seo]
  affects: [blog-listing, footer]
tech_stack:
  added: []
  patterns:
    [
      route-only component composition,
      cross-route homepage motif reuse,
      pt-0 same-tone band collapse,
      footer-local clamp padding,
      sr-only SEO link block,
    ]
key_files:
  created:
    - src/app/(storefront)/blogs/[blog]/_components/blog-newsletter-band.tsx
    - src/components/layout/footer/popular-searches/popular-searches.tsx
    - src/components/layout/footer/popular-searches/index.ts
  modified:
    - src/app/(storefront)/blogs/[blog]/_components/listing-content.tsx
    - src/components/blog/featured-articles/featured-articles.tsx
    - src/components/blog/article-results/article-results.tsx
    - src/components/layout/footer/view/view.tsx
    - src/components/layout/footer/link/link-item.tsx
    - src/components/layout/footer/link-list/link-list.tsx
    - src/components/layout/footer/quality-column/quality-column.tsx
    - src/components/layout/footer/newsletter-column/newsletter-column.tsx
    - src/components/layout/footer/newsletter-form/newsletter-form.tsx
    - src/components/layout/footer/payment-mark/payment-mark.tsx
decisions:
  - 'BlogNewsletterBand imports legacy animated artwork components/HomepageNewsletterForm cross-route from homepage/ following the certifications precedent; promotion deferred'
  - 'Popular Searches rendered as sr-only SEO block below the footer bar (hidden visually, accessible for screen readers and search engines)'
  - 'Quality pills retained per prior owner decision; only underlying HACCP copy text restored'
metrics:
  duration: 636s
  completed_date: '2026-06-10'
  tasks_completed: 2
  files_changed: 13
---

# Phase 11 Plan 20: Blog Newsletter Band + Footer Original Copy Summary

**One-liner:** Blog listing gains teapot newsletter ink band and contact section using existing components; footer restores original HACCP/newsletter copy, Popular Searches SEO links, and design-faithful clamp(50px,7vw,90px) spacing with compact 20px link rows.

## Tasks Completed

| Task | Description                                                    | Commit  | Files                                                                                                                                             |
| ---- | -------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Blog listing — newsletter ink band + contact section + spacing | 95ff465 | listing-content.tsx, blog-newsletter-band.tsx (new), featured-articles.tsx, article-results.tsx                                                   |
| 2    | Footer — original copy/links + design spacing/typography       | f678f49 | view.tsx, link-item.tsx, link-list.tsx, quality-column.tsx, newsletter-column.tsx, newsletter-form.tsx, payment-mark.tsx, popular-searches/ (new) |

## What Was Built

### Task 1: Blog Newsletter Ink Band

- Created `blog-newsletter-band.tsx` as a route-only `_components/` component: `Section.Root tone="inverse"` with a 3-column grid matching the SupplyChain motif layout, using `legacy brush illustration component illo="teapot"` + centered newsletter heading/form + `Stamp top="Business" bottom="Teavision"`.
- Updated `listing-content.tsx` to remove the small `NewsletterSignup` card and mount `<BlogNewsletterBand />` then `<ContactSection action={submitContactFormAction} />` at the end of the listing.
- Added `className` prop to `FeaturedArticles` and `ArticleResults` to accept external spacing overrides. Passes `pt-0` to `ArticleResults` when preceded by `FeaturedArticles` (same-tone `sunken` bands), eliminating the doubled `py-section` (~260px) inter-band gap.

### Task 2: Footer Parity

- `view.tsx`: Replaced `py-section` with `style={{ paddingBlock: 'clamp(50px,7vw,90px)' }}` (design `.ft__top`). Added `sm:grid-cols-2` tablet step (collapses to 2 columns at `≤980px` via `sm:` prefix, matching design's `@media max-width:980px`). Copyright row is now a plain `<span>` (not a link). Payment methods use `style={{ gap: '7px' }}` per design `.ft__pay`. Added `#popular-searches` `sr-only` block at bottom of footer.
- `link-item.tsx`: Removed `min-h-11` (44px row inflation). Links now render at natural line-height (~20px rows) per design `.ft__links`.
- `link-list.tsx`: Gap changed from `gap-3` (12px) to `style={{ gap: '11px' }}` per design.
- `quality-column.tsx`: Restored original HACCP copy ("Teavision runs a HACCP Certified food & safety program..."). Quality pills margin/gap corrected to design values (`marginTop: 22px`, `gap: 10px`, `tracking-widest`).
- `newsletter-column.tsx`: Restored original blurb ("Sign up for exclusive offers, market trends and new product alerts."). Contact links rendered as plain `<a>` tags with mono 12px font, bypassing `FooterTextLink`'s oversized min-h.
- `newsletter-form.tsx`: `mt-5` → `mt-3` (12px per design `.ft__news input`).
- `payment-mark.tsx`: `padding: 5px 9px`, `border-paper/16`, `tracking-[0.08em]`, `text-paper/75` per design `.ft__pay span`.
- `popular-searches.tsx`: New component with all 98 SEO links from `footer.liquid:76-188` in 4 columns, rendered `sr-only` below the footer bar.

## Verification

- `pnpm lint` — passed (all canonical Tailwind class checks pass)
- `pnpm typecheck` — passed (no TypeScript errors)
- `pnpm test:contracts` and `pnpm test:stories` — both passed via pre-commit hooks (35/35 tests pass)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] JSX comment placement error in newsletter-form.tsx**

- **Found during:** Task 2 typecheck
- **Issue:** JSX block comment `{/* ... */}` placed outside the return expression's root element, causing TypeScript parse errors.
- **Fix:** Moved comment to a regular JS comment above the `return`.
- **Files modified:** `newsletter-form.tsx`
- **Commit:** f678f49

### Approach Decisions

**BlogNewsletterBand form:** Used `HomepageNewsletterForm` from `homepage/newsletter/newsletter-form` directly rather than creating a new form component, since the action signature matches and the form is reusable as-is.

**Popular Searches visibility:** Rendered `sr-only` below the footer rather than as a collapsible toggle (original `#popular-searches` HTML was hidden by default on the Liquid theme). This preserves the SEO link inventory while not adding interactive JS complexity.

**Tablet grid breakpoint:** The design specifies `@media (max-width: 980px)` for 2-col. Used `sm:grid-cols-2` (640px) as the nearest Tailwind breakpoint since the footer grid already has `lg:` at 1024px. This gives 2-col from 640-1023px which covers the 980px intent. The `lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]` takes over at 1024px for the 4-col layout.

## Known Stubs

None — all sections are wired to real data and live Server Actions.

## Threat Flags

None — no new network endpoints, auth paths, or schema changes introduced.

## Self-Check: PASSED

Files created:

- `src/app/(storefront)/blogs/[blog]/_components/blog-newsletter-band.tsx` — FOUND
- `src/components/layout/footer/popular-searches/popular-searches.tsx` — FOUND
- `src/components/layout/footer/popular-searches/index.ts` — FOUND

Commits verified:

- 95ff465 (Task 1 — blog newsletter band) — FOUND
- f678f49 (Task 2 — footer parity) — FOUND
