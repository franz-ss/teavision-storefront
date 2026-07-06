# Phase 22: Storefront Data and Rendering - Context

**Gathered:** 2026-07-02T12:49:10.4036486+08:00
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 22 fetches the Sanity `homePage` singleton through a typed server-side storefront data boundary and renders it through the existing `/` homepage design with visual, SEO, image, and commerce parity. It covers DATA-01, DATA-02, RENDER-01, RENDER-02, and QUALITY-01.

This phase does not add preview, webhook revalidation, release evidence, page-builder/reordering behavior, Shopify commerce data ownership, or rollout/no-regression gating. Those remain Phase 23 or later scope.

</domain>

<decisions>
## Implementation Decisions

### Fallback and Cutover Behavior
- **D-01:** No runtime fallback. If the Sanity `homePage` singleton is missing or invalid, `/` must fail loudly instead of rendering hidden static or section-level fallback content.
- **D-02:** Missing or invalid CMS content fails at request-time route render. Do not add hidden fallback routing behavior.
- **D-03:** Runtime validation should be lean: require the document and render-critical fields, especially SEO basics, required links, image asset URLs, and image dimensions. Trust the Sanity schema for detailed count, length, and editor-input rules.
- **D-04:** The current static homepage content may be kept as test/story fixture data, but not as runtime fallback code or a second live homepage implementation.

### SEO Field Ownership
- **D-05:** Sanity owns homepage metadata fields for Phase 22: title, description, canonical, and noIndex. Organization/WebSite JSON-LD stays code-owned.
- **D-06:** Existing launch noindex controls still win. CMS `seo.noIndex` is page-level intent, but generated metadata must still pass through the existing noindex helper so global launch controls are not weakened.
- **D-07:** Missing required Sanity SEO fields fail the route. Do not keep hardcoded SEO constants as route fallback values.
- **D-08:** Homepage canonical path must stay `/` for Phase 22. Any other canonical value is invalid for this phase.

### Section Mapping Depth
- **D-09:** Every content field already modeled in Phase 21's `homePage` schema should drive rendering in Phase 22.
- **D-10:** Forms/actions and decorative motif assets stay code-owned. Newsletter/contact Server Actions, carousel behavior, and floating ornament images are not editor-owned content.
- **D-11:** Prop-enable the existing homepage components in place with typed content props. Do not create parallel CMS-only section components.
- **D-12:** Section order stays fixed in code, matching the existing homepage and Phase 21 schema order. Do not prepare a page-builder or future reordering abstraction in this phase.
- **D-13:** Tea Journal uses CMS section configuration plus live blog posts. Homepage CMS controls intro, blog handle, link label, and max posts; article data continues to come from the existing blog query.

### Sanity Image Rollout and Hero LCP
- **D-14:** All modeled authored homepage images move to Sanity in Phase 22, including the hero LCP image.
- **D-15:** Preserve the current hero LCP discipline exactly: `next/image`, stable dimensions, `preload`, `fetchPriority="high"`, `sizes="100vw"`, and no deprecated `priority` prop.
- **D-16:** Required Sanity images must have usable asset URL and dimensions. Missing image data fails `/`; do not guess dimensions, skip sections, or fall back to static images.
- **D-17:** Respect Sanity crop/hotspot inside existing layout constraints. Keep current aspect ratios, fill behavior, card dimensions, and section geometry.
- **D-18:** Decorative motif assets such as newsletter teapot/label, business-handshake/stamp, and catalogue cup/stamp stay code-owned.

### Agent Discretion
None. The user explicitly selected decisions for every discussed area.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Scope
- `.planning/ROADMAP.md` - Phase 22 goal, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` - v1.6 requirements DATA-01, DATA-02, RENDER-01, RENDER-02, and QUALITY-01.
- `.planning/PROJECT.md` - Project constraints, current milestone context, and key decisions including no SEO/PageSpeed regression.
- `.planning/phases/21-sanity-homepage-model-and-seed/21-01-SUMMARY.md` - Direct dependency: Phase 21 schema and seed decisions.
- `docs/conventions.md` - Folder map, naming rules, component anatomy, section layout, and animated decorative media conventions.

### CMS Schema and Seed Data
- `../teavision-cms/schemaTypes/documents/home-page.ts` - `homePage` singleton fields and fixed section order.
- `../teavision-cms/schemaTypes/objects/homepage/hero.ts` - Hero content model including image, trust marks, and proof points.
- `../teavision-cms/schemaTypes/objects/homepage/image-card.ts` - Product/service image card model.
- `../teavision-cms/schemaTypes/objects/homepage/link.ts` - Safe homepage link validation.
- `../teavision-cms/schemaTypes/objects/homepage/section.ts` - Reusable section intro model.
- `../teavision-cms/schemaTypes/objects/homepage/testimonial.ts` - Testimonial model.
- `../teavision-cms/schemaTypes/objects/homepage/faq.ts` - FAQ item model.
- `../teavision-cms/scripts/seed-home-page/data.ts` - Current homepage seed snapshot and field parity source.

### Storefront Route and Data Boundaries
- `src/app/(storefront)/page.tsx` - Current homepage composition, metadata, JSON-LD, and form action wiring.
- `src/lib/sanity/client.ts` - Published Sanity server client, `sanityFetch`, and image URL builder.
- `src/lib/sanity/env.ts` - Required Sanity runtime env helpers.
- `src/lib/sanity/types.ts` - Existing handwritten Sanity result types.
- `src/lib/sanity/queries/blog.ts` - Current GROQ field fragments and homepage blog posts query.
- `src/lib/blog/operations.ts` - Existing Sanity blog operations, cache tags, and `getHomepageArticles`.
- `src/app/api/webhooks/sanity/route.ts` - Existing signed Sanity webhook and cache tag invalidation pattern.

### Homepage Rendering Components
- `src/components/homepage/content.ts` - Current static content source; may become fixture data only, not runtime fallback.
- `src/components/homepage/hero/hero.tsx` - Current hero LCP rendering discipline.
- `src/components/homepage/product-range/product-range.tsx` - Product range section and overlay card usage.
- `src/components/homepage/overlay-image-card/overlay-image-card.tsx` - Card image layout and aspect-ratio constraints.
- `src/components/homepage/newsletter/newsletter.tsx` - Newsletter section, decorative motifs, and form leaf.
- `src/components/homepage/private-label/private-label.tsx` - Service card section.
- `src/components/homepage/organic-herbs/organic-herbs.tsx` - Full-bleed background image section.
- `src/components/homepage/supply-chain/supply-chain.tsx` - Code-owned decorative motif section.
- `src/components/homepage/certification-coverage/certification-coverage.tsx` - Certification marquee labels/icons.
- `src/components/homepage/supply-chain-protection/supply-chain-protection.tsx` - Certification mark grid.
- `src/components/homepage/testimonials/testimonials.tsx` - Testimonials section.
- `src/components/homepage/testimonials/testimonials-slider.tsx` - Interactive carousel client leaf.
- `src/components/homepage/tea-journal/tea-journal.tsx` - Live blog-post homepage section.
- `src/components/homepage/faq/faq.tsx` - FAQ component already accepts content props.
- `src/components/contact/contact-section/contact-section.tsx` - Contact section and Server Action form wiring.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/homepage/*` - Approved homepage layout and visual design. Prop-enable these components rather than creating parallel CMS copies.
- `src/components/ui/Section`, `Eyebrow`, and `Button` - Existing section, label, and CTA primitives to preserve layout rhythm and token usage.
- `src/components/homepage/overlay-image-card/overlay-image-card.tsx` - Existing card geometry and image fill behavior for product/service image cards.
- `src/components/homepage/testimonials/testimonials-slider.tsx` and `src/components/homepage/newsletter/newsletter-form.tsx` - Client leaves that should remain isolated while parent sections stay server-rendered.
- `src/lib/blog/operations.ts` - Existing live Tea Journal data source, cache tags, and route helpers.

### Established Patterns
- Server Components fetch through typed operation/helper modules; shared presentational components receive typed props.
- Next.js 16 Cache Components are enabled. Cached reads should use `'use cache'`, `cacheTag()`, and `cacheLife()` only away from request runtime APIs.
- Sanity reads currently use the published perspective, `useCdn: false`, and `stega: false`.
- Metadata should continue through `withNoindexRobots()` so global launch controls are preserved.
- Class composition must use `cn()` and Tailwind token classes. Do not introduce raw hex/rgb values, CSS modules, inline styles, or cool gray palettes.
- Existing homepage composition keeps interactivity in leaf components. Do not add `'use client'` to the route or wrapper sections.

### Integration Points
- Add a typed homepage Sanity query and storefront operation around `homePage`.
- Update `/` to fetch the homepage singleton, fail on missing critical fields, and pass mapped content into existing section components.
- Preserve code-owned form actions: `sendNewsletterSignupAction` and `submitContactFormAction`.
- Preserve code-owned Organization/WebSite JSON-LD and decorative motif assets.
- Keep current static homepage content out of the live route path except as Storybook/test fixture data.

</code_context>

<specifics>
## Specific Ideas

- The user explicitly rejected runtime fallbacks and duplicate bulk homepage code.
- Recommendations should state why, but final decisions above are the locked user choices.
- The implementation should stay lean and honest: strict missing-content failure beats masking invalid CMS state.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 22-Storefront Data and Rendering*
*Context gathered: 2026-07-02T12:49:10.4036486+08:00*
