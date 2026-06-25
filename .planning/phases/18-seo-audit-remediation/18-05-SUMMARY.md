---
phase: 18-seo-audit-remediation
plan: 05
subsystem: seo
tags: [seo, crawlability, lighthouse, readiness, evidence, nextjs]

# Dependency graph
requires:
  - phase: 18-seo-audit-remediation
    provides: URL parity register, heading hierarchy, metadata/indexation, and structured-data evidence from Plans 18-01 through 18-04
  - phase: 17-performance-and-ux-remediation
    provides: PERF-01 strict local Lighthouse gate and performance evidence format
provides:
  - Raw first-response HTML crawlability probe for representative collection and PDP routes
  - Regenerated strict local Lighthouse and final production readiness evidence
  - Final audit-to-evidence matrix covering every Phase 18 SEO audit finding group
affects: [phase-18, launch-seo, crawlable-html, performance-readiness, owner-gated-proof]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Raw HTML SEO probe using `Accept-Encoding: identity` before hydration
    - Strict performance evidence remains blocking unless dated owner/staging/field acceptance exists
    - Audit matrix separates automated proof from owner/operator-gated proof

key-files:
  created:
    - scripts/seo/probe-crawlable-html.mjs
    - scripts/seo/probe-crawlable-html.test.mjs
  modified:
    - docs/launch/seo-audit-remediation.md
    - docs/launch/performance-evidence.md
    - docs/launch/final-production-readiness-report.md

key-decisions:
  - "Crawlable HTML proof uses raw fake-provider production HTML with `Accept-Encoding: identity` for `/collections/all` and `/products/test-standard-tea`."
  - "Strict local Lighthouse/readiness failures stay blocking because no dated owner, staging, or field Core Web Vitals acceptance artifact was supplied."
  - "The final SEO audit matrix records owner/operator residuals separately from local app remediation so external proof is not silently approved."

patterns-established:
  - "Representative crawl-critical routes must prove one H1, canonical, meaningful pre-hydration content, and JSON-LD from raw HTML."
  - "Final launch evidence documents failing metrics and owner gates directly instead of converting them into local pass states."

requirements-completed:
  - SEO-AUDIT-01
  - SEO-AUDIT-02
  - SEO-AUDIT-03
  - SEO-AUDIT-04
  - SEO-AUDIT-05
  - SEO-AUDIT-06
  - SEO-AUDIT-07

# Metrics
duration: 30 min
completed: 2026-06-25
---

# Phase 18 Plan 05: Crawlable HTML, Performance Evidence, And Final SEO Matrix Summary

**Raw crawlable HTML proof plus strict Lighthouse/readiness evidence and a final audit-to-evidence matrix for Phase 18 SEO remediation**

## Performance

- **Duration:** 30 min
- **Started:** 2026-06-25T11:52:00Z
- **Completed:** 2026-06-25T12:22:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Added `scripts/seo/probe-crawlable-html.mjs`, a raw HTML probe that starts the fake-provider production lifecycle or uses an existing base URL, fetches with `Accept-Encoding: identity`, and fails if collection/PDP HTML is skeleton-only or missing crawl-critical content.
- Regenerated strict local Lighthouse evidence and final readiness evidence. The performance gate remains `FAIL` and launch-blocking because all seven representative routes still have strict local metric failures.
- Added `## Audit-To-Evidence Matrix` to `docs/launch/seo-audit-remediation.md`, mapping URL parity, H1s, metadata/indexation, structured data, crawlability, performance, and owner/operator residuals to proof and risk.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add raw HTML crawlability probe for collection and PDP routes** - `06ea8dcd` (feat)
2. **Task 2: Regenerate strict performance and final readiness evidence** - `b9fd170e` (docs)
3. **Task 3: Produce final audit-to-evidence matrix** - `530e7127` (docs)

**Plan metadata:** recorded by the commit that adds this SUMMARY and state updates.

## Files Created/Modified

- `scripts/seo/probe-crawlable-html.mjs` - Raw HTML crawlability probe for `/collections/all` and `/products/test-standard-tea`.
- `scripts/seo/probe-crawlable-html.test.mjs` - Node tests for defaults, collection/PDP pass cases, skeleton-only failure detection, and JSON-LD graph traversal.
- `docs/launch/seo-audit-remediation.md` - Adds crawlable HTML evidence and the final audit-to-evidence matrix.
- `docs/launch/performance-evidence.md` - Regenerated strict local mobile Lighthouse evidence with current FAIL rows and LCP diagnostics.
- `docs/launch/final-production-readiness-report.md` - Regenerated final readiness report with performance still failing, score 94/100, and owner-gated rows preserved as pending.

## Decisions Made

- Raw HTML proof is representative lab evidence against fake-provider production HTML, not a claim about live Shopify, Search Console, DNS, Vercel, or Shopify-domain behavior.
- Performance evidence remains strict by default. `--allow-metric-failures` was not used for blocking evidence, and no `--performance-acceptance` artifact was supplied.
- Owner/operator gates remain pending for hosted checkout/payment/order/success redirect, live Customer Account OAuth, protected customer data, B2B pricing, Search Console proof, host redirects, and performance acceptance.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed import ordering required by commit hooks**

- **Found during:** Task 1 (Add raw HTML crawlability probe for collection and PDP routes)
- **Issue:** The first Task 1 commit attempt failed `import/order` after adding the new crawlability probe.
- **Fix:** Reordered imports in `scripts/seo/probe-crawlable-html.mjs` and reran focused verification before committing.
- **Files modified:** `scripts/seo/probe-crawlable-html.mjs`
- **Verification:** `node --test scripts/seo/probe-crawlable-html.test.mjs`, `pnpm lint`, and commit hook lint/contracts.
- **Committed in:** `06ea8dcd`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was required to satisfy existing project lint contracts and did not change task scope.

## Issues Encountered

- Direct audit PDF extraction was unavailable in this environment: `pypdf` was not installed and `pdftotext` was not on PATH. The final matrix used the already-committed Phase 18 audit register, research, validation, and prior summaries that trace the PDF finding groups.
- `pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173 --json-summary` exited 1 as expected for strict evidence. `docs/launch/performance-evidence.md` records seven `FAIL` rows, including `/account` CLS 0.128 and all representative route LCPs above 2500ms.
- `pnpm audit:readiness` exited 1 as expected because performance remains the failed automated check. The generated report records 16/17 automated checks passing, score 94/100, and 11 owner-gated proof items still pending.
- `gsd-sdk query requirements.mark-complete SEO-AUDIT-01 ... SEO-AUDIT-07` returned `not_found` for every audit ID because `.planning/REQUIREMENTS.md` tracks release-level IDs such as `SEO-01` and `PERF-01`, not Phase 18 audit-plan IDs. No requirements rows were changed.

## Verification

- `node --test scripts/seo/probe-crawlable-html.test.mjs` - PASS, 5 tests.
- `node --test scripts/seo/probe-launch-seo.test.mjs` - PASS, 5 tests.
- `node scripts/seo/probe-launch-seo.mjs --mode url-audit` - PASS exit 0 with expected `WARN` for missing optional owner migration export.
- `node scripts/seo/probe-crawlable-html.mjs --start-server --base-url http://127.0.0.1:4173` - PASS; production build started, `/collections/all` and `/products/test-standard-tea` raw HTML checks passed.
- `pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173 --json-summary` - FAIL exit 1 by strict metric design; evidence regenerated in `docs/launch/performance-evidence.md`.
- `pnpm audit:readiness` - FAIL exit 1 by strict performance design; report regenerated in `docs/launch/final-production-readiness-report.md`.
- `pnpm exec prettier --check docs/launch/seo-audit-remediation.md` - PASS after formatting.
- Commit hooks ran on all task commits and passed Tailwind class checks, ESLint, and component contract tests.

## Known Stubs

None blocking. Stub scan found:

- `docs/launch/performance-evidence.md` mentions an "empty placeholder" only to explain that the fake Shopify product now exercises a real PDP gallery path.
- `scripts/seo/probe-crawlable-html.mjs` uses internal empty array and `null` initializers for local traversal rows and lifecycle handles; these do not flow to UI rendering or evidence as stub data.

## Authentication Gates

None.

## Threat Flags

None. The plan added a local probe script and evidence documentation only; it did not add new app network endpoints, auth paths, file-access trust boundaries, or schema changes.

## User Setup Required

Owner/operator evidence is still required before launch sign-off for production host redirects, Shopify-domain behavior, Search Console sitemap submission/URL inspection, live checkout/payment/order/success redirect, live Customer Account OAuth, protected customer data, B2B/customer pricing, and any performance acceptance override.

## Next Phase Readiness

Phase 18 SEO remediation evidence is complete, but the launch decision remains blocked by strict local performance failures and external owner/operator proof gates. A future launch sign-off must either remediate the local Lighthouse failures or attach a dated owner/staging/field Core Web Vitals acceptance artifact.

## Self-Check: PASSED

- Summary file exists at `.planning/phases/18-seo-audit-remediation/18-05-SUMMARY.md`.
- Created files exist: `scripts/seo/probe-crawlable-html.mjs`, `scripts/seo/probe-crawlable-html.test.mjs`.
- Modified evidence files exist: `docs/launch/seo-audit-remediation.md`, `docs/launch/performance-evidence.md`, `docs/launch/final-production-readiness-report.md`.
- Task commits exist: `06ea8dcd`, `b9fd170e`, `530e7127`.
- Post-commit deletion checks found no tracked file deletions.
- Working tree had only the new summary and the pre-existing untracked `tmp/` directory before state updates.

---
*Phase: 18-seo-audit-remediation*
*Completed: 2026-06-25*
