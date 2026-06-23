---
phase: 17-operations-performance-and-final-production-readiness-audit
plan: 03
subsystem: qa
tags: [nextjs, playwright, e2e, fake-shopify, customer-account, launch-readiness]

# Dependency graph
requires:
  - phase: 17-operations-performance-and-final-production-readiness-audit
    provides: safe public health endpoint, operations runbook, and redacted launch observability from 17-01 and 17-02
provides:
  - Production-like Playwright config that builds and starts the Next app itself
  - Fake Shopify and fake Customer Account provider lifecycle for browser evidence
  - Production smoke coverage for launch-critical routes and `/api/health`
  - Production e2e evidence doc separating automated fake-provider proof from owner-gated Shopify proof
affects: [phase-17-final-audit, qa, launch-readiness, owner-gated-proof]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Playwright-owned `next build` plus `next start` lifecycle for local production browser tests
    - Explicit local-only production test endpoint gate for fake providers during built-server verification
    - Browser smoke tests assert route status below 500 and forbid live checkout/OAuth navigation

key-files:
  created:
    - playwright.production.config.ts
    - tests/mocks/run-customer-account-api-server.ts
    - tests/mocks/run-next-production-server.mjs
    - tests/e2e/production-smoke.spec.ts
    - docs/launch/production-e2e-evidence.md
    - src/lib/shopify/customer-account/env.test.ts
  modified:
    - package.json
    - tests/e2e/cart-checkout.spec.ts
    - tests/mocks/shopify-graphql-server.ts
    - src/lib/shopify/env.ts
    - src/lib/shopify/customer-account/env.ts
    - src/lib/shopify/client.test.ts
    - docs/testing/cart-checkout-uat.md
    - docs/testing/customer-accounts-setup.md

key-decisions:
  - "Production e2e uses an explicit PLAYWRIGHT_PRODUCTION_TEST_MODE local-only gate so built Next verification can use fake providers without allowing normal production test endpoints."
  - "Searchanise is disabled and analytics stay fake in the production Playwright server environment so local browser evidence does not depend on production third-party services."
  - "Real Shopify hosted checkout, live Customer Account OAuth, protected customer data, and B2B pricing remain owner-gated evidence, not automated test behavior."

patterns-established:
  - "Use `pnpm test:e2e:production` for self-contained local production browser evidence."
  - "Extend fake providers when production smoke routes need Shopify-shaped data instead of reaching live providers."
  - "Assert no hosted Shopify checkout/OAuth URLs from browser responses or navigations in launch-critical e2e flows."

requirements-completed: [QA-01, QA-02, QA-03]

# Metrics
duration: 24 min
completed: 2026-06-23
---

# Phase 17 Plan 03: Production-Like Fake-Provider E2E Lifecycle Summary

**Self-owned Playwright production e2e lifecycle with fake Shopify, fake Customer Account, route smoke coverage, and owner-gated checkout/OAuth evidence boundaries**

## Performance

- **Duration:** 24 min
- **Started:** 2026-06-23T07:19:11Z
- **Completed:** 2026-06-23T07:43:02Z
- **Tasks:** 4
- **Files modified:** 14

## Accomplishments

- Added `playwright.production.config.ts` and `test:e2e:production` so Playwright starts fake providers, runs `next build`, starts `next start`, and owns the full browser lifecycle.
- Added a fake Customer Account API CLI wrapper and a Next production server helper for clean signal handling and non-zero build/start failures.
- Hardened cart checkout e2e to assert browser responses and navigations never reach hosted Shopify checkout domains.
- Added production smoke coverage for home, collection, PDP, cart, search, account bridge, privacy policy, and public health.
- Documented local production e2e evidence and cross-linked the existing owner-gated checkout and Customer Account launch docs.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add a production-like Playwright config and server lifecycle** - `4cace9b2` (feat)
2. **Task 2: Harden existing browser tests for fake-provider production mode** - `8007a355` (fix)
3. **Task 3: Add production smoke coverage for launch-critical routes** - `6263e2f0` (feat)
4. **Task 4: Record production e2e evidence and owner-gated boundary** - `bc69b144` (docs)

## Files Created/Modified

- `playwright.production.config.ts` - Production Playwright config with fake Storefront, fake Customer Account, and built Next server web servers.
- `tests/mocks/run-customer-account-api-server.ts` - CLI wrapper for the fake Customer Account API server.
- `tests/mocks/run-next-production-server.mjs` - Build/start helper that runs `next build` then `next start`.
- `tests/e2e/production-smoke.spec.ts` - Production smoke suite for launch-critical routes and `/api/health`.
- `docs/launch/production-e2e-evidence.md` - Local production e2e evidence boundary and owner-gated proof record.
- `tests/e2e/cart-checkout.spec.ts` - Hosted-checkout URL observation assertions.
- `tests/mocks/shopify-graphql-server.ts` - Fake Storefront page and collection operations needed by production build/smoke.
- `src/lib/shopify/env.ts` and `src/lib/shopify/customer-account/env.ts` - Explicit local-only production test endpoint gate.
- `src/lib/shopify/client.test.ts` and `src/lib/shopify/customer-account/env.test.ts` - Coverage for the explicit production e2e fake-provider gate.
- `docs/testing/cart-checkout-uat.md` and `docs/testing/customer-accounts-setup.md` - Cross-links to production e2e evidence while preserving owner approvals.

## Decisions Made

- The production e2e command is allowed to use local fake provider endpoints during `next build`/`next start` only when `PLAYWRIGHT_PRODUCTION_TEST_MODE=true`; normal production runtime still rejects guarded test endpoints.
- Searchanise is explicitly disabled in the production Playwright server environment to avoid using external search as test evidence.
- Owner-gated Shopify hosted checkout, live OAuth, protected customer data, and B2B pricing remain documented launch gates rather than automated browser actions.

## Verification

- `pnpm typecheck` - passed
- `pnpm test:e2e:production -- --list` - passed, listed 17 tests across 3 files
- `pnpm test:unit -- tests/setup/smoke.test.ts src/lib/shopify/client.test.ts src/lib/shopify/customer-account/env.test.ts` - passed
- `pnpm test:e2e:production -- tests/e2e/cart-checkout.spec.ts tests/e2e/consent.spec.ts` - passed, 9 tests
- `pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts` - passed, 8 tests
- `pnpm test:e2e:production` - passed, 17 tests
- `node -e "const fs=require('fs');const s=fs.readFileSync('docs/launch/production-e2e-evidence.md','utf8');for(const n of ['# Production E2E Evidence','pnpm test:e2e:production','https://checkout.test/']){if(!s.includes(n))throw new Error('missing '+n)}console.log('OK')"` - passed
- Commit hooks for all four task commits ran `node scripts/check-tailwind-classes.mjs && eslint .` and `node --test scripts/eslint-rules/*.test.mjs scripts/component-contracts/*.test.mjs` - passed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added explicit local production test endpoint gate**
- **Found during:** Task 2 (Harden existing browser tests for fake-provider production mode)
- **Issue:** `next build` runs production runtime code, and the existing Storefront/Customer Account safety guards correctly rejected local test endpoints in production.
- **Fix:** Added `PLAYWRIGHT_PRODUCTION_TEST_MODE=true` as an explicit Playwright-only gate while preserving local-host validation and normal production rejection.
- **Files modified:** `src/lib/shopify/env.ts`, `src/lib/shopify/customer-account/env.ts`, `src/lib/shopify/client.test.ts`, `src/lib/shopify/customer-account/env.test.ts`, `playwright.production.config.ts`
- **Verification:** `pnpm test:unit -- src/lib/shopify/client.test.ts src/lib/shopify/customer-account/env.test.ts`; `pnpm test:e2e:production -- tests/e2e/cart-checkout.spec.ts tests/e2e/consent.spec.ts`
- **Committed in:** `8007a355`

**2. [Rule 3 - Blocking] Extended fake Shopify page operations for production prerendering**
- **Found during:** Task 2 (Harden existing browser tests for fake-provider production mode)
- **Issue:** Production build prerendered the Shopify catch-all page route and fake Shopify did not handle `GetPages`/`GetPage`; an empty pages connection also violates Next 16 Cache Components `generateStaticParams` validation.
- **Fix:** Added a fake non-reserved page summary and page payload to the fake Storefront server.
- **Files modified:** `tests/mocks/shopify-graphql-server.ts`
- **Verification:** `pnpm test:unit -- tests/setup/smoke.test.ts src/lib/shopify/client.test.ts src/lib/shopify/customer-account/env.test.ts`; production e2e subset reruns
- **Committed in:** `8007a355`

**3. [Rule 2 - Missing Critical Safety] Disabled Searchanise for local production e2e**
- **Found during:** Task 3 (Add production smoke coverage for launch-critical routes)
- **Issue:** Local shell env could enable live Searchanise during server-side search rendering, which would make production smoke depend on a third-party provider outside the plan's fake-provider boundary.
- **Fix:** Set `NEXT_PUBLIC_SEARCHANISE_ENABLED=false` and blank API key in the production Playwright Next server env.
- **Files modified:** `playwright.production.config.ts`, `tests/e2e/production-smoke.spec.ts`
- **Verification:** `pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts`; `pnpm test:e2e:production`
- **Committed in:** `6263e2f0`

**4. [Rule 3 - Blocking] Extended fake Shopify collection operations for production route smoke**
- **Found during:** Task 3 (Add production smoke coverage for launch-critical routes)
- **Issue:** `/collections/all` production smoke needs collection detail, collection products, and cursor-index operations from fake Shopify.
- **Fix:** Added fake `GetCollection`, `GetCollectionProducts`, and `GetCollectionCursorIndex` responses for the `all` collection.
- **Files modified:** `tests/mocks/shopify-graphql-server.ts`
- **Verification:** `pnpm test:e2e:production -- tests/e2e/production-smoke.spec.ts`; `pnpm test:e2e:production`
- **Committed in:** `6263e2f0`

---

**Total deviations:** 4 auto-fixed (3 blocking issues, 1 missing critical safety)
**Impact on plan:** The fixes were required to make the planned production-like fake-provider lifecycle actually self-contained. No real Shopify checkout, payment, order, OAuth, protected data, B2B pricing, or Search Console checks were automated.

## Issues Encountered

- Initial production e2e startup failed on production-runtime rejection of fake Storefront endpoints; resolved with the explicit local production test gate.
- Fake Shopify initially lacked page and collection operations required by production build/smoke; resolved by extending the fake provider.
- Search smoke initially rendered live Searchanise results from local env; resolved by disabling Searchanise in the production e2e server env.
- Cart smoke initially used a non-exact heading locator; resolved by matching `Your Cart` exactly.

## Known Stubs

None. Stub-pattern scans only found internal test arrays, test-server defaults, and null checks; none flow to UI rendering as placeholder data. Empty Searchanise env values in `playwright.production.config.ts` intentionally disable an external provider for local fake-provider evidence.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: explicit-prod-test-endpoint-gate | `src/lib/shopify/env.ts`, `src/lib/shopify/customer-account/env.ts` | `PLAYWRIGHT_PRODUCTION_TEST_MODE` allows local fake endpoints during built-server e2e; the guard still requires explicit test mode and localhost/127.0.0.1 endpoints, and normal production remains blocked. |

## User Setup Required

None - no external service configuration required. Real Shopify hosted checkout, live OAuth, protected customer data, B2B pricing, payment/order, and Search Console proof still require owner/admin approval and evidence outside automated local e2e.

## Next Phase Readiness

Ready for `17-04`: performance, Core Web Vitals, duplicate skip-link, and UX/accessibility evidence can run against the same production-like local server lifecycle and fake-provider boundaries.

## Self-Check: PASSED

- Created files exist in the worktree.
- Task commits exist in git history.
- Required verification commands passed.
- SUMMARY includes deviations, known-stub review, and threat-surface review.

---
*Phase: 17-operations-performance-and-final-production-readiness-audit*
*Completed: 2026-06-23*
