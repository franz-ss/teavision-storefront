# Project Research - Architecture

**Milestone:** v1.6 Sanity CMS Homepage Integration
**Date:** 2026-07-02

## Existing Architecture

The current homepage is code-owned:

- `src/app/(storefront)/page.tsx` exports static metadata and renders the homepage section sequence.
- `src/components/homepage/content.ts` owns copy, image paths, product/service card data, FAQ data, testimonials, CTA data, and JSON-LD constants.
- Homepage section components live under `src/components/homepage/**`.
- Forms stay action-backed through `src/lib/contact/actions`.
- Tea Journal cards already flow from Sanity through `getHomepageArticles()`.

The current Sanity data boundary is blog-oriented:

- Shared Sanity client and image URL helper: `src/lib/sanity/client.ts`.
- Shared Sanity types: `src/lib/sanity/types.ts`.
- Blog queries: `src/lib/sanity/queries/blog.ts`.
- Blog operations and reshaping: `src/lib/blog/operations.ts`.
- Webhook revalidation: `src/app/api/webhooks/sanity/route.ts`.

## Recommended Target Architecture

### Sibling Studio

Add schema files to `../teavision-cms`.

Recommended shape:

```text
../teavision-cms/schemaTypes/documents/home-page.ts
../teavision-cms/schemaTypes/objects/homepage/section.ts
../teavision-cms/schemaTypes/objects/homepage/link.ts
../teavision-cms/schemaTypes/objects/homepage/hero.ts
../teavision-cms/schemaTypes/objects/homepage/proof-point.ts
../teavision-cms/schemaTypes/objects/homepage/image-card.ts
../teavision-cms/schemaTypes/objects/homepage/product-range.ts
../teavision-cms/schemaTypes/objects/homepage/feature-band.ts
../teavision-cms/schemaTypes/objects/homepage/certification.ts
../teavision-cms/schemaTypes/objects/homepage/testimonial.ts
../teavision-cms/schemaTypes/objects/homepage/testimonials.ts
../teavision-cms/schemaTypes/objects/homepage/journal.ts
../teavision-cms/schemaTypes/objects/homepage/contact.ts
../teavision-cms/schemaTypes/objects/homepage/cta.ts
../teavision-cms/schemaTypes/objects/homepage/faq.ts
```

These filenames intentionally avoid `homepage-*` inside the `homepage/` folder.

Because Sanity schema names are global, object `name` values may still need a short namespace such as `homeHero`, `homeCta`, or `homeFaq` to avoid collisions. File names and schema type names do not need to match exactly.

### Storefront

Add a homepage data boundary:

```text
src/lib/homepage/operations.ts
src/lib/homepage/types.ts
src/lib/homepage/fixtures.ts
src/lib/sanity/queries/homepage.ts
```

Do not put data fetching inside `src/components/homepage`.

Recommended flow:

1. `page.tsx` calls `getContent()`.
2. `getContent()` uses `'use cache'`, `cacheTag('home', 'home-root', 'sanity-home')`, and `cacheLife('hours')`.
3. GROQ query returns the singleton.
4. Reshapers convert Sanity nullable data into `Content`.
5. Existing homepage sections receive `content` props.
6. Existing form actions stay passed from the route.

### Metadata

Two acceptable options:

1. Conservative v1: keep metadata code-owned and seed matching SEO fields in Sanity for later.
2. CMS SEO v1: replace static `metadata` with cached `generateMetadata()` using a narrow SEO query and code fallbacks.

If option 2 is selected:

- Use `withNoindexRobots()`.
- Keep `title.absolute` for homepage title.
- Keep canonical `/`.
- Disable stega for metadata.
- Keep JSON-LD code-owned.
- Ensure metadata resolves into initial HTML, not streamed after the initial UI.

## Build Order

1. Studio schema and seed script.
2. Storefront query/types/reshapers with tests.
3. Component prop refactor and Storybook fixture updates.
4. Metadata and image handling verification.
5. Webhook revalidation extension.
6. Draft Mode preview.
7. Optional Presentation / Visual Editing.
8. SEO and PageSpeed no-regression evidence.

## Cache And Preview Design

Published path:

- Current `sanityFetch()` is fine for published homepage reads.
- Keep `useCdn: false` because this repo already uses authenticated non-CDN reads and webhook revalidation.
- Use Next Cache Components tags/lifetimes around the operation, as existing blog code does.

Draft path:

- Add preview-aware client or helper only when Draft Mode is implemented.
- Do not save draft data in the published cache.
- Read `draftMode().isEnabled` inside cached scopes only if needed; avoid `cookies()` and `headers()` in cached helpers.

## Integration Points

Files likely touched in the storefront:

- `src/app/(storefront)/page.tsx`
- `src/app/api/webhooks/sanity/route.ts`
- `src/lib/sanity/client.ts`
- `src/lib/sanity/types.ts`
- `src/lib/sanity/queries/homepage.ts`
- `src/lib/homepage/operations.ts`
- `src/lib/homepage/types.ts`
- `src/components/homepage/**/*`

Files likely touched in the sibling Studio:

- `../teavision-cms/sanity.config.ts`
- `../teavision-cms/schemaTypes/index.ts`
- `../teavision-cms/schemaTypes/type-icons.ts`
- `../teavision-cms/schemaTypes/documents/home-page.ts`
- `../teavision-cms/schemaTypes/objects/homepage/*.ts`
- `../teavision-cms/schemaTypes/schemaTypes.test.ts`
- `../teavision-cms/scripts/seed-home-page.ts`

## Sources

- Storefront: `src/app/(storefront)/page.tsx`
- Storefront: `src/lib/blog/operations.ts`
- Storefront: `src/app/api/webhooks/sanity/route.ts`
- Studio: `../teavision-cms/sanity.config.ts`
- Studio: `../teavision-cms/schemaTypes/index.ts`
- Local Next docs: `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md`
- Local Next docs: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
- Sanity: https://www.sanity.io/docs/nextjs/caching-and-revalidation-in-nextjs
- Sanity: https://www.sanity.io/docs/visual-editing/presentation-resolver-api
