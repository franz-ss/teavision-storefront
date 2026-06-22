---
status: diagnosed
trigger: "Phase 14 UAT Test 9: Legacy account bridge UIs do not look good; screenshots show large wrapped headings on compact cards, making create/recover account bridge pages feel awkward and cramped."
created: 2026-06-22T10:25:00.7189882+08:00
updated: 2026-06-22T10:42:00.0000000+08:00
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: "CONFIRMED: LegacyBridge uses a compact/narrow card with oversized type-heading-01 route headings, causing awkward wrapping for register/recover copy."
test: "Diagnose-only complete."
expecting: "Gap-closure planning should adjust the bridge presentation, not account routing/auth logic."
next_action: "Return ROOT CAUSE FOUND report."

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: "Classic account routes such as register, recover, reset, activate, and unknown account paths show polished explanatory bridge pages for Shopify Customer Accounts, preserve only safe return/context values, and never show password inputs."
actual: "Legacy account bridge UIs do not look good; screenshots show large wrapped headings on compact cards, making create/recover account bridge pages feel awkward and cramped."
errors: "No runtime error reported. Cosmetic UAT failure."
reproduction: "UAT Test 9: visit legacy account bridge routes such as create/register/recover account paths and inspect compact bridge cards."
started: "Discovered during UAT for Phase 14."

## Eliminated
<!-- APPEND only - prevents re-investigating -->

- hypothesis: "The UAT issue is caused by only one route having bad copy or a unique layout wrapper."
  evidence: "All relevant legacy routes delegate to the same LegacyBridge component; the reported register/recover headings are story args and routing copy using the same shared card layout."
  timestamp: 2026-06-22T10:41:00.0000000+08:00
- hypothesis: "The bridge failed the no-password or safe-return requirements rather than visual polish."
  evidence: "legacy-routing.ts normalizes only allowed return params through getLegacyAccountLoginStartHref, and the legacy-bridge unit test passes while asserting no input[type='password']; UAT Test 9 specifically reports awkward large wrapped headings."
  timestamp: 2026-06-22T10:41:00.0000000+08:00

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-06-22T10:25:00.7189882+08:00
  checked: "UAT Test 9 and project state"
  found: "UAT reports cramped create/recover account bridge pages caused by large wrapped headings on compact cards; no password input issue was reported."
  implication: "Initial investigation should focus on bridge route presentation and responsive typography/card sizing rather than authentication logic."
- timestamp: 2026-06-22T10:27:00.0000000+08:00
  checked: "Route/component search for account legacy bridge pages"
  found: "Routes /account/register, /account/recover, /account/reset/[id], /account/activate/[id], and /account/[...legacy] all import LegacyBridge; tests and stories exist for the bridge."
  implication: "A shared LegacyBridge layout issue would affect the exact create/recover pages reported in UAT."
- timestamp: 2026-06-22T10:30:00.0000000+08:00
  checked: "LegacyBridge implementation and stories"
  found: "LegacyBridge renders a Section.Container variant='compact', a Card with className='mx-auto grid max-w-xl gap-6', and h1 className='type-heading-01 text-ink'. Register/recover story headings are 'Create your account with Shopify' and 'Recover your account with Shopify'."
  implication: "The reported screenshots align with the shared component pairing medium-length account headings with a compact card and large heading style."
- timestamp: 2026-06-22T10:33:00.0000000+08:00
  checked: "Typography and primitive search"
  found: "type-heading-01 is defined at clamp(2rem, 4vw, 3.4rem). Section.Intro uses type-heading-02, not type-heading-01, when variant='compact'."
  implication: "The local design system already treats compact layouts as needing smaller heading scale; LegacyBridge bypasses that convention."
- timestamp: 2026-06-22T10:36:00.0000000+08:00
  checked: "Shared primitives and existing LegacyBridge unit test"
  found: "Section.Container compact is max-w-prose; Card lg padding is p-5 sm:p-6; LegacyBridge adds max-w-xl. The legacy-bridge unit test passes and asserts hosted copy, no password input, and login link only."
  implication: "Behavioral requirements are covered, but there is no automated check preventing oversized headings inside the compact bridge card."
- timestamp: 2026-06-22T10:39:00.0000000+08:00
  checked: "Screenshot/artifact search"
  found: "No checked-in screenshot artifact for the UAT bridge failure was found; the screenshot description exists in 14-UAT.md. Storybook stories cover Register and Recover states but no visual assertion or viewport-specific regression check."
  implication: "Diagnosis relies on the direct component/layout evidence plus the UAT screenshot description."

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: "LegacyBridge uses a compact/prose-width layout (`Section.Container variant='compact'` plus a `max-w-xl` card) but renders route headings with `type-heading-01`, a large page-heading utility (`clamp(2rem, 4vw, 3.4rem)`). Medium-length register/recover copy such as 'Create your account with Shopify' and 'Recover your account with Shopify' therefore wraps heavily inside a compact card. This creates the cramped bridge UI shown in UAT. The existing Storybook/unit coverage checks copy, link, and no-password behavior but does not validate responsive visual density or heading wrapping."
fix:
verification: "Diagnose-only. Static source inspection plus `pnpm test:unit -- legacy-bridge` confirmed behavior tests pass while visual layout remains unguarded."
files_changed: []
