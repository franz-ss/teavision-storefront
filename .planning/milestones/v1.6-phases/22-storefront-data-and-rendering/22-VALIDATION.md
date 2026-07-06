---
phase: 22
slug: storefront-data-and-rendering
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-02
revised: 2026-07-03
plan_set: [22-01, 22-02, 22-03, 22-04, 22-05, 22-06, 22-07, 22-08, 22-GAP-01]
---

# Phase 22 - Validation Strategy

Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property | Value |
| --- | --- |
| Framework | Vitest, Storybook Vitest, TypeScript, ESLint, Next build |
| Config file | `vitest.config.mts`, `vitest.storybook.config.mts`, `eslint.config.mjs`, `next.config.ts` |
| Quick run command | `pnpm test:unit -- src/lib/sanity/home-page.test.ts` |
| Full suite command | `pnpm test:unit -- src/lib/sanity/queries/home-page.test.ts src/lib/sanity/home-page.test.ts "src/app/(storefront)/page.test.tsx" src/lib/blog/operations.test.ts && pnpm test:stories && pnpm lint && pnpm typecheck && pnpm build` |
| Max feedback latency | 180 seconds target |

## Sampling Rate

- After every task commit: run the task-specific command listed in the verification map.
- After every plan wave: run the plan-level verification block from that `PLAN.md`.
- Before `$gsd-verify-work`: run the full suite command above.
- Human browser parity is required in Plan 22-08 after automated guards pass.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 22-01-01 | 22-01 | 1 | DATA-01, RENDER-02, QUALITY-01 | T-22-01/T-22-03/T-22-04 | Tests require missing/invalid `homePage`, SEO, canonical, links, and images to fail loudly; section cardinality stays a seeded fixture/shape assertion per D-03. | unit | `pnpm test:unit -- src/lib/sanity/queries/home-page.test.ts src/lib/sanity/home-page.test.ts` | Created by task | green |
| 22-01-02 | 22-01 | 1 | DATA-01, DATA-02, RENDER-02, QUALITY-01 | T-22-01..T-22-04 | Typed cached operation excludes commerce authority, normalizes Sanity images, and does not reject solely for section item counts. | unit/lint | `pnpm test:unit -- src/lib/sanity/queries/home-page.test.ts src/lib/sanity/home-page.test.ts && pnpm lint --quiet` | Created by task | green |
| 22-02-01 | 22-02 | 2 | RENDER-01, RENDER-02 | T-22-05/T-22-06 | Hero/proof points use required CMS props while preserving one-H1 and hero LCP props. | stories/lint | `pnpm test:stories -- --project storybook --testNamePattern "HomepageHero|Proof" && pnpm lint --quiet` | Existing files | green |
| 22-02-02 | 22-02 | 2 | RENDER-01, RENDER-02 | T-22-06/T-22-07 | Product-range cards preserve geometry, focus, hover, and responsive image behavior. | unit/stories/lint | `pnpm test:unit -- src/components/homepage/overlay-image-card/overlay-image-card.test.tsx && pnpm test:stories -- --project storybook --testNamePattern "ProductRange|Overlay" && pnpm lint --quiet` | Existing files | green |
| 22-03-01 | 22-03 | 3 | DATA-02, RENDER-01, RENDER-02 | T-22-08/T-22-10 | Newsletter, private label, and organic herbs keep Server Component wrappers, action handoff, and validated image geometry. | stories/lint | `pnpm test:stories -- --project storybook --testNamePattern "Newsletter|PrivateLabel|OrganicHerbs" && pnpm lint --quiet` | Existing files | green |
| 22-04-01 | 22-04 | 4 | DATA-02, RENDER-01, RENDER-02 | T-22-11/T-22-13 | Motifs and icon maps remain code-owned while certification images use validated CMS data. | stories/lint | `pnpm test:stories -- --project storybook --testNamePattern "SupplyChain|Certification" && pnpm lint --quiet` | Existing files | green |
| 22-05-01 | 22-05 | 5 | DATA-02, RENDER-01 | T-22-14/T-22-16 | Testimonials keep the carousel client leaf and Tea Journal config comes from CMS while live article data remains in blog operations. | unit/stories/lint | `pnpm test:unit -- src/lib/blog/operations.test.ts && pnpm test:stories -- --project storybook --testNamePattern "Testimonials|TeaJournal" && pnpm lint --quiet` | Existing files | green |
| 22-06-01 | 22-06 | 6 | DATA-02, RENDER-01 | T-22-17/T-22-19 | Contact action, catalogue motifs, and FAQ behavior remain code-owned/existing while copy comes from CMS. | stories/lint | `pnpm test:stories -- --project storybook --testNamePattern "ContactSection|Catalogues|Faq" && pnpm lint --quiet` | Existing files | green |
| 22-07-01 | 22-07 | 7 | DATA-01, RENDER-01, QUALITY-01 | T-22-20/T-22-22 | Route tests assert exact 13-section order, one H1, JSON-LD, CMS content, and no static SEO fallback. | unit | `pnpm test:unit -- "src/app/(storefront)/page.test.tsx"` | Created by task | green |
| 22-07-02 | 22-07 | 7 | DATA-01, DATA-02, RENDER-01, RENDER-02, QUALITY-01 | T-22-20..T-22-23 | `/` and `generateMetadata()` use `getHomepage()`, preserve actions, fixed section order, JSON-LD, and noindex handling. | unit/lint/type/build | `pnpm test:unit -- "src/app/(storefront)/page.test.tsx" src/lib/sanity/home-page.test.ts src/lib/blog/operations.test.ts && pnpm lint && pnpm typecheck && pnpm build` | Existing route, new test | green |
| 22-08-01 | 22-08 | 8 | RENDER-01, RENDER-02, QUALITY-01 | T-22-24/T-22-26 | Final automated gates prove route, Sanity, stories, lint, types, and build are green without running real Shopify checkout/payment/order tests. | full suite | `pnpm test:unit -- src/lib/sanity/queries/home-page.test.ts src/lib/sanity/home-page.test.ts "src/app/(storefront)/page.test.tsx" src/lib/blog/operations.test.ts && pnpm test:stories && pnpm lint && pnpm typecheck && pnpm build` | Existing infra | green |
| 22-08-02 | 22-08 | 8 | RENDER-01, RENDER-02, QUALITY-01 | T-22-25 | Human confirms `/` visual parity and exact visible section order in browser. | human-check | `pnpm test:unit -- "src/app/(storefront)/page.test.tsx"` | Browser review | manual-approved |
| 22-GAP-01-01 | 22-GAP-01 | gap | DATA-01, RENDER-01, RENDER-02, QUALITY-01 | T-22-20/T-22-24/T-22-26 | Regression test renders the default route export and proves CMS section content, one H1, JSON-LD, action handoffs, and source guards are present in initial HTML. | unit | `pnpm test:unit -- "src/app/(storefront)/page.test.tsx"` | Existing route test | green |
| 22-GAP-01-02 | 22-GAP-01 | gap | DATA-01, RENDER-01, RENDER-02, QUALITY-01 | T-22-20/T-22-24/T-22-26 | Route renders cached CMS homepage content directly without `connection()`, `next/server`, `<Suspense>`, or `fallback={null}` returning to the live homepage. | unit/lint/type/build | `pnpm test:unit -- "src/app/(storefront)/page.test.tsx" src/lib/sanity/home-page.test.ts src/lib/blog/operations.test.ts && pnpm lint && pnpm typecheck && pnpm build` | Existing route and test | green |
| 22-GAP-01-03 | 22-GAP-01 | gap | QUALITY-01 | T-22-24/T-22-26 | Build evidence proves `/` is static with one-hour revalidation after the initial-HTML fix, without real Shopify hosted checkout/payment/order tests. | build | `pnpm build` | Existing infra | green |

## Exact Section-Order Contract

Automated route tests in Plan 22-07 and the human parity check in Plan 22-08 must verify this exact order:

1. `HomepageHero`
2. `ProductRange`
3. `HomepageNewsletter`
4. `PrivateLabel`
5. `OrganicHerbs`
6. `SupplyChain`
7. `CertificationCoverage`
8. `SupplyChainProtection`
9. `Testimonials`
10. `TeaJournal`
11. `ContactSection`
12. `Cta`
13. `Faq`

## Wave 0 Requirements

- `src/lib/sanity/queries/home-page.test.ts` and `src/lib/sanity/home-page.test.ts` are created first in Plan 22-01 Task 1.
- Count/cardinality checks for 11 product cards, 3 private-label cards, 4 proof points, 6 certification coverage items, and 7 supply-chain protection marks are seeded fixture/shape assertions only; runtime validation must not reject solely for section item counts per D-03.
- `src/app/(storefront)/page.test.tsx` is created before route cutover in Plan 22-07 Task 1.
- Existing Storybook stories are updated in their component plans before route cutover.
- No new test framework installation is planned.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
| --- | --- | --- | --- |
| Visual homepage parity against seeded content | RENDER-01, RENDER-02, QUALITY-01 | Automated tests cover structure, props, metadata, and stories; browser review catches composed layout and image-framing regressions. | Completed in Plan 22-08: user approved `/` visual parity on 2026-07-03 after checking hero LCP image, cards, forms, testimonials, Tea Journal, contact, CTA, FAQ, mobile/desktop layout, focus states, and exact section order against the Phase 20 homepage baseline and Phase 21 seeded content. |
| Formal preview/revalidation/release SEO and PageSpeed evidence | QUALITY-01 | Phase 22 preserves route behavior; DATA-03, PREVIEW-01, PREVIEW-02, QUALITY-02, and QUALITY-03 are mapped to Phase 23. | Record Phase 22 build and parity results; Phase 23 owns the release proof gate. |

## Threat Model

| Threat | Risk | Mitigation |
| --- | --- | --- |
| T-22-01 Hidden fallback masks CMS failure | Editors think Sanity controls `/` while stale hardcoded content renders. | `getHomepage()` throws on missing/invalid singleton and render-critical fields; route tests assert no static homepage import. |
| T-22-02 Invalid SEO weakens launch controls | CMS noIndex/canonical bypasses launch noindex. | Route metadata maps CMS SEO and always passes through `withNoindexRobots()`. |
| T-22-03 Missing image dimensions cause layout shift | Sanity image renders without reserved geometry. | Data boundary requires image URL/asset plus dimensions before render. |
| T-22-04 Unsafe CMS href creates spoofing risk | Editor-authored links point to unsupported schemes. | Storefront validation mirrors CMS allowlist: `/`, `https://`, `mailto:`, `tel:`. |
| T-22-05/T-22-15/T-22-17 Client-boundary creep | Parent homepage sections become client components. | Story/lint review keeps client directives in existing leaves only. |
| T-22-07 Commerce authority drift | CMS starts controlling product, price, cart, checkout, or discount truth. | Homepage content model excludes commerce authority; Shopify operations and Server Actions remain authoritative. |
| T-22-14 Blog ownership regression | CMS replaces live Tea Journal article data. | CMS controls intro/config only; `getHomepageArticles()` remains article source. |
| T-22-20/T-22-21 Cache and metadata mismatch | Page and metadata fetch different content or weaken Cache Components/noindex rules. | Page and `generateMetadata()` use the same cached `getHomepage()` operation and pass metadata through `withNoindexRobots()`. |
| T-22-24 Final evidence drift | Final gate output is incomplete or not recorded. | Plan 22-08 records automated command outputs and human parity result in `22-08-SUMMARY.md`. |

## Validation Sign-Off

- [x] All planned tasks have automated verification or explicit manual-only rationale.
- [x] Sampling continuity: no three consecutive tasks lack automated verification.
- [x] Wave 0 creates missing test references before implementation.
- [x] No watch-mode flags.
- [x] Feedback latency target documented.
- [x] `nyquist_compliant: true` set in frontmatter for the revised plan set.

**Approval:** planner-approved for execution; audit-approved on 2026-07-03. Human `/` visual parity approval was recorded in `22-08-SUMMARY.md` and `22-UAT.md`.

## Validation Audit 2026-07-03

| Metric | Count |
|--------|-------|
| Automated coverage gaps found | 0 |
| Test files generated | 0 |
| Escalated manual-only gaps | 0 |
| Validation map rows updated or added | 15 |

Audit notes:

- `22-GAP-01` closed the diagnosed homepage initial server HTML gap with route-regression coverage in `src/app/(storefront)/page.test.tsx`.
- Existing Storybook commands were corrected to use the configured `storybook` Vitest project.
- Existing quiet lint commands were corrected to `pnpm lint --quiet`; `pnpm lint -- --quiet` treats `--quiet` as an ESLint file pattern in this repo.
- No new tests were required because all Phase 22 requirements already have automated coverage or explicit manual-only rationale.

Audit verification rerun:

- `pnpm test:unit -- src/lib/sanity/queries/home-page.test.ts src/lib/sanity/home-page.test.ts "src/app/(storefront)/page.test.tsx" src/lib/blog/operations.test.ts` - passed, 69 files / 297 tests.
- `pnpm test:stories` - passed, 106 files / 363 tests. Existing Next image warnings were non-fatal.
- `pnpm lint` - passed, including Tailwind class checks.
- `pnpm typecheck` - passed.
- `pnpm build` - passed; `/` remains static with 1h revalidation and 1d expiry.
