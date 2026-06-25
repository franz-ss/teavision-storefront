# Phase 18: SEO Audit Remediation - Plan Outline

## OUTLINE COMPLETE

| Plan ID | Objective                                                                                                                                 | Wave | Depends On                         | Requirements                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---: | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| `18-01` | Build the SEO audit URL inventory, redirect decision register, and deterministic redirect probe foundation.                               |    1 | none                               | SEO-AUDIT-01                                                                                     |
| `18-02` | Remediate collection/PDP visible heading hierarchy and collection read-more placement while preserving crawlable server-rendered content. |    1 | none                               | SEO-AUDIT-02, SEO-AUDIT-03, SEO-AUDIT-06                                                         |
| `18-03` | Fix metadata, title suffix, canonical host evidence, robots, sitemap, language, blog tag noindex, and `/blog/` listing handling.          |    2 | `18-01`                            | SEO-AUDIT-01, SEO-AUDIT-04                                                                       |
| `18-04` | Add and verify evidence-backed structured data only where visible content and reliable provider data support it.                          |    2 | `18-02`                            | SEO-AUDIT-05                                                                                     |
| `18-05` | Prove crawlable HTML, rerun/reconcile Core Web Vitals evidence, and produce the final audit-to-evidence pack.                             |    3 | `18-01`, `18-02`, `18-03`, `18-04` | SEO-AUDIT-01, SEO-AUDIT-02, SEO-AUDIT-03, SEO-AUDIT-04, SEO-AUDIT-05, SEO-AUDIT-06, SEO-AUDIT-07 |

## Wave Notes

- Wave 1 can run in parallel because URL/evidence work and collection/PDP rendering work touch different primary files.
- Wave 2 waits for Wave 1 findings so metadata/blog redirect decisions can consume the URL register and schema work can consume the final H1/visible-content boundaries.
- Wave 3 waits for all remediation plans because it produces final raw HTML, Lighthouse/CWV, and audit matrix evidence.
