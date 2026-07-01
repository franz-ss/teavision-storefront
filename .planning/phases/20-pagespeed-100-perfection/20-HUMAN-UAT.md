---
status: partial
phase: 20-pagespeed-100-perfection
source: [20-VERIFICATION.md]
started: 2026-07-01T00:00:00Z
updated: 2026-07-01T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Real post-deploy PSI re-measurement on `/`
expected: Deploy the current commit set (`cc4c77b5`, `97658490`, `c9f28cbf`, `14673748`, `b5a79d74`, `1ba2ef8e`) to the public preview and re-run Google PageSpeed Insights (mobile, Slow 4G, same methodology as `20-PSI-EVIDENCE.md`) against `/`. The "LCP request discovery" audit's `fetchpriority=high` check should pass; the ~142KB Sentry unused/legacy-JS flags should clear; the AVIF image-delivery finding should clear; LCP should trend materially down from 3.4s (expected direction ~1.5s per the plan's own diagnosis); Speed Index should improve; Performance score should trend into the mid-90s; CLS should stay 0; render-blocking CSS (540ms) is expected to remain since `inlineCss` was skipped — confirm this is truly negligible post-fix rather than newly dominant.
result: [pending]

## Summary

total: 1
passed: 0
issues: 0
pending: 1
skipped: 0
blocked: 0

## Gaps
