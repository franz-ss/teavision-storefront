# Phase 11 UI Spec — New Design System Contract

**Source of truth:** `design/extracted/design-system.css` + per-surface mockup JS. This file is the distilled, implementation-ready contract for planner/executor. Exact values only.

---

## 1. Font loading (`src/app/layout.tsx`)

Replace Fraunces/Inter/JetBrains_Mono with:

```tsx
import { Caveat, Hanken_Grotesk, Space_Mono, Spectral } from 'next/font/google'

const spectral = Spectral({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'], // italic is load-bearing (display accents, band highlights)
  subsets: ['latin'],
  variable: '--font-spectral',
  display: 'swap',
})
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
})
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})
// <body className={cn(spectral.variable, hankenGrotesk.variable, spaceMono.variable, caveat.variable)}>
```

---

## 2. New `@theme` block (`src/app/globals.css`)

Add in Plan 11-01 **alongside** the old tokens; delete old tokens + add the `--color-*: initial` wipe only in the final sweep (Plan 11-06). Final state:

```css
@import 'tailwindcss';

@theme inline {
  --color-*: initial; /* final sweep only: wipe Tailwind default palette */

  /* Fonts */
  --font-display: var(--font-spectral, Spectral), Georgia, serif;
  --font-sans:
    var(--font-hanken-grotesk, 'Hanken Grotesk'), system-ui, sans-serif;
  --font-mono: var(--font-space-mono, 'Space Mono'), ui-monospace, monospace;
  --font-script: var(--font-caveat, Caveat), cursive;

  /* Surfaces */
  --color-paper: oklch(97.4% 0.008 92);
  --color-paper-2: oklch(95.2% 0.012 90);
  --color-paper-3: oklch(92.8% 0.016 88);
  --color-card: oklch(99.2% 0.004 92);

  /* Ink (green undertone — warm/botanical compliant) */
  --color-ink: oklch(22.5% 0.016 167);
  --color-ink-soft: oklch(41% 0.02 167);
  --color-ink-faint: oklch(56% 0.016 167);

  /* Hairlines */
  --color-hairline: oklch(22.5% 0.016 167 / 12%);
  --color-hairline-2: oklch(22.5% 0.016 167 / 7%);

  /* Brand greens (mockup --accent collapsed to green) */
  --color-brand: oklch(41.2% 0.078 166);
  --color-brand-deep: oklch(30.5% 0.06 167);
  --color-brand-mid: oklch(54.5% 0.085 165);
  --color-brand-tint: oklch(93.5% 0.026 166);
  --color-sage: oklch(86.5% 0.032 165);

  /* Gold */
  --color-gold: oklch(74% 0.094 78);
  --color-gold-deep: oklch(60% 0.088 70);
  --color-gold-tint: oklch(94% 0.034 84);

  /* Functional feedback (not in mockup; warm-derived — success reuses brand/brand-tint) */
  --color-danger: oklch(45% 0.13 30);
  --color-danger-tint: oklch(94% 0.02 30);

  /* Focus ring */
  --color-ring: var(--color-brand);

  /* Radii (controls 4px, menu links 6px, thumbs 8→10, cards 10px) */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-2xl: 18px;

  /* Rhythm */
  --spacing-gutter: clamp(
    1.25rem,
    5vw,
    4.5rem
  ); /* mockup --gutter: clamp(20px,5vw,72px) → px-gutter */
  --spacing-section: clamp(4rem, 9vw, 8.125rem); /* .section-pad → py-section */
  --container-prose: 65ch;
  --container-base: 80rem; /* 1280px = mockup --maxw (.wrap) */
  --container-wide: 92.5rem; /* 1480px = mockup .wrap-wide */

  /* Shadows (from mockup) */
  --shadow-0: none;
  --shadow-1: 0 10px 24px -14px rgb(0 0 0 / 0.3); /* chips, light pop */
  --shadow-2: 0 14px 30px -14px rgb(0 0 0 / 0.4); /* badges, hover pop */
  --shadow-3: 0 24px 50px -28px rgb(0 0 0 / 0.35); /* card hover lift */
  --shadow-4: 0 30px 60px -30px rgb(0 0 0 / 0.35); /* mega menu / overlays */
  --shadow-focus: 0 0 0 3px oklch(93.5% 0.026 166); /* green-tint glow */
}
```

Base layer (replaces old `@layer base`): body `bg-paper text-ink font-sans` 16px/1.6, antialiased; `h1–h4` → `font-display` weight 500, lh 1.04, ls −0.01em, `text-ink`, text-wrap balance; `::selection` → `bg-gold-tint`; keep `touch-action: manipulation` on interactive elements; keep the global `prefers-reduced-motion` kill block; keep `@utility searchanise-recommendations`.

### Typography utilities (`@utility`, redefined)

| Utility                                        | Font               | Size                          | Weight | LH      | Tracking / case                                                          |
| ---------------------------------------------- | ------------------ | ----------------------------- | ------ | ------- | ------------------------------------------------------------------------ |
| `type-display` (replaces `type-display-01/02`) | display (Spectral) | clamp(2.6rem, 6.4vw, 5.4rem)  | 500    | 0.98    | −0.025em                                                                 |
| `type-heading-01`                              | display            | clamp(2rem, 4vw, 3.4rem)      | 500    | 1.04    | −0.01em                                                                  |
| `type-heading-02`                              | display            | clamp(1.7rem, 3vw, 2.6rem)    | 500    | 1.04    | −0.01em                                                                  |
| `type-heading-03`                              | display            | clamp(1.4rem, 2.2vw, 1.9rem)  | 500    | 1.04    | −0.01em                                                                  |
| `type-heading-04`                              | display            | 1.45rem                       | 500    | 1.1     | −0.01em                                                                  |
| `type-heading-05`                              | display            | 1.2rem                        | 500    | 1.1     | —                                                                        |
| `type-lede` (new)                              | sans               | clamp(1.05rem, 1.5vw, 1.3rem) | 400    | 1.55    | — (pair with `text-ink-soft`)                                            |
| `type-body-lg` / `type-body` / `type-body-sm`  | sans               | 1.125 / 1 / 0.875rem          | 400    | 1.6     | —                                                                        |
| `type-label`                                   | sans               | 0.94rem                       | 600    | 1.25rem | 0.01em (button/nav label)                                                |
| `type-caption`                                 | sans               | 0.75rem                       | 400    | 1rem    | —                                                                        |
| `type-eyebrow`                                 | mono               | 11px                          | 700    | 1       | 0.22em, uppercase                                                        |
| `type-mono-meta` (new)                         | mono               | 11px                          | 400    | 1.4     | 0.08em, uppercase (breadcrumbs, card origin, cart meta, filter headings) |

### Eyebrow component (new, `src/components/ui/eyebrow/`)

Signature element. Span: `type-eyebrow inline-flex items-center gap-2.5` + leading rule `before:h-px before:w-5.5 before:bg-current before:opacity-60`. Variants (cva `tone`): `brand` → `text-brand` (default), `muted` → `text-ink-faint`, `gold` → `text-gold` (dark bands); boolean `rule` (default true; false drops `before:*`). Needs story.

---

## 3. Old → new class rename table (mechanical sweep reference)

| Old                                                                                    | New                                                                              |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `bg-canvas`                                                                            | `bg-paper`                                                                       |
| `bg-surface`, `bg-surface-raised`                                                      | `bg-card` (cards/inputs) or `bg-paper` (page bands)                              |
| `bg-surface-sunken`                                                                    | `bg-paper-2`                                                                     |
| `bg-brand-strong`                                                                      | `bg-brand-deep`                                                                  |
| `bg-brand-subtle`                                                                      | `bg-brand-tint`                                                                  |
| `bg-accent` / `bg-accent-subtle`                                                       | `bg-gold` / `bg-gold-tint`                                                       |
| `bg-inverse`, `bg-strong`, `bg-footer`, `bg-footer-accent(-hover)`, `bg-footer-bottom` | `bg-ink` (footer-accent hovers → `bg-brand-deep` where a green hover is wanted)  |
| `text-default`, `text-strong`, `text-footer-bottom`                                    | `text-ink`                                                                       |
| `text-muted`                                                                           | `text-ink-soft`                                                                  |
| `text-subtle`                                                                          | `text-ink-faint`                                                                 |
| `text-on-brand`                                                                        | `text-paper`                                                                     |
| `text-link` / `text-link-hover`                                                        | `text-brand` / `hover:text-brand-deep`                                           |
| `text-accent`                                                                          | `text-gold-deep`                                                                 |
| `text-footer-muted` / `text-footer-placeholder`                                        | `text-paper/75` / `placeholder:text-paper/60`                                    |
| `border-default`                                                                       | `border-hairline`                                                                |
| `border-subtle`                                                                        | `border-hairline-2`                                                              |
| `border-strong`                                                                        | `border-ink-faint`                                                               |
| `border-footer-input`                                                                  | `border-paper/20`                                                                |
| `bg-action-primary(-hover/-active)` / `text-action-primary-text`                       | Button `primary` variant (`bg-ink text-paper`); raw uses → `bg-ink text-paper`   |
| `bg-action-secondary*`, `text-action-secondary-text`, `border-action-secondary-border` | Button `secondary` variant                                                       |
| `text-action-tertiary(-hover)`                                                         | `text-brand` / `hover:text-brand-deep`                                           |
| `bg-action-destructive(-hover)`, `text-action-destructive-text`                        | `bg-danger hover:bg-danger/90 text-paper`                                        |
| `bg-success-bg` / `text-success-text` / `border-success-border`                        | `bg-brand-tint` / `text-brand` / `border-brand`                                  |
| `bg-danger-bg` / `text-danger-text` / `border-danger-border`                           | `bg-danger-tint` / `text-danger` / `border-danger`                               |
| `ring-ring`, `ring-offset-*`                                                           | unchanged names (`--color-ring` now brand green; ring offsets reference new bgs) |
| `type-display-01`, `type-display-02`                                                   | `type-display`                                                                   |
| `font-display`, `font-sans`, `font-mono`                                               | unchanged names, new fonts                                                       |
| `rounded-*`, `shadow-0..4`, `shadow-focus`, `max-w-prose/base/wide`                    | unchanged names, new values                                                      |

Kept with new values (NOT renames, part of new system): `bg-brand`, `text-brand`, `border-brand`, `type-heading-01..05`, `type-body*`, `type-label`, `type-caption`, `type-eyebrow`.

---

## 4. Primitive specs

### Button (`src/components/ui/button/button.tsx`)

- Base: `inline-flex items-center justify-center gap-2.5 rounded-full transition-[background-color,color,box-shadow,transform] cursor-pointer focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40` — `rounded-full` replaces `rounded-md` (**update `button-system.test.mjs` rounded-md assertion**).
- No hover lift on any variant (hover-translate removed in plan 11-15; owner directive).
- Variants (mockup mapping):
  - `brand` = `.btn-primary`: `bg-brand text-paper hover:bg-brand-deep active:bg-brand-deep`
  - `primary` = `.btn-gold`: `bg-ink text-paper hover:bg-ink/90 active:bg-ink/90`
  - `secondary` = `.btn-ghost`: `border-[1.5px] border-hairline bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper`
  - `inverse` = `.btn-light`: `bg-paper text-ink hover:bg-card`
  - `inverseSecondary` = ghost-on-dark: `border-[1.5px] border-paper/35 bg-transparent text-paper hover:bg-paper hover:text-ink` (**keep variant name — contract test asserts it**)
  - `ghost`: `text-brand hover:bg-brand-tint hover:text-brand-deep`
- Sizes (keep `min-h-11`/`min-h-12` touch targets — contract test asserts `sm: 'type-label min-h-11 px-3'` shape; update string in lockstep if padding changes): `sm` ≈ px-4.5 text-[0.86rem], `md` px-6.5 (mockup 15px/26px), `lg` px-8.5 min-h-12 (18px/34px), `cta` px-8.5 min-h-12.

### Section (`src/components/ui/section/section.tsx`)

- Tones: `surface` → `bg-paper text-ink`; `sunken` → `bg-paper-2 text-ink`; `brand` → `bg-brand-deep text-paper`; `inverse` → `bg-ink text-paper`; `transparent` → ''. **Remove `brandStrong`** (migrate call sites to `brand`).
- Spacing: `default` → `py-section`; `compact` → `py-8 md:py-12`; `none` → ''.
- Container: `mx-auto px-gutter`; `default` → `max-w-wide` (1480), `compact` → `max-w-prose`; consider `base` variant → `max-w-base` (1280) for FAQ/editorial.
- `Section.Intro`: `Eyebrow` above `type-heading-01` title; copy `type-lede text-ink-soft`.

### Badge → pill (`src/components/ui/badge/badge.tsx`)

`inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1.5 type-mono-meta text-ink-soft`. Variants: `organic` → `border-brand/30 bg-brand-tint text-brand` (with 6px dot `before:size-1.5 before:rounded-full before:bg-current`); `gold` → `border-gold-deep/40 bg-gold-tint text-gold-deep`; on-dark → `border-paper/30 bg-paper/15 text-paper`.

### Form fields (text-input, textarea, select, checkbox, form-label)

- Label: `type-mono-meta text-ink-faint` (mono 10.5–11px uppercase).
- Input/textarea/select: `bg-card border border-hairline rounded-sm px-4 py-3.5`; focus `border-brand` + `shadow-focus` (`focus:ring-0` — glow comes from shadow); placeholder `text-ink-faint`.
- Checkbox (`.fbox`): `size-4.5 rounded-[5px] border-[1.5px] border-hairline`; checked `bg-brand border-brand text-paper`.

### Quantity stepper

Pill: `inline-flex items-center rounded-full border border-hairline`; buttons `size-11` (keep touch target), `text-ink-soft hover:text-brand`; count `min-w-7 text-center font-mono text-[13px]`.

### Card / link-arrow

- Card surface: `bg-card border border-hairline-2 rounded-lg`.
- Link-arrow pattern (inline CTAs): `inline-flex items-center gap-2 type-label border-b-[1.5px] border-hairline pb-1 hover:border-brand hover:text-brand` + ArrowRight icon 15px.

---

## 5. Per-surface specs

Each entry: mockup source → existing src files. Apply visual treatment; **never change props/actions/data contracts**.

### 5.1 Header (RD-03) — `design/extracted/header.js`, design-system.css HEADER block

Restyles: `src/components/layout/header/*` (header.tsx, mega-nav*, shop-mega-panel, services-*, mobile-_, search_, cart-badge, cart-count), `src/app/(storefront)/layout.tsx` (skip link).

- **Utility bar** (new announcement surface): `bg-ink text-paper font-mono text-[11.5px] tracking-[0.08em]`, h-9.5 (38px), `max-w-wide` row; left ticker: "EST. MELBOURNE 2014 · ACO + USDA CERTIFIED ORGANIC · FREIGHT-INSURED" style items; right: wholesale link + `tel:` phone (reuse real contact data/links; links at 85% opacity, hover 100%).
- **Main bar**: h-19 (76px), `bg-paper/80 backdrop-blur-md border-b border-hairline`, sticky top-0 z-60. Logo left (serif wordmark 1.5rem + 34px circle leaf mark, brand-colored border). Nav links = pills: `rounded-full px-3.5 py-2.5 type-label text-ink hover:bg-brand-tint hover:text-brand` (active/open same as hover, chevron rotates). Right: 42px round icon buttons (search/account if exists/cart) `hover:bg-brand-tint hover:text-brand`; cart count = `absolute top-1 right-1 min-w-4.5 h-4.5 rounded-full bg-gold text-ink font-mono text-[10px] font-bold`; wholesale CTA `Button variant="brand" size="sm"`; burger on mobile.
- **Mega menu**: full-width panel under header: `bg-paper border-b border-hairline shadow-4`; grid `[1.1fr_2.4fr_1.3fr] gap-10 py-10`; intro col (Eyebrow + serif h4 1.7rem + blurb + link-arrow); 3 link columns with mono 10.5px uppercase ink-faint headings, links `text-ink-soft hover:bg-brand-tint hover:text-brand rounded-md px-2.5 py-1.75` slide-in chevron; feature card right: `rounded-lg` image card, bottom gradient scrim, pill + serif title (use real collection imagery). Page scrim below: `bg-ink/35 backdrop-blur-[2px]`.
- **Search overlay**: panel like mega; input `font-display text-[clamp(1.4rem,3vw,2.2rem)]` borderless over `border-b-2 border-ink`; "Popular" Eyebrow (muted, no rule) + suggestion pills `hover:bg-brand hover:text-paper`.
- **Mobile menu**: fullscreen `bg-paper`; 76px top row; items `border-b border-hairline`, `font-display text-2xl py-5`, expand to pill links; foot: brand CTA + ghost phone button.

### 5.2 Footer (RD-03) — `product-card-footer.js` `Footer`, `.ft` CSS

Restyles: `src/components/layout/footer/*` (view, link-list, text-link, quality-column, newsletter-column, newsletter-form, icons). **Keep every existing link label/href (incl. mrtea.com.au login) and the newsletter Server Action/honeypot/feedback.**

- Wrapper: `bg-ink` text `text-paper/75`; `max-w-wide px-gutter`; top grid `lg:grid-cols-[1.6fr_1fr_1fr_1.4fr] gap-10 py-section`.
- Column headings: `font-mono text-[10.5px] tracking-[0.16em] uppercase text-gold mb-4.5`.
- Links: `text-[0.95rem] hover:text-paper`; brand col: paper-toned logo + ≤30ch blurb + quality pills (`border-paper/15 bg-paper/5 text-paper/80`).
- Newsletter: pill input `bg-paper/5 border border-paper/20 rounded-full px-4.5 py-3.5 text-paper placeholder:text-paper/60 focus:border-gold`; submit `Button variant="inverse" size="sm"` full-width; mono contact links (phone/mail) below.
- Bottom row: `border-t border-paper/10 py-5.5 font-mono text-[11px] tracking-[0.06em]` — copyright left, payment marks right as bordered chips `border border-paper/15 rounded-[5px] px-2 py-1 text-[9.5px]`.

### 5.3 Homepage (RD-04) — `homepage.js`, `brand-motifs.js`

Restyles: `src/app/(storefront)/page.tsx` + `src/components/homepage/*`. Real-section → mockup mapping:

| Real component                              | Mockup                              | Treatment                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero/hero.tsx`                             | **HeroA** (default)                 | full-bleed image (`homepage-hero.jpg`/Shopify), min-h `min(92vh,860px)`, dark gradient scrim (105deg, ink-green 82%→15%), gold Eyebrow, `type-display text-paper max-w-[16ch]` with italic accent line, `type-lede` paper/90, CTAs: `inverse` lg + `inverseSecondary` lg                                          |
| `proof-points/proof-points.tsx`             | `heroA__strip` or `.statband`       | tone `brand` (green-deep) band, 4-col grid with white/12 column rules, gold icon, `font-display text-[2.4rem] text-paper` stat + `text-paper/78` label                                                                                                                                                            |
| `product-range/*`                           | `RangeSection` `.rtile`             | section head: Eyebrow + `type-heading-01` left, `text-ink-soft max-w-[34ch]` right; 4-col grid (2-col ≤980px, 1-col ≤620px) of image tiles aspect `1/1.08` `rounded-lg`, bottom scrim, gold mono tag, white serif title, hover-reveal "Shop now"                                                                  |
| `private-label/*`                           | `ServicesSection` `.svc__card`      | 3-col card-surface cards, 150px media, `font-mono text-xs tracking-[0.14em] text-gold-deep` numbering, serif 1.45rem title, link-arrow; hover `-translate-y-1 shadow-3` (motion-reduce guard)                                                                                                                     |
| `organic-herbs/organic-herbs.tsx`           | `OrganicSplit` `.split`             | tone `sunken`; 2-col; check-list rows `border-t border-hairline py-4` with brand check icon; CTA `brand`                                                                                                                                                                                                          |
| `certification-coverage/*`                  | `CertsMarquee` `.certs`             | `border-y border-hairline`; CSS marquee (38s linear infinite, `hover:` + `motion-reduce:` paused), items `type-mono-meta text-ink-soft` + brand icon                                                                                                                                                              |
| `testimonials/*`                            | `Testimonials` `.tst`               | grid `[0.9fr_1.6fr]`; brand selector buttons (card bg when active + shadow); gold quote icon; `font-display text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.32]` quote; mono attribution                                                                                                                             |
| `supply-chain` / `Cta` bands + `catalogues` | `GrowBand`/`CatalogueBand` `.bband` | tone `inverse` (ink) or `brand` (green-deep); 3-col `[minmax(0,260px)_1fr_minmax(0,210px)]`; legacy brush illustration component PNG one side (float anim, motion-reduce off), legacy curved-label component other side (ring PNG + Caveat `<textPath>`); centered: gold Eyebrow, serif white h2 with gold-italic `.hl` word, `text-paper/75` copy, `inverse` CTA |
| `newsletter/*`                              | `NewsletterBand` or `.news` card    | green-deep rounded-lg card OR ink motif band; pill input white/10 + white/25 border, gold focus; **keep Server Action + states**                                                                                                                                                                                  |
| `contact/*` + `contact-form/*`              | `HelpSection` `.help`               | tone `inverse`; left: gold Eyebrow + white `type-heading-01` + contact lines (44px brand-tint circle icons, mono labels, serif values); right: card-surface form, `.field` styles; **keep action/honeypot/feedback**                                                                                              |
| `tea-journal/*`                             | `JournalSection` `.jcard`           | 3-col; 220px `rounded-lg` media hover-zoom (keep motion-reduce trio), mono meta row with brand category, serif 1.25rem titles                                                                                                                                                                                     |
| `faq/faq.tsx`                               | `FAQSection`                        | tone `sunken`, `max-w-base` centered; rows `border-t border-hairline`, `font-display text-[clamp(1.1rem,1.8vw,1.4rem)] py-6.5`; 30px circle icon → brand fill + rotate 45° when open                                                                                                                              |

New components: `legacy brush illustration component` (img wrapper, width clamp 184–268px per illo) and `legacy curved-label component` (PNG ring + 2 curved Caveat SVG textPaths, R=64 on 200 viewBox, fill `oklch(0.96 0.012 100)`→ use `text-paper` equivalent token/fill-paper) — port from `brand-motifs.js`; assets extracted to `public/images/` (newsletter-label.png, business-handshake.png, catalogue-cup.png, newsletter-teapot.png).

### 5.4 Collection / PLP (RD-05) — `collection-page.js`

Restyles: `collections/[handle]/_components/{hero,sidebar,product-list}.tsx`, `collections/page.tsx`, `collection/{filter-panel,toolbar,sort-select,story-disclosure}/*`.

- **Hero**: tone `brand` (green-deep), `py-[clamp(40px,5vw,70px)]`; breadcrumb `type-mono-meta text-paper/60` (current page gold); gold Eyebrow "Wholesale collection"; `text-paper font-display text-[clamp(2.4rem,5vw,4rem)]`; description `text-paper/85 max-w-[52ch]`; meta stats row (serif 1.6rem + mono uppercase label at 70%). Keep Shopify hero image at 35% opacity behind.
- **Layout**: `lg:grid-cols-[252px_1fr] gap-10`; sidebar sticky top-32. Filter groups `border-b border-hairline py-5.5`, mono 11px uppercase headings; options: 18px `.fbox` checkbox rows, counts mono ink-faint right; "Clear" `type-mono-meta text-gold-deep`. Wholesale upsell card: `bg-brand-tint border border-brand/20 rounded-lg p-5.5` + serif title + `brand` sm full-width CTA.
- **Toolbar**: count `type-mono-meta text-ink-faint`; sort = pill `border border-hairline bg-card rounded-full px-4 py-2.25 type-label`; active filter chips `bg-brand-tint text-brand rounded-full px-3 py-1.75 text-xs font-semibold` with × .
- **Grid**: 3-col desktop / 2-col ≤980 / 2-col tight ≤620, `gap-y-5.5 gap-x-4.5`.
- **Empty state**: centered leaf icon, serif 1.5rem "No matches", muted copy, ghost clear button.

### 5.5 Product card (RD-05, shared PLP/search/rails) — `product-card-footer.js` `ProductCard`

Restyles: `collection/product-card/{product-card,product-purchase-form}.tsx`, `product/recommendation-product-card/*`.

- Media: aspect `1/1.12`, `rounded-lg bg-paper-2 overflow-hidden`, image `hover:scale-[1.06]` (keep motion-reduce trio). Badges top-left: organic pill + gold award pill (from tags — absorbs CARD-02/03). Quick-add: full-width `primary` (ink) sm button pinned bottom of media on hover/focus-within, **always visible on touch/mobile**; multi-variant products keep Quick View/PDP path (Phase 8 contract).
- Body: `pt-4`; origin/type line `type-mono-meta text-ink-faint` (eyebrow role, CARD-02); title `font-display text-[1.2rem] leading-[1.1] my-1.5` sole PDP link (CARD-04 — no "More info"); price row: `font-bold` price + `font-mono text-[11px] text-ink-faint` unit, optional brand mono grade right.
- **Do not** widen the quick-add data contract (`variants(first: 2)` minimal fields, CQA-03/06).

### 5.6 PDP (RD-06) — `product-page.js`

Restyles: `products/[handle]/page.tsx`, `product/{product-gallery,product-form,bulk-savings,product-quick-view}/*`, `_components/{related-products,customers-also-bought}.tsx`.

- Breadcrumb `type-mono-meta text-ink-faint py-5.5`, current `text-ink`.
- Grid `lg:grid-cols-[1.05fr_1fr] gap-[clamp(28px,4vw,64px)]`; gallery sticky top-30; main image aspect `1/1.05 rounded-lg`; 4 thumbs `rounded-lg border-2 border-transparent` selected `border-brand`.
- Info: Eyebrow (origin · type · grade w/ globe icon); h1 `font-display text-[clamp(2rem,3.4vw,2.9rem)]`; rating: gold stars + mono count; tag pills row; price block: `font-display text-[2.2rem]` now-price + mono unit + brand mono pill for base/kg; description `text-ink-soft text-[1.02rem]`.
- Variant tiles (`.size`): `border-[1.5px] border-hairline rounded-sm px-4.5 py-3 min-w-23 text-center`, selected `border-brand bg-brand-tint` (mono sub-price goes brand). **Keep existing variant-selection logic.**
- Buy row: pill qty stepper + flex-1 `brand` lg add-to-cart (price-in-label optional). **Keep quantity validation, Server Action, aria-live success announcement.**
- Assurance row: `border-y border-hairline py-5` icon+text items (brand icons, `text-ink-soft text-[0.86rem]`).
- **Bulk savings → `.tiers`**: mono uppercase heading; 3-col grid of `border border-hairline rounded-sm p-3.5 text-center` tiles — mono qty range, `font-display text-[1.3rem]` price, brand "Save n%" line; best tier `border-brand` + floating mono chip "Best value" (`bg-brand text-paper rounded-full text-[9px] uppercase`); link-arrow to wholesale. **Render only when tier data exists (BULK-03).**
- Accordions (`.spec-acc`): `border-t border-hairline`, serif 1.15rem headers, chevron rotates brand when open; spec table rows `border-b border-hairline-2`, first col `type-mono-meta text-ink-faint w-2/5`.
- Related rail: serif `type-heading-02` head + link-arrow; 4-col card rail.

### 5.7 Cart (RD-07) — `header.js` `CartDrawer` styles applied to the page

Restyles: `cart/page.tsx`, `cart/_components/{cart-view,cart-loading-skeleton,cart-line-actions,cart-checkout-form,cart-recommendations}.tsx`, `cart/error.tsx`. **No drawer — restyle the existing page. Keep Server Actions, discount allocations display (BULK-07), optimistic states.**

- Lines: `flex gap-3.5 py-5 border-b border-hairline`; 76px `rounded-lg` thumb; serif 1.05rem name; `type-mono-meta text-ink-faint` variant/meta line; bold line total; pill qty stepper; remove = `type-mono-meta text-ink-faint hover:text-gold-deep`.
- Discounts: `text-brand` savings lines (was success-\*).
- Summary (`.cart__foot`): `bg-card border-t border-hairline`; subtotal row serif 1.5rem; mono freight note with truck icon; full-width `brand` lg checkout button.
- Empty state: centered leaf, muted copy, ghost "Browse teas" button.
- Skeleton mirrors new structure (classes must keep `cart-view.test.tsx` assertions in sync).

### 5.8 Search (RD-07) — reuse collection styling

Restyles: `(storefront)/search/page.tsx`, `search/{search-results-view,search-filter-panel,search-pagination,search-sort-select}/*`. Hero: paper (or green-deep) band with Eyebrow "Search" + serif query heading + mono result count; facets/sort/chips/grid identical to PLP specs; pagination: pill buttons, active `bg-brand text-paper`. **Keep URL-param state, facets, Searchanise data flow (SEARCH-02/03).**

### 5.9 Blog / Tea Journal (RD-07)

Restyles: `blogs/[blog]/[article]/page.tsx`, `blogs/[blog]/_components/listing-page.tsx`, `blog/*`, `blog/portable-text/portable-text.tsx`, `lib/shopify/html-content.ts`.

- Listing: `.jcard` treatment; hero band per `.coll__hero` (tone `brand`); tag pills.
- Article: `max-w-prose` (compact container); serif headings scale; `type-mono-meta` category/date row (brand category); body `text-ink-soft` 1.02rem/1.6; blockquotes serif italic with gold accents; tables per `.spectable`.
- `html-content.ts` + `portable-text.tsx`: pure class-map swap to new tokens (sanitization untouched).

### 5.10 Wholesale + static pages (RD-07) — `supporting-pages.js`

Restyles: `pages/wholesale/_components/*`, `pages/contact/_components/*`, `pages/our-story/_components/*`, `pages/certifications/_components/*`, `pages/custom-tea-blends/_components/*`, `pages/[...slug]/_components/*`.

- Page hero pattern: `.coll__hero` (tone `brand`, Eyebrow, display max-w-16ch, ≤54ch copy).
- Wholesale: benefits list (`.split__list` rows + brand icons) + cert pills left; card-surface application form right (`.field` styles, `brand` lg submit). **Keep form actions/validation/rate limits.**
- Contact: `.help` pattern (see homepage Contact).
- Our story: `.split` two-col with values Eyebrow ("Mindfulness · Sincerity · Wholesomeness"), cert pills, `brand` CTA.
- Generic `[...slug]`: hero + compact prose body via restyled `html-content.ts`.

### 5.11 Error / empty / loading states (RD-07)

`app/error.tsx`, `global-error.tsx`, `not-found.tsx`, `cart/error.tsx`: paper bg, serif heading, muted copy, `brand`/`secondary` buttons. Skeletons: `bg-paper-2` shimmer blocks on `rounded-lg`.

---

## 6. Do NOT change (behavior contracts)

1. Cart Server Actions (`src/lib/cart/actions.ts`), cookie cart, `useAddToCart` pending/success/error/refresh flow.
2. Quick-add eligibility contract: `variants(first: 2)` minimal fields; multi-variant → Quick View/PDP (CQA-02/03); no per-card purchase-form hydration.
3. Bulk savings data flow + conditional render (BULK-01..05); tier selection/quantity validation.
4. Searchanise API search: URL-param state, facets, pagination, suggestions (SEARCH-01..07); PDP Searchanise recommendations loading.
5. PLP payload bounds and lazy client islands (AUDIT-06).
6. Footer link labels/hrefs (incl. `https://mrtea.com.au/account/login`), newsletter/contact Server Actions, honeypot + rate limiting.
7. noindex controls (`withNoindexRobots`, robots, sitemap) and JSON-LD via `serializeInlineJson`.
8. Accessibility: skip-link, landmark structure, aria-live announcements, `min-h-11` touch targets, `motion-reduce:` guards on all animation/zoom, focus-visible rings.
9. `sanitize-html` pipeline in `html-content.ts` (classes only change).
10. Test commands and contract scripts continue to pass — update assertions in lockstep, never delete coverage.

## 7. Lockstep files (must change together with the thing they assert)

| Trigger                          | Update                                                                                                                                                                                             |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------- |
| Button base/variants/sizes       | `scripts/component-contracts/button-system.test.mjs` (`rounded-md` count → `rounded-full`, sm size string, `inverseSecondary`), `button.stories.tsx` (`var(--tv-bg-inverse)` → `var(--color-ink)`) |
| `@theme` token swap              | `.storybook/preview.ts` backgrounds (`var(--tv-bg-canvas                                                                                                                                           | surface)`→`var(--color-paper | card)`) |
| Card/cart h3 styling             | `product-card.test.tsx`, `cart-view.test.tsx` (h3 class-string assertions)                                                                                                                         |
| PLP list borders                 | `product-list.test.tsx` (`border-subtle` → `border-hairline-2`)                                                                                                                                    |
| Image hover zooms                | keep `motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100` on every `group-hover:scale` line (contract-tested in 5 files)                               |
| Homepage CTAs                    | keep `variant="brand"` in hero + `variant: 'inverseSecondary'` in `content.ts` (contract-tested)                                                                                                   |
| Old-token deletion (final sweep) | `docs/conventions.md` + `AGENTS.md` token examples; `no-section-root-tone-class` `text-on-brand` regex → `text-paper`                                                                              |
