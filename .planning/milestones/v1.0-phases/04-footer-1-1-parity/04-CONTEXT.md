# Phase 4: Footer 1:1 Parity - Context

**Gathered:** 2026-05-29
**Status:** Ready for planning
**Source:** Direct user request plus live footer research

<domain>
## Phase Boundary

Copy the visible footer from `https://www.teavision.com.au/` into the Next storefront with close content, visual, and responsive parity. This phase is limited to the global storefront footer and its direct support data/components/stories. It does not redesign the footer, fix legacy domain choices, rebuild header navigation, or change unrelated page content.

</domain>

<decisions>
## Implementation Decisions

### Locked User Requirement

- D-01: The footer must be copied from `https://www.teavision.com.au/` 1:1.

### Parity Scope

- D-02: Preserve the live footer's visible content structure: Main Menu, Footer, Quality, Keep in Touch, bottom copyright/Popular Searches row, and payment method marks.
- D-03: Preserve visible link labels and href values, including external `https://mrtea.com.au/account/login`, `tel:1300729617`, `mailto:info@teavision.com.au`, root `/`, and the `/search` Popular Searches link.
- D-04: Preserve the live footer's dark top band, four-column desktop grid, two-column tablet grid, one-column mobile stack, newsletter row, quality certification image sizing, bottom payment row behavior, and hover underline behavior.
- D-05: Do not render the hidden keyword-link block in the headless storefront; implementation review removed it as non-visible keyword stuffing and kept the footer focused on user-facing navigation.

### Codebase Constraints

- D-06: Implement inside `src/components/layout/footer/` and keep `Footer` as a named export used by `src/app/(storefront)/layout.tsx`.
- D-07: Do not add `'use client'` to the footer wrapper. Push client interactivity down to a small leaf only if needed for newsletter feedback or Popular Searches behavior.
- D-08: Use Tailwind 4 utilities, existing `cn()` composition, and design tokens or new semantic theme tokens. Do not use raw hex/rgb values in `className`.
- D-09: Add Storybook coverage because the footer lives under `src/components/`.
- D-10: Do not touch the sibling Liquid theme; use it and the live site only as reference.

### the agent's Discretion

- Whether to keep the existing `sendNewsletterSignupAction` shape with `name="email"` or add a small compatibility mapper for the live Shopify field name is up to the executor, as long as the visible form is 1:1 and validation remains accessible.
- Whether payment marks live as inline SVG components in `footer.tsx` or a local `payment-icons.tsx` helper is up to the executor, as long as output is accessible and visually matches the live 38x24 icons.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents MUST read these before implementing.

### Live Footer Reference

- `https://www.teavision.com.au/` - canonical live footer source captured on 2026-05-29.
- `.planning/phases/04-footer-1-1-parity/04-RESEARCH.md` - extracted structure, CSS notes, links, and visual acceptance details.

### Local Code

- `src/components/layout/footer/footer.tsx` - current compact footer to replace.
- `src/components/layout/footer/index.ts` - footer barrel export.
- `src/app/(storefront)/layout.tsx` - layout that renders `Footer`.
- `src/lib/contact/actions.ts` - existing newsletter Server Action and validation.
- `src/components/ui/newsletter-signup/newsletter-signup.tsx` - existing client newsletter feedback pattern.
- `src/app/globals.css` - design tokens and Tailwind utilities.
- `docs/conventions.md` - folder, component, styling, and Storybook conventions.

### Next.js 16 Local Docs

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` - layout caveats and shared UI placement.
- `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` - Cache Components context if footer implementation touches cached data.

</canonical_refs>

<specifics>
## Specific Ideas

- Build static `FOOTER_COLUMNS`, `CONTACT_LINKS`, and `PAYMENT_METHODS` constants with `satisfies` typing.
- Use `Link` only for internal path/hash hrefs and `<a>` for external, `tel:`, and `mailto:` links.
- Add a semantic footer token set if exact live colors cannot be matched by existing tokens; use token utility classes instead of raw arbitrary hex classes.
- Verify visible main/footer/legal/contact labels match the live site.
- Use browser screenshots at desktop, tablet, and mobile after implementation; compare live footer and local footer side-by-side.

</specifics>

<deferred>
## Deferred Ideas

- Fixing the `mrtea.com.au` login domain question is deferred. It is intentionally preserved for 1:1 parity.
- Restoring the hidden SEO keyword link block is deferred unless there is an explicit product or SEO requirement to ship it.
- Rebuilding newsletter storage/integration beyond the existing server action is deferred.
- Redesigning the footer to match the newer botanical design system is deferred.

</deferred>

---

_Phase: 04-footer-1-1-parity_
_Context gathered: 2026-05-29 via direct request and live footer research_
