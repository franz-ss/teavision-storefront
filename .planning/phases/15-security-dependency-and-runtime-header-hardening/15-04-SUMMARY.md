---
phase: 15-security-dependency-and-runtime-header-hardening
plan: 04
subsystem: abuse-controls
tags: [rate-limit, forms, search, logging, production-posture]
requires: [15-01]
provides:
  - "Fail-closed production rate-limit posture"
  - "Trusted client-IP header selection for intentional memory fallback"
  - "Rate-limit coverage for public form and search surfaces"
  - "Structured redacted provider diagnostics for touched form send paths"
affects: [security, forms, search, runtime-hardening, operator-config]
tech-stack:
  added: []
  patterns:
    - "Production rate limiting is explicit through external protection or trusted-header memory fallback"
    - "Route-handler tests belong in test:integration when src/app/api is excluded from test:unit"
key-files:
  created:
    - "src/lib/rate-limit/index.test.ts"
    - "src/app/api/search/suggestions/route.test.ts"
  modified:
    - "src/lib/env/server.ts"
    - "src/lib/rate-limit/index.ts"
    - "src/lib/contact/actions.ts"
    - "src/lib/contact/actions.test.ts"
    - "package.json"
    - "scripts/component-contracts/rate-limit.test.mjs"
    - "docs/conventions.md"
    - ".env.example"
key-decisions:
  - "Production fails closed unless RATE_LIMIT_EXTERNAL_PROTECTION=true or RATE_LIMIT_ALLOW_MEMORY_FALLBACK=true with RATE_LIMIT_TRUSTED_IP_HEADER."
  - "Only x-forwarded-for, x-real-ip, and cf-connecting-ip are accepted as trusted client-IP headers."
  - "Provider failure logs for touched public form paths record only surface and status."
patterns-established:
  - "Unit tests cover pure limiter policy; route-handler tests are included in integration."
requirements-completed: [SEC-05]
duration: 13 min
completed: 2026-06-22
---

# Phase 15 Plan 04: Public Form and Search Abuse-Control Posture Summary

**Made production abuse-control posture explicit and fail-closed, added trusted-header handling, and covered public form/search rate-limit behavior.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-06-22T18:35:00+08:00
- **Completed:** 2026-06-22T18:47:52+08:00
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- Added `getRateLimitTrustedIpHeader()` and `isRateLimitProductionExplicit()` to server env policy.
- Updated `checkRateLimit()` to return a limited result in implicit production posture instead of silently using in-memory buckets.
- Updated `getClientIpFromHeaders()` to honor exactly one configured trusted header and otherwise preserve local/test fallback precedence.
- Added unit coverage for production fail-closed behavior, explicit external protection, intentional memory fallback, trusted headers, and fallback header precedence.
- Added rate-limit tests for contact, wholesale, custom blend, NPD order, newsletter, and search suggestions.
- Replaced raw Resend provider error logging in touched form paths with structured redacted `{ surface, status }` diagnostics.
- Documented `RATE_LIMIT_EXTERNAL_PROTECTION`, `RATE_LIMIT_ALLOW_MEMORY_FALLBACK`, and `RATE_LIMIT_TRUSTED_IP_HEADER` in `.env.example` and `docs/conventions.md`.
- Extended the rate-limit component contract so trusted-header support is source-guarded.

## Task Commits

Task work and one verification-loop fix were committed as:

1. **Task 1: Add explicit production rate-limit posture and trusted header handling** - `1a1f670` (fix)
2. **Task 2: Extend form/search tests and redacted logging** - `b7245c6` (test)
3. **Task 3: Document production rate-limit configuration and contract checks** - `bb3bef6` (docs)
4. **Verification fix: Widen provider-error mock type for typecheck** - `b82da95` (test)

## Files Created/Modified

- `src/lib/env/server.ts` - Rate-limit trusted-header and explicit-production posture helpers.
- `src/lib/rate-limit/index.ts` - Fail-closed production gate and trusted-header client identity selection.
- `src/lib/rate-limit/index.test.ts` - Unit coverage for production posture and trusted headers.
- `src/lib/contact/actions.ts` - Structured redacted provider diagnostics for contact, custom blend, wholesale, NPD, and newsletter send paths.
- `src/lib/contact/actions.test.ts` - Public form rate-limit coverage and provider-log redaction assertion.
- `src/app/api/search/suggestions/route.test.ts` - Search suggestions route tests for blank, limited, and provider-failure paths.
- `package.json` - Added the search suggestions route test to `test:integration`.
- `scripts/component-contracts/rate-limit.test.mjs` - Source contract for trusted-header helper names.
- `docs/conventions.md` - Production fail-closed and trusted-header deployment guidance.
- `.env.example` - Operator-facing `RATE_LIMIT_*` configuration block.

## Decisions Made

- API route tests were wired into `test:integration` because `test:unit` intentionally excludes `src/app/api/**/*.test.ts`.
- The limiter returns the existing safe rate-limit response path instead of throwing when production posture is implicit.
- The trusted-header setting is ignored unless it is exactly one of the three approved header names.

## Verification

- `pnpm test:unit -- src/lib/rate-limit/index.test.ts src/lib/contact/actions.test.ts "src/app/api/search/suggestions/route.test.ts"` - passed, 2 files and 15 tests. The API route file is excluded by the unit script and covered by integration.
- `pnpm exec vitest run --environment node src/app/api/search/suggestions/route.test.ts` - passed, 1 file and 3 tests.
- `pnpm test:contracts` - passed, 38 subtests.
- `pnpm test:integration` - passed, 9 files and 43 tests.
- `pnpm lint` - passed.
- `pnpm typecheck` - passed after the provider-error mock type fix.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Search route test was excluded from the planned unit command**
- **Found during:** Task 2 verification
- **Issue:** `pnpm test:unit` has `--exclude "src/app/api/**/*.test.ts"`, so the new search route test was not executed by that command.
- **Fix:** Added `src/app/api/search/suggestions/route.test.ts` to `test:integration` and verified it directly plus through the full integration suite.
- **Files modified:** `package.json`
- **Verification:** Direct Vitest route run passed; `pnpm test:integration` passed with 9 files and 43 tests.
- **Committed in:** `b7245c6`

**2. [Rule 3 - Blocking] Resend mock inferred provider error as null-only**
- **Found during:** Final `pnpm typecheck`
- **Issue:** The test mock type inferred `{ error: null }`, rejecting the provider-error object used for the redaction assertion.
- **Fix:** Widened the test mock return type to `{ error: unknown | null }`.
- **Files modified:** `src/lib/contact/actions.test.ts`
- **Verification:** `pnpm typecheck`, `pnpm lint`, and focused unit tests passed.
- **Committed in:** `b82da95`

---

**Total deviations:** 2 auto-fixed. **Impact:** Better standard-script coverage and clean TypeScript verification.

## Issues Encountered

- No runtime blockers after the route-test script wiring and mock typing fix.

## User Setup Required

- Production operators must choose and configure one explicit posture before launch:
  - `RATE_LIMIT_EXTERNAL_PROTECTION=true` when CDN/WAF/provider rate limits public form/search surfaces, or
  - `RATE_LIMIT_ALLOW_MEMORY_FALLBACK=true` plus a deployment-appropriate `RATE_LIMIT_TRUSTED_IP_HEADER` when intentionally accepting per-instance limits.

## Next Phase Readiness

Wave 2 is complete. Plan 15-05 can perform final built-server runtime probes against the dependency, header/CSP, account OAuth, and abuse-control evidence now in place.

---
*Phase: 15-security-dependency-and-runtime-header-hardening*
*Completed: 2026-06-22*
