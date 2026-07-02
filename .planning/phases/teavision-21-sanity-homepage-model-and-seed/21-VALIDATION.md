---
phase: 21
slug: sanity-homepage-model-and-seed
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-02
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
| 21-01-01 | 01   | 1    | CMS-01      | T-21-01    | Singleton only, no draft/public storefront exposure  | schema/unit | `cd ../teavision-cms && pnpm test`               | yes         | pending |
| 21-01-02 | 01   | 1    | CMS-02      | T-21-02    | Fixed fields, no arbitrary page builder              | schema/unit | `cd ../teavision-cms && pnpm test`               | yes         | pending |
| 21-01-03 | 01   | 1    | CMS-03      | T-21-03    | Explicit `--execute`, no secret/raw document logging | unit/build  | `cd ../teavision-cms && pnpm test && pnpm build` | yes         | pending |

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

## Manual-Only Verifications

| Behavior                                       | Requirement | Why Manual                             | Test Instructions                                                                                                            |
| ---------------------------------------------- | ----------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Studio singleton appears as one Homepage entry | CMS-01      | Requires running Sanity Studio locally | `cd ../teavision-cms && pnpm dev`, then confirm the Structure panel opens one Homepage document with document ID `homePage`. |

## Validation Sign-Off

- [x] All tasks have automated verification commands.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags.
- [x] Feedback latency under 120 seconds.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending execution
