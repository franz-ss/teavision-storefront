# Phase 11: Full Visual Redesign - Research

**Researched:** 2026-06-10
**Domain:** Tailwind 4 design-token migration + full-surface restyling (Next.js 16 / React 19 / Storybook 10)
**Confidence:** HIGH (all findings verified directly against this repo and the extracted mockup sources)

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Design system source of truth (LOCKED)**

- The new design system is exactly what `design/extracted/design-system.css` defines:
  - Surfaces: `--paper` oklch(0.974 0.008 92), `--paper-2`, `--paper-3`, `--card`
  - Ink: `--ink` oklch(0.225 0.016 167), `--ink-soft`, `--ink-faint`, hairline borders at 12%/7% ink alpha
  - Brand greens: `--green` oklch(0.412 0.078 166), `--green-deep`, `--green-mid`, `--green-tint`, `--sage`
  - Gold accents: `--gold` oklch(0.74 0.094 78), `--gold-deep`, `--gold-tint`
  - Fonts: `Spectral` (serif display), `Hanken Grotesk` (sans body), `Space Mono` (mono eyebrows/labels), `Caveat` (script accents)
  - Rhythm: max-width 1280px, gutter clamp(20px, 5vw, 72px), radius 4px / 10px (lg)
- Match the mockup's component styles (eyebrow treatment, buttons, cards, bands, brush/motif elements) as closely as the real data model allows.

**Old design system removal (LOCKED)**

- Remove the old system **completely**: all `--tv-*` semantic tokens, the `steep-*` and `stone-*` palette scales, legacy footer color tokens, and any unused CSS/theme files. No aliasing the old names to new values — consumers migrate to the new token names.

**Migration mapping (LOCKED)**

- Before restyling, produce a concrete file-by-file migration map: every file in `src/` that references old tokens/utilities and what each needs.

**Scope: all surfaces (LOCKED)**

- Header/nav/mega-menu, footer, homepage, collection pages + product cards, product detail pages, cart, search, blog/Tea Journal, wholesale and static pages, error/empty/loading states, and Storybook stories.

**Behavior preservation (LOCKED)**

- No regression to existing behavioral contracts from Phases 1–10 (bulk savings, Searchanise search, footer links/newsletter actions, quick-add, PLP payload bounds, noindex, rate limiting, accessibility landmarks/skip-nav).

### Claude's Discretion

- Tailwind 4 `@theme` token naming for the new system (semantic names like `bg-paper`, `text-ink`, `text-brand` etc.) and how mockup CSS maps to utilities.
- Use the mockup's **default palette** (green); ignore the `[data-palette="earth"]` and `[data-palette="ink"]` alternate palettes and the live "Tweaks" panel — they are mockup-only exploration tools.
- Font loading via `next/font/google`; subset choices; whether Caveat is included (use it where the mockup uses script accents, skip if unused on ported surfaces).
- How to phase plans/waves (tokens-first vs per-surface) and Storybook story updates.
- Where mockup content diverges from real Shopify data, keep real data and apply the mockup's visual treatment.
- The footer's strict 1:1 parity with the live legacy site (Phase 4) is superseded by the redesign footer; keep link destinations and newsletter behavior, restyle visuals per the mockup footer.

### Deferred Ideas (OUT OF SCOPE)

- Alternate palettes (`earth`, `ink`) and the live Tweaks panel — mockup-only.
- Any new pages present in the mockup but absent from the storefront's routes (build only surfaces that already exist).
  </user_constraints>

<phase_requirements>

## Phase Requirements

| ID    | Description                                                                                                                                  | Research Support                                                                                                         |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| RD-01 | New `@theme` tokens in `src/app/globals.css` (paper/ink/green/gold oklch, Spectral/Hanken Grotesk/Space Mono/Caveat, redesign radius/rhythm) | §New Design System Inventory, §Old→New Token Mapping, UI-SPEC `@theme` block                                             |
| RD-02 | Old system removed completely — no `--tv-*`, no `steep`/`stone`, no orphaned CSS/token classes in `src/`                                     | §Old Design System Usage Map (file-by-file), §Risk Analysis (removal sequencing), §Validation Architecture (grep gates)  |
| RD-03 | Layout chrome (header/nav/mega-menu, search, cart affordance, footer, announcement bar) matches redesign                                     | UI-SPEC §Header, §Footer; mockup sources `header.js`, `product-card-footer.js`, `design-system.css` HEADER/FOOTER blocks |
| RD-04 | Homepage matches redesign section composition and styling                                                                                    | UI-SPEC §Homepage; mockup `homepage.js`, `brand-motifs.js`; §Brand Motif Assets                                          |
| RD-05 | Collection pages + product cards match redesign, Phase 8/9 contracts preserved                                                               | UI-SPEC §Collection/PLP, §Product Card; §Open Questions (Phase 9 status)                                                 |
| RD-06 | PDP matches redesign, bulk savings/variant selection/add-to-cart preserved                                                                   | UI-SPEC §PDP; mockup `product-page.js` (tiers grid maps to bulk-savings)                                                 |
| RD-07 | Remaining surfaces restyled (cart, search, blog, wholesale, static, error/empty) — no legacy stragglers                                      | §Usage Map domain groups; UI-SPEC §Cart, §Search, §Supporting pages                                                      |
| RD-08 | Storybook renders, lint/typecheck/build pass, no raw hex/oklch in classNames                                                                 | §Risk Analysis (guard tooling), §Validation Architecture                                                                 |

</phase_requirements>

## Summary

This phase is a **token migration + restyling pass over ~170 files**, not feature work. The good news: the codebase is exceptionally well-prepared for it. Direct `--tv-*`/`steep`/`stone` references exist in only **2 files** (`src/app/globals.css` and `button.stories.tsx`); everything else consumes the old system through **semantic utility classes** (`bg-canvas`, `text-default`, `type-heading-02`, …) generated by the Tailwind 4 `@theme` block and `@utility` definitions in `globals.css`. The migration is therefore: (1) replace the `@theme`/`@utility` definitions, (2) sweep consumers from old class names to new ones, (3) restyle each surface's structure to the mockup.

The hard constraint is the repo's own guard tooling. `scripts/check-tailwind-classes.mjs` validates **every class token in `src/` + `.storybook/`** against the design system compiled from `globals.css` — so the moment an old token is deleted from `globals.css`, every file still using it fails `pnpm lint`. The migration must run **add-new → migrate-consumers → delete-old**, with old-token deletion as the final plan. Four ESLint rules (`no-raw-section`, `no-raw-button`, `no-button-style-class`, `no-section-root-tone-class`) force mockup styles to be ported **into** the `Section`/`Button` primitives rather than expressed at call sites, and `scripts/component-contracts/button-system.test.mjs` asserts exact class strings (`rounded-md` count, `min-h-11`, `var(--tv-bg-inverse)`, `motion-reduce:` trios) that must be updated in lockstep.

**Primary recommendation:** Run 6 sequential plans — (1) foundation: fonts + new `@theme` + ui primitives + motif asset extraction, (2) layout chrome, (3) homepage, (4) collections/PLP/search, (5) PDP + cart, (6) remaining surfaces + old-system deletion + docs + verification — keeping old tokens alive in `globals.css` until plan 6 so lint stays green after every plan.

## Architectural Responsibility Map

| Capability                                   | Primary Tier                                                           | Secondary Tier                         | Rationale                                                                                     |
| -------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| Design tokens (`@theme`)                     | CSS build (Tailwind 4, `globals.css`)                                  | —                                      | Single source for all utility classes; guard script compiles it                               |
| Font loading                                 | Frontend server (`src/app/layout.tsx` via `next/font/google`)          | —                                      | Self-hosted at build; exposes `--font-*` CSS vars to `@theme inline`                          |
| Component styling                            | Server Components (token class names)                                  | Client leaves (interactive state only) | Project rule: `'use client'` only on interactive leaves                                       |
| Section/Button visual variants               | `src/components/ui/section`, `src/components/ui/button` (cva)          | —                                      | ESLint rules ban styling these at call sites                                                  |
| Rich-text class mapping                      | `src/lib/shopify/html-content.ts`, `src/components/blog/portable-text` | —                                      | Server-side HTML→token-class mapping; easy to miss in component sweeps                        |
| Brand motif images (brush discs, stamp ring) | Static assets (`public/images/`)                                       | `next/image` in components             | PNGs are embedded gzip+base64 inside `design/teavision-redesign.html`; must be extracted once |
| Behavior (cart, search, quick-add)           | Server Actions + Shopify operations (unchanged)                        | —                                      | Out of scope; restyle only                                                                    |

## Standard Stack

### Core (all already installed — no new dependencies required)

| Library                        | Version       | Purpose                                         | Why Standard                                                                                                    |
| ------------------------------ | ------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| tailwindcss                    | 4.2.4         | `@theme` tokens + utilities                     | Already the styling system; v4 `@theme` is the token mechanism `[VERIFIED: package.json + globals.css]`         |
| next/font/google               | next 16.2.4   | Spectral, Hanken Grotesk, Space Mono, Caveat    | Replaces Fraunces/Inter/JetBrains Mono in `src/app/layout.tsx` `[VERIFIED: layout.tsx uses this pattern today]` |
| class-variance-authority       | 0.7.1         | Button/Section variant maps                     | Existing pattern; guard scripts parse `cva()` calls `[VERIFIED: button.tsx, section.tsx]`                       |
| lucide-react                   | 1.14.0        | Icons (replace mockup's hand-rolled `Icon` set) | Already used (`LoaderCircle` in Button) `[VERIFIED: package.json]`                                              |
| tailwind-merge + clsx (`cn()`) | 3.5.0 / 2.1.1 | className composition                           | Mandatory per CLAUDE.md `[VERIFIED]`                                                                            |

**Installation:** none — `pnpm install` state is sufficient.

**Font specifics** (next/font/google):

- `Spectral` — **not a variable font**; must pass explicit `weight: ['300','400','500','600']` and `style: ['normal','italic']` (italic is load-bearing: `.italic-accent` display headlines, `.hl` gold italic in bands) `[ASSUMED: training knowledge; build fails fast with a clear error if weights are wrong]`
- `Hanken_Grotesk` — variable font, no weight array needed `[ASSUMED: same]`
- `Space_Mono` — not variable; `weight: ['400','700']` (700 used by eyebrows) `[ASSUMED: same]`
- `Caveat` — variable; used **only** by the `Stamp` motif (`.stamp__txt`). The stamp appears in the homepage brand bands (RD-04 scope) → include Caveat `[VERIFIED: brand-motifs.js + design-system.css line 816]`

## New Design System Inventory

Source of truth: `design/extracted/design-system.css` (832 lines, 4 blocks: tokens, components, home/sections, brand motifs).

### Token table (default green palette only — earth/ink palettes and Tweaks panel are excluded per CONTEXT)

| Group    | Token           | Value                                 | Role                                                                 |
| -------- | --------------- | ------------------------------------- | -------------------------------------------------------------------- |
| Surface  | `--paper`       | `oklch(0.974 0.008 92)`               | page background                                                      |
| Surface  | `--paper-2`     | `oklch(0.952 0.012 90)`               | alternating band background                                          |
| Surface  | `--paper-3`     | `oklch(0.928 0.016 88)`               | deepest paper (rarely used)                                          |
| Surface  | `--card`        | `oklch(0.992 0.004 92)`               | card/form/input background                                           |
| Ink      | `--ink`         | `oklch(0.225 0.016 167)`              | headings/body, dark band bg, footer bg                               |
| Ink      | `--ink-soft`    | `oklch(0.41 0.020 167)`               | secondary copy                                                       |
| Ink      | `--ink-faint`   | `oklch(0.56 0.016 167)`               | meta/labels/placeholders                                             |
| Hairline | `--hairline`    | ink @ 12% alpha                       | default border/divider                                               |
| Hairline | `--hairline-2`  | ink @ 7% alpha                        | subtle card border                                                   |
| Green    | `--green`       | `oklch(0.412 0.078 166)`              | brand accent (buttons, links, active states)                         |
| Green    | `--green-deep`  | `oklch(0.305 0.060 167)`              | hover, dark green bands (statband, collection hero, newsletter card) |
| Green    | `--green-mid`   | `oklch(0.545 0.085 165)`              | mid accents                                                          |
| Green    | `--green-tint`  | `oklch(0.935 0.026 166)`              | hover-tint pills, focus glow, organic pill bg                        |
| Green    | `--sage`        | `oklch(0.865 0.032 165)`              | soft green                                                           |
| Gold     | `--gold`        | `oklch(0.74 0.094 78)`                | stars, cart count badge, eyebrows-on-dark, footer h5                 |
| Gold     | `--gold-deep`   | `oklch(0.60 0.088 70)`                | gold text on light, destructive-ish hovers (cart remove)             |
| Gold     | `--gold-tint`   | `oklch(0.94 0.034 84)`                | `::selection`, gold pill bg                                          |
| Motif    | `--brush-green` | `oklch(0.47 0.088 160)`               | brush illustration tone (asset-baked)                                |
| Font     | `--serif`       | "Spectral", Georgia, serif            | all h1–h4, display, card names, prices                               |
| Font     | `--sans`        | "Hanken Grotesk", system-ui           | body, buttons, nav                                                   |
| Font     | `--mono`        | "Space Mono", ui-monospace            | eyebrows, meta, labels, filters, footer bottom                       |
| Font     | script          | "Caveat", cursive                     | stamp curved text only                                               |
| Rhythm   | `--maxw`        | 1280px                                | `.wrap` (FAQ uses 880px sub-width)                                   |
| Rhythm   | `.wrap-wide`    | 1480px                                | header, footer, most sections                                        |
| Rhythm   | `--gutter`      | clamp(20px, 5vw, 72px)                | horizontal padding                                                   |
| Rhythm   | `.section-pad`  | clamp(64px, 9vw, 130px) block padding | vertical rhythm                                                      |
| Radius   | `--radius`      | 4px                                   | inputs, size tiles, tier cards                                       |
| Radius   | `--radius-lg`   | 10px                                  | cards, media, mega feature (6px menu links, 8px thumbs also appear)  |
| Radius   | pill            | 100px                                 | buttons, pills, qty stepper, sort control, nav links                 |

Note: the mockup's `--accent`/`--accent-deep` indirection exists only for its palette toggle — **collapse to `--green`/`--green-deep`** per CONTEXT.

### Typographic scale `[VERIFIED: design-system.css lines 86–117]`

| Role           | Font           | Size                          | Weight  | LH   | Tracking               | Notes                                                                                                                                                                                                                 |
| -------------- | -------------- | ----------------------------- | ------- | ---- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.display`     | Spectral       | clamp(2.6rem, 6.4vw, 5.4rem)  | 500     | 0.98 | −0.025em               | hero h1                                                                                                                                                                                                               |
| `.h-xl`        | Spectral       | clamp(2rem, 4vw, 3.4rem)      | 500     | 1.04 | −0.01em                | section h2                                                                                                                                                                                                            |
| `.h-lg`        | Spectral       | clamp(1.7rem, 3vw, 2.6rem)    | 500     | 1.04 | −0.01em                |                                                                                                                                                                                                                       |
| `.h-md`        | Spectral       | clamp(1.4rem, 2.2vw, 1.9rem)  | 500     | 1.04 | −0.01em                |                                                                                                                                                                                                                       |
| `.lede`        | Hanken         | clamp(1.05rem, 1.5vw, 1.3rem) | 400     | 1.55 | —                      | color `--ink-soft`                                                                                                                                                                                                    |
| body           | Hanken         | 16px                          | 400     | 1.6  | —                      |                                                                                                                                                                                                                       |
| **`.eyebrow`** | **Space Mono** | **11px**                      | **700** | —    | **0.22em, uppercase**  | **signature element**: inline-flex, gap 10px, color `--accent`(green), with a leading 22×1px `currentColor` rule line at 60% opacity via `::before`; variants `.muted` (ink-faint) and `.no-rule`; gold on dark bands |
| mono meta      | Space Mono     | 10–12px                       | 400–700 | —    | 0.05–0.16em, uppercase | breadcrumbs, card origin lines, filter headings, footer bottom, cart meta                                                                                                                                             |

### Buttons `[VERIFIED: design-system.css lines 128–162]`

All buttons: pill (`border-radius: 100px`), Hanken 600, 0.94rem, ls 0.01em, gap 10px, hover lift `translateY(-2px)` + soft shadow, trailing arrow icon slides `translateX(4px)` on hover.

| Mockup class                                                 | Style                                                               | Maps to existing Button variant    |
| ------------------------------------------------------------ | ------------------------------------------------------------------- | ---------------------------------- |
| `.btn-primary`                                               | bg green / text paper; hover green-deep                             | `brand`                            |
| `.btn-gold` (misnomer — it's ink)                            | bg ink / text paper; hover #000                                     | `primary`                          |
| `.btn-ghost`                                                 | transparent, 1.5px hairline border, text ink; hover fills ink       | `secondary`                        |
| `.btn-light`                                                 | bg paper / text ink; hover lift+shadow                              | `inverse`                          |
| ghost-on-dark (inline override: paper text, white/35 border) |                                                                     | `inverseSecondary`                 |
| `.btn-sm`                                                    | 11px/18px pad, 0.86rem                                              | `sm`                               |
| (default)                                                    | 15px/26px pad                                                       | `md`                               |
| `.btn-lg`                                                    | 18px/34px pad, 1rem                                                 | `lg`/`cta`                         |
| `.link-arrow`                                                | inline link, 600/0.92rem, 1.5px bottom hairline border, hover green | new pattern (text-link with arrow) |

### Cards, pills, surfaces

- `.card-surface`: bg card, 1px hairline-2 border, radius-lg — used for forms (help/wholesale/account/contact)
- `.pill`: mono 11px uppercase ls 0.1em, 6/12px pad, pill radius, hairline border, bg card; `.pill.organic` (green text/tint bg), `.pill.gold` (gold-deep/gold-tint)
- `.pcard` (product card): vertical; media aspect 1/1.12, radius-lg, bg paper-2, image scales 1.06 on hover; badges top-left (organic/gold pills); hover-reveal fav button (top-right) and full-width add button (bottom, ink `btn-gold btn-sm`); body: mono origin line (10.5px, globe icon, "origin · type"), serif name 1.2rem, price row (bold price + mono unit, mono green grade right)
- `.rtile` (range tile): image tile, aspect 1/1.08, radius-lg, bottom gradient scrim, gold mono tag, serif white title, hover-reveal "Shop now"
- `.svc__card`: card-surface, 30px pad, 150px media, mono gold-deep numbering, hover lift + shadow
- `.jcard` (journal): 220px media radius-lg with hover zoom, mono meta row (green category), serif 1.25rem title
- `.tier` (PDP bulk pricing): bordered tile radius 4px, centered; `.best` green border + floating "Best value" mono chip
- `.qty` stepper: pill, hairline border, mono digits

### Bands / section patterns

- Alternating `--paper` / `--paper-2` sections; `.section-pad` rhythm
- `.statband`: bg green-deep, 4-col grid, white serif 2.4rem stat + gold icon, white/12 column rules
- `.certs` marquee: hairline top/bottom borders, 38s CSS `marquee` keyframe loop (pause on hover, reduced-motion aware)
- `.bband` (brand motif band): bg ink (or `.green` → green-deep), 3-col grid `260px / 1fr / 210px`, centered text, gold eyebrow, serif white h2 with gold-italic `.hl` word, brush-circle illustration one side + hand-drawn stamp the other; gentle float keyframes (reduced-motion aware)
- `.news` (newsletter card): bg green-deep, radius-lg, clamp padding, pill input white/10 bg + white/25 border, gold focus border
- `.coll__hero`: bg green-deep, white display h1, gold eyebrow, mono meta stats, 35%-opacity background image
- `.hdr`: 38px ink utility bar (mono 11.5px ticker + phone/wholesale links) over 76px main bar `oklch(paper / 0.82)` + `backdrop-blur(14px)` + hairline bottom border; sticky; nav links are pills hover green-tint/green; 42px round icon buttons; gold cart-count badge; mega menu full-width panel (grid 1.1fr/2.4fr/1.3fr: intro + 3 link columns + feature card) with scrim; search overlay (serif input under 2px ink rule + popular pills); fullscreen mobile menu (serif 1.5rem accordion rows)
- `.ft` footer: bg ink, text `oklch(0.9 0.015 100/0.78)`, grid 1.6fr/1fr/1fr/1.4fr, gold mono h5 column headings, white/5 quality pills, pill newsletter input, mono 11px bottom row with bordered payment marks
- `.cart` drawer: 440px right slide-in panel (the real site uses a `/cart` page — apply these line/summary styles to the page; do NOT build a drawer, that is feature work)
- forms (`.field`): mono 10.5px uppercase labels, card bg inputs, radius 4px, focus = green border + 3px green-tint glow

### Mockup-only elements (EXCLUDE)

- Tweaks panel, `TWEAK_DEFAULTS`, `[data-palette]` alternates, hero A/B/C switcher (`heroSwitch`) — exploration tools `[VERIFIED: app-shell.js]`
- `useReveal` IntersectionObserver scroll-reveal — would force `'use client'` onto server components; omit (see Pitfalls)
- localStorage cart/router — the real app keeps cookie-based cart + Next routing
- `.ph` placeholder-image system — real Shopify imagery replaces it (CONTEXT: keep real data)
- Hero variants B and C — default is A (editorial full-bleed) `[VERIFIED: TWEAK_DEFAULTS.hero = "A"]`

### Brand motif assets (extraction required)

`brand-motifs.js` references 4 real PNGs (`illo-handshake`, `illo-cup`, `illo-teapot`, `stamp-ring`) that exist **only as gzip+base64 blobs inside `design/teavision-redesign.html`** (`script[type="__bundler/manifest"]` keyed by UUID; `script[type="__bundler/ext_resources"]` maps ids→UUIDs: stampRing→`0af1329f…`, illoCup→`9dca5ed0…`, illoTeapot→`4d92e050…`, illoHandshake→`852c2c73…`) `[VERIFIED: parsed the HTML]`. A one-off Node script (parse JSON, `Buffer.from(data,'base64')`, `zlib.gunzipSync` when `compressed`, write to `public/images/`) extracts them. `public/images/` currently has only `australian-flag.svg` and `homepage-hero.jpg` `[VERIFIED]`. The `Stamp` component overlays Caveat curved `<textPath>` SVG text on the ring PNG — port as a small presentational component.

## Old Design System Usage Map (file-by-file)

Method: ripgrep over `src/` for every utility class derivable from the old `@theme`/`@utility` block (`bg|text|border|ring|ring-offset|shadow|…`-`canvas|surface*|brand*|accent*|inverse|footer*|muted|on-brand|link*|default|strong|subtle|ring|action-*|success-*|danger-*`, all `type-*`, `shadow-0..4|focus`, `max-w-prose|base|wide`, `font-display`) plus direct `tv-|steep-|stone-` references. `[VERIFIED: grep, 2026-06-10]`

**Totals: ~1,490 old-token class occurrences across 169 files** (plus `globals.css` itself). Direct CSS-var references (`var(--tv-*)`) exist in only 2 places outside `globals.css`: `src/components/ui/button/button.stories.tsx` (Storybook background `var(--tv-bg-inverse)`) and `.storybook/preview.ts` (`var(--tv-bg-canvas)`, `var(--tv-bg-surface)`).

Work classes: **S** = pure class-name swap, **R** = restyle (class swaps + visual/markup adjustments to match mockup), **W** = rework (significant structural restyle against a specific mockup source).

### Foundation (Plan 1 candidates)

| File                                                               |  Count | Work | Notes                                                                            |
| ------------------------------------------------------------------ | -----: | ---- | -------------------------------------------------------------------------------- |
| `src/app/globals.css`                                              | (defs) | W    | Replace `@theme` + `@utility` definitions; keep old tokens until final sweep     |
| `src/app/layout.tsx`                                               |  fonts | W    | Swap Fraunces/Inter/JetBrains Mono → Spectral/Hanken/Space Mono/Caveat           |
| `src/components/ui/button/button.tsx`                              |     30 | W    | New variant/size classes, `rounded-full`; lockstep with `button-system.test.mjs` |
| `src/components/ui/button/button.stories.tsx`                      |      1 | R    | `var(--tv-bg-inverse)` → new token; lockstep with contract test regex            |
| `src/components/ui/section/section.tsx`                            |     15 | W    | Re-map tone variants; new spacing/gutter/widths                                  |
| `src/components/ui/badge/badge.tsx`                                |     13 | R    | Becomes mockup `.pill` (mono, uppercase, pill radius; organic/gold variants)     |
| `src/components/ui/card/card.tsx` (+stories 19)                    |      8 | R    | `.card-surface`                                                                  |
| `src/components/ui/accordion/accordion.tsx` (+story 1)             |      9 | R    | `.faq__item`/`.spec-acc` treatment                                               |
| `src/components/ui/dialog/dialog.tsx` (+story 2)                   |      8 | R    | paper bg, radius-lg, scrim                                                       |
| `src/components/ui/text-input/text-input.tsx`                      |      6 | R    | `.field` style: card bg, hairline, green focus glow                              |
| `src/components/ui/textarea/textarea.tsx`                          |      6 | R    | same                                                                             |
| `src/components/ui/select/select.tsx`                              |      5 | R    | same                                                                             |
| `src/components/ui/checkbox/checkbox.tsx` (+story 2)               |      2 | R    | `.fbox` 18px, radius 5px, green checked                                          |
| `src/components/ui/form-label/form-label.tsx`                      |      2 | R    | mono 10.5px uppercase label                                                      |
| `src/components/ui/quantity-stepper/quantity-stepper.tsx`          |      4 | R    | pill `.qty`                                                                      |
| `src/components/ui/icon-button/icon-button.tsx`                    |      6 | R    | 42px circle, hover green-tint; keep `h-11 w-11` sm (contract test)               |
| `src/components/ui/toggle-button/toggle-button.tsx` (+story 7)     |     21 | R    | filter `.fopt`/chip styles                                                       |
| `src/components/ui/disclosure-button/disclosure-button.tsx`        |      5 | S    | keep aria contract                                                               |
| `src/components/ui/star-rating/star-rating.tsx`                    |      3 | S    | stars → gold                                                                     |
| `src/components/ui/price/price.tsx`                                |      5 | R    | serif price + mono unit pattern                                                  |
| `src/components/ui/rich-text/rich-text.tsx` (+stories 142)         |      7 | S    | token swap; stories file is the single largest consumer                          |
| `src/components/ui/article-card/article-card.tsx`                  |     13 | R    | `.jcard`; preserve `motion-reduce:` zoom trio (contract test)                    |
| `src/components/ui/newsletter-signup/newsletter-signup.tsx`        |     33 | W    | `.news` card / `.ft__news` pill input                                            |
| `src/lib/shopify/html-content.ts`                                  |     93 | S    | server-side HTML→class mapper; 2nd largest consumer                              |
| `src/components/blog/portable-text/portable-text.tsx` (+stories 8) |     42 | S    | Sanity rich text class map                                                       |
| `.storybook/preview.ts`                                            | 2 vars | S    | backgrounds → new tokens                                                         |

### Layout chrome (Plan 2)

| File                                                                                                          | Count | Work                                                                                                              |
| ------------------------------------------------------------------------------------------------------------- | ----: | ----------------------------------------------------------------------------------------------------------------- |
| `src/components/layout/header/header.tsx`                                                                     |    18 | W (mockup `header.js` + `.hdr` CSS)                                                                               |
| `header/mega-nav.tsx`, `mega-nav-styles.ts`, `mega-nav-data.ts`                                               |     9 | W (`.mega` grid)                                                                                                  |
| `header/shop-mega-panel.tsx`                                                                                  |    17 | W                                                                                                                 |
| `header/services-mega-panel.tsx`, `services-links.tsx`, `catalogue-links.tsx`                                 |     6 | R                                                                                                                 |
| `header/mobile-mega-nav.tsx`, `mobile-shop-panel.tsx`, `mobile-services-panel.tsx`                            |    15 | W (`.mmenu`)                                                                                                      |
| `header/search.tsx`, `search-form.tsx`, `search-autocomplete.tsx`, `search-suggestions.tsx`                   |    33 | W (`.searchbar` overlay styling)                                                                                  |
| `header/cart-badge.tsx`, `cart-count.tsx`                                                                     |     3 | R (gold `.hdr__count`)                                                                                            |
| header stories (4 files)                                                                                      |     4 | S                                                                                                                 |
| `src/components/layout/footer/view/view.tsx`                                                                  |     7 | W (mockup `Footer` in `product-card-footer.js` + `.ft` CSS; supersedes Phase 4 visual parity, keep links/actions) |
| `footer/link-list`, `text-link`, `quality-column`, `newsletter-column`, `newsletter-form`, `icons` (+stories) |    27 | R                                                                                                                 |
| `src/app/(storefront)/layout.tsx`                                                                             |     4 | R (skip-link tokens)                                                                                              |
| `src/app/error.tsx`, `global-error.tsx`, `not-found.tsx`                                                      |    18 | R                                                                                                                 |

### Homepage (Plan 3) — mockup `homepage.js`, `brand-motifs.js`

| File                                                                             | Count | Work                                                                                                         |
| -------------------------------------------------------------------------------- | ----: | ------------------------------------------------------------------------------------------------------------ |
| `src/app/(storefront)/page.tsx`                                                  |     1 | R (section composition per UI-SPEC mapping)                                                                  |
| `homepage/hero/hero.tsx`                                                         |     8 | W (HeroA editorial full-bleed + stat strip)                                                                  |
| `homepage/proof-points/proof-points.tsx`                                         |     6 | W (`.statband` / `.heroA__strip`)                                                                            |
| `homepage/product-range/*`                                                       |     — | W (`.range__grid` + `.rtile`)                                                                                |
| `homepage/private-label/*`                                                       |     — | W (`.svc` cards)                                                                                             |
| `homepage/organic-herbs/organic-herbs.tsx`                                       |     8 | W (`.split`)                                                                                                 |
| `homepage/certification-coverage/certification-coverage.tsx`                     |    14 | W (`.certs` marquee)                                                                                         |
| `homepage/testimonials/testimonials.tsx` + `testimonials-slider.tsx`             |    16 | W (`.tst`)                                                                                                   |
| `homepage/tea-journal/tea-journal.tsx`                                           |    13 | W (`.jrnl`/`.jcard`; preserve motion-reduce trio)                                                            |
| `homepage/newsletter/newsletter-form.tsx`                                        |    11 | W (`.news` or `NewsletterBand` motif band)                                                                   |
| `homepage/contact/contact.tsx` + `contact-form/contact-form.tsx`                 |    11 | W (`.help` dark section + card form)                                                                         |
| `homepage/faq/faq.tsx`                                                           |     1 | R (`.faq__*`)                                                                                                |
| `homepage/overlay-image-card/overlay-image-card.tsx`                             |     3 | R (`.rtile`; motion-reduce trio)                                                                             |
| `homepage/catalogues/*`, `supply-chain/*`, `content.ts`                          |     — | R/W (CTA bands → `.bband` motif bands; `content.ts` `variant: 'inverseSecondary'` asserted by contract test) |
| new: brush-circle + stamp motif components (`src/components/homepage/` or `ui/`) |     — | NEW (`brand-motifs.js`)                                                                                      |

### Collections / PLP / Search (Plan 4) — mockup `collection-page.js`, `product-card-footer.js`

| File                                                          | Count | Work                                                                    |
| ------------------------------------------------------------- | ----: | ----------------------------------------------------------------------- |
| `collections/[handle]/_components/hero.tsx`                   |    25 | W (`.coll__hero` green-deep)                                            |
| `collections/[handle]/_components/sidebar.tsx`                |    13 | W (`.filters`)                                                          |
| `collections/[handle]/_components/product-list.tsx` (+test 2) |     5 | R (`.coll__grid`; test asserts `border-subtle` string)                  |
| `collections/[handle]/page.tsx`                               |     2 | S                                                                       |
| `collections/page.tsx` (collections index)                    |    48 | W                                                                       |
| `collections/_components/collection-card-image.tsx`           |     1 | S (motion-reduce trio)                                                  |
| `collection/product-card/product-card.tsx` (+test 3)          |     8 | W (`.pcard`; preserve quick-add contract; test asserts h3 class string) |
| `collection/product-card/product-purchase-form.tsx`           |    14 | R                                                                       |
| `collection/filter-panel/filter-panel.tsx`                    |    22 | W (`.fopt`/`.fbox`)                                                     |
| `collection/toolbar/toolbar.tsx`                              |     6 | R (`.coll__bar`)                                                        |
| `collection/sort-select/sort-select.tsx`                      |     2 | R (`.coll__sort` pill)                                                  |
| `collection/story-disclosure/story-disclosure.tsx`            |     7 | R                                                                       |
| `search/search-results-view/*` (5 files)                      |    34 | R (reuse collection styling)                                            |
| `search/search-filter-panel/search-filter-panel.tsx`          |    23 | R                                                                       |
| `search/search-pagination/search-pagination.tsx`              |    10 | R                                                                       |
| `search/search-sort-select/search-sort-select.tsx`            |     2 | R                                                                       |
| `(storefront)/search/page.tsx`                                |     4 | S                                                                       |

### PDP + Cart (Plan 5) — mockup `product-page.js`, header cart-drawer styles

| File                                                                              | Count | Work                                                                               |
| --------------------------------------------------------------------------------- | ----: | ---------------------------------------------------------------------------------- |
| `products/[handle]/page.tsx`                                                      |    24 | W (`.pdp` 2-col, sticky gallery, breadcrumb)                                       |
| `product/product-gallery/product-gallery.tsx`                                     |     3 | R (`.pdp__thumbs`)                                                                 |
| `product/product-form/product-form.tsx`                                           |     7 | R (`.size` tiles, `.pdp__buy`)                                                     |
| `product/bulk-savings/bulk-savings.tsx`                                           |    27 | W (`.tiers` grid + "Best value" chip)                                              |
| `product/product-quick-view/product-quick-view.tsx` (+story 1)                    |    18 | R                                                                                  |
| `product/recommendation-product-card/recommendation-product-card.tsx`             |    12 | R (`.pcard`; motion-reduce trio)                                                   |
| `product/searchanise-recommendations/*` (+story)                                  |     8 | S                                                                                  |
| `products/[handle]/_components/related-products.tsx`, `customers-also-bought.tsx` |     2 | R (`.related` rail)                                                                |
| `cart/_components/cart-view.tsx` (+test 3, +story 1)                              |    68 | W (`.cart__line`, `.qty`, summary per `.cart__foot`; test asserts h3 class string) |
| `cart/_components/cart-loading-skeleton.tsx` (+test)                              |    42 | R (mirror new cart-view classes)                                                   |
| `cart/_components/cart-line-actions.tsx`                                          |     8 | R (`.cart__remove` mono)                                                           |
| `cart/_components/cart-checkout-form.tsx`                                         |     5 | R                                                                                  |
| `cart/_components/cart-recommendations.tsx`                                       |     1 | S                                                                                  |
| `cart/page.tsx`, `cart/error.tsx`                                                 |     7 | R                                                                                  |

### Blog + supporting pages + sweep (Plan 6)

| File                                                                                                                            | Count | Work                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------- | ----: | ------------------------------------------------------------------------------------------------------------- |
| `blogs/[blog]/[article]/page.tsx`                                                                                               |    49 | R (editorial: serif headings, mono meta)                                                                      |
| `blogs/[blog]/_components/listing-page.tsx`                                                                                     |     2 | R                                                                                                             |
| `blog/hero/*` (3), `tag-filter-nav` (16), `article-results` (10), `pagination` (11), `featured-articles` (4), `empty-state` (4) |    52 | R (`.jcard` + pills)                                                                                          |
| `pages/wholesale/_components/*` (4 files)                                                                                       |    60 | W (mockup `WholesalePage` in `supporting-pages.js`)                                                           |
| `pages/contact/_components/*` (3)                                                                                               |    38 | W (`.help` + card form)                                                                                       |
| `pages/our-story/_components/*` (9)                                                                                             |    67 | R (`SimplePage` story split)                                                                                  |
| `pages/certifications/_components/*` (5)                                                                                        |    29 | R                                                                                                             |
| `pages/custom-tea-blends/_components/*` (12)                                                                                    |   117 | R                                                                                                             |
| `pages/[...slug]/_components/*` (3)                                                                                             |    22 | R (`.coll__hero` page hero)                                                                                   |
| `contact/contact-form/contact-form.tsx` (+story)                                                                                |    20 | R (`.field` styles)                                                                                           |
| `docs/conventions.md`, `AGENTS.md`                                                                                              |     — | S (token examples reference `bg-canvas`/`text-default`; update)                                               |
| `globals.css`                                                                                                                   |     — | **DELETE** all `--tv-*`, `steep`, `stone`, `ink-scale`, `amber`, legacy footer tokens + stale `@utility` defs |

Remaining story files not listed individually (~40 with 1–4 occurrences each) migrate alongside their component in whichever plan owns the component.

## Old→New Token Mapping Proposal

Naming judgment (Claude's discretion per CONTEXT): tokens named after the **old palette or old semantic system** (`--tv-*`, `steep`, `stone`, `canvas`, `surface`, `on-brand`, `inverse`, `footer-*`, `action-*`) are removed and consumers renamed. **Neutral role names** whose values change (`font-display`, `type-heading-NN`, `shadow-N`, `rounded-*`, `max-w-base|wide|prose`, `bg-brand`, `text-brand`, `ring-ring`) are retained as part of the _new_ system — CONTEXT explicitly sanctions `text-brand`-style names. This is not aliasing (no old name points at an old meaning); it cuts the rename surface roughly in half.

Full `@theme` block, font-loading spec, and complete class rename table are in **`11-UI-SPEC.md`** (the planner/executor contract). Summary of the core renames:

| Old class                                                         | New class                                                                                                                                      |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `bg-canvas`                                                       | `bg-paper`                                                                                                                                     |
| `bg-surface` / `bg-surface-raised`                                | `bg-card` (cards/forms) or `bg-paper` (page bands — judge per use)                                                                             |
| `bg-surface-sunken`                                               | `bg-paper-2`                                                                                                                                   |
| `bg-brand`                                                        | `bg-brand` (value → green) — dark bands use `bg-brand-deep`                                                                                    |
| `bg-brand-strong`                                                 | `bg-brand-deep`                                                                                                                                |
| `bg-brand-subtle`                                                 | `bg-brand-tint`                                                                                                                                |
| `bg-accent` / `bg-accent-subtle`                                  | `bg-gold` / `bg-gold-tint`                                                                                                                     |
| `bg-inverse`, `bg-strong`, `bg-footer*`                           | `bg-ink`                                                                                                                                       |
| `text-default`, `text-strong`                                     | `text-ink`                                                                                                                                     |
| `text-muted`                                                      | `text-ink-soft`                                                                                                                                |
| `text-subtle`                                                     | `text-ink-faint`                                                                                                                               |
| `text-on-brand`                                                   | `text-paper`                                                                                                                                   |
| `text-link` / `text-link-hover`                                   | `text-brand` / `hover:text-brand-deep`                                                                                                         |
| `text-accent`                                                     | `text-gold-deep`                                                                                                                               |
| `text-footer-muted/placeholder/bottom`                            | `text-paper/75` etc. (footer is ink-on-dark)                                                                                                   |
| `border-default`                                                  | `border-hairline`                                                                                                                              |
| `border-subtle`                                                   | `border-hairline-2`                                                                                                                            |
| `border-strong`                                                   | `border-ink-faint`                                                                                                                             |
| `bg/text/border-action-*`                                         | removed — visual styling lives in Button variants only                                                                                         |
| `bg/text/border-success-*`                                        | `bg-brand-tint` / `text-brand` / `border-brand`                                                                                                |
| `bg/text/border-danger-*`                                         | `bg-danger-tint` / `text-danger` / `border-danger` (new functional tokens — mockup has no error color; values proposed in UI-SPEC) `[ASSUMED]` |
| `ring-ring`                                                       | `ring-ring` (value → brand green)                                                                                                              |
| `font-display`                                                    | `font-display` (value → Spectral)                                                                                                              |
| `type-display-01/02`                                              | `type-display` (single clamp-based display role)                                                                                               |
| `type-heading-01..05`, `type-body*`, `type-label`, `type-caption` | same names, new values                                                                                                                         |
| `type-eyebrow`                                                    | same name, **new treatment** (Space Mono 11px / 0.22em / 700 / uppercase); rule-line + color live in a new `Eyebrow` ui component              |
| (new)                                                             | `type-lede`, `type-mono-meta`                                                                                                                  |
| `rounded-xs..2xl`                                                 | same names; values 2/4/6/10/14/18px; pills/buttons → `rounded-full`                                                                            |
| `shadow-0..4`, `shadow-focus`                                     | same names; new values from mockup shadows                                                                                                     |
| `max-w-base` / `max-w-wide` / `max-w-prose`                       | same names; 80rem (=1280px ✓) / 92.5rem (=1480px) / 65ch                                                                                       |
| (new)                                                             | `--spacing-gutter: clamp(1.25rem, 5vw, 4.5rem)` → `px-gutter`; `--spacing-section: clamp(4rem, 9vw, 8.125rem)` → `py-section`                  |

**Section tone remap** (API names kept, `brandStrong` retired):

| Tone          | Old       | New                                               |
| ------------- | --------- | ------------------------------------------------- |
| `surface`     | white     | `bg-paper text-ink`                               |
| `sunken`      | stone-100 | `bg-paper-2 text-ink`                             |
| `brand`       | steep-700 | `bg-brand-deep text-paper` (green bands)          |
| `inverse`     | ink-900   | `bg-ink text-paper` (ink bands/footer-adjacent)   |
| `brandStrong` | steep-900 | **remove variant; migrate call sites to `brand`** |
| `transparent` | —         | unchanged                                         |

**Fonts via `next/font/google`** (replaces Fraunces/Inter/JetBrains_Mono in `src/app/layout.tsx`): Spectral (`--font-spectral`, weights 300–600 + italic), Hanken Grotesk (`--font-hanken-grotesk`, variable), Space Mono (`--font-space-mono`, 400/700), Caveat (`--font-caveat`, variable). `@theme inline` maps `--font-display`/`--font-sans`/`--font-mono`/`--font-script` to these vars with Georgia/system-ui/ui-monospace/cursive fallbacks (the fallbacks also cover Storybook, which never renders the root layout).

**Tailwind default palette wipe:** add `--color-*: initial;` at the top of `@theme` in the final sweep so only Teavision tokens generate color utilities — this makes RD-02's "no orphaned token classes" machine-enforced (any `bg-emerald-500` would fail `check-tailwind-classes`). `[ASSUMED: Tailwind v4 documented namespace-wipe syntax; verify at implementation — the guard script itself will prove it works]`

## Don't Hand-Roll

| Problem                              | Don't Build                                    | Use Instead                                                                   | Why                                                                               |
| ------------------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Font loading                         | `<link>` to Google Fonts / manual `@font-face` | `next/font/google`                                                            | Self-hosting, no layout shift, CSS var pattern already wired into `@theme inline` |
| Icons                                | Porting the mockup's `Icon`/`I` path set       | `lucide-react` equivalents (Leaf, Search, ShoppingCart, Phone, ArrowRight, …) | Already a dependency; a11y-handled; mockup icons are generic line icons           |
| Button/Section styling at call sites | per-page pill button classes                   | extend `Button`/`Section` cva variants                                        | ESLint guards literally ban the alternative                                       |
| className validity checking          | manual review                                  | `pnpm lint:tailwind` (existing)                                               | Compiles every token against the design system                                    |
| Variant maps                         | object-lookup + template literals              | `cva()` + `cn()`                                                              | Guard scripts parse `cva` calls; project convention                               |
| Curved stamp text                    | hand-positioned letters                        | SVG `<textPath>` (port mockup `Stamp` as-is)                                  | Mockup already solved it; reduced-motion handled in CSS                           |
| Carousel (testimonials, if needed)   | custom slider                                  | `embla-carousel-react` (already used by testimonials-slider)                  | existing dependency                                                               |

**Key insight:** every "new" visual element in the mockup maps onto an existing primitive or an extension of one — the phase needs **zero new dependencies** and at most 2–3 new small components (`Eyebrow`, `BrushCircle`, `Stamp`).

## Runtime State Inventory

| Category                                  | Items Found                                                                                                                                                                                                                                                                                                    | Action Required                                                          |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Stored data                               | None — design tokens are build-time CSS; cart cookie (`teavision_cart`) stores only a Shopify cart ID, no styling                                                                                                                                                                                              | none `[VERIFIED: AGENTS.md data-flow]`                                   |
| Live service config                       | None — Shopify/Searchanise/Sanity/Resend hold no references to CSS tokens                                                                                                                                                                                                                                      | none                                                                     |
| OS-registered state                       | None                                                                                                                                                                                                                                                                                                           | none                                                                     |
| Secrets/env vars                          | None affected (no styling-related env vars)                                                                                                                                                                                                                                                                    | none                                                                     |
| Build artifacts                           | `.next/` and `storybook-static/` caches hold compiled old CSS                                                                                                                                                                                                                                                  | rebuilt automatically by `pnpm build` / `build-storybook`; not committed |
| Test fixtures asserting old class strings | `cart-view.test.tsx`, `product-card.test.tsx` (h3 `text-strong … font-display` snapshot strings), `product-list.test.tsx` (`border-subtle`), `button-system.test.mjs` (`rounded-md`, `min-h-11`, `var(--tv-bg-inverse)`, motion-reduce trios, `variant="brand"`), `.storybook/preview.ts` (`var(--tv-bg-canvas | surface)`)                                                               | update in lockstep with the component/token change that breaks each `[VERIFIED: grep]` |

## Common Pitfalls

### Pitfall 1: Deleting old tokens before consumers migrate

**What goes wrong:** `check-tailwind-classes.mjs` compiles `globals.css` and validates every class in `src/` + `.storybook/` against it. Removing `--tv-*`-backed utilities instantly makes ~1,490 class usages "invalid" → `pnpm lint` fails repo-wide.
**How to avoid:** Plan 1 _adds_ the new tokens beside the old; each surface plan migrates its files; the final plan deletes old tokens and adds the `--color-*: initial` wipe. Lint stays green after every plan.
**Warning signs:** `lint:tailwind` reporting hundreds of "invalid Tailwind class" lines.

### Pitfall 2: Contract tests assert exact class strings

**What goes wrong:** `scripts/component-contracts/button-system.test.mjs` asserts `rounded-md` appears exactly once in `button.tsx` (the new base is `rounded-full`), `sm: 'type-label min-h-11 px-3'` verbatim, `var(--tv-bg-inverse)` in button stories, `motion-reduce:transform-none|transition-none|group-hover:scale-100` on every `group-hover:scale` line in 5 named files, and `variant="brand"` in homepage hero. `pnpm test:contracts` fails if a restyle touches these without updating the test.
**How to avoid:** treat `button-system.test.mjs`, `.storybook/preview.ts`, and the 3 vitest class-assertion tests as **lockstep files** named explicitly in plan tasks.

### Pitfall 3: Porting mockup markup verbatim trips the ESLint guards

**What goes wrong:** the mockup uses raw `<section>` (banned: `no-raw-section`), raw `<button>` (banned outside 4 ui files: `no-raw-button`), visual classes on `Button` (banned: `no-button-style-class` — only layout utilities allowed in Button `className`), and `bg-*` classes on section wrappers (banned on `Section.Root`: `no-section-root-tone-class`).
**How to avoid:** mockup `section` → `Section.Root tone=…`; mockup `.btn-*` → Button **variants** defined inside `button.tsx`; band backgrounds → Section tone variants, extending the tone map if needed.

### Pitfall 4: Spacing canonicalization rejects raw-px arbitrary values

**What goes wrong:** the checker canonicalizes `w-[22px]` → `w-5.5`, `top-[12px]` → `top-3`, etc., and fails lint until the canonical form is used. Mockup CSS is full of px values.
**How to avoid:** translate px → Tailwind spacing scale (4px grid) up front; non-grid values (e.g. 22px → `w-5.5`, 76px header → `h-19`) have exact canonical forms; `clamp(...)` arbitraries pass through untouched.

### Pitfall 5: Raw hex/oklch in className is NOT caught by the lint guard

**What goes wrong:** `bg-[#0d5a43]` compiles to valid CSS, so `check-tailwind-classes` passes it — but RD-08 and CLAUDE.md ban it.
**How to avoid:** add an explicit verification grep (`rg -n "-\[(#|rgb|oklch|hsl)" src`) to each plan's verification and the phase gate. The mockup's inline `style={{color:"var(--paper)"}}` overrides must become token classes or variants, never inline styles.

### Pitfall 6: Non-variable Google fonts need explicit weights

**What goes wrong:** `Spectral({subsets:['latin']})` throws at build ("missing weight"). Spectral and Space Mono are static-weight families; italic Spectral must be requested for the display-italic accents.
**How to avoid:** `Spectral({ weight: ['300','400','500','600'], style: ['normal','italic'], … })`, `Space_Mono({ weight: ['400','700'], … })`. Build fails fast if wrong — fix is mechanical.

### Pitfall 7: Motion features must stay reduced-motion safe

**What goes wrong:** the marquee (`.certs`), float keyframes (`bc-float`/`st-float`), hover lifts, and image zooms could regress AUDIT-02. The old `globals.css` has a global `prefers-reduced-motion` kill switch; the mockup CSS carries its own guards.
**How to avoid:** keep the global reduced-motion block in the new `globals.css`; keep the `motion-reduce:` class trios on zoom images (contract-tested); implement marquee as pure CSS with a `motion-reduce:animate-none` escape.

### Pitfall 8: Hidden non-component consumers

**What goes wrong:** `src/lib/shopify/html-content.ts` (93 occurrences — maps Shopify rich-text HTML to token classes) and `src/components/blog/portable-text/portable-text.tsx` (42) are not "components" and get missed in surface-by-surface sweeps, leaving legacy-styled article/page bodies (violates RD-07).
**How to avoid:** assign them to an explicit task (Plan 6 or wherever blog is restyled).

### Pitfall 9: Touch-target regression from mockup paddings

**What goes wrong:** mockup `.btn-sm` (11px/18px ≈ 40px tall) is below the 44px AA target asserted by contract tests (`min-h-11`).
**How to avoid:** keep `min-h-11`/`min-h-12` in all Button sizes regardless of mockup padding; the visual difference is negligible.

### Pitfall 10: Scope creep into feature work

**What goes wrong:** the mockup contains a slide-in cart drawer, toast system, account page, services pages, hero switcher, favourites button, and scroll-reveal animations — none exist in the real app.
**How to avoid:** restyle the existing `/cart` page with the drawer's line-item/summary _styling_; skip the drawer, toasts (existing aria-live announcements stay), favourites, reveal-on-scroll, and any route that doesn't exist (CONTEXT defers new pages).

## Code Examples

Verified patterns from this repo + mockup (full versions in UI-SPEC):

### Eyebrow (signature element) as a server component with rule line

```tsx
// Pattern: design-system.css .eyebrow ported to token classes (no ::before CSS needed)
<span className="type-eyebrow text-brand inline-flex items-center gap-2.5 before:h-px before:w-5.5 before:bg-current before:opacity-60">
  Wholesale collection
</span>
// variants: muted → text-ink-faint; on dark bands → text-gold; no-rule → drop the before:* classes
```

### Button variant remap (inside button.tsx — the only legal place)

```ts
// base: 'rounded-full' replaces 'rounded-md'; lockstep update button-system.test.mjs
variant: {
  brand: 'bg-brand text-paper hover:bg-brand-deep active:bg-brand-deep',          // mockup .btn-primary
  primary: 'bg-ink text-paper hover:bg-ink/90 active:bg-ink/90',                  // mockup .btn-gold (ink)
  secondary: 'border-[1.5px] border-hairline bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper',
  inverse: 'bg-paper text-ink hover:bg-card',                                     // mockup .btn-light
  inverseSecondary: 'border-[1.5px] border-paper/35 bg-transparent text-paper hover:bg-paper hover:text-ink',
  ghost: 'text-brand hover:bg-brand-tint hover:text-brand-deep',
}
```

### Asset extraction (one-off script, Plan 1 task)

```js
// scripts/extract-redesign-assets.mjs — verified manifest format
import { readFileSync, writeFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
const html = readFileSync('design/teavision-redesign.html', 'utf8')
const manifest = JSON.parse(
  html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/)[1],
)
const ids = JSON.parse(
  html.match(/<script type="__bundler\/ext_resources">([\s\S]*?)<\/script>/)[1],
)
for (const { id, uuid } of ids) {
  // stampRing, illoCup, illoTeapot, illoHandshake
  const e = manifest[uuid]
  let bytes = Buffer.from(e.data, 'base64')
  if (e.compressed) bytes = gunzipSync(bytes)
  writeFileSync(
    `public/images/${id.replace(/([A-Z])/g, '-$1').toLowerCase()}.png`,
    bytes,
  )
}
```

## State of the Art

| Old Approach (this repo)                                             | Current Approach (this phase)                  | Impact                                   |
| -------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| `--tv-*` indirection layer (`@theme` → `--tv-*` → `--color-steep-*`) | flat `@theme` tokens with literal oklch values | simpler; one hop; matches mockup exactly |
| Fraunces/Inter/JetBrains Mono                                        | Spectral/Hanken Grotesk/Space Mono/Caveat      | full brand voice change                  |
| sans-serif eyebrows (`type-eyebrow` 0.08em)                          | Space Mono 0.22em mono eyebrows with rule line | signature element everywhere             |
| `rounded-md` buttons                                                 | pill buttons (`rounded-full`)                  | Button base + contract test change       |
| Tailwind default palette available                                   | `--color-*: initial` wipe (final sweep)        | machine-enforces token-only styling      |

**Deprecated/outdated after this phase:** `--tv-*` vars, steep/stone/ink-scale/amber scales, footer-legacy tokens, `action-*`/`success-*`/`danger-*` utility names, `type-display-01/02`, Section `brandStrong` tone, Phase 4's footer visual parity and Phase 7's collection-hero parity (both explicitly superseded by the redesign per CONTEXT).

## Assumptions Log

| #   | Claim                                                                                                                                                                     | Section                | Risk if Wrong                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| A1  | Spectral & Space Mono require explicit `weight` arrays in next/font (non-variable)                                                                                        | Standard Stack         | None — build errors immediately with the fix in the message                 |
| A2  | `--color-*: initial` namespace wipe is valid Tailwind 4.2 `@theme` syntax                                                                                                 | Token Mapping          | Low — if unsupported, skip the wipe; RD-02 grep gates still enforce removal |
| A3  | Danger/success functional colors (absent from mockup): `--color-danger: oklch(0.45 0.13 30)`, `--color-danger-tint: oklch(0.94 0.02 30)`; success reuses brand/brand-tint | Token Mapping, UI-SPEC | Cosmetic — values are warm-palette-consistent; trivially tunable            |
| A4  | Cart drawer/toasts/favourites/scroll-reveal are feature work, excluded; `/cart` page gets the drawer's visual treatment                                                   | Pitfall 10             | Scope dispute — flag to user if drawer is actually wanted                   |

## Open Questions

> **Status (2026-06-10, plan-phase orchestrator):** all three questions resolved during planning.
> Q1 → **RESOLVED:** Phase 9 intents CARD-02..06 absorbed into plan 11-08 (RD-05 card redesign); CARD-01 superseded by the vertical mockup card; final Phase 9 supersession bookkeeping surfaced to the user at plan review.
> Q2 → **RESOLVED:** static utility bar with mockup ticker copy, built in plan 11-04 (user may adjust wording at review).
> Q3 → **RESOLVED:** `no-section-root-tone-class` regex updated in plan 11-14 Task 2.

1. **Phase 9 (collection card improvements) is planned but NOT implemented** — no `showQuantity` prop exists in `product-purchase-form.tsx` `[VERIFIED: grep]`, yet ROADMAP says Phase 11 depends on Phase 9 and RD-05 says "preserving Phase 8/9 behavior contracts".
   - What we know: the mockup card already delivers most of Phase 9's intent (eyebrow origin/type line ≈ CARD-02, organic/gold pills ≈ CARD-03, no "More info" button ≈ CARD-04, identity-top/controls-bottom ≈ CARD-05).
   - What's unclear: whether Phase 9 runs first or is absorbed.
   - Recommendation: absorb CARD-02/03/04/05 into the RD-05 card redesign and implement `showQuantity` (CARD-06) as part of it; confirm with user before planning if possible. Either way the planner must not assume Phase 9 code exists.
2. **Announcement/utility bar** — the mockup header has a 38px ink ticker bar; the current header has no announcement bar. RD-03 lists "announcement surfaces" in scope, so build the static utility bar (EST line + wholesale/phone links) as part of the header restyle — content can come from existing footer contact data. Confirm ticker copy with user during planning if desired.
3. **`no-section-root-tone-class` rule references `text-on-brand`** — after the rename this regex limb goes dead (the `bg-*` limb still works). Minor: update the rule (and its test) to `text-paper` in the final sweep, or leave as harmless dead code. Recommendation: update it.

## Environment Availability

| Dependency                                           | Required By               | Available                                                  | Version               | Fallback                             |
| ---------------------------------------------------- | ------------------------- | ---------------------------------------------------------- | --------------------- | ------------------------------------ |
| pnpm                                                 | all commands              | ✓                                                          | project-managed       | —                                    |
| Node.js                                              | scripts, asset extraction | ✓                                                          | (ran in this session) | —                                    |
| tailwindcss / next / storybook / vitest / playwright | build + tests             | ✓                                                          | per package.json      | —                                    |
| Network access to Google Fonts at build              | next/font/google download | ✓ assumed (current build already downloads Fraunces/Inter) | —                     | none needed                          |
| Shopify credentials                                  | dev-server visual checks  | ✓ (existing .env.local per codegen script)                 | —                     | Storybook for component-level checks |

**Missing dependencies with no fallback:** none.

## Validation Architecture

### Test Framework

| Property           | Value                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Frameworks         | vitest 4.1.8 (unit/integration/stories), node:test (contract tests), Playwright 1.60 (e2e), Storybook 10.4    |
| Config files       | `vitest.storybook.config.mts`, `playwright.config.ts`, `.storybook/main.ts` (all exist)                       |
| Quick run command  | `pnpm lint:tailwind` (~seconds; validates every className against the new theme)                              |
| Full suite command | `pnpm lint && pnpm typecheck && pnpm test:contracts && pnpm test:unit && pnpm test:integration && pnpm build` |

### Phase Requirements → Test Map

| Req ID    | Behavior                                      | Test Type        | Automated Command                                                                                                           | File Exists?                                                                                            |
| --------- | --------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| RD-01     | New `@theme` tokens compile & classes resolve | static           | `pnpm lint:tailwind`                                                                                                        | ✅                                                                                                      |
| RD-01     | Fonts load via next/font                      | build            | `pnpm build` (fails on bad font config)                                                                                     | ✅                                                                                                      |
| RD-02     | No old tokens anywhere                        | grep gate        | `rg -n "tv-\|steep-\|stone-" src .storybook scripts/component-contracts` → empty (token matches)                            | ✅ (command)                                                                                            |
| RD-02     | No orphaned utility defs                      | grep gate        | `rg -n "action-(primary\|secondary\|tertiary\|destructive)\|surface-sunken\|on-brand\|bg-canvas\|text-default" src` → empty | ✅ (command)                                                                                            |
| RD-03..07 | Surfaces match mockup                         | manual-only      | dev-server browser pass per surface at desktop + mobile widths vs `extracted-design.html`                                   | justification: no visual-regression tooling configured (Chromatic addon installed but no project token) |
| RD-05/06  | Behavior contracts preserved                  | unit+integration | `pnpm test:unit && pnpm test:integration` (cart-view, product-form, cart actions, quick-view route)                         | ✅                                                                                                      |
| RD-05/06  | Quick-add/cart e2e                            | e2e              | `pnpm test:e2e` (fake-Shopify cart handoff)                                                                                 | ✅                                                                                                      |
| RD-08     | Stories render                                | build+test       | `pnpm build-storybook && pnpm test:stories`                                                                                 | ✅                                                                                                      |
| RD-08     | No raw hex/oklch/rgb in classNames            | grep gate        | `rg -n "-\[(#\|rgb\|oklch\|hsl)" src` → empty                                                                               | ✅ (command)                                                                                            |
| all       | Guard rules + class-string contracts          | contract         | `pnpm test:contracts`                                                                                                       | ✅ (update assertions in lockstep)                                                                      |

### Sampling Rate

- **Per task commit:** `pnpm lint:tailwind` + targeted vitest file if the task touches a tested component
- **Per plan/wave:** `pnpm lint && pnpm typecheck && pnpm test:contracts && pnpm test:unit`
- **Phase gate:** full suite + `pnpm build` + `pnpm build-storybook` + `pnpm test:integration` + `pnpm test:e2e` + all RD-02/RD-08 greps + manual visual pass before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `scripts/extract-redesign-assets.mjs` — one-off motif PNG extraction (RD-04 prerequisite; verified format above)
- Otherwise: **None** — existing test infrastructure covers all phase requirements; class-string assertions are updated in lockstep rather than pre-created.

## Security Domain

This phase is restyling-only; it must not widen the attack surface.

### Applicable ASVS Categories

| ASVS Category         | Applies        | Standard Control                                                                                                                                       |
| --------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| V2 Authentication     | no             | no auth surfaces touched                                                                                                                               |
| V3 Session Management | no             | cart cookie untouched                                                                                                                                  |
| V4 Access Control     | no             | —                                                                                                                                                      |
| V5 Input Validation   | yes (preserve) | forms keep existing Server Action validation, honeypot, `sanitize-html` for Shopify HTML (`html-content.ts` changes classes only, never the sanitizer) |
| V6 Cryptography       | no             | —                                                                                                                                                      |
| V14 Configuration     | yes (preserve) | no secrets in CSS/tokens; rate-limit env flags untouched; `serializeInlineJson` JSON-LD helper untouched                                               |

### Known Threat Patterns for this change

| Pattern                                                   | STRIDE        | Standard Mitigation                                                                                                                    |
| --------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| XSS via rich-text class mapping refactor                  | Tampering     | only swap class-name strings in `html-content.ts`/`portable-text.tsx`; do not alter sanitization or `dangerouslySetInnerHTML` plumbing |
| Removing rate-limit/honeypot wiring while restyling forms | Tampering/DoS | restyle form markup around the existing action/props contract; contract + integration tests must stay green                            |
| Asset extraction script writing outside `public/images/`  | Tampering     | fixed output path, run once, reviewed output                                                                                           |

## Project Constraints (from CLAUDE.md / AGENTS.md / docs/conventions.md)

- Next.js 16 differs from training data — consult `node_modules/next/dist/docs/` before nontrivial framework work; `params` is a Promise; `'use cache'` Cache Components in play.
- pnpm only, never npm. Commands: `pnpm dev/build/lint/format/codegen/storybook`, tests per AGENTS.md.
- **Banned:** default exports (components/lib), `any`, raw hex/rgb in className, className concatenation (use `cn()`), `'use client'` on wrappers, multiple components per file, CSS modules/styled-components/`style={{}}` (exception: dynamic computed values Tailwind can't extract), direct imports from `types/generated`, root-level `app/`/`components/`/`lib/`.
- Section rules: no raw page-level `<section>`; `Section.Root` tones + `Section.Container`; raw `<section>` reserved for the primitive itself.
- File layout: kebab-case files, PascalCase named exports, one component per folder with story + barrel; scaffold via `pnpm create:component`.
- Every `src/components/` component needs a Storybook story.
- Palette is warm/botanical — never introduce cool grays (the new ink scale has a green undertone — compliant).
- Real Shopify checkout/payment testing remains forbidden without owner approval (e2e uses fake Shopify only).
- `docs/conventions.md` token examples (`bg-canvas`, `text-default`, …) become stale after this phase — updating them is in scope (Plan 6).

## Suggested Plan Structure

6 sequential plans (parallelization is disabled in config; dependencies noted anyway):

| Plan                                         | Scope                                                                                                                                                                                                                                                                                                                                                                                               | Depends on                 | Key lockstep files                                                                                    |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------- |
| **11-01 Foundation**                         | Asset-extraction script + motif PNGs; `layout.tsx` font swap; new `@theme` tokens + redefined `@utility` type roles **added alongside old tokens**; `Section` tones, `Button` variants/sizes, `Eyebrow` (new), `Badge`→pill, inputs/checkbox/select/labels, quantity-stepper, icon-button, card, accordion, dialog, price, star-rating; `.storybook/preview.ts`; ui stories                         | —                          | `button-system.test.mjs`, `.storybook/preview.ts`                                                     |
| **11-02 Layout chrome**                      | Header (utility bar, main bar, mega menus, search overlay, mobile menu, cart badge), footer (ink restyle, keep links/newsletter action), storefront layout skip-link, root error/not-found pages                                                                                                                                                                                                    | 11-01                      | —                                                                                                     |
| **11-03 Homepage**                           | Hero A + stat strip, range tiles, services cards, organic split, certs marquee, testimonials, journal cards, brand-motif bands (BrushCircle/Stamp), help/contact section, FAQ, newsletter band, `content.ts`                                                                                                                                                                                        | 11-01 (02 for visual QA)   | `button-system.test.mjs` (hero `variant="brand"`, content.ts `inverseSecondary`), motion-reduce trios |
| **11-04 Collections + search**               | Collection hero, filters, toolbar/sort, product grid, **product card** (absorbing Phase 9 CARD-02..06 — see Open Q1), purchase form, collections index, search results/filters/pagination                                                                                                                                                                                                           | 11-01                      | `product-card.test.tsx`, `product-list.test.tsx`                                                      |
| **11-05 PDP + cart**                         | PDP layout/gallery/eyebrow/price/sizes/buy-row/assurance, bulk-savings → tiers grid, quick view, recommendation cards, related rail; cart page restyle (drawer styling applied to page), skeleton, line actions, checkout form                                                                                                                                                                      | 11-01 (04 for shared card) | `cart-view.test.tsx`, skeleton mirrors                                                                |
| **11-06 Remaining surfaces + removal sweep** | Blog/article + portable-text + `html-content.ts`, wholesale/contact/our-story/certifications/custom-tea-blends/[...slug], remaining stories; **delete** `--tv-*`/steep/stone/legacy tokens + stale utilities, add `--color-*: initial` wipe, retire `brandStrong`, update `no-section-root-tone-class` regex, update `docs/conventions.md`/`AGENTS.md` token examples; full phase-gate verification | all                        | grep gates, full suite                                                                                |

## Sources

### Primary (HIGH confidence — read directly this session)

- `design/extracted/design-system.css` (full), `header.js`, `homepage.js`, `collection-page.js`, `product-page.js`, `product-card-footer.js`, `brand-motifs.js`, `supporting-pages.js`, `ui-primitives.js`, `app-shell.js`
- `design/teavision-redesign.html` (asset bundler format, lines 40–150)
- `src/app/globals.css`, `src/app/layout.tsx`, `src/app/(storefront)/page.tsx`, `(storefront)/layout.tsx`
- `src/components/ui/section/section.tsx`, `ui/button/button.tsx`
- `scripts/check-tailwind-classes.mjs`, `scripts/eslint-rules/*.mjs`, `scripts/component-contracts/button-system.test.mjs`
- `.storybook/preview.ts`, `package.json`, `.planning/{CONTEXT,REQUIREMENTS,ROADMAP,STATE,config}`
- ripgrep usage census (commands recorded in §Usage Map)

### Secondary (MEDIUM)

- Tailwind v4 `@theme` namespace-wipe + `@theme inline` semantics — consistent with the repo's existing v4 usage; wipe syntax flagged A2

### Tertiary (LOW)

- next/font weight requirements for Spectral/Space Mono/Hanken Grotesk/Caveat (training knowledge, A1; fail-fast at build)

## Metadata

**Confidence breakdown:**

- New design system inventory: HIGH — read the literal CSS/JSX source of truth
- Usage map: HIGH — mechanical grep census of this repo
- Token mapping proposal: HIGH for structure, MEDIUM for the 2 assumed items (palette wipe syntax, danger color values)
- Risk analysis / guard tooling: HIGH — read every guard script and contract test
- Plan structure: HIGH — derived from the lint-gate sequencing constraint

**Research date:** 2026-06-10
**Valid until:** stable (repo-internal facts); re-verify only if `design/extracted/` or guard scripts change
