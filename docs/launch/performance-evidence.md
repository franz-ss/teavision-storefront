# Performance Evidence

## Command

`pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173`

Generated 2026-06-26T02:00:46.125Z. This is local mobile Lighthouse lab evidence against the fake-provider production lifecycle. Lighthouse cannot replace field Core Web Vitals data; it is used here as repeatable launch regression evidence.

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

| Route                       |    LCP |   CLS |  TBT | A11y | Status | Mitigation                                                                                                                                              |
| --------------------------- | -----: | ----: | ---: | ---: | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /                           | 4812ms | 0.000 | 49ms |   97 | FAIL   | LCP 4812ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |
| /products/test-standard-tea | 3919ms | 0.000 | 45ms |   97 | FAIL   | LCP 3919ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |
| /collections/all            | 3842ms | 0.000 | 47ms |   95 | FAIL   | LCP 3842ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |
| /cart                       | 3982ms | 0.000 | 47ms |   96 | FAIL   | LCP 3982ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |
| /search?q=tea               | 3830ms | 0.000 | 47ms |   96 | FAIL   | LCP 3830ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |
| /account                    | 4974ms | 0.128 | 67ms |   95 | FAIL   | LCP 4974ms exceeds 2500ms; CLS 0.128 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /pages/privacy-policy       | 3912ms | 0.000 | 51ms |   96 | FAIL   | LCP 3912ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation.                        |

## LCP Diagnostics

| Route                       | LCP Element                                                        | LCP Resource                                                                | Observed URL                                            |
| --------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------- |
| /                           | main#main-content > div.bg-paper > section.relative > img.absolute | http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fhomepage-hero… | http://127.0.0.1:4173/                                  |
| /products/test-standard-tea | div.bg-paper-2 > div.flex > div.relative > img.size-full           | http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fbulk-wholesal… | http://127.0.0.1:4173/products/test-standard-tea        |
| /collections/all            | article.group > div.relative > a.relative > img.object-contain     | http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fbulk-wholesal… | http://127.0.0.1:4173/collections/all                   |
| /cart                       | section.py-8 > div.mx-auto > div.py-16 > p.type-body               | Lighthouse did not expose it                                                | http://127.0.0.1:4173/cart                              |
| /search?q=tea               | div.max-w-wide > div.grid > div > p.text-paper/75                  | Lighthouse did not expose it                                                | http://127.0.0.1:4173/search?q=tea                      |
| /account                    | Lighthouse did not expose it                                       | Lighthouse did not expose it                                                | http://127.0.0.1:4173/account/login?returnTo=%2Faccount |
| /pages/privacy-policy       | div.mx-auto > div.max-w-prose > article.border > p.type-body       | Lighthouse did not expose it                                                | http://127.0.0.1:4173/pages/privacy-policy              |

## Timing Diagnostics

| Route                       |    FCP |    LCP | TTFB | Speed Index |  Bytes | Primary Cause  |
| --------------------------- | -----: | -----: | ---: | ----------: | -----: | -------------- |
| /                           | 1365ms | 4812ms |  6ms |      1731ms | 864810 | image-resource |
| /products/test-standard-tea | 1364ms | 3919ms |  4ms |      1364ms | 603801 | image-resource |
| /collections/all            | 1363ms | 3842ms |  4ms |      1363ms | 580882 | image-resource |
| /cart                       | 1207ms | 3982ms |  3ms |      1207ms | 543032 | render-delay   |
| /search?q=tea               | 1361ms | 3830ms |  3ms |      1361ms | 558820 | render-delay   |
| /account                    | 2564ms | 4974ms |  8ms |      2564ms | 607239 | layout-shift   |
| /pages/privacy-policy       | 1207ms | 3912ms |  5ms |      1207ms | 526664 | render-delay   |

## Asset Warmup Diagnostics

| Route                       | Warmed Assets |
| --------------------------- | ------------: |
| /                           |           431 |
| /products/test-standard-tea |            54 |
| /collections/all            |            48 |
| /cart                       |            40 |
| /search?q=tea               |            38 |
| /account                    |            38 |
| /pages/privacy-policy       |            37 |

## Layout Shift Diagnostics

| Route    |   CLS | Source                                 | Node Label                   | Score |
| -------- | ----: | -------------------------------------- | ---------------------------- | ----: |
| /account | 0.128 | Lighthouse source 1 (node unavailable) | Lighthouse did not expose it | 0.128 |

## Launch Blocking Status

Launch-blocking: yes - 7 strict local Lighthouse route(s) have `FAIL` metric rows.

These raw lab rows are accepted as non-blocking for the final readiness score only when paired with `docs/launch/performance-acceptance.md` and a final audit run using `--performance-acceptance docs/launch/performance-acceptance.md`.

## UX And Accessibility Polish

- duplicate skip link resolved: production smoke asserts exactly one `Skip to main content` link on `/`, verifies it receives first-tab focus, and confirms the `main#main-content` target exists.
- mobile text wrapping checked: production smoke runs `/cart` and a long-query `/search` route at a 375px viewport and asserts document width does not exceed viewport width.
- Remaining non-blocking UX/accessibility polish items: None - no launch-blocking UX/accessibility polish items remain.

## Remediation Notes

- Home hero image uses the launch AVIF with Next 16 `preload`, `sizes="100vw"`, stable fill dimensions, and normal optimized Image delivery; latest local mobile Lighthouse records 4812ms LCP, CLS 0.000, TBT 49ms, accessibility 97, and status FAIL.
- PDP gallery preloads only the first gallery image and keeps normal optimized Image delivery without eager loading or high fetch priority; latest local mobile Lighthouse records 3919ms LCP, CLS 0.000, TBT 45ms, accessibility 97, and status FAIL.
- Collection listing keeps the local `ProductCard` priority API but renders first-visible cards as Next 16 `preload={priority}` using normal optimized Image delivery; latest local mobile Lighthouse records 3842ms LCP, CLS 0.000, TBT 47ms, accessibility 95, and status FAIL.
- Cart LCP is text content, not an image resource, so no cosmetic image edit was applied; latest local mobile Lighthouse records 3982ms LCP, CLS 0.000, TBT 47ms, accessibility 96, and status FAIL.
- Search LCP is trust-strip text content with no LCP resource, so the local miss is documented as render timing rather than image loading; latest local mobile Lighthouse records 3830ms LCP, CLS 0.000, TBT 47ms, accessibility 96, and status FAIL.
- Account route reserves stable account geometry in the account shell, login bridge, page wrapper, and loading fallback; remaining CLS is on the observed `/account/login?returnTo=%2Faccount` bridge and Lighthouse does not expose a shifting node; latest local mobile Lighthouse records 4974ms LCP, CLS 0.128, TBT 67ms, accessibility 95, and status FAIL.
- Privacy policy LCP is policy copy text with no LCP resource, so no arbitrary image edit was applied; latest local mobile Lighthouse records 3912ms LCP, CLS 0.000, TBT 51ms, accessibility 96, and status FAIL.
- The fake Shopify product includes a local rich-media image so `/products/test-standard-tea` exercises the PDP gallery rather than an empty placeholder.
- Remaining LCP misses are recorded as `FAIL` with mitigation instead of being silently passed. Field/staging Core Web Vitals should be used before launch sign-off because this command is local lab evidence.

## Remaining Mitigations

- `/` FAIL: LCP 4812ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `main#main-content > div.bg-paper > section.relative > img.absolute`; resource `http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fhomepage-hero…`; observed URL `http://127.0.0.1:4173/`.
- `/products/test-standard-tea` FAIL: LCP 3919ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.bg-paper-2 > div.flex > div.relative > img.size-full`; resource `http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fbulk-wholesal…`; observed URL `http://127.0.0.1:4173/products/test-standard-tea`.
- `/collections/all` FAIL: LCP 3842ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `article.group > div.relative > a.relative > img.object-contain`; resource `http://127.0.0.1:4173/_next/image?url=%2Fimages%2Fhomepage%2Fbulk-wholesal…`; observed URL `http://127.0.0.1:4173/collections/all`.
- `/cart` FAIL: LCP 3982ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `section.py-8 > div.mx-auto > div.py-16 > p.type-body`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/cart`.
- `/search?q=tea` FAIL: LCP 3830ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.max-w-wide > div.grid > div > p.text-paper/75`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/search?q=tea`.
- `/account` FAIL: LCP 4974ms exceeds 2500ms; CLS 0.128 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `Lighthouse did not expose it`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/account/login?returnTo=%2Faccount`.
- `/pages/privacy-policy` FAIL: LCP 3912ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.mx-auto > div.max-w-prose > article.border > p.type-body`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/pages/privacy-policy`.
