# SEO and Performance Work Summary

**Export date:** 16 July 2026  
**Website:** Teavision Australia

## Executive summary

The main Tea Journal URL migration, collection loading fallback, and collection image-priority work have been implemented and tested. The FAQ content remains pending because updated copy is still required. The collection H1 topic has intentionally been left for a separate discussion.

## Item summary

| Item                              | Status                   | Summary                                                                                                                                                                                       | Next action                                                                                                    |
| --------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Tea Journal `/blog` migration     | Implemented              | `/blog` is the official Tea Journal listing. Previous listing addresses permanently redirect to `/blog`, while article, tag, search, pagination, and RSS URLs remain unchanged.               | Ask the SEO team to recheck the production redirects, canonical, sitemap, and internal links after deployment. |
| First collection product image    | Implemented              | The first product image is prioritized when it is the likely LCP image. Responsive sizing, compression, and image quality settings are retained.                                              | Recheck representative collection pages after deployment.                                                      |
| Category-page loading fallback    | Implemented              | The empty Suspense fallback was replaced with a layout-preserving product-grid skeleton. The collection hero remains server-rendered content.                                                 | Confirm the deployed category pages do not show a blank content area while results stream.                     |
| Collection banner LCP discovery   | Implemented and verified | Collection banner, rich hero, and featured collection hero images now use eager loading and high fetch priority. React generates the corresponding high-priority preload in the initial HTML. | Deploy and rerun PageSpeed Insights against the original reported collection URL.                              |
| Competing product image preload   | Implemented              | Product-card preloading is disabled when a collection hero image owns the LCP position. Collections without a hero still prioritize the first visible product image.                          | No further code action currently required.                                                                     |
| FAQ page copy                     | Waiting on SEO team      | Updated FAQ copy has not yet been supplied.                                                                                                                                                   | Obtain the approved questions and answers, then update the page and FAQ structured data together.              |
| Collection H1 review              | Pending discussion       | No additional H1 change was included in the loading or LCP work.                                                                                                                              | Review the SEO evidence and agree on the desired heading treatment before changing it.                         |
| Remaining overall Lighthouse work | Separate follow-up       | The specific LCP request-discovery audit is fixed. Global render-blocking CSS and simulated LCP timing still affect the overall Performance category score.                                   | Profile the shared CSS bundles separately if an overall Lighthouse score improvement is required.              |

## LCP validation evidence

The collection-banner route was tested three times using a production Next.js build and a representative collection banner.

| Lighthouse check             | Run 1 | Run 2 | Run 3 |
| ---------------------------- | ----: | ----: | ----: |
| LCP request discovery score  |  1.00 |  1.00 |  1.00 |
| `fetchpriority=high` applied |  Pass |  Pass |  Pass |
| Discoverable in initial HTML |  Pass |  Pass |  Pass |
| Not lazy-loaded              |  Pass |  Pass |  Pass |

The exact Lighthouse audit reported in the supplied screenshot is therefore verified as resolved in the local production test environment.

## Verification completed

- Production build: passed
- Unit tests: 320 passed
- Component and architecture contracts: 57 passed
- Production browser smoke tests: 13 passed
- ESLint and Tailwind validation: passed
- TypeScript typecheck: passed
- Lighthouse LCP request-discovery audit: 1.00 in three consecutive runs

## Deployment recheck checklist

1. Confirm `/blog` returns HTTP 200 with a self-referencing canonical.
2. Confirm the two legacy Tea Journal listing URLs redirect permanently to `/blog` in one hop.
3. Confirm collection banner HTML contains `fetchpriority="high"` and `loading="eager"`.
4. Confirm the PageSpeed LCP request-discovery panel shows all three checks in green.
5. Confirm banner collections do not prioritize a product-card image at the same time.
6. Confirm category pages show the product-grid skeleton instead of a blank area while data loads.
7. Add the approved FAQ copy and ensure the visible FAQ content matches the FAQ structured data.

## Important clarification

A perfect score was achieved for the specific **LCP request discovery** audit. This does not mean the entire Lighthouse Performance category is 100. Global CSS and other page-level performance factors are separate work items.
