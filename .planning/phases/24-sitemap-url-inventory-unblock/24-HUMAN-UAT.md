---
status: partial
phase: 24-sitemap-url-inventory-unblock
source: [24-VERIFICATION.md]
started: '2026-07-10T09:46:18.4862291+08:00'
updated: '2026-07-10T09:46:18.4862291+08:00'
---

## Current Test

[awaiting human testing]

## Tests

### 1. Approved-runtime canonical CSV handoff

expected: With `DISABLE_INDEXING=true`, a temporary `SEO_URL_EXPORT_ENABLED=true` flag and a rotated 32+ character bearer secret produce a 200 CSV attachment whose rows are unique, plausible by source/type, and all use `https://www.teavision.com.au`; disabling the flag restores 404 concealment while `sitemap.xml` remains empty and robots omits its sitemap line.
result: [pending]

## Summary

total: 1
passed: 0
issues: 0
pending: 1
skipped: 0
blocked: 0

## Gaps
