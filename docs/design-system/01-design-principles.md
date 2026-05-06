# Design Principles & Brand Direction

## The brief in one line

A modern, minimal rebrand of Teavision — Australia's B2B wholesale tea, herb, and spice supplier — designed to feel like a trusted partner to cafés, restaurants, and F&B procurement teams worldwide.

---

## Who we're designing for

**Primary:** Wholesale buyers — café owners, F&B procurement managers, restaurant operators, private-label brand owners, international distributors.

**Secondary:** End consumers and curious browsers who arrive via SEO and may eventually become wholesale customers.

What both groups need from the site:
- **Confidence** that Teavision is a serious, certified, established supplier
- **Clarity** about what's available and how to get it
- **A frictionless path to talking to a human** — most buying decisions start with an inquiry, not an "add to cart"

What they do **not** need:
- Consumer-style urgency (countdown timers, "only 3 left," gimmicks)
- Decorative illustration that obscures the product range
- Heavy onboarding before they can browse

---

## Design principles

### 1. Quiet authority

The system should feel like a long-established supplier, not a startup. That means: restrained type, generous whitespace, small radii, hairline borders, muted color outside the brand moments. The brand doesn't shout — it earns trust by being legible, complete, and consistent.

### 2. One CTA per moment

Every page section answers one question and points to one next step. "Talk to our experts" is the dominant CTA across the site — design it as a single, repeated, confident action, not five competing buttons.

### 3. Catalog-first, story-second

Buyers want to see the range. Don't bury the catalog behind editorial. Hero → category grid is acceptable on the homepage; novella-length brand storytelling is not. Reserve long-form for blog posts and the About page.

### 4. Specs over adjectives

Wholesale buyers pick by attribute (origin, organic status, pack size, caffeine, blend ingredients, certifications). Surface those facts in product cards and product pages — don't hide them behind marketing copy.

### 5. Trust is a system, not a badge

Trust comes from cumulative signals: certifications visible on cards, supply-chain transparency, real testimonials with attributable customers (St. Ali, Buy Organics Online), accessible compliance pages (GDPR, APPI, PIPEDA), and a clear path to a real human. The design system makes those signals first-class — not afterthoughts in a footer.

### 6. Restrained color, generous space

Two ground rules: at most one accent color per surface, and a minimum 32px of breathing room around any block of content on desktop. The site should feel uncluttered even on a 1000-product catalog.

### 7. Accessibility as default

WCAG 2.2 AA across the system. Color contrast, focus rings, keyboard support, and reduced-motion preferences are baked into tokens and components — not decisions component authors have to remember.

---

## Brand direction

### Mood

Calm, confident, premium-but-approachable. References (for mood, not visual copying): **Aesop** (restrained editorial), **Verve Coffee Roasters trade pages** (B2B clarity), **Postcard Teas** (specialist credibility), **Hario** (utility + craft), **Pact Coffee wholesale** (wholesale-account flow done well).

### Voice and tone

- **Confident, not boastful.** "Australia's leading bulk loose-leaf tea supplier" is fine; superlatives like "best ever" are not.
- **Knowledgeable, not academic.** Plain English. Define jargon when it's used (e.g., FBOP, OP1, BOP grades — show a tooltip rather than assuming the reader knows).
- **Hospitable.** The reader is a peer, not a target. "Talk to our experts" not "Submit your inquiry now."
- **Specific.** Real numbers (1,000+ products, 15+ years), real names (testimonial customers), real certifications.

### What we avoid

- Tea-clichés: floral filigree, watercolor leaves, hand-lettered serifs, tea-cup-with-steam illustrations
- Excessive capitalization in headlines
- Stock photography of people drinking tea
- Visual treatments that imply "wellness lifestyle brand" — Teavision is a supplier, not a wellness brand
- Patronizing copy directed at consumers in a B2B context

---

## Color philosophy

We use color in three layers:

1. **Brand surfaces** — deep "Steep" green carries the brand identity. Used sparingly: hero sections, brand moments, the mark itself.
2. **Action** — near-black ink is the workhorse of primary buttons and high-contrast actions. This is intentional: a black button feels more confident, more universal, and more wholesale-appropriate than a saturated brand-green button.
3. **Accent** — a warm amber appears on certification badges, "limited" tags, and other small moments of energy. Never on full surfaces.

Status colors (success, warning, danger, info) live outside the brand palette and are slightly desaturated so they read as functional, not decorative.

A dark theme is included as a system-respecting option (and for image-overlay surfaces), but light is the default.

---

## Typography philosophy

Two faces, used for different jobs:

- **Display: a refined modern serif** (we'll spec **Fraunces** — open-source, variable, includes a "soft" axis that fits the warm-but-modern brief). Used for headlines, hero, editorial moments. **Never below 24px.**
- **Text: a neutral humanist sans-serif** (**Inter** — system-friendly, ubiquitous, free, accessible). Used for everything else: body, UI, navigation, captions.

A monospace face (**JetBrains Mono**) appears only in: SKUs, order numbers, batch codes, technical specs in tables.

We do not use the brand serif for body text. Period. Body type stays sans for legibility on data-heavy pages.

---

## Spacing philosophy

A 4-pixel base unit, multiplied by a familiar scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128). Use the **smallest spacing that works** — when in doubt, spec one step smaller, not one step larger.

The most common spacing values across the system are `8`, `16`, `24`, and `32`. If you find yourself reaching past `48` inside a component, it's probably the wrong unit of layout (move to section-level spacing instead).

---

## Motion philosophy

Motion is functional, not decorative. Three durations cover 95% of cases:

- **150ms** — micro-interactions (hover, focus, button press)
- **200ms** — element entrances/exits (toasts, popovers, dropdowns)
- **300ms** — modals, drawers, page-section reveals

Easing is `cubic-bezier(0.2, 0, 0, 1)` (a gentle ease-out) for entrances and `cubic-bezier(0.4, 0, 1, 1)` (ease-in) for exits. Avoid bouncy/spring easing — it conflicts with the calm-authority tone.

All non-essential motion is suppressed under `prefers-reduced-motion: reduce`.

---

## Content rules baked into the system

- Product cards show: image, name, certification badge (if any), origin (where applicable), pack-size note. No public price — wholesale-gated.
- The phrase "Add to cart" is replaced with **"Add to quote"** on product pages where pricing is gated.
- Testimonials always carry: customer name, business name, photo (or business logo), and verifiable context.
- Certifications (Organic, FairTrade, etc.) appear as badges next to the relevant entity (product, collection, supplier), not as a generic "trust strip."
- All forms include a privacy/data-handling note adjacent to the submit button.

---

## Component priorities for v1

Given the B2B context, these components carry more weight than they would in a typical D2C system:

- Inquiry / "Request a Quote" form
- Wholesale-account-request flow (multi-step form)
- Spec / data tables (tea grades, pack sizes, lead times)
- Mega menu (12 collections)
- Stat block (trust signals)
- Testimonial card (with verifiable attribution)
- Catalogue download card
- Certification badge
- FAQ accordion
- Article card (Tea Journal)

These are kept first-class in `03-components.md`, with the standard primitives (button, input, badge, etc.) underneath.
