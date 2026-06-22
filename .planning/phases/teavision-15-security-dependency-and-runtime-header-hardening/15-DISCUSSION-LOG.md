# Phase 15: Security, Dependency, and Runtime Header Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-22
**Phase:** 15-Security, Dependency, and Runtime Header Hardening
**Areas discussed:** Dependency-Audit Policy, Headers and CSP Rollout, Account OAuth Launch Behavior, Abuse-Control Posture

---

## Dependency-Audit Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Requirement-aligned gate | Fix/override/remove all critical + high findings; allow only documented dev-only moderate residuals with no runtime exposure. | yes |
| Zero moderate audit | Keep going until `pnpm audit --audit-level moderate` is fully clean, even if that means larger tooling upgrades. | |
| Runtime-only gate | Patch runtime dependencies like Next, then document dev-tool findings for later. | |
| You decide | Let the planner choose the safest balance during implementation. | |

**User's choice:** Requirement-aligned gate.
**Notes:** Current audit evidence showed 1 critical, 16 high, and 18 moderate findings. The direct runtime blocker is `next@16.2.4`; several other findings appear through dev/tooling chains.

| Option | Description | Selected |
|--------|-------------|----------|
| Use targeted `pnpm.overrides` first | Patch vulnerable transitive packages where compatible, then run build/tests/audit. | yes |
| Upgrade parent tools only | Prefer upgrading Storybook, Codegen, Sanity, Lighthouse, etc.; avoid overrides unless absolutely necessary. | |
| Remove optional tooling if needed | If a vulnerable dev tool blocks the gate and is not launch-critical, consider removing or replacing it. | |
| You decide | Let the planner pick the lowest-risk remediation per package. | |

**User's choice:** Use targeted `pnpm.overrides` first.
**Notes:** This minimizes launch-adjacent churn while still requiring verification.

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated Phase 15 audit note | Add a concise phase doc listing audit command, before/after counts, patched packages, overrides, and residual findings. | yes |
| Only in plan summaries | Keep evidence inside each implementation plan's summary. | |
| Final Phase 17 report only | Let the final readiness audit collect everything later. | |
| You decide | Let the planner choose the documentation shape. | |

**User's choice:** Dedicated Phase 15 audit note.
**Notes:** This gives Phase 17 a clean source of truth.

| Option | Description | Selected |
|--------|-------------|----------|
| No generated churn unless required | Package/lockfile changes are fine; do not run `pnpm codegen` or touch generated Shopify types unless required. | yes |
| Regenerate after tool upgrades | Run codegen after GraphQL tooling changes to prove the generator still works, even if outputs change. | |
| Defer codegen proof | Patch dependencies now; leave codegen compatibility to a later phase. | |
| You decide | Let the planner decide based on exact package changes. | |

**User's choice:** No generated churn unless required.
**Notes:** Avoids unnecessary Shopify generated type changes during dependency remediation.

---

## Headers and CSP Rollout

| Option | Description | Selected |
|--------|-------------|----------|
| Static CSP report-only first | Add explicit allowlists and tests, ship report-only initially, then enforce after smoke evidence. | yes |
| Enforced static CSP now | Ship enforcing CSP in Phase 15 once tests pass. | |
| Headers now, CSP later | Add security headers now and defer CSP to analytics/consent work. | |
| You decide | Let the planner choose based on third-party script inventory. | |

**User's choice:** Static CSP report-only first.
**Notes:** Aligns with roadmap caution around nonce CSP, Cache Components, and PPR trade-offs.

| Option | Description | Selected |
|--------|-------------|----------|
| Standard ecommerce hardening set | HSTS, content-type, referrer, permissions, frame protection, no `x-powered-by`, and staged CSP. | yes |
| Minimal audit set | Only add headers directly required by the readiness audit. | |
| Strict isolation set | Add COOP/CORP/COEP even if it risks third-party widget/embed breakage. | |
| You decide | Let the planner choose after reading docs. | |

**User's choice:** Standard ecommerce hardening set.
**Notes:** Strict isolation headers are not forced because they may break Shopify/Searchanise/Trustoo surfaces.

| Option | Description | Selected |
|--------|-------------|----------|
| Inventory only current required hosts | Allow only observed current storefront hosts; analytics hosts wait for Phase 16. | yes |
| Pre-allow likely analytics hosts | Include GA4, GTM, Meta, Klaviyo, and Shopify pixels now. | |
| Broad temporary allowlist | Use broad domains or wildcard-ish allowances during report-only. | |
| You decide | Let the planner choose based on code and smoke tests. | |

**User's choice:** Inventory only current required hosts.
**Notes:** Prevents CSP from accumulating speculative analytics permissions before Phase 16 confirms destinations.

| Option | Description | Selected |
|--------|-------------|----------|
| Production-server probe across representative routes | Build/start locally, probe storefront, product, collection, cart, account, policy/static page, and API routes. | yes |
| Unit tests only | Test exported header/CSP builder constants without starting Next. | |
| Manual browser smoke only | Use browser/devtools screenshots and console checks as evidence. | |
| You decide | Let the planner balance probe scripts and tests. | |

**User's choice:** Production-server probe across representative routes.
**Notes:** Evidence should reflect real production responses rather than constants alone.

---

## Account OAuth Launch Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Disable prefetch on OAuth-start links | Ensure direct `/account/login/start` navigation uses `prefetch={false}` or a plain anchor wrapper. | yes |
| Use plain anchors for all account links | Avoid Next prefetch/client navigation across the account area. | |
| Leave links unchanged | Rely on existing canonicalization and route tests. | |
| You decide | Let the planner choose after inspecting account entry points. | |

**User's choice:** Disable prefetch on OAuth-start links.
**Notes:** Normal internal account navigation can remain regular Next navigation.

| Option | Description | Selected |
|--------|-------------|----------|
| Config and local-production proof | Verify env-derived origins, canonical localhost behavior, and Shopify-admin-ready URLs without live admin access. | yes |
| Require live Shopify admin proof now | Block Phase 15 until actual Shopify admin settings are inspected or confirmed. | |
| Tests only | Keep automated route tests only; leave admin/settings proof to Phase 17. | |
| You decide | Let the planner decide how much evidence is feasible. | |

**User's choice:** Config and local-production proof.
**Notes:** Actual admin/live OAuth signoff remains owner-gated.

| Option | Description | Selected |
|--------|-------------|----------|
| Owner-gated, documented blocker | Do not run real Shopify OAuth without owner/admin approval; document what remains blocked. | yes |
| Try live OAuth if credentials exist | If env vars are configured locally, run the real OAuth flow during Phase 15. | |
| Automated only, no blocker note | Rely on fake/local tests and skip explicit owner-blocked status. | |
| You decide | Let the planner decide after seeing available env/docs. | |

**User's choice:** Owner-gated, documented blocker.
**Notes:** Prevents fake/local evidence from being mistaken for live Shopify signoff.

| Option | Description | Selected |
|--------|-------------|----------|
| All account entry and exit edges | Header/footer links, account routes, legacy bridges, and cart buyer-identity checkout handoff. | yes |
| Only OAuth routes | Cover `/account/login/start`, `/account/callback`, and `/account/logout`. | |
| Only user-visible links | Cover header/footer/login-panel links and leave callback/logout to tests. | |
| You decide | Let the planner choose based on existing tests. | |

**User's choice:** All account entry and exit edges.
**Notes:** Includes cart buyer-identity handoff because it remains launch-relevant.

---

## Abuse-Control Posture

| Option | Description | Selected |
|--------|-------------|----------|
| Fail-closed explicit stance | Production must declare external protection, configure durable store, or intentionally set/document memory fallback. | yes |
| Durable store now | Implement a real shared store such as Redis/KV in Phase 15. | |
| Documentation only | Keep current warning behavior but improve launch docs. | |
| You decide | Let the planner choose based on hosting constraints. | |

**User's choice:** Fail-closed explicit stance.
**Notes:** Does not force a specific vendor, but implicit per-process memory limiting is launch-blocking.

| Option | Description | Selected |
|--------|-------------|----------|
| Document and test trusted header precedence | Make trusted proxy/header source explicit and test spoofing-sensitive behavior. | yes |
| Provider-level only | If production uses edge/provider rate limiting, do not refine app-level IP parsing. | |
| Leave current parsing | Keep `x-forwarded-for`, `x-real-ip`, then `cf-connecting-ip` behavior unchanged. | |
| You decide | Let the planner choose after confirming the host. | |

**User's choice:** Document and test trusted header precedence.
**Notes:** Production host assumptions must be explicit.

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, for Phase 15-owned surfaces | Replace raw provider/error logging on forms/search abuse paths with structured redacted events where touched. | yes |
| No, defer logging to Phase 17 | Keep Phase 15 limited to rate-limit policy and headers. | |
| Only document the risk | Do not change logging yet, but flag raw provider error logging. | |
| You decide | Let the planner decide if logging changes fit the plan. | |

**User's choice:** Yes, for Phase 15-owned surfaces.
**Notes:** Broader observability remains Phase 17.

| Option | Description | Selected |
|--------|-------------|----------|
| Current public mutation/search surfaces | Contact, wholesale, custom blend, NPD order, newsletter, and `/api/search/suggestions`. | yes |
| Only forms | Focus on email/contact Server Actions; leave search suggestions to later. | |
| Only search and newsletter | Focus on high-frequency endpoints first. | |
| You decide | Let the planner pick based on risk. | |

**User's choice:** Current public mutation/search surfaces.
**Notes:** Verification must prove honeypot, validation, rate-limit, and safe error behavior.

## the agent's Discretion

None.

## Deferred Ideas

None.
