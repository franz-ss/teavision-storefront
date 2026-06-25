# Phase 18: SEO Audit Remediation - Pattern Map

**Mapped:** 2026-06-25
**Status:** Complete

## Source Inputs

- `.planning/phases/teavision-18-seo-audit-remediation/18-CONTEXT.md`
- `.planning/phases/teavision-18-seo-audit-remediation/18-RESEARCH.md`
- `.planning/phases/teavision-18-seo-audit-remediation/18-UI-SPEC.md`
- `.planning/phases/teavision-18-seo-audit-remediation/18-VALIDATION.md`
- `AGENTS.md`
- `docs/conventions.md`
- Current SEO, collection, product, blog, schema, launch, and performance source files.

## Existing Patterns To Reuse

| Area                          | Closest Existing Pattern                                                                                 | Executor Notes                                                                                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App redirects                 | `next.config.ts` `redirects()` with static entries plus `getPolicyRedirects()`                           | Add only deterministic, locally testable redirects here. Keep host, DNS, Vercel, Shopify-domain, and uncertain redirects in evidence/handoff docs.                                 |
| Launch SEO route expectations | `src/lib/seo/launch-route-matrix.ts` plus `src/lib/seo/launch-route-matrix.test.ts`                      | Extend typed route expectation arrays instead of hard-coding unrelated checks directly in probes.                                                                                  |
| SEO probe output              | `scripts/seo/probe-launch-seo.mjs`                                                                       | Reuse `pass`, `warn`, `fail`, markdown table output, and mode parsing. Keep secrets and provider payloads out of output.                                                           |
| Canonical host                | `src/lib/seo/site-url.ts`                                                                                | Keep `SITE_URL` / `NEXT_PUBLIC_SITE_URL` env-driven. Evidence should validate `https://www.teavision.com.au` without hard-coding that host into generic helpers.                   |
| Noindex/indexing gate         | `src/lib/seo/noindex.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`                                      | Preserve disabled-indexing behavior. In enabled mode, add audit-required account/login disallows and remove blog tag URLs from sitemap.                                            |
| Collection rendering          | `src/app/(storefront)/collections/[handle]/_components/page-content.tsx`, `hero.tsx`, `product-list.tsx` | Keep route server-first. Move long story content below the grid; make banner collection H1 visible.                                                                                |
| Collection rich HTML cleanup  | `src/app/(storefront)/collections/[handle]/_lib/page-helpers.ts`, `src/lib/shopify/html-content.ts`      | Existing normalization strips legacy collection banner/read-more controls and demotes headings. Tighten compact rich text so imported H1/H2 cannot create competing page headings. |
| Product rendering             | `src/app/(storefront)/products/[handle]/page.tsx`                                                        | Product title remains the only H1. Product JSON-LD and Trustoo rating fetch are already colocated here.                                                                            |
| Blog paths and tag metadata   | `src/lib/blog/operations.ts`, `src/app/(storefront)/blogs/[blog]/_lib/metadata.ts`                       | Add tag noindex and sitemap exclusions without broad blog taxonomy changes. Treat `/blog/` as an audit-listed main-listing simplification.                                         |
| JSON-LD serialization         | `src/lib/seo/serialize-inline-json.ts`, route-local `json-ld.tsx` files                                  | Emit native `<script type="application/ld+json">` and escape `<`. Add schema only where visible page content supports it.                                                          |
| Contact page data             | `src/app/(storefront)/pages/contact/_lib/page-data.ts`                                                   | Phone, email, and address are visible and can support LocalBusiness JSON-LD. Do not invent hours, geo, price range, or reviews.                                                    |
| Performance lifecycle         | `scripts/performance/probe-lighthouse.mjs`                                                               | Reuse `startProductionLifecycle()` and strict failure semantics for crawlable HTML/performance probes.                                                                             |
| Final readiness evidence      | `scripts/launch/run-final-readiness-audit.mjs`, `docs/launch/final-production-readiness-report.md`       | Preserve owner-gated Shopify/admin evidence boundaries and performance acceptance validation.                                                                                      |

## Verification Patterns

- Unit/render tests use Vitest and `renderToStaticMarkup()` for server-rendered components.
- Node probes print markdown tables and set `process.exitCode = 1` when any `FAIL` row remains.
- Lighthouse evidence writes `docs/launch/performance-evidence.md` and fails on strict LCP/CLS/TBT misses unless a valid dated acceptance artifact is supplied to the final readiness audit.
- Launch SEO evidence is documented in `docs/launch/seo-route-evidence.md`; Phase 18 should create or update a dedicated audit remediation evidence document instead of hiding residual risks in comments.

## Planning Constraints

- Read the local Next.js 16 metadata, robots, sitemap, streaming, and Cache Components docs before changing route metadata or Suspense boundaries.
- No real Shopify hosted checkout, payment, shipping, tax, order, success redirect, live Customer Account OAuth, protected customer data, B2B pricing, Search Console submission, DNS cutover, or production host redirect tests without explicit owner/operator approval.
- Do not add stub SEO data when Shopify/Sanity/provider credentials are missing.
- Keep Tailwind 4 token classes and `cn()` for class composition. No raw colors, CSS modules, inline styles, or broad visual redesign.
- Every Phase 18 implementation and evidence row should map back to the SEO audit PDF or an explicit owner/operator handoff.
