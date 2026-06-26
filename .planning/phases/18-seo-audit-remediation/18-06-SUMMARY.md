---
phase: 18-seo-audit-remediation
plan: 06
subsystem: seo
tags: [seo, structured-data, json-ld, launch-proof]

requires:
  - phase: 18-seo-audit-remediation
    provides: Phase 18 crawlable HTML and structured-data evidence baseline
provides:
  - Data-source-aware Product JSON-LD launch probe behavior
  - Regression coverage for default fixture, explicit product path, and missing Product JSON-LD cases
  - Operator documentation for fake-provider versus real-Shopify Product schema evidence
affects: [launch-seo-probes, production-readiness, structured-data-evidence]

tech-stack:
  added: []
  patterns:
    - Product structured-data probes track whether the product path came from the default fixture, env, or CLI
    - Default fake fixture path absence warns; explicit selected product path absence fails

key-files:
  created:
    - .planning/phases/18-seo-audit-remediation/18-06-SUMMARY.md
  modified:
    - scripts/seo/probe-launch-seo.mjs
    - scripts/seo/probe-launch-seo.test.mjs
    - docs/launch/seo-audit-remediation.md
    - docs/launch/final-production-readiness-report.md

key-decisions:
  - "Default /products/test-standard-tea is treated as fake-provider fixture evidence, not automatic proof for real Shopify-backed servers."
  - "Explicit --product-path and SEO_PROBE_PRODUCT_PATH values must fail when the selected product route is missing."
  - "Existing product pages without Product JSON-LD still fail so schema regressions remain blocking."

patterns-established:
  - "Probe source tracking: CLI/env/default path provenance is carried with parsed args so verification behavior can distinguish fixture defaults from operator-selected paths."
  - "Evidence docs separate fake-provider lifecycle proof from real Shopify product-path proof."

requirements-completed:
  - SEO-AUDIT-05

duration: 17 min
completed: 2026-06-26
---

# Phase 18 Plan 06: Product JSON-LD Probe Path Semantics Summary

**Data-source-aware Product JSON-LD launch probe that warns for missing default fixtures while preserving hard failures for real schema regressions**

## Performance

- **Duration:** 17 min
- **Started:** 2026-06-26T00:16:00Z
- **Completed:** 2026-06-26T00:33:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Product structured-data checks now distinguish default fixture paths from explicit CLI/env product paths.
- Focused Node tests prove Product JSON-LD pass, missing schema fail, default missing fixture warn, and explicit missing product fail behavior.
- Launch evidence docs now tell operators when default fake-provider evidence is valid and when real Shopify probes need `--product-path` or `SEO_PROBE_PRODUCT_PATH`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Make Product JSON-LD probe failures data-source-aware** - `fc9ae281` (fix)
2. **Task 2: Add regression coverage for fixture-path and real-product semantics** - `bb9dce8c` (test)
3. **Task 3: Update structured-data evidence instructions** - `5c54fe58` (docs)

**Plan metadata:** pending in plan-completion commit.

## Files Created/Modified

- `.planning/phases/18-seo-audit-remediation/18-06-SUMMARY.md` - Plan completion summary and verification record.
- `scripts/seo/probe-launch-seo.mjs` - Tracks product path source and applies WARN/FAIL behavior by data source intent.
- `scripts/seo/probe-launch-seo.test.mjs` - Adds helper-level Product JSON-LD regression tests with mocked fetch responses.
- `docs/launch/seo-audit-remediation.md` - Documents fake-provider default path evidence and explicit real-Shopify product path requirements.
- `docs/launch/final-production-readiness-report.md` - Notes that default fixture warnings are not live Shopify Product JSON-LD proof while preserving performance and owner-gated launch blockers.

## Decisions Made

- Default `/products/test-standard-tea` remains valid fake-provider production evidence because the fixture exists in `tests/fixtures/shopify/product.ts`.
- Real Shopify-backed probes must use an explicit product path from CLI or `SEO_PROBE_PRODUCT_PATH`; missing explicit paths fail instead of warning.
- Product aggregateRating checks were left unchanged so visible-review/schema mismatches still fail.

## Deviations from Plan

None - plan executed exactly as written.

**Total deviations:** 0 auto-fixed.
**Impact on plan:** No scope changes.

## Issues Encountered

- `pnpm exec prettier --check docs/launch/seo-audit-remediation.md docs/launch/final-production-readiness-report.md` initially reported generated Markdown style drift in the final readiness report. Ran Prettier on the two plan-owned docs and re-ran the check successfully.

## Verification

- `node --test scripts/seo/probe-launch-seo.test.mjs` - PASS, 10/10 tests.
- `node scripts/seo/probe-launch-seo.mjs --mode enabled --base-url http://127.0.0.1:3000` - PASS exit 0, default `/products/test-standard-tea` reported WARN with `--product-path/SEO_PROBE_PRODUCT_PATH` guidance.
- `node scripts/seo/probe-crawlable-html.mjs --start-server --base-url http://127.0.0.1:4173` - PASS after production build; `/products/test-standard-tea` Product JSON-LD found in fake-provider lifecycle.
- `pnpm exec prettier --check docs/launch/seo-audit-remediation.md docs/launch/final-production-readiness-report.md` - PASS.
- Pre-commit hooks ran after task commits: Tailwind class check, ESLint, and component-contract tests passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 18 gap closure is ready for phase verification. Product structured-data evidence now distinguishes local fake-provider proof from real Shopify-backed product-path proof, and performance/owner-gated launch blockers remain visible.

---

*Phase: 18-seo-audit-remediation*
*Completed: 2026-06-26*
