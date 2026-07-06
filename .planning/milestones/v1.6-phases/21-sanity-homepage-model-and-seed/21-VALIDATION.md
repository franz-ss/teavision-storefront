---
phase: 21
slug: sanity-homepage-model-and-seed
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-02
revised: 2026-07-03
---

# Phase 21 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property               | Value                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| **Framework**          | node:test plus Sanity CLI validation                                     |
| **Config file**        | `../teavision-cms/package.json`                                          |
| **Quick run command**  | `cd ../teavision-cms && pnpm test`                                       |
| **Full suite command** | `cd ../teavision-cms && pnpm test && pnpm schema:validate && pnpm build` |
| **Estimated runtime**  | ~120 seconds                                                             |

## Sampling Rate

- **After schema edits:** Run `cd ../teavision-cms && pnpm test`.
- **After seed script edits:** Run `cd ../teavision-cms && pnpm test`.
- **Before phase completion:** Run `cd ../teavision-cms && pnpm test && pnpm schema:validate && pnpm build`.
- **Max feedback latency:** 120 seconds.

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement | Threat Ref | Secure Behavior                                      | Test Type   | Automated Command                                | File Exists | Status  |
| -------- | ---- | ---- | ----------- | ---------- | ---------------------------------------------------- | ----------- | ------------------------------------------------ | ----------- | ------- |
| 21-01-01 | 01   | 1    | CMS-01      | T-21-01    | Singleton only, no draft/public storefront exposure  | schema/unit | `cd ../teavision-cms && pnpm test`               | yes         | passed  |
| 21-01-02 | 01   | 1    | CMS-02      | T-21-02    | Fixed fields, no arbitrary page builder              | schema/unit | `cd ../teavision-cms && pnpm test`               | yes         | passed  |
| 21-01-03 | 01   | 1    | CMS-03      | T-21-03    | Explicit `--execute`, no secret/raw document logging | unit/build  | `cd ../teavision-cms && pnpm test && pnpm build` | yes         | passed  |

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

## Manual-Only Verifications

| Behavior                                       | Requirement | Why Manual                             | Test Instructions                                                                                                            |
| ---------------------------------------------- | ----------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Studio singleton appears as one Homepage entry | CMS-01      | Human editor UX smoke; automated tests cover the structure resolver singleton document ID and generic-list filtering. | `cd ../teavision-cms && pnpm dev`, then confirm the Structure panel opens one Homepage document with document ID `homePage`. |

## Executed Evidence

| Command | Result | Notes |
| ------- | ------ | ----- |
| `cd ../teavision-cms && pnpm test` | Pass | 24/24 tests. Validation audit added singleton Studio structure and homepage href validator coverage. |
| `cd ../teavision-cms && pnpm schema:validate` | Pass | Sanity schema validated with 0 errors / 0 warnings. |
| `cd ../teavision-cms && pnpm build` | Pass | Sanity Studio production build completed. |
| `cd ../teavision-cms && node_modules/.bin/tsc --noEmit` | Pass | TypeScript check completed with no output. |

## Validation Audit 2026-07-03

| Metric | Count |
| ------ | ----- |
| Gaps found | 2 |
| Resolved | 2 |
| Escalated | 0 |
| Tests added | 2 |

| Gap | Resolution | Verification |
| --- | ---------- | ------------ |
| `CMS-01` singleton Studio structure had manual evidence but no automated assertion for the configured document ID and generic-list filtering. | Added a behavioral `schemaTypes.test.ts` assertion that drives the exported Sanity structure resolver with a fake builder, verifies the Homepage list item opens `homePage`, and verifies generic `homePage` entries are filtered out. | `cd ../teavision-cms && pnpm test` passed. |
| `CMS-02` homepage link safety was implemented through `isSafeHomeHref` but not directly exercised. | Added a `schemaTypes.test.ts` assertion for accepted `/`, `https://`, `mailto:`, and `tel:` hrefs plus rejected blank, `http://`, and `javascript:` values. | `cd ../teavision-cms && pnpm test` passed. |

Result: `nyquist_compliant` remains `true`; all discovered validation gaps were filled with automated tests, and the remaining Studio check is a manual editor UX smoke rather than the only proof for `CMS-01`.

## Validation Sign-Off

- [x] All tasks have automated verification commands.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags.
- [x] Feedback latency under 120 seconds.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** automated implementation evidence passed on 2026-07-03. Manual Studio smoke remains available for editor UX confirmation.
