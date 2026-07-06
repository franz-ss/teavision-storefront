---
phase: 23
slug: preview-revalidation-and-no-regression-release
reviewed: 2026-07-03
depth: standard
status: passed
---

# Phase 23 Code Review

## Scope

Reviewed the Phase 23 production and test changes for secure Draft Mode preview, draft Sanity data access, homepage Draft Mode rendering, signed Sanity homepage revalidation, observability event typing, and release-gate evidence.

Files reviewed:

- `src/lib/sanity/env.ts`
- `src/lib/sanity/client.ts`
- `src/lib/sanity/home-page.ts`
- `src/lib/sanity/home-page.test.ts`
- `src/app/api/draft/route.ts`
- `src/app/api/draft/route.test.ts`
- `src/app/api/draft/disable/route.ts`
- `src/app/api/draft/disable/route.test.ts`
- `src/app/(storefront)/page.tsx`
- `src/app/(storefront)/page.test.tsx`
- `src/app/api/webhooks/sanity/route.ts`
- `src/app/api/webhooks/sanity/route.test.ts`
- `src/lib/observability/logger.ts`
- `src/lib/observability/logger.test.ts`
- `package.json`
- `docs/launch/phase-23-homepage-release-gate.md`

## Findings

No actionable defects found.

## Review Notes

- Draft data access is isolated from the published cached helper: the published path still owns `cacheTag('homePage', 'sanity-homepage')` and `cacheLife('hours')`, while `getDraftHomepage()` uses the draft fetch path without cache tags.
- Draft client configuration uses `perspective: 'drafts'`, `useCdn: false`, required `SANITY_API_READ_TOKEN`, and `stega: false`.
- The draft enable route validates server configuration, rejects short secrets, uses a same-length `timingSafeEqual` comparison, allows only exact slug `/`, checks draft document existence before enabling Draft Mode, and logs metadata only.
- Homepage rendering switches body content under Draft Mode while `generateMetadata()` remains published-only and JSON-LD stays code-owned.
- Sanity `homePage` webhooks revalidate only `homePage` and `sanity-homepage`, preserve blog and blog-post tag behavior, and use `revalidateTag(tag, { expire: 0 })` for immediate webhook invalidation.
- Final `pnpm build` passed; it emitted two metadata-only `draft_preview_rejected` missing-secret logs during build-time API route analysis, with no secret or URL leakage.

## Residual Risk

- Rollout remains blocked by the release gate until real public-preview PSI category scores and a Sanity `homePage` publish smoke test are recorded.
- `SANITY_PREVIEW_SECRET`, `SANITY_API_READ_TOKEN`, and `SANITY_REVALIDATE_SECRET` must be configured in the deployed preview environment before owner verification.

## Verification

- `pnpm test:unit -- src/lib/sanity/home-page.test.ts "src/app/(storefront)/page.test.tsx"` - passed, 69 files / 297 tests.
- `pnpm test:integration` - passed, 12 files / 59 tests.
- `pnpm lint --quiet` - passed; the plan's literal `pnpm lint -- --quiet` form fails because this pnpm script forwards the extra `--` to ESLint as a file pattern.
- `pnpm typecheck` - passed after `c0852302`.
- `pnpm build` - passed.
