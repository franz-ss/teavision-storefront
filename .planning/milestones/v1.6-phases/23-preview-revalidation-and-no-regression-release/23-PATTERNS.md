# Phase 23: Preview, Revalidation, and No-Regression Release - Patterns

**Mapped:** 2026-07-03
**Status:** Ready for planning

## Source Files Likely To Change

| File | Role | Closest Existing Pattern |
| --- | --- | --- |
| `src/lib/sanity/env.ts` | Sanity env helpers | Existing `getSanityRevalidateSecret()` uses `requiredEnv`; add preview secret helper beside it. |
| `src/lib/sanity/client.ts` | Sanity client/fetch configuration | Existing `getSanityClient()` published client must remain published/stega false; add a separate draft-capable path rather than changing defaults. |
| `src/lib/sanity/home-page.ts` | Published and draft homepage operation boundary | Existing `getHomepage()` is cached and fail-loud; reuse reshape helpers for draft reads without tagging/caching draft responses. |
| `src/app/api/draft/route.ts` | Draft Mode enable endpoint | Match App Router route handler style from API routes; validate inputs before calling `draftMode().enable()`. |
| `src/app/api/draft/disable/route.ts` | Draft Mode disable endpoint | Use async `draftMode()` from `next/headers`; redirect to `/`. |
| `src/app/(storefront)/page.tsx` | Homepage route and metadata | Keep `generateMetadata()` published-only; branch body content on Draft Mode without changing section order. |
| `src/app/api/webhooks/sanity/route.ts` | Signed Sanity webhook revalidation | Extend existing `parseBody()` route and metadata-only logging; preserve blog tag behavior. |
| `docs/launch/phase-23-homepage-release-gate.md` | Focused release evidence | Follow existing launch evidence docs but make PSI drop a hard rollout blocker. |

## Existing Code Shapes To Reuse

### Sanity Published Client

Current source: `src/lib/sanity/client.ts`

```ts
return createClient({
  ...config,
  ...(token ? { token } : {}),
  useCdn: false,
  perspective: 'published',
  stega: false,
})
```

Phase 23 implication: leave this published path intact. Add either
`getSanityDraftClient()` or a draft fetch helper using `perspective: 'drafts'`,
`useCdn: false`, a required token, and `stega: false`.

### Published Homepage Cache Boundary

Current source: `src/lib/sanity/home-page.ts`

```ts
export async function getHomepage(): Promise<HomepageContent> {
  'use cache'
  cacheTag('homePage', 'sanity-homepage')
  cacheLife('hours')

  const data = await sanityFetch<SanityHomePageResult | null>(homePageQuery)
  if (!data) fail('homePage', 'singleton document is missing')

  return reshapeHomepage(data)
}
```

Phase 23 implication: do not overload this helper with draft behavior. Draft
reads can reuse `homePageQuery` and `reshapeHomepage()`, but must not call
`cacheTag('homePage', 'sanity-homepage')` or `cacheLife()`.

### Route Handler Test Style

Current sources:

- `src/app/api/products/[handle]/quick-view/route.test.ts`
- `src/app/api/search/suggestions/route.test.ts`

Pattern:

```ts
const response = await GET(new Request('https://teavision.test/api/path'))
const payload = await response.json()

expect(response.status).toBe(200)
expect(payload).toEqual(...)
```

Phase 23 implication: test new route handlers by importing `GET`/`POST`
directly, mocking downstream helpers and Next runtime APIs at module
boundaries. Use `vi.hoisted()` when route imports need stable mock objects.

### Webhook Logging And Revalidation

Current source: `src/app/api/webhooks/sanity/route.ts`

```ts
if (!parsedBody.isValidSignature) {
  logEvent('warn', 'sanity_webhook_rejected', {
    reason: 'invalid-signature',
  })

  return Response.json(
    { error: 'Invalid webhook signature' },
    { status: 401 },
  )
}
```

Current source also revalidates with immediate expiry:

```ts
revalidateTag('blog', { expire: 0 })
```

Phase 23 implication: keep the same rejection style and add homepage tags with
`{ expire: 0 }`. Logging assertions should inspect keys such as
`documentType`, `hasBlogSlug`, `hasArticleSlug`, `status`, and reject raw body
or secret fields.

## Test Placement Pattern

Use co-located tests:

- `src/app/api/draft/route.test.ts`
- `src/app/api/draft/disable/route.test.ts`
- `src/app/api/webhooks/sanity/route.test.ts`
- update `src/lib/sanity/home-page.test.ts`
- update `src/app/(storefront)/page.test.tsx`

Because `package.json` currently excludes `src/app/api/**/*.test.ts` from
`pnpm test:unit` and includes only selected API tests in `pnpm
test:integration`, the plan must either:

- update `test:integration` to include the new route tests, or
- require explicit `pnpm exec vitest run --environment node <route-test-files>`
  verification.

## Release Evidence Pattern

Existing launch docs separate automated local evidence from owner/external proof.
For Phase 23:

- local checks can prove source behavior, route responses, published HTML
  cleanliness, build, and local Lighthouse diagnostics;
- real public-preview PSI remains manual score-of-record evidence;
- the release gate doc must record current category scores and compare them
  against the v1.5 baseline.

Recommended new doc path:

`docs/launch/phase-23-homepage-release-gate.md`

Minimum sections:

- command/source of evidence;
- v1.5 baseline;
- current preview PSI;
- local SEO/published HTML proof;
- pass/fail decision;
- fix-or-rollback rule.

## Anti-Patterns To Avoid

- Do not add `stega`, Visual Editing, Presentation Tool, `defineLive`, or
  `SanityLive`.
- Do not put `draftMode().enable()`/`disable()` inside cached helpers.
- Do not fetch draft content for metadata, JSON-LD, sitemap, or robots.
- Do not redirect to raw `slug` query values.
- Do not log webhook raw bodies, signatures, secrets, tokens, or draft values.
- Do not remove existing blog revalidation as part of homepage webhook work.
- Do not run real Shopify hosted checkout/payment/order tests for this phase.

## Planning Complete

The executor should be able to implement Phase 23 from `23-CONTEXT.md`,
`23-RESEARCH.md`, and this pattern map without needing additional discovery.
