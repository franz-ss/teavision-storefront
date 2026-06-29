# SEO Audit Remediation Review Email

> ⚠ **Superseded (2026-06-29).** This draft predates the Phase 19 H1 work; do not
> send it as-is. The authoritative, cited response to the audit (pages 2-9) —
> including the multiple-H1 explanation, the banner visible-H1 fix, and the
> brand-suffix removal — is `docs/launch/seo-audit-pages-2-9-response.md`. Note:
> `cacheComponents` was kept enabled (the Approach-A disable was reverted).

Subject: Teavision staging SEO audit updates ready for review

Hi team,

We have completed the app-controlled remediation items from the Teavision staging-site SEO audit.

The latest staging or production-candidate build should now include updates across URL handling, heading structure, collection content order, metadata, robots/sitemap/indexation, structured data, crawlable HTML, and Core Web Vitals handling.

When you have a chance, could you please review the updated build and let us know if anything still needs adjustment from the SEO side?

The main areas changed are:

| Area                           | Update                                                                                                                                                                                                                                         | Review focus                                                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| URL structure and slug parity  | Product, collection, and generic page URL patterns were kept aligned with the current site. Confirmed app-owned redirects were separated from migration-stage redirect decisions.                                                              | Priority slug coverage and any legacy URLs that still need migration-stage 301s.                                    |
| Collection page H1s            | Collection pages now render a visible collection H1. Imported or hidden content should no longer create extra H1/H2 conflicts above the product grid.                                                                                          | Main-category and normal collection templates, especially pages with rich content.                                  |
| Collection read-more placement | Collection story/read-more content now appears after the product grid. The above-grid area is limited to breadcrumb, optional banner, visible H1, and brief intro.                                                                             | Whether the new order still supports the intended SEO content strategy on priority collections.                     |
| Product page H1s               | Product pages keep one product H1. Product description/imported content should no longer create multiple page-level H1s.                                                                                                                       | Products with rich Shopify descriptions, as these are the most likely edge cases.                                   |
| Page titles                    | Homepage, collection pages, collection index, and targeted service/landing pages should no longer inherit the automatic brand suffix. Product pages intentionally keep the brand suffix unless SEO prefers otherwise.                          | SERP title length and intent on target pages, plus any product-title exceptions.                                    |
| Technical metadata             | Document language was updated to Australian English, and indexation rules were tightened for private/account surfaces and tagged blog pages.                                                                                                   | Normal crawl QA sweep.                                                                                              |
| Sitemap and canonicals         | Sitemap, canonical, and final-host behaviour are aligned to the intended production host, `https://www.teavision.com.au`, once deployed.                                                                                                       | Production host/canonical behaviour after cutover, including alternate host redirects.                              |
| Structured data                | Product schema remains present. Contact page should include LocalBusiness schema. Supported service and FAQ pages should expose Service and FAQPage schema. Product rating schema should only appear when reliable visible review data exists. | Representative rich-result validation and whether any additional Review schema is justified by visible review data. |
| Crawlable HTML / CSR concern   | Representative collection and product pages should expose meaningful HTML before client-side JavaScript runs.                                                                                                                                  | Crawler output or rendered/source comparisons for any remaining pages that look thin before hydration.              |
| Core Web Vitals / LCP          | Core Web Vitals/LCP was reviewed. Local lab testing still showed LCP issues on some representative routes, and the remaining local lab failures have been accepted as non-blocking for automated readiness.                                    | Field or staging Core Web Vitals, especially LCP, on key templates if data is available.                            |

There are also a few items that still depend on SEO direction, owner input, or production environment validation:

- Final migration 301 redirect export for any changed slugs.
- Whether `/blog/` should become the canonical blog listing URL.
- DNS/Vercel/apex-to-www/HTTP-to-HTTPS redirect proof.
- Shopify-domain redirect behavior after cutover.
- Search Console sitemap submission.
- Search Console URL inspection.
- Production canonical validation.
- Field or staging Core Web Vitals validation.
- Additional Review schema, only if reliable visible review data supports it.

Suggested pages to include in the review:

- `/`
- `/collections/all`
- A main category collection page
- A normal collection page with read-more content
- A representative product page
- `/pages/contact`
- `/pages/faq`
- `/pages/bulk-wholesale-supply`
- `/pages/private-label-packing`
- `/pages/tea-bag-manufacturer`
- `/pages/custom-tea-blends`
- `/blogs/teavision-blogs`
- A tagged blog listing URL, if available
- `/robots.txt`
- `/sitemap.xml`

It would be helpful to know:

1. Which items look resolved from the SEO side.
2. Which items still need adjustment before launch.
3. Which items should remain as migration or cutover handoff tasks.
4. Whether any additional SEO requirements should be added before final production launch.

Thanks.
