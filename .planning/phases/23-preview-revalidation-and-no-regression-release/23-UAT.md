---
status: complete
phase: 23-preview-revalidation-and-no-regression-release
source: [23-01-SUMMARY.md]
started: 2026-07-03T14:23:03+08:00
updated: 2026-07-03T15:04:32+08:00
---

## Current Test
[testing complete]

## Tests

### 1. Secure Draft Preview Entry
expected: With `SANITY_PREVIEW_SECRET`, `SANITY_API_READ_TOKEN`, and a draft `homePage` document configured, visiting `/api/draft?secret=<valid>&slug=/` enables Draft Mode, redirects to `/`, and the homepage body shows draft homepage content.
result: pass

### 2. Invalid Preview Requests Stay Out Of Draft Mode
expected: Invalid or missing preview secrets, unsupported or unsafe slugs, and missing draft homepage documents return a clear non-2xx response, do not enable Draft Mode, and do not log secrets, tokens, raw URLs, or draft field values.
result: pass

### 3. Draft Mode Exit Returns To Published Homepage
expected: Visiting `/api/draft/disable` disables Draft Mode, redirects to `/`, and the homepage body returns to the published Sanity homepage content.
result: pass

### 4. Published SEO Surfaces Remain Published-Safe
expected: Draft Mode changes only homepage body content; metadata, canonical/noindex behavior, Open Graph data, and Organization/WebSite JSON-LD remain published-owned, and public visitors never see draft content, preview UI, stega markers, or source-map text.
result: pass

### 5. Signed HomePage Publish Revalidation
expected: A valid signed Sanity `homePage` publish webhook invalidates the `homePage` and `sanity-homepage` cache tags so the published homepage refreshes after reload, while existing blog and article revalidation behavior still works.
result: pass

### 6. No-Regression Release Gate
expected: `docs/launch/phase-23-homepage-release-gate.md` records the v1.5 PSI baseline, current public-preview PSI fields, Sanity publish smoke-test fields, blocked-by-default launch decision, and rollback rule; rollout remains blocked until current public-preview evidence is recorded without category-score regression.
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none yet]
