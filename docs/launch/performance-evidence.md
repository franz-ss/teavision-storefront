# Performance Evidence

## Command

`pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173`

Generated 2026-06-24T09:23:16.160Z. This is local mobile Lighthouse lab evidence against the fake-provider production lifecycle. Lighthouse cannot replace field Core Web Vitals data; it is used here as repeatable launch regression evidence.

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
| / | 5350ms | 0.000 | 69ms | 97 | FAIL | LCP 5350ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /products/test-standard-tea | 3916ms | 0.000 | 51ms | 97 | FAIL | LCP 3916ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /collections/all | 4163ms | 0.000 | 64ms | 95 | FAIL | LCP 4163ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /cart | 3697ms | 0.000 | 56ms | 96 | FAIL | LCP 3697ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /search?q=tea | 3546ms | 0.000 | 55ms | 96 | FAIL | LCP 3546ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /account | 4972ms | 0.128 | 73ms | 95 | FAIL | LCP 4972ms exceeds 2500ms; CLS 0.128 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /pages/privacy-policy | 3706ms | 0.000 | 57ms | 96 | FAIL | LCP 3706ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |

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
| / | 1367ms | 5350ms | 7ms | 1817ms | 864837 | image-resource |
| /products/test-standard-tea | 1362ms | 3916ms | 4ms | 1362ms | 604852 | image-resource |
| /collections/all | 1361ms | 4163ms | 4ms | 1361ms | 557831 | image-resource |
| /cart | 1208ms | 3697ms | 3ms | 1208ms | 543011 | render-delay |
| /search?q=tea | 1359ms | 3546ms | 3ms | 1359ms | 558776 | render-delay |
| /account | 2563ms | 4972ms | 9ms | 2563ms | 607209 | layout-shift |
| /pages/privacy-policy | 1208ms | 3706ms | 5ms | 1208ms | 526654 | render-delay |

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

- Home hero image uses the launch AVIF with Next 16 `preload`, `sizes="100vw"`, stable fill dimensions, and normal optimized Image delivery; latest local mobile Lighthouse records 5350ms LCP, CLS 0.000, TBT 69ms, accessibility 97, and status FAIL.
- PDP gallery preloads only the first gallery image and keeps normal optimized Image delivery without eager loading or high fetch priority; latest local mobile Lighthouse records 3916ms LCP, CLS 0.000, TBT 51ms, accessibility 97, and status FAIL.
- Collection listing keeps the local `ProductCard` priority API but renders first-visible cards as Next 16 `preload={priority}` using normal optimized Image delivery; latest local mobile Lighthouse records 4163ms LCP, CLS 0.000, TBT 64ms, accessibility 95, and status FAIL.
- Cart LCP is text content, not an image resource, so no cosmetic image edit was applied; latest local mobile Lighthouse records 3697ms LCP, CLS 0.000, TBT 56ms, accessibility 96, and status FAIL.
- Search LCP is trust-strip text content with no LCP resource, so the local miss is documented as render timing rather than image loading; latest local mobile Lighthouse records 3546ms LCP, CLS 0.000, TBT 55ms, accessibility 96, and status FAIL.
- Account route reserves stable account geometry in the account shell, login bridge, page wrapper, and loading fallback; remaining CLS is on the observed `/account/login?returnTo=%2Faccount` bridge and Lighthouse does not expose a shifting node; latest local mobile Lighthouse records 4972ms LCP, CLS 0.128, TBT 73ms, accessibility 95, and status FAIL.
- Privacy policy LCP is policy copy text with no LCP resource, so no arbitrary image edit was applied; latest local mobile Lighthouse records 3706ms LCP, CLS 0.000, TBT 57ms, accessibility 96, and status FAIL.
- The fake Shopify product includes a local rich-media image so `/products/test-standard-tea` exercises the PDP gallery rather than an empty placeholder.
- Remaining LCP misses are recorded as `FAIL` with mitigation instead of being silently passed. Field/staging Core Web Vitals should be used before launch sign-off because this command is local lab evidence.

## Remaining Mitigations

- `/` FAIL: LCP 5350ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `main#main-content > div.bg-paper > section.relative > img.absolute`; resource `http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fhomepage-hero…`; observed URL `http://127.0.0.1:4173/`.
- `/products/test-standard-tea` FAIL: LCP 3916ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.bg-paper-2 > div.flex > div.relative > img.size-full`; resource `http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fbulk-wholesal…`; observed URL `http://127.0.0.1:4173/products/test-standard-tea`.
- `/collections/all` FAIL: LCP 4163ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `article.group > div.relative > a.relative > img.object-contain`; resource `http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fbulk-wholesal…`; observed URL `http://127.0.0.1:4173/collections/all`.
- `/cart` FAIL: LCP 3697ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `section.py-8 > div.mx-auto > div.py-16 > p.type-body`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/cart`.
- `/search?q=tea` FAIL: LCP 3546ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.max-w-wide > div.grid > div > p.text-paper/75`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/search?q=tea`.
- `/account` FAIL: LCP 4972ms exceeds 2500ms; CLS 0.128 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `Lighthouse did not expose it`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/account/login?returnTo=%2Faccount`.
- `/pages/privacy-policy` FAIL: LCP 3706ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.mx-auto > div.max-w-prose > article.border > p.type-body`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/pages/privacy-policy`.
