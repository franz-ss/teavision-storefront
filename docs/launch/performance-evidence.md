# Performance Evidence

## Command

`pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173`

Generated 2026-06-23T08:43:37.975Z. This is local mobile Lighthouse lab evidence against the fake-provider production lifecycle. Lighthouse cannot replace field Core Web Vitals data; it is used here as repeatable launch regression evidence.

## Representative Routes

- `/`
- `/products/test-standard-tea`
- `/collections/all`
- `/cart`
- `/search?q=tea`
- `/account`
- `/pages/privacy-policy`

## Mobile Lighthouse Results

| Route | LCP | CLS | TBT | A11y | Status | Mitigation |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| / | 6287ms | 0.000 | 56ms | 97 | FAIL | LCP 6287ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /products/test-standard-tea | 5755ms | 0.000 | 108ms | 97 | FAIL | LCP 5755ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /collections/all | 5673ms | 0.000 | 58ms | 95 | FAIL | LCP 5673ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /cart | 4760ms | 0.000 | 61ms | 96 | FAIL | LCP 4760ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /search?q=tea | 4661ms | 0.000 | 50ms | 100 | FAIL | LCP 4661ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /account | 7028ms | 0.830 | 78ms | 95 | FAIL | LCP 7028ms exceeds 2500ms; CLS 0.830 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /pages/privacy-policy | 5067ms | 0.000 | 60ms | 96 | FAIL | LCP 5067ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |

## UX And Accessibility Polish

- duplicate skip link resolved: production smoke asserts exactly one `Skip to main content` link on `/`, verifies it receives first-tab focus, and confirms the `main#main-content` target exists.
- mobile text wrapping checked: production smoke runs `/cart` and a long-query `/search` route at a 375px viewport and asserts document width does not exceed viewport width.
- Remaining non-blocking UX/accessibility polish items: None - no launch-blocking UX/accessibility polish items remain.

## Remediation Notes

- Home hero image keeps `loading="eager"`, `fetchPriority="high"`, `sizes="100vw"`, stable fill dimensions, and image quality `68`; latest local mobile Lighthouse records 6287ms LCP, CLS 0.000, TBT 56ms, accessibility 97, and status FAIL.
- PDP gallery keeps first-image eager loading, high fetch priority, preload, stable responsive sizes, and image quality `68`; latest local mobile Lighthouse records 5755ms LCP, CLS 0.000, TBT 108ms, accessibility 97, and status FAIL.
- The fake Shopify product includes a local rich-media image so `/products/test-standard-tea` exercises the PDP gallery rather than an empty placeholder.
- Remaining LCP misses are recorded as `FAIL` with mitigation instead of being silently passed. Field/staging Core Web Vitals should be used before launch sign-off because this command is local lab evidence.

## Remaining Mitigations

- `/` FAIL: LCP 6287ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/products/test-standard-tea` FAIL: LCP 5755ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/collections/all` FAIL: LCP 5673ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/cart` FAIL: LCP 4760ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/search?q=tea` FAIL: LCP 4661ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/account` FAIL: LCP 7028ms exceeds 2500ms; CLS 0.830 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/pages/privacy-policy` FAIL: LCP 5067ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
