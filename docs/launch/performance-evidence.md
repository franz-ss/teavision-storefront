# Performance Evidence

## Command

`pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173`

Generated 2026-06-23T09:25:07.420Z. This is local mobile Lighthouse lab evidence against the fake-provider production lifecycle. Lighthouse cannot replace field Core Web Vitals data; it is used here as repeatable launch regression evidence.

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
| / | 6301ms | 0.000 | 66ms | 97 | FAIL | LCP 6301ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /products/test-standard-tea | 5734ms | 0.000 | 101ms | 97 | FAIL | LCP 5734ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /collections/all | 5675ms | 0.000 | 60ms | 95 | FAIL | LCP 5675ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /cart | 4757ms | 0.000 | 60ms | 96 | FAIL | LCP 4757ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /search?q=tea | 4689ms | 0.000 | 64ms | 100 | FAIL | LCP 4689ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /account | 6954ms | 0.830 | 76ms | 95 | FAIL | LCP 6954ms exceeds 2500ms; CLS 0.830 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /pages/privacy-policy | 4922ms | 0.000 | 64ms | 96 | FAIL | LCP 4922ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |

## UX And Accessibility Polish

- duplicate skip link resolved: production smoke asserts exactly one `Skip to main content` link on `/`, verifies it receives first-tab focus, and confirms the `main#main-content` target exists.
- mobile text wrapping checked: production smoke runs `/cart` and a long-query `/search` route at a 375px viewport and asserts document width does not exceed viewport width.
- Remaining non-blocking UX/accessibility polish items: None - no launch-blocking UX/accessibility polish items remain.

## Remediation Notes

- Home hero image keeps `loading="eager"`, `fetchPriority="high"`, `sizes="100vw"`, stable fill dimensions, and image quality `68`; latest local mobile Lighthouse records 6301ms LCP, CLS 0.000, TBT 66ms, accessibility 97, and status FAIL.
- PDP gallery keeps first-image eager loading, high fetch priority, preload, stable responsive sizes, and image quality `68`; latest local mobile Lighthouse records 5734ms LCP, CLS 0.000, TBT 101ms, accessibility 97, and status FAIL.
- The fake Shopify product includes a local rich-media image so `/products/test-standard-tea` exercises the PDP gallery rather than an empty placeholder.
- Remaining LCP misses are recorded as `FAIL` with mitigation instead of being silently passed. Field/staging Core Web Vitals should be used before launch sign-off because this command is local lab evidence.

## Remaining Mitigations

- `/` FAIL: LCP 6301ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/products/test-standard-tea` FAIL: LCP 5734ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/collections/all` FAIL: LCP 5675ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/cart` FAIL: LCP 4757ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/search?q=tea` FAIL: LCP 4689ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/account` FAIL: LCP 6954ms exceeds 2500ms; CLS 0.830 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
- `/pages/privacy-policy` FAIL: LCP 4922ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.
