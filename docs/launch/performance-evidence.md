# Performance Evidence

## Command

`pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173`

Generated 2026-06-26T01:07:31.761Z. This is local mobile Lighthouse lab evidence against the fake-provider production lifecycle. Lighthouse cannot replace field Core Web Vitals data; it is used here as repeatable launch regression evidence.

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
| / | 4853ms | 0.000 | 69ms | 97 | FAIL | LCP 4853ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /products/test-standard-tea | 4217ms | 0.000 | 48ms | 97 | FAIL | LCP 4217ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /collections/all | 3871ms | 0.000 | 65ms | 95 | FAIL | LCP 3871ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /cart | 3631ms | 0.000 | 60ms | 96 | FAIL | LCP 3631ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /search?q=tea | 3835ms | 0.000 | 50ms | 96 | FAIL | LCP 3835ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /account | 5350ms | 0.128 | 48ms | 95 | FAIL | LCP 5350ms exceeds 2500ms; CLS 0.128 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /pages/privacy-policy | 3827ms | 0.000 | 46ms | 96 | FAIL | LCP 3827ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |

## LCP Diagnostics

| Route | LCP Element | LCP Resource | Observed URL |
| --- | --- | --- | --- |
| / | main#main-content > div.bg-paper > section.relative > img.absolute | /images/homepage/homepage-hero-tea-harvest-lcp.avif | http://127.0.0.1:4173/ |
| /products/test-standard-tea | div.bg-paper-2 > div.flex > div.relative > img.size-full | /images/homepage/bulk-wholesale-lcp.avif | http://127.0.0.1:4173/products/test-standard-tea |
| /collections/all | article.group > div.relative > a.relative > img.object-contain | /images/homepage/bulk-wholesale-lcp.avif | http://127.0.0.1:4173/collections/all |
| /cart | section.py-8 > div.mx-auto > div.py-16 > p.type-body | Lighthouse did not expose it | http://127.0.0.1:4173/cart |
| /search?q=tea | div.max-w-wide > div.grid > div > p.text-paper/75 | Lighthouse did not expose it | http://127.0.0.1:4173/search?q=tea |
| /account | Lighthouse did not expose it | Lighthouse did not expose it | http://127.0.0.1:4173/account/login?returnTo=%2Faccount |
| /pages/privacy-policy | div.mx-auto > div.max-w-prose > article.border > p.type-body | Lighthouse did not expose it | http://127.0.0.1:4173/pages/privacy-policy |

## Timing Diagnostics

| Route | FCP | LCP | TTFB | Speed Index | Bytes | Primary Cause |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| / | 1365ms | 4853ms | 7ms | 1690ms | 873656 | image-resource |
| /products/test-standard-tea | 1358ms | 4217ms | 3ms | 1358ms | 588054 | image-resource |
| /collections/all | 1367ms | 3871ms | 7ms | 1367ms | 603300 | image-resource |
| /cart | 1208ms | 3631ms | 3ms | 1208ms | 543129 | render-delay |
| /search?q=tea | 1360ms | 3835ms | 3ms | 1360ms | 558918 | render-delay |
| /account | 2562ms | 5350ms | 7ms | 2562ms | 607304 | layout-shift |
| /pages/privacy-policy | 1207ms | 3827ms | 5ms | 1207ms | 526752 | render-delay |

## Asset Warmup Diagnostics

| Route | Warmed Assets |
| --- | ---: |
| / | 424 |
| /products/test-standard-tea | 40 |
| /collections/all | 39 |
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

- Home hero image uses the precompressed launch AVIF with Next 16 `preload`, `sizes="100vw"`, stable fill dimensions, and direct `unoptimized` local delivery; latest local mobile Lighthouse records 4853ms LCP, CLS 0.000, TBT 69ms, accessibility 97, and status FAIL.
- PDP gallery preloads only the first gallery image and serves local launch AVIF media directly with `unoptimized` while preserving normal optimization for remote Shopify media; latest local mobile Lighthouse records 4217ms LCP, CLS 0.000, TBT 48ms, accessibility 97, and status FAIL.
- Collection listing keeps the local `ProductCard` priority API but renders first-visible cards as Next 16 `preload={priority}` and serves fake-provider local launch AVIF media directly with `unoptimized`; latest local mobile Lighthouse records 3871ms LCP, CLS 0.000, TBT 65ms, accessibility 95, and status FAIL.
- Cart LCP is text content, not an image resource, so no cosmetic image edit was applied; latest local mobile Lighthouse records 3631ms LCP, CLS 0.000, TBT 60ms, accessibility 96, and status FAIL.
- Search LCP is trust-strip text content with no LCP resource, so the local miss is documented as render timing rather than image loading; latest local mobile Lighthouse records 3835ms LCP, CLS 0.000, TBT 50ms, accessibility 96, and status FAIL.
- Account route reserves stable account geometry in the account shell, login bridge, page wrapper, and loading fallback; remaining CLS is on the observed `/account/login?returnTo=%2Faccount` bridge and Lighthouse does not expose a shifting node; latest local mobile Lighthouse records 5350ms LCP, CLS 0.128, TBT 48ms, accessibility 95, and status FAIL.
- Privacy policy LCP is policy copy text with no LCP resource, so no arbitrary image edit was applied; latest local mobile Lighthouse records 3827ms LCP, CLS 0.000, TBT 46ms, accessibility 96, and status FAIL.
- The fake Shopify product includes a local rich-media image so `/products/test-standard-tea` exercises the PDP gallery rather than an empty placeholder.
- Remaining LCP misses are recorded as `FAIL` with mitigation instead of being silently passed. Field/staging Core Web Vitals should be used before launch sign-off because this command is local lab evidence.

## Remaining Mitigations

- `/` FAIL: LCP 4853ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `main#main-content > div.bg-paper > section.relative > img.absolute`; resource `/images/homepage/homepage-hero-tea-harvest-lcp.avif`; observed URL `http://127.0.0.1:4173/`.
- `/products/test-standard-tea` FAIL: LCP 4217ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.bg-paper-2 > div.flex > div.relative > img.size-full`; resource `/images/homepage/bulk-wholesale-lcp.avif`; observed URL `http://127.0.0.1:4173/products/test-standard-tea`.
- `/collections/all` FAIL: LCP 3871ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `article.group > div.relative > a.relative > img.object-contain`; resource `/images/homepage/bulk-wholesale-lcp.avif`; observed URL `http://127.0.0.1:4173/collections/all`.
- `/cart` FAIL: LCP 3631ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `section.py-8 > div.mx-auto > div.py-16 > p.type-body`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/cart`.
- `/search?q=tea` FAIL: LCP 3835ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.max-w-wide > div.grid > div > p.text-paper/75`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/search?q=tea`.
- `/account` FAIL: LCP 5350ms exceeds 2500ms; CLS 0.128 exceeds 0.1. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `Lighthouse did not expose it`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/account/login?returnTo=%2Faccount`.
- `/pages/privacy-policy` FAIL: LCP 3827ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.mx-auto > div.max-w-prose > article.border > p.type-body`; resource `Lighthouse did not expose it`; observed URL `http://127.0.0.1:4173/pages/privacy-policy`.
