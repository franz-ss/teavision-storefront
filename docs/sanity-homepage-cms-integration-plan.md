# Sanity Homepage CMS Integration Plan

**Status:** historical seed plan, superseded by shipped v1.6 GSD phases
**Prepared:** 2026-07-02
**Superseded:** 2026-07-06 by `.planning/milestones/v1.6-ROADMAP.md` and `.planning/milestones/v1.6-phases/`
**Target application:** Teavision headless storefront, Next.js 16 App Router, React 19
**Related constraint:** v1.6 is shipped and archived; use this document only as historical context for the original CMS migration approach.

## Objective

Move the front page from code-owned static content in `src/components/homepage/content.ts` to a Sanity-authored homepage document while preserving the existing Teavision visual system, homepage section composition, PageSpeed evidence, SEO posture, cache behavior, and Shopify-owned commerce boundaries.

The implementation should extend the existing Sanity foundation used by the Tea Journal. It should not introduce a second CMS client, a generic unbounded page builder, client-side content state, or a separate styling system.

## Strict Release Rule

This work must not reduce SEO or PageSpeed scores. Treat any measured drop as a release blocker, not as an acceptable tradeoff.

- Homepage PageSpeed scores must stay at or above the latest accepted baseline for every measured category.
- Homepage SEO checks must stay at or above the latest accepted baseline, including metadata, canonical, robots/noindex launch gate behavior, structured data, one-H1 correctness, crawlable HTML, and sitemap/robots expectations.
- If Sanity-driven content, image handling, preview wiring, cache behavior, or metadata changes cause a score drop, pause rollout and fix or roll back before shipping.
- Do not accept "CMS flexibility" as justification for slower LCP, higher CLS, heavier image payloads, weaker metadata, or degraded crawlability.

## Current State

- The storefront already depends on `next-sanity`, `@sanity/image-url`, and `@portabletext/react`.
- Server-only Sanity helpers live in `src/lib/sanity/client.ts`, `src/lib/sanity/env.ts`, `src/lib/sanity/queries/blog.ts`, and `src/lib/sanity/types.ts`.
- Sanity blog operations already use Next.js 16 Cache Components with `'use cache'`, `cacheTag()`, and `cacheLife()`.
- `POST /api/webhooks/sanity` verifies signed Sanity webhooks with `next-sanity/webhook` and revalidates blog cache tags.
- The sibling Studio exists at `../teavision-cms`. It is a separate Git project with `sanity.config.ts`, `sanity.cli.ts`, `schemaTypes/`, `scripts/`, its own `package.json`, and an existing blog migration/test setup.
- The sibling Studio already defines reusable `imageWithAlt`, `seo`, `blockContent`, `table`, `legacyComment`, and blog document schemas. Homepage work should extend this project, not initialize a new Studio or embed Studio inside the storefront.
- The homepage is composed in `src/app/(storefront)/page.tsx` from existing components under `src/components/homepage`.
- Homepage copy, images, proof points, product/service cards, testimonials, FAQs, CTA copy, JSON-LD constants, and some section metadata are hardcoded in `src/components/homepage/content.ts`.
- The hero image is launch-sensitive because v1.5 PageSpeed work centered on the `/` LCP image.

## Sibling CMS Project

Use `../teavision-cms` as the Sanity Studio source of truth for schemas and editor configuration.

Existing relevant files:

```text
../teavision-cms/package.json
../teavision-cms/sanity.config.ts
../teavision-cms/sanity.cli.ts
../teavision-cms/schemaTypes/index.ts
../teavision-cms/schemaTypes/documents/blog.ts
../teavision-cms/schemaTypes/documents/blog-post.ts
../teavision-cms/schemaTypes/documents/author.ts
../teavision-cms/schemaTypes/documents/category.ts
../teavision-cms/schemaTypes/objects/image-with-alt.ts
../teavision-cms/schemaTypes/objects/seo.ts
../teavision-cms/schemaTypes/objects/block-content.ts
../teavision-cms/schemaTypes/objects/table.ts
../teavision-cms/scripts/
```

The homepage implementation should add new document/object schema files there and register them in `../teavision-cms/schemaTypes/index.ts`. Keep the storefront responsible only for querying and rendering published/preview content.

## Scope

- Add Sanity schemas for a homepage singleton and reusable homepage section objects.
- Add a typed homepage read/query/reshape boundary in the storefront.
- Refactor existing homepage components to accept typed props while keeping them mostly presentational Server Components.
- Keep contact/newsletter form actions code-owned.
- Keep Tea Journal article fetching code-owned through existing blog operations, but allow homepage CMS to own the section heading/copy/link copy if desired.
- Generate homepage metadata from Sanity SEO fields with safe fallbacks.
- Extend Sanity webhook revalidation to homepage content.
- Add secure draft/preview support, with a path to Sanity Presentation/Visual Editing.
- Provide deployment, QA, and rollback steps.
- Enforce a no-regression SEO and PageSpeed gate before launch.

## Non-Goals

- Do not move Shopify product, collection, cart, checkout, or pricing data into Sanity.
- Do not turn the homepage into a free-form drag-and-drop page builder in the first pass.
- Do not make `src/app/(storefront)/page.tsx` or homepage wrappers client components.
- Do not add inline styles, raw hex/rgb classes, CSS modules, or new color palettes.
- Do not remove the current Sanity blog integration or change blog URLs.
- Do not run real Shopify hosted checkout, payment, shipping, tax, order, or success-redirect tests as part of this phase.
- Do not ship any implementation that lowers homepage SEO or PageSpeed scores.

## Recommended Content Model

Model the homepage as a singleton document with stable section fields. This is safer than a generic page-builder array because each Sanity object maps directly to an existing React section and can be validated against the current design.

### Document: `homePage`

New file: `../teavision-cms/schemaTypes/documents/home-page.ts`

- `title` string, internal/editor title, required.
- `slug` slug or locked string, default `/`, read-only after creation.
- `hero` object, required.
- `productRange` object, required.
- `newsletter` object, required for copy only; form action remains app-owned.
- `privateLabel` object, required.
- `organicHerbs` object, required.
- `supplyChain` object, required.
- `certificationCoverage` object, required.
- `supplyChainProtection` object, required.
- `testimonials` object, required.
- `teaJournal` object, required for section intro/link labels; post cards remain query-driven.
- `contact` object, required for intro copy; form action remains app-owned.
- `catalogueCta` object, required.
- `faq` object, required.
- `seo` object, required.

Use a fixed document ID such as `homePage`. Add a singleton item in Sanity Structure Builder so editors open one homepage document rather than a list.

### Shared Objects

Prefer new object files under `../teavision-cms/schemaTypes/objects/homepage/`. Do not repeat `homepage` in filenames inside that folder.

Recommended files:

```text
../teavision-cms/schemaTypes/objects/homepage/section-settings.ts
../teavision-cms/schemaTypes/objects/homepage/link.ts
../teavision-cms/schemaTypes/objects/homepage/hero.ts
../teavision-cms/schemaTypes/objects/homepage/proof-point.ts
../teavision-cms/schemaTypes/objects/homepage/image-card.ts
../teavision-cms/schemaTypes/objects/homepage/product-range.ts
../teavision-cms/schemaTypes/objects/homepage/feature-band.ts
../teavision-cms/schemaTypes/objects/homepage/certification-coverage.ts
../teavision-cms/schemaTypes/objects/homepage/testimonial.ts
../teavision-cms/schemaTypes/objects/homepage/testimonials.ts
../teavision-cms/schemaTypes/objects/homepage/tea-journal.ts
../teavision-cms/schemaTypes/objects/homepage/contact.ts
../teavision-cms/schemaTypes/objects/homepage/cta.ts
../teavision-cms/schemaTypes/objects/homepage/faq.ts
```

Object responsibilities:

- `sectionSettings`: `enabled`, `eyebrow`, `title`, `copy`.
- `link`: `label`, `href`, `variant`, with validation for internal `/`, `https://`, `mailto:`, and `tel:` URLs.
- `hero`: eyebrow, title, lede, primary CTA, hero `imageWithAlt`, trust strip items.
- `proofPoint`: controlled `iconKey`, optional `imageWithAlt`, title, description.
- `imageCard`: title, body, href, action label, image, optional badge image.
- `productRange`: intro settings plus an array of `imageCard`; validate minimum and maximum card counts to preserve layout quality.
- `featureBand`: intro settings, image, links, optional detail list, display variant enum matching existing components.
- `certificationCoverage`: intro settings and cards with eyebrow/title/description/details.
- `testimonial`: logo image, name, role, brand, quote.
- `testimonials`: intro settings plus testimonial array.
- `teaJournal`: intro settings, link label, blog handle, max posts.
- `contact`: intro settings plus safe support copy; no recipient/email secrets.
- `cta`: intro settings, CTA link, tone enum matching the existing `Cta` component.
- `faq`: intro settings plus `question`/`answer` items.
- `seo`: reuse the existing `seo` object after widening canonical validation beyond `/blogs/` to allow `/`, or create `../teavision-cms/schemaTypes/objects/homepage/seo.ts` only if the homepage truly needs different validation.

Sanity schema `name` values are global, so if short names collide with existing or likely future schema names, use a small namespace such as `home.hero` or `homeHero` while still keeping filenames folder-scoped.

### Schema Best Practices

- Use `defineType`, `defineField`, and `defineArrayMember`.
- Reuse `imageWithAlt` so hotspot/crop, alt text, captions, and attribution stay consistent.
- Keep enum values tied to existing UI variants instead of free-text style controls.
- Validate card counts, title/copy lengths, CTA URL shape, image presence, and required alt text.
- Keep icon choices as an allowlisted enum matching existing Lucide icons.
- Add previews for nested section/card objects so editors can scan the document.
- Add an initial value template or seed script for the `homePage` singleton from current `content.ts` data.

## Data Fetching Strategy

### Storefront Structure

Recommended new files:

```text
src/lib/homepage/operations.ts
src/lib/homepage/types.ts
src/lib/homepage/fixtures.ts              # Storybook/test-only sample content, if useful
src/lib/sanity/queries/homepage.ts
src/app/api/draft/route.ts                # if enabling preview
src/app/api/draft/disable/route.ts        # optional preview exit
```

Update existing files:

```text
src/lib/sanity/client.ts
src/lib/sanity/types.ts
src/app/api/webhooks/sanity/route.ts
src/app/(storefront)/page.tsx
src/components/homepage/**/*
src/components/homepage/content.ts
```

### Query Layer

Add `contentQuery` in `src/lib/sanity/queries/homepage.ts` using `groq`.

The query should:

- Fetch the singleton by fixed ID or `_type == "homePage"`.
- Project only fields needed by the storefront.
- Include image asset `_id`, `url`, `metadata.dimensions`, `metadata.lqip`, `crop`, and `hotspot`.
- Keep section data nested in the same shape as the app-facing model where practical.
- Query SEO fields separately for metadata if a narrower metadata helper is useful.

### Operation Layer

Add `getContent()` in `src/lib/homepage/operations.ts`.

- Use `'use cache'`.
- Call `cacheTag('home', 'home-root', 'sanity-home')`.
- Call `cacheLife('hours')` initially; use webhook revalidation for freshness.
- Use the existing `sanityFetch<T>()` and app-facing reshape functions.
- Return a normalized `Content` object with no Sanity-specific nullable sprawl in components.
- Throw a clear error if the singleton is missing after cutover. During rollout only, allow an explicit temporary fallback path if the owner wants a staged content-seeding window.
- Keep Sanity client access server-only.

Draft preview can either extend `sanityFetch()` with per-request options or add a dedicated preview fetch helper. Published reads should keep `perspective: 'published'`, `stega: false`, and `useCdn: false` unless the project later adopts `defineLive`.

## Frontend Integration

Refactor the homepage as data-driven composition while preserving existing section order.

1. Convert `src/app/(storefront)/page.tsx` to an async Server Component.
2. Fetch `const content = await getContent()`.
3. Pass section props into existing components:
   - `HomepageHero content={content.hero}`
   - `ProductRange content={content.productRange}`
   - `HomepageNewsletter content={content.newsletter} action={sendNewsletterSignupAction}`
   - `PrivateLabel content={content.privateLabel}`
   - `OrganicHerbs content={content.organicHerbs}`
   - `SupplyChain content={content.supplyChain}`
   - `CertificationCoverage content={content.certificationCoverage}`
   - `SupplyChainProtection content={content.supplyChainProtection}`
   - `Testimonials content={content.testimonials}`
   - `TeaJournal content={content.teaJournal}`
   - `ContactSection content={content.contact} action={submitContactFormAction}`
   - `Cta {...content.catalogueCta}`
   - `Faq content={content.faq}`
4. Keep static JSON-LD for Organization/WebSite code-owned unless SEO requirements explicitly call for CMS-authored structured data.
5. Remove hardcoded homepage production content from `content.ts` only after the Sanity seed and frontend mapping are verified.

### Component Mapping Rules

- Components under `src/components/homepage` stay presentational and receive app-facing props.
- Data reshaping belongs in `src/lib/homepage/operations.ts`, not in components.
- Existing Storybook stories should switch to CMS-shaped fixtures.
- Add a story or interaction state whenever component props materially change.
- Keep raw page-level `<section>` avoided; continue using `Section.Root` and `Section.Container`.
- Use `cn()` for conditional className composition and token classes only.
- Keep client components limited to interactive leaves such as forms or controls.

## Image Handling

- Reuse Sanity `imageWithAlt` and query the full image object, not just `asset`, so crop and hotspot can be respected by `@sanity/image-url`.
- Continue using `getSanityImageUrl()` with `fit: 'max'` to avoid upscaling small source images.
- Map Sanity dimensions to `next/image` `width`/`height` or stable aspect-ratio containers with `fill` and explicit `sizes`.
- Use `blurDataURL` only when Sanity `metadata.lqip` exists.
- Keep `next.config.ts` remote patterns for `cdn.sanity.io`; optionally narrow the pathname to the project/dataset once deployment config is stable.
- Do not use deprecated `priority`.
- For the LCP hero image, pick one supported priority hint after checking local Next 16 docs and v1.5 PSI evidence. Prefer a single deliberate strategy such as `fetchPriority="high"` or `preload`, then rerun performance checks.
- Preserve decorative image semantics with empty alt only where the frontend owns the decision. CMS-authored meaningful images should require alt text.
- If a CMS-authored hero image cannot meet the current PageSpeed baseline, reject the content or provide a pre-optimized derivative rather than lowering the performance target.

## SEO Considerations

Replace the static `metadata` export with `generateMetadata()` if homepage SEO becomes CMS-driven.

- Fetch homepage SEO through a cached helper, using the same cache tags as the page content or a narrower `home-seo` tag.
- Apply `withNoindexRobots()` so `DISABLE_INDEXING` remains the launch gate.
- Use title absolute/fallback behavior consistent with Phase 18 SEO decisions.
- Validate canonical paths to `/` for the homepage unless a future canonical strategy says otherwise.
- Generate Open Graph images from Sanity with `stega: false`.
- Never allow stega/source-map characters into metadata.
- Keep Organization and WebSite JSON-LD conservative and app-owned unless the CMS model is explicitly validated for schema.org claims.
- Verify the rendered homepage still has one visible H1 per standalone route load.
- Confirm `/sitemap.xml` and `robots.txt` behavior are unchanged unless launch SEO scope says otherwise.
- Treat any SEO score or crawlability regression as a blocker.

## Preview Mode and Visual Editing

Implement preview in two stages.

### Stage 1: Secure Draft Mode

Add:

```text
SANITY_PREVIEW_SECRET=
SANITY_API_READ_TOKEN=
NEXT_PUBLIC_SANITY_STUDIO_URL=
```

Create `GET /api/draft?secret=...&slug=/`:

- Validate the secret.
- Only allow same-site, site-relative slugs.
- Confirm the requested document exists before enabling draft mode.
- Call `draftMode().enable()` in the route handler.
- Redirect to the validated path.

Create `GET /api/draft/disable`:

- Call `draftMode().disable()`.
- Redirect to `/`.
- Ensure any Link to this route has `prefetch={false}`.

Draft reads should:

- Use a read token.
- Use `useCdn: false`.
- Use draft perspective when draft mode is enabled.
- Avoid saving draft responses into the published cache. Next.js Draft Mode already forces cached functions to re-execute per request and not save results.

### Stage 2: Presentation Tool and Visual Editing

If editor workflow needs click-to-edit/live preview, add Sanity Presentation/Visual Editing after Stage 1 is stable.

- Add `presentationTool` to `../teavision-cms/sanity.config.ts`.
- Configure `resolve.mainDocuments` so route `/` maps to the `homePage` singleton.
- Add frontend origin(s) to Sanity CORS.
- Add Visual Editing packages only if they are not already included by the installed `next-sanity` version.
- Configure `defineLive`/`SanityLive` only after deciding whether live content should replace webhook-only revalidation.
- Keep stega enabled only for preview rendering and disabled for metadata/SEO.

## Caching and Revalidation

Use the project's existing Next.js 16 Cache Components pattern.

Published homepage content:

```ts
export async function getContent(): Promise<Content> {
  'use cache'
  cacheTag('home', 'home-root', 'sanity-home')
  cacheLife('hours')
  // sanityFetch + reshape
}
```

Webhook update:

- Extend `src/app/api/webhooks/sanity/route.ts`.
- Parse `_type`, `_id`, `slug`, and any home-page-specific fields from the signed payload.
- If `_type === 'homePage'`, revalidate `home`, `home-root`, and `sanity-home`.
- Keep existing blog tag behavior intact.
- Log accepted/rejected events without raw body, signatures, tokens, or document content.

Revalidation guidance:

- Prefer tag-based revalidation over path-based revalidation.
- Use the existing route handler style for immediate cache expiry unless the project standard is intentionally changed.
- Do not use `updateTag()` from the webhook route; it is for Server Actions.
- Avoid runtime APIs such as `cookies()` or `headers()` inside cached published helpers.
- If metadata uses cached Sanity reads, mark `generateMetadata()` cache behavior intentionally so the homepage remains prerenderable.

## Deployment Plan

1. Start the next GSD milestone/phase and convert this plan into a canonical phase `PLAN.md`.
2. Create a branch, for example `codex/sanity-home-cms`.
3. Update the sibling Studio schemas and singleton structure.
4. Add a seed script that creates/updates the `homePage` document from current code-owned content.
5. Run Studio checks:
   - `cd ../teavision-cms`
   - `pnpm schema:validate`
   - `pnpm test`
   - `pnpm build`
6. Deploy or publish the Studio schema changes.
7. Seed staging/production Sanity with the homepage singleton.
8. Configure Sanity CORS origins, webhook target, webhook secret, and preview secret.
9. Implement storefront query, types, reshape, component prop wiring, metadata, preview routes, and webhook tags.
10. Run storefront checks:
    - `pnpm lint`
    - `pnpm typecheck`
    - `pnpm test:unit`
    - `pnpm test:stories`
    - `pnpm build`
11. Smoke test local/staging routes:
    - `/`
    - `/api/webhooks/sanity` with a valid signed homepage payload if practical.
    - `/api/draft?secret=...&slug=/`
    - `/api/draft/disable`
12. Run visual QA across mobile and desktop.
13. Rerun homepage PageSpeed/Lighthouse checks because the hero image source and priority hints are launch-sensitive.
14. Compare SEO and PageSpeed results against the latest accepted baseline. Do not deploy if any score drops.
15. Deploy the storefront only after no-regression proof is recorded.
16. Publish a small Sanity homepage copy change and verify webhook revalidation updates the page without redeploy.

## Step-by-Step Implementation Roadmap

### Wave 1: Planning and Content Inventory

- Capture current homepage content from `src/components/homepage/content.ts`.
- Identify which fields are editor-owned versus code-owned.
- Confirm whether the owner needs section reordering in v1 or a fixed order with enable/disable toggles.
- Confirm preview requirements: Draft Mode only, or full Visual Editing/Presentation.
- Create acceptance criteria for PageSpeed, SEO, and content parity.

### Wave 2: Studio Schema and Seed

- Add `homePage` document schema.
- Add homepage object schemas.
- Add singleton Structure Builder entry and remove `homePage` from generic document lists.
- Add schema tests for required fields, URL validators, and object registration.
- Add seed script from current homepage constants.
- Validate and build Studio.

### Wave 3: Storefront Data Boundary

- Add Sanity homepage GROQ query.
- Add `Content` app-facing types in `src/lib/homepage/types.ts`.
- Add `getContent()` cached operation and reshapers.
- Add tests for null/missing data, image reshaping, link validation assumptions, enabled/disabled sections, and SEO fallbacks.
- Keep Sanity nullability out of presentation components.

### Wave 4: Component Prop Refactor

- Update existing homepage components to accept props.
- Keep section order stable in `page.tsx`.
- Keep form actions passed from the route.
- Update Storybook stories to use CMS-shaped fixtures.
- Ensure no parent homepage component becomes `'use client'`.

### Wave 5: SEO, JSON-LD, and Metadata

- Replace static metadata with cached `generateMetadata()` if CMS owns SEO.
- Preserve `withNoindexRobots()`.
- Use homepage SEO fields with code fallbacks.
- Keep JSON-LD conservative and serialized through `serializeInlineJson`.
- Verify one visible H1 and no stega in metadata.

### Wave 6: Webhook Revalidation

- Extend Sanity webhook payload parsing.
- Add home cache tags.
- Add route-handler tests if existing test harness supports it; otherwise add unit coverage for payload parsing helpers.
- Confirm blog revalidation still works.

### Wave 7: Preview and Visual Editing

- Add secure Draft Mode routes.
- Add draft-aware Sanity fetch configuration.
- Add Presentation Tool route resolver for `/`.
- Add Visual Editing/Live Content only if approved for editor workflow.
- Confirm production renders without overlays/stega.

### Wave 8: Verification and Rollout

- Run lint, typecheck, unit tests, Storybook tests, and build.
- Browser-check the homepage at common mobile/tablet/desktop widths.
- Compare rendered content against current homepage.
- Publish a Sanity change and confirm cache revalidation.
- Rerun PageSpeed evidence for `/` and require no score regression.
- Rerun SEO evidence for `/` and require no score regression.
- Document rollout proof and rollback commands.

## Best Practices

- Keep Shopify as the source of truth for catalog and checkout.
- Treat Sanity as the source of truth only for editorial/marketing homepage copy and imagery.
- Prefer a typed singleton over an open-ended page builder.
- Keep data-fetching in `src/lib/homepage`, not in `src/components/homepage`.
- Keep presentation components reusable and Storybook-covered.
- Validate editor inputs aggressively at the schema layer.
- Use Sanity image metadata to avoid layout shift.
- Keep preview authenticated and token-backed.
- Keep cache tags stable, short, and documented.
- Never log webhook bodies, tokens, secrets, or unpublished content.
- Do not silently fall back to stale hardcoded content after CMS cutover.

## Risks and Mitigations

- **Hero LCP regression:** Dynamic Sanity images may alter dimensions, format, preload behavior, or source size. Mitigate with strict image validation, fixed aspect ratios, one supported priority hint, and PageSpeed verification. Release remains blocked until scores match or beat the latest accepted baseline.
- **Editor breaks layout with long copy:** Add schema max lengths and test longest expected strings in Storybook.
- **Missing singleton blocks production render:** Seed before enabling, add a clear error, and optionally use a short-lived explicit rollout flag.
- **SEO drift:** Keep metadata fallbacks, canonical validation, noindex launch gate, one-H1 checks, and JSON-LD assertions.
- **Preview leaks draft markers to crawlers:** Use stega only in preview rendering, never in metadata, sitemap, robots, or JSON-LD.
- **Webhook misses nested object changes:** Revalidate homepage tags for every `homePage` mutation instead of trying to tag individual inline sections.
- **Visual Editing adds unnecessary complexity:** Ship secure Draft Mode first; add Presentation/Visual Editing only after editor workflow approval.

## Verification Checklist

- [ ] GSD next milestone/phase exists before this becomes canonical `PLAN.md`.
- [ ] Studio schema validates.
- [ ] `homePage` singleton is seeded with current homepage content.
- [ ] Storefront builds with CMS-driven homepage content.
- [ ] Homepage components remain Server Components except interactive leaves.
- [ ] Existing Storybook stories pass with CMS-shaped fixtures.
- [ ] `pnpm lint` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test:unit` passes.
- [ ] `pnpm test:stories` passes.
- [ ] `pnpm build` passes.
- [ ] Draft Mode preview works for `/`.
- [ ] Sanity publish webhook revalidates home cache tags.
- [ ] Homepage metadata, canonical, OG image, noindex behavior, JSON-LD, and H1 are verified.
- [ ] Homepage PageSpeed evidence is refreshed after dynamic hero integration.
- [ ] Homepage SEO score is unchanged or improved.
- [ ] Homepage PageSpeed scores are unchanged or improved.
- [ ] Any SEO or PageSpeed score regression triggers fix or rollback before release.

## References

- Local Next.js 16 docs:
  - `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
  - `node_modules/next/dist/docs/01-app/02-guides/draft-mode.md`
- Sanity:
  - `https://www.sanity.io/docs/nextjs/introduction`
  - `https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs`
  - `https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router`
  - `https://www.sanity.io/docs/studio/slug-type`
  - `https://www.sanity.io/docs/studio/image-type`
  - `https://www.sanity.io/docs/apis-and-sdks/presenting-images`
  - `https://www.sanity.io/docs/studio/structure-builder-cheat-sheet`
  - `https://www.sanity.io/docs/visual-editing/presentation-resolver-api`
  - `https://www.sanity.io/docs/developer-guides/live-content-guide`
