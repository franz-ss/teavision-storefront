---
phase: 12
slug: optimize-blogs-teavision-blogs-loading-and-image-rendering
status: verified
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-11
---

# Phase 12 - Validation Strategy

Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.8, Node test runner, ESLint, TypeScript |
| Config file | `vitest.config.mts` |
| Quick run command | `pnpm exec vitest run --environment node src/lib/blog/operations.test.ts src/lib/sanity/queries/blog.test.ts src/components/blog/hero/hero.test.tsx src/components/ui/article-card/article-card.test.tsx src/components/blog/featured-articles/featured-articles.test.tsx "src/app/(storefront)/blogs/[blog]/_components/listing-content.test.tsx"` |
| Full suite command | `pnpm lint && pnpm typecheck && pnpm exec vitest run --environment node src/lib/blog/operations.test.ts src/lib/sanity/queries/blog.test.ts src/components/blog/hero/hero.test.tsx src/components/ui/article-card/article-card.test.tsx src/components/blog/featured-articles/featured-articles.test.tsx "src/app/(storefront)/blogs/[blog]/_components/listing-content.test.tsx"` |
| Estimated runtime | ~31 seconds |

## Sampling Rate

- After every task commit: run the quick Phase 12 validation command.
- After every plan wave: run `pnpm lint`, `pnpm typecheck`, and the quick Phase 12 validation command.
- Before `$gsd-verify-work`: full suite must be green.
- Max feedback latency: ~31 seconds for Phase 12 validation checks.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 12-01-01 | 01 | 1 | Carry Sanity `metadata.lqip` through `BlogImage`; preserve missing metadata fallback. | T-12-01 | LQIP is available to renderers without crashing when absent. | unit | `pnpm exec vitest run --environment node src/lib/blog/operations.test.ts` | yes | green |
| 12-01-02 | 01 | 1 | Generate bounded Sanity image URLs by use case: hero, featured card, article card. | - | Bounded images reduce oversized asset fetches while preserving safe fallback URLs. | unit | `pnpm exec vitest run --environment node src/lib/blog/operations.test.ts` | yes | green |
| 12-01-03 | 01 | 1 | Hero preload is explicit; empty-string LQIP does not enable `placeholder="blur"`. | T-12-01 | Empty-string LQIP cannot trigger a `next/image` blur-data render failure. | unit | `pnpm exec vitest run --environment node src/components/blog/hero/hero.test.tsx` | yes | green |
| 12-01-04 | 01 | 1 | Article cards use LQIP when available and do not preload by default. | - | Card images cannot compete with the intended hero preload unless explicitly opted in. | unit | `pnpm exec vitest run --environment node src/components/ui/article-card/article-card.test.tsx src/components/blog/featured-articles/featured-articles.test.tsx` | yes | green |
| 12-02-01 | 02 | 2 | Default listing query omits body text, uses server pagination, and preserves tag navigation data. | - | Query stays light for default listings while retaining needed navigation metadata. | unit | `pnpm exec vitest run --environment node src/lib/sanity/queries/blog.test.ts` | yes | green |
| 12-03-01 | 03 | 1 | `coalesce(..., [])` protects featured-post exclusion when `featuredPosts` is unset. | T-12-02 | Missing featured-post references cannot blank the article listing. | unit | `pnpm exec vitest run --environment node src/lib/sanity/queries/blog.test.ts` | yes | green |
| 12-04-01 | 04 | 1 | Default featured posts are filtered to projected posts with slugs and `publishedAt <= now()`. | T-12-04 | Scheduled or slug-less featured posts do not render publicly on the default listing. | unit | `pnpm exec vitest run --environment node src/lib/sanity/queries/blog.test.ts` | yes | green |
| 12-04-02 | 04 | 1 | Filtered tag/search paths paginate `filteredArticles` directly, including featured articles. | T-12-05 | Featured articles are not silently removed from filtered result sets. | unit | `pnpm exec vitest run --environment node "src/app/(storefront)/blogs/[blog]/_components/listing-content.test.tsx"` | yes | green |

## Tests Created

| File | Coverage |
|------|----------|
| `src/lib/blog/operations.test.ts` | Default listing image shaping, LQIP propagation, and bounded Sanity URL options. |
| `src/lib/sanity/queries/blog.test.ts` | Light query projection, `coalesce` guard, and featured-post publish/slug guard. |
| `src/components/blog/hero/hero.test.tsx` | Hero preload passthrough and empty-string versus valid LQIP behavior. |
| `src/components/ui/article-card/article-card.test.tsx` | Article card blur placeholder and default no-preload behavior. |
| `src/components/blog/featured-articles/featured-articles.test.tsx` | Featured article listing does not opt card images into preload. |
| `src/app/(storefront)/blogs/[blog]/_components/listing-content.test.tsx` | Filtered tag path includes featured articles in paginated results. |

## Verification Evidence

| Command | Result |
|---------|--------|
| `pnpm exec vitest run --environment node src/lib/blog/operations.test.ts src/lib/sanity/queries/blog.test.ts src/components/blog/hero/hero.test.tsx src/components/ui/article-card/article-card.test.tsx src/components/blog/featured-articles/featured-articles.test.tsx "src/app/(storefront)/blogs/[blog]/_components/listing-content.test.tsx"` | passed: 6 files, 10 tests |
| `pnpm typecheck` | passed |
| `pnpm lint` | passed, Tailwind class check passed |

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

## Manual-Only Verifications

All phase behaviors have automated verification.

## Validation Audit 2026-06-11

| Metric | Count |
|--------|-------|
| Gaps found | 6 |
| Resolved | 6 |
| Escalated | 0 |

## Validation Sign-Off

- [x] All tasks have automated verification or are covered by Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all missing references
- [x] No watch-mode flags
- [x] Feedback latency < 31 seconds for Phase 12 checks
- [x] `nyquist_compliant: true` set in frontmatter

Approval: approved 2026-06-11
