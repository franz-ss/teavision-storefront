---
phase: '24-sitemap-url-inventory-unblock'
verified: '2026-07-10T09:44:14+08:00'
status: human_needed
score: '6/6 must-have truths verified; 2/2 requirements verified'
automated_checks:
  passed: 8
  failed: 0
requirements:
  SEO-01: verified
  SEO-02: verified
gaps: []
human_verification:
  - test: 'Approved-runtime canonical CSV handoff'
    expected: 'With DISABLE_INDEXING=true, a temporary SEO_URL_EXPORT_ENABLED=true flag and a rotated 32+ character bearer secret produce a 200 CSV attachment whose rows are unique, plausible by source/type, and all use https://www.teavision.com.au; disabling the flag restores 404 concealment while sitemap.xml remains empty and robots omits its sitemap line.'
    why_human: 'The plan explicitly keeps live Shopify/Sanity access and consultant delivery owner-gated. Deterministic mocks prove the contract, but only an approved deployment can prove current live counts and operational download semantics.'
---

# Phase 24: Sitemap & URL-inventory Unblock Verification Report

**Phase Goal:** Provide the SEO consultant with a complete canonical-host URL inventory without weakening staging noindex protections.

## Result

Phase 24 has no code-level gaps. All six must-have truths, all required artifacts and key links, and both requirement IDs are verified against the implementation. The focused tests, repository test suites, frozen-file checks, lint, TypeScript, contracts, and production build all pass.

Status is `human_needed` only because the plan deliberately reserves the real Shopify/Sanity CSV handoff and live count sampling for an owner-approved runtime window. No live export, secret provisioning, or consultant delivery was attempted during this verification.

## Goal Achievement

### Observable Truths

| # | Must-have truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | The inventory is a finite, test-locked set covering eligible launch routes, four audited gaps, non-colliding Shopify pages, all supplied products/collections, the canonical blog listing, and eligible articles. | VERIFIED | `buildUrlInventoryRows()` assembles exactly those registries and source arrays. The unit fixture asserts 29 rows by type: 15 static, 5 legal, 1 page, 2 products, 2 collections, 1 blog, and 3 articles, plus every explicit exclusion. Production source operations paginate products, collections, and pages to exhaustion; the Sanity blog query returns all published articles ordered newest-first. |
| 2 | Rows use only the production canonical origin, are unique and code-point sorted, normalize dates without invented freshness, and serialize deterministically. | VERIFIED | The private origin guard is exactly `https://www.teavision.com.au`; noncanonical `SITE_URL` throws. URL-key deduplication rejects metadata conflicts, explicit `<`/`>` sorting is used, missing dates remain empty, malformed dates throw, and the serializer quotes all five columns with CRLF termination. Repeated serialization is byte-identical in tests. |
| 3 | The route is request-time, concealed unless the flag is literal `true`, and accepts only one header bearer matching a configured 32+ character secret through same-length timing-safe comparison. | VERIFIED | `await connection()` forces request-time evaluation before the flag. The flag uses `truthyEnv`, disabled states return 404 before the secret is read, the secret uses trimmed `optionalEnv`, bearer parsing requires exactly two parts, Buffer byte lengths are checked before `timingSafeEqual`, and the query-secret test is rejected. The build emits the route as dynamic (`ƒ`). |
| 4 | All handled 200/401/404/500/502 responses are private/no-store and noindex/nofollow; authorized source, assembly, and serialization failures never return partial CSV. | VERIFIED | A shared header constant supplies `Cache-Control: private, no-store, max-age=0` and `X-Robots-Tag: noindex, nofollow` to success and JSON failures. Tests cover every gate, rejection of each source, null blog, builder failure, and serializer failure; all failures are generic JSON without CSV or attachment headers. |
| 5 | The export is independent of `DISABLE_INDEXING`, while sitemap, robots, noindex helper/contract, and launch matrix remain unchanged. | VERIFIED | No `isNoindexModeEnabled`, `DISABLE_INDEXING`, cache directive, or static route config appears in the route/helper. The valid route test passes with `DISABLE_INDEXING=true`. Baseline `8d6342897f19246b1a5455c335aea317df05b2b4` resolves, and both baseline-to-HEAD and working-tree diffs are empty for all five frozen paths. The unchanged noindex contracts pass 55/55. |
| 6 | Logs contain fixed outcome/source metadata and aggregate counts only, with no request, credential, CSV, row, handle, exception, or upstream payload leakage. | VERIFIED | Route log calls contain only fixed reasons/sources or aggregate total/type counts. Integration assertions serialize all mock log calls and prove absence of configured/caller secrets, Authorization, preview URL/host, thrown sentinels, CSV, canonical row/handle values, and raw upstream payload markers. |

**Score:** 6/6 must-have truths verified.

## Required Artifacts

| Artifact | Expected | Status | Evidence |
| --- | --- | --- | --- |
| `.planning/phases/24-sitemap-url-inventory-unblock/24-PHASE-START-COMMIT.txt` | Durable 40-character phase-start baseline | VERIFIED | Contains `8d6342897f19246b1a5455c335aea317df05b2b4`; the object resolves as a commit and protects the frozen comparisons. |
| `src/lib/seo/url-inventory.ts` | Pure finite inventory assembly and exact CSV serializer | VERIFIED | Exports exactly the two public types and two public functions required by the plan; contains no source fetch, request access, filesystem discovery, cache directive, `any`, or added dependency. |
| `src/app/api/seo/url-inventory/route.ts` | Request-time, flag/secret-gated, fail-closed CSV route | VERIFIED | Uses the two server env readers, `connection()`, header-only timing-safe auth, four complete source operations, secured generic failures, attachment response, and aggregate-only logging. |
| `src/lib/seo/url-inventory.test.ts` | Executable completeness and deterministic-format contract | VERIFIED | Seven tests cover exact source/type totals, inclusions/exclusions, origin, ordering, dates, duplicate behavior, malformed/conflicting inputs, escaping, CRLF, and repeatability. |
| `src/app/api/seo/url-inventory/route.test.ts` | HTTP gate, failure, header, payload, and logging coverage | VERIFIED | Twenty tests cover disabled/malformed gates, timing-safe outcomes, no query fallback, noindex-mode independence, all source categories, null blog, assembly/serialization failures, secure headers, canonical payload, and log secrecy. |
| Supporting env/logger/script artifacts | Server-only settings, typed events, and integration registration | VERIFIED | `.env.example` is disabled/blank by default with temporary-window guidance; env readers delegate to `truthyEnv`/`optionalEnv`; logger event names are typed/tested; `test:integration` explicitly includes the route test and no dependency was added. |

## Key-link Verification

| From | To | Status | Evidence |
| --- | --- | --- | --- |
| Route handler | Server env readers | WIRED | Imports and calls only `isSeoUrlExportEnabledFromEnv()` and `getSeoUrlExportSecret()` in flag-first order. |
| Route handler | Shopify/Sanity operations | WIRED | Authorized `Promise.all` orchestration calls `getAllProducts()`, `getCollectionSummaries(250)`, `getPages()`, and `getBlog(DEFAULT_BLOG_HANDLE)` exactly once; failures are source-labelled and fail closed. |
| Inventory helper | Launch matrix, legal policies, site URL helpers | WIRED | Eligible route policy and legal metadata are reused; the four export-only paths remain private to the inventory helper; all absolute URLs pass through `getSiteUrl()` under the canonical-origin guard. |
| Integration script | Route test | WIRED | `package.json` includes the quoted `src/app/api/seo/url-inventory/route.test.ts` path, and the full integration run reports 13 files / 82 tests. |

## Requirement Traceability

| Requirement | Plan coverage | Status | Evidence |
| --- | --- | --- | --- |
| SEO-01 | 24-01-01, 24-01-02, 24-01-03 | VERIFIED | Complete finite source coverage, canonical-origin guard, deterministic unique/sorted CSV, complete paginated operations, and dynamic attachment response are implemented and tested. The remaining live handoff is listed under Human Verification. |
| SEO-02 | 24-01-02, 24-01-03 | VERIFIED | Strict flag plus server-only bearer secret, same-length timing-safe comparison, secured headers on all tested outcomes, request-time execution, redacted logs, and unchanged sitemap/robots/noindex behavior are proven. |

All requirement IDs in the plan frontmatter are present in `.planning/REQUIREMENTS.md`, mapped only to Phase 24, and accounted for above.

## Automated Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Phase-start marker and frozen committed/working-tree diffs | PASSED | Baseline resolves; no diff for `sitemap.ts`, `robots.ts`, `noindex.ts`, `noindex-mode.test.mjs`, or `launch-route-matrix.ts`. |
| Route/helper independence scan | PASSED | No noindex/`DISABLE_INDEXING`, `'use cache'`, or static route config match in the Phase 24 route/helper. |
| Focused Phase 24 suites | PASSED | 3 files / 36 tests. |
| Lint | PASSED | Tailwind class check and ESLint exited 0. |
| TypeScript | PASSED | `tsc --noEmit` exited 0. |
| Unit suite | PASSED | 70 files / 312 tests. |
| Integration and contract suites | PASSED | Integration: 13 files / 82 tests. Contracts: 55/55 tests. |
| Next.js production build | PASSED | Next.js 16.2.9 build completed; `/api/seo/url-inventory` is emitted as dynamic (`ƒ`). |

No real Shopify checkout, payment, shipping-rate, tax, order-creation, success-redirect, schema/codegen, or other owner-gated live flow was run.

## Test-quality and Scope Audit

- No skipped, todo, focused-only, or trivial assertion markers were found in the Phase 24 tests.
- No unreferenced `TBD`, `FIXME`, or `XXX` debt marker exists in the Phase 24 implementation or test files.
- No UI, Storybook, GraphQL/codegen, schema, dependency, checkout, downloaded CSV, or real secret change is present in the Phase 24 implementation diff.
- The three unrelated dirty blog/Sanity files were not modified, staged, or included in verification scope.

## Human Verification Required

### Approved-runtime canonical CSV handoff

Follow `.planning/phases/24-sitemap-url-inventory-unblock/24-USER-SETUP.md` during an owner-approved window:

1. Keep `DISABLE_INDEXING=true`; temporarily set `SEO_URL_EXPORT_ENABLED=true` and a rotated 32+ character `SEO_URL_EXPORT_SECRET`.
2. Request the route with the bearer secret in the `Authorization` header only.
3. Confirm HTTP 200, the exact attachment/content type, `X-Robots-Tag: noindex, nofollow`, and private/no-store caching.
4. Parse the CSV and confirm unique rows, exact canonical origin on every row, required static paths, and plausible live counts by type against the approved Shopify/Sanity sources.
5. Confirm staging `/sitemap.xml` remains empty and robots still omits its sitemap line, then disable the export flag and delete the downloaded CSV.

**Why human:** live credentials, source counts, deployment state, and consultant delivery are explicitly owner-gated. Automated evidence uses deterministic mocks and must not fabricate this operational proof.

## Gaps Summary

No implementation, security, regression, test-quality, or requirement-traceability gaps were found. One owner-gated runtime verification item remains, so the phase cannot receive `passed` status until that check is completed and verification is rerun.

## Verification Metadata

- **Approach:** Goal-backward verification against the Phase 24 plan, summary, validation strategy, roadmap goal, requirements, actual implementation, source-operation pagination, frozen SEO controls, focused tests, full repository gates, and production route classification.
- **Verified commit:** `2d2726ae39ead30e4701fe0b1437af1a3d29bf1a`.
- **Verifier:** Independent Codex phase verifier.

---

_Verified: 2026-07-10T09:44:14+08:00_
