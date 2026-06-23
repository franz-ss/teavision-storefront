# Performance Evidence

## Command

`pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173`

Generated 2026-06-23T08:20:23.965Z. This is local mobile Lighthouse lab evidence against the fake-provider production lifecycle. Lighthouse cannot replace field Core Web Vitals data; it is used here as repeatable launch regression evidence.

## Representative Routes

- `/`
- `/products/test-standard-tea`
- `/collections/all`
- `/cart`
- `/search?q=tea`
- `/account`
- `/pages/privacy-policy`

## Mobile Lighthouse Results

| Route                       |    LCP |   CLS |   TBT | A11y | Status | Mitigation                                                                                                                                              |
| --------------------------- | -----: | ----: | ----: | ---: | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /                           | 6315ms | 0.000 |  70ms |   97 | FAIL   | LCP 6315ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |
| /products/test-standard-tea | 5737ms | 0.000 | 101ms |   97 | FAIL   | LCP 5737ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |
| /collections/all            | 5668ms | 0.000 |  62ms |   95 | FAIL   | LCP 5668ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |
| /cart                       | 4892ms | 0.000 |  53ms |   96 | FAIL   | LCP 4892ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |
| /search?q=tea               | 4668ms | 0.000 |  54ms |  100 | FAIL   | LCP 4668ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |
| /account                    | 6953ms | 0.830 |  78ms |   95 | FAIL   | LCP 6953ms exceeds 2500ms; CLS 0.830 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /pages/privacy-policy       | 4931ms | 0.000 |  67ms |   96 | FAIL   | LCP 4931ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |

## UX And Accessibility Polish

- duplicate skip link resolved: Pending Task 3 verification.
- mobile text wrapping checked: Pending Task 3 verification.
- Remaining non-blocking UX/accessibility polish items: Pending Task 3 verification.

## Remediation Notes

- Home hero image already had `loading="eager"`, `fetchPriority="high"`, and `sizes="100vw"`; Task 2 lowered it to the existing approved Next image quality `68`. Local mobile Lighthouse remained a simulated LCP `FAIL` after the change (`6323ms` before, `6315ms` after), with CLS `0.000` and TBT `70ms`.
- PDP gallery already had eager loading, high fetch priority, preload, and stable responsive sizes for the first image; Task 2 lowered the main gallery image quality to `68`.
- The fake Shopify product now includes a local rich-media image so `/products/test-standard-tea` exercises the PDP gallery rather than an empty placeholder. This makes the post-remediation PDP result intentionally not directly comparable to the earlier placeholder-backed `4893ms` run; the rich-media rerun records `5737ms`, CLS `0.000`, and TBT `101ms`.
- Remaining LCP misses are recorded as `FAIL` with mitigation instead of being silently passed. Field/staging Core Web Vitals should be used before launch sign-off because this command is local lab evidence.

## Remaining Mitigations

- `/` FAIL: LCP 6315ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/products/test-standard-tea` FAIL: LCP 5737ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/collections/all` FAIL: LCP 5668ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/cart` FAIL: LCP 4892ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/search?q=tea` FAIL: LCP 4668ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/account` FAIL: LCP 6953ms exceeds 2500ms; CLS 0.830 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/pages/privacy-policy` FAIL: LCP 4931ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
