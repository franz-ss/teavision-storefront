---
phase: 23
reviewers: [gemini, claude, cursor]
successful_reviewers: [claude]
failed_reviewers: [gemini, cursor]
reviewed_at: 2026-07-03T10:32:30.0653235+08:00
plans_reviewed: [23-01-PLAN.md]
trimmed_reviewers:
  claude:
    budget: null
    effective_budget: null
    estimated_tokens: null
    omitted: [context, research]
    project_md_shrunk: true
    plan_truncation_pct: 0
    hard_failed: false
    note_injected: true
---

# Cross-AI Plan Review - Phase 23

## Gemini Review

Gemini review failed or returned empty output.

Exit code: 1

Loaded cached credentials.
Error authenticating: IneligibleTierError: This client is no longer supported for Gemini Code Assist for individuals. To continue using Gemini, please migrate to the Antigravity suite of products: https://antigravity.google
    at throwIneligibleOrProjectIdError (file:///C:/ProgramData/nvm/v22.18.0/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/code_assist/setup.js:192:15)
    at _doSetupUser (file:///C:/ProgramData/nvm/v22.18.0/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/code_assist/setup.js:182:9)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  ineligibleTiers: [
    {
      reasonCode: 'UNSUPPORTED_CLIENT',
      reasonMessage: 'This client is no longer supported for Gemini Code Assist for individuals. To continue using Gemini, please migrate to the Antigravity suite of products: https://antigravity.google',
      tierId: 'free-tier',
      tierName: 'Gemini Code Assist for individuals'
    }
  ]
}
An unexpected critical error occurred:Error: This client is no longer supported for Gemini Code Assist for individuals. To continue using Gemini, please migrate to the Antigravity suite of products: https://antigravity.google
    at throwIneligibleOrProjectIdError (file:///C:/ProgramData/nvm/v22.18.0/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/code_assist/setup.js:192:15)
    at _doSetupUser (file:///C:/ProgramData/nvm/v22.18.0/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/code_assist/setup.js:182:9)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

---

## the agent Review

## Plan Review: Phase 23 — Preview, Revalidation, and No-Regression Release

### Summary

This is a well-structured, security-conscious plan that correctly scopes Phase 23 to three orthogonal concerns: isolated draft preview, webhook-triggered cache invalidation, and a hard release gate. The task ordering (data boundary → routes → page wiring → webhook → evidence → verification) is sound, dependency edges are correctly declared, and the published/draft separation is architecturally clean. The threat model is thorough and the TDD discipline is applied to the highest-risk tasks. Minor gaps exist around secret-comparison safety and a few documentation inconsistencies, but nothing that would derail execution.

---

### Strengths

- **Correct separation of published and draft paths.** `getHomepage()` stays cached/tagged; `getDraftHomepage()` is uncached, token-backed, stega-free, and reuses Phase 22 reshape logic. This is the right architecture.
- **Metadata stays published-safe regardless of Draft Mode.** `generateMetadata()` is explicitly pinned to `getHomepage()`, and JSON-LD remains code-owned. This prevents the most common SEO contamination vector.
- **Correct revalidation pattern.** `revalidateTag(tag, { expire: 0 })` matches existing blog webhook behavior and is the correct form for external system webhook-driven immediate expiration per the installed Next docs.
- **Integration test gap is identified and fixed.** The plan correctly notes the `test:unit` command excludes `src/app/api/**/*.test.ts` and explicitly patches `package.json` to include the new route tests in `test:integration`.
- **Hard release gate with an honest "blocked" default.** The gate document defaults to `Blocked - awaiting public-preview PSI` until owner evidence is recorded. This matches the project's established pattern of separating automated code readiness from owner-gated proof.
- **Fail-loud policy preserved.** Draft validation failure throws rather than silently falling back to published content, consistent with Phase 22's contract.
- **Solid threat model** covering open redirect, stega leak, cache contamination, webhook spoofing, and scope creep.
- **All Wave 0 test files** from `23-VALIDATION.md` are addressed across Tasks 1–4.

---

### Concerns

- **[HIGH] Timing-safe secret comparison not mandated.** The threat model (T-23-01) says "constant exact-secret comparison where practical" but never mandates `crypto.timingSafeEqual()`. A naive `secret !== 'MY_SECRET_TOKEN'` comparison leaks timing information that can be used to brute-force the preview secret over many requests. For a shared secret URL that grants draft rendering access, this is a real vector. The task description for Task 2 must require `crypto.timingSafeEqual()` or `Buffer.from(secret).equals(Buffer.from(expected))` for the comparison.

- **[MEDIUM] `SANITY_API_READ_TOKEN` enforcement is underspecified.** The current `getSanityReadToken()` returns `string | undefined`. The plan says `getDraftHomepage()` should "fail loudly when `SANITY_API_READ_TOKEN` is missing" but leaves the exact mechanism to the executor. If the executor calls `getSanityReadToken()` and gets `undefined`, and passes that to a Sanity client without a token, the failure mode is a Sanity 401 at runtime rather than a loud env-layer error. The interfaces section should specify `requiredSanityReadToken()` or `getSanityDraftReadToken()` that uses `requiredEnv()` rather than `optionalEnv()`.

- **[MEDIUM] Missing `SANITY_PREVIEW_SECRET` → 500 behavior not specified.** The existing Sanity webhook route explicitly handles the missing-secret case with a 500 response and an error log. The plan doesn't specify the same behavior for the `/api/draft` route when `SANITY_PREVIEW_SECRET` is absent. The executor needs to know whether to return 401 (leaks that secret is unconfigured), 500 (matches webhook pattern), or throw. The behavior section for Task 2 should include this case.

- **[MEDIUM] Source audit QUALITY-02/DATA-03 description swap.** In the source_audit table, the row labelled `REQ | QUALITY-02` reads "Draft content is isolated from published cache and public SEO surfaces" — but that describes DATA-03. QUALITY-02 is actually "Release verifier can prove homepage SEO and PageSpeed scores are unchanged or improved." The swap doesn't affect implementation (the task coverage IDs are correct), but a confused executor might misread which tests satisfy which requirement. This should be corrected.

- **[LOW] No rate-limiting on `/api/draft`.** The route's security depends entirely on a shared secret. Without any rate-limiting on failed attempts, an attacker with network access can probe the secret at whatever rate the server allows. The plan should note this limitation and recommend that Vercel's edge rate-limiting or a middleware guard be applied to `/api/draft` in production — even a simple `Retry-After` response after 5 failed attempts would help.

- **[LOW] `cacheTag()` not-called assertion not explicitly specified in test behavior.** The acceptance criteria say the draft helper must not call `cacheTag()` or `cacheLife()`, but the behavior section for Task 1 only says it "does not call `cacheTag()` or `cacheLife()`." The test behavior section should explicitly call out a `vi.mock('next/cache', ...)` assertion that `cacheTag` was NOT called during `getDraftHomepage()` execution. The existing `home-page.test.ts` pattern mocks `cacheTag`, so the pattern is available — just needs to be explicitly required.

- **[LOW] Task 5 is marked `tdd="false"` but includes test extension work.** The task asks to "extend existing page tests if needed to make the published HTML leak checks automated." Adding tests in a `tdd="false"` task is inconsistent with the plan's own discipline and could lead the executor to skip the test work. Either mark Task 5 `tdd="true"` for the leak-check tests, or extract those tests back into Task 3's scope.

---

### Suggestions

1. **Task 2:** Add `crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(expected))` as an explicit requirement in the behavior section, and specify that a missing `SANITY_PREVIEW_SECRET` returns 500 (matching the webhook route pattern, not 401).

2. **Task 1 / `src/lib/sanity/env.ts`:** Add `getSanityDraftReadToken(): string` using `requiredEnv()` instead of `optionalEnv()`, so the failure is loud at env-read time rather than at Sanity API time. Update the interfaces section to name this function explicitly.

3. **Source audit:** Swap the QUALITY-02 and DATA-03 description text to match `REQUIREMENTS.md`. The task coverage IDs are already correct; this is a prose fix.

4. **Task 3:** Add an explicit test case asserting that `cacheTag` is not called when `draftMode().isEnabled` is true and `getDraftHomepage()` is used. This is the most important isolation invariant and deserves its own named test.

5. **Task 5:** Either mark `tdd="true"` or move the stega/source-map leak-check tests to Task 3, where other published-safe SEO tests live. Don't orphan them in a `tdd="false"` evidence task.

6. **Overall:** Add a one-line note in the user setup section recommending `SANITY_PREVIEW_SECRET` be at least 32 random characters (e.g., `openssl rand -hex 32`). The plan assumes this but doesn't document it.

---

### Risk Assessment: **LOW**

The plan achieves its phase goals, covers all five pending requirements, and has the strongest test and threat coverage of any Phase 23 artefact. The primary risk is the timing-safe comparison gap (HIGH concern), which is a well-understood mitigation that takes two lines to fix. All other concerns are LOW/MEDIUM and would improve hardening without changing the implementation shape. Execution risk is low given the thorough research documents, pattern maps, and explicit interface contracts already in place.

---

## Cursor Review

Run with 'cursor -' to read output from another program (e.g. 'echo Hello World | cursor -').


Stderr:

Warning: 'p' is not in the list of known options, but still passed to Electron/Chromium.
Warning: 'mode' is not in the list of known options, but still passed to Electron/Chromium.
Warning: 'trust' is not in the list of known options, but still passed to Electron/Chromium.

---

## Consensus Summary

Only Claude produced a usable substantive review. Gemini was installed but blocked by account eligibility, and this Cursor install exposed the editor launcher rather than a usable terminal agent invocation. Because there was only one successful reviewer, no true cross-reviewer consensus or divergent substantive view can be established.

### Agreed Strengths

No multi-reviewer agreement is available. Claude's successful review highlighted these strengths:

- Published and draft paths are cleanly separated, with metadata pinned to published content.
- Revalidation follows the existing immediate-expiration pattern and preserves the fail-loud policy.
- The plan explicitly fixes the `test:integration` coverage gap for route-handler tests.
- The release gate defaults to blocked until owner-supplied public preview evidence exists.

### Agreed Concerns

No concern was independently confirmed by multiple reviewers. The most important actionable concerns from Claude's review are:

- HIGH: Task 2 should mandate timing-safe comparison for `SANITY_PREVIEW_SECRET`.
- MEDIUM: Draft Sanity token handling should use a required-token helper rather than passing through `undefined`.
- MEDIUM: Missing `SANITY_PREVIEW_SECRET` behavior for `/api/draft` should be specified, preferably matching the webhook route's 500 pattern.
- MEDIUM: The source audit text appears to swap the QUALITY-02 and DATA-03 descriptions.
- LOW: The plan should document rate-limiting or platform protection expectations for `/api/draft` failed attempts.

### Divergent Views

None. Gemini and Cursor failed operationally before producing substantive feedback.

