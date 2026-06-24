# Performance Evidence

## Command

`pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173`

Generated 2026-06-24T02:35:55.824Z. This is local mobile Lighthouse lab evidence against the fake-provider production lifecycle. Lighthouse cannot replace field Core Web Vitals data; it is used here as repeatable launch regression evidence.

For evidence-only local diagnostics that should not block a readiness script, run `pnpm test:performance -- --allow-metric-failures`.

By default, the probe performs one warmup fetch per route before measured Lighthouse runs to reduce first-request build/image-cache noise. Use `--cold-run` for a zero-warmup diagnostic.

When warmup runs are enabled, route warmup fetches same-origin `/_next/image`, `/_next/static`, `/_next/font`, and `/images/` assets discovered from HTML `src`, `srcset`, and preload `href` attributes. Use `--no-asset-warmup` to keep HTML warmup but skip asset warmup for cold image-transform diagnostics.

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
| / | 4939ms | 0.000 | 74ms | 97 | FAIL | LCP 4939ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /products/test-standard-tea | 4333ms | 0.000 | 63ms | 97 | FAIL | LCP 4333ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /collections/all | 4139ms | 0.000 | 46ms | 95 | FAIL | LCP 4139ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /cart | 3691ms | 0.000 | 53ms | 96 | FAIL | LCP 3691ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /search?q=tea | 3847ms | 0.000 | 56ms | 100 | FAIL | LCP 3847ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /account | 5279ms | 0.128 | 57ms | 95 | FAIL | LCP 5279ms exceeds 2500ms; CLS 0.128 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /pages/privacy-policy | 3694ms | 0.000 | 52ms | 96 | FAIL | LCP 3694ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |

## LCP Diagnostics

| Route | LCP Element | LCP Resource | Observed URL |
| --- | --- | --- | --- |
| / | main#main-content > div.bg-paper > section.relative > img.absolute | http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fhomepage-hero… | http://127.0.0.1:4173/ |
| /products/test-standard-tea | div.bg-paper-2 > div.flex > div.relative > img.size-full | http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fbulk-wholesal… | http://127.0.0.1:4173/products/test-standard-tea |
| /collections/all | article.group > div.relative > a.relative > img.object-contain | http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fbulk-wholesal… | http://127.0.0.1:4173/collections/all |
| /cart | section.py-8 > div.mx-auto > div.py-16 > p.type-body | Lighthouse did not expose it | http://127.0.0.1:4173/cart |
| /search?q=tea | div.max-w-wide > div.grid > div > p.text-paper/75 | Lighthouse did not expose it | http://127.0.0.1:4173/search?q=tea |
| /account | Lighthouse did not expose it | Lighthouse did not expose it | http://127.0.0.1:4173/account/login?returnTo=%2Faccount |
| /pages/privacy-policy | div.mx-auto > div.max-w-prose > article.border > p.type-body | Lighthouse did not expose it | http://127.0.0.1:4173/pages/privacy-policy |

## Timing Diagnostics

| Route | FCP | LCP | TTFB | Speed Index | Bytes | Primary Cause |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| / | 1366ms | 4939ms | 7ms | 1553ms | 863807 | image-resource |
| /products/test-standard-tea | 1366ms | 4333ms | 7ms | 1562ms | 607335 | image-resource |
| /collections/all | 1360ms | 4139ms | 3ms | 1360ms | 556980 | image-resource |
| /cart | 1208ms | 3691ms | 3ms | 1208ms | 541274 | render-delay |
| /search?q=tea | 1361ms | 3847ms | 3ms | 1361ms | 556244 | render-delay |
| /account | 2564ms | 5279ms | 23ms | 2564ms | 606233 | layout-shift |
| /pages/privacy-policy | 1207ms | 3694ms | 5ms | 1207ms | 526133 | render-delay |

## Asset Warmup Diagnostics

| Route | Warmed Assets |
| --- | ---: |
| / | 431 |
| /products/test-standard-tea | 54 |
| /collections/all | 48 |
| /cart | 40 |
| /search?q=tea | 38 |
| /account | 38 |
| /pages/privacy-policy | 37 |

## Layout Shift Diagnostics

| Route | CLS | Source | Node Label | Score |
| --- | ---: | --- | --- | ---: |
| /account | 0.128 | Lighthouse source 1 (node unavailable) | Lighthouse did not expose it | 0.128 |

## Launch Blocking Status

Launch-blocking: yes - 7 strict local Lighthouse route(s) have `FAIL` metric rows.

## UX And Accessibility Polish

- duplicate skip link resolved: production smoke asserts exactly one `Skip to main content` link on `/`, verifies it receives first-tab focus, and confirms the `main#main-content` target exists.
- mobile text wrapping checked: production smoke runs `/cart` and a long-query `/search` route at a 375px viewport and asserts document width does not exceed viewport width.
- Remaining non-blocking UX/accessibility polish items: None - no launch-blocking UX/accessibility polish items remain.

## Remediation Notes

- Home hero image keeps the supported Next 16 `loading="eager"` plus `fetchPriority="high"` strategy without `preload`, with `sizes="100vw"`, stable fill dimensions, and image quality `68`; latest local mobile Lighthouse records 4939ms LCP, CLS 0.000, TBT 74ms, accessibility 97, and status FAIL.
- PDP gallery keeps the first image as the only eager/high-priority gallery image and removes `preload` so it does not combine preload with `loading` or `fetchPriority`; latest local mobile Lighthouse records 4333ms LCP, CLS 0.000, TBT 63ms, accessibility 97, and status FAIL.
- Collection listing passes `priority={true}` only to the first visible `ProductCard`; latest local mobile Lighthouse records 4139ms LCP, CLS 0.000, TBT 46ms, accessibility 95, and status FAIL.
- Cart LCP is text content, not an image resource, so no cosmetic image edit was applied; latest local mobile Lighthouse records 3691ms LCP, CLS 0.000, TBT 53ms, accessibility 96, and status FAIL.
- Search LCP is trust-strip text content with no LCP resource, so the local miss is documented as render timing rather than image loading; latest local mobile Lighthouse records 3847ms LCP, CLS 0.000, TBT 56ms, accessibility 100, and status FAIL.
- Account route reserves stable account geometry in the account shell, login bridge, page wrapper, and loading fallback; remaining CLS is on the observed `/account/login?returnTo=%2Faccount` bridge and Lighthouse does not expose a shifting node; latest local mobile Lighthouse records 5279ms LCP, CLS 0.128, TBT 57ms, accessibility 95, and status FAIL.
- Privacy policy LCP is policy copy text with no LCP resource, so no arbitrary image edit was applied; latest local mobile Lighthouse records 3694ms LCP, CLS 0.000, TBT 52ms, accessibility 96, and status FAIL.
- The fake Shopify product includes a local rich-media image so `/products/test-standard-tea` exercises the PDP gallery rather than an empty placeholder.
- Remaining LCP misses are recorded as `FAIL` with mitigation instead of being silently passed. Field/staging Core Web Vitals should be used before launch sign-off because this command is local lab evidence.

## Remaining Mitigations

- `/` FAIL: LCP 4939ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `main#main-content > div.bg-paper > section.relative > img.absolute`; resource `http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fhomepage-hero…`; observed URL `http://127.0.0.1:4173/`.
- `/products/test-standard-tea` FAIL: LCP 4333ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.bg-paper-2 > div.flex > div.relative > img.size-full`; resource `http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fbulk-wholesal…`; observed URL `http://127.0.0.1:4173/products/test-standard-tea`.
- `/collections/all` FAIL: LCP 4139ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `article.group > div.relative > a.relative > img.object-contain`; resource `http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fbulk-wholesal…`; observed URL `http://127.0.0.1:4173/collections/all`.
- `/cart` FAIL: LCP 3691ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `section.py-8 > div.mx-auto > div.py-16 > p.type-body`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/cart`.
- `/search?q=tea` FAIL: LCP 3847ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.max-w-wide > div.grid > div > p.text-paper/75`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/search?q=tea`.
- `/account` FAIL: LCP 5279ms exceeds 2500ms; CLS 0.128 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `Lighthouse did not expose it`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/account/login?returnTo=%2Faccount`.
- `/pages/privacy-policy` FAIL: LCP 3694ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.mx-auto > div.max-w-prose > article.border > p.type-body`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/pages/privacy-policy`.
