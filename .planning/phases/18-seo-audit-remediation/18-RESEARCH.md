# Phase 18: SEO Audit Remediation - Research

**Researched:** 2026-06-25
**Status:** Complete
**Confidence:** High

## RESEARCH COMPLETE

## Executive Summary

Phase 18 should be planned as five connected SEO remediation workstreams:

1. Build a URL inventory and redirect register that separates deterministic app-owned redirects from owner/operator-gated DNS, Vercel, alternate-host, Shopify-domain, and migration-export decisions.
2. Fix visible heading and content hierarchy on collection and product pages, especially banner collection pages with hidden H1s and read-more content currently rendered before the grid.
3. Correct metadata, language, robots, sitemap, canonical, and blog tag indexation behavior while keeping `SITE_URL` env-driven and validating launch evidence against `https://www.teavision.com.au`.
4. Add only evidence-backed structured data: Service and FAQ where already supported, LocalBusiness where visible contact details support it, and Product aggregate ratings only when reliable ratings are visible on the page.
5. Prove crawlable server-rendered HTML and reconcile Lighthouse/Core Web Vitals evidence without weakening the still-blocking Phase 17 PERF-01 gate.

The scope boundary is the external audit PDF at `D:/Downloads/SEO Audit - Teavision Staging Site.pdf`. Do not add unrelated URL taxonomy, schema, indexation, checkout, account, or launch strategy during Phase 18.

## Sources Read

- `.planning/phases/18-seo-audit-remediation/18-CONTEXT.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `D:/Downloads/SEO Audit - Teavision Staging Site.pdf`
- Local Next.js 16 docs under `node_modules/next/dist/docs/`
  - Metadata and `generateMetadata`
  - `robots.ts`
  - `sitemap.ts`
  - Cache Components
  - Streaming
  - Cache Components migration
  - JSON-LD
  - Redirecting
- `docs/conventions.md`
- `docs/launch/seo-route-evidence.md`
- `docs/launch/performance-evidence.md`
- `docs/launch/final-production-readiness-report.md`
- `docs/launch/analytics-and-indexing-runbook.md`
- Current SEO, collection, product, blog, contact, and launch probe code paths listed below.

## Audit Findings Inventory

The PDF audit calls out these implementation-relevant findings:

- URL structure is mostly aligned with the legacy/live shape:
  - Collections use `/collections/<collection-name>`.
  - Products use `/products/<product-name>`.
  - Generic pages use `/pages/<page-name>`.
  - Any slug changes must get 301 coverage during migration.
- Homepage headings are acceptable.
- Collection pages have multiple H1 signals. Some main category pages use a hidden H1, and some H1s appear to originate from imported/read-more content or unrelated page snippets. The recommended structure is banner image if needed, visible H1, brief intro, breadcrumb, product grid, then read-more content below the grid.
- Product pages have a similar multiple-H1 concern. The product title should be the only visible H1.
- Service, generic, and blog page headings are generally acceptable.
- Blog listing URL simplification from `/blogs/teavision-blogs/` to `/blog/` is recommended. If not implemented, the handoff/evidence matrix must explicitly document the decision.
- Page titles should remove the automatic brand suffix for SEO target pages: homepage, collections, service/landing pages. Product pages may retain the suffix unless length evidence says otherwise.
- Meta descriptions were generally acceptable.
- The document language is `en`; launch should emit `en-AU`.
- The strongest launch URL should be `https://www.teavision.com.au/`; other protocol/host variants should redirect at host/DNS/platform level where applicable.
- Robots should disallow Login/Account URLs, keep sitemap URL aligned to the strongest host, and noindex tagged blog pages.
- Canonicals were generally intact.
- Structured data gaps: Service, LocalBusiness, Reviews, and FAQ. Existing Organization and Product schema are present.
- Collection and product pages were flagged as a client-side-rendering issue. Treat this as a crawlable HTML/static-shell evidence problem unless new proof shows true client-only rendering.
- The audit Lighthouse sample showed mobile Performance 88, SEO 61, LCP 3.5s, FCP 1.2s, TBT 90ms, CLS 0. It also highlighted render-blocking CSS savings around 690ms, unused first-party JS savings around 88 KiB, and smaller image/legacy-JS opportunities.

## Next.js 16 Findings

Local Next.js 16 docs are important because this project uses Cache Components and the App Router:

- Dynamic route `params` and `searchParams` are promises. Routes should await them only where needed and preferably below Suspense boundaries for streaming-friendly pages.
- Metadata APIs are server-only. A route cannot export both `metadata` and `generateMetadata`.
- Root `title.template` applies to child route titles. Routes that must avoid the root `| Teavision` suffix should use `title.absolute`.
- `metadataBase` should remain in the root layout, and relative canonical URLs resolve against it.
- With Cache Components, `generateMetadata` follows the same caching constraints as pages. If metadata fetches external data and the page is otherwise prerenderable, cache the fetch path with `use cache`; if runtime data is required, make that intentional.
- `robots.ts` and `sitemap.ts` are special metadata routes and can return `MetadataRoute.Robots` and `MetadataRoute.Sitemap`.
- `next.config.ts redirects()` is appropriate for known ahead-of-time path redirects and runs before rendering. Host, DNS, large dynamic redirect maps, or uncertain redirects should be handled by the platform or a documented handoff.
- JSON-LD should be emitted as a native `<script type="application/ld+json">` with unsafe characters such as `<` escaped, matching the existing `serializeInlineJson()` pattern.
- For LCP, place the LCP element outside slow Suspense boundaries when possible, and use current Next 16 image discovery/preload patterns rather than deprecated `priority` assumptions.
- Raw HTML evidence for crawlability should fetch built production responses with `Accept-Encoding: identity` and inspect the response before browser hydration.

## Current Codebase Findings

### Existing SEO and Launch Assets

- `next.config.ts` already enables `cacheComponents: true` and contains deterministic redirects such as `/collections/:handle/products/:productHandle` to `/products/:productHandle`, plus policy redirects from `getPolicyRedirects()`.
- `src/app/layout.tsx` currently sets `html lang="en"` and a root metadata title template of `%s | Teavision`.
- `src/lib/seo/site-url.ts` keeps canonical/sitemap host env-driven. In production it fails when `SITE_URL`/`NEXT_PUBLIC_SITE_URL` are missing; outside production it defaults to `https://teavision.com.au`, which is non-www and must be handled carefully in launch evidence.
- `src/app/robots.ts` currently disallows `/api/` and emits the sitemap when indexing is enabled. It does not yet disallow account/login paths.
- `src/app/sitemap.ts` currently emits static pages, products, collections, blog articles, and tag URLs. Tagged blog URLs should be removed from the sitemap.
- `src/lib/seo/launch-route-matrix.ts` and `scripts/seo/probe-launch-seo.mjs` already provide a launch SEO evidence pattern that Phase 18 can extend for URL inventory, robots, blog tags, schema, and crawlable HTML checks.
- `scripts/performance/probe-lighthouse.mjs` and `scripts/launch/run-final-readiness-audit.mjs` already encode the strict performance evidence and dated acceptance rules Phase 18 must honor.

### Collection Routes

- `src/app/(storefront)/collections/[handle]/page.tsx` and `[category]/page.tsx` use the Next 16 `params: Promise` pattern.
- Collection metadata currently returns `title: collection.seo.title ?? collection.title`, which inherits the root brand suffix. SEO-target collection pages need `title.absolute`.
- `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` currently constructs a `StoryDisclosure` from sanitized rich description HTML and passes it into the hero. That places read-more style content above the product grid.
- `src/app/(storefront)/collections/[handle]/_components/hero.tsx` renders a visually hidden `<h1>` in banner mode. The audit wants a visible H1 below/near the banner, not a hidden one.
- `src/app/(storefront)/collections/[handle]/_components/page-helpers.ts` already strips legacy banner blocks, read-more links, scripts/styles, figures/pictures/images/details, and demotes imported H1/H2 content to H3 through `normalizeHtml()`. This is a useful existing guardrail for the one-H1 rule.
- Existing tests around collection page content and helper behavior can be extended instead of adding a separate broad test harness.

### Product Routes

- `src/app/(storefront)/products/[handle]/page.tsx` uses a visible product title H1 in the product information column.
- Product metadata uses `title: product.title`, so retaining the root suffix is acceptable unless title-length evidence later says otherwise.
- Product JSON-LD is present but does not include `aggregateRating`.
- The page currently wraps the main async product content in a broad Suspense fallback. This may create a static shell that is too skeletal for crawler evidence even though the route is server-rendered. Phase 18 should inspect raw HTML before choosing any restructuring.
- Product descriptions and other imported rich content must not emit H1. The plan should include representative PDP HTML evidence or tests.
- `src/lib/reviews/trustoo.ts` fetches Trustoo ratings with cache tags/lifetimes. Product aggregate rating schema should only be emitted if a reliable rating/review count is also visible to users on the PDP.

### Blog Routes

- `src/lib/blog/operations.ts` defines `DEFAULT_BLOG_HANDLE = 'teavision-blogs'` and builds paths under `/blogs/<handle>`.
- `src/app/(storefront)/blogs/[blog]/_lib/metadata.ts` noindexes search-query variants but does not currently noindex tag pages. Tagged blog pages also still appear in the sitemap through `getTagPath()`.
- The `/blog/` simplification is not implemented. Phase 18 should either implement an alias/redirect plan with evidence or explicitly list it as an owner/SEO handoff item.

### Structured Data Routes

- Homepage already emits Organization and WebSite JSON-LD from `src/components/homepage/content.ts`.
- Service/FAQ JSON-LD already exists on several route-specific pages:
  - `src/app/(storefront)/pages/bulk-wholesale-supply/_components/json-ld.tsx`
  - `src/app/(storefront)/pages/private-label-packing/_components/json-ld.tsx`
  - `src/app/(storefront)/pages/tea-bag-manufacturer/_components/json-ld.tsx`
  - `src/app/(storefront)/pages/custom-tea-blends/_components/json-ld.tsx`
  - FAQ-focused pages
- Generic Shopify pages emit WebPage and BreadcrumbList JSON-LD.
- `/pages/contact` has visible phone, email, address, and map/directions content through `page-data.ts`, `LocationMap`, and `Sidebar`. It is the strongest candidate for LocalBusiness JSON-LD because the supporting details are visible on the same page.

### Performance Evidence

- `docs/launch/performance-evidence.md` generated on 2026-06-24 records strict local Lighthouse failures for seven representative routes. LCP fails on homepage, PDP, collection, cart, search, account, and privacy-policy routes; account also has CLS 0.128.
- `docs/launch/final-production-readiness-report.md` generated on 2026-06-24 reports 16/17 automated checks passing, automated code readiness 94/100, and performance as the only failed check.
- No dated owner/staging/field Core Web Vitals acceptance artifact exists. PERF-01 remains blocking unless strict metrics pass or valid acceptance evidence is supplied.

## Requirement Guidance

### SEO-AUDIT-01 - URL Parity and Redirect Coverage

- Reuse `next.config.ts` for deterministic, known path redirects.
- Build a route inventory from existing app routes, sitemap output, policy redirects, Shopify collection/product/blog helpers, and any owner/SEO migration export if supplied.
- Require two-source confirmation before adding redirect pairs to app code.
- Put uncertain, broad, alternate-host, Shopify-domain, DNS, Vercel, and production-host redirects in a severity-ranked handoff register.
- Validate launch evidence against `https://www.teavision.com.au` but keep local/staging proof separate from operator-gated host proof.

### SEO-AUDIT-02 - Visible, Singular Page H1 Structure

- Collection banner pages should render a visible collection-title H1. The banner artwork may remain but cannot be the only visible title.
- Product pages should keep the product title as the only visible H1.
- Imported CMS/Shopify rich content should be sanitized/demoted so it cannot introduce extra H1/H2 content in read-more sections.
- Add tests or raw HTML checks that count visible H1s for representative collection and PDP responses.

### SEO-AUDIT-03 - Collection Read-More Content Placement

- Move long collection story/read-more content below the product grid.
- Keep only banner image, visible H1, short intro, and breadcrumbs above the grid.
- Preserve current sanitization and avoid making the content client-only.
- Add rendering tests that prove story/read-more content follows the product grid in DOM order.

### SEO-AUDIT-04 - Metadata, Canonical, Language, Robots, Sitemap, and Blog Indexation

- Change root HTML language to `en-AU`.
- Use `title.absolute` for homepage, collection, service, and landing pages that must avoid the root `| Teavision` suffix.
- Keep product title suffix behavior unless later evidence shows title-length problems.
- Extend robots to disallow account/login paths while preserving noindex mode behavior.
- Remove blog tag URLs from the sitemap and noindex tagged blog pages.
- Keep canonical and sitemap host env-driven, but add evidence that launch mode uses `https://www.teavision.com.au`.
- Handle `/blog/` simplification explicitly: implement alias/redirect evidence or document as handoff/deferred with reason.

### SEO-AUDIT-05 - Structured-Data Coverage

- Reuse existing JSON-LD components and `JsonLd` serialization patterns.
- Add or verify Service schema only on pages whose visible content supports service details.
- Add LocalBusiness schema on the contact page if fields are supported by visible page content. Do not invent unsupported hours, geo, price range, or review data.
- Add Product aggregateRating only when reliable rating/review count data is visible on the PDP.
- Add FAQ schema only where FAQ question/answer content is visible on the page.
- Extend `scripts/seo/probe-launch-seo.mjs` so schema checks cover Product, Service, LocalBusiness, FAQ, and rating cases without assuming all schema exists on every route.

### SEO-AUDIT-06 - Crawlable Server-Rendered HTML

- Treat the audit's CSR finding as a raw HTML/static-shell concern until proven otherwise.
- Build or extend a probe that fetches representative collection and product pages from a production build/fake-provider server before hydration.
- Assert raw HTML includes meaningful title, visible H1, intro/description, product cards or buy-section content, metadata, canonical, and JSON-LD.
- Avoid broad Suspense fallbacks that hide crawl-critical content in the first response unless raw evidence proves crawlers still receive meaningful content.

### SEO-AUDIT-07 - Core Web Vitals/LCP Evidence Reconciliation

- Re-run Lighthouse after remediation and compare against the PDF audit example and the stricter Phase 17 evidence.
- Do not convert failed strict local metrics into a pass without either passing metrics or a valid dated owner/staging/field acceptance artifact.
- Prioritize evidence around LCP image discovery, render-blocking CSS, unused JS, and broad Suspense/static-shell effects.
- Update the final audit-to-evidence matrix with route-level metric status and residual risk.

## Validation Architecture

Phase 18 needs validation at five layers because the audit findings span code behavior, rendered HTML, metadata routes, structured data, and performance evidence.

| Layer | Purpose | Candidate Command |
| --- | --- | --- |
| Unit/component | H1 sanitization, collection content placement, metadata helpers, blog noindex helpers, JSON-LD builders | `pnpm test:unit` with narrow file filters |
| Metadata/route probes | Robots, sitemap, canonical, redirects, noindex/index behavior, schema presence | `node scripts/seo/probe-launch-seo.mjs --mode enabled` and `--mode redirects` |
| Raw HTML crawl proof | Collection/PDP first response includes crawl-critical content before hydration | A Phase 18 crawlable HTML probe against a built fake-provider server |
| Performance | Lighthouse/Core Web Vitals route evidence and LCP diagnostics | `node scripts/performance/probe-lighthouse.mjs --start-server --base-url http://127.0.0.1:4173` |
| Final evidence | Audit-to-evidence matrix across every PDF finding and owner/operator handoff | Final Phase 18 evidence document plus final readiness audit rerun |

Nyquist sampling guidance for execution:

- After each helper or JSON-LD change, run the nearest unit test.
- After each route metadata, sitemap, robots, or redirect change, run the relevant SEO probe mode.
- After each collection/PDP rendering change, run focused render tests and raw HTML proof for that route family.
- After each performance-affecting rendering or image change, run a targeted Lighthouse probe for the affected route when feasible.
- Before verification, run the complete Phase 18 SEO evidence script/probe set and either strict performance evidence or documented accepted performance evidence.

## Planning Recommendation

Keep the ROADMAP's five-plan split:

1. `18-01` - URL inventory and redirect register.
2. `18-02` - Collection/PDP heading hierarchy and collection read-more placement.
3. `18-03` - Metadata, canonical, robots, sitemap, blog indexation, and `/blog/` decision.
4. `18-04` - Evidence-backed structured data additions and schema probes.
5. `18-05` - Crawlable HTML proof, Lighthouse/CWV evidence reconciliation, and final audit-to-evidence matrix.

Use existing code surfaces first. Most work can extend route-local components, `src/lib/seo/`, blog metadata helpers, launch probes, and existing performance evidence scripts rather than adding new infrastructure.

## Security and Safety Notes

- Do not run real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, success-redirect, live Customer Account OAuth, protected customer data, B2B pricing, Search Console submission, DNS cutover, or production host redirect tests without explicit owner/operator approval and evidence.
- Do not print secrets from `.env.local` or provider clients in SEO/performance evidence.
- Do not add schema fields that are not visibly supported on the same page or by already-approved universal site facts.
- Do not add broad redirect fallbacks for uncertain mappings.
- Do not weaken Phase 17 performance gates.

## Open Questions and Owner-Gated Items

- Owner/SEO migration export for changed URLs, if available.
- DNS, Vercel, alternate-host, and Shopify-domain redirect proof.
- Whether `/blog/` simplification should be implemented in app code now or documented as a launch handoff.
- Search Console sitemap submission and URL inspection proof.
- Dated owner/staging/field Core Web Vitals acceptance evidence, if strict local metrics still fail.
- Production host final `SITE_URL`/`NEXT_PUBLIC_SITE_URL` value and platform redirect behavior.

## Planning Gate Status

The phase is frontend-facing: it changes visible collection/PDP heading structure and content placement. The GSD UI safety gate is enabled, and no `18-UI-SPEC.md` exists in the phase directory at research time. Planning should stop after research/validation until `$gsd-ui-phase 18` is run, unless the user explicitly reruns plan phase with `--skip-ui`.
