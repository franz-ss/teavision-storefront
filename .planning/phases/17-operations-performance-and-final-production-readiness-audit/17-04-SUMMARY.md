---
phase: 17-operations-performance-and-final-production-readiness-audit
plan: 04
subsystem: launch-performance-ux-evidence
tags: [performance, lighthouse, accessibility, production-smoke, launch-readiness]
dependency_graph:
  requires: [17-03]
  provides: [PERF-01, UX-01, QA-02]
  affects:
    - scripts/performance/probe-lighthouse.mjs
    - docs/launch/performance-evidence.md
    - tests/e2e/production-smoke.spec.ts
tech_stack:
  added: [lighthouse-cli-probe, storybook-cart-action-mock]
  patterns: [fake-provider-production-lifecycle, mobile-lighthouse-evidence, skip-link-smoke-test]
key_files:
  created:
    - scripts/performance/probe-lighthouse.mjs
    - scripts/performance/probe-lighthouse.test.mjs
    - docs/launch/performance-evidence.md
    - src/lib/shopify/image-url.test.ts
    - .storybook/mocks/cart-actions.ts
  modified:
    - package.json
    - src/components/homepage/hero/hero.tsx
    - src/components/product/product-gallery/product-gallery.tsx
    - src/lib/shopify/image-url.ts
    - tests/mocks/shopify-graphql-server.ts
    - src/components/layout/header/header.tsx
    - tests/e2e/production-smoke.spec.ts
    - .storybook/main.ts
    - docs/launch/production-e2e-evidence.md
decisions:
  - Local Lighthouse metric FAIL/WARN rows are recorded as launch evidence; only probe/runtime failures make the command fail.
  - Fake-provider PDP evidence must include a product image so Lighthouse measures the rich-media gallery path.
  - Storybook browser tests use a local cart Server Action mock instead of bundling production server action modules.
metrics:
  duration: 3098 seconds
  completed_at: 2026-06-23T08:45:24Z
  tasks_completed: 4
---

# Phase 17 Plan 04: Performance And UX Evidence Summary

Repeatable mobile Lighthouse evidence, Home/PDP LCP mitigation records, single skip-link coverage, and mobile overflow smoke coverage for final launch readiness.

## Completed Tasks

| Task | Name | Commit | Key Files |
| --- | --- | --- | --- |
| 1 | Add repeatable Lighthouse/Web Vitals evidence script | 49cd2888 | `scripts/performance/probe-lighthouse.mjs`, `scripts/performance/probe-lighthouse.test.mjs`, `package.json`, `docs/launch/performance-evidence.md` |
| 2 | Remediate Home and PDP LCP blockers discovered by the probe | 1c952190 | `src/components/homepage/hero/hero.tsx`, `src/components/product/product-gallery/product-gallery.tsx`, `tests/mocks/shopify-graphql-server.ts`, `src/lib/shopify/image-url.ts` |
| 3 | Resolve duplicate skip link and mobile wrapping launch polish | 646fd043 | `src/components/layout/header/header.tsx`, `tests/e2e/production-smoke.spec.ts`, `.storybook/main.ts`, `.storybook/mocks/cart-actions.ts` |
| 4 | Record performance and UX evidence for final audit | de6118fe, 17569074 | `docs/launch/performance-evidence.md`, `docs/launch/production-e2e-evidence.md`, `scripts/performance/probe-lighthouse.mjs` |

## Outcome

- Added `pnpm test:performance`, which runs mobile Lighthouse against the 17-03 fake-provider production lifecycle and writes route-level LCP, CLS, TBT, accessibility, status, and mitigation evidence.
- Recorded final local lab evidence for `/`, `/products/test-standard-tea`, `/collections/all`, `/cart`, `/search?q=tea`, `/account`, and `/pages/privacy-policy`.
- Kept Home/PDP priority controls in place and lowered Home/PDP LCP image quality to `68`; local lab LCP remains `FAIL`, so the evidence records explicit mitigations instead of fabricating a pass.
- Removed the duplicate header skip link while preserving the layout skip link and `main#main-content`; production smoke now asserts exactly one skip link and first-tab focus.
- Added a 375px production smoke overflow check for `/cart` and a long-query `/search` route.

## Final Evidence Snapshot

Latest generated evidence is in `docs/launch/performance-evidence.md` at `2026-06-23T08:43:37.975Z`.

| Route | LCP | CLS | TBT | A11y | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| `/` | 6287ms | 0.000 | 56ms | 97 | FAIL |
| `/products/test-standard-tea` | 5755ms | 0.000 | 108ms | 97 | FAIL |
| `/collections/all` | 5673ms | 0.000 | 58ms | 95 | FAIL |
| `/cart` | 4760ms | 0.000 | 61ms | 96 | FAIL |
| `/search?q=tea` | 4661ms | 0.000 | 50ms | 100 | FAIL |
| `/account` | 7028ms | 0.830 | 78ms | 95 | FAIL |
| `/pages/privacy-policy` | 5067ms | 0.000 | 60ms | 96 | FAIL |

## Verification

- `node --test scripts/performance/probe-lighthouse.test.mjs` - passed
- `node scripts/performance/probe-lighthouse.mjs --stdout-only --start-server --url / --base-url http://127.0.0.1:4173` - passed
- `corepack pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173` - passed as evidence generation; metric rows remain `FAIL` with mitigations
- `corepack pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts` - passed, 10 tests
- `corepack pnpm test:stories` - passed, 105 story files and 360 tests
- `corepack pnpm lint` - passed
- `corepack pnpm typecheck` - passed
- Evidence heading/route marker checks - passed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Metric FAIL rows no longer fail the probe process**
- **Found during:** Task 1
- **Issue:** The first single-route Lighthouse run produced an LCP `FAIL` row and exited nonzero, blocking the remediation task from using the evidence.
- **Fix:** Reserved nonzero exit status for tool/runtime failures while preserving `FAIL` and `WARN` rows in the evidence table.
- **Files modified:** `scripts/performance/probe-lighthouse.mjs`
- **Commit:** 49cd2888

**2. [Rule 1 - Bug] Ignored pnpm argument separator**
- **Found during:** Task 2
- **Issue:** `pnpm test:performance -- --start-server` forwarded a literal `--`, which the parser could treat as a positional base URL.
- **Fix:** Updated argument parsing to ignore the package-manager separator and added coverage.
- **Files modified:** `scripts/performance/probe-lighthouse.mjs`, `scripts/performance/probe-lighthouse.test.mjs`
- **Commit:** 1c952190

**3. [Rule 2 - Missing Critical Functionality] Added rich-media fake PDP evidence**
- **Found during:** Task 2
- **Issue:** The fake product had no image, so PDP Lighthouse evidence measured a placeholder path rather than the launch-critical gallery path.
- **Fix:** Added a local fake product image to product, variant, and collection fake-provider responses.
- **Files modified:** `tests/mocks/shopify-graphql-server.ts`
- **Commit:** 1c952190

**4. [Rule 1 - Bug] Kept local fake-provider images query-free**
- **Found during:** Task 2
- **Issue:** Local fake images passed through Shopify width query handling, causing Next image validation errors for local image paths.
- **Fix:** `getSizedShopifyImageUrl` now returns local paths unchanged; unit coverage was added.
- **Files modified:** `src/lib/shopify/image-url.ts`, `src/lib/shopify/image-url.test.ts`
- **Commit:** 1c952190

**5. [Rule 3 - Blocking] Mocked cart Server Actions for Storybook browser tests**
- **Found during:** Task 3
- **Issue:** Storybook browser tests imported client components that transitively touched production cart Server Actions and `node:crypto`, causing 11 story files to fail import.
- **Fix:** Added a Storybook-only Vite alias for `@/lib/cart/actions` to a local mock module.
- **Files modified:** `.storybook/main.ts`, `.storybook/mocks/cart-actions.ts`
- **Commit:** 646fd043

**6. [Rule 3 - Blocking] Preserved remediation notes in generated evidence**
- **Found during:** Plan-level verification
- **Issue:** Re-running the performance probe refreshed metrics but dropped the manually added Task 2 remediation notes.
- **Fix:** Moved Home/PDP remediation notes into the generator using current route rows.
- **Files modified:** `scripts/performance/probe-lighthouse.mjs`, `docs/launch/performance-evidence.md`
- **Commit:** 17569074

## Auth Gates

None.

## Known Stubs

None. Stub-pattern scan only found documentation text explaining that the fake product no longer uses an empty placeholder, plus normal null/empty-array control flow in scripts and tests.

## Threat Flags

None. New automation stays within the fake-provider local production lifecycle and does not add network endpoints, auth paths, file access trust boundaries, or schema changes beyond the planned evidence surface.

## Residual Risks

- Local mobile Lighthouse lab evidence still records LCP failures across representative routes, and `/account` still records CLS `0.830`. These are documented with mitigations in `docs/launch/performance-evidence.md`.
- Storybook still emits non-fatal Next image warnings from its image shim, including quality `68` warnings, while production `next.config.ts` already allows `[68, 75]`.
- Real Shopify hosted checkout, payment, shipping, tax, order creation, success redirect, live OAuth, protected customer data, and B2B pricing remain owner-gated per Phase 17 boundaries.

## Self-Check

PASSED. Summary file exists and task commits `49cd2888`, `1c952190`, `646fd043`, `de6118fe`, and `17569074` are present in git history.
