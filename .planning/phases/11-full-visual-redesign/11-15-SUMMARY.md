---
phase: 11-full-visual-redesign
plan: 15
subsystem: header / navigation / button
tags: [gap-closure, header, mobile-nav, mega-menu, button, uat]
dependency_graph:
  requires: []
  provides: [utility-bar-responsive, mobile-menu-exit, mobile-chip-wrap, mega-menu-hover, button-no-lift]
  affects: [header.tsx, mega-nav.tsx, mobile-mega-nav.tsx, mobile-shop-panel.tsx, toggle-button.tsx, button.tsx]
tech_stack:
  added: []
  patterns: [grace-timeout-hover-intent, flex-wrap-chips, text-tab-toggle, full-height-li-hover-bridge]
key_files:
  created: []
  modified:
    - src/components/layout/header/header.tsx
    - src/components/ui/button/button.tsx
    - src/components/layout/header/mobile-mega-nav.tsx
    - src/components/layout/header/mobile-shop-panel.tsx
    - src/components/ui/toggle-button/toggle-button.tsx
    - src/components/layout/header/mega-nav.tsx
    - src/components/layout/header/mega-nav-styles.ts
    - .planning/phases/11-full-visual-redesign/11-UI-SPEC.md
decisions:
  - "Utility bar gated to lg+ (1024px) not sm (640px) — content needs ~1020px to fit single-line; no intermediate trim ladder added since lg-gate alone eliminates the sub-lg state"
  - "Button hover lift removed globally from brand/primary/inverse variants; owner directive, test-safe (no contract test asserts the lift classes)"
  - "Mobile overlay offset to top-19 (below sticky main bar) + explicit IconButton close row — keeps burger X reachable above overlay without requiring z-index changes to the header stacking context"
  - "tabText ToggleButton variant added for mobile category selector — text-tab treatment with no border/fill, distinct from chip/menuRow"
  - "View-all ChevronRight replaced with ArrowRight + underline in mobile-shop-panel — unambiguous navigation link vs drill-in indicator"
  - "Mega-menu hover dead zone fixed with 200ms grace timeout (scheduleClose/cancelClose) + DESKTOP_MENU_ITEM_CLASS extended to h-full self-stretch so hover area fills full main-bar height"
metrics:
  duration: 372s
  completed: 2026-06-10
  tasks_completed: 3
  files_changed: 8
---

# Phase 11 Plan 15: Header/Nav UAT Gap Closure Summary

Four confirmed UAT gaps (tests 3, 5, 17 + button hover-lift sub-issue from test 5) closed in header utility bar, mobile menu UX, and desktop mega-menu hover continuity — with global button hover-lift removed per owner directive.

## Tasks Completed

| # | Task | Commit | Key Files |
|---|------|--------|-----------|
| 1 | Utility bar lg-gate + button hover lift removal | `8525f10` | header.tsx, button.tsx, 11-UI-SPEC.md |
| 2 | Mobile menu close, chip wrap, text-tab, arrow link | `7a1370f` | mobile-mega-nav.tsx, mobile-shop-panel.tsx, toggle-button.tsx |
| 3 | Desktop mega-menu hover dead zone | `0a07976` | mega-nav.tsx, mega-nav-styles.ts |

## What Was Built

**Task 1 — Utility bar + button:**
- Utility bar visibility gated from `sm:block` to `lg:block` — content (~926px) only fits single-line at lg+ (1024px). Added `whitespace-nowrap overflow-hidden` guard on the inner flex container as a hard fallback.
- Removed `hover:-translate-y-0.5 hover:shadow-2 motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-0` from brand, primary, and inverse button variants. Color hover states kept. `transition-[background-color,color,box-shadow,transform]` frame kept. Contract tests pass (35/35).
- Updated 11-UI-SPEC.md line 183 to document "no hover lift" per owner directive.

**Task 2 — Mobile menu UX:**
- Mobile overlay changed from `fixed inset-0 top-0 z-55` to `fixed inset-x-0 bottom-0 top-19 z-55` — sits below the 76px sticky main bar so the burger/X button remains reachable above it.
- Added explicit `IconButton` close row at top of overlay for belt-and-suspenders discoverability.
- Mobile category chips changed from `overflow-x-auto + flex min-w-max` to `flex-wrap` — chips wrap at 375px with no horizontal scrollbar.
- Added `tabText` ToggleButton variant: text-only tab treatment (`type-label`, `rounded-sm`, no border/fill, brand `border-b` on active). Mobile selector uses `tabText` instead of `menuRow`.
- View-all CTA: replaced `ChevronRight` with `ArrowRight` + `underline underline-offset-2` — visually distinct from drill-in chevrons on accordion rows.
- Links list wrapped in `-mx-2.5` to apply design's negative-margin compensation, aligning link text edge with section headings.

**Task 3 — Desktop mega-menu hover dead zone:**
- Added `closeTimerRef` + `scheduleClose` / `cancelClose` / `openMenuNow` functions implementing 200ms grace timeout.
- `onMouseLeave` on trigger `<li>` elements now calls `scheduleClose` instead of synchronous `setOpenMenu(null)`.
- `onMouseEnter` on panel wrapper div calls `cancelClose` — cursor can cross the gap and keep the panel alive.
- `DESKTOP_MENU_ITEM_CLASS` extended to `flex h-full items-center self-stretch`; `<ul>` changed to `flex h-full items-stretch gap-1` so each `<li>` fills the full 76px main-bar height, eliminating the ~16px dead zone at y=98–114px.
- `useEffect` cleanup clears the timer on unmount.

## Verification

- `pnpm test:contracts`: **35/35 pass** (all three tasks)
- `pnpm lint`: pass
- `pnpm typecheck`: pass

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing] Used IconButton instead of raw `<button>` for overlay close row**
- **Found during:** Task 2
- **Issue:** ESLint rule `teavision/no-raw-button` prohibits raw `<button>` elements in feature components. The initial close button used a raw `<button>`.
- **Fix:** Replaced with `IconButton` from `@/components/ui`, matching the codebase pattern used elsewhere in the header.
- **Files modified:** `src/components/layout/header/mobile-mega-nav.tsx`
- **Commit:** `7a1370f`

## Known Stubs

None — all changes are behavioral/structural fixes with no placeholder data.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary surface introduced.

## Self-Check: PASSED

- `src/components/layout/header/header.tsx` — FOUND
- `src/components/ui/button/button.tsx` — FOUND
- `src/components/layout/header/mobile-mega-nav.tsx` — FOUND
- `src/components/layout/header/mobile-shop-panel.tsx` — FOUND
- `src/components/ui/toggle-button/toggle-button.tsx` — FOUND
- `src/components/layout/header/mega-nav.tsx` — FOUND
- `src/components/layout/header/mega-nav-styles.ts` — FOUND
- Commits `8525f10`, `7a1370f`, `0a07976` — all present in git log
