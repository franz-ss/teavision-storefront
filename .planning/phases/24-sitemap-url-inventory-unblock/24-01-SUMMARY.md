---
phase: '24-sitemap-url-inventory-unblock'
plan: '01'
subsystem: seo-api
tags: [nextjs-16, route-handler, csv, bearer-auth, noindex]

requires: []
provides:
  - Deterministic canonical-production URL inventory across every locked public content source
  - Temporary flag- and bearer-secret-gated CSV export with fail-closed source orchestration
  - Frozen sitemap, robots, noindex, and launch-matrix regression proof
affects: [seo-migration, redirect-worksheet, phases-25-26]

tech-stack:
  added: []
  patterns:
    - Pure inventory assembly separated from request-time source orchestration
    - Same-length timing-safe bearer comparison with response-wide noindex and private no-store headers
    - Explicit Next.js connection boundary for flag-first request-time Route Handlers

key-files:
  created:
    - .planning/phases/24-sitemap-url-inventory-unblock/24-PHASE-START-COMMIT.txt
    - .planning/phases/24-sitemap-url-inventory-unblock/24-USER-SETUP.md
    - src/lib/seo/url-inventory.ts
    - src/lib/seo/url-inventory.test.ts
    - src/app/api/seo/url-inventory/route.ts
    - src/app/api/seo/url-inventory/route.test.ts
  modified:
    - src/lib/env/server.ts
    - src/lib/observability/logger.ts
    - src/lib/observability/logger.test.ts
    - .env.example
    - package.json

key-decisions:
  - 'Keep the inventory independent of DISABLE_INDEXING and protect it with dedicated server-only export settings.'
  - 'Treat every upstream, assembly, serialization, canonical-origin, date, and metadata conflict failure as a generic non-CSV failure.'
  - 'Call Next.js connection() before the flag-first gate so a disabled build cannot prerender and cache the temporary route.'

patterns-established:
  - 'Inventory contract: finite source registries and complete existing operations feed a pure deduplicating assembler.'
  - 'Operational export: feature concealment, configured-secret validation, header-only bearer auth, then fail-closed source access.'

requirements-completed: [SEO-01, SEO-02]

duration: 30 min
completed: 2026-07-10
---

# Phase 24 Plan 01: Sitemap & URL-inventory Unblock Summary

**A deterministic canonical-production CSV inventory with strict temporary access controls, metadata-only logging, and unchanged staging noindex behavior**

## Performance

- **Duration:** 30 min
- **Started:** 2026-07-10T08:59:30+08:00
- **Completed:** 2026-07-10T09:29:30+08:00
- **Tasks:** 3
- **Implementation files:** 10

## Accomplishments

- Locked an automated 29-row fixture contract: 15 static, 5 legal, 1 Shopify page, 2 products, 2 collections, 1 blog listing, and 3 eligible articles. Every row is unique, code-point sorted, canonical-origin guarded, date-normalized, and deterministically serialized as quoted CRLF CSV.
- Added a server-only, disabled-by-default export route with flag-first concealment, 32+ character configured-secret validation, header-only bearer authentication, same-length timing-safe comparison, and no source access before authorization.
- Secured every 200/401/404/500/502 response with `X-Robots-Tag: noindex, nofollow` and `Cache-Control: private, no-store, max-age=0`; all source, assembly, and serialization failures return generic non-CSV responses.
- Proved logs contain only fixed reason/source fields and aggregate row/type counts, excluding secrets, request data, CSV content, individual inventory records, exception content, and upstream payloads.
- Preserved all five frozen/shared SEO sources byte-for-byte from baseline `8d6342897f19246b1a5455c335aea317df05b2b4` through final task HEAD and in the working tree.

## Task Commits

Each task was committed atomically:

1. **Task 1: Lock and implement the finite canonical inventory contract** — `241edcfc` (feat)
2. **Task 2: Add the secure fail-closed URL inventory Route Handler** — `8be8dee2` (feat)
3. **Task 3: Prove frozen noindex behavior and full production readiness** — `0a8e8372` (fix)

## Files Created/Modified

- `.planning/phases/24-sitemap-url-inventory-unblock/24-PHASE-START-COMMIT.txt` — durable frozen-source baseline SHA.
- `src/lib/seo/url-inventory.ts` — pure finite inventory assembly, canonical-origin guard, conflict-aware deduplication, sorting, and CSV serialization.
- `src/lib/seo/url-inventory.test.ts` — exact source/type counts, inclusions/exclusions, origin, dates, deduplication, conflicts, ordering, and CSV-format proof.
- `src/app/api/seo/url-inventory/route.ts` — request-time gate, source orchestration, generic failures, secure headers, attachment response, and aggregate logging.
- `src/app/api/seo/url-inventory/route.test.ts` — 20 HTTP-boundary cases across all gates, sources, failures, security headers, success, and log secrecy.
- `src/lib/env/server.ts` and `.env.example` — strict server-only flag and trimmed secret readers plus disabled operational defaults.
- `src/lib/observability/logger.ts` and `src/lib/observability/logger.test.ts` — typed export lifecycle events and redaction coverage.
- `package.json` — explicit route test registration in the integration suite without dependency changes.
- `.planning/phases/24-sitemap-url-inventory-unblock/24-USER-SETUP.md` — owner-gated runtime handoff procedure without secret values.

## Decisions Made

- The consultant inventory is a finite set of canonical public content destinations, not private, parameterized, discovery, redirect-source, filter, tag, or pagination variants.
- The export remains usable while staging noindex is enabled, but only through its separate disabled-by-default flag and server-owned bearer credential.
- `connection()` is the supported Next.js 16 request-time boundary for the flag-first handler; no deprecated dynamic route config or cache directive was introduced.

## Verification

- Focused inventory suite: 7/7 tests passed.
- Focused route suite: 20/20 tests passed.
- Focused logger suite: 9/9 tests passed.
- Unit suite: 70 files, 312 tests passed.
- Integration suite: 13 files, 82 tests passed and explicitly included the new route suite.
- Contract suite: 55/55 tests passed unchanged.
- Lint and TypeScript: passed.
- Production build: passed on Next.js 16.2.9; the export route is emitted as dynamic/request-time.
- Frozen source proof: baseline-through-HEAD and separate working-tree diffs both exited 0 for sitemap, robots, noindex helper, noindex contract, and launch route matrix.
- Scope proof: no dependency, UI, Storybook, GraphQL/codegen, schema, checkout, secret, or downloaded CSV change was introduced.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added an explicit legal-policy map key type**

- **Found during:** Task 2 full TypeScript verification
- **Issue:** TypeScript inferred the legal-policy map's literal key union too narrowly for launch-matrix paths.
- **Fix:** Declared the map key as `string` while preserving the legal-policy value type.
- **Files modified:** `src/lib/seo/url-inventory.ts`
- **Verification:** Typecheck, focused suites, complete suites, and production build passed.
- **Committed in:** `8be8dee2`

**2. [Rule 2 - Missing Critical] Forced the flag-first handler to remain request-time**

- **Found during:** Task 3 production-build route inspection
- **Issue:** With the export flag disabled at build time, the first build prerendered the early 404 branch before later request-header access could make the route dynamic.
- **Fix:** Added the documented Next.js 16 `connection()` boundary before evaluating the flag and mocked it at the HTTP test boundary.
- **Files modified:** `src/app/api/seo/url-inventory/route.ts`, `src/app/api/seo/url-inventory/route.test.ts`
- **Verification:** Focused route tests, lint, typecheck, complete suites, contracts, and a second production build passed; the route table changed from static to dynamic.
- **Committed in:** `0a8e8372`

---

**Total deviations:** 2 auto-fixed (1 blocking typing fix, 1 missing critical request-time guarantee).
**Impact on plan:** Both fixes were required to satisfy the planned type-safety and request-time security contracts; no scope expansion or architectural change occurred.

## Issues Encountered

- The initial production build succeeded but exposed a static route classification. This was treated as a blocking correctness issue and repaired before completion.
- No authentication gate, external-service action, or unresolved High threat remained.

## User Setup Required

**The approved consultant handoff remains owner-gated and was not fabricated from mocks.** See [24-USER-SETUP.md](./24-USER-SETUP.md) for the short enablement window, rotated secret, runtime header/count checks, immediate disablement, and CSV cleanup steps.

## Next Phase Readiness

- SEO-01 and SEO-02 are implementation-complete with full automated proof.
- The operator can perform the separately approved runtime delivery when consultant handoff is authorized.
- Phase 25 and Phase 26 may proceed independently; no Phase 24 code blocker remains.

## Self-Check: PASSED

- All six created implementation/setup artifacts exist.
- Task commits `241edcfc`, `8be8dee2`, and `0a8e8372` resolve in Git.
- All task acceptance criteria and plan-level verification commands pass.

---

*Phase: 24-sitemap-url-inventory-unblock*
*Completed: 2026-07-10*
