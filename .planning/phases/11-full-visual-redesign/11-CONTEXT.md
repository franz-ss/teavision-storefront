# Phase 11: Full Visual Redesign - Context

**Gathered:** 2026-06-10
**Status:** Ready for planning
**Source:** PRD Express Path (user request, 2026-06-10) + extracted design sources

<domain>
## Phase Boundary

Replace the storefront's entire visual design system with the one defined in
`design/teavision-redesign.html`, and restyle every page/component to match the
redesign mockup as closely as possible. Behavior (cart, search, bulk savings,
quick-add, server actions, accessibility, noindex) is preserved — this phase is
visual/structural restyling plus design-token migration, not feature work.

The bundled mockup has been unpacked to `design/extracted/`:

- `design-system.css` — the complete new design system (tokens + component CSS, ~50 KB)
- `data-layer.js`, `ui-primitives.js`, `app-shell.js`, `brand-motifs.js`,
  `header.js`, `product-card-footer.js`, `homepage.js`, `collection-page.js`,
  `product-page.js`, `supporting-pages.js` — per-surface React mockup sources
- `extracted-design.html` — full single-file mockup markup

</domain>

<decisions>
## Implementation Decisions

### Design system source of truth (LOCKED)
- The new design system is exactly what `design/extracted/design-system.css` defines:
  - Surfaces: `--paper` oklch(0.974 0.008 92), `--paper-2`, `--paper-3`, `--card`
  - Ink: `--ink` oklch(0.225 0.016 167), `--ink-soft`, `--ink-faint`, hairline borders at 12%/7% ink alpha
  - Brand greens: `--green` oklch(0.412 0.078 166), `--green-deep`, `--green-mid`, `--green-tint`, `--sage`
  - Gold accents: `--gold` oklch(0.74 0.094 78), `--gold-deep`, `--gold-tint`
  - Fonts: `Spectral` (serif display), `Hanken Grotesk` (sans body), `Space Mono` (mono eyebrows/labels), `Caveat` (script accents)
  - Rhythm: max-width 1280px, gutter clamp(20px, 5vw, 72px), radius 4px / 10px (lg)
- Match the mockup's component styles (eyebrow treatment, buttons, cards, bands,
  brush/motif elements) as closely as the real data model allows.

### Old design system removal (LOCKED)
- Remove the old system **completely**: all `--tv-*` semantic tokens, the
  `steep-*` and `stone-*` palette scales, legacy footer color tokens, and any
  unused CSS/theme files. No aliasing the old names to new values — consumers
  migrate to the new token names.

### Migration mapping (LOCKED)
- Before restyling, produce a concrete file-by-file migration map: every file in
  `src/` that references old tokens/utilities and what each needs.

### Scope: all surfaces (LOCKED)
- Header/nav/mega-menu, footer, homepage, collection pages + product cards,
  product detail pages, cart, search, blog/Tea Journal, wholesale and static
  pages, error/empty/loading states, and Storybook stories.

### Behavior preservation (LOCKED)
- No regression to existing behavioral contracts from Phases 1–10 (bulk savings,
  Searchanise search, footer links/newsletter actions, quick-add, PLP payload
  bounds, noindex, rate limiting, accessibility landmarks/skip-nav).

### Claude's Discretion
- Tailwind 4 `@theme` token naming for the new system (semantic names like
  `bg-paper`, `text-ink`, `text-brand` etc.) and how mockup CSS maps to utilities.
- Use the mockup's **default palette** (green); ignore the `[data-palette="earth"]`
  and `[data-palette="ink"]` alternate palettes and the live "Tweaks" panel —
  they are mockup-only exploration tools.
- Font loading via `next/font/google`; subset choices; whether Caveat is included
  (use it where the mockup uses script accents, skip if unused on ported surfaces).
- How to phase plans/waves (tokens-first vs per-surface) and Storybook story updates.
- Where mockup content diverges from real Shopify data, keep real data and apply
  the mockup's visual treatment.
- The footer's strict 1:1 parity with the live legacy site (Phase 4) is superseded
  by the redesign footer; keep link destinations and newsletter behavior, restyle
  visuals per the mockup footer.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### New design system (source of truth)
- `design/extracted/design-system.css` — full token set + component CSS
- `design/extracted/header.js` — header, mega-menu, search, cart drawer, mobile menu mockup
- `design/extracted/homepage.js` — homepage section composition
- `design/extracted/collection-page.js` — collection/PLP mockup
- `design/extracted/product-page.js` — PDP mockup
- `design/extracted/product-card-footer.js` — shared ProductCard + Footer mockup
- `design/extracted/supporting-pages.js` — wholesale/services/simple page mockups
- `design/extracted/brand-motifs.js` — brush/stamp/illustration motif components
- `design/extracted/ui-primitives.js` — button/eyebrow/band primitives

### Old design system (to be removed)
- `src/app/globals.css` — current `@theme` with `--tv-*`, `steep-*`, `stone-*` tokens
- `docs/conventions.md` — styling rules (token-class-only, `cn()`, Section primitives)

### Project rules
- `CLAUDE.md` / `AGENTS.md` — banned patterns (no raw hex in classNames, no CSS modules, Section.Root usage)

</canonical_refs>

<specifics>
## Specific Ideas

- The mockup is a React SPA; its components are reference-only — port styling
  into the existing Next.js component structure rather than importing mockup code.
- The mockup's `.eyebrow` treatment (Space Mono, 11px, 0.22em tracking, leading
  rule line) is a signature element used across surfaces.
- `--accent`/`--accent-deep` indirection in the mockup exists for its palette
  toggle; collapse to the green values in the real implementation.

</specifics>

<deferred>
## Deferred Ideas

- Alternate palettes (`earth`, `ink`) and the live Tweaks panel — mockup-only.
- Any new pages present in the mockup but absent from the storefront's routes
  (build only surfaces that already exist).

</deferred>

---

*Phase: 11-full-visual-redesign*
*Context gathered: 2026-06-10 via PRD Express Path*
