# Phase 18: SEO Audit Remediation - Context

**Gathered:** 2026-06-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 18 resolves the 2026-06-25 staging-site SEO audit findings while preserving the headless Shopify storefront architecture, Next.js 16 Cache Components patterns, and existing owner-gated launch boundaries. It owns URL parity and deterministic redirect remediation, visible page heading hierarchy, collection content placement, metadata and indexation fixes, evidence-backed structured data additions, crawlable server-rendered HTML proof for collection and product pages, and post-remediation Core Web Vitals/Lighthouse evidence.

This phase does not run real Shopify hosted checkout, payment, shipping-rate, tax, order-creation, success-redirect, live Customer Account OAuth, protected customer data, B2B pricing, Search Console submission, DNS cutover, or production host redirect tests without explicit owner/operator approval and evidence. Phase 17 PERF-01 remains blocking unless strict metrics pass or a valid dated owner/staging/field Core Web Vitals acceptance artifact is supplied.

</domain>

<decisions>
## Implementation Decisions

### URL Parity and Redirect Ownership
- **D-01:** Build a full launch URL inventory, not just an audit-focused list. Compare live/current-site and headless products, collections, pages, blogs, known legacy nested product URLs, policy/search aliases, and any available SEO/operator slug exports.
- **D-02:** Treat Search Console indexed URL reports, production host redirect behavior, DNS/Vercel redirect proof, and Shopify-domain cutover proof as owner/operator-gated when they cannot be proven locally.
- **D-03:** Put only deterministic, confirmed, stable, locally testable redirects directly into the Next app. Inferred, uncertain, host-level, Search Console, DNS/Vercel, and Shopify-domain redirects belong in the migration handoff register.
- **D-04:** Assume `https://www.teavision.com.au` is the final strongest launch host for evidence and docs. Keep local/staging proof clearly separated from DNS/Vercel/cutover proof.
- **D-05:** Defer the audit suggestion to simplify the blog listing from `/blogs/teavision-blogs` to `/blog/`. Phase 18 keeps `/blogs/teavision-blogs` canonical, fixes blog tag indexation/sitemap behavior now, and records `/blog/` as a migration/SEO-operator decision.

### Visible H1 and Collection Content Placement
- **D-06:** Banner-image collection pages must show a visible collection H1 below the banner artwork. Banner art can remain first, but collection pages need visible breadcrumb, H1, and brief intro before the product grid.
- **D-07:** Long collection read-more SEO content belongs below the product grid. Above the grid should stay lean: breadcrumb, optional banner/hero image, visible H1, and brief intro.
- **D-08:** Preserve exactly one page H1. Sanitize or demote imported Shopify rich-content H1/H2 headings to lower levels, generally H3+, inside collection read-more and product description blocks.
- **D-09:** Product pages must enforce a strict one-visible-H1 rule: the product title is the only visible H1. Product descriptions, related/recommendation content, reviews, and imported snippets must not emit H1. Add representative PDP HTML evidence or tests.

### Metadata, Canonical Host, Robots, and Blog Indexation
- **D-10:** Remove or override the automatic `| Teavision` title suffix for SEO-target pages only: homepage, collection pages, and service/landing pages. Product pages may keep the brand suffix unless evidence shows title-length problems.
- **D-11:** Make audit metadata/indexation fixes explicit and tested: root `lang="en-AU"`, account/login surfaces disallowed in `robots.txt`, `/search` remains noindexed, blog tag pages are removed from the sitemap, and tagged blog pages receive noindex behavior.
- **D-12:** Keep canonical and sitemap URL generation env-driven through `SITE_URL` / `NEXT_PUBLIC_SITE_URL`. Phase 18 evidence and docs should validate against `https://www.teavision.com.au` as the launch target while marking DNS/Vercel redirect proof as operator-gated.
- **D-13:** Filtered/category collection URLs, such as `/collections/dried-herbs/categories_australian-tea`, may render for UX but should canonicalize to the parent collection and stay out of sitemap unless later SEO evidence proves a filtered URL is intentionally ranking.

### Structured Data and Crawl/Performance Evidence
- **D-14:** Add Service, LocalBusiness, FAQ, or Review structured data only where visible page content and trustworthy data already support it. Document gaps instead of inventing schema for audit checklist coverage.
- **D-15:** Review structured data is limited to PDP Product aggregate ratings when reliable Trustoo/Shopify-derived rating and review count data exists and is visibly represented. Do not add sitewide Review schema or testimonial-as-review markup without reliable visible source data.
- **D-16:** Treat the audit's "CSR issue" as a crawlable HTML/static-shell problem unless new evidence proves true client-only rendering. Built production/fake-provider evidence must show representative collection and product responses include meaningful title, intro/description, product/card or buy-section content, metadata, canonical, and JSON-LD in HTML before browser hydration.
- **D-17:** Broad skeleton shells must not mask crawl-critical collection or product content in first-response HTML. Planners should investigate Suspense/loading boundaries and Cache Components behavior using local Next 16 docs before changing route-level streaming.
- **D-18:** Rerun CWV/Lighthouse after SEO fixes. Performance passes only if strict route metrics pass or a valid dated owner/staging/field Core Web Vitals acceptance artifact is supplied. Otherwise performance remains blocking and mitigations must be recorded.
- **D-19:** Produce a final audit-to-evidence matrix mapping each PDF finding to remediation, code/tests/scripts, local proof, owner/operator handoff items, and residual risks. The matrix must include URL inventory/redirect register, H1 checks, metadata/robots/sitemap checks, structured-data validation, crawlable-HTML proof, and performance evidence.

### the agent's Discretion
No selected area was delegated to the agent. The planner has implementation discretion only inside the decision boundaries above.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase and Milestone Scope
- `.planning/ROADMAP.md` - Defines Phase 18 goal, requirements, dependencies, success criteria, plans, and cross-cutting constraints.
- `.planning/REQUIREMENTS.md` - Defines v1.4 readiness requirements and the still-blocked `PERF-01` status that Phase 18 must reconcile.
- `.planning/PROJECT.md` - Captures v1.4 production-readiness context, Shopify authority boundaries, launch gates, and current milestone constraints.
- `.planning/STATE.md` - Captures current blocked Phase 17 state, PERF-01 evidence status, and Phase 18 queue context.
- `D:/Downloads/SEO Audit - Teavision Staging Site.pdf` - External audit source for Phase 18 findings. Use as source evidence, but write repo-relative remediation/evidence artifacts for execution.
- `.planning/phases/16-legal-consent-analytics-and-seo-launch-coverage/16-CONTEXT.md` - Defines inherited legal, consent, analytics, SEO launch flip, sitemap, Search Console, and owner-gated SEO proof decisions.
- `.planning/phases/17-operations-performance-and-final-production-readiness-audit/17-CONTEXT.md` - Defines inherited operations, performance, local production e2e, final readiness report, and owner-gated proof decisions.

### Next.js 16 Docs to Read Before Code Changes
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` - Current Next 16 metadata behavior and title/canonical/OG guidance.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` - Current `generateMetadata` API behavior.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md` - Current robots metadata route behavior.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` - Current sitemap metadata route behavior.
- `node_modules/next/dist/docs/01-app/02-guides/streaming.md` - Current streaming and Suspense guidance relevant to the audit's crawlable-HTML concern.
- `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md` - Cache Components migration behavior relevant to server-first route rendering.
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md` - Current Next config docs for Cache Components.

### Existing SEO and Evidence Surface
- `next.config.ts` - Owns current app-level redirects and security headers; Phase 18 redirects should be deterministic and locally testable here or through established helpers.
- `src/app/layout.tsx` - Root metadata template and `<html lang>` source.
- `src/app/robots.ts` - Robots metadata route; Phase 18 should add account/login disallows while preserving noindex-mode behavior.
- `src/app/sitemap.ts` - Sitemap route; currently includes blog tag URLs and dynamic Shopify/Sanity URLs.
- `src/lib/seo/site-url.ts` - Env-driven canonical host boundary via `SITE_URL` / `NEXT_PUBLIC_SITE_URL`.
- `src/lib/seo/noindex.ts` - Noindex helper used by route metadata.
- `src/lib/seo/launch-route-matrix.ts` - Existing Phase 16 route matrix for status, canonical, noindex, redirect, sitemap, and structured-data expectations.
- `scripts/seo/probe-launch-seo.mjs` - Existing SEO probe for disabled/enabled indexing, redirects, robots, sitemap, canonicals, and structured data.
- `docs/launch/seo-route-evidence.md` - Existing Phase 16 SEO evidence and owner-gated Search Console notes.
- `docs/launch/analytics-and-indexing-runbook.md` - Existing launch runbook for indexing, Search Console, and analytics verification.

### Product, Collection, Blog, and Structured Data Surfaces
- `src/app/(storefront)/collections/[handle]/page.tsx` - Collection metadata, title, canonical, and OG behavior.
- `src/app/(storefront)/collections/[handle]/[category]/page.tsx` - Category collection canonical behavior to parent collection.
- `src/app/(storefront)/collections/[handle]/_components/page-content.tsx` - Collection route rendering, Suspense-sensitive data flow, rich description placement, JSON-LD, prev/next link tags, and product grid.
- `src/app/(storefront)/collections/[handle]/_components/hero.tsx` - Collection banner/default hero rendering; currently uses `sr-only` H1 for banner mode.
- `src/app/(storefront)/collections/[handle]/_components/collection-rich-hero.tsx` - Rich hero rendering for migrated collection content.
- `src/app/(storefront)/collections/[handle]/_components/json-ld.tsx` - CollectionPage, BreadcrumbList, and ItemList JSON-LD.
- `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts` - Collection path helpers, rich hero parsing, heading normalization, category URL behavior, and pagination URL helpers.
- `src/app/(storefront)/products/[handle]/page.tsx` - PDP metadata, Suspense fallback, Product/Breadcrumb JSON-LD, product title H1, Trustoo rating fetch, product description, reviews, and recommendations.
- `src/lib/reviews/trustoo.ts` - Trustoo review summary adapter used for product rating/review count data.
- `src/app/(storefront)/blogs/[blog]/_lib/metadata.ts` - Blog listing/tag metadata, canonical, and noindex behavior.
- `src/lib/blog/operations.ts` - Blog paths, tag paths, canonical normalization, and article/tag helpers.
- `src/app/(storefront)/page.tsx` and `src/components/homepage/content.ts` - Homepage metadata and Organization/WebSite JSON-LD.
- `src/app/(storefront)/pages/**/_components/json-ld.tsx` - Existing page-specific JSON-LD for FAQ, service, and static landing pages.

### Performance and Final Readiness Evidence
- `scripts/performance/probe-lighthouse.mjs` - Current local Lighthouse/CWV probe and evidence writer.
- `scripts/launch/run-final-readiness-audit.mjs` - Final readiness audit runner and performance-acceptance handling.
- `docs/launch/performance-evidence.md` - Latest local mobile Lighthouse evidence, currently showing strict FAIL rows for seven representative routes.
- `docs/launch/final-production-readiness-report.md` - Latest final readiness report, currently 94/100 and not launch-ready due to performance.
- `docs/testing/customer-accounts-setup.md` - Customer Account OAuth, protected customer data, checkout handoff, and owner-approval launch gates.
- `docs/testing/cart-checkout-uat.md` - Hosted checkout UAT guidance and prohibition on real checkout/payment/order testing before approval.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/seo/site-url.ts`, `src/lib/seo/noindex.ts`, `src/app/robots.ts`, and `src/app/sitemap.ts` already centralize canonical host, noindex, robots, and sitemap behavior.
- `src/lib/seo/launch-route-matrix.ts` and `scripts/seo/probe-launch-seo.mjs` already provide a launch SEO evidence pattern that Phase 18 can extend for URL inventory, blog tags, account robots disallows, and structured-data checks.
- `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts` already strips legacy collection banner/read-more controls and demotes imported collection H1/H2 to H3 in normalized rich content.
- `src/app/(storefront)/products/[handle]/page.tsx` already emits Product and Breadcrumb JSON-LD and fetches Trustoo rating/review count summaries that can support aggregate rating only when visible/reliable.
- Existing page-specific JSON-LD components cover Organization/WebSite, Product, BreadcrumbList, CollectionPage/ItemList, BlogPosting, FAQPage, and some service-like pages. Phase 18 should reuse `serializeInlineJson()` and existing route-local JSON-LD patterns.
- `scripts/performance/probe-lighthouse.mjs` and `scripts/launch/run-final-readiness-audit.mjs` already encode the strict performance evidence and dated acceptance rules that Phase 18 must honor.

### Established Patterns
- Storefront pages remain server-first Next.js 16 App Router routes. Push client behavior to interactive leaves only and do not convert SEO-critical collection/product surfaces to client-rendered shells.
- Dynamic App Router segments use the Next.js 16 `params: Promise<{...}>` pattern and must await params before destructuring.
- Shopify, Sanity, Searchanise, Trustoo, and Customer Account data should flow through existing operation/helper boundaries; missing Shopify credentials should fail fast rather than falling back to stub SEO data.
- Styling remains Tailwind 4 token utilities with `cn()` for class composition. Phase 18 should preserve the warm/botanical design system while making H1s visible.
- Real Shopify hosted checkout, payment, shipping, tax, order, success redirect, live Customer Account OAuth, protected customer data, B2B pricing, Search Console, DNS, and production host redirect proof remain owner/operator-gated.
- Current codebase maps were generated before later v1.4 work and may be stale. Planners should verify current files directly before implementation.

### Integration Points
- URL inventory and redirect register connect to `next.config.ts`, `src/lib/seo/launch-route-matrix.ts`, `scripts/seo/probe-launch-seo.mjs`, Shopify/Sanity route helpers, and a new Phase 18 evidence document.
- Collection heading/content remediation connects to `hero.tsx`, `collection-rich-hero.tsx`, `page-content.tsx`, `product-list.tsx`, `StoryDisclosure`, and `page-helpers.ts`.
- Product one-H1 remediation connects to `src/app/(storefront)/products/[handle]/page.tsx`, PDP description sanitization, review/recommendation sections, and representative HTML assertions.
- Metadata/indexation remediation connects to `src/app/layout.tsx`, route `generateMetadata()` functions, blog tag metadata, `robots.ts`, `sitemap.ts`, `site-url.ts`, and the SEO probe.
- Structured-data remediation connects to homepage content JSON-LD, route-local page JSON-LD components, PDP Product JSON-LD, collection JSON-LD, Trustoo review data, and visible page content.
- Crawlable-HTML proof connects to built production/fake-provider lifecycle, raw HTML fetch checks before hydration, and representative product/collection fixtures.
- Performance reconciliation connects to `pnpm test:performance`, final readiness audit, `docs/launch/performance-evidence.md`, and any valid dated performance acceptance artifact if one is supplied.

</code_context>

<specifics>
## Specific Ideas

- The audit PDF explicitly flags collection pages with multiple H1s and a hidden/non-visible main H1 on some main category pages.
- The audit asks for collection pages to keep only breadcrumb, optional banner image, visible H1, and brief intro before the product grid.
- The audit flags product pages for multiple H1s coming from content not visibly on the page, including other product, collection, and homepage content paths.
- The audit suggests removing unwanted brand title suffixes from homepage, collections, and SEO-target service pages, while product pages can usually keep the suffix.
- The audit requests `lang="en-AU"`, account/login disallows in robots, final strongest host `https://www.teavision.com.au`, and blog tagged pages noindexed to avoid cannibalizing the main blog listing.
- The audit reports Organization and Product schema as present, and Service, LocalBusiness, Review, and FAQ schema as missing. Phase 18 should not invent unsupported schema.
- The audit's CSR screenshots show collection/PDP skeleton-like shells during loading; Phase 18 should prove meaningful HTML before hydration rather than merely proving browser-rendered DOM after hydration.
- The audit's Lighthouse example showed mobile LCP around 3.5s and highlighted render-blocking requests and unused JavaScript; current Phase 17 evidence is stricter and still records seven route-level performance FAIL rows.

</specifics>

<deferred>
## Deferred Ideas

- `/blog/` canonical simplification and redirect can be revisited as a migration/SEO-operator decision after Phase 18. Phase 18 keeps `/blogs/teavision-blogs` canonical.

</deferred>

---

*Phase: 18-SEO Audit Remediation*
*Context gathered: 2026-06-25*
