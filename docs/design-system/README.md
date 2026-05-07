# Teavision Design System

> Archived legacy reference. The live implementation source of truth is `app/globals.css`, with the daily design contract in `DESIGN.md`. Files in this folder preserve the earlier Figma/import package and may still mention dark themes, warning/info statuses, legacy aliases, and hex values that are no longer part of the runtime token surface.

A modern, minimal design system for the Teavision rebrand — Australia's B2B wholesale tea, herb, and spice supplier.

Built foundation-first, then components, all token-driven so design (Figma) and code (Tailwind) stay in lockstep.

**Brand summary:** Quiet authority over consumer flash. Deep "Steep" green carries the brand, near-black ink does the work of primary actions, warm cream warms every surface, a single amber accent reserves itself for moments of energy. Editorial serif headlines (Fraunces) paired with a neutral grotesque sans (Inter). Restrained components: small radii, hairline borders, soft elevation, motion measured in milliseconds.

## What's in here

| File                      | What it is                                                         | Who uses it                 |
| ------------------------- | ------------------------------------------------------------------ | --------------------------- |
| `01-design-principles.md` | Brand direction, voice, design principles                          | Designers, PMs, copywriters |
| `02-foundations.md`       | Token system: color, type, spacing, radius, elevation, motion      | Designers + engineers       |
| `03-components.md`        | 34 component specs: anatomy, variants, states, a11y                | Designers + engineers       |
| `04-figma-setup-guide.md` | Step-by-step guide to building the system in Figma                 | Designers                   |
| `tokens.css`              | Archived standalone token reference from the earlier Figma package | Historical reference        |
| `tokens-studio.json`      | Archived Tokens Studio import from the earlier Figma package       | Historical reference        |
| `preview.html`            | Archived single-file preview from the earlier token package        | Historical reference        |

## Quick start

**For designers (Figma — Free plan friendly):**

1. Read `01-design-principles.md` and `02-foundations.md` to understand the system.
2. Open `preview.html` in a browser to see tokens rendered.
3. Create a new Figma file. In Plugins → Browse plugins → install **Tokens Studio for Figma** (free).
4. In the plugin: **Tools → Load from JSON** → upload `tokens-studio.json` only if you need the archived v1 Figma package. For current runtime work, mirror `app/globals.css` instead.
5. Use `04-figma-setup-guide.md` to set up text styles, effect styles, and the page structure.
6. Use `03-components.md` as the spec for each component you build.

**For engineers:**

1. Treat `app/globals.css` as the implementation source of truth for Tailwind 4.
2. Use the semantic utility classes exposed there: `bg-canvas`, `bg-brand`, `text-default`, `text-on-brand`, `border-default`, `bg-action-primary`, `text-action-primary-text`, and the status tokens.
3. Treat `tokens.css`, `tokens-studio.json`, and `preview.html` as archived references only.
4. Do not add runtime dark mode, warning/info statuses, or removed aliases unless `app/globals.css` is intentionally expanded first.

**For review with Claude:**

- Build a chunk in Figma → screenshot or export the frame → paste in chat. I'll review against the spec and call out any drift.

## Naming conventions

Tokens use a **primitive → semantic** pattern.

- **Primitives** are raw values: `--color-green-700`, `--font-size-300`, `--space-4`.
- **Semantics** are usage-based: `--color-bg-primary`, `--color-text-default`, `--color-border-strong`.

Components only ever consume semantic tokens. Primitives exist so semantics can be re-pointed without breaking components.

## Versioning

**v1.0** (2026-04-30) — Foundations + components for launch. Future versions will add dataviz tokens, illustration guidelines, and richer motion patterns once the live build proves the system out.

## Site context this system was designed against

- **Audience:** wholesale buyers — café operators, F&B procurement, restaurant operators, private-label brand owners, international distributors.
- **Catalog:** ~1,000+ products across 12 main categories (e.g., Wholesale Bulk Tea, Herbs Spices & Botanicals, Speciality Blends, Cafe Range, Australian Native Tea, Organic Tea, Cocktail & Iced Tea, Functional Wellness, Bulk Tea Bag Packs, Tea Masters Selection).
- **Services:** custom blends, private label, tea-bag manufacturing, new-product development.
- **Pricing model:** wholesale-gated — products do not show public retail prices; primary action is "Request a Quote" or "Talk to our experts."
- **Trust pillars:** certifications (Organic), supply-chain transparency, named testimonials, 15+ years in market, downloadable catalogues.
