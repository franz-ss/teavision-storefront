---
status: diagnosed
trigger: "Phase 14 - Shopify Customer Accounts. Gap truth: Header account icon links to /account with an accessible name, and footer Login link points to the owned /account route rather than the old mrtea.com.au URL. Expected: Header account icon links to /account with an accessible name; footer Login link points to the owned /account route. Actual: User reported: Screenshot shows the account path resolving to /account/login?returnTo=%2Faccount; footer Login link target is not shown/verified, so the full header/footer link expectation is not confirmed. Severity: major. Reproduction: Test 8 in UAT. Timeline: Discovered during UAT. Goal: find_root_cause_only."
created: 2026-06-22T10:24:22.1150819+08:00
updated: 2026-06-22T10:27:09.8546423+08:00
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: "Confirmed: Test 8 is a verification ambiguity caused by observing the protected-route destination after navigation, plus missing footer href capture."
test: "Header/footer source inspection and targeted tests for account protection and footer Storybook parity."
expecting: "No code fix required for production header/footer link targets; close the UAT gap with direct href evidence and optionally clean stale isolated Storybook fixture."
next_action: "Return ROOT CAUSE FOUND diagnosis."

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: "Header account icon links to /account with an accessible name; footer Login link points to the owned /account route."
actual: "Screenshot shows the account path resolving to /account/login?returnTo=%2Faccount; footer Login link target is not shown/verified, so the full header/footer link expectation is not confirmed."
errors: "No runtime error reported."
reproduction: "Test 8 in UAT."
started: "Discovered during Phase 14 UAT."

## Eliminated
<!-- APPEND only - prevents re-investigating -->

- hypothesis: "The production header account icon has the wrong href or lacks an accessible name."
  evidence: "src/components/layout/header/header.tsx renders the account icon as a Next Link with href=\"/account\" and aria-label=\"Account\"."
  timestamp: 2026-06-22T10:27:09.8546423+08:00
- hypothesis: "The production footer Login link still points to https://mrtea.com.au/account/login."
  evidence: "src/components/layout/footer/data.ts defines FOOTER_LINKS Login as { href: '/account', label: 'Login' }, and FooterView renders FOOTER_COLUMNS from that data through FooterLinkList/FooterTextLink. Only an isolated FooterTextLink Storybook 'External' fixture still uses mrtea.com.au."
  timestamp: 2026-06-22T10:27:09.8546423+08:00

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-06-22T10:25:10.7801523+08:00
  checked: "Phase 14 UAT and project state"
  found: "Test 8 expected header account icon href /account with accessible name and footer Login href /account. Actual report only captured that clicking/visiting account resolved to /account/login?returnTo=%2Faccount, and did not show footer target."
  implication: "The reported URL alone could be normal protected-route behavior; code-level link targets and route guard behavior must be checked before calling this a defect."
- timestamp: 2026-06-22T10:25:10.7801523+08:00
  checked: "Codebase search for account, Login, aria-label, mrtea"
  found: "Search surfaced src/components/layout/header/header.tsx with href=\"/account\" and aria-label=\"Account\", plus src/components/layout/footer/data.ts with { href: '/account', label: 'Login' }. Storybook fixture src/components/layout/footer/link/link-item.stories.tsx still contains an old mrtea.com.au example."
  implication: "Primary implementation appears likely correct; need confirm complete file context and whether the stale Storybook fixture is production-relevant."
- timestamp: 2026-06-22T10:27:09.8546423+08:00
  checked: "Header, footer data, footer renderer, and footer link component"
  found: "Header account icon renders href=\"/account\" with aria-label=\"Account\". Footer Login data is href '/account'. FooterView maps FOOTER_COLUMNS into FooterLinkList, which passes each link to FooterTextLink; internal hrefs render via next/link."
  implication: "The production header/footer link expectation is implemented in source."
- timestamp: 2026-06-22T10:27:09.8546423+08:00
  checked: "Account protected route behavior"
  found: "src/app/(storefront)/account/page.tsx calls requireAccountSessionForPath('/account'); that delegates to requireCustomerAccountSession(), which redirects missing sessions to /account/login?returnTo=%2Faccount. Existing protection.test.ts expects exactly redirect:/account/login?returnTo=%2Faccount."
  implication: "The screenshot URL is expected unauthenticated account behavior after following /account, not proof that the link href is wrong."
- timestamp: 2026-06-22T10:27:09.8546423+08:00
  checked: "Targeted verification commands"
  found: "pnpm exec vitest run --environment node \"src/app/(storefront)/account/_lib/protection.test.ts\" passed 1/1. pnpm exec vitest run --config vitest.storybook.config.mts \"src/components/layout/footer/view/view.stories.tsx\" passed 5/5."
  implication: "Executable coverage confirms the redirect contract and footer parity story currently pass."
- timestamp: 2026-06-22T10:27:09.8546423+08:00
  checked: "Common bug pattern scan"
  found: "No matching null/async/import/data-shape defect pattern explains the symptom; the observed mismatch is caused by checking post-navigation URL instead of anchor href, with footer target not captured in UAT evidence."
  implication: "Classify as verification ambiguity plus missing footer evidence, not a confirmed code defect."

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: "Test 8 treated the expected unauthenticated redirect from protected /account to /account/login?returnTo=%2Faccount as evidence about the header link target, and did not capture the footer Login href. Source and targeted tests show the production header and footer already point to /account; the observed URL is normal auth-guard behavior after navigation."
fix: "Diagnose-only: no code fix applied."
verification: "Read header/footer/account route code; ran account protection test and footer Storybook test successfully."
files_changed: []
