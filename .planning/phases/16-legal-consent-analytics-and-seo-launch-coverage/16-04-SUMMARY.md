---
phase: 16-legal-consent-analytics-and-seo-launch-coverage
plan: 04
subsystem: seo
tags: [nextjs, sitemap, robots, noindex, search-console, launch-readiness]

requires:
  - phase: 16-legal-consent-analytics-and-seo-launch-coverage
    provides: Legal policy registry/routes/redirects from Plan 16-01 and analytics launch runbook from Plan 16-03
provides:
  - Registry-backed launch SEO route matrix for legal, static, search, and redirect surfaces
  - Sitemap expansion driven by launch route expectations while preserving DISABLE_INDEXING
  - Deterministic SEO probe covering runbook, redirects, disabled, and enabled indexing modes
  - Owner-gated Search Console and launch indexing evidence documentation
affects: [seo, legal, sitemap, robots, analytics-runbook, launch-evidence]

tech-stack:
  added: []
  patterns:
    - Route-matrix-driven sitemap coverage
    - Plain Node launch probes with offline evidence modes and live local-production checks
    - Owner-gated external SEO evidence tracked separately from code completion

key-files:
  created:
    - src/lib/seo/launch-route-matrix.ts
    - src/lib/seo/launch-route-matrix.test.ts
    - scripts/seo/probe-launch-seo.mjs
    - docs/launch/seo-route-evidence.md
  modified:
    - src/app/sitemap.ts
    - scripts/component-contracts/noindex-mode.test.mjs
    - docs/launch/analytics-and-indexing-runbook.md

key-decisions:
  - "Launch sitemap static coverage is derived from `getLaunchSeoRouteExpectations()` so legal and owner-authored service pages cannot drift from SEO evidence."
  - "`/search` remains represented in launch SEO checks but is not sitemap-indexable because the route is explicitly noindexed."
  - "Search Console submission and URL inspection remain owner-gated proof, while robots/sitemap/canonical/noindex/redirect checks are automated locally."

patterns-established:
  - "SEO route matrix: static, legal, and redirect launch expectations live in `src/lib/seo/launch-route-matrix.ts` and are consumed by sitemap/probe checks."
  - "SEO evidence probe: `scripts/seo/probe-launch-seo.mjs` uses offline modes for source/runbook proof and live modes for local production indexing checks."

requirements-completed: [SEO-01, LEGAL-01, LEGAL-02, ANALYTICS-03]

duration: 17 min
completed: 2026-06-23
---

# Phase 16 Plan 04: SEO Launch Indexing Coverage Summary

**Launch indexing flip coverage with route-matrix-driven sitemap entries, disabled/enabled SEO probes, policy redirect evidence, and owner-gated Search Console proof.**

## Performance

- **Duration:** 17 min
- **Started:** 2026-06-23T01:02:47Z
- **Completed:** 2026-06-23T01:19:59Z
- **Tasks:** 4
- **Files modified:** 7

## Accomplishments

- Added `src/lib/seo/launch-route-matrix.ts` as the canonical SEO expectation matrix for legal pages, launch static/service pages, `/search`, and policy redirects.
- Updated `src/app/sitemap.ts` so enabled-mode static sitemap coverage comes from route expectations and disabled mode still returns an empty sitemap.
- Added `scripts/seo/probe-launch-seo.mjs` with `runbook`, `redirects`, `disabled`, and `enabled` modes, avoiding owner-gated Search Console and live commerce flows.
- Expanded launch documentation so analytics verification, indexing cutover, sitemap submission, and Search Console proof are recorded in one runbook/evidence flow.

## Task Commits

Each task was committed atomically:

1. **Task 1: Define launch route expectations for legal, static, product, search, and redirect surfaces** - `08a13d7` (feat)
2. **Task 2: Expand sitemap and preserve disabled-indexing behavior** - `a7ad728` (feat)
3. **Task 3: Add launch SEO probe for disabled and enabled modes** - `2192d1c` (feat)
4. **Task 4: Complete launch indexing and Search Console runbook coverage** - `cb67034` (docs)

## Files Created/Modified

- `src/lib/seo/launch-route-matrix.ts` - Central route expectations for launch-indexable static/legal pages, non-indexable search, and policy redirects.
- `src/lib/seo/launch-route-matrix.test.ts` - Unit coverage proving legal registry entries, static service pages, and redirect aliases are represented.
- `src/app/sitemap.ts` - Static sitemap entries now derive from route expectations and preserve empty output when indexing is disabled.
- `scripts/component-contracts/noindex-mode.test.mjs` - Contract coverage for empty disabled sitemap behavior and route-matrix-driven sitemap coverage.
- `scripts/seo/probe-launch-seo.mjs` - Plain Node SEO evidence probe with offline runbook/redirect checks and live disabled/enabled modes.
- `docs/launch/seo-route-evidence.md` - SEO evidence table, pending launch-host rows, and owner-gated Search Console status.
- `docs/launch/analytics-and-indexing-runbook.md` - Pre-cutover, cutover, and post-cutover indexing steps adjacent to analytics verification.

## Decisions Made

- Sitemap inclusion is controlled by `shouldAppearInSitemap` in the launch route matrix, not by a separate hardcoded sitemap-only list.
- `/search` remains in route evidence but has `shouldIndexWhenEnabled: false` and `shouldAppearInSitemap: false` because the route is intentionally noindexed.
- The SEO probe reads route-matrix/legal-registry source with plain Node instead of importing TypeScript, keeping the documented `node scripts/seo/probe-launch-seo.mjs` command working without a transpiler.
- Search Console access, sitemap submission proof, and URL inspection proof are documented as owner-gated until property access or dated proof exists.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected legal route contract assertion**
- **Found during:** Task 2 (noindex-mode contract verification)
- **Issue:** The new contract test initially looked for legal policy URLs as literals in `launch-route-matrix.ts`, but those routes are intentionally derived from `LEGAL_POLICIES`.
- **Fix:** Updated the contract to assert the matrix imports/maps `LEGAL_POLICIES`, uses `policy.sitemap`, and checks legal URL literals in `src/lib/legal/policies.ts`.
- **Files modified:** `scripts/component-contracts/noindex-mode.test.mjs`
- **Verification:** `node --test scripts/component-contracts/noindex-mode.test.mjs` passed.
- **Committed in:** `a7ad728`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** The fix aligned the contract test with the registry-backed implementation and did not change scope.

## Issues Encountered

- PowerShell treated `[handle]` as a wildcard when reading the product page during Task 3 context gathering; reread the file with `-LiteralPath`.
- One ad hoc acceptance-check command hit shell quoting around a template string; reran the same check as a piped Node snippet.

## Known Stubs

None. Pending rows in `docs/launch/seo-route-evidence.md` are intentional owner-gated launch evidence states, not unfinished code or UI stubs.

## Verification

- `pnpm test:unit -- src/lib/seo/launch-route-matrix.test.ts` - passed
- `node --test scripts/component-contracts/noindex-mode.test.mjs` - passed
- `node scripts/seo/probe-launch-seo.mjs --mode runbook` - passed
- `node scripts/seo/probe-launch-seo.mjs --mode redirects` - passed
- `pnpm lint -- src/lib/seo src/app/sitemap.ts src/app/robots.ts scripts/seo/probe-launch-seo.mjs` - passed
- `pnpm typecheck` - passed
- Commit hooks ran full project lint and component-contract tests for each task commit.

## Authentication Gates

None.

## User Setup Required

None for local/CI completion. Production Search Console property access, sitemap submission proof, launch-host enabled-mode evidence, and representative product structured-data proof remain owner-gated launch tasks documented in `docs/launch/seo-route-evidence.md`.

## Next Phase Readiness

Phase 16 is complete. Phase 17 can use the SEO probe and runbook evidence table during the final production-readiness audit without changing the indexing gate or legal route registry.

## Self-Check: PASSED

- Confirmed key created files exist: summary, route matrix, route matrix test, SEO probe, and SEO evidence doc.
- Confirmed task commits exist: `08a13d7`, `a7ad728`, `2192d1c`, and `cb67034`.
- Confirmed plan-level verification commands passed after all task commits.

---
*Phase: 16-legal-consent-analytics-and-seo-launch-coverage*
*Completed: 2026-06-23*
