---
phase: 11-full-visual-redesign
plan: 07
subsystem: ui
tags: [homepage, redesign, motifs, forms, nextjs, tailwind]
requires:
  - phase: 11-full-visual-redesign
    provides: Phase 11 foundation tokens, homepage upper sections, and extracted motif PNG assets
provides:
  - redesigned lower homepage composition
  - brush-circle and stamp motif band treatment
  - restyled testimonials, Tea Journal, newsletter, contact, and FAQ sections
affects: [homepage, header-cart-count, phase-11-verification]
tech-stack:
  added: []
  patterns:
    - Server motif components using next/image and token-only SVG text styling
    - Native details/summary FAQ rows with token-styled open indicators
    - Client cart-count leaf for post-hydration Server Action reads
key-files:
  created: []
  modified:
    - src/app/(storefront)/page.tsx
    - src/components/homepage/brush-circle/brush-circle.tsx
    - src/components/homepage/stamp/stamp.tsx
    - src/components/homepage/supply-chain/supply-chain.tsx
    - src/components/homepage/catalogues/cta.tsx
    - src/components/homepage/testimonials/testimonials.tsx
    - src/components/homepage/testimonials/testimonials-slider.tsx
    - src/components/homepage/tea-journal/tea-journal.tsx
    - src/components/homepage/newsletter/newsletter.tsx
    - src/components/homepage/newsletter/newsletter-form.tsx
    - src/components/homepage/contact/contact.tsx
    - src/components/homepage/contact-form/contact-form.tsx
    - src/components/homepage/faq/faq.tsx
    - src/components/homepage/content.ts
    - src/components/layout/header/cart-count.tsx
key-decisions:
  - "Homepage lower section order follows the redesign as hero, stats, range, services, organic, testimonials, motif band, journal, catalogue band, newsletter, contact, FAQ."
  - "Cart count now reads through a small client leaf after hydration to satisfy Next.js 16 Server Function initial-render restrictions."
patterns-established:
  - "Stamp uses the extracted ring PNG for brush texture and masks baked lettering so JSX textPath copy owns each band label."
  - "Homepage contact and newsletter forms may be visually restyled while preserving existing Server Action, honeypot, pending, and aria-live contracts."
requirements-completed: [RD-04]
duration: 26 min
completed: 2026-06-10
---

# Phase 11 Plan 07: Homepage Lower Redesign Summary

**Lower homepage redesign with brush/stamp motif bands, editorial testimonials, journal cards, and preserved contact/newsletter actions**

## Performance

- **Duration:** 26 min
- **Started:** 2026-06-10T03:18:44Z
- **Completed:** 2026-06-10T03:44:03Z
- **Tasks:** 3
- **Files modified:** 15

## Accomplishments

- Finished the lower homepage section composition with testimonials, supply-chain motif band, Tea Journal, catalogue motif band, newsletter, contact/help, and FAQ in redesign order.
- Refined `BrushCircle` and `Stamp` motif components with token-only styling, reduced-motion guards, stable SVG arc IDs, and Storybook coverage.
- Preserved newsletter and contact Server Actions, honeypots, pending states, and aria-live feedback while moving them into the new green/ink visual system.
- Cleared the previously documented Next.js 16 build blocker in the header cart count boundary.

## Task Commits

Each task was committed atomically:

1. **Task 1: BrushCircle + Stamp motif components** - `f1be8a2` (feat)
2. **Task 2: Brand bands + testimonials + tea-journal** - `77d3dd2` (feat)
3. **Task 3: Newsletter + contact/help + FAQ + page composition** - `6c8951b` (feat)
4. **Motif visual correction** - `58eea4e` (fix)

Note: motif folders already existed when execution began; Task 1 verified the scaffold and refined the implementation to satisfy plan and AGENTS.md constraints.

## Files Created/Modified

- `src/components/homepage/brush-circle/brush-circle.tsx` - decorative brush illustration component with per-illustration sizing and reduced-motion-safe float.
- `src/components/homepage/stamp/stamp.tsx` - stamp ring motif with masked extracted PNG and curved SVG `textPath` copy.
- `src/components/homepage/supply-chain/supply-chain.tsx` - ink motif CTA band with BrushCircle, Stamp, gold eyebrow, highlighted headline, and inverse CTA.
- `src/components/homepage/catalogues/cta.tsx` - green-deep catalogue motif band with stamp/brush sides and dual CTAs.
- `src/components/homepage/testimonials/*` - selector-driven testimonial layout with gold quote mark and mono attribution.
- `src/components/homepage/tea-journal/tea-journal.tsx` - three-card journal grid with motion-reduce-safe image hover treatment.
- `src/components/homepage/newsletter/*` - green-deep newsletter card with pill input while keeping the existing action boundary.
- `src/components/homepage/contact/*` and `src/components/homepage/contact-form/*` - ink help section and card form preserving validation and honeypot wiring.
- `src/components/homepage/faq/faq.tsx` - sunken FAQ band using native disclosure rows and token-styled indicators.
- `src/components/homepage/content.ts` - catalogue CTA content aligned to the redesign while retaining `inverseSecondary` for the contract test.
- `src/app/(storefront)/page.tsx` - homepage section order aligned to the redesign composition.
- `src/components/layout/header/cart-count.tsx` - narrow build-blocker fix for Next.js 16 Server Function restrictions.

## Decisions Made

- Homepage `SupplyChain` is now the redesign's business-growth motif band rather than the previous logo strip because the plan assigns supply-chain ownership to the lower homepage motif CTA.
- `Stamp` keeps the extracted ring PNG but masks baked text so the component's `textPath` props define the visible label for each band.
- The header cart badge now loads count after hydration through a client leaf; this preserves the existing Server Action while avoiding Server Function calls during prerender.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Removed banned inline SVG text styles and stabilized stamp IDs**
- **Found during:** Task 1 (BrushCircle + Stamp motif components)
- **Issue:** Existing `Stamp` used inline `style={{ fontSize: ... }}` and defaulted multiple instances to the same SVG arc IDs.
- **Fix:** Replaced inline styles with token/static Tailwind classes and derived stable per-copy arc IDs.
- **Files modified:** `src/components/homepage/stamp/stamp.tsx`
- **Verification:** `pnpm lint`, `pnpm typecheck`, `pnpm lint:tailwind`; acceptance grep confirmed `textPath`, no `use client`, no `dangerouslySetInnerHTML`.
- **Committed in:** `f1be8a2`

**2. [Rule 3 - Blocking] Unblocked Next.js 16 build by moving cart count Server Action call out of initial render**
- **Found during:** Task 3 verification (`pnpm build`)
- **Issue:** Build failed because `CartCount` called `getCartAction()` during initial prerender, which Next.js 16 rejects for Server Functions.
- **Fix:** Converted `CartCount` into a small client leaf that calls the existing Server Action after hydration and renders the shared `CartBadge`.
- **Files modified:** `src/components/layout/header/cart-count.tsx`
- **Verification:** `pnpm build` passed, then full plan verification passed on current HEAD.
- **Committed in:** `6c8951b`

**3. [Rule 1 - Visual Bug] Masked baked stamp PNG lettering so motif labels render correctly**
- **Found during:** Dev-server visual pass
- **Issue:** The extracted `stamp-ring.png` contained baked "Subscribe Teavision" text that conflicted with Business/Catalogue `textPath` labels.
- **Fix:** Added a token-colored inner mask while preserving the brush ring texture and JSX curved text labels.
- **Files modified:** `src/components/homepage/stamp/stamp.tsx`, `src/components/homepage/catalogues/cta.tsx`
- **Verification:** `pnpm lint:tailwind`, `pnpm typecheck`, `pnpm test:contracts`, and browser scroll screenshots confirmed loaded motifs.
- **Committed in:** `58eea4e`

---

**Total deviations:** 3 auto-fixed (1 missing critical, 1 blocking, 1 visual bug).
**Impact on plan:** All deviations were required for AGENTS.md compliance, Next.js 16 build correctness, or visible motif fidelity. No feature scope was added.

## Issues Encountered

- `pnpm build` initially failed on a previously documented header cart-count Server Function issue. The narrow client-leaf fix resolved it and the final build passed.
- Playwright was installed under pnpm's store layout rather than root `node_modules`; the Node REPL visual check added the pnpm package module path before running browser automation.

## Verification

- `pnpm lint`: passed
- `pnpm typecheck`: passed
- `pnpm lint:tailwind`: passed
- `pnpm test:contracts`: passed, 35 tests
- `pnpm test:integration`: passed, 2 files / 10 tests
- `pnpm build`: passed, 58 static/PPR routes generated
- Dev-server browser pass: desktop 1440 and mobile 375 returned HTTP 200, no console errors, no horizontal overflow, expected lower-homepage headings present, brush/stamp motifs loaded after scroll, newsletter input/contact honeypot/FAQ rows present.

## Known Stubs

None - decorative empty image `alt=""` values and input placeholder attributes are intentional accessibility/form UI, not data stubs.

## Threat Flags

None - no new endpoints, auth paths, file access patterns, or schema trust boundaries were introduced. Existing newsletter/contact form trust boundaries were preserved.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Homepage RD-04 lower-section work is complete and ready for Phase 11's remaining search/PDP/supporting-page/final-sweep plans. The cart-count build blocker is also cleared for later phase verification.

## Self-Check: PASSED

- Key modified files exist.
- Task commits `f1be8a2`, `77d3dd2`, `6c8951b`, and `58eea4e` exist in git history.
- Final verification commands passed on current HEAD.

---
*Phase: 11-full-visual-redesign*
*Completed: 2026-06-10*
