---
phase: 18-seo-audit-remediation
plan: 01
subsystem: seo
tags: [seo, redirects, url-parity, nextjs, launch-probe]

# Dependency graph
requires:
  - phase: 16-legal-consent-analytics-and-seo-launch-coverage
    provides: Launch SEO route matrix, policy redirect registry, and SEO probe patterns
  - phase: 18-seo-audit-remediation
    provides: Phase 18 audit context, research, validation strategy, and pattern map
provides:
  - URL parity register with two-source confirmation and owner/operator handoff rows
  - App-owned redirect expectations for the existing nested collection-product redirect
  - URL audit probe mode that validates register evidence against coded redirects
affects: [phase-18, SEO-AUDIT-01, redirects, launch-seo-probes]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Two-source-confirmed URL parity register before app redirects
    - Source-mode SEO probe validation for register-to-code redirect coverage

key-files:
  created:
    - docs/launch/seo-url-parity-register.md
    - docs/launch/seo-audit-remediation.md
    - scripts/seo/probe-launch-seo.test.mjs
  modified:
    - src/lib/seo/launch-route-matrix.ts
    - src/lib/seo/launch-route-matrix.test.ts
    - scripts/seo/probe-launch-seo.mjs

key-decisions:
  - 'Only two-source-confirmed deterministic rows in the URL parity register are app-owned redirects; host, DNS, Vercel, Shopify-domain, Search Console, and missing owner export proof remain owner/operator handoff.'
  - 'Plan 18-01 retained the existing nested collection-product redirect and legal policy redirects; no broad product, collection, or catch-all redirects were added.'

patterns-established:
  - 'URL audit probe: parse the register, require two evidence sources for app-owned rows, warn on missing optional owner exports, and fail when coded redirects lack register rows.'

requirements-completed: [SEO-AUDIT-01]

# Metrics
duration: 16 min
completed: 2026-06-25
---

# Phase 18 Plan 01: SEO Audit Inventory, URL Parity Map, And Redirect Decision Register Summary

**URL parity register and probe-backed app redirect evidence for SEO-AUDIT-01 without unsafe fallback redirects**

## Performance

- **Duration:** 16 min
- **Started:** 2026-06-25T10:31:39Z
- **Completed:** 2026-06-25T10:47:00Z
- **Tasks:** 2 completed
- **Files modified:** 6 task files plus this summary

## Accomplishments

- Created `docs/launch/seo-url-parity-register.md` with the required inputs, two-source rule, app-owned redirect, no-op parity, owner/operator handoff, and residual-risk sections.
- Created `docs/launch/seo-audit-remediation.md` with Phase 18 URL parity evidence and the `https://www.teavision.com.au` owner-gated host boundary.
- Added the existing `/collections/:handle/products/:productHandle -> /products/:productHandle` redirect to typed launch SEO expectations without adding new broad redirects.
- Added `node scripts/seo/probe-launch-seo.mjs --mode url-audit` plus node tests proving register evidence passes and missing register rows fail.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create the audit URL parity and redirect decision register** - `f86340db` (docs)
2. **Task 2: Extend redirect expectations and URL audit probe coverage** - `fb59c513` (feat)

**Plan metadata:** recorded by the commit that adds this SUMMARY and state updates.

## Files Created/Modified

- `docs/launch/seo-url-parity-register.md` - URL inventory, app-owned redirect register, no-op parity rows, handoff rows, and residual risks.
- `docs/launch/seo-audit-remediation.md` - Phase 18 evidence document with URL parity section and launch-host boundary.
- `src/lib/seo/launch-route-matrix.ts` - Adds app-owned redirect expectations and keeps policy redirects separate before combining.
- `src/lib/seo/launch-route-matrix.test.ts` - Covers app-owned redirect expectations and preserves route expectation uniqueness checks.
- `scripts/seo/probe-launch-seo.mjs` - Adds `url-audit` mode, register parsing, optional owner-export warnings, and coded redirect/register row checks.
- `scripts/seo/probe-launch-seo.test.mjs` - Covers successful URL audit warnings and missing-register-row failures.

## Decisions Made

- Deterministic app redirects are limited to rows marked `app-owned redirect` in the register with both evidence columns populated.
- Owner/SEO migration exports, `/blog/` simplification, DNS/Vercel redirects, alternate-host redirects, Shopify-domain behavior, and Search Console proof remain explicit handoff rows until later plans or owner/operator proof resolve them.
- The existing `next.config.ts` redirect set was preserved; no catch-all redirects for `/collections/:path*`, `/products/:path*`, or `/:path*` were added.

## Verification

- `pnpm exec prettier --check docs/launch/seo-url-parity-register.md docs/launch/seo-audit-remediation.md` - passed.
- `pnpm test:unit -- src/lib/seo/launch-route-matrix.test.ts` - passed.
- `node --test scripts/seo/probe-launch-seo.test.mjs` - passed.
- `node scripts/seo/probe-launch-seo.mjs --mode redirects` - passed.
- `node scripts/seo/probe-launch-seo.mjs --mode url-audit` - passed with the expected `WARN` for the optional missing owner migration export.
- Exact redirect-source scan of `next.config.ts` redirects block - passed; no banned catch-all redirects.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Normalized Markdown code-span paths in URL audit comparisons**

- **Found during:** Task 2
- **Issue:** The first `url-audit` implementation compared coded redirect paths such as `/products/:productHandle` against register table cells that included Markdown backticks, causing false `FAIL` rows.
- **Fix:** Added register path normalization before building the app-owned redirect lookup key.
- **Files modified:** `scripts/seo/probe-launch-seo.mjs`
- **Verification:** `node --test scripts/seo/probe-launch-seo.test.mjs` and `node scripts/seo/probe-launch-seo.mjs --mode url-audit`
- **Committed in:** `fb59c513`

---

**Total deviations:** 1 auto-fixed (Rule 1 bug)
**Impact on plan:** The fix made the planned probe behavior correct without changing scope or adding redirects.

## Issues Encountered

- `pdftotext` was unavailable, so the audit PDF was read through a temporary `pypdf` install outside the repository.
- The stub-pattern `rg` scan timed out unexpectedly on the small file set; a PowerShell literal search verified no stub patterns in the plan files.

## Authentication Gates

None.

## Known Stubs

None - no stub patterns were found in the files created or modified by this plan.

## User Setup Required

None - the owner/SEO migration export is optional for local deterministic evidence and remains documented as a handoff input.

## Next Phase Readiness

Plan 18-02 can proceed with heading/content hierarchy remediation. Plan 18-03 must use the register's `/blog/`, host redirect, and owner/operator handoff rows when deciding metadata, canonical, robots, sitemap, and blog-indexation changes.

## Self-Check: PASSED

- Created files exist: `docs/launch/seo-url-parity-register.md`, `docs/launch/seo-audit-remediation.md`, `scripts/seo/probe-launch-seo.test.mjs`.
- Task commits exist: `f86340db`, `fb59c513`.
- Plan verification commands passed after both task commits.
- No unexpected tracked deletions were introduced.

---

_Phase: 18-seo-audit-remediation_
_Completed: 2026-06-25_
