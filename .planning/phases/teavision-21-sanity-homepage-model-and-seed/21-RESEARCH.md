# Phase 21 Research: Sanity Homepage Model and Seed

**Phase:** 21 - Sanity Homepage Model and Seed
**Date:** 2026-07-02
**Status:** Complete

## Scope

Phase 21 should only prepare the sibling Sanity Studio for homepage authoring:

- Add one `homePage` singleton document in `../teavision-cms`.
- Add the minimal homepage object schemas needed for the current homepage sections.
- Add a seed path that creates or replaces the singleton from the current code-owned homepage content.
- Do not change storefront rendering, metadata, cache behavior, preview mode, or PageSpeed-sensitive image delivery in this phase.

## Current CMS Pattern

The sibling CMS is small and schema-led:

- `../teavision-cms/sanity.config.ts` registers `structureTool()` and `visionTool()`.
- `../teavision-cms/schemaTypes/index.ts` is the schema barrel.
- Existing schemas use `defineType`, `defineField`, and `defineArrayMember`.
- Existing object schemas include `imageWithAlt` and `seo`.
- `schemaTypes/schemaTypes.test.ts` asserts exact schema registration order and icon coverage.
- Migration scripts live under `../teavision-cms/scripts/`, use `node:test`, dry run by default, and require an explicit `--execute` flag before writes.
- Env helpers already exist in `scripts/migrate-shopify-blog/config.ts` and should be reused instead of adding a second env parser.

The CMS repo has a pre-existing untracked `pnpm-workspace.yaml`; Phase 21 should not delete or reformat it.

## Homepage Source Inventory

The storefront homepage is currently code-owned:

- `src/app/(storefront)/page.tsx` defines metadata, JSON-LD, section order, form actions, and the route composition.
- `src/components/homepage/content.ts` defines most seedable homepage data:
  - `HOMEPAGE_HERO`
  - `HOMEPAGE_PROOF_POINTS`
  - `PRODUCT_RANGE`
  - `SERVICE_CARDS`
  - `HERBS_IMAGE`
  - `TESTIMONIALS`
  - `FAQS`
  - `ctaCatalogueData`
  - `organizationJsonLd`
  - `websiteJsonLd`
- Some visible section copy currently lives inside components:
  - `newsletter/newsletter.tsx`
  - `supply-chain/supply-chain.tsx`
  - `supply-chain-protection/supply-chain-protection.tsx`
  - `certification-coverage/certification-coverage.tsx`
  - `tea-journal/tea-journal.tsx`
  - `src/components/contact/contact-section/contact-section.tsx`
- Form actions remain code-owned:
  - `sendNewsletterSignupAction`
  - `submitContactFormAction`
- Tea Journal article cards remain Sanity blog data and are not part of the homepage singleton seed except for section intro/link copy.

## Recommended Model

Use one singleton document:

- Document schema name: `homePage`
- Fixed document ID: `homePage`
- Studio title: `Homepage`
- Slug/canonical field: `/`

Keep file names scoped by folder, not repeated:

```text
../teavision-cms/schemaTypes/documents/home-page.ts
../teavision-cms/schemaTypes/objects/homepage/section.ts
../teavision-cms/schemaTypes/objects/homepage/link.ts
../teavision-cms/schemaTypes/objects/homepage/proof-point.ts
../teavision-cms/schemaTypes/objects/homepage/image-card.ts
../teavision-cms/schemaTypes/objects/homepage/hero.ts
../teavision-cms/schemaTypes/objects/homepage/testimonial.ts
../teavision-cms/schemaTypes/objects/homepage/faq.ts
```

Sanity schema names are global, so object type names should use a compact namespace such as `homeSection`, `homeLink`, `homeProofPoint`, `homeImageCard`, `homeHero`, `homeTestimonial`, and `homeFaqItem`.

Avoid a generic page-builder array. The document should expose fixed fields in the same order as `src/app/(storefront)/page.tsx`:

1. `hero`
2. `productRange`
3. `newsletter`
4. `privateLabel`
5. `organicHerbs`
6. `supplyChain`
7. `certificationCoverage`
8. `supplyChainProtection`
9. `testimonials`
10. `teaJournal`
11. `contact`
12. `catalogueCta`
13. `faq`
14. `seo`

Do not add blanket section reordering. Do not add blanket `enabled` toggles. Add enable/disable only if execution finds a current section that already has a safe null-rendering behavior and the field is required by this phase.

## Seed Strategy

The storefront content module imports app aliases and component types, so a sibling CMS script should not directly import `src/components/homepage/content.ts` at runtime unless the executor proves it resolves cleanly without new dependency bloat.

Lean first-pass seed approach:

- Create `../teavision-cms/scripts/seed-home-page/data.ts` as the initial seed snapshot, derived from current storefront content and component-local copy.
- Create `../teavision-cms/scripts/seed-home-page.ts`.
- Run as dry run by default.
- Require `--execute` before creating or replacing the `homePage` document.
- Use `_id: "homePage"` and `_type: "homePage"`.
- Reuse `loadMigrationEnv`, `getSanityWriteToken`, `requireEnv`, and `shouldExecute` from the existing migration config helpers.
- Upload local image files from `../teavision.com.au/public` when the seed data references a site-relative image path.
- Fail clearly when a referenced local image file is missing; do not silently omit required images.
- Log counts and document ID only; do not log tokens, full document JSON, raw image data, or secrets.

## SEO And PageSpeed Boundary

Phase 21 must not affect SEO or PageSpeed scores because it should not change published storefront rendering. The plan should still protect later phases by:

- Keeping homepage SEO fields in the CMS model.
- Widening the existing `seo` canonical validation to allow `/` while preserving `/blogs/` support.
- Seeding the current homepage title, description, canonical `/`, and `noIndex: false`.
- Not touching `src/app/(storefront)/page.tsx`, hero image rendering, metadata output, JSON-LD, cache tags, or webhook behavior in this phase.

## Validation Architecture

Phase 21 validation can stay fast and local to the sibling CMS:

- `cd ../teavision-cms && pnpm test`
- `cd ../teavision-cms && pnpm schema:validate`
- `cd ../teavision-cms && pnpm build`

Seed tests should cover:

- Dry run does not create a client or write a document.
- Execute mode creates or replaces exactly one `homePage` document with `_id: "homePage"`.
- Site-relative image paths are converted into Sanity image references when uploads are mocked.
- Missing required local images fail rather than producing partial seed documents.

Schema tests should cover:

- `homePage` and all new `home*` object types are registered.
- All registered schema types have icons.
- The singleton document exposes fields in homepage order.
- SEO canonical validation accepts `/` and still accepts `/blogs/...`.

## Research Complete

Phase 21 can be planned as one implementation plan in one wave. It is small enough to execute serially and does not need sub-phase splitting.
