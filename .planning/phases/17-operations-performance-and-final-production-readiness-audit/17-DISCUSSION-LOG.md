# Phase 17: Operations, Performance, and Final Production-Readiness Audit - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-23
**Phase:** 17-Operations, Performance, and Final Production-Readiness Audit
**Areas discussed:** Monitoring and launch ops, Health and safe diagnostics, Redacted logging scope, Performance and final audit proof

---

## Monitoring and Launch Ops

### Production and Monitoring Stack

| Option | Description | Selected |
|--------|-------------|----------|
| Vercel + Sentry | Matches the existing project docs' Vercel direction; gives Next-native deployment checks plus app-level error tracking. | yes |
| Vercel/native only | Use Vercel logs/analytics/alerts without adding Sentry yet; lighter, but less detailed app error context. | |
| Provider-agnostic | Build health/logging/runbook patterns that work anywhere, and leave provider-specific setup as an operator checklist. | |
| Something else | Tell me the actual host/monitoring stack to assume. | |

**User's choice:** Vercel + Sentry
**Notes:** Phase 17 should assume Vercel production hosting and Sentry-style app error tracking.

### Alert and Runbook Posture

| Option | Description | Selected |
|--------|-------------|----------|
| Lean launch watch | Sentry/Vercel alerts for deploy failure, health failure, checkout handoff errors, account/OAuth errors, provider failures, and elevated server errors; plus a week-one manual monitoring checklist. | yes |
| Formal incident process | Severity levels, escalation ownership, rollback criteria, daily launch reviews, and alert thresholds documented in detail. | |
| Docs-first only | Write the runbook and evidence checklist, but keep actual alert wiring minimal until production traffic exists. | |
| Something else | Describe the exact launch ops posture. | |

**User's choice:** Lean launch watch
**Notes:** Keep launch operations practical and focused on deploy, health, revenue, account, provider, and elevated error signals.

### Rollback Readiness

| Option | Description | Selected |
|--------|-------------|----------|
| Vercel instant rollback + env kill switches | Document redeploy/rollback, keep `DISABLE_INDEXING`, analytics mode, CSP/reporting, and provider env gates as reversible controls. | yes |
| Traffic/canary plan | Include staged traffic movement and rollback thresholds, useful if DNS/proxy routing supports it. | |
| Manual restore checklist | Focus on backups, env snapshots, and manual recovery steps rather than platform rollback automation. | |
| Something else | Tell me the rollback model to capture. | |

**User's choice:** Vercel instant rollback + env kill switches
**Notes:** Rollback should use Vercel rollback plus reversible launch env controls.

### Evidence and Alert Ownership

| Option | Description | Selected |
|--------|-------------|----------|
| Engineering primary, owner gates explicit | Engineering owns automated evidence, Sentry/Vercel setup, runbook, and first response; owner approval is required for Shopify checkout/OAuth/B2B/Search Console evidence. | yes |
| Owner primary | Engineering builds the tools, but the store owner owns alert response, evidence collection, and launch go/no-go. | |
| Shared launch commander | Define a named launch owner role with engineering and business sign-offs before cutover. | |
| Something else | Tell me how ownership should be recorded. | |

**User's choice:** Engineering primary, owner gates explicit
**Notes:** Engineering owns automated readiness work; owner approvals remain explicit launch gates.

---

## Health and Safe Diagnostics

### Readiness Check Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Two-tier checks | A public safe `/api/health` or `/api/ready` stays shallow, while a local/scripted readiness probe checks Shopify, Sanity, Searchanise, Customer Account config, analytics gates, and noindex state without exposing details. | yes |
| Shallow public endpoint only | Public endpoint confirms app is alive and required env shape exists; no upstream provider checks. | |
| Public upstream status | Endpoint checks upstream providers and returns high-level pass/fail statuses publicly; useful, but easier to leak operational detail or create noise. | |
| Something else | Tell me the health/readiness shape. | |

**User's choice:** Two-tier checks
**Notes:** Public status remains safe; deeper readiness belongs in scripts/operator evidence.

### Public Response Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal status only | Return status, service name, release/build identifier if safe, and timestamp; no env names, provider names, secrets, customer data, or raw errors. | yes |
| Component summary | Return broad component states like app, commerce, content, search, but no details. | |
| Diagnostics for operators | Include more detail in non-production only, with production redacted down to minimal status. | |
| Something else | Describe the response shape. | |

**User's choice:** Minimal status only
**Notes:** The public endpoint should be useful to uptime checks and uninteresting to attackers.

### Readiness Failure Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Launch-critical config and smoke blockers | Fail on missing production-required env, Shopify Storefront misconfig, Customer Account config mismatch, SEO/indexing mismatch, security headers missing, fake analytics mode accidentally left in launch mode, or local production e2e failure. Treat optional owner-gated proof as blocked/pending, not code failure. | yes |
| Everything must pass | Fail the report unless all owner-gated Shopify checkout/OAuth/B2B/Search Console proof is complete. | |
| Automated only | Only automated probes can fail; owner-gated proof is informational and never affects the readiness score. | |
| Something else | Tell me the readiness failure policy. | |

**User's choice:** Launch-critical config and smoke blockers
**Notes:** Owner-gated evidence is represented honestly as approved, pending, or owner-blocked.

### Upstream Probe Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Config-first, no live writes | Verify Shopify Storefront read, Sanity read, Searchanise suggestion/search, Customer Account discovery/config, security/SEO scripts, analytics env gates, and Sentry/Vercel config presence. No mutations, checkout, payment, order, email send, or production writes. | yes |
| Read plus safe fake mutations | Include fake/local cart/account flows where the environment points to fake providers; never run them against production providers. | |
| Synthetic production checkout after approval | Add a path for owner-approved Shopify hosted checkout smoke checks inside the readiness probe. | |
| Something else | Tell me which providers/checks should be included or excluded. | |

**User's choice:** Config-first, no live writes
**Notes:** Deep probes can read/check configuration but must not mutate production or send emails/orders.

---

## Redacted Logging Scope

### Mandatory Logging Boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Revenue and provider boundaries | Checkout handoff, cart buyer-identity sync, account OAuth/session errors, Shopify/Sanity/Searchanise/Trustoo/HulkApps provider failures, contact/newsletter/NPD/wholesale submissions, webhooks, and route/action failures. | yes |
| Only critical checkout/account paths | Focus on checkout handoff and account OAuth first; leave broader provider/form logging to future hardening. | |
| All server errors everywhere | Add a broad logging wrapper pattern across route handlers and Server Actions; higher coverage, more churn. | |
| Something else | Tell me the exact logging boundary. | |

**User's choice:** Revenue and provider boundaries
**Notes:** This is wide enough for launch readiness without migrating every log path in the app.

### Redaction Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Strict ecommerce privacy set | Tokens/secrets, auth cookies, customer names/emails/phones/addresses, order IDs unless owner-approved, cart IDs unless hashed, message bodies, provider raw payloads, analytics IDs tied to a person, and checkout URLs with sensitive params. | yes |
| Secrets and obvious PII only | Redact tokens, cookies, emails, and phone numbers; simpler but easier to miss Shopify/customer payload details. | |
| No payload logging | Log only event type, route/action name, status, and coarse error class; safest, but less diagnostic detail. | |
| Something else | Tell me the redaction policy. | |

**User's choice:** Strict ecommerce privacy set
**Notes:** Logs and Sentry breadcrumbs must be useful only after sensitive ecommerce/customer data is removed.

### Logging Implementation Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Central helper plus call-site context | Add a small typed server logging/redaction helper and use it at the selected boundaries with domain-specific event names. | yes |
| Call-site conventions only | Update each boundary manually with consistent object shapes, but no shared helper. | |
| Sentry-only instrumentation | Rely on Sentry capture APIs and configure scrubbing there, with minimal app-owned logging helper. | |
| Something else | Tell me the implementation preference. | |

**User's choice:** Central helper plus call-site context
**Notes:** The planner should define a small typed helper, not a sprawling logging framework.

### Provider Degradation Severity

| Option | Description | Selected |
|--------|-------------|----------|
| Expected degradations as warnings, revenue failures as errors | Optional providers like Trustoo/Searchanise recommendations can warn and degrade; checkout/account/cart identity/provider write failures are errors; health/readiness can summarize without raw payloads. | yes |
| Everything external as error | Any upstream failure is error-level, maximizing visibility but likely noisy during benign third-party blips. | |
| Only user-visible failures as errors | Silent/background degradation stays debug/info; cleaner, but risks hiding launch issues. | |
| Something else | Tell me the severity policy. | |

**User's choice:** Expected degradations as warnings, revenue failures as errors
**Notes:** Treat optional degradation differently from revenue-critical failure.

---

## Performance and Final Audit Proof

### Representative Audit Pages

| Option | Description | Selected |
|--------|-------------|----------|
| Launch-critical set | Home, one PDP with rich media/bulk tiers, `/collections/all`, one high-value collection, `/cart`, `/search`, account login/dashboard fake path, and key legal/static landing pages. | yes |
| Top SEO/commercial pages only | Home, top PDPs, top collections, and owner-authored service pages; lighter on account/cart. | |
| Every route matrix page | Legal, SEO, account, cart, product, collection, search, blog, service pages; maximum coverage, more time/noise. | |
| Something else | Tell me the representative URL set. | |

**User's choice:** Launch-critical set
**Notes:** Use routes where launch risk is highest rather than exhaustive route enumeration.

### Performance Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Mobile Lighthouse/Web Vitals practical gate | No launch-blocking LCP regression on home/PDP, target mobile LCP under about 2.5s where local/staging data is reliable, CLS under 0.1, INP/TBT acceptable, and any misses documented with mitigation. | yes |
| Strict 100 Lighthouse score | Treat any score below perfect as blocking; simple to state, but likely noisy and less tied to real ecommerce risk. | |
| Regression-only gate | Only block if Phase 17 makes metrics worse than current baseline; easier to pass but weaker for the audit's 100/100 ambition. | |
| Something else | Tell me the thresholds or evidence standard. | |

**User's choice:** Mobile Lighthouse/Web Vitals practical gate
**Notes:** Reduce launch-blocking performance risk without chasing a decorative perfect score.

### Local Production E2E

| Option | Description | Selected |
|--------|-------------|----------|
| Controlled fake-Shopify production server lifecycle | Update e2e so it builds/starts a production-like Next server under Playwright with fake Shopify/Customer Account providers, no dependency on an already-running dev server, and no real checkout. | yes |
| Keep dev-server e2e but document it | Easier, but does not satisfy the Phase 17 requirement. | |
| Two e2e modes | Fast dev e2e for iteration plus production-server e2e for final audit. | |
| Something else | Tell me the e2e expectation. | |

**User's choice:** Controlled fake-Shopify production server lifecycle
**Notes:** Final e2e evidence should be self-contained and production-like, but still fake-provider only.

### Final Readiness Report Scoring

| Option | Description | Selected |
|--------|-------------|----------|
| Separated score sections | Automated code readiness can reach 100/100 only when all automated blockers pass; owner-gated Shopify/OAuth/B2B/Search Console evidence is a separate launch-gate table marked approved, pending, or owner-blocked. | yes |
| Single combined score | Final score cannot be 100 until owner-gated evidence is complete. | |
| Checklist only, no numeric score | Avoid score math and present pass/pending/blocker status. | |
| Something else | Tell me the report format. | |

**User's choice:** Separated score sections
**Notes:** Automated score and owner-gated launch gates must be visibly separate.

---

## the agent's Discretion

None. The user selected explicit recommendations for each discussed decision.

## Deferred Ideas

None.
