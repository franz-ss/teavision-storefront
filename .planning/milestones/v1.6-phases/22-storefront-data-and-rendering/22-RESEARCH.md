---
phase: 22
slug: storefront-data-and-rendering
status: complete
researched: 2026-07-02
requirements: [DATA-01, DATA-02, RENDER-01, RENDER-02, QUALITY-01]
---

# Phase 22 Research: Storefront Data and Rendering

<objective>
Research how to plan Phase 22 so the storefront homepage reads the Phase 21
Sanity `homePage` singleton through a typed server-side boundary and renders the
existing homepage with visual, SEO, image, cache, and commerce-authority parity.
</objective>

## Scope Summary

Phase 22 is the storefront cutover from static homepage content to the published
Sanity singleton created in Phase 21. The important boundary is narrow:

- Fetch exactly one published `homePage` document through server-only Sanity
  helpers.
- Normalize and validate the document into the existing homepage view-model
  shape before rendering.
- Prop-enable the existing homepage sections rather than creating CMS-only
  duplicates.
- Preserve current route order, forms, code-owned JSON-LD, decorative motif
  assets, Shopify catalog/cart/checkout authority, and one-H1 behavior.
- Replace hardcoded route metadata with required CMS metadata while still
  applying `withNoindexRobots()`.
- Keep preview, webhook homepage tag invalidation, and release/PageSpeed proof
  for Phase 23.

## Current Storefront State

`src/app/(storefront)/page.tsx` currently exports static `metadata` and renders
hardcoded content from `src/components/homepage/content.ts`. The route composes:

1. `HomepageHero`
2. `ProductRange`
3. `HomepageNewsletter`
4. `PrivateLabel`
5. `OrganicHerbs`
6. `SupplyChain`
7. `CertificationCoverage`
8. `SupplyChainProtection`
9. `Testimonials`
10. `TeaJournal`
11. `ContactSection`
12. `Cta`
13. `Faq`

The current static route owns Organization/WebSite JSON-LD and form actions:
`sendNewsletterSignupAction` and `submitContactFormAction`. Those should stay
code-owned. The Tea Journal section already fetches live Sanity blog posts
through `getHomepageArticles(DEFAULT_BLOG_HANDLE)`, so Phase 22 should only
move the section intro, blog handle, link label, and max post count into the
homepage content boundary.

## Phase 21 CMS Shape

The sibling CMS now exposes a fixed `homePage` singleton with these fields in
the storefront section order:

- `hero`: eyebrow, title, copy, CTA, hero image, trust marks, proof points.
- `productRange`: intro plus 11 image cards.
- `newsletter`: intro only; form and motifs remain code-owned.
- `privateLabel`: intro plus 3 service cards.
- `organicHerbs`: intro, authored image, 3 checklist strings, CTA.
- `supplyChain`: intro and CTA; motifs remain code-owned.
- `certificationCoverage`: six labels plus icon keys.
- `supplyChainProtection`: intro plus seven certification mark images.
- `testimonials`: intro plus one or more testimonial items with logo images.
- `teaJournal`: intro, blog handle, link label, max posts.
- `contact`: intro plus two contact methods.
- `catalogueCta`: intro, primary CTA, secondary CTA; motifs remain code-owned.
- `faq`: intro plus FAQ items.
- `seo`: `metaTitle`, `metaDescription`, `canonicalPath`, `noIndex`, optional
  OG image.

All authored images use the shared CMS `imageWithAlt` object, which provides the
image asset, alt text, crop, hotspot, dimensions, and LQIP metadata when queried.

## Existing Patterns To Reuse

### Sanity Fetching

`src/lib/sanity/client.ts` is already server-only and exposes:

- `sanityFetch<T>(query, params)` for typed published queries.
- `getSanityImageUrl(source, options)` for `cdn.sanity.io` image URLs with
  bounded width/height/quality/fit options.

`src/lib/blog/operations.ts` is the closest local operation pattern. It:

- Keeps public app types separate from raw Sanity result types.
- Uses `sanityFetch<T>()` in operation helpers.
- Wraps expensive published reads in `use cache`, `cacheTag()`, and
  `cacheLife()`.
- Normalizes nullable Sanity fields before returning UI-ready data.
- Uses bounded image URL options per use case instead of passing raw image
  objects to components.

### Next 16 Cache Components

The local Next 16 docs confirm:

- `use cache` can be applied to async functions and must contain `cacheTag()` and
  `cacheLife()` calls inside the cached scope.
- Cached functions cannot directly read request-time APIs such as cookies or
  headers. Phase 22 does not need those APIs.
- With Cache Components, `generateMetadata()` that fetches external data must
  either use cached data or intentionally opt into request-time behavior.
- `cacheLife('hours')` matches existing Sanity blog operations and is suitable
  for published homepage content until Phase 23 adds explicit homepage
  revalidation.

The homepage operation should therefore be a cached helper such as
`getHomepage()` with tags `homePage` and `sanity-homepage` or similarly explicit
homepage tags. Phase 23 can later revalidate those tags from the signed webhook.

### Next Image

The local Next 16 image docs confirm:

- `priority` is deprecated. Use `preload` for intentional LCP images.
- Remote images need explicit width and height unless rendered with `fill`.
- `sizes` should be present when using `fill`.
- Sanity remote images are already allowed by `next.config.ts` through
  `cdn.sanity.io/images/**`.

The current hero uses:

- `fill`
- `sizes="100vw"`
- `preload`
- `fetchPriority="high"`
- object-cover layout classes

Phase 22 must preserve that exact hero discipline while changing only the image
source from static public asset to normalized Sanity image URL. For non-hero
authored images, retain current section geometry and `sizes` strings.

## Proposed Data Boundary

Add a focused storefront operation under the Sanity domain, likely:

- `src/lib/sanity/queries/home-page.ts`
- `src/lib/sanity/home-page.ts` or `src/lib/sanity/operations/home-page.ts`

Existing conventions place Shopify operations in `src/lib/shopify/operations/`
and blog Sanity operations in `src/lib/blog/operations.ts`. Since homepage is
Sanity-backed but not blog-domain, a short `src/lib/sanity/home-page.ts` helper
is the cleanest local fit without inventing a new broad operations folder.

The operation should:

1. Query `*[_type == "homePage" && slug.current == "/"][0]`.
2. Pull all Phase 21 fields, dereferencing image asset metadata.
3. Normalize required images into `{ src, alt, width, height }`.
4. Use `getSanityImageUrl()` for Sanity images, preserving crop/hotspot through
   the original image source object.
5. Validate required document and render-critical fields.
6. Throw an explicit error for missing or invalid required content.
7. Return a serializable `HomepageContent` view model for the route and
   components.

Do not return raw Sanity result objects to components. The route should receive
the same kind of data shape the components already understand.

## Runtime Validation Strategy

The validation should be lean and fail-loud:

- Document must exist.
- SEO `metaTitle`, `metaDescription`, and canonical `/` must exist and be valid.
- Hero title, copy, CTA, image, trust marks, and exactly four proof points must
  exist.
- Product range must include 11 cards; private label must include 3 cards.
- Required image fields must have an asset URL or asset ID plus dimensions.
- Required links must have label and allowed href (`/`, `https://`, `mailto:`,
  `tel:`), matching CMS validation.
- Tea Journal config must include a blog handle, link label, and max posts from
  1 to 3.
- No section may silently disappear due to invalid CMS content unless it already
  has an existing explicit empty-state path. The current only safe null path is
  blog articles being empty; that should remain live article behavior, not a CMS
  content fallback.

Avoid a large validation framework unless one already exists. Small local
type guards and narrowers using `unknown` are sufficient and align with the
project's no-`any` rule.

## Component Plan Shape

The smallest safe rendering change is to prop-enable existing components:

- `HomepageHero` should accept hero content and proof points. Keep the Lucide
  allowlist and hero `Image` props.
- `ProductRange` should accept intro and cards.
- `HomepageNewsletter` should accept intro while continuing to receive the
  Server Action.
- `PrivateLabel` should accept intro and cards.
- `OrganicHerbs` should accept intro, image, checklist, and CTA.
- `SupplyChain` should accept intro and CTA while keeping decorative motif
  images code-owned.
- `CertificationCoverage` should accept six CMS label/icon items while keeping
  the icon map code-owned.
- `SupplyChainProtection` should accept intro and marks.
- `Testimonials` should accept intro and testimonials.
- `TeaJournal` should accept config or split into a data wrapper plus a pure
  section component. Use the CMS blog handle and max post count, but keep article
  fetching in the existing blog operation layer.
- `ContactSection` is shared outside homepage, so add optional content props
  without breaking existing call sites on collections/blog/support pages.
- `Cta` can already receive intro/CTA, but needs secondary CTA support instead
  of hardcoding "Browse online".
- `Faq` already accepts props and can consume CMS intro/items directly.

Keep client leaves unchanged: `HomepageNewsletterForm`,
`TestimonialsSlider`, and `ContactSectionForm`.

## SEO And JSON-LD

Replace the static homepage `metadata` export with `generateMetadata()`.
It should fetch the same cached homepage content as the page, then return:

- `title: { absolute: home.seo.title }`
- `description: home.seo.description`
- `openGraph.title`, `openGraph.description`, and `openGraph.url: '/'`
- optional OG image if Sanity provides one with URL and dimensions
- `alternates: { canonical: '/' }`
- robots from CMS noIndex intent, then passed through `withNoindexRobots()`

The global noindex helper must still win. The route's Organization/WebSite
JSON-LD stays code-owned through `organizationJsonLd` and `websiteJsonLd` or a
small SEO constants module if `content.ts` is split.

The route must still render only one visible `h1`, owned by `HomepageHero`.
Section headings remain `h2`/`h3`.

## Tests And Verification Opportunities

Add unit tests around the new data boundary before relying on route behavior:

- Missing `homePage` result rejects/throws.
- Missing required SEO field rejects/throws.
- Canonical values other than `/` reject/throw.
- Missing required image dimensions reject/throw.
- Sanity image URL builder is called with bounded width/quality options for hero
  and card images.
- Returned content preserves all Phase 22 requirement-backed counts: 11 product
  cards, 3 service cards, 4 proof points, 6 cert coverage items, 7 supply-chain
  marks.
- CMS `seo.noIndex: true` produces `robots.index === false` while global
  `withNoindexRobots()` is still called by metadata generation.
- Tea Journal uses CMS blog handle and max posts without changing article data
  ownership.

Add component/route checks where useful:

- Storybook stories should pass explicit fixture props after components stop
  importing live static constants.
- A route rendering test or focused component test should prove the homepage
  route passes Sanity content into sections and preserves form actions.
- Source assertions should confirm no static `HOME_TITLE`/`HOME_DESCRIPTION`
  fallback remains in `src/app/(storefront)/page.tsx`.

Verification commands likely needed:

- `pnpm test:unit -- src/lib/sanity/home-page.test.ts src/lib/blog/operations.test.ts`
- `pnpm test:stories`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

Do not run real Shopify hosted checkout, payment, shipping, tax, order creation,
or success redirect tests.

## Risks And Planning Notes

- UI-SPEC gate: This is a frontend-rendering phase and no
  `22-UI-SPEC.md` exists yet. The GSD plan workflow should block planning until
  `$gsd-ui-phase 22` is run, unless the operator reruns with `--skip-ui`.
- Static fallback drift: `src/components/homepage/content.ts` can remain as
  fixture/story data, but route runtime must not import it for live content.
- Shared `ContactSection` call sites: collections/blog/support pages still use
  the default copy, so optional content props are safer than making all callers
  pass homepage CMS content.
- Hero alt behavior changes: the seeded hero image has meaningful alt text, while
  current code renders `alt=""`. The context requires Sanity alt support, so the
  plan should require using CMS alt text for authored images while preserving
  decorative code-owned motifs as hidden/empty-alt.
- `Cta` hardcodes the secondary "Browse online" button today. Phase 21 modeled
  `secondaryCta`, so Phase 22 must wire it rather than keeping a hardcoded
  secondary action.
- `TeaJournal` currently hardcodes `DEFAULT_BLOG_HANDLE`, three posts, and
  "View all". Phase 22 must move those settings to CMS while article cards still
  come from live blog queries.

## Validation Architecture

Use Vitest and existing Next build/lint checks. The feedback loop should be:

- Unit tests for Sanity homepage query normalization and metadata generation
  after the data boundary task.
- Storybook interaction tests for prop-enabled homepage sections after component
  refactors.
- Full typecheck, lint, and build after route cutover.
- Optional local browser/manual screenshot comparison can be recorded during
  execute/verify, but Phase 23 owns formal no-regression/PageSpeed release
  evidence.

Recommended task-level sampling:

| Area | Automated Check | Purpose |
| --- | --- | --- |
| Sanity operation | `pnpm test:unit -- src/lib/sanity/home-page.test.ts` | Proves fail-loud validation, image normalization, SEO mapping, and requirement counts. |
| Component props | `pnpm test:stories` | Proves stories still render with explicit fixtures after removing runtime static imports. |
| Route cutover | `pnpm typecheck` plus focused route/source assertions | Proves `generateMetadata()` and `/` compile with CMS data and no static metadata fallback. |
| Final guard | `pnpm lint` and `pnpm build` | Proves Next 16 Cache Components, image, metadata, and Server Component constraints hold. |

## RESEARCH COMPLETE
