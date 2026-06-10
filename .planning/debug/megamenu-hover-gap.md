---
status: diagnosed
trigger: "UAT Phase 11 test 17: cannot move cursor from desktop header nav trigger into mega menu panel — panel disappears while cursor is about to enter it, probably because of the gap"
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED — 16px hover dead zone between nav `<li>` bottom edge (~y=98px) and fixed panel top (y=114px), with immediate synchronous close on `onMouseLeave` and no grace timeout or hover bridge
test: static geometry computation from class names + handler wiring trace
expecting: n/a — root cause confirmed
next_action: return diagnosis (goal: find_root_cause_only)

## Symptoms

expected: Hovering "Shop" or "Services" opens the mega panel; user can move the cursor down into the panel and interact with links
actual: Panel closes while the cursor travels from the trigger toward the panel; panel is gone before the cursor reaches it
errors: none (behavioral bug, no console errors)
reproduction: Desktop (lg+ viewport). Hover "Shop" trigger → panel opens → move cursor straight down toward panel → panel disappears mid-travel
started: After Phase 11 plan 11-04 repositioned mega panels from absolute-inside-`<li>` to `fixed inset-x-0 top-28.5 z-50`

## Eliminated

- hypothesis: "Scrolled state opens a 38px dead gap because the utility bar scrolls away while panels stay at top-28.5"
  evidence: REFUTED by header.tsx line 29 — the `<header className="sticky top-0 z-60">` element wraps BOTH the utility bar (h-9.5) and the main bar (h-19). The entire header is sticky, so the utility bar never scrolls away on desktop. Header bottom stays at y=114px = panel top (top-28.5 = 114px) at all scroll positions.
  timestamp: 2026-06-10

- hypothesis: "Below-sm viewport hides utility bar (hidden sm:block), creating a 38px mismatch"
  evidence: REFUTED for this symptom — MegaNav desktop nav is only rendered inside `hidden lg:flex` (header.tsx line 80). At lg+ the utility bar (`hidden sm:block`) is always visible, so the 38px sm-breakpoint mismatch can never coincide with the desktop mega nav being usable.
  timestamp: 2026-06-10

## Evidence

- timestamp: 2026-06-10
  checked: mega-nav.tsx lines 41-44 and 66-69 — open/close wiring
  found: Each `<li>` has `onMouseEnter={() => setOpenMenu('shop')}` and `onMouseLeave={() => setOpenMenu(null)}`. Close is synchronous and immediate — no setTimeout grace period, no delay, no intent detection.
  implication: The instant the cursor crosses the li's bottom edge, the panel state goes null and the panel gets `hidden`.

- timestamp: 2026-06-10
  checked: mega-nav.tsx lines 104-118 — panel wrapper hover handlers
  found: A sibling wrapper `<div onMouseEnter={() => openMenu && setOpenMenu(openMenu)} onMouseLeave={...}>` wraps both panels. But the wrapper has zero in-flow size (its only children are `position: fixed` panels), so its mouseenter only fires when the cursor is over the fixed panel itself. Once the panel is `hidden` (closed by the li mouseleave), it is removed from hit-testing and the wrapper's mouseenter can never fire to rescue the open state.
  implication: The keep-open handler exists but is unreachable because the panel closes before the cursor can arrive.

- timestamp: 2026-06-10
  checked: Pixel geometry from class names (default Tailwind spacing scale confirmed intact in globals.css — only --spacing-gutter/--spacing-section customized)
  found:
    - Utility bar: h-9.5 = 38px (header.tsx line 31)
    - Main bar: h-19 = 76px (header.tsx line 62); header total = 114px
    - Panels: `fixed inset-x-0 top-28.5` = top: 114px (shop-mega-panel.tsx line 20, services-mega-panel.tsx line 14) — flush with header bottom
    - Nav trigger button: NAV_TRIGGER_CLASS has `min-h-11` = 44px (mega-nav-styles.ts line 3)
    - `<li>` is DESKTOP_MENU_ITEM_CLASS = `flex items-center` — shrinks to content height = 44px, vertically centered inside the 76px main bar (parent has `items-center`)
    - li vertical span: y ≈ 54px → 98px. Panel top: y = 114px.
    - DEAD GAP: ~16px (y 98→114) of main-bar background with no hover handler.
  implication: The hover area (the 44px-tall li) does not extend to the bottom of the header. Crossing y=98 fires mouseleave → close. The cursor then traverses ~16px of dead zone where nothing keeps the menu open, and the panel at y=114 is already hidden when the cursor gets there.

- timestamp: 2026-06-10
  checked: Pre-11-04 behavior implied by mega-nav-styles.ts line 9 comment ("used as height anchor only (no position:relative)")
  found: Plan 11-04 moved panels out of the `<li>` to fixed positioning. When the panel was absolutely positioned inside the li, it was a descendant — mouseleave on the li did not fire when moving into the panel. After 11-04, the panel is a sibling of the nav, so leaving the li toward the panel ALWAYS fires the li's mouseleave.
  implication: The repositioning broke the implicit hover containment that previously made enter-the-panel work; no compensating mechanism (grace timeout, bridge element, full-height trigger) was added.

## Resolution

root_cause: >
  Hover dead zone created by plan 11-04's fixed-position panel refactor. The desktop nav `<li>`
  hover area is only 44px tall (NAV_TRIGGER_CLASS min-h-11, li `flex items-center` shrink-to-content),
  vertically centered in the 76px main bar, so its bottom edge sits at ~y=98px — while the mega panels
  are `fixed top-28.5` (y=114px). Moving the cursor from trigger to panel crosses ~16px of unowned
  main-bar background; the li's `onMouseLeave` fires immediately with no grace timeout, setting
  openMenu to null and hiding the panel before the cursor can reach it. The panel wrapper's
  onMouseEnter keep-open handler is unreachable because the hidden panel no longer participates in
  hit-testing. (Secondary note: even with zero gap, the close relies on same-tick React batching of
  the li mouseleave + panel mouseenter; a grace timeout is the robust pattern.)
fix: not applied (goal: find_root_cause_only)
verification: n/a
files_changed: []
