---
phase: 11-full-visual-redesign
plan: 01
subsystem: ui
tags: [tailwind, next-font, design-tokens, css, storybook, spectral, oklch]

requires: []
provides:
  - "Four brand-motif PNGs in public/images/ (stamp-ring, illo-cup, illo-teapot, illo-handshake)"
  - "Self-hosted Spectral/Hanken Grotesk/Space Mono/Caveat fonts via next/font"
  - "Phase 11 dual-token globals.css: new @theme tokens alongside old --tv-* tokens"
  - "New type utilities: type-display, type-lede, type-mono-meta"
  - "Storybook backgrounds updated to new token vars"
affects: [11-02, 11-03, 11-04, 11-05, 11-06, 11-07, 11-08, 11-09, 11-10, 11-11, 11-12, 11-13, 11-14]

tech-stack:
  added: [Spectral (next/font), Hanken_Grotesk (next/font), Space_Mono (next/font), Caveat (next/font)]
  patterns:
    - "Dual-token globals.css: new OKLCH tokens live alongside old --tv-* tokens; deletion deferred to plan 11-14"
    - "--color-brand/ring/radius/shadow/container-wide are last-write-wins overrides within @theme inline"
    - "type-eyebrow and type-mono-meta both use font-mono; eyebrow is 700/0.22em, mono-meta is 400/0.08em"

key-files:
  created:
    - scripts/extract-redesign-assets.mjs
    - public/images/stamp-ring.png
    - public/images/illo-cup.png
    - public/images/illo-teapot.png
    - public/images/illo-handshake.png
  modified:
    - src/app/layout.tsx
    - src/app/globals.css
    - .storybook/preview.ts

key-decisions:
  - "Fonts are self-hosted via next/font (no runtime fonts.googleapis.com references)"
  - "Spectral uses explicit weights [300,400,500,600] + italic style because it is not a variable font"
  - "New tokens added ALONGSIDE old --tv-* tokens; deletion is plan 11-14 only"
  - "--color-ring, --radius-*, --shadow-*, --container-wide: new values placed after old in @theme inline so they win"
  - "type-eyebrow switched from font-sans to font-mono per UI-SPEC §2 table"
  - "SITE_URL added to .env.local (was missing, caused build failure; Rule 3 auto-fix)"

patterns-established:
  - "Dual-system CSS: old system intact until final sweep (11-14); consumers migrate incrementally per-surface plan"
  - "OKLCH color space for all Phase 11 palette tokens (warm/botanical, green-undertone ink)"

requirements-completed: [RD-01]

duration: ~35min
completed: 2026-06-10
---

# Phase 11 Plan 01: Brand Foundation — Fonts, Tokens, and Motif Assets Summary

**Spectral/Hanken Grotesk/Space Mono/Caveat self-hosted fonts wired, full OKLCH design-token set (paper/ink/brand/gold/hairline/rhythm) added to globals.css alongside old --tv-* tokens, four brand-motif PNGs extracted**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-06-10
- **Completed:** 2026-06-10
- **Tasks:** 3 (Task 1 was pre-committed; Tasks 2 and 3 completed this session)
- **Files modified:** 5

## Accomplishments

- Four brand-motif PNGs (stamp-ring, illo-cup, illo-teapot, illo-handshake) extracted from the design bundle and verified as valid PNG files
- Next.js root layout updated to load Spectral, Hanken Grotesk, Space Mono, and Caveat as CSS-variable fonts via next/font (self-hosted, no runtime Google Fonts requests)
- globals.css `@theme inline` remapped font tokens to new families; complete Phase 11 OKLCH token set added alongside old system (surfaces, ink, hairlines, brand greens, gold, danger, focus ring, new radii, rhythm spacing, containers, shadows)
- New type utilities added: `type-display` (Spectral clamp fluid), `type-lede`, `type-mono-meta`; existing utilities redefined with new UI-SPEC values; `type-display-01`/`type-display-02` preserved for consumer migration
- Storybook backgrounds updated from `--tv-bg-canvas`/`--tv-bg-surface` to `--color-paper`/`--color-card`

## Task Commits

1. **Task 1: Extract motif PNGs** - `eebb2c6` (feat) — pre-committed by prior executor
2. **Task 2: Swap fonts** - `005baf4` (feat)
3. **Task 3: New @theme tokens + type utilities + Storybook** - `64a054d` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified

- `scripts/extract-redesign-assets.mjs` — One-off motif PNG extractor from design/teavision-redesign.html
- `public/images/stamp-ring.png` — Brand stamp/ring motif (28 KB)
- `public/images/illo-cup.png` — Cup illustration motif (68 KB)
- `public/images/illo-teapot.png` — Teapot illustration motif (45 KB)
- `public/images/illo-handshake.png` — Handshake illustration motif (72 KB)
- `src/app/layout.tsx` — Spectral/Hanken_Grotesk/Space_Mono/Caveat font loading
- `src/app/globals.css` — Font token remap + full Phase 11 @theme token set + new type utilities + updated @layer base
- `.storybook/preview.ts` — Background tokens updated to new system

## Decisions Made

- Spectral uses explicit weights [300, 400, 500, 600] with normal+italic style since it is not a variable font; italic is load-bearing for display accents
- New tokens are added ALONGSIDE old `--tv-*` tokens — no deletion until plan 11-14; this keeps every existing consumer compiling
- `--color-ring`, `--radius-*`, `--shadow-*`, and `--container-wide` are redeclared after the old values in `@theme inline` so they override via last-write-wins
- `type-eyebrow` switched from `font-sans` to `font-mono` per UI-SPEC §2 (was `font-sans/600/0.08em`; now `font-mono/700/0.22em`)
- `text-brand` and `border-brand` `@utility` rules updated to reference `--color-brand` (new OKLCH value) instead of `--tv-text-brand`/`--tv-border-brand`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added SITE_URL to .env.local**
- **Found during:** Task 2 verification (`pnpm build`)
- **Issue:** `SITE_URL` environment variable was missing from `.env.local`, causing `src/lib/seo/site-url.ts` to throw at build time
- **Fix:** Added `SITE_URL=https://teavision.com.au` to `.env.local`
- **Files modified:** `.env.local`
- **Verification:** `pnpm build` exits 0
- **Committed in:** `005baf4` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking env var)
**Impact on plan:** Essential fix — build could not complete without it. No scope creep.

## Issues Encountered

- Task 2 was partially applied by the previous executor (layout.tsx updated, globals.css not yet updated). Completed the globals.css font token remap and committed both files together.

## Known Stubs

None — this plan adds foundation assets and tokens only; no UI components with data rendering.

## Threat Flags

No new security-relevant surface identified beyond what is documented in the plan's threat model (T-11-01, T-11-02, T-11-03).

## Next Phase Readiness

- All Phase 11 foundation tokens are live: `bg-paper`, `text-ink`, `text-ink-soft`, `text-ink-faint`, `border-hairline`, `bg-brand`, `text-brand`, `text-gold`, `type-mono-meta`, `px-gutter`, `py-section`, `max-w-wide`, etc.
- Every existing consumer continues to compile (old `--tv-*` tokens intact)
- Ready for per-surface migration plans (11-02 onward)

## Self-Check: PASSED

- `public/images/stamp-ring.png` — FOUND
- `public/images/illo-cup.png` — FOUND
- `public/images/illo-teapot.png` — FOUND
- `public/images/illo-handshake.png` — FOUND
- `scripts/extract-redesign-assets.mjs` — FOUND
- `src/app/layout.tsx` — FOUND (Spectral fonts)
- `src/app/globals.css` — FOUND (--color-paper, type-display, type-mono-meta)
- `.storybook/preview.ts` — FOUND (color-paper backgrounds)
- Commit eebb2c6 — FOUND
- Commit 005baf4 — FOUND
- Commit 64a054d — FOUND

---
*Phase: 11-full-visual-redesign*
*Completed: 2026-06-10*
