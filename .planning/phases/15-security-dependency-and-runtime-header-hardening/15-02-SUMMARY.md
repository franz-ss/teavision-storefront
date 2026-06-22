---
phase: 15-security-dependency-and-runtime-header-hardening
plan: 02
subsystem: runtime-security
tags: [headers, csp, next-config, contracts]
requires: [15-01]
provides:
  - "Global production security header baseline in Next config"
  - "Report-only CSP builder with explicit current-host allowlists"
  - "Source contract coverage for header configuration"
affects: [security, headers, runtime-hardening, cache-components]
tech-stack:
  added: []
  patterns:
    - "Static report-only CSP is centralized in src/lib/security/headers.ts"
    - "Next headers() applies the shared header array globally"
key-files:
  created:
    - "src/lib/security/headers.ts"
    - "src/lib/security/headers.test.ts"
    - "scripts/component-contracts/security-headers.test.mjs"
  modified:
    - "next.config.ts"
key-decisions:
  - "Use Content-Security-Policy-Report-Only for Phase 15 so violations can be observed before enforcement."
  - "Avoid nonce CSP, proxy, and middleware so Cache Components and static/PPR behavior are preserved."
  - "Keep GA4, GTM, Meta, Klaviyo, and Shopify pixels out of the Phase 15 allowlist until Phase 16 decisions."
patterns-established:
  - "Security headers are pure data plus a builder function, with unit and source-contract tests."
requirements-completed: [SEC-02, SEC-03]
duration: 6 min
completed: 2026-06-22
---

# Phase 15 Plan 02: Security Headers and Report-Only CSP Baseline Summary

**Added a global Next.js security header baseline with a staged report-only CSP and no `x-powered-by` leakage.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-22T18:21:52+08:00
- **Completed:** 2026-06-22T18:26:50+08:00
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Created `src/lib/security/headers.ts` with named exports for `SecurityHeader`, `contentSecurityPolicyReportOnlyHeaderName`, `securityHeaders`, and `buildContentSecurityPolicy()`.
- Added the six approved security headers: HSTS, content-type options, referrer policy, permissions policy, frame protection, and report-only CSP.
- Built the CSP from an explicit current-host allowlist for Searchanise, Shopify, Sanity, Trustoo, and Google Maps.
- Wired `securityHeaders` into `next.config.ts` through global `headers()` and disabled Next's powered-by header.
- Added Vitest unit coverage plus a Node source-contract test that runs under the existing `pnpm test:contracts` glob.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add a pure security header and report-only CSP helper** - `53c8b98` (test)
2. **Task 2: Wire headers into Next config and disable x-powered-by** - `fe64e48` (feat)
3. **Task 3: Add source contract coverage for security headers** - `36d585c` (test)

## Files Created/Modified

- `src/lib/security/headers.ts` - Central security header list and single-line report-only CSP builder.
- `src/lib/security/headers.test.ts` - Unit tests for required header names, exact values, report-only mode, explicit CSP hosts, and banned speculative hosts.
- `next.config.ts` - Imports `securityHeaders`, applies them to `/:path*`, and sets `poweredByHeader: false`.
- `scripts/component-contracts/security-headers.test.mjs` - Source contract for `next.config.ts` integration and CSP host restrictions.

## Decisions Made

- CSP remains report-only in this plan; enforcement is deferred until probe evidence and Phase 16 third-party decisions.
- No nonce-based CSP, proxy, or middleware was added, matching the plan's Cache Components/PPR constraint.
- The current CSP intentionally does not pre-allow analytics or advertising hosts.

## Verification

- `pnpm test:unit -- src/lib/security/headers.test.ts` - passed, 1 file and 4 tests.
- `pnpm test:contracts` - passed, 38 subtests including `Next config applies the shared security header baseline`.
- `pnpm typecheck` - passed.
- `pnpm build` - passed with Next.js 16.2.9, Cache Components enabled, and 75 static pages generated.

## Deviations from Plan

None.

## Issues Encountered

None.

## User Setup Required

None.

## Next Phase Readiness

Plan 15-03 can start from a global report-only security header baseline with unit, contract, type, and build verification complete.

---
*Phase: 15-security-dependency-and-runtime-header-hardening*
*Completed: 2026-06-22*
