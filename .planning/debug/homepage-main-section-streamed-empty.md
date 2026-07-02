# Homepage Main Section Streamed Empty

## Symptom

During Phase 22 UAT, the storefront homepage main content is blank at first. The user reported that the main section should load server-side because the blank initial response affects SEO.

## Expected

Visiting `/` should include Sanity-backed homepage content in the initial server-rendered HTML, with the full homepage shell and one visible H1.

## Actual

`src/app/(storefront)/page.tsx` renders only code-owned JSON-LD in the route shell, then places the entire visible homepage body inside `<Suspense fallback={null}>`. `HomePageContent()` calls `await connection()` before reading the already cached `getHomepage()` result, so Next treats the visible homepage body as request-time streamed content.

## Evidence

- `src/lib/sanity/home-page.ts` already defines `getHomepage()` with `'use cache'`, `cacheTag('homePage', 'sanity-homepage')`, and `cacheLife('hours')`.
- `src/app/(storefront)/page.tsx` calls `await connection()` in both `generateMetadata()` and `HomePageContent()`.
- The default `HomePage()` shell wraps `<HomePageContent />` in `<Suspense fallback={null}>`.
- Next 16 Cache Components docs state cached external data can be included in the static/server-rendered shell with `use cache`; `connection()` explicitly defers work to request time, and Suspense creates a streamed dynamic hole.
- The Phase 22-07 summary says the Suspense + `connection()` split was added to avoid build-time Sanity failures, but that traded away initial visible homepage HTML.

## Root Cause

The route-level cutover made the entire visible homepage body dynamic by adding `connection()` inside `HomePageContent()` and wrapping that component with a `null` Suspense fallback. This was a build workaround, but the Sanity homepage operation is already a cached data boundary. As a result, the initial page shell can be emitted without the main homepage content, leaving crawlers and users with a blank main region until the stream resolves.

## Suggested Fix Direction

Refactor `src/app/(storefront)/page.tsx` so the primary homepage content reads `getHomepage()` as cached server data without `connection()` and without a `null` Suspense boundary around the entire visible body. Keep Organization/WebSite JSON-LD code-owned, keep `getHomepage()` fail-loud validation, and add a regression test proving the default route shell includes the CMS H1/section markers in server-rendered output rather than only in a separate `HomePageContent()` helper.
