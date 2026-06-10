---
status: diagnosed
trigger: "Phase 11 UAT test 5 — fullscreen mobile menu UX cluster (375px): no close button, persistent chip-row scrollbar, button-like chips, ambiguous View-all arrow, inconsistent alignment; site-wide Button hover lift disliked"
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED — all six sub-issues root-caused via static analysis (see Resolution)
test: complete
expecting: n/a
next_action: return diagnosis to orchestrator (goal: find_root_cause_only — no fixes applied)

## Symptoms

expected: Mobile menu has visible close affordance; chip row scrolls without permanent scrollbar; category selectors read as tabs not buttons; View-all link affordance unambiguous; consistent left alignment; no hover lift on buttons
actual: 1) No close X reachable while menu open. 2) Horizontal scrollbar always visible on Shop chip row. 3) Chips look like buttons. 4) "View all X →" arrow reads as submenu indicator. 5) Inconsistent indentation of links/headings/chips. 6) Filled Button variants lift on hover (-translate-y-0.5 + shadow-2) site-wide.
errors: none (visual/UX)
reproduction: Open site at ~375px, tap burger, expand Shop accordion
started: Phase 11 mobile menu implementation

## Eliminated

- hypothesis: Burger does not toggle to an X icon
  evidence: header.tsx lines 127-131 conditionally render X when mobileOpen — toggle logic exists; the issue is paint order, not state
  timestamp: 2026-06-10

## Evidence

- timestamp: 2026-06-10
  checked: header.tsx structure and z-indexes
  found: header is `sticky top-0 z-60` (stacking context). MobileMegaNav rendered INSIDE header (line 138). Menu container is `fixed inset-0 top-0 z-55 bg-paper` (mobile-mega-nav.tsx line 39). Main bar div (contains burger) has NO z-index — paints at auto(0) within header's stacking context, below the z-55 overlay.
  implication: Overlay covers entire viewport including header bar; burger/X exists but is painted over and unreachable. Menu itself renders no close button.

- timestamp: 2026-06-10
  checked: mobile-shop-panel.tsx chip row
  found: Line 24 `overflow-x-auto md:overflow-visible` wrapping `flex min-w-max gap-2` of ToggleButton variant="menuRow" chips. No scrollbar-hiding utility anywhere.
  implication: Classic (Windows) scrollbars render permanently whenever min-w-max content exceeds container; no scrollbar-none/mask styling.

- timestamp: 2026-06-10
  checked: toggle-button.tsx variants
  found: menuRow variant = rounded-md, border border-transparent, aria-pressed:border-hairline-2 aria-pressed:bg-brand-tint — pressed state gets visible border + fill = button look. chip variant even more so (rounded-full border-hairline bg-card).
  implication: Category selectors get button/chip treatment by design of ToggleButton variants.

- timestamp: 2026-06-10
  checked: mobile-shop-panel.tsx View-all CTA + alignment
  found: Lines 75-86 — Link with ChevronRight (same icon as DIRECT_LINKS submenu-ish rows and menuRow chevrons). Padding survey inside px-gutter container: section heading p has px-0; PANEL_LINK_CLASS px-2.5; View-all CTA px-3.5; menuRow chips px-3; accordion headers px-gutter at outer level.
  implication: Four different left text edges inside the same panel; ChevronRight is overloaded (submenu indicator on accordion rows vs link decoration on CTA).

- timestamp: 2026-06-10
  checked: button.tsx cva
  found: Lines 21, 23, 27 — brand, primary, inverse variants each include `hover:-translate-y-0.5 hover:shadow-2 motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-0`.
  implication: Hover lift is defined per-variant in buttonVariants cva, single file.

- timestamp: 2026-06-10
  checked: scripts/component-contracts/button-system.test.mjs (full read) + grep for translate/shadow-2 in scripts/
  found: NO contract test asserts the hover-lift classes. button-system.test.mjs asserts: min-h-11 touch targets, exact sm size string `type-label min-h-11 px-4.5 text-[0.86rem]`, `items-center justify-center gap-2.5` appears exactly once, inverseSecondary exists, banned role-variants absent, motion-reduce guards on group-hover:scale image zooms (different feature). Removing hover lift breaks none of these. The lift IS documented in .planning/phases/11-full-visual-redesign/11-UI-SPEC.md line 183 and 11-02-SUMMARY.md — docs, not test, are the lockstep artifact.
  implication: Hover-lift removal is test-safe; update UI-SPEC doc in lockstep instead.

- timestamp: 2026-06-10
  checked: grep "scrollbar" in src/
  found: Zero matches — no scrollbar-hiding or scrollbar-styling utilities anywhere in the codebase.
  implication: The overflow-x-auto chip row renders the OS-native (classic, always-visible on Windows) horizontal scrollbar whenever min-w-max content overflows.

- timestamp: 2026-06-10
  checked: mega-nav-data.ts SHOP_SECTIONS
  found: 4 sections (Tea, Tea Bags, Herbs & Spices, Superfood Powders). With menuRow px-3 + min-w-max single-row flex, total chip width exceeds 375px-minus-gutters — genuine overflow at the UAT viewport.
  implication: Scrollbar is structurally guaranteed at 375px; combined with no scrollbar styling it is permanently visible.

- timestamp: 2026-06-10
  checked: design/extracted-design.html mega menu reference
  found: `.hdr__burger { display: none }` — reference is desktop-only, no mobile menu treatment to copy. Critically, `.mega__col a` uses `padding: 7px 10px; margin-left: -10px` so link TEXT edge aligns flush with headings; implementation's PANEL_LINK_CLASS has px-2.5 (10px) but no negative-margin compensation.
  implication: Design intent was text-edge alignment via negative margin on padded hover-pill links; implementation dropped it, producing the staggered indentation.

## Resolution

root_cause: |
  1) No close affordance: header.tsx renders MobileMegaNav INSIDE <header className="sticky top-0 z-60"> (line 138). The header's z-60 creates a stacking context; within it the menu overlay (mobile-mega-nav.tsx line 39, `fixed inset-0 top-0 z-55`) paints ABOVE the z-auto main-bar div containing the burger IconButton. The burger DOES toggle Menu→X (header.tsx 127-131) but is covered by the full-viewport overlay, and MobileMegaNav renders no close button of its own — links are the only escape.
  2) Persistent scrollbar: mobile-shop-panel.tsx line 24-25 — `overflow-x-auto` wrapping `flex min-w-max gap-2`; 4 chips can't fit at 375px so overflow always exists, and with no scrollbar-hiding utility in the codebase the native classic scrollbar (Windows) renders permanently.
  3) Button-like chips: mobile-shop-panel.tsx uses ToggleButton variant="menuRow" (toggle-button.tsx line 18-19): rounded-md + border + aria-pressed:bg-brand-tint + aria-pressed:border-hairline-2 = filled/bordered button treatment.
  4) Ambiguous arrow: mobile-shop-panel.tsx lines 75-86 — "View all {name}" Link decorated with ChevronRight, the SAME icon used by DIRECT_LINKS rows (mobile-mega-nav.tsx 107) and desktop menuRow toggles, so it reads as drill-in/submenu, not navigation.
  5) Misalignment: four distinct left text-edges inside one px-gutter container — section heading px-0, PANEL_LINK_CLASS px-2.5 (mega-nav-styles.ts line 7), View-all CTA px-3.5, menuRow chips px-3; the design reference aligned padded links via margin-left:-10px which was not carried over.
  6) Hover lift: button.tsx lines 21/23/27 — brand, primary, inverse variants each hard-code `hover:-translate-y-0.5 hover:shadow-2` in the cva. No contract test asserts these classes; 11-UI-SPEC.md documents them.
fix: NOT APPLIED (goal: find_root_cause_only)
verification: static analysis only
files_changed: []
