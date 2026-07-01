# Project Retrospective

Living document — one section per milestone, appended at each close.

## Milestone: v1.0 — Headless Storefront Launch

**Shipped:** 2026-06-11
**Phases:** 9 | **Plans:** 35

### What Was Built

Bulk-savings purchasing end-to-end (PDP tiers → quantity add → Shopify discount allocations in cart); owned Searchanise search with Next-rendered filters/sort/pagination; footer parity; production-readiness remediation + pre-launch noindex; optimized collection quick-add; cart→checkout test suites; and a full 22-plan visual redesign that replaced the entire design system across every surface, refined through two owner UAT rounds.

### What Worked

- Wave-based phase execution with fresh-context executor agents — 22 redesign plans landed with atomic commits and consistent SUMMARY trails.
- The dual-token migration strategy (new system alongside old, deleted in one final sweep) kept the storefront compiling throughout the redesign.
- Contract tests (button system, section rules, reduced-motion) caught regressions repeatedly during the UAT fix loop.
- Preview-first concept workflow: rendering options (Storybook stories, inline mockup cards) and letting the owner pick beat re-implementing rejected directions — used for the search overlay, 404, testimonials, and collection hero.
- The owner working directly in the codebase alongside the agent — owner commits were respected and folded into the release without conflicts.

### What Was Inefficient

- UAT arrived as many small reactive rounds after phase "completion" — three full fix cycles (8 gap plans + ~25 ad-hoc fixes). Earlier visual checkpoints per surface would have compressed this.
- Verbatim-copy expectations surfaced late: several sections were restyled with paraphrased copy and had to be redone with original-site text.
- Two systemic CSS bugs cost multiple rounds: Tailwind 4's `translate` vs `transform` transition property (hover animations silently snapping) and `backdrop-filter` creating a containing block for fixed elements (mega-menu 38px gap).
- Early phases (1, 2, 4, 6, 8) shipped without VERIFICATION.md, forcing the milestone audit to re-verify their wiring from scratch.
- Stale generated `.next/dev` types broke production builds twice because tsconfig includes `**/*.ts`.

### Patterns Established

- Section primitives (`Section.Root` tone/spacing + `Section.Container`) as the only page-band vocabulary.
- Design-token-only styling enforced by a canonical-class checker in pre-commit.
- Motif-band layout (illustration left, centered copy, brush ring right) reused across For Business / Catalogues / Newsletter.
- Gap-closure phases (`gap_closure: true` plans + `--gaps-only` execution) as the UAT remediation loop.
- Checkpoint plans (`autonomous: false`) for owner-approval-gated design work.

### Key Lessons

- In Tailwind 4, never list `transform` in arbitrary `transition-[...]` values when animating `translate-*`/`scale-*` utilities — they compile to the individual CSS properties.
- Any ancestor with `backdrop-filter` becomes the containing block for `position: fixed` descendants — anchor overlays with `absolute` against a `relative` parent instead of viewport offsets.
- Outside-click handlers must scope to the full interactive surface (triggers AND panels), not just the trigger nav.
- Never-resolving "pending" mock actions must be the LAST story in a file — their stuck transitions starve later stories on the shared Storybook root.
- The original site's copy is sacred: treat text as data to port verbatim, not content to improve.

### Cost Observations

- Model mix: orchestrator on the main-session model, executors/verifiers/reviewers on sonnet.
- Sessions: multi-week, heavily interactive during the UAT loop.
- Notable: subagent-per-plan kept orchestrator context lean across 22 plans; the milestone audit's integration checker re-verified five unverified phases in a single pass.

## Milestone: v1.1 — Blog Performance

**Shipped:** 2026-06-12
**Phases:** 1 | **Plans:** 4

### What Was Built

`/blogs/teavision-blogs` loading and image-rendering optimization: bounded Sanity image URLs with LQIP blur placeholders end-to-end, hero preload discipline (fallback hero no longer competes for LCP), a light server-paginated GROQ query for the unfiltered default listing, plus four gap-closure fixes (coalesce null-safety, LQIP crash guard, featured-in-filtered restoration, publish-safe featuredPosts dereference).

### What Worked

- The verification loop earned its keep on a small phase: initial verification caught two blockers (WR-01/WR-07), the code review caught two more (CR-01/CR-02), and both rounds were closed by dedicated gap-closure plans before human UAT.
- Human UAT as four concrete Sanity/browser scenarios (persisted in 12-HUMAN-UAT.md) made the live-data behavior checkable and done in one round.
- Running the milestone audit before close caught a docs-vs-code divergence (the post-phase CDN revert) that no phase-level gate could see.

### What Was Inefficient

- A capability shipped, verified, and documented in 12-02 (CDN-backed Sanity reads) was reverted post-phase by a hotfix commit without amending the phase docs — the milestone audit had to reconcile claims against the codebase.
- The light default-listing query's win is partially deferred because hero and metadata on the same route still trigger the heavy `getBlog()` on cold cache (tracked as W2).

### Patterns Established

- Dual-path listing data: light server-paginated query for the default path, full fetch + in-memory filtering only where tag/search needs it.
- GROQ defensive guards as a convention: `coalesce()` for nullable ref arrays, projected `[defined(slug) && publishedAt <= now()]` filters on dereferenced lists.
- Out-of-range pagination clamps before slicing/fetching on every listing path.

### Key Lessons

- When a hotfix reverts phase-delivered behavior, amend the phase SUMMARY in the same change — stale capability claims cost a full audit reconciliation later.
- Token-less CDN clients are not a drop-in for authenticated Sanity reads; verify against the real dataset's access model before switching transports.
- Optimizing one query on a route only pays off if every data dependency on that route (hero, metadata) is on the same diet.

### Cost Observations

- Sessions: two days end-to-end including two gap-closure rounds and milestone close.
- Notable: single integration-checker subagent handled the entire cross-phase audit (~73k tokens).

## Milestone: v1.2 — SEO-Safe PLP Pagination Parity

**Shipped:** 2026-06-12
**Phases:** 1 | **Plans:** 2

### What Was Built

Production-style numbered collection pagination for PLPs: public `?page=N` URLs, cached cursor-index resolution over Shopify Storefront GraphQL, bounded page payloads, shared Pagination UI, production-parity canonical/prev/next behavior, sticky-header-aware `#product-grid` anchoring, and client-side sort/filter interactions that reset pagination to page 1.

### What Worked

- The milestone audit caught an integration gap missed by phase verification: server-rendered sort/filter hrefs dropped `page`, but client leaves did not.
- Gap closure stayed small and surgical: two URL helper fixes plus focused unit tests for the client builders.
- Human UAT caught the scroll-anchor issue before close, and the final grid-anchor fix produced a cleaner DOM than an offset sentinel.

### What Was Inefficient

- Phase verification over-weighted server helpers and under-tested interactive client URL builders, so D-25 needed a milestone-audit pass to surface fully.
- The archive helper handled file movement but left living docs with stale active-milestone labels, requiring manual cleanup.

### Patterns Established

- Client URL builders for PLP controls should live as small exported pure helpers next to the interactive leaf, with tests for query-param reset rules.
- UAT terminal status should use `complete` for compatibility with the installed `gsd-sdk` close scanner.

### Key Lessons

- Requirement checks need to follow the actual interaction path, not only the shared server helper path.
- For launch-parity SEO work, canonical safety is not enough; user-facing URL generation still needs to preserve production navigation semantics.

### Cost Observations

- Sessions: same-day milestone from audit through gap closure and archive.
- Notable: a focused pre-archive implementation commit kept the `v1.2` tag aligned with the passing audit.

## Milestone: v1.3 — Shopify Customer Accounts

**Shipped:** 2026-06-22
**Phases:** 1 | **Plans:** 9

### What Was Built

Modern Shopify Customer Account support: OAuth login/logout/callback, secure server-owned account sessions, protected `/account` routes, dashboard/profile details, address management, order history and order detail pages, cart buyer identity sync before checkout, legacy account bridge routes, account-link parity, and launch-readiness documentation for Shopify admin setup and owner-approved live testing.

### What Worked

- The fake Customer Account API and fake Storefront buyer-identity fixtures let the team verify account/cart/checkout wiring locally without touching real hosted checkout.
- Gap-closure plans were small and precise: schema/OAuth hardening, read-only phone affordance, account-link evidence, and legacy bridge visual polish each landed with focused verification.
- Separating Customer Account API transport/types from Storefront generated types kept PII/session behavior out of public product caching and made schema drift easier to isolate.
- The final milestone audit was able to pass from three independent evidence sources: REQUIREMENTS.md, 14-VERIFICATION.md, and SUMMARY frontmatter.

### What Was Inefficient

- A duplicate Phase 14 directory (`teavision-14-shopify-customer-accounts`) remained on disk and continued to show stale UAT metadata in open-artifact scans.
- `14-VALIDATION.md` still contains pending Wave 0/task-table placeholders even though final verification superseded it with green full-suite evidence.
- Several live OAuth failures were discovered only after environment setup, which forced a late schema/redirect fake-API hardening pass.

### Patterns Established

- Customer account data uses a dedicated no-store Customer Account API boundary instead of extending Storefront product/cart fetch helpers.
- Customer tokens, refresh material, pending OAuth state, and buyer-identity sync stay server-owned; client leaves receive only presentational state.
- Checkout handoff now has a POST boundary that can block signed-in checkout on identity-sync failure and offer retry/sign-in/support recovery.
- Legacy account routes should preserve intent through bridge pages instead of recreating classic password forms.

### Key Lessons

- Fake third-party APIs should reject stale schema selections, not merely return happy-path fixtures; otherwise live API drift slips through local verification.
- UAT evidence for protected links should inspect anchor hrefs before navigation, because the post-click URL may be a correct auth redirect rather than the link target.
- If a field is readable but not writable through Shopify Customer Account API, render it as account-managed information rather than a disabled or doomed input.
- Validation strategy files need a close-time refresh when final verification supersedes initial Wave 0 placeholders.

### Cost Observations

- Sessions: 2026-06-19 implementation wave plus 2026-06-22 UAT/gap-closure/archive pass.
- Notable: Phase 14 produced 26 commits from `feat(14-01)` through `docs(phase-14)` and 31 tracked tasks.

## Milestone: v1.4 — Production Readiness 100/100

**Shipped:** 2026-06-26 (automated readiness); H1 re-remediation 2026-06-29
**Phases:** 5 (15–19) | **Plans:** 34

### What Was Built

Every launch-blocking production-readiness gap closed to a 100/100 automated code-readiness score: security/dependency/header hardening with a staged report-only CSP and OAuth-start prefetch/origin fixes (15); legal/policy routes, consent foundation + preferences, consent-aware typed analytics, and a launch SEO route matrix (16); a safe health/readiness endpoint, Sentry observability with redacted logging, fake-provider production e2e, and a repeatable final readiness audit (17); full staging-SEO-audit remediation — URL parity, one-visible-H1 hierarchy, metadata/indexation, structured data, crawlable-HTML proof (18); and an H1-correctness re-remediation resolving the two open defects from the audit re-analysis (19).

### What Worked

- Separating owner-gated proof (hosted checkout, OAuth, protected data, Search Console) from automated readiness kept the score honest — pending external gates never got fabricated into a pass.
- The final readiness runner made "100/100" a reproducible artifact (`--performance-acceptance` flag), not a claim.
- Phase 19 reproduced the H1 defect with a failing multi-route raw-DOM test *before* remediating, which is what exposed that the real issue was soft-nav Activity-DOM accumulation, invisible to Google.

### What Was Inefficient

- Phase 15 shipped without a `15-VERIFICATION.md`, so the milestone audit flagged SEC-01..05 as verification-orphaned even though the implementation evidence existed — a documentation gap that turned into an audit `gaps_found`.
- PERF-01 was a very long tail: 15 plans across 12 waves (17-06..17-15), with multiple image/font/shell remediation rounds against local Lighthouse numbers that were ultimately a lab artifact — resolved only by dated acceptance, then genuinely superseded in v1.5 by real PSI.
- Phase 19 implemented two approaches (disable cacheComponents; visible banner H1) that were both reverted at owner direction — real work spent on paths the owner then closed.
- Verification docs drifted (`18-VERIFICATION.md` kept pre-acceptance 94/100 wording after 17 regenerated 100/100).

### Patterns Established

- Owner-gated launch proof is tracked as approved/pending/owner-blocked evidence, never as an automated failure or a fabricated pass.
- Performance acceptance is explicit-only: a dated artifact + an explicit CLI flag, or the failure stays blocking.
- SEO correctness is proven against the crawlable server HTML (what Googlebot renders), not the accumulated live browser DOM.
- Reproduce-before-remediate: a failing regression test is the first deliverable for a subtle defect.

### Key Lessons

- Every milestone requirement needs a phase `VERIFICATION.md` row, or the audit treats it as unsatisfied regardless of how strong the implementation evidence is.
- Chasing a local-lab metric to zero can be wasted motion when the metric is a measurement artifact — get a trustworthy real-world signal (real PSI) before another remediation round.
- When the owner reverses a shipped decision (cacheComponents, banner H1), reconcile the closeout docs in the same change so the record doesn't lie.

### Cost Observations

- Sessions: 2026-06-22 → 2026-06-29, ~229 commits, 373 files (+40,533/−11,083 LOC incl. heavy planning/docs churn).
- Notable: Phase 17 alone ran 15 plans across 12 waves; most of the tail was PERF-01 evidence reconciliation rather than new feature work.

## Milestone: v1.5 — Performance & PageSpeed 100 (lean scope)

**Shipped:** 2026-07-01
**Phases:** 1 (20) | **Plans:** 1 (lean; 5 deferred)

### What Was Built

The four homepage `/` PSI screenshot findings, fixed and proven with real owner-run PSI: hero LCP `fetchPriority="high"` (killed the 2,040ms resource-load-delay), AVIF image delivery, a lazy-loaded client Sentry SDK (removed ~142KB from cold first-load), and a measured `experimental.inlineCss` decision (enabled → all metrics regressed → reverted). Follow-ups took `/` to Accessibility 100 and Best Practices 100. Real PSI: Performance 95–97, LCP 3.0s, Speed Index 1.9s, TBT 30ms, CLS 0.

### What Worked

- The owner directive to narrow scope (D-16) turned an open-ended "100/100 everywhere" pursuit into a shippable, verifiable unit of work with a real-world proof point.
- Verifying the `fetchPriority`+`preload` interaction against Next.js 16 *runtime source* (not just docs prose, which read contradictory) prevented a wrong contract-test edit.
- inlineCss was decided by actually measuring it rather than by judgment — enabling it, seeing every metric regress, and reverting closed the original human-verification gap honestly.
- The regression sweep (Phase 18 crawlable-HTML + Phase 19 single-H1 guards) made "don't regress prior milestones" a checkable gate, and the integration audit confirmed 98/100 with zero regressions.

### What Was Inefficient

- The plan's Task 4 checkpoint originally required a post-deploy real-PSI re-measurement before the inlineCss decision; the owner directed proceeding on engineering judgment, so the decision was made ahead of its evidence and had to be documented as such (later closed when the owner did run PSI).
- `REQUIREMENTS.md` ended up with all 15 PSI boxes checked while its own traceability table listed 10 as deferred — an internal inconsistency corrected only at milestone close.
- v1.4 had never been formally archived, so its open artifacts (Phase 15 UAT, Phase 18 JSON-LD debug) surfaced at v1.5 close and both milestones had to be archived together.

### Patterns Established

- Real PSI on a public preview is the score of record; local Lighthouse is an inner-loop signal, explicitly reconciled, never the source of truth.
- Deliberate scope deferral is recorded as tracked, plan-preserved scope (`deferred/`), distinct from a verification failure — the audit status is `tech_debt`, not `gaps_found`.
- `fetchPriority="high"` is the sanctioned LCP prop; the deprecated `priority` prop stays banned.

### Key Lessons

- A single trustworthy real-world measurement (owner-run PSI) resolved a performance question that ~15 plans of local-lab chasing in v1.4 could not.
- Archive each milestone at its close — deferring the ceremony let v1.4's live docs and open artifacts leak into the next milestone's close.
- Keep requirement checkboxes and the traceability table in one edit; a lean-scope replan must update both or the record contradicts itself.

### Cost Observations

- Sessions: 2026-06-30 → 2026-07-01, ~22 commits, 27 files (+2,398/−55 LOC).
- Notable: one lean plan + a background integration-checker subagent (~81k tokens) carried the entire milestone audit; v1.4 was archived retroactively in the same close.

## Cross-Milestone Trends

| Metric | v1.0 | v1.1 | v1.2 | v1.3 | v1.4 | v1.5 |
| --- | --- | --- | --- | --- | --- | --- |
| Phases / plans | 9 / 35 | 1 / 4 | 1 / 2 | 1 / 9 | 5 / 34 | 1 / 1 (lean) |
| Duration | ~6.5 weeks | ~2 days | 1 day | 4 days elapsed | ~7 days | ~2 days |
| Commits | 476 | ~25 | ~10 | 26 | ~229 | ~22 |
| UAT fix rounds | 3 | 0 (2 pre-UAT gap-closure rounds) | 1 human UAT gap + 1 audit gap | 1 UAT gap-closure wave | PERF-01: 12 waves of remediation/reconciliation | 1 owner-run PSI verification |
| Known gaps at close | 2 requirement-level (CQA-05, CARD-01-superseded) + tech-debt list | 0 blockers; 3 tech-debt items (W2/W4/W5) | 0 blockers; non-blocking tech debt in audit | 0 blockers; launch gates and stale validation table tracked | audit gaps_found (missing 15-VERIFICATION.md, accepted doc-debt); owner-gated launch proof pending | tech_debt: 10/15 PSI reqs deferred (D-16); render-blocking CSS accepted |
