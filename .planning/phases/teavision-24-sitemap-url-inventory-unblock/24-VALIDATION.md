---
phase: 24
slug: sitemap-url-inventory-unblock
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-10
---

# Phase 24 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (Node environment) plus repository component-contract scripts |
| **Config file** | `vitest.config.ts`, `package.json` scripts |
| **Quick run command** | `pnpm exec vitest run --environment node src/lib/seo/url-inventory.test.ts src/app/api/seo/url-inventory/route.test.ts` |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm test:unit && pnpm test:integration && pnpm test:contracts && pnpm build` |
| **Estimated runtime** | ~60 seconds targeted; several minutes full suite/build |

---

## Sampling Rate

- **After every task commit:** Run the task's targeted Vitest or contract command.
- **After every plan wave:** Run `pnpm test:unit && pnpm test:integration && pnpm test:contracts`.
- **Before `$gsd-verify-work`:** The full suite and production build must be green.
- **Max feedback latency:** 120 seconds for targeted automated checks.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 24-01-01 | 01 | 1 | SEO-01 | T-24-04 / T-24-05 | Canonical-host, complete, deterministic rows fail on conflicting duplicates | unit | `pnpm exec vitest run --environment node src/lib/seo/url-inventory.test.ts` | ❌ W0 | ⬜ pending |
| 24-01-02 | 01 | 1 | SEO-02 | T-24-01 / T-24-02 / T-24-03 | Flag-first concealment, constant-time bearer auth, no-store/noindex, fail-closed sources, secret-free logs | integration | `pnpm exec vitest run --environment node src/app/api/seo/url-inventory/route.test.ts` | ❌ W0 | ⬜ pending |
| 24-01-03 | 01 | 1 | SEO-01, SEO-02 | T-24-06 | Existing sitemap/robots noindex behavior remains byte-for-byte protected | contract + build | `pnpm test:contracts && pnpm lint && pnpm typecheck && pnpm build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/seo/url-inventory.test.ts` — fixtures for all included source categories, exclusions, pagination edges, duplicate conflicts, canonical-host normalization, deterministic ordering, and CSV escaping.
- [ ] `src/app/api/seo/url-inventory/route.test.ts` — mocked-source coverage for flag/secret gates, headers, success, upstream failure, and log redaction.
- [ ] `package.json` — include the Route Handler test in the explicit `test:integration` file list.

Existing Vitest, integration-test, and component-contract infrastructure requires no new framework or dependency.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Operational CSV handoff against a real approved data source | SEO-01, SEO-02 | Automated tests use deterministic Shopify/Sanity mocks; only an approved runtime can prove live row counts and download semantics | Enable the flag for the approved window, use a rotated 32+ character bearer secret with `curl.exe`, verify 200/attachment/noindex/no-store headers, parse the CSV, assert unique `https://www.teavision.com.au` origins and plausible counts by type, then disable the flag and remove the downloaded file. Do not exercise checkout or commit the CSV/secret. |

---

## Validation Sign-Off

- [x] All tasks have an automated verification command or Wave 0 dependency.
- [x] Sampling continuity: no three consecutive tasks lack automated verification.
- [x] Wave 0 names every missing test artifact and integration-script registration.
- [x] No watch-mode flags are used.
- [x] Targeted feedback latency is expected to remain below 120 seconds.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** pending execution
