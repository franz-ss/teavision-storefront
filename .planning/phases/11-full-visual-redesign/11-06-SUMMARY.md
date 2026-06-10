---
phase: 11-full-visual-redesign
plan: '06'
subsystem: homepage-upper
tags:
  [
    homepage,
    hero,
    proof-points,
    product-range,
    private-label,
    overlay-image-card,
    organic-herbs,
    certification-marquee,
    design-tokens,
    motion-reduce,
  ]
dependency_graph:
  requires: ['11-02', '11-03']
  provides:
    [
      'hero-A-composition',
      'proof-points-stat-band',
      'product-range-tiles',
      'private-label-service-cards',
      'organic-split',
      'certification-marquee',
    ]
  affects: ['src/app/(storefront)/page.tsx']
tech_stack:
  added: []
  patterns:
    [
      'hero-scrim CSS utility',
      'CSS-only marquee with @keyframes',
      'Section.Root tone=transparent for hero',
      'split-head section layout',
    ]
key_files:
  created: []
  modified:
    - src/app/globals.css
    - src/components/homepage/hero/hero.tsx
    - src/components/homepage/proof-points/proof-points.tsx
    - src/components/homepage/product-range/product-range.tsx
    - src/components/homepage/private-label/private-label.tsx
    - src/components/homepage/overlay-image-card/overlay-image-card.tsx
    - src/components/homepage/organic-herbs/organic-herbs.tsx
    - src/components/homepage/certification-coverage/certification-coverage.tsx
decisions:
  - 'Hero uses Section.Root tone=transparent spacing=none with hero-scrim CSS utility class — avoids raw oklch in className and satisfies the no-raw-section ESLint rule'
  - 'Hero CTA retains variant=brand (second button) to satisfy contract test assertion; first CTA uses variant=inverse'
  - 'PrivateLabel no longer reuses OverlayImageCard — .svc__card layout is sufficiently different (card-surface vs image-tile) to warrant inline implementation'
  - 'CertificationCoverage replaced cert cards with CSS-only marquee — pure Server Component, no use client, no JS animation'
metrics:
  duration: '535s (~9m)'
  completed_date: '2026-06-10'
  tasks: 3
  files_changed: 8
---

# Phase 11 Plan 06: Upper Homepage Sections Summary

**One-liner:** HeroA full-bleed editorial + green stat band + product tile grid + service cards + organic split + CSS-only certification marquee, all on new OKLCH tokens.

## Tasks Completed

| #   | Task                                               | Commit  | Files                                                        |
| --- | -------------------------------------------------- | ------- | ------------------------------------------------------------ |
| 1   | Hero A + proof-points stat band                    | 60d4c08 | hero.tsx, proof-points.tsx, globals.css                      |
| 2   | Product range + private-label + overlay-image-card | 0cba6bf | product-range.tsx, private-label.tsx, overlay-image-card.tsx |
| 3   | Organic split + certification marquee              | b36fa88 | organic-herbs.tsx, certification-coverage.tsx, globals.css   |

## What Was Built

### Task 1: Hero A + Proof-Points Stat Band

- **Hero (HeroA):** Full-bleed Shopify CDN image with `min(92vh, 860px)` height. Gradient scrim overlay via `hero-scrim` CSS utility (added to globals.css — linear-gradient 105deg, ink-green 82%→15%). Gold `Eyebrow`, `type-display` Spectral headline with `<em className="italic">` accent line, `type-lede text-paper/90` lede, two CTAs: `variant="inverse" size="lg"` + `variant="brand" size="lg"` (brand kept to satisfy contract test).
- **Proof-points stat band:** `Section.Root tone="brand"` (brand-deep green), 4-col grid (2-col mobile), `border-l border-paper/12` column rules, gold Lucide icons, `font-display text-[2.4rem] text-paper` stat values, `text-paper/78` labels.
- **globals.css:** Added `@utility hero-scrim` and later `@keyframes marquee` + `@utility animate-marquee`.

### Task 2: Product Range Tiles + Private-Label Service Cards + Overlay Image Card

- **OverlayImageCard (.rtile):** `aspect-[1/1.08] rounded-lg overflow-hidden`, `bg-linear-to-t from-ink/70 via-ink/20 to-transparent` bottom scrim, gold mono tag (font-mono text-[10px] tracking-[0.14em] uppercase text-gold), white Spectral title, hover-reveal "Shop now" with ArrowRight (opacity-0 → opacity-100, max-lg:opacity-100 for touch). Motion-reduce contract trio preserved on `group-hover:scale` line.
- **ProductRange:** Split section head (Eyebrow + type-heading-01 left, text-ink-soft description right), 4-col grid (md:2-col, 1-col mobile) with `gap-4.5`. Delegates tiles to OverlayImageCard.
- **PrivateLabel:** New `.svc__card` layout — 3-col `md:grid-cols-3`, each card `bg-card border border-hairline-2 rounded-lg p-7.5`, 150px (`h-37.5`) media block, `font-mono text-xs tracking-[0.14em] text-gold-deep` numbering, `font-display text-[1.45rem]` title, link-arrow CTA (ArrowRight 15px/`size-3.75`), hover `-translate-y-1 shadow-3 motion-reduce:hover:translate-y-0`.

### Task 3: Organic Split + Certification Marquee

- **OrganicHerbs:** `Section.Root tone="sunken"` (paper-2), 2-col grid, Eyebrow + type-heading-02 + type-lede, check-list rows with `border-t border-hairline py-4` + brand Check icon, `variant="brand"` CTA to herbs collection.
- **CertificationCoverage:** Replaced certification cards with CSS-only scrolling marquee. No `'use client'`, no JavaScript animation. `border-y border-hairline overflow-hidden` wrapper, `animate-marquee` (38s linear infinite) on duplicated track, `hover:[animation-play-state:paused]`, `motion-reduce:animate-none`. Items `type-mono-meta text-ink-soft` with brand Lucide icons. SR-only `<ul>` for screen readers.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - ESLint] Hero section wrapper changed from raw `<section>` to `Section.Root`**

- **Found during:** Task 1 implementation
- **Issue:** The `no-raw-section` ESLint rule rejected a raw `<section>` element in the hero component
- **Fix:** Used `Section.Root tone="transparent" spacing="none"` with `style={{ minHeight: 'min(92vh, 860px)' }}` for the full-bleed behavior
- **Files modified:** `src/components/homepage/hero/hero.tsx`
- **Commit:** 60d4c08

**2. [Rule 2 - Tailwind canonical] Fixed non-canonical class names**

- **Found during:** Task 2 lint check
- **Issue:** `bg-gradient-to-t` (should be `bg-linear-to-t`), `h-[150px]` (should be `h-37.5`), `size-[15px]` (should be `size-3.75`)
- **Fix:** Applied canonical Tailwind 4 equivalents as reported by the class checker script
- **Files modified:** overlay-image-card.tsx, private-label.tsx
- **Commit:** 0cba6bf

## Known Stubs

None — all components render real Shopify CDN image data and real copy from `content.ts`. Link destinations are preserved.

## Threat Flags

None — presentational restyle only; no new network endpoints, auth paths, file access, or schema changes. STRIDE threats T-11-13 (DoS/motion regression) and T-11-14 (XSS) mitigated: `motion-reduce:animate-none` asserted on marquee, `motion-reduce:group-hover:scale-100` trio preserved on overlay-image-card, no `dangerouslySetInnerHTML` introduced.

## Self-Check: PASSED

All 8 modified files exist on disk. All 3 task commits (60d4c08, 0cba6bf, b36fa88) found in git history.
