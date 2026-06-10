---
status: diagnosed
trigger: "Phase 11 UAT test 3: header utility bar wraps into 3 cramped colliding lines at ~640-768px viewports"
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED — utility bar content needs ~1000px+ to fit on one line but is shown from sm (640px); fixed h-9.5 with no nowrap/responsive trimming causes internal text wrapping that overflows the 38px bar
test: static measurement of content width vs breakpoint; comparison against design mockup CSS/markup
expecting: n/a — root cause confirmed
next_action: return diagnosis (find_root_cause_only)

## Symptoms

expected: Utility bar content fits on a single 38px line at all viewports where the bar is visible
actual: Between 640px and ~1024px the left ticker text and right link cluster wrap into 2-3 lines that collide/overflow the fixed-height bar
errors: none (visual layout defect)
reproduction: Resize viewport to 640-768px; observe ink utility bar at top of header
started: Since utility bar implementation (header.tsx)

## Eliminated

- hypothesis: "Design mockup defines a narrow-width treatment (hide items / smaller text / marquee) that the implementation failed to port"
  evidence: Searched design/extracted-design.html, design/extracted/design-system.css, design/teavision-redesign.html — `.hdr__bar` and `.ticker` have NO media-query rules anywhere. The mockup is desktop-only (`.hdr__burger { display: none; }` is never re-enabled by any media query; no max-width block touches `.hdr*` selectors). Nothing was "missed" — the design simply never specified narrow-width behavior for this bar.
  timestamp: 2026-06-10

## Evidence

- timestamp: 2026-06-10
  checked: src/components/layout/header/header.tsx lines 31-58
  found: Bar is `bg-ink text-paper h-9.5 hidden sm:block` (fixed 38px height, visible from 640px). Inner row is `flex justify-between` (default nowrap) in `font-mono text-[11.5px] tracking-[0.08em]`. Left group has 3 long spans + 2 separators with gap-2; right group has 2 icon links + separator with gap-3. No `whitespace-nowrap`, no `overflow-hidden`, no intermediate breakpoint that drops content.
  implication: Flex items can't wrap as units, so when space runs out each span's TEXT wraps internally to multiple lines; the fixed 38px height with visible overflow makes the wrapped lines collide with each other and the main bar below.

- timestamp: 2026-06-10
  checked: Width budget of full content at 11.5px mono + 0.08em tracking (~7.8px/char advance)
  found: Left ticker ≈ 619px (75 chars + 4×8px gaps). Right cluster ≈ 307px (32 chars + 2 icons + 2×12px gaps). Content total ≈ 926px, plus 2× `px-gutter` = clamp(1.25rem, 5vw, 4.5rem) per side (~50px each at 1000px viewport) → full single-line fit requires roughly ≥1020-1050px viewport width.
  implication: The `sm` (640px) visibility breakpoint is ~380px too early. Content only fits comfortably at the `lg` (1024px) breakpoint and above — exactly matching the reported 640-1024px breakage range.

- timestamp: 2026-06-10
  checked: design/extracted/header.js lines 27-42, design/extracted/design-system.css lines 262-271, design/teavision-redesign.html
  found: Mockup `.hdr__bar` = 38px height, mono 11.5px, two `.ticker` flex groups with 26px gaps — exactly what was ported. Zero responsive rules for the bar; mockup was authored desktop-only.
  implication: Implementation faithfully copied a desktop-only design and then made it visible from 640px (`sm:block`), inventing a breakpoint the design never validated. Note also the redundant `hidden sm:flex` on the right cluster (line 40) — parent is already hidden below sm, suggesting the responsive classes were applied without a coherent narrow-width plan.

- timestamp: 2026-06-10
  checked: Element-drop budget at intermediate widths
  found: At 768px (gutters ≈ 77px total, usable ≈ 691px): left ticker alone (619px) fits only if the right cluster is dropped or the ticker is trimmed. Dropping "FREIGHT-INSURED, WORLDWIDE" + one separator (~211px) brings left to ≈ 408px, leaving ~283px — just under the right cluster (~307px); also dropping "ACO + USDA…" or the phone number gives comfortable fit. At 640px (gutters 64px, usable 576px): only a single short group fits (e.g. "EST. MELBOURNE 2014" + wholesale link ≈ 326px).
  implication: A workable trim ladder: below lg hide "FREIGHT-INSURED, WORLDWIDE"; below md additionally hide "ACO + USDA CERTIFIED ORGANIC" and/or the phone link; plus `whitespace-nowrap` + `overflow-hidden` as a hard guarantee against collision.

## Resolution

root_cause: The utility bar in header.tsx is shown from the `sm` breakpoint (640px) but its full single-line content (left ticker ≈619px + right cluster ≈307px + clamp-based gutters) requires roughly ≥1024px of viewport width. Nothing prevents wrapping or trims content between 640px and 1024px — no `whitespace-nowrap`, no `overflow-hidden`, and no responsive hiding of individual ticker items — so span text wraps to 2-3 lines inside a fixed `h-9.5` (38px) bar, producing the cramped/colliding overflow. The design mockup offers no narrow-width spec to follow: it is desktop-only with zero media queries for `.hdr__bar`/`.ticker`.
fix: (not applied — diagnose-only)
verification: (n/a)
files_changed: []
