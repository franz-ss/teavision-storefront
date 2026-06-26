# Performance Evidence

## Command

`pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173`

Generated 2026-06-26T00:52:11.269Z. This is local mobile Lighthouse lab evidence against the fake-provider production lifecycle. Lighthouse cannot replace field Core Web Vitals data; it is used here as repeatable launch regression evidence.

For evidence-only local diagnostics that should not block a readiness script, run `pnpm test:performance -- --allow-metric-failures`.

By default, the probe performs one warmup fetch per route before measured Lighthouse runs to reduce first-request build/image-cache noise. Use `--cold-run` for a zero-warmup diagnostic.

When warmup runs are enabled, route warmup fetches same-origin `/_next/image`, `/_next/static`, `/_next/font`, and `/images/` assets discovered from HTML `src`, `srcset`, and preload `href` attributes. Use `--no-asset-warmup` to keep HTML warmup but skip asset warmup for cold image-transform diagnostics.

## Representative Routes

- `/`
- `/products/test-standard-tea`
- `/collections/all`

## Mobile Lighthouse Results

| Route | LCP | CLS | TBT | A11y | Status | Mitigation |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| / | 4841ms | 0.000 | 61ms | 97 | FAIL | LCP 4841ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /products/test-standard-tea | 4222ms | 0.000 | 54ms | 97 | FAIL | LCP 4222ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |
| /collections/all | 3851ms | 0.000 | 55ms | 95 | FAIL | LCP 3851ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. |

## LCP Diagnostics

| Route | LCP Element | LCP Resource | Observed URL |
| --- | --- | --- | --- |
| / | main#main-content > div.bg-paper > section.relative > img.absolute | /images/homepage/homepage-hero-tea-harvest-lcp.avif | http://127.0.0.1:4173/ |
| /products/test-standard-tea | div.bg-paper-2 > div.flex > div.relative > img.size-full | /images/homepage/bulk-wholesale-lcp.avif | http://127.0.0.1:4173/products/test-standard-tea |
| /collections/all | article.group > div.relative > a.relative > img.object-contain | /images/homepage/bulk-wholesale-lcp.avif | http://127.0.0.1:4173/collections/all |

## Timing Diagnostics

| Route | FCP | LCP | TTFB | Speed Index | Bytes | Primary Cause |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| / | 1370ms | 4841ms | 8ms | 1802ms | 849272 | image-resource |
| /products/test-standard-tea | 1364ms | 4222ms | 5ms | 1364ms | 609463 | image-resource |
| /collections/all | 1367ms | 3851ms | 6ms | 1367ms | 603276 | image-resource |

## Asset Warmup Diagnostics

| Route | Warmed Assets |
| --- | ---: |
| / | 424 |
| /products/test-standard-tea | 40 |
| /collections/all | 39 |

## Layout Shift Diagnostics

No meaningful layout-shift sources were exposed by Lighthouse.

## Launch Blocking Status

Launch-blocking: yes - 3 strict local Lighthouse route(s) have `FAIL` metric rows.

## UX And Accessibility Polish

- duplicate skip link resolved: production smoke asserts exactly one `Skip to main content` link on `/`, verifies it receives first-tab focus, and confirms the `main#main-content` target exists.
- mobile text wrapping checked: production smoke runs `/cart` and a long-query `/search` route at a 375px viewport and asserts document width does not exceed viewport width.
- Remaining non-blocking UX/accessibility polish items: None - no launch-blocking UX/accessibility polish items remain.

## Remediation Notes

- Home hero image uses the precompressed launch AVIF with Next 16 `preload`, `sizes="100vw"`, stable fill dimensions, and direct `unoptimized` local delivery; latest local mobile Lighthouse records 4841ms LCP, CLS 0.000, TBT 61ms, accessibility 97, and status FAIL.
- PDP gallery preloads only the first gallery image and serves local launch AVIF media directly with `unoptimized` while preserving normal optimization for remote Shopify media; latest local mobile Lighthouse records 4222ms LCP, CLS 0.000, TBT 54ms, accessibility 97, and status FAIL.
- Collection listing keeps the local `ProductCard` priority API but renders first-visible cards as Next 16 `preload={priority}` and serves fake-provider local launch AVIF media directly with `unoptimized`; latest local mobile Lighthouse records 3851ms LCP, CLS 0.000, TBT 55ms, accessibility 95, and status FAIL.
- Cart LCP is text content, not an image resource, so no cosmetic image edit was applied; No current route row was recorded in this probe run.
- Search LCP is trust-strip text content with no LCP resource, so the local miss is documented as render timing rather than image loading; No current route row was recorded in this probe run.
- Account route reserves stable account geometry in the account shell, login bridge, page wrapper, and loading fallback; remaining CLS is on the observed `/account/login?returnTo=%2Faccount` bridge and Lighthouse does not expose a shifting node; No current route row was recorded in this probe run.
- Privacy policy LCP is policy copy text with no LCP resource, so no arbitrary image edit was applied; No current route row was recorded in this probe run.
- The fake Shopify product includes a local rich-media image so `/products/test-standard-tea` exercises the PDP gallery rather than an empty placeholder.
- Remaining LCP misses are recorded as `FAIL` with mitigation instead of being silently passed. Field/staging Core Web Vitals should be used before launch sign-off because this command is local lab evidence.

## Remaining Mitigations

- `/` FAIL: LCP 4841ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `main#main-content > div.bg-paper > section.relative > img.absolute`; resource `/images/homepage/homepage-hero-tea-harvest-lcp.avif`; observed URL `http://127.0.0.1:4173/`.
- `/products/test-standard-tea` FAIL: LCP 4222ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `div.bg-paper-2 > div.flex > div.relative > img.size-full`; resource `/images/homepage/bulk-wholesale-lcp.avif`; observed URL `http://127.0.0.1:4173/products/test-standard-tea`.
- `/collections/all` FAIL: LCP 3851ms exceeds 2500ms. Preserve LCP image priority, inspect oversized media, and re-run mobile Lighthouse after remediation. LCP diagnostic: element `article.group > div.relative > a.relative > img.object-contain`; resource `/images/homepage/bulk-wholesale-lcp.avif`; observed URL `http://127.0.0.1:4173/collections/all`.
