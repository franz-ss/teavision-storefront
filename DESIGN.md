---
name: Teavision
description: "Australia's B2B wholesale tea, herb, and spice supplier: quiet authority, warm precision."
colors:
  canvas: 'oklch(97.71% 0.0074 80.7)'
  surface: 'oklch(99.97% 0.0013 106.4)'
  surface-sunken: 'oklch(95.28% 0.0086 84.6)'
  brand: 'oklch(35.31% 0.0478 158.7)'
  brand-strong: 'oklch(22.76% 0.0238 167.1)'
  brand-subtle: 'oklch(96.93% 0.0058 153.8)'
  action-primary: 'oklch(16.88% 0.0044 84.6)'
  action-primary-hover: 'oklch(25.96% 0.0092 97.7)'
  action-primary-text: 'oklch(97.71% 0.0074 80.7)'
  text-default: 'oklch(25.96% 0.0092 97.7)'
  text-muted: 'oklch(42.35% 0.0066 95.2)'
  border-default: 'oklch(83.48% 0.0055 106.5)'
  accent: 'oklch(64.54% 0.1242 80)'
  danger: 'oklch(52.52% 0.1567 29.2)'
typography:
  display:
    fontFamily: 'Fraunces, Times New Roman, serif'
    fontWeight: 500
    letterSpacing: '0'
  body:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: '0'
  mono:
    fontFamily: 'JetBrains Mono, ui-monospace, monospace'
    fontWeight: 400
    letterSpacing: '0'
rounded:
  xs: '2px'
  sm: '4px'
  md: '6px'
  lg: '8px'
sources:
  implementation: 'app/globals.css'
  productContext: 'PRODUCT.md'
  legacyReference: 'docs/design-system/'
---

# Design System: Teavision

## 1. Purpose

This file is the short design-system contract for day-to-day work. Use it when designing, implementing, or reviewing storefront UI. The canonical implementation lives in `app/globals.css`; `docs/design-system/` is an archived legacy Figma/import reference and must not override this file; the brand and business strategy live in `PRODUCT.md`.

Teavision should feel like a precise wholesale supplier with deep product knowledge: botanical, practical, and quietly premium. The interface serves buyers who need to scan, compare, trust, and act quickly.

## 2. North Star

Teavision is a supplier at scale, not a lifestyle tea brand. Trust comes from specific evidence: certifications, origins, pack sizes, lead times, named customers, and clear access to a real team.

The visual language is warm and restrained. Product photography and ingredient variety carry the brand. Components should make the catalogue feel credible and easy to navigate, without drifting into craft-market rustic, clinical wellness, grocery discounting, or generic B2B SaaS.

## 3. Design Principles

- **Authority through specificity.** Prefer real claims over atmospheric copy: ACO Organic, HACCP, 1,000+ ingredients, 500+ certified organic, sourced from 15+ countries, serving 1,000+ businesses.
- **B2B conversion first.** Wholesale inquiry, account application, catalogue download, custom blend, and private-label paths must stay prominent on relevant surfaces.
- **Product range before decoration.** Let real products, origins, categories, and certification details do the visual work.
- **Warm precision.** Use botanical warmth, small radii, hairline borders, and calm spacing. Avoid cute, rustic, clinical, or coupon-like treatments.
- **SEO is structural.** Footer links, journal content, location pages, and collection architecture are traffic infrastructure, not visual clutter to remove casually.
- **Accessibility is a system rule.** WCAG AA contrast, keyboard focus, labels, reduced motion, and readable type are baseline requirements.

## 4. Token Model

Use Tailwind 4 CSS-first tokens from `app/globals.css`. Components consume semantic utilities, not raw primitive values.

Primary utility families:

- Surfaces: `bg-canvas`, `bg-surface`, `bg-surface-raised`, `bg-surface-sunken`, `bg-brand`, `bg-brand-strong`, `bg-brand-subtle`
- Text: `text-default`, `text-strong`, `text-muted`, `text-subtle`, `text-brand`, `text-accent`, `text-on-brand`
- Borders and focus: `border-subtle`, `border-default`, `border-brand`, `ring-ring`
- Actions: `bg-action-primary`, `hover:bg-action-primary-hover`, `text-action-primary-text`, `border-action-secondary-border`, `text-action-secondary-text`
- Status: `bg-success-bg`, `text-success-text`, `border-success-border`, `bg-danger-bg`, `text-danger-text`, `border-danger-border`
- Type: `font-display`, `font-sans`, `font-mono`, and the `type-*` utilities

Do not reintroduce legacy aliases from the previous system. Do not place raw hex, RGB, or ad hoc color values in `className`.

## 5. Color Roles

- **Canvas** is warm paper: `bg-canvas`.
- **Surfaces** are clean and calm: `bg-surface` for cards and inputs, `bg-surface-sunken` for recessed wells and placeholders.
- **Brand green** is for identity, botanical emphasis, links, brand sections, and selected states.
- **Primary actions** use near-black ink, not green. This keeps conversion controls distinct from brand decoration and gives them reliable contrast.
- **Amber** is the accent and focus color. Use it for focus affordances, certifications, and small moments of energy, not broad backgrounds.
- **Status colors** are functional. Use dedicated success and danger tokens rather than repurposing brand colors.

Neutral colors must stay warm or ink-based. If a new neutral reads as blue-gray, slate, or cold charcoal, it does not belong in this system.

## 6. Typography

Teavision uses a three-font system:

- **Fraunces via `font-display`** for hero headlines, editorial headings, and considered brand moments.
- **Inter via `font-sans`** for navigation, forms, product cards, body copy, dense UI, and all operational surfaces.
- **JetBrains Mono via `font-mono`** for SKUs, order numbers, codes, tables, and technical identifiers.

Use the provided type utilities where possible: `type-display-01`, `type-display-02`, `type-heading-01` through `type-heading-05`, `type-body-lg`, `type-body`, `type-body-sm`, `type-label`, `type-caption`, and `type-eyebrow`.

Type rules:

- Keep letter spacing at `0` except for compact uppercase labels such as `type-eyebrow`.
- Body copy should remain 16px or larger with comfortable leading.
- Long prose should stay near `65ch`.
- Do not use all-caps for headings or paragraph copy.
- Reserve mono for operational identifiers. Do not use it as generic "technical credibility."

## 7. Layout and Surfaces

The site should feel calm but useful, especially for wholesale buyers comparing information. Favor structured sections, clear information grouping, and enough density to support scanning.

Surface rules:

- Page backgrounds use `bg-canvas`.
- Page sections should be full-width bands or unframed layouts with constrained inner content.
- Cards are for repeated items, modals, popovers, and genuinely framed tools. Do not put cards inside cards.
- Product, article, testimonial, catalogue, and stat cards use small radii, warm borders, and restrained elevation.
- Use shadows sparingly and only from the existing shadow utilities. Do not use shadow as decoration.

Spacing rules:

- Inside components, prefer compact steps such as `gap-2`, `gap-3`, `gap-4`, and `p-4` to `p-6`.
- Between components, use stronger rhythm such as `gap-6`, `gap-8`, or `gap-12`.
- Between page sections, use generous section spacing, but keep the next section visible where a first viewport needs continuity.

## 8. Imagery

The product carries the brand. Use real product, ingredient, origin, facility, catalogue, or customer imagery wherever a surface depends on visual trust.

Avoid generic tea lifestyle shots, anonymous hands holding cups, stock wellness imagery, floating botanical illustrations, and dark atmospheric crops that hide the product. If an image is a product or process signal, the viewer should be able to inspect it.

All meaningful images need useful alt text. Decorative images should be hidden from assistive technology.

## 9. Component Rules

- **Buttons:** Use action tokens, `rounded-md`, visible `focus-visible` rings, and explicit transitions. One primary action per moment.
- **Icon buttons:** Use recognizable icons with accessible names and tooltips when the icon is not obvious.
- **Badges:** Keep them compact. Use uppercase labels for certifications, status, and short category signals only.
- **Product cards:** Image first, then product name, category/origin or pack note, certification where relevant, and a quote or detail action. Do not add marketing excerpts to dense catalogue grids.
- **Forms:** Labels must be visible or programmatically clear. Validation messages must connect to fields. Submit areas should include the privacy or data-handling note when collecting contact details.
- **Spec tables:** Use semantic table markup for tea grades, pack sizes, lead times, certifications, and bulk-order details. Numeric columns should align cleanly.
- **Header and footer:** Treat navigation and SEO links as conversion infrastructure. Do not simplify them away for visual neatness without replacing the lost path.

Compose `className` values with `cn()` from `@/lib/utils` whenever classes are conditional or merged.

## 10. Content Rules

Write for buyers who are deciding whether Teavision is credible enough to contact.

- Prefer specific proof over broad quality claims.
- Use "Talk to our experts", "Request a quote", "Apply for wholesale", and "Download catalogue" when they match the surface.
- Keep product and collection copy factual: origin, ingredient type, organic status, pack size, use case, grade, and preparation details.
- Do not use urgency patterns such as countdowns, fake scarcity, or supermarket sale language.
- Testimonials need attributable names, businesses, and context.

## 11. Accessibility and Motion

- Meet WCAG AA for text and meaningful UI states.
- Use `focus-visible:ring-ring` for keyboard focus.
- Respect `prefers-reduced-motion`. Non-essential animation should stop when reduced motion is requested.
- Decorative floating artwork should use the shared `AnimatedElement` primitive with generic motion variants, not content-specific animation components. Owning sections provide image source and dimensions so future CMS fields can drive the artwork without changing component names.
- Never rely on color alone for state or error communication.
- Hit targets should be at least 40px on touch surfaces.
- Animate only intentional properties: `color`, `background-color`, `border-color`, `box-shadow`, `opacity`, and occasional `transform`. Never use `transition-all` as a system rule.

## 12. Anti-Patterns

Do not introduce:

- Cool grays, blue slates, or monochrome SaaS palettes
- Kraft-paper, hand-stamped, rustic craft-tea treatments
- Clinical white wellness layouts, molecule graphics, or mint-accent pharma cues
- Mass-market grocery sale language, coupon tags, or loud discount banners
- Generic B2B SaaS sections such as feature-check grids, hero metric templates, and anonymous testimonial carousels
- Gradient text, decorative glassmorphism, side-stripe accents, nested cards, or decorative blobs
- Raw colors in component classes, CSS modules, styled-components, or inline style objects for ordinary styling

## 13. Review Checklist

Before shipping a new or changed UI surface, check:

- Does the surface make Teavision feel authoritative, warm, and precise?
- Are B2B actions visible where a buyer would naturally need them?
- Are tokens semantic and sourced from `app/globals.css`?
- Does the typography use the intended role utilities with readable line lengths?
- Are products, certifications, origins, or proof points surfaced before vague brand copy?
- Are focus states, labels, contrast, hit targets, and reduced-motion behavior handled?
- Does the layout avoid nested cards, decorative effects, and generic SaaS patterns?
