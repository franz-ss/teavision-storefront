# SEO Audit Remediation

This document tracks Phase 18 remediation evidence for the 2026-06-25 staging
SEO audit. Each section maps local code evidence separately from owner/operator
launch proof.

## URL Parity And Redirect Coverage

The URL parity register is maintained in
[`docs/launch/seo-url-parity-register.md`](./seo-url-parity-register.md). It
separates app-owned deterministic redirects from no-op parity URLs and
owner/operator handoff rows.

Phase 18 evidence assumes `https://www.teavision.com.au` is the launch evidence
host. Local app probes can verify deterministic redirects and route parity, but
DNS, Vercel, alternate-host, Shopify-domain, and Search Console proof remains
owner-gated until the production cutover environment and owner access are
available.

## Metadata, Canonical, Robots, Sitemap, And Blog Indexation

### Blog Listing URL

| Audit item                                                                | Decision          | Owner/action/date                                                                                                                      | Local evidence                                                                                                                                                                             |
| ------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Simplify the main blog listing from `/blogs/teavision-blogs/` to `/blog/` | owner/SEO handoff | SEO owner to decide whether `/blog/` should become the canonical listing during migration-stage redirect planning; recorded 2026-06-25 | The app keeps the current Sanity blog listing at `/blogs/teavision-blogs` with no article URL changes; `node scripts/seo/probe-launch-seo.mjs --mode url-audit` reports this handoff item. |
