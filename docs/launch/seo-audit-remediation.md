# SEO Audit Remediation

This document tracks Phase 18 remediation evidence for the 2026-06-25 staging
SEO audit. Each section maps local code evidence separately from owner/operator
launch proof.

## URL Parity And Redirect Coverage

The URL parity register is maintained in
[`docs/launch/seo-url-parity-register.md`](./seo-url-parity-register.md). It
separates app-owned deterministic redirects from no-op parity URLs and
owner/operator handoff rows.

Phase 18 evidence assumes `https://www.teavision.com.au` is the launch evidence
host. Local app probes can verify deterministic redirects and route parity, but
DNS, Vercel, alternate-host, Shopify-domain, and Search Console proof remains
owner-gated until the production cutover environment and owner access are
available.

## Metadata, Canonical, Robots, Sitemap, And Blog Indexation

### Blog Listing URL

| Audit item                                                                | Decision          | Owner/action/date                                                                                                                      | Local evidence                                                                                                                                                                             |
| ------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Simplify the main blog listing from `/blogs/teavision-blogs/` to `/blog/` | owner/SEO handoff | SEO owner to decide whether `/blog/` should become the canonical listing during migration-stage redirect planning; recorded 2026-06-25 | The app keeps the current Sanity blog listing at `/blogs/teavision-blogs` with no article URL changes; `node scripts/seo/probe-launch-seo.mjs --mode url-audit` reports this handoff item. |

## Structured Data Coverage

| Route                          | Visible evidence source                                                                                                                                         | Schema type                           | Automated check                                                                                                                                                                                                                                                                         | Status                                    | Residual gaps                                                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/pages/contact`               | `src/app/(storefront)/pages/contact/_lib/page-data.ts` feeds visible sidebar/map phone, email, and address content.                                             | `LocalBusiness` with `PostalAddress`  | `node scripts/seo/probe-launch-seo.mjs --mode enabled` checks `LocalBusiness structured data`.                                                                                                                                                                                          | Added in Plan 18-04.                      | Opening hours, geo, price range, reviews, and aggregate rating are intentionally omitted until visible same-page evidence exists. |
| `/pages/faq`                   | `src/app/(storefront)/pages/faq/_lib/data.ts` renders the same FAQ groups visible on the page.                                                                  | `FAQPage`                             | `node scripts/seo/probe-launch-seo.mjs --mode enabled` checks `FAQPage structured data`.                                                                                                                                                                                                | Existing coverage verified.               | FAQ answer substance still depends on owner/content review; no hidden FAQ entries were added.                                     |
| `/pages/bulk-wholesale-supply` | `src/app/(storefront)/pages/bulk-wholesale-supply/_lib/data.ts` renders service page copy and FAQ items.                                                        | `Service`, `FAQPage`                  | `node scripts/seo/probe-launch-seo.mjs --mode enabled` checks both schema types independently.                                                                                                                                                                                          | Existing coverage verified.               | No review or rating schema is emitted.                                                                                            |
| `/pages/private-label-packing` | Route page copy describes private-label tea packing capabilities and rendered service content.                                                                  | `Service`                             | `node scripts/seo/probe-launch-seo.mjs --mode enabled` checks `Service structured data`.                                                                                                                                                                                                | Existing coverage verified.               | No FAQ, review, rating, hours, geo, or price-range schema is emitted without visible route support.                               |
| `/pages/tea-bag-manufacturer`  | Route page copy describes custom tea-bag manufacturing capabilities and rendered service content.                                                               | `Service`                             | `node scripts/seo/probe-launch-seo.mjs --mode enabled` checks `Service structured data`.                                                                                                                                                                                                | Existing coverage verified.               | No review or rating schema is emitted.                                                                                            |
| `/pages/custom-tea-blends`     | `src/lib/contact/custom-tea-blend.ts` feeds visible custom-blend page title, description, and form context.                                                     | `Service`                             | `node scripts/seo/probe-launch-seo.mjs --mode enabled` checks `Service structured data`.                                                                                                                                                                                                | Existing coverage verified.               | No review or rating schema is emitted.                                                                                            |
| `/products/<handle>`           | PDP Product schema uses Shopify product data; aggregate rating is gated on the same finite rating and positive review count rendered in the visible rating row. | `Product`, optional `AggregateRating` | `SEO_PROBE_PRODUCT_PATH=/products/<handle> node scripts/seo/probe-launch-seo.mjs --mode enabled` checks Product and reports aggregateRating as PASS when visible review data exists, WARN when reliable visible review data is absent, and FAIL if schema and visible evidence diverge. | Conditional coverage added in Plan 18-04. | Sitewide Review schema and testimonial-as-review markup remain unsupported without reliable provider-backed visible review data.  |

## Crawlable HTML Evidence

`scripts/seo/probe-crawlable-html.mjs` fetches representative built
fake-provider production routes with `Accept-Encoding: identity` so evidence is
taken from raw server HTML before browser hydration. The default routes are
`/collections/all` and `/products/test-standard-tea`.

Run:

```bash
node scripts/seo/probe-crawlable-html.mjs --start-server --base-url http://127.0.0.1:4173
```

The probe fails if collection HTML lacks one `<h1>`, product-grid/product-card
content, canonical, or collection JSON-LD; if PDP HTML lacks one `<h1>`, the
product title, add-to-cart/buy-section marker, canonical, or Product JSON-LD; or
if a route only returns loading/skeleton shell content.
