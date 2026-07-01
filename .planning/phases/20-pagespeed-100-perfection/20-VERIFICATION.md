---
phase: 20-pagespeed-100-perfection
verified: 2026-07-01T00:00:00Z
status: human_needed
score: 5/5 must-haves verified (code-level); 1 owner-gated re-measurement outstanding
overrides_applied: 0
human_verification:
  - test: "Re-run real Google PageSpeed Insights on `/` against the deployed preview (https://teavision-storefront.vercel.app/) after this phase's commits are live"
    expected: "LCP drops materially from the 3.4s / 2,040ms-resource-load-delay baseline (target trend: toward ~1.5s per 20-PSI-EVIDENCE.md diagnosis); the 'LCP request discovery' audit's fetchpriority=high check passes; the Sentry-chunk unused/legacy-JS flags clear; Speed Index improves; Performance score trends into the mid-90s. CLS stays 0."
    why_human: "PSI is an external, network-dependent, real-browser measurement service — it cannot be simulated by static grep/build checks, and the plan's own Task 4 checkpoint and 20-VALIDATION.md's 'Manual-Only / Owner-Gated Verifications' table both designate this as an owner-run step. It was explicitly skipped for Task 4's inlineCss decision (owner instructed to proceed on engineering judgment) and has not been performed since. SUMMARY.md documents this honestly as a pending open item, not a fabricated pass."
---

# Phase 20: PageSpeed 100/100 Perfection — Verification Report

**Phase Goal (LEAN SCOPE, per owner directive D-16 / 2026-06-30):** Resolve exactly the four homepage `/` PSI screenshot findings from `20-PSI-EVIDENCE.md` — (1) hero LCP `fetchPriority="high"`, (2) AVIF image delivery, (3) lazy-loaded client Sentry SDK (unused/legacy JS), (4) a measured `experimental.inlineCss` decision for render-blocking CSS — lean, minimal, architecture-preserving, no regressions. Requirement IDs in scope: **PSI-03, PSI-05, PSI-06, PSI-07, PSI-08**. All other v1.5 requirement IDs (PSI-01/02/04/09/10/11/12/13/14/15) are explicitly deferred per D-16 and are NOT evaluated here.

**Verified:** 2026-07-01
**Status:** human_needed
**Re-verification:** No — initial verification

## Scope Note — Why This Report Does Not Use ROADMAP.md's Literal Success Criteria

ROADMAP.md's Phase 20 "Success Criteria" section (lines 356-364) and REQUIREMENTS.md's literal PSI-03/05/06/07 wording still describe the **broad, pre-D-16 goal** (e.g., PSI-03 = "LCP is 'good' (≤2.5s) on real PSI... across the representative routes"). Per the verification task instructions and the owner's explicit lean-scope narrowing (D-16, `20-CONTEXT.md`), this report verifies the **lean plan's actual must_haves** (`20-01-PLAN.md` frontmatter) — one route (`/`), four targeted code-level fixes — not the broad multi-route, multi-category, outcome-threshold criteria. Neither ROADMAP.md nor REQUIREMENTS.md's prose has been rewritten to reflect D-16's narrowing at the individual-requirement-text level (only the traceability table status column was updated to "Planning (lean)"), which is a documentation-consistency gap, not a phase-execution gap — noted here for completeness but not scored as a failure.

## Goal Achievement

### Observable Truths (from 20-01-PLAN.md must_haves.truths)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The homepage hero LCP image carries `fetchPriority=high` so the real-PSI "LCP request discovery" audit passes and the 2,040ms resource-load-delay is eliminated | ✓ VERIFIED (code-level) / ? UNCERTAIN (real-PSI outcome) | `src/components/homepage/hero/hero.tsx:33` has `fetchPriority="high"` alongside `preload`, `fill`, `sizes="100vw"`; no deprecated `priority` prop present (confirmed by direct grep and by re-running the automated check from the plan). The actual PSI audit re-check has not been performed post-deploy — see Human Verification. |
| 2 | The Next image optimizer emits AVIF (then WebP) so the 24KB hero AVIF is no longer transcoded to a larger WebP | ✓ VERIFIED | `next.config.ts:35` — `formats: ['image/avif', 'image/webp']` added to the `images` block; `qualities`/`remotePatterns` unchanged; no extra keys (deviceSizes/imageSizes/minimumCacheTTL) added, matching scope discipline. |
| 3 | When `NEXT_PUBLIC_SENTRY_DSN` is unset, the ~142KB Sentry browser SDK is NOT in the route's cold first-load JS, and `onRouterTransitionStart` is still exported | ✓ VERIFIED | `instrumentation-client.ts` has no top-level static `import * as Sentry from '@sentry/nextjs'`; `@sentry/nextjs` is imported only via `import('@sentry/nextjs')` inside the `if (clientDsn)` guard (line 14); `onRouterTransitionStart` is exported (line 36) as a typed delegating no-op wrapper; no `any` type used. Confirmed by direct read and by re-running the plan's static-assertion check. |
| 4 | Render-blocking CSS on `/` is reduced OR an explicit, measured decision to skip `experimental.inlineCss` is recorded | ✓ VERIFIED (decision recorded) / ⚠ caveat | `next.config.ts` has no `experimental.inlineCss` key (skip decision). `docs/launch/homepage-performance-fixes.md` records the rationale in detail, INCLUDING the explicit caveat that the decision was made on engineering judgment at the owner's instruction, without a post-deploy real-PSI re-measurement — this is the plan's Task 4 acceptance criteria for the "skip-inlinecss" path, met exactly as specified (the plan permitted a documented skip; it did not require the skip to be backed by fresh PSI numbers). |
| 5 | No regressions: lint, typecheck, build, all component-contract tests, the Phase 18 crawlable-HTML probe, and the Phase 19 single-visible-H1 test stay green; CLS on `/` stays 0 | ✓ VERIFIED | Independently re-run in this verification (not just trusted from SUMMARY.md): `pnpm typecheck` clean; `pnpm exec eslint` on the 4 modified files clean; `pnpm build` completed with no errors across the full route manifest; `node --test scripts/component-contracts/*.test.mjs` → 39/39 pass; `node scripts/seo/probe-crawlable-html.mjs --start-server` → all PASS rows; `pnpm exec playwright test tests/e2e/h1-correctness.spec.ts` → 3/3 pass. CLS-on-`/` staying 0 is asserted by code-change nature (no layout-affecting edits) but not independently re-measured by real PSI post-deploy (same caveat as Truth 1). |

**Score:** 5/5 truths verified at the code level as the lean plan defines them. 1 cross-cutting caveat (real post-deploy PSI re-measurement) applies to Truths 1, 4, and 5's CLS clause — this is a known, owner-directed, honestly-documented gap, routed to human verification below, not treated as a failure.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/homepage/hero/hero.tsx` | hero Image with `fetchPriority=high` (distinct from banned deprecated `priority`) | ✓ VERIFIED | Line 33: `fetchPriority="high"`. No `priority` prop anywhere in the file. Wired: this is the single `fill` Image block rendering the LCP hero (confirmed by reading the full file). |
| `next.config.ts` | `images.formats` AVIF+WebP (+ `experimental.inlineCss` only if measured-beneficial) | ✓ VERIFIED | Line 35: `formats: ['image/avif', 'image/webp']`. No `experimental` block present (matches the recorded skip-inlinecss decision). |
| `instrumentation-client.ts` | client Sentry SDK lazy-loaded only when DSN is set; no top-level static `@sentry/nextjs` import | ✓ VERIFIED | Dynamic `import('@sentry/nextjs')` inside `if (clientDsn)` (line 14), with a `.catch()` handler added post-review (WR-01 fix, commit `1ba2ef8e`) so the promise chain is no longer unhandled. |
| `docs/launch/homepage-performance-fixes.md` | before/after real-PSI `/` numbers for the four screenshot fixes + the inlineCss decision | ✓ VERIFIED (substantive, honest) | Contains the real "before" baseline table (from `20-PSI-EVIDENCE.md`), a findings/fix mapping table, the Task 4 decision + rationale + caveat, and an explicit "After — pending real-PSI confirmation" section that does NOT fabricate after-numbers. This honesty is itself the correct behavior per the plan's Task 5 acceptance criteria ("before/after... owner-supplied" — owner had not supplied after-numbers, so none were invented). |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `src/components/homepage/hero/hero.tsx` | the rendered LCP image preload request | `fetchPriority="high"` | ✓ WIRED | Pattern `fetchPriority="high"` found in the hero's `fill` Image block; this is the exact prop Next.js 16's runtime (`get-img-props.js`/`image-component.js`, per 20-REVIEW.md's independent source-level confirmation) uses to set `fetchpriority=high` on the emitted `<link rel=preload as=image>` and the rendered `<img>`. |
| `instrumentation-client.ts` | `@sentry/nextjs` | dynamic import inside the DSN guard (no top-level static import) | ✓ WIRED | Pattern `import\('@sentry/nextjs'\)` found; no top-level static import found; `onRouterTransitionStart` delegates to the lazily-resolved `captureRouterTransitionStart` and no-ops safely before resolution/when DSN unset. |

### Data-Flow Trace (Level 4)

Not applicable in the strict "renders dynamic data" sense — this phase's artifacts are a static prop addition, a static config key, and a conditional lazy import, not components rendering fetched/DB-backed data. Traced anyway for completeness:

| Artifact | Data Variable | Source | Produces Real Effect | Status |
|----------|---------------|--------|----------------------|--------|
| `hero.tsx` | `fetchPriority="high"` (static JSX prop) | Hardcoded, intentional (single LCP hero, not data-driven) | Yes — verified against Next.js runtime source in 20-REVIEW.md, not just docs prose | ✓ FLOWING |
| `next.config.ts` | `images.formats` (static config array) | Hardcoded, intentional | Yes — Next's image optimizer reads this at request time for content-negotiated format selection | ✓ FLOWING |
| `instrumentation-client.ts` | `clientDsn` = `process.env.NEXT_PUBLIC_SENTRY_DSN` | Environment variable, real (not stubbed) | Yes — gates a real dynamic import; guard is a real conditional, not an always-true/always-false stub | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Hero has `fetchPriority="high"`, no deprecated `priority` | `node -e` static assertion (from plan's own verify block) | `PASS: hero fetchPriority check` | ✓ PASS |
| `next.config.ts` has AVIF+WebP formats | `node -e` static assertion (from plan's own verify block) | `PASS: AVIF formats present` | ✓ PASS |
| `instrumentation-client.ts` has no top-level static Sentry import, has dynamic import, exports `onRouterTransitionStart`, no `any` | `node -e` static assertion (from plan's own verify block) | `PASS: instrumentation-client checks` | ✓ PASS |
| Image-performance contract test suite | `node --test scripts/component-contracts/launch-image-performance.test.mjs` | 3/3 subtests pass | ✓ PASS |
| Full component-contract suite | `node --test scripts/component-contracts/*.test.mjs` | 39/39 pass | ✓ PASS |
| Typecheck | `pnpm typecheck` | clean, no errors | ✓ PASS |
| Lint (4 phase-modified files) | `pnpm exec eslint <files>` | clean, no output | ✓ PASS |
| Production build | `pnpm build` | completed, full route manifest emitted, no errors | ✓ PASS |
| Phase 18 crawlable-HTML probe | `node scripts/seo/probe-crawlable-html.mjs --start-server` | all rows PASS (single-H1, canonical, JSON-LD, content-before-skeleton, etc.) | ✓ PASS |
| Phase 19 single-visible-H1 e2e | `pnpm exec playwright test tests/e2e/h1-correctness.spec.ts` | 3/3 passed | ✓ PASS |

All spot-checks were independently re-executed in this verification session — not sourced from SUMMARY.md's claims.

### Probe Execution

No `scripts/*/tests/probe-*.sh` convention exists in this repo for this phase; the equivalent guard (`scripts/seo/probe-crawlable-html.mjs`) was executed directly above and is not a shell-script probe. N/A for this step beyond what's already covered in Behavioral Spot-Checks.

### Requirements Coverage

| Requirement | Source Plan | Description (REQUIREMENTS.md literal wording) | Status | Evidence |
|---|---|---|---|---|
| PSI-03 | 20-01 | "LCP is 'good' (≤2.5s) on real PSI / reconciled lab across the representative routes" | ? NEEDS HUMAN (lean-scope code fix done; broad-wording outcome unconfirmed) | The lean plan's actual PSI-03 commitment (per its own `<done>` tag on Task 1) is narrower: "the hero LCP image is prioritized via fetchPriority=high, eliminating the 2,040ms resource-load-delay." That code-level fix is VERIFIED. The literal REQUIREMENTS.md threshold ("LCP ≤2.5s on real PSI") has NOT been re-measured post-deploy — no fabricated PSI numbers exist. Do not mark "Complete" in REQUIREMENTS.md without a real post-deploy PSI confirmation; recommend the traceability table move from "Planning (lean)" to "Code-complete, pending PSI re-check" rather than "Complete" until the human-verification step below runs. |
| PSI-05 | 20-01 | "INP is 'good' (≤200ms) and lab TBT stays minimal; main-thread/JS work is bounded" | ✓ SATISFIED (as lean-scoped) | The lean plan maps PSI-05 to the Sentry-bundle JS reduction (Task 3), not to INP measurement directly — TBT was already green (90ms) in the baseline. The ~142KB Sentry chunk removal from cold first-load JS is VERIFIED at the code level (no top-level static import; dynamic import gated on DSN). This bounds JS work as the lean plan defines it. |
| PSI-06 | 20-01 | "Unused/duplicate JavaScript is minimized, bundles are code-split, non-critical JS is deferred, no render-blocking scripts remain" | ✓ SATISFIED | Directly addressed by Task 3 (lazy Sentry SDK) — this is the requirement's clearest 1:1 match. VERIFIED: no top-level static `@sentry/nextjs` import; dynamic import inside DSN guard. |
| PSI-07 | 20-01 | "Render-blocking and unused CSS is minimized; critical CSS is optimized/inlined where it helps" | ✓ SATISFIED (as a measured-or-documented-skip decision, per plan's own acceptance criteria) | Task 4 required EITHER enabling inlineCss with before/after PSI proof OR an explicit documented skip with rationale. The skip path was taken and IS documented with rationale in `docs/launch/homepage-performance-fixes.md`, including the caveat that it bypassed the originally-required fresh-PSI-remeasurement step. This satisfies the plan's literal Task 4 acceptance criteria for the skip path. The render-blocking CSS finding itself remains structurally unresolved (540ms) — this is the accepted, documented tradeoff, not a silent gap. |
| PSI-08 | 20-01 | "Images use correct format (AVIF/WebP)... no oversized/oversampled media" | ✓ SATISFIED | Directly addressed by Task 2 — VERIFIED: `formats: ['image/avif', 'image/webp']` present in `next.config.ts`. |

**Orphaned requirements check:** No additional requirement IDs map to Phase 20 in REQUIREMENTS.md beyond the 15 total v1.5 IDs, all of which are accounted for (5 in-scope here, 10 explicitly deferred per D-16). No orphans.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---|---|---|---|
| — | — | No TBD/FIXME/XXX/TODO/HACK/PLACEHOLDER markers found in any of the 4 phase-modified files | — | None — clean |

The one real defect flagged by code review (WR-01, unhandled promise rejection in the dynamic Sentry import chain) has been fixed and committed (`1ba2ef8e`, confirmed present in the current `instrumentation-client.ts` with a `.catch()` handler). The two Info items (IN-01 doc-evidence rigor, IN-02 dead `width`/`height` fields pre-dating this phase) are non-blocking and correctly left as-is per the review's own "no action required" fix note for IN-02, and IN-01 is addressed by this verification independently re-running every claimed guard rather than trusting the doc's assertion.

### Human Verification Required

#### 1. Real post-deploy PSI re-measurement on `/`

**Test:** Deploy the current commit set (`cc4c77b5`, `97658490`, `c9f28cbf`, `14673748`, `b5a79d74`, `1ba2ef8e`) to the public preview and re-run Google PageSpeed Insights (mobile, Slow 4G, same methodology as `20-PSI-EVIDENCE.md`) against `/`.
**Expected:** The "LCP request discovery" audit's `fetchpriority=high` check passes; the ~142KB Sentry unused/legacy-JS flags clear; the AVIF image-delivery finding clears; LCP trends materially down from 3.4s (expected direction ~1.5s per the plan's own diagnosis); Speed Index improves; Performance score trends into the mid-90s; CLS stays 0; render-blocking CSS (540ms) is expected to remain since inlineCss was skipped — confirm this is truly negligible post-fix rather than newly dominant.
**Why human:** PSI is an external, network-and-real-browser-dependent measurement service that cannot be simulated via static grep/build/test checks. This is not a workaround for missing automation — the plan itself (Task 4, `20-VALIDATION.md`'s "Manual-Only / Owner-Gated Verifications" table) designates this as an owner-run step, and it was explicitly and honestly deferred (not silently skipped) at the owner's direction when resolving the Task 4 checkpoint. SUMMARY.md and `docs/launch/homepage-performance-fixes.md` both flag this as the one remaining open item rather than fabricating a pass.

## Gaps Summary

No code-level gaps were found. All four targeted PSI screenshot fixes (fetchPriority, AVIF, lazy Sentry, inlineCss decision) exist in the codebase, are substantively implemented (not stubs), are wired correctly, and are independently confirmed passing every automated guard the plan specified — re-run in this verification session, not merely trusted from SUMMARY.md. The code review's one Warning (WR-01) was fixed and committed after the review; the fix is present and correct in the current codebase.

The phase's status is `human_needed` rather than `passed` for exactly one reason: the plan's Task 4 checkpoint was resolved without the fresh real-PSI re-measurement it was originally designed to require, and the resulting "after" performance numbers for `/` — the actual measurable proof that the fixes achieve their intended real-world effect — do not yet exist. This is not a fabricated-pass situation (the SUMMARY and evidence doc are unusually explicit about the gap), and it is not a code defect. It is a legitimate, owner-directed, honestly-documented deferral of the final verification step, and per the escalation-gate pattern it is surfaced here for a human decision (run the re-measurement, or formally accept the code-level verification as sufficient) rather than silently passed or silently failed.

**Recommendation for REQUIREMENTS.md traceability table:** Update PSI-06 and PSI-08 status from "Planning (lean)" to "Complete" (both fully satisfied at the lean plan's own scope with no outstanding measurement dependency). Update PSI-05 and PSI-07 to "Complete (lean scope)" with a footnote referencing the accepted skip-inlinecss tradeoff for PSI-07. Update PSI-03 to "Code-complete, pending real-PSI re-verification" rather than "Complete," since the requirement's literal wording is an outcome threshold (LCP ≤2.5s) that has not yet been measured post-deploy — marking it fully "Complete" would overstate what has actually been proven.

---

*Verified: 2026-07-01T00:00:00Z*
*Verifier: Claude (gsd-verifier)*
