---
phase: 11-full-visual-redesign
plan: 14
subsystem: ui
tags: [tailwind-4, nextjs-16, design-tokens, storybook, cart]

requires:
  - phase: 11-full-visual-redesign
    provides: Phase 11 plans 11-01 through 11-13 redesigned the storefront surfaces and introduced the new token system.
provides:
  - Removed the old Teavision design token system from globals.css without aliases.
  - Wiped Tailwind default color palette generation with --color-*: initial.
  - Migrated remaining old token consumers and retired Section brandStrong.
  - Refreshed design-token documentation and completed the full phase verification gate.
affects: [visual-redesign, design-system, storefront-ui, storybook, cart]

tech-stack:
  added: []
  patterns:
    - Single new-token Tailwind 4 theme in src/app/globals.css.
    - Shared cart mutation browser event keeps header cart count current after client-side cart changes.

key-files:
  created:
    - src/lib/cart/events.ts
  modified:
    - src/app/globals.css
    - src/components/ui/section/section.tsx
    - scripts/eslint-rules/no-section-root-tone-class.mjs
    - docs/conventions.md
    - AGENTS.md
    - vitest.storybook.config.mts

key-decisions:
  - "Phase 11-14 removed old design tokens instead of aliasing them to new values, preserving RD-02's single-system requirement."
  - 'Phase 11-14 uses --color-*: initial in the Tailwind theme so default palette color utilities are not generated.'
  - 'Phase 11-14 uses a shared browser cart-changed event to refresh header cart count after cart mutations without adding client-side cart storage.'

patterns-established:
  - 'Old-token cleanup must be proven by grep plus lint:tailwind; lint alone can pass while old aliases still exist.'
  - 'Storybook interaction coverage is part of the Phase 11 visual gate and must run against the real .storybook config.'

requirements-completed: [RD-02, RD-08]

duration: 31min
completed: 2026-06-10
---

# Phase 11 Plan 14: Final Design-System Deletion Sweep Summary

**Old Teavision token system removed, Tailwind palette generation narrowed to the new design tokens, and the full redesigned storefront verification gate passes.**

## Performance

- **Duration:** 31 min
- **Started:** 2026-06-10T05:10:00Z
- **Completed:** 2026-06-10T05:40:12Z
- **Tasks:** 3
- **Files modified:** 25

## Accomplishments

- Migrated remaining old token consumers outside `globals.css`, removed the temporary `Section` `brandStrong` tone, and renamed the footer text-link module to avoid stale token terminology.
- Deleted all legacy `--tv-*`, steep, stone, old scale, old footer, old action/status, and stale typography utility definitions from `src/app/globals.css`.
- Added the Tailwind `--color-*: initial` default-palette wipe and updated the Section tone misuse rule from `text-on-brand` to `text-paper`.
- Refreshed `docs/conventions.md` and `AGENTS.md` to document the new token vocabulary.
- Ran the full phase gate through lint, typecheck, contracts, unit, integration, production build, Storybook build, Storybook tests, and fake-Shopify e2e.

## Task Commits

1. **Task 1: Straggler migration + retire Section brandStrong** - `56a6058` (fix)
2. **Task 2: Delete the old system from globals.css + palette wipe + guard-rule update** - `4a92dda` (fix)
3. **Task 3: Docs refresh + full phase verification gate** - `3cdd1a9` (fix)

## Files Created/Modified

- `src/app/globals.css` - Single new-token Tailwind theme, default-palette wipe, legacy token deletion, responsive text containment.
- `src/components/ui/section/section.tsx` - Removed temporary `brandStrong` tone.
- `scripts/eslint-rules/no-section-root-tone-class.mjs` - Updated forbidden Section root foreground tone regex to include `text-paper`.
- `docs/conventions.md` - Updated styling examples and new rhythm/container guidance.
- `AGENTS.md` - Updated token examples to the real Phase 11 vocabulary.
- `src/lib/cart/events.ts` - Shared cart mutation event name.
- `src/components/product/use-add-to-cart.ts` - Dispatches cart-changed event after successful add-to-cart.
- `src/components/layout/header/cart-count.tsx` - Refreshes header count when cart mutations occur.
- `src/lib/cart/actions.ts` - Returns cart mutation state that can signal successful line changes.
- `src/app/(storefront)/cart/_components/cart-line-actions.tsx` - Dispatches cart-changed event after successful quantity/remove actions.
- `src/lib/cart/actions.test.ts` - Covers updated cart mutation state.
- `tests/e2e/cart-checkout.spec.ts` - Updated fake-Shopify cart-to-checkout assertion for redesigned empty-cart copy.
- Story files under cart, homepage, footer, product, and Searchanise - Updated interaction coverage to match redesigned UI and lazy widget behavior.
- `vitest.storybook.config.mts` - Points Storybook tests at the real `.storybook` config.

## Decisions Made

- Deleted old tokens outright rather than aliasing them to the new system because RD-02 requires complete removal.
- Kept `--color-*: initial`; Tailwind accepted the syntax and all build gates passed.
- Used a shared browser event for cart mutation refresh because cart state remains cookie-backed and no client-side cart store is allowed by project architecture.

## Verification

- `rg -n "bg-canvas|bg-surface|surface-sunken|surface-raised|text-default|text-strong|text-muted|text-subtle|text-on-brand|text-link|text-accent|border-default|border-subtle|border-strong|bg-inverse|bg-strong|footer-|action-|success-bg|success-text|success-border|danger-bg|danger-text|danger-border|brand-strong|brand-subtle|bg-accent|type-display-01|type-display-02|brandStrong" src .storybook --glob '!src/app/globals.css'` returned zero old-token consumers.
- `rg -n "tv-|steep-|stone-" src/app/globals.css` returned zero matches.
- `rg -n "tv-|steep-|stone-" src .storybook scripts/component-contracts` returned zero token matches.
- `rg -n -- "-\[(#|rgb|oklch|hsl)" src` returned zero raw arbitrary color matches.
- `pnpm lint:tailwind` passed.
- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm test:contracts` passed, 35 tests.
- `pnpm test:unit` passed, 10 files and 38 tests.
- `pnpm test:integration` passed, 2 files and 10 tests.
- `pnpm build` passed, 58 static pages generated.
- `pnpm build-storybook` passed.
- `pnpm test:stories` passed, 82 files and 287 tests.
- `pnpm test:e2e` passed, 1 fake-Shopify cart checkout handoff test.

Storybook emitted non-failing Next image LCP warnings, and the e2e dev server emitted non-failing cache-bypass warnings. No visual-regression tooling is configured; a manual desktop and 375px visual pass against `extracted-design.html` remains for `/gsd-verify-work`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Storybook test config path**

- **Found during:** Task 3 full phase verification
- **Issue:** `pnpm test:stories` failed before running stories because the config referenced missing `.storybook-test`.
- **Fix:** Updated `vitest.storybook.config.mts` to use the real `.storybook` config.
- **Files modified:** `vitest.storybook.config.mts`
- **Verification:** `pnpm test:stories` passed, 82 files and 287 tests.
- **Committed in:** `3cdd1a9`

**2. [Rule 2 - Missing Critical] Added cart mutation refresh signaling**

- **Found during:** Task 3 e2e verification
- **Issue:** The fake-Shopify cart-to-checkout handoff exposed stale header cart count after cart mutations.
- **Fix:** Added `CART_CHANGED_EVENT`, dispatches from add/update/remove flows, and a `CartCount` listener that refetches server cart state.
- **Files modified:** `src/lib/cart/events.ts`, `src/components/product/use-add-to-cart.ts`, `src/components/layout/header/cart-count.tsx`, `src/lib/cart/actions.ts`, `src/app/(storefront)/cart/_components/cart-line-actions.tsx`, `src/lib/cart/actions.test.ts`
- **Verification:** `pnpm test:unit` and `pnpm test:e2e` passed.
- **Committed in:** `3cdd1a9`

**3. [Rule 2 - Missing Critical] Added responsive text containment**

- **Found during:** Task 3 Storybook interaction verification
- **Issue:** Long unbroken story content could overflow redesigned surfaces at narrow widths.
- **Fix:** Added global `overflow-wrap: anywhere` for common text elements and tightened Tea Journal list containment.
- **Files modified:** `src/app/globals.css`, `src/components/homepage/tea-journal/tea-journal.tsx`
- **Verification:** `pnpm test:stories` passed.
- **Committed in:** `3cdd1a9`

**4. [Rule 1 - Bug] Updated stale Storybook and e2e expectations**

- **Found during:** Task 3 full phase verification
- **Issue:** Several tests and stories still asserted old labels, DOM structure, or widget timing from before the redesign.
- **Fix:** Updated CTA args, footer newsletter labels, payment mark query, product form label, Searchanise fixture timing, cart checkout story queries, and empty cart e2e copy.
- **Files modified:** Story files under `src/components`, `src/app/(storefront)/cart/_components/cart-view.stories.tsx`, `tests/e2e/cart-checkout.spec.ts`
- **Verification:** `pnpm test:stories` and `pnpm test:e2e` passed.
- **Committed in:** `3cdd1a9`

**5. [Rule 3 - Blocking] Cleared stale local dev server before e2e**

- **Found during:** Task 3 e2e verification
- **Issue:** Playwright could not start its managed Next server because a repo-local `next dev` process was already running on port 3000.
- **Fix:** Confirmed the process belonged to this repository and stopped PID 21960 before rerunning e2e.
- **Files modified:** None
- **Verification:** `pnpm test:e2e` passed.
- **Committed in:** Not applicable

---

**Total deviations:** 5 auto-fixed (1 bug, 2 missing critical, 2 blocking)
**Impact on plan:** All deviations were necessary to satisfy the plan's verification gate and preserve the redesigned storefront behavior. No architectural changes were introduced.

## Issues Encountered

- The full gate initially failed at Storybook configuration, story assertions, responsive overflow checks, and fake-Shopify cart count behavior. Each issue was fixed inline and verified by rerunning the relevant gate before the final full gate.

## Known Stubs

None. Stub scan found only benign test/story defaults and nullable test fixture state, not placeholder UI data or unresolved TODO/FIXME markers.

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, schema changes, or trust-boundary expansions were introduced.

## Auth Gates

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 11 now has a single new-token design system and a green automated gate. Manual `/gsd-verify-work` visual review should compare desktop and 375px surfaces against `extracted-design.html` because no visual-regression tooling is configured.

## Self-Check: PASSED

- Summary file exists: `.planning/phases/11-full-visual-redesign/11-14-SUMMARY.md`
- Task commits found: `56a6058`, `4a92dda`, `3cdd1a9`
- Key files found: `src/app/globals.css`, `src/components/ui/section/section.tsx`, `scripts/eslint-rules/no-section-root-tone-class.mjs`, `docs/conventions.md`, `AGENTS.md`, `src/lib/cart/events.ts`

---

_Phase: 11-full-visual-redesign_
_Completed: 2026-06-10_
