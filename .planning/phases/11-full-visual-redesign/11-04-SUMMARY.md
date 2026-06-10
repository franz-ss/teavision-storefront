---
phase: 11-full-visual-redesign
plan: '04'
subsystem: layout/header
tags: [header, mega-nav, search, mobile-menu, design-system, restyle]
dependency_graph:
  requires: ['11-02', '11-03']
  provides: [header-chrome-restyle]
  affects: [all-pages]
tech_stack:
  added: [SearchOverlay]
  patterns: [fixed-mega-panel, search-overlay-portal, pill-nav, gold-cart-badge]
key_files:
  created:
    - src/components/layout/header/search-overlay.tsx
  modified:
    - src/components/layout/header/header.tsx
    - src/components/layout/header/header.stories.tsx
    - src/components/layout/header/cart-badge.tsx
    - src/components/layout/header/cart-badge.stories.tsx
    - src/components/layout/header/mega-nav.tsx
    - src/components/layout/header/mega-nav.stories.tsx
    - src/components/layout/header/mega-nav-styles.ts
    - src/components/layout/header/shop-mega-panel.tsx
    - src/components/layout/header/services-mega-panel.tsx
    - src/components/layout/header/services-links.tsx
    - src/components/layout/header/catalogue-links.tsx
    - src/components/layout/header/mobile-mega-nav.tsx
    - src/components/layout/header/mobile-shop-panel.tsx
    - src/components/layout/header/mobile-services-panel.tsx
    - src/components/layout/header/search-form.tsx
    - src/components/layout/header/search-form.stories.tsx
    - src/components/layout/header/search-autocomplete.stories.tsx
    - src/components/layout/header/search-suggestions.tsx
    - src/components/layout/header/search-types.ts
decisions:
  - 'Mobile burger state lifted into header.tsx; MobileMegaNav accepts open/onClose props'
  - 'Mega panels repositioned to fixed top-28.5 (114px = 38px utility + 76px main) for full-width coverage'
  - 'Search moved from inline header bar to SearchOverlay portal with popular-suggestion pills'
  - 'Shop mega panel: ToggleButton chip for category tabs instead of raw buttons'
metrics:
  duration: '~17 minutes'
  completed_date: '2026-06-10'
  tasks_completed: 3
  files_changed: 20
---

# Phase 11 Plan 04: Header Chrome Redesign Summary

Header chrome restyled to the new design system: ink utility/announcement bar, translucent sticky main bar with pill nav and gold cart badge, full-width fixed mega menus, serif search overlay, and fullscreen mobile menu. All link destinations, Searchanise autocomplete flow, and cart-count data flow preserved.

## Tasks Completed

| Task | Name                                     | Commit  | Key Files                                                                                 |
| ---- | ---------------------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| 1    | Utility bar + main bar + gold cart badge | d38d781 | header.tsx, cart-badge.tsx, search-overlay.tsx, mobile-mega-nav.tsx                       |
| 2    | Mega menus (shop + services) and scrim   | 1e6a666 | mega-nav.tsx, mega-nav-styles.ts, shop-mega-panel.tsx, services-mega-panel.tsx            |
| 3    | Search overlay + mobile menu             | d9444af | search-form.tsx, search-suggestions.tsx, mobile-shop-panel.tsx, mobile-services-panel.tsx |

## What Was Built

### Utility Bar (Task 1)

- 38px ink bar (`bg-ink text-paper h-9.5 hidden sm:block`) with `font-mono text-[11.5px] tracking-[0.08em]`
- Left ticker: "EST. MELBOURNE 2014 · ACO + USDA CERTIFIED ORGANIC · FREIGHT-INSURED, WORLDWIDE" (orchestrator decision #2 copy)
- Right group: "Apply for wholesale" → `/pages/wholesale` and `tel:1300729617` "1300 729 617" (from footer/data.ts real contact data); `text-paper/85 hover:text-paper`

### Main Bar (Task 1)

- `h-19 sticky top-0 z-60 bg-paper/80 backdrop-blur-md border-b border-hairline`
- Logo left (existing SVG, link preserved)
- Desktop: `MegaNav` with pill `DisclosureButton` triggers
- Right cluster: search IconButton, cart Link (relative for CartCount badge), wholesale `Button variant="brand" size="sm"`, mobile burger `IconButton`
- Mobile burger state lifted to header.tsx; `MobileMegaNav` now receives `open`/`onClose` props

### Cart Badge (Task 1)

- `absolute top-1 right-1 min-w-4.5 h-4.5 rounded-full bg-gold text-ink font-mono text-[10px] font-bold`
- Data flow (server count + optimistic refresh via `CartCount`) unchanged

### Mega Menus (Task 2)

- Full-width fixed panels at `top-28.5 z-50 bg-paper border-b border-hairline shadow-4`
- `mega-nav-styles.ts`: NAV_TRIGGER_CLASS → `rounded-full px-3.5 py-2.5 type-label hover:bg-brand-tint hover:text-brand`; PANEL_LINK_CLASS → `rounded-md px-2.5 py-1.75 text-ink-soft hover:bg-brand-tint hover:text-brand`
- Shop panel: 3-col grid (`[1.1fr_2.4fr_1.3fr]`) — intro (Eyebrow + serif h4 + blurb + link-arrow CTA), category ToggleButton chips + link grid (mono uppercase headings), feature card with `bg-linear-to-t from-ink/70` scrim + `Badge onDark` + serif title
- Services panel: 2-col grid (intro + 3-col services/catalogue columns with mono headings)
- Page scrim: `bg-ink/35 backdrop-blur-[2px]` at `fixed inset-0 top-28.5 z-40`
- All href/link data in `mega-nav-data.ts` unchanged (verified via `git diff --stat`)

### Search Overlay (Tasks 1 + 3)

- New `SearchOverlay` component: `fixed inset-x-0 top-0 z-70 bg-paper border-b border-hairline shadow-4`
- Serif input via `SearchForm` with `font-display text-[clamp(1.4rem,3vw,2.2rem)] bg-transparent border-0 rounded-none` over `border-b-2 border-ink` rule
- `Eyebrow tone="muted" rule={false}` "Popular" label + 8 static suggestion pills `hover:bg-brand hover:text-paper`
- Backdrop scrim `bg-ink/35 backdrop-blur-[2px]` at `z-65`; Escape closes; focuses input on open
- Searchanise autocomplete fetch/debounce/keyboard nav fully preserved

### Mobile Menu (Task 1 + 3)

- Fullscreen `fixed bg-paper z-55` panel controlled by header burger
- Accordion rows use `DisclosureButton` with `font-display text-2xl py-5` per row; `border-b border-hairline`
- Expanded children use `MobileShopPanel`/`MobileServicesPanel` (bg-paper-2, new PANEL_LINK_CLASS)
- Footer: `Button variant="brand"` "Apply for Wholesale" + `Button variant="secondary"` phone CTA
- Accordion state + close-on-route-change preserved

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] MobileMegaNav interface changed to accept open/onClose props**

- **Found during:** Task 1 — header.tsx lifts burger state
- **Issue:** New header design controls burger state; `MobileMegaNav` needed to accept `open`/`onClose` props
- **Fix:** Added `MobileMegaNavProps = { open, onClose }` interface; removed self-contained toggle
- **Files modified:** mobile-mega-nav.tsx, mega-nav.stories.tsx (story updated to `open onClose={()=>{}}`)
- **Commit:** d38d781

**2. [Rule 3 - Blocking] SearchOverlay created as new file (not in plan file list)**

- **Found during:** Task 1 — header.tsx restructure moved search from inline to overlay
- **Issue:** Removing inline search from header bar requires an overlay component to hold the form
- **Fix:** Created `search-overlay.tsx` as new file
- **Files modified:** search-overlay.tsx (new)
- **Commit:** d38d781

**3. [Rule 1 - Bug] Mega panels repositioned to fixed (not absolute inside <li>)**

- **Found during:** Task 2 — full-width panel requirement
- **Issue:** Old architecture positioned panels via `absolute top-full left-1/2` inside `<li>` — incompatible with full-width design
- **Fix:** Panels now use `fixed inset-x-0 top-28.5 z-50`; scrim uses `fixed inset-0 top-28.5 z-40`
- **Files modified:** shop-mega-panel.tsx, services-mega-panel.tsx, mega-nav.tsx
- **Commit:** 1e6a666

**4. [Rule 2 - Missing] `inputClassName` prop added to SearchForm and search-types.ts**

- **Found during:** Task 3 — SearchForm needed to accept input-specific class override
- **Issue:** `TextInput` base classes conflict with overlay's borderless serif input style; SearchForm only forwarded `className` to the `Form` element
- **Fix:** Added `inputClassName?: string` to `SearchFormProps` and forwarded to `TextInput`
- **Files modified:** search-types.ts, search-form.tsx
- **Commit:** d9444af

## Known Stubs

None — all navigation links use real `mega-nav-data.ts` hrefs; cart count uses live server data; search uses real Searchanise autocomplete; suggestion pills link to real `/search?q=` routes.

## Threat Surface Scan

| Flag                           | File               | Description                                                                                                                    |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| threat_flag: user_input_to_url | search-overlay.tsx | Popular suggestion hrefs use `encodeURIComponent(suggestion)` — safe; suggestions are hardcoded static strings, not user input |

T-11-08 (search autocomplete tampering): existing typed-unknown narrowing and debounce untouched — integration tests confirm.
T-11-09 (utility bar phishing): hardcoded `/pages/wholesale` and `tel:1300729617` only.
T-11-10 (mega feature card XSS): uses `next/image` with Shopify CDN source; no `dangerouslySetInnerHTML`.

## Self-Check: PASSED

Files exist:

- `src/components/layout/header/header.tsx` FOUND
- `src/components/layout/header/search-overlay.tsx` FOUND
- `src/components/layout/header/cart-badge.tsx` FOUND
- `src/components/layout/header/mega-nav-styles.ts` FOUND
- `src/components/layout/header/shop-mega-panel.tsx` FOUND
- `src/components/layout/header/services-mega-panel.tsx` FOUND
- `src/components/layout/header/mobile-mega-nav.tsx` FOUND
- `src/components/layout/header/search-form.tsx` FOUND
- `src/components/layout/header/search-suggestions.tsx` FOUND
- `src/components/layout/header/mobile-shop-panel.tsx` FOUND
- `src/components/layout/header/mobile-services-panel.tsx` FOUND

Commits exist:

- d38d781 (Task 1) FOUND
- 1e6a666 (Task 2) FOUND
- d9444af (Task 3) FOUND

Verification:

- `pnpm lint` PASSED
- `pnpm typecheck` PASSED
- `pnpm lint:tailwind` PASSED (via pre-commit hook)
- `pnpm test:contracts` PASSED (35/35)
- `pnpm test:integration` PASSED (10/10)
- `grep -c "EST. MELBOURNE 2014" header.tsx` = 1 PASSED
- `grep -c "tel:1300729617" header.tsx` = 1 PASSED
- `grep -c "backdrop-blur" header.tsx` = 1 PASSED
- `grep -c "bg-gold" cart-badge.tsx` = 1 PASSED
- `grep -c "shadow-4" shop-mega-panel.tsx` = 1 PASSED
- Old token check (bg-canvas, bg-surface, etc.): 0 files PASSED
- `mega-nav-data.ts` unchanged PASSED
- `grep -c "font-display" search-form.tsx` = 1 PASSED
