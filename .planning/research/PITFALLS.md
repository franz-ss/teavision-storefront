# Project Research - Pitfalls

**Milestone:** v1.6 Sanity CMS Homepage Integration
**Date:** 2026-07-02

## Release-Blocking Pitfalls

### SEO Or PageSpeed Regression

Risk: CMS images, metadata, preview markers, cache behavior, or missing fields reduce SEO or PageSpeed scores.

Prevention:

- Treat the v1.5 homepage PSI result as the baseline.
- Preserve current hero LCP image behavior until measured evidence approves a change.
- Require dimensions, `sizes`, bounded image widths, and LQIP guards.
- Keep static metadata fallbacks and noindex/canonical handling.
- Block rollout on any measured score drop.

### Hero LCP Regression

Risk: A CMS-authored hero image changes format, byte weight, aspect ratio, priority hints, or remote optimization behavior.

Prevention:

- Add Studio validation and editorial guidance for minimum dimensions and reasonable asset size.
- Query dimensions and use stable intrinsic size or aspect-ratio containers.
- Use the existing image URL builder with bounded widths and quality.
- Use exactly one supported critical-image strategy after checking Next 16 docs and v1.5 evidence.
- Re-run PageSpeed after the Sanity hero is live in preview.

### Stega Or Draft Content In SEO

Risk: Visual Editing source-map characters or draft content leak into title, meta description, OG tags, sitemap, robots, or JSON-LD.

Prevention:

- Published client uses `stega: false`.
- Metadata fetches force `stega: false` or clean values.
- Draft Mode overlays render only when draft mode is enabled.
- Do not add Visual Editing until Draft Mode and published rendering are verified.

### Cache Cross-Contamination

Risk: Draft responses are cached under published tags, or published pages fail to update after Sanity publish.

Prevention:

- Keep published `getContent()` cached and tagged.
- Add separate draft-aware fetch behavior when preview is built.
- Use `revalidateTag()` from the webhook route for home tags.
- Keep `updateTag()` out of route handlers.
- Test the webhook payload parser and tag selection.

### Free-Form Page Builder Scope Creep

Risk: Editors gain arbitrary section ordering/style controls, increasing implementation and visual QA complexity.

Prevention:

- Use one singleton with fixed section fields.
- Use enable/disable toggles only if approved.
- Use enum variants tied to existing components.
- Defer arbitrary section arrays.

### Schema Name Collisions

Risk: Short filenames inside `objects/homepage/` are good, but Sanity object `name` values are global and can collide.

Prevention:

- Keep file names folder-scoped.
- Use schema `name` values with a compact namespace where needed, such as `homeHero`.
- Add schema registration tests.

### Silent Static Fallback After Cutover

Risk: Missing or malformed Sanity data quietly falls back to old constants, hiding CMS failures and causing drift.

Prevention:

- Allow static fallback only behind an explicit migration/rollout decision.
- After cutover, fail clearly if the singleton is missing.
- Keep fixtures for tests and Storybook, not hidden production behavior.

### Webhook Logging Leaks

Risk: Route logs raw webhook bodies or unpublished content.

Prevention:

- Log document type, accepted/rejected status, and booleans only.
- Never log body, signature, token, secret, or draft field values.

### Studio / Storefront Drift

Risk: The sibling Studio and storefront disagree on field names or route mappings.

Prevention:

- Add schema tests.
- Add app reshaper tests using representative Sanity-shaped fixtures.
- Keep Presentation route resolver `/` mapped to the singleton if Visual Editing is added.

## Non-Blocking Watch Items

- `imageWithAlt` currently requires alt text. The current hero image uses empty alt because it is decorative. Decide whether the homepage hero should be meaningful and require alt, or whether a specific decorative-image object/field is needed.
- Existing `seo` canonical validation only allows `/blogs/`. Widen it safely for `/` or use a homepage-specific validator.
- Existing Sanity client is authenticated non-CDN. Good for freshness and current behavior, but the plan should not accidentally add a CDN client with different consistency semantics.
- Sanity Live Content is attractive but broader than required for v1.6. It could change caching behavior and should not be bundled with the base migration unless explicitly selected.

## Sources

- Local Next docs: `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md`
- Local Next docs: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/draft-mode.md`
- Local Next docs: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`
- Sanity: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs
- Sanity: https://www.sanity.io/docs/apis-and-sdks/presenting-images
- Sanity: https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router
