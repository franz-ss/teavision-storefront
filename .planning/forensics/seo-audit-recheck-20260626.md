# SEO Audit Recheck Against PDF

> ⚠ **Update (2026-06-29).** Point-in-time forensic snapshot from 2026-06-26. Its
> H1 rows checked single-route HTML only and did not surface the defect the audit
> actually flagged — multiple H1s in the **accumulated soft-nav DOM** (Cache
> Components `<Activity>` retention) — nor that the banner-mode H1 was a non-visible
> 11px breadcrumb crumb. Both were investigated and resolved in Phase 19. The
> Approach-A "disable cacheComponents" remediation was tried and **reverted**;
> cacheComponents remains enabled. Authoritative, current status for every audit
> item: `docs/launch/seo-audit-pages-2-9-response.md`.

Date: 2026-06-26

Source document: `D:/Downloads/SEO Audit - Teavision Staging Site.pdf`

Verification scope:

- Rendered all 16 PDF pages to PNG and inspected the screenshot pages.
- Extracted text for each PDF page.
- Checked live staging at `https://teavision-storefront.vercel.app`.
- Checked local production build at `http://127.0.0.1:3100` from the current worktree.
- Ran stream-order checks for the PDF collection/PDP URLs.
- Ran local mobile Lighthouse on `/`, `/collections/wholesale-bulk-tea`, and `/products/organic-masala-chai`.

## Summary

Phase 18 is not strictly compliant with the PDF yet.

Live staging still fails major PDF requirements: collection read-more placement, CSR/skeleton first-response behavior, indexability/sitemap because noindex mode is enabled, strong `www` host canonicalization, `/blog`, several title suffix cases, and Core Web Vitals/LCP.

The current local worktree now fixes the PDF screenshot CSR/skeleton failure for the tested collection and PDP routes: the upgraded stream-order probe passes locally for `/collections/wholesale-bulk-tea` and `/products/organic-masala-chai`, with one raw H1 each and no skeleton marker before crawl-critical content. This has not been deployed; the current Vercel staging URL still fails the same stream-order check.

## Finding Matrix

| PDF pages | Requirement / screenshot | Live staging result | Local worktree result | Verdict |
| --- | --- | --- | --- | --- |
| 1 | URL shapes should stay `/collections/<collection>`, `/products/<product>`, `/pages/<page>`; changed slugs need 301 redirects. | Main route shapes exist for tested URLs. `/blog` is 404. Host/slug migration coverage not proven. | Same. `next.config.ts` only has nested collection-product and policy redirects. | Partial |
| 1 | Homepage heading structure is good; no issue expected. | Pass: one visible H1, `Australia's #1 tea company`. | Pass: one visible H1. | Pass |
| 2-3 | Collection pages must not have multiple H1s; main H1 must be visible, not hidden. Screenshots show `wholesale-bulk-tea` H1 audit. | Partial: tested collection has one visible H1 in completed HTML, but still has skeleton stream issue. | Pass for tested route: exact local probe reports one `Wholesale Tea` H1 and no duplicate raw H1. | Partial |
| 4-5 | Collection read-more content should be after product grid. Before grid should only have optional banner, H1, brief intro, breadcrumb. | Fail: `Read more about` appears before `product-grid` in raw HTML. | Pass for order: `product-grid` appears before `Read more about`. | Partial |
| 6-7 | Product pages must not have multiple H1s from unrelated product/collection/home content. | Pass for completed HTML on `organic-masala-chai`: one H1. Still fails CSR skeleton first-response. | Pass for tested route: exact local probe reports one `Organic Spicy Masala Chai` H1 and no duplicate raw H1. | Partial |
| 8 | Service, generic, blog pages should have no page-structure issues. Main blog could be simplified to `/blog/`. | Fail/partial: `/blog` is 404; blog listing has two H1s in raw HTML. | Same. Bulk service page has zero H1 in the raw check. | Fail |
| 8-9 | Remove automatic brand suffix from homepage, collection, and SEO-targeted service page titles. Product titles may keep suffix. Meta descriptions look intact. | Partial: collection title has no suffix; several service pages still have `| Teavision`; FAQ has `| Teavision | Teavision`. Meta descriptions present. | Same. | Partial |
| 9 | Internal links look natural via You Might Like / Related Products. | Not exhaustively audited; sections exist in navigation/raw content patterns. | Not exhaustively audited. | Not fully verified |
| 9 | `<html lang>` should be `en-AU`. | Pass. | Pass. | Pass |
| 10 | Strongest URL should be `https://www.teavision.com.au/`; alternate host variants should redirect there. | Fail: canonicals emit `https://teavision.com.au` non-www from staging pages. No host redirect proof. | Fail: `SITE_URL` default and sitemap use `https://teavision.com.au` non-www. | Fail |
| 10 | robots.txt should disallow login/account URLs and sitemap should use strongest URL. | Partial: account/login disallows present. Live sitemap is omitted/empty because noindex mode is enabled. | Partial: account/login disallows present; sitemap uses non-www, not the PDF's `www` strongest URL. | Partial |
| 11 | Canonical tags look intact across pages. | Partial: canonical tags exist, but use non-www host. | Partial: canonical tags exist, but use non-www host. | Partial |
| 11 | Normal pages should be indexable; tagged blog pages should be noindex and absent from sitemap. | Fail: live staging pages return `noindex, nofollow, noarchive`; sitemap has zero URLs. Tagged page noindex passes. | Pass/partial: normal pages are indexable locally; tagged blog page is noindex; sitemap excludes `/tagged/`; but host is non-www. | Partial |
| 12-13 | Structured data: Organization and Product present; add Service, LocalBusiness, Reviews, FAQ. | Partial: Organization, Product, Service, LocalBusiness, FAQ present on tested routes. Review / aggregateRating absent on tested PDP. | Same. | Partial |
| 13-14 | CSR issue: collection/product pages must expose crawl-critical HTML on first visit, not skeleton/JS-only shell. Screenshots show skeletons on `/collections/wholesale-bulk-tea` and `/products/organic-masala-chai`. | Fail: upgraded probe still finds skeleton before crawl-critical content on current staging. | Pass locally: upgraded probe passes both exact PDF routes; collection content appears in chunk 2 and PDP content appears in chunk 1, with no skeleton marker before content. | Partial until deployed |
| 15-16 | Core Web Vitals: reduce LCP; screenshots highlight render-blocking requests and unused JS. | Not rerun on live. Existing screenshot issue remains unproven as fixed. | Fail: local Lighthouse LCP failed: `/` 4850ms, collection 6098ms, product 7024ms. | Fail |

## Key Raw Evidence

- Current staging collection stream: upgraded probe fails because skeleton appears before content (skeleton chunk 6, content chunk 25).
- Current staging product stream: upgraded probe fails because skeleton appears before content (skeleton chunk 6, content chunk 24).
- Local collection stream after remediation: upgraded probe passes with one H1, collection product content, JSON-LD, and crawl-critical content in chunk 2 with no skeleton marker.
- Local product stream after remediation: upgraded probe passes with one H1, Product JSON-LD, buy-section marker, and crawl-critical content in chunk 1 with no skeleton marker.
- Live `robots.txt`: account/login disallows present, but no sitemap line.
- Local `robots.txt`: account/login disallows present; sitemap points to `https://teavision.com.au/sitemap.xml`, not `https://www.teavision.com.au/sitemap.xml`.
- Live `/blog`: 404.
- Local `/blog`: 404.
- Local performance strict run failed with 3/3 routes failing LCP.

## Required Follow-up Before Claiming Compliance

1. Deploy and run the upgraded stream-order probe against the exact PDF screenshot URLs.
2. Decide whether the canonical production host is `https://www.teavision.com.au` as the PDF states, or document an owner-approved non-www change; update `SITE_URL`, sitemap, canonicals, and host redirects accordingly.
3. Implement or explicitly reject `/blog/` with owner/SEO sign-off; current behavior is 404.
4. Remove title suffixes from SEO-targeted service pages and fix duplicate FAQ suffix.
5. Decide how Review schema should be handled. Current implementation does not emit Review or aggregateRating for the tested product because reliable visible review data is absent.
6. Re-run Core Web Vitals/Lighthouse after LCP/render-blocking/unused-JS remediation.
