# Phase 16: Legal, Consent, Analytics, and SEO Launch Coverage - Context

**Gathered:** 2026-06-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 16 closes launch-blocking trust, legal-route, consent, analytics, and SEO-indexing gaps for the v1.4 production-readiness milestone. It owns static legal/policy pages and redirects, consent defaults and preference surfaces, a consent-aware analytics adapter, GA4-first ecommerce/lead events, launch sitemap/indexing checks, and evidence docs for owner-gated Search Console and purchase tracking.

This phase covers `LEGAL-01`, `LEGAL-02`, `SEO-01`, `CONSENT-01`, `CONSENT-02`, `ANALYTICS-01`, `ANALYTICS-02`, and `ANALYTICS-03`. It does not invent final legal promises, run production analytics from CI, run real Shopify hosted checkout/payment/order tests, or make Phase 17 operations/performance/final-audit changes.

</domain>

<decisions>
## Implementation Decisions

### Policy Routes and Legacy Links
- **D-01:** Legal and policy pages must be fully code-owned static app pages for launch. Shopify policy/page content may be checked as a reference only; runtime policy rendering must not depend on Shopify content availability.
- **D-02:** Use clean headless `/pages/*` URLs as canonicals for legal pages, including `/pages/privacy-policy`, `/pages/shipping-policy`, `/pages/refund-policy`, `/pages/terms-of-service`, and `/pages/cookie-preferences`.
- **D-03:** Redirect `/policies/*` and legacy Shopify policy HTML URLs to the canonical headless `/pages/*` policy URLs.
- **D-04:** Static legal pages with pending owner/legal review must render visible review banners so visitors and launch reviewers can see draft status. Do not make pending-review pages look silently final.
- **D-05:** The full launch policy set is blocking: privacy, terms, shipping, returns/refunds, cookie preferences, compliance/privacy rights, footer legal links, `/policies/*`, and legacy Shopify policy HTML URLs.
- **D-06:** Create `/pages/cookie-preferences` as the stable visitor-facing page for reviewing or changing consent. Link it from legal, footer, and consent banner/preference surfaces.
- **D-07:** Legal route launch evidence must include a per-page approval matrix with URL, implementation status, owner/legal approval state, last-reviewed date, and proof.
- **D-08:** Verification must include an automated route matrix for policy/legal status codes, redirects, canonical metadata, noindex behavior, footer links, and no 404s.

### Consent Defaults and Preference UI
- **D-09:** Consent must deny non-essential tracking by default. No analytics or marketing tags load until the visitor grants the relevant consent.
- **D-10:** Implement a first-visit consent banner with Accept, Reject, and Manage controls.
- **D-11:** Consent preferences must be changeable through a preference modal/page flow backed by `/pages/cookie-preferences`.
- **D-12:** Track three consent categories for launch: essential, analytics, and marketing.
- **D-13:** Evaluate Shopify Customer Privacy API during planning/implementation. Either wire it through the centralized consent adapter or explicitly document why it is not applicable. Consent state should stay centralized.

### Analytics Destinations and Events
- **D-14:** Prioritize GA4 for launch analytics. GTM, Meta, Klaviyo, and Shopify pixels should be explicit env-gated destinations or documented disabled destinations.
- **D-15:** Launch-blocking events include core ecommerce plus wholesale lead events: product view, search, add-to-cart, cart update, checkout start, newsletter signup, contact enquiry submit, wholesale enquiry submit, and NPD enquiry submit.
- **D-16:** Use a typed consent-aware analytics adapter with a fake/test sink so local tests and CI never send production analytics events.
- **D-17:** Track checkout-start locally. Purchase/order tracking is owner-gated and must be documented as requiring Shopify hosted checkout/order or destination verification.
- **D-18:** Analytics destination verification belongs in the launch runbook before and after cutover, with production destination IDs/configuration handled through safe env configuration and no secrets in client code.

### Launch SEO Flip and Evidence
- **D-19:** Keep `DISABLE_INDEXING` as the explicit launch gate for indexing. Add tests/evidence for both disabled and enabled states and document the launch step.
- **D-20:** Produce automated SEO route-matrix evidence covering robots, sitemap, canonicals, noindex behavior, structured-data presence/safety, and policy redirects across representative routes.
- **D-21:** Expand sitemap launch coverage to legal pages plus key static landing/service pages where indexable, including the owner-authored bespoke landing pages that are intended for launch discovery.
- **D-22:** Search Console work is owner/access-gated. Phase 16 should document sitemap submission, property checks, and post-cutover inspection steps, but actual submission/access proof should not block code completion unless the owner provides access.

### the agent's Discretion
No selected area was delegated to the agent. The planner has implementation discretion only inside the decision boundaries above.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase and Milestone Scope
- `.planning/ROADMAP.md` - Defines Phase 16 goal, dependencies, success criteria, and notes for planning.
- `.planning/REQUIREMENTS.md` - Defines v1.4 `LEGAL-01`, `LEGAL-02`, `SEO-01`, `CONSENT-01`, `CONSENT-02`, `ANALYTICS-01`, `ANALYTICS-02`, and `ANALYTICS-03`.
- `.planning/PROJECT.md` - Captures current v1.4 milestone context, launch gates, Shopify authority boundaries, and out-of-scope limits.
- `.planning/STATE.md` - Captures current project state and known external/admin-dependent launch gates.
- `.planning/research/SUMMARY.md` - Summarizes the 2026-06-22 production-readiness research, including Phase 16 legal, consent, analytics, and SEO findings.
- `.planning/phases/15-security-dependency-and-runtime-header-hardening/15-CONTEXT.md` - Defines inherited Phase 15 CSP/header/security decisions, especially that analytics hosts belong to Phase 16.

### Existing Legal and Page Surfaces
- `src/components/layout/footer/data.ts` - Current footer legal links and legacy external terms link that Phase 16 must replace or verify.
- `src/app/(storefront)/pages/[...slug]/page.tsx` - Generic Shopify page route and reserved-handle behavior.
- `src/app/(storefront)/pages/[...slug]/_lib/page-profile.ts` - Existing policy-page profiles and related-link behavior.
- `src/app/(storefront)/pages/[...slug]/_lib/compliance.ts` - Existing compliance/privacy-right request helpers and privacy link constants.
- `src/app/(storefront)/pages/terms-conditions/page.tsx` - Current bespoke terms route that fetches Shopify page metadata and renders static terms content.
- `src/app/(storefront)/pages/terms-conditions/_components/terms-conditions-content.tsx` - Current static policy body and legacy Shopify policy links.

### SEO and Structured Data
- `src/app/robots.ts` - Existing robots metadata route driven by noindex mode and sitemap URL.
- `src/app/sitemap.ts` - Existing sitemap implementation and static URL list that Phase 16 should expand.
- `src/lib/seo/noindex.ts` - Existing noindex helper and metadata wrapper used across routes.
- `src/lib/seo/site-url.ts` - Existing canonical site URL helper and production fail-fast behavior.
- `src/lib/seo/serialize-inline-json.ts` - Existing safe inline JSON serialization helper for structured data and script payloads.
- `src/app/layout.tsx` - Root metadata defaults and noindex wrapper.
- `src/app/(storefront)/products/[handle]/page.tsx` - Product metadata, JSON-LD, and existing Shopify analytics script placement.

### Consent, Analytics, and Security Policy
- `src/app/(storefront)/products/[handle]/_lib/shopify-analytics.ts` - Existing Shopify product analytics metadata helpers; useful context but not a full consent-aware adapter.
- `src/lib/security/headers.ts` - Phase 15 header/CSP policy where Phase 16 analytics hosts may need explicit allowlist changes.
- `.env.example` - Public/server environment variable documentation; Phase 16 analytics and consent flags should be documented here without secrets.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/seo/noindex.ts` and `src/lib/seo/site-url.ts` already centralize noindex and canonical site-url behavior for launch indexing.
- `src/app/robots.ts` and `src/app/sitemap.ts` already expose metadata routes and can be extended/tested for launch-state coverage.
- `src/components/layout/footer/data.ts` is the central footer link source and should be updated to canonical legal URLs.
- `src/app/(storefront)/pages/[...slug]/_lib/page-profile.ts` and `_lib/compliance.ts` already contain policy/compliance vocabulary that can inform static page structure.
- `src/lib/security/headers.ts` owns the report-only CSP from Phase 15; analytics script/connect hosts should be added deliberately with tests.
- `src/app/(storefront)/products/[handle]/_lib/shopify-analytics.ts` provides existing Shopify product-page analytics metadata context, but Phase 16 should not treat it as the final consent-aware adapter.

### Established Patterns
- App Router dynamic routes use the Next.js 16 `params: Promise<{...}>` pattern and must await params before destructuring.
- Storefront pages are server-first. Keep consent/analytics interactivity in client leaves and keep legal content/static route composition server-rendered where possible.
- Styling must use Tailwind token classes and `cn()` for class composition; no CSS modules, inline styles, raw hex/rgb classes, or cool gray palette.
- External provider credentials and destination IDs should be read through env helpers and documented in `.env.example`; do not expose secrets through client code.
- Real Shopify hosted checkout, payment, tax, shipping, order creation, success redirect, Customer Account OAuth, protected customer data, and B2B pricing tests remain owner-approved launch gates.

### Integration Points
- Legal pages and redirects connect to `src/app/(storefront)/pages/**`, `next.config.ts` redirects, footer data, route tests, and sitemap/static URL lists.
- Consent UI connects to the root/storefront shell, a client-side banner/preference leaf, persistent consent storage, `/pages/cookie-preferences`, and analytics tag gating.
- Analytics connects to product/search/cart/contact/newsletter/wholesale/NPD interaction boundaries, a typed adapter, fake/test sink, GA4 config, and env-gated destination modules.
- SEO evidence connects to metadata routes, route handlers/pages, structured data script output, noindex mode, sitemap generation, policy redirects, and launch runbook documentation.

</code_context>

<specifics>
## Specific Ideas

- User wants recommendations stated during discussion; this affected the interaction style, not an implementation requirement.
- The consent page should be reachable at `/pages/cookie-preferences`.
- The analytics launch shape should be GA4-first but designed so GTM, Meta, Klaviyo, and Shopify pixels have explicit disabled/configurable status rather than ambiguous absence.
- Search Console actions should be documented and owner/access-gated rather than blocking code completion.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within Phase 16 scope.

</deferred>

---

*Phase: 16-Legal, Consent, Analytics, and SEO Launch Coverage*
*Context gathered: 2026-06-22*
