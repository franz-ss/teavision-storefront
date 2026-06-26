# Performance Acceptance

## Decision

Status: accepted-non-blocking
Date: 2026-06-26
Approver: Project owner via Codex thread
Evidence source: Owner acceptance in this 2026-06-26 Codex thread after repeated local lab remediation remained at 94/100; see docs/launch/performance-evidence.md and docs/launch/final-production-readiness-report.md.

## Local Lab Failures Accepted

- `/`: accepted
- `/products/test-standard-tea`: accepted
- `/collections/all`: accepted
- `/cart`: accepted
- `/search?q=tea`: accepted
- `/account`: accepted
- `/pages/privacy-policy`: accepted

## Rationale

Repeated Phase 17 PERF-01 remediation attempts did not move the automated readiness score beyond 94/100, and the remaining failure is isolated to local mobile Lighthouse lab metrics. The local evidence remains recorded for risk visibility, but the project owner accepts these local lab failures as non-blocking for launch readiness.

This acceptance does not approve unrelated owner-gated Shopify/admin checks such as hosted checkout, payment, shipping, tax, order creation, live Customer Account OAuth, protected customer data, B2B pricing, Search Console submission, or Search Console URL inspection.
