---
name: Teavision
description: Australia's leading wholesale tea supplier — authoritative, warm, precise.
colors:
  background: "#f5f0e8"
  surface: "#ede8de"
  surface-warm: "#e8ddd5"
  surface-sage: "#d8e2d0"
  border: "#d4c9b0"
  primary: "#526043"
  primary-hover: "#415234"
  text: "#3d3d35"
  text-muted: "#5e5d4f"
  destructive: "#8b4a42"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 3vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  default: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.default}"
    padding: "8px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.background}"
    rounded: "{rounded.default}"
    padding: "8px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.default}"
    padding: "8px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.default}"
    padding: "8px 20px"
---

# Design System: Teavision

## 1. Overview

**Creative North Star: "The Provenance Merchant"**

The Teavision design system is a merchant's catalog that respects its reader. The aesthetic is built from the raw material up: sand and sage aren't decorative choices — they're what tea looks like before it's brewed. The palette reads like dried herbs laid on aged paper, the type is clear and authoritative without ceremony. Nothing is here for show. Every element either carries information or stays out of the way.

This is a B2B supplier that has served St. Ali, Remedy Drinks, and 1,000+ businesses. The design earns confidence through specificity: real certification marks, named origins, actual testimonials from actual businesses. No lifestyle photography abstractions, no wellness-brand softness. The warmth comes from the materials themselves, not applied as a veneer.

The system refuses four aesthetic families: the artisan craft-tea hipster register (kraft paper, hand-stamped texture, overworked provenance theater), clinical wellness white (mint green accents, molecule graphics, pharmaceutical sterility), mass-market grocery commodity energy (primary-color banners, coupon typography, supermarket shelf logic), and the generic B2B SaaS template (pricing grids, feature checkmarks, star-rating carousels with headshots). What remains is a serious supplier's interface: grounded, warm, and precise.

**Key Characteristics:**
- A tonal stack of dried-botanical neutrals: sand, linen, straw, sage — no cold grays anywhere
- Single Geist typeface throughout; hierarchy through weight and scale, not font switching
- Flat surfaces with depth from tonal layering, no decorative shadows
- One primary accent (Dried Sage green) used sparingly: CTAs, active states, sale signals
- Touch-target-aware interactive elements; WCAG AA with visible sage focus rings throughout

## 2. Colors: The Dried Botanical Palette

The palette reads as a single dried-botanical family: warm sand grounds every surface; sage green carries action and growth signals; terracotta marks errors and urgency. No cold gray appears anywhere in the system.

### Primary
- **Dried Sage** (`#526043`): The single action color. Primary buttons, active nav states, sale badge text, hover borders on product cards. Used sparingly — its restraint is the point. This color means "do something." (5.4:1 contrast on background — WCAG AA compliant.)
- **Deep Sage** (`#415234`): Hover and pressed states for primary actions only. One step darker on the same sage hue; never appears independently.

### Neutral
- **Sun-Dried Parchment** (`#f5f0e8`): Page background. The base layer — every other surface sits above it.
- **Aged Linen** (`#ede8de`): Cards, product card backgrounds, input backgrounds. The first step up from the base.
- **Warm Bisque** (`#e8ddd5`): Warm surface variant. Out-of-stock badge background; signals diminished state without aggression.
- **Pale Herb** (`#d8e2d0`): Sage-tinted surface. Sale badge background; subtly signals discount through a cooler, herb-family green.
- **Harvest Straw** (`#d4c9b0`): Borders, dividers, "new" badge background. The structural line color — never decorative.
- **Dark Earth** (`#3d3d35`): Primary body text. Almost-black with a warm olive tint; never pure `#000`.
- **Dusty Stone** (`#5e5d4f`): Secondary text, placeholders, ghost button text, muted labels. (5.4:1 contrast on background — WCAG AA compliant.)

### Tertiary
- **Terracotta** (`#8b4a42`): Errors, out-of-stock badge text, remove-item actions. Warm red-brown; urgent without being alarming.

### Named Rules

**The Dried Botanical Rule.** Every neutral in this system has a warm tint toward ochre or sage (H 80–140). There are no cool grays. If a neutral reads as charcoal, slate, or cool gray, it's wrong — rework with chroma raised toward the yellow-green family.

**The One Accent Rule.** Dried Sage (`#6b7c5a`) appears on ≤15% of any given surface. Its job is to mean "action." If it's everywhere, it means nothing. Decorative sage touches are prohibited.

## 3. Typography

**Display / Body Font:** Geist (system-ui, sans-serif fallback)

**Character:** Geist is Vercel's variable sans-serif: geometric precision with enough warmth in the rounded terminals to avoid clinical coldness. A single-family system reinforces the merchant's pragmatism — no decorative display font, no serifs added for character. Hierarchy is built from weight and scale alone, which suits a product catalog that prizes clarity over atmosphere.

### Hierarchy
- **Display** (400 weight, clamp(2.5rem, 6vw, 3.75rem), lh 1.1, -0.02em tracking): Hero headlines and campaign-scale headings. Moderate weight, tight tracking. Never bolded to 700+ at display size.
- **Headline** (600 weight, clamp(1.375rem, 3vw, 1.875rem), lh 1.25, -0.01em tracking): Section headings, page titles, collection names.
- **Title** (500 weight, 1.125rem, lh 1.4): Product names in cards, sub-section headers, sidebar labels.
- **Body** (400 weight, 1rem, lh 1.6): Long-form paragraphs, product descriptions, blog copy. Max line length 65–75ch. `text-wrap: pretty` is set globally for orphan prevention.
- **Label** (600 weight, 0.65rem, lh 1, 0.05em tracking, uppercase): Badges, category chips, certification marks, trust-bar items. All-caps treatment is for labels only — never apply to headings or paragraphs.

### Named Rules

**The Single Voice Rule.** One font family at all sizes. Don't add a serif display font for "warmth" or a mono font for "technical credibility." Geist carries every role. Atmosphere comes from the palette, not font switching.

**The Weight Ladder Rule.** Use weight steps of at least 100 between adjacent hierarchy levels (400 body → 500 title → 600 headline). Avoid the flat-scale trap of all-medium-weight text at slightly different sizes.

## 4. Elevation

This system is flat by default. No decorative shadows exist in the codebase, and none should be introduced. Depth is communicated entirely through tonal layering: Sun-Dried Parchment (base) → Aged Linen (card surface) → Warm Bisque / Pale Herb (raised surface variants). Interactive state is communicated through border-color shifts, not shadow lifts.

Focus rings are the one exception: visible sage-tinted focus outlines (`box-shadow: 0 0 0 2px #f5f0e8, 0 0 0 4px #6b7c5a`) appear on all keyboard-focusable elements. These are accessibility affordances, not decoration.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow on a card is not atmospheric polish; it's visual noise that breaks the material language. If an element must communicate elevation (a dropdown, an overlay), use the tonal stack and a subtle border — not a `box-shadow`.

## 5. Components

### Buttons

Three variants, three sizes, no decorative flourishes. Shape is consistently a small radius (4px) — enough to soften the corners without reading as pill-shaped. Color transitions only (150ms ease); never scale or translate transforms on click.

- **Shape:** Gently squared (4px radius)
- **Primary:** Dried Sage fill (`#6b7c5a`), Sun-Dried Parchment text (`#f5f0e8`). Padding: sm 14px/6px, md 20px/8px, lg 28px/12px.
- **Hover:** Deep Sage fill (`#5a6b4a`); no transform.
- **Focus:** `outline: none; box-shadow: 0 0 0 2px #f5f0e8, 0 0 0 4px #6b7c5a`
- **Secondary:** Sage border + text, transparent fill. Hover: Aged Linen fill.
- **Ghost:** Dusty Stone text, transparent, no border. Hover: Aged Linen fill. For low-priority actions: "View all."
- **Disabled / Loading:** 50% opacity, `cursor: not-allowed`. Loading shows a spinning SVG inline before the label.

### Badges

Compact status labels: always uppercase, 0.65rem, semibold, 0.05em tracked. Three variants, always positioned top-left on product card images.

- **Sale:** Pale Herb background (`#d8e2d0`), Deep Sage text (`#5a6b4a`). Discount signal in the sage family.
- **Out of Stock:** Warm Bisque background (`#e8ddd5`), Terracotta text (`#8b4a42`). Muted; visible without being emphasized.
- **New:** Harvest Straw background (`#d4c9b0`), Dusty Stone text (`#7a7868`). Neutral, for recently added products.

### Cards / Product Cards

The core browsing unit on collection pages. Image-first, title, price. No description excerpts, no hover-reveal panels, no nested cards.

- **Corner Style:** Gently squared (4px)
- **Background:** Aged Linen (`#ede8de`)
- **Image Area:** Harvest Straw (`#d4c9b0`) as placeholder; square aspect ratio (1:1)
- **Border:** 1px Harvest Straw at rest → 1px Dried Sage on hover. No shadow at any state.
- **Focus:** Sage focus ring identical to buttons.
- **Body Padding:** 12px
- **Title:** Dark Earth, 14px/500 weight, single-line truncation on overflow with underline on hover.
- **Price:** Dark Earth, tabular-nums. Sizes: sm (14px), md (16px), lg (20px/semibold).

### Price Display

Two modes: simple (single price, Dark Earth, tabular-nums) and sale (compare-at in Dusty Stone with strikethrough, current price in Dried Sage). Both use `tabular-nums` for column alignment in product grids.

### Navigation (Header)

Minimal horizontal nav at page top. The brand mark ("Teavision") is semibold text — no logomark yet. Wholesale link receives priority treatment as the primary B2B conversion entry point.

- **Background:** Sun-Dried Parchment (`#f5f0e8`)
- **Border:** 1px Harvest Straw bottom border
- **Brand mark:** 16px/600 weight, Dark Earth
- **Nav links:** 14px/400 weight, Dark Earth; underline on hover
- **Wholesale link:** 500 weight or Dried Sage color — always visually distinct as the B2B entry point
- **Focus rings:** Consistent sage ring on all interactive elements

## 6. Do's and Don'ts

### Do:
- **Do** use the tonal stack for depth: Sun-Dried Parchment (base) → Aged Linen (card) → Warm Bisque or Pale Herb (raised). Never introduce a cool neutral that breaks the botanical warmth.
- **Do** lead with specifics: certification names (HACCP, ACO Organic), real origin countries, named clients (St. Ali, Remedy Drinks, MOOD Tea). Vague quality claims are visually and strategically inert.
- **Do** treat the Wholesale CTA as a primary action on every surface where it is contextually relevant — equal to or more prominent than Add to Cart.
- **Do** use `tabular-nums` on all price displays, even single-price contexts, for column alignment in grids.
- **Do** ensure all keyboard-focusable elements have visible sage focus rings (`box-shadow: 0 0 0 2px #f5f0e8, 0 0 0 4px #6b7c5a`).
- **Do** cap body copy at 65–75ch line length and apply `text-wrap: pretty` globally.
- **Do** reserve the uppercase/tracked label style (0.65rem, 0.05em) for badges, certification marks, and category chips — not headings.

### Don't:
- **Don't** use artisan craft-tea aesthetics: hand-stamped texture overlays, kraft paper backgrounds, overworked provenance theater, or rough-hewn display typography. This is a serious industrial supplier, not a farmers' market stall.
- **Don't** use clinical wellness white: white or near-white page backgrounds with mint or sage accents, floating icon illustrations, pharmaceutical-sterile layouts.
- **Don't** use mass-market grocery commodity energy: primary-color banners, coupon-style typography, sale badges that mimic supermarket shelf tags.
- **Don't** apply generic B2B SaaS templates: pricing tables with feature-grid checkmarks, testimonial carousels with headshots and star ratings, hero metric blocks (big number, small label, gradient accent).
- **Don't** introduce a second typeface for atmosphere. Geist carries every role. Serifs-for-warmth or mono-for-technical-credibility both break the Single Voice Rule.
- **Don't** add `box-shadow` to cards, list items, or content containers. The system is flat. Depth comes from tonal layering.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any element. Use a background tint from the tonal stack instead.
- **Don't** use gradient text (`background-clip: text` with a gradient fill). Sale prices and accent text are Dried Sage (`#6b7c5a`) solid.
- **Don't** remove the footer's keyword links for visual cleanliness. They are SEO traffic infrastructure and a hard requirement for the migration.
