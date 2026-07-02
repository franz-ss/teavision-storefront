---
phase: 21-sanity-homepage-model-and-seed
plan: 01
subsystem: cms
tags: [sanity, homepage, schema, seed]
requires:
  - phase: 21
    provides: Phase 21 requirements and current storefront homepage content inventory
provides:
  - Sanity homePage singleton schema with fixed section fields
  - Homepage object schemas for current authored sections
  - Dry-run-first homePage seed script and tests
affects: [phase-22-storefront-data-rendering, phase-23-preview-revalidation]
tech-stack:
  added: []
  patterns:
    - Sibling CMS owns homepage schema and seed tooling
    - Storefront runtime remains unchanged until Phase 22
key-files:
  created:
    - ../teavision-cms/schemaTypes/documents/home-page.ts
    - ../teavision-cms/schemaTypes/objects/homepage/
    - ../teavision-cms/scripts/seed-home-page.ts
    - ../teavision-cms/scripts/seed-home-page/data.ts
    - ../teavision-cms/scripts/seed-home-page.test.ts
  modified:
    - ../teavision-cms/sanity.config.ts
    - ../teavision-cms/schemaTypes/index.ts
    - ../teavision-cms/schemaTypes/objects/seo.ts
    - ../teavision-cms/schemaTypes/schemaTypes.test.ts
    - ../teavision-cms/package.json
key-decisions:
  - "Phase 21 remained CMS-only: no storefront runtime, metadata, cache, image, or webhook files changed."
  - "The homepage model uses fixed fields in current section order instead of a page-builder array."
  - "Seed execution is dry-run-first and requires --execute before creating or replacing homePage."
patterns-established:
  - "Singleton Studio structure item filters homePage out of generic document lists."
  - "Seed scripts log document/count status only, with injected dependencies for tests."
requirements-completed: [CMS-01, CMS-02, CMS-03]
duration: 16 min
completed: 2026-07-02
---

# Phase 21 Plan 01: Homepage Singleton Schema And Seed Script Summary

**Sanity homepage singleton and dry-run seed tooling now exist in the sibling CMS without changing the storefront.**

## Performance

- **Duration:** 16 min
- **Started:** 2026-07-02T03:16:05Z
- **Completed:** 2026-07-02T03:32:23Z
- **Tasks:** 4
- **Files modified:** 17 CMS files plus this summary

## Accomplishments

- Added a `homePage` singleton document with fixed fields matching the current storefront homepage order.
- Added short, folder-scoped homepage object schemas: `section`, `link`, `proof-point`, `image-card`, `hero`, `testimonial`, and `faq`.
- Added `pnpm seed:home`, dry-run by default, with `--execute` required for a single `homePage` create-or-replace.
- Added tests for schema registration, field order, `/` canonical validation, seed dry-run, image conversion, and missing-image failure.

## Task Commits

1. **Tasks 1-4: Homepage singleton, object schemas, seed script, and verification** - `092032f` in `../teavision-cms`

**Plan metadata:** pending this commit

## Files Created/Modified

- `../teavision-cms/schemaTypes/documents/home-page.ts` - `homePage` singleton document and fixed section fields.
- `../teavision-cms/schemaTypes/objects/homepage/*.ts` - Minimal reusable homepage object schemas.
- `../teavision-cms/sanity.config.ts` - Singleton Studio structure entry for Homepage.
- `../teavision-cms/schemaTypes/objects/seo.ts` - Canonical validation accepts `/` and existing `/blogs/...` paths.
- `../teavision-cms/scripts/seed-home-page.ts` - Dry-run-first seed runner with image upload conversion.
- `../teavision-cms/scripts/seed-home-page/data.ts` - Current homepage content snapshot for the singleton seed.
- `../teavision-cms/scripts/seed-home-page.test.ts` - Seed runner tests.
- `../teavision-cms/package.json` - Adds `seed:home` and includes seed tests in `pnpm test`.

## Decisions Made

- No storefront files were edited in Phase 21, preserving the strict no SEO/PageSpeed regression rule.
- Decorative/motif-only images used by code-owned layout bands were not promoted into required CMS fields; the schema covers authored content and required visible images.
- The pre-existing untracked `../teavision-cms/pnpm-workspace.yaml` was not modified or staged.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `pnpm` initially failed before running scripts because the pre-existing untracked `pnpm-workspace.yaml` contains `allowBuilds.esbuild: set this to true or false`. Verification used a per-process `pnpm_config_verify_deps_before_run=false` override so scripts could run without modifying that file.

## Verification

- `cd ../teavision-cms && pnpm_config_verify_deps_before_run=false pnpm test` - passed, 22/22 tests.
- `cd ../teavision-cms && pnpm_config_verify_deps_before_run=false pnpm schema:validate` - passed, 0 errors / 0 warnings.
- `cd ../teavision-cms && pnpm_config_verify_deps_before_run=false pnpm build` - passed.
- `cd ../teavision-cms && node_modules/.bin/tsc --noEmit` - passed.
- Seed image path check - passed, 30/30 referenced images exist under `../teavision.com.au/public`.
- `git status --short` in the storefront showed no runtime file changes.

## User Setup Required

None for this phase. Running the real seed later requires existing Sanity write credentials and `pnpm seed:home -- --execute`.

## Next Phase Readiness

Phase 22 can consume the sibling CMS `homePage` document through a typed storefront data boundary. The strict SEO/PageSpeed boundary remains intact because `/` rendering, metadata, JSON-LD, cache behavior, and image delivery were not changed in Phase 21.

---
*Phase: 21-sanity-homepage-model-and-seed*
*Completed: 2026-07-02*
