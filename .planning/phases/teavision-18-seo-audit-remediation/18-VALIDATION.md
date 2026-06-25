---
phase: 18
slug: seo-audit-remediation
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-25
---

# Phase 18 - Validation Strategy

> Per-phase validation contract for SEO audit remediation feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest, React Testing Library, Node scripts, Playwright/Lighthouse |
| **Config file** | `vitest.config.mts`, `playwright.config.ts`, existing SEO/performance scripts |
| **Quick run command** | `pnpm test:unit` with task-owned file filters |
| **Full suite command** | `pnpm lint && pnpm typecheck && pnpm build && pnpm test:unit && pnpm test:integration && pnpm test:contracts && pnpm test:security` plus Phase 18 SEO/performance probes |
| **Estimated runtime** | ~10-45 minutes depending on Lighthouse and build/probe coverage |

---

## Sampling Rate

- **After every task commit:** Run the task's narrow unit/component/probe command.
- **After every plan wave:** Run `pnpm lint`, `pnpm typecheck`, and the wave-owned SEO/render/performance commands.
- **Before `$gsd-verify-work`:** Run complete Phase 18 SEO evidence checks plus strict performance evidence, or document a valid dated owner/staging/field performance acceptance artifact.
- **Max feedback latency:** 10 minutes for code/helper tasks, 45 minutes for full build plus Lighthouse/final evidence.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 18-01-01 | 01 | 1 | SEO-AUDIT-01 | T-18-01 | Deterministic redirects are two-source-confirmed; uncertain mappings stay in handoff register | node/probe | `node scripts/seo/probe-launch-seo.mjs --mode redirects` plus Phase 18 URL inventory probe | planned | pending |
| 18-01-02 | 01 | 1 | SEO-AUDIT-01 | T-18-02 | Launch host proof separates app redirects from DNS/Vercel/operator gates | docs/probe | Phase 18 audit-to-evidence matrix check | planned | pending |
| 18-02-01 | 02 | 1 | SEO-AUDIT-02 | T-18-03 | Collection and PDP pages expose one visible H1 and imported content cannot add H1/H2 | unit/render | `pnpm test:unit -- src/app/(storefront)/collections src/app/(storefront)/products` | planned | pending |
| 18-02-02 | 02 | 1 | SEO-AUDIT-03 | T-18-04 | Collection read-more content renders after the product grid and remains server-rendered | unit/render/html | Focused collection render tests plus raw HTML probe | planned | pending |
| 18-03-01 | 03 | 2 | SEO-AUDIT-04 | T-18-05 | Metadata, language, canonical, robots, sitemap, and blog tag noindex rules match the audit | unit/node/probe | `node scripts/seo/probe-launch-seo.mjs --mode enabled` and `--mode disabled` | planned | pending |
| 18-03-02 | 03 | 2 | SEO-AUDIT-04 | T-18-06 | `/blog/` simplification is either implemented with redirects or explicitly handed off | node/docs | Phase 18 SEO route matrix/evidence check | planned | pending |
| 18-04-01 | 04 | 2 | SEO-AUDIT-05 | T-18-07 | Schema fields are backed by visible/reliable page evidence and sanitized JSON-LD output | unit/probe | `pnpm test:unit -- src/lib/seo src/app/(storefront)/pages` plus SEO schema probe | planned | pending |
| 18-04-02 | 04 | 2 | SEO-AUDIT-05 | T-18-08 | Product aggregate rating schema appears only when reliable ratings are visible on the PDP | unit/render/probe | Focused PDP JSON-LD and render tests | planned | pending |
| 18-05-01 | 05 | 3 | SEO-AUDIT-06 | T-18-09 | Built collection/PDP HTML includes crawl-critical content before hydration | node/probe | Phase 18 crawlable HTML probe against production fake-provider server | planned | pending |
| 18-05-02 | 05 | 3 | SEO-AUDIT-07 | T-18-10 | LCP/CWV evidence is regenerated honestly and cannot mask failed strict metrics | lighthouse/docs | `node scripts/performance/probe-lighthouse.mjs --start-server --base-url http://127.0.0.1:4173` | yes | pending |
| 18-05-03 | 05 | 3 | SEO-AUDIT-01..07 | T-18-11 | Final matrix maps every PDF finding to remediation, proof, residual risk, or owner handoff | docs/node | Phase 18 audit-to-evidence matrix validation | planned | pending |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

Existing infrastructure covers the phase foundations:

- `pnpm test:unit`
- `pnpm test:integration`
- `pnpm test:contracts`
- `pnpm test:security`
- `scripts/seo/probe-launch-seo.mjs`
- `scripts/performance/probe-lighthouse.mjs`
- `scripts/launch/run-final-readiness-audit.mjs`
- Existing collection page/helper tests
- Existing product route and JSON-LD surfaces
- Existing fake-provider production lifecycle used by launch/performance probes

Wave 0 is complete for infrastructure. Phase 18 plans should add task-specific tests/probe assertions where the map above says `planned`.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Owner/SEO migration export for legacy/current URL changes | SEO-AUDIT-01 | Requires authoritative owner/SEO source outside the repo | Store the export or decision artifact, record date/source, and map each row into deterministic redirect, no-op parity, or handoff. |
| DNS, Vercel, alternate-host, Shopify-domain, and production-host redirects | SEO-AUDIT-01 | Requires operator access and production/cutover environment | Record host-level checks separately from local app redirect proof; do not mark as code-complete evidence. |
| Search Console sitemap submission and URL inspection | SEO-AUDIT-04 | Requires owner property access | Follow `docs/launch/analytics-and-indexing-runbook.md`; record property, URL, timestamp, and proof. |
| Dated owner/staging/field Core Web Vitals acceptance | SEO-AUDIT-07 | Requires external field/staging data or owner acceptance | Provide a dated artifact with approver, data source, routes, metrics, and reason failed local strict metrics are accepted. |
| Real Shopify hosted checkout, payment, shipping, tax, order creation, success redirect, live Customer Account OAuth, protected customer data, and B2B pricing | Safety boundary | Outside Phase 18 SEO scope and owner-gated by project rules | Do not run without explicit owner/operator approval and evidence. |

---

## Validation Sign-Off

- [x] All planned task groups have automated verify commands or explicit manual owner gates.
- [x] Sampling continuity: no 3 consecutive task groups without automated verify.
- [x] Wave 0 covers existing test/probe infrastructure.
- [x] No watch-mode flags.
- [x] Feedback latency targets defined.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending execution
