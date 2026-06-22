# Phase 14: Shopify Customer Accounts - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-19
**Phase:** 14-Shopify Customer Accounts
**Areas discussed:** OAuth And Session Experience, Account Dashboard Shape, Address And Order Self-Service, Cart Identity And Checkout Handoff, Migration Parity Boundaries, Header Account Entry, Legacy Account Route Behavior, B2B Account Signals, Checkout Identity Failure UX, Setup/Readiness Checklist, Context Refresh

---

## OAuth And Session Experience

| Question | Options Presented | User's Choice |
|---|---|---|
| After login, where should the storefront send customers? | Return to intent; Account dashboard; Confirmation bridge | Return to intent |
| What should unauthenticated protected routes do? | Redirect to login with return path; Account sign-in landing page; Generic redirect to `/account/login` | Redirect to login with return path |
| What happens when a session expires or refresh fails? | Clear session and return to login; Soft account error; Silent logout to storefront | Clear session and return to login |
| How should logout behave? | Shopify logout plus local clear; Local clear only; Ask every time | Shopify logout plus local clear |
| What if Customer Account setup is incomplete? | Fail fast with setup guidance; Disable account links; Mock account flow locally | Fail fast with setup guidance |
| What if `state`, `nonce`, or PKCE validation fails? | Reject and restart login; Generic error page; Redirect home | Reject and restart login |
| How should account-session cookies be scoped? | HttpOnly server-owned cookies; Mixed cookie and client state; Browser-readable token storage | HttpOnly server-owned cookies |
| Should account login be exposed from the header immediately? | Show stable account entry once configured; Hide until fully live; Link to Shopify hosted login directly | Show stable account entry once configured |

**Notes:** OAuth should preserve intent, fail securely, avoid token exposure to browser JavaScript, and use Shopify-discovered endpoints for logout.

---

## Account Dashboard Shape

| Question | Options Presented | User's Choice |
|---|---|---|
| What should `/account` prioritize at the top? | Recent orders + default address; Profile summary + account actions; Support-oriented dashboard | Recent orders + default address |
| How much profile editing should Phase 14 support? | Supported Shopify fields only; Read-only profile summary; Add preference fields too | Supported Shopify fields only |
| What should happen when there are no recent orders? | Helpful empty state; Minimal no orders yet; Hide the orders section | Helpful empty state |
| How should wholesale/B2B customers be handled if tags/company context are visible? | Informational only; Hide B2B signals; Promote wholesale pricing | Informational only |
| How should account support/contact appear? | Compact support block; No support block; Prominent support CTA | Compact support block |
| What visual structure should the account area use? | Work-focused panels; Marketing-style account page; Bare utility layout | Work-focused panels |
| What if some account data is unavailable but the session is valid? | Partial dashboard with scoped error; Full account error; Force re-login | Partial dashboard with scoped error |
| Should logout be a primary action? | Secondary account action; Primary action; Header-only logout | Secondary account action |

**Notes:** Dashboard should be commerce-first, restrained, and resilient to section-level provider failures.

---

## Address And Order Self-Service

| Question | Options Presented | User's Choice |
|---|---|---|
| What should the address page emphasize? | Default address first; Flat address list; Address book as forms | Default address first |
| How should add/edit address flows work? | Dedicated form pages; Inline expand forms; Modal forms | Dedicated form pages |
| How should delete address behave? | Confirm before delete; Immediate delete with undo; Disable delete for default address | Confirm before delete |
| What should order history prioritize? | Practical order summary; Rich product preview; Minimal order links | Practical order summary |
| What should order detail pages include? | Full customer-useful details; Status-only detail; Mirror Shopify order page exactly | Full customer-useful details |
| How should guest orders be handled? | Clear account-only messaging; Attempt guest lookup; Hide the issue | Clear account-only messaging |
| How should Shopify user errors from mutations appear? | Field and form messages; Toast/banner only; Raw Shopify messages | Field and form messages |
| What if setting default address succeeds but refresh fails? | Confirm action with refresh fallback; Treat as failure; Silent reload attempt | Confirm action with refresh fallback |
| Should address forms prefill country/province expectations? | Australia-first sensible defaults; Fully neutral global form; Australia-only form | Australia-first sensible defaults |
| How should order history pagination behave? | Numbered or cursor-backed pages; Infinite scroll; Show only recent orders | Numbered or cursor-backed pages |
| Should reorder be built into order detail pages in Phase 14? | Document/defer unless checkout-authoritative; Add reorder button for all orders; Do not mention reorder | Document/defer unless checkout-authoritative |
| How should order status labels be written? | Customer-friendly normalized labels; Raw Shopify enum labels; Highly editorial labels | Customer-friendly normalized labels |

**Notes:** Address and order surfaces should be robust, practical, and Shopify-authoritative. Guest lookup and unsafe reorder remain out of scope.

---

## Cart Identity And Checkout Handoff

| Question | Options Presented | User's Choice |
|---|---|---|
| When should logged-in customer identity sync to the cart? | After login and before checkout; Before checkout only; After every cart mutation | After login and before checkout |
| What if sync fails before checkout? | Block with clear recovery; Continue as guest silently; Force re-login immediately | Block with clear recovery |
| How visible should signed-in cart identity be? | Subtle account context; Prominent signed-in banner; Invisible | Subtle account context |
| What happens when a customer logs out while a cart exists? | Keep cart, remove buyer identity; Clear the cart; Keep cart identity attached | Keep cart, remove buyer identity |
| Should cart creation include buyer identity when already signed in? | Yes, initialize with identity; No, update later; Only at checkout | Yes, initialize with identity |
| How should buyer identity interact with wholesale/B2B pricing? | Checkout-authoritative only; Show estimated wholesale savings; Ignore B2B context | Checkout-authoritative only |
| How should pre-checkout sync be tested? | Fake-Shopify only; Manual real checkout smoke test; Unit tests only | Fake-Shopify only |
| If signed in with no cart, should login create one? | Create/sync only when needed; Create cart on login; Send directly to Shopify account/checkout | Create/sync only when needed |

**Notes:** Identity sync protects checkout/account continuity without creating client-side pricing promises or unnecessary carts.

---

## Migration Parity Boundaries

| Question | Options Presented | User's Choice |
|---|---|---|
| What should happen to legacy account URLs? | Preserve with headless routes/redirects; Redirect all to `/account`; Let unsupported paths 404 | Preserve with headless routes/redirects |
| How should old `mrtea.com.au/account/login` be treated? | Replace with headless account route; Preserve external mrtea link; Remove footer login link | Replace with headless account route |
| How should classic password-based register/reset pages be handled? | Explain modern Shopify account login; Rebuild classic forms; Hide all classic paths | Explain modern Shopify account login |
| How should theme parity findings for reorder be handled? | Document/defer by default; Ship basic reorder; Ignore reorder parity | Document/defer by default |
| How should customer-specific/B2B pricing parity be documented? | Admin-dependent, checkout-authoritative; Treat as out of scope only; Build display estimates | Admin-dependent, checkout-authoritative |
| How should account navigation behave for signed-in vs signed-out customers? | Stable account entry with state-aware label; Always Log in; Separate account/logout links everywhere | Stable account entry with state-aware label |
| What about legacy account links with unsupported query params? | Preserve intent, drop unsafe noise; Preserve all params; Drop all params | Preserve intent, drop unsafe noise |
| How should launch readiness for Customer Account API admin setup be captured? | Explicit setup checklist; Inline notes in code only; Assume admin is ready | Explicit setup checklist |

**Notes:** Migration should preserve customer intent while moving account ownership into the headless storefront and documenting admin-dependent gaps.

---

## Header Account Entry

| Question | Options Presented | User's Choice |
|---|---|---|
| How should customers access account login from the main header? | Account icon in the right cluster; Text link in desktop nav; Icon + text on desktop, icon on mobile; You decide | Account icon in the right cluster |
| Should the header try to show signed-in state? | Stable Account icon always links to `/account`; State-aware label/icon when safe; Always link directly to `/account/login`; You decide | Stable Account icon always links to `/account` |
| How should the account entry appear in the mobile menu? | Header icon only; Also add a menu row; Menu row only on mobile; You decide | Header icon only |
| What should happen if Customer Account API setup is missing but the header account icon is visible? | Fail fast on click/route render; Hide the icon until configured; Show icon with support fallback; You decide | Fail fast on click/route render |

**Notes:** Header account access should be an icon-only entry in the existing right cluster beside search and cart. The icon links to `/account` on desktop and mobile; the account route owns auth redirects and setup failures.

---

## Legacy Account Route Behavior

| Question | Options Presented | User's Choice |
|---|---|---|
| How should the stale `https://mrtea.com.au/account/login` account link be treated in the Phase 14 plan? | Replace it everywhere with `/account`; Keep support for it as a special legacy source; Preserve external link until owner confirms; You decide | Replace it everywhere with `/account` |
| What should old classic account URLs do, such as `/account/register`, `/account/reset`, or password activation routes? | Redirect to modern OAuth login with explanatory copy when needed; Silent redirect to `/account`; Dedicated bridge pages for each classic intent; You decide | Redirect to modern OAuth login with explanatory copy when needed |
| If an old account URL includes query parameters from Liquid or emails, what should Phase 14 preserve? | Only safe return/context parameters; Preserve all query parameters; Drop all parameters; You decide | Only safe return/context parameters |
| What should customers see if a legacy account route cannot be mapped cleanly? | Account-focused explanatory page; Direct support/contact page; Generic 404; You decide | Account-focused explanatory page |

**Notes:** Legacy account routes should preserve intent without rebuilding classic password flows or passing unsafe Liquid-era parameters through the modern auth flow.

---

## B2B Account Signals

| Question | Options Presented | User's Choice |
|---|---|---|
| Should the account dashboard show wholesale/B2B status if Shopify exposes customer/company context? | Show informational status only; Hide B2B signals entirely; Prominent wholesale panel; You decide | Show informational status only |
| What should signed-in customers see if no wholesale/company signal is available? | Neutral account experience; Wholesale application prompt; Explain that no wholesale status was found; You decide | Neutral account experience |
| If a customer asks about wholesale pricing from the account page, where should the UI send them? | Existing wholesale/contact paths; Cart/checkout only; Dedicated future B2B page placeholder; You decide | Existing wholesale/contact paths |
| How should company/location context affect checkout preparation if Shopify exposes it? | Use it only if Shopify/cart supports it authoritatively; Show a manual company selector; Ignore company/location context for Phase 14; You decide | Use it only if Shopify/cart supports it authoritatively |

**Notes:** Account pages may acknowledge Shopify-exposed B2B/company context, but pricing and company-location behavior must stay Shopify/cart/checkout authoritative.

---

## Checkout Identity Failure UX

| Question | Options Presented | User's Choice |
|---|---|---|
| If buyer identity sync fails right before checkout, should the customer be allowed to continue as guest? | Block checkout until resolved; Allow guest checkout with warning; Ask customer to choose; You decide | Block checkout until resolved |
| What recovery action should the blocked checkout message prioritize? | Retry identity sync; Sign in again; Contact support; You decide | Retry identity sync |
| What secondary fallback should the blocked checkout message offer? | Sign in again + support link; Support link only; Return to account dashboard; You decide | Sign in again + support link |
| How should the cart communicate signed-in/account context before checkout? | Subtle account context near checkout; No account context unless there is an error; Prominent account panel in cart; You decide | Subtle account context near checkout |

**Notes:** Identity-sync failures should block checkout without silently falling back to guest, but the recovery path should be customer-friendly: retry first, then sign in again or contact support.

---

## Setup/Readiness Checklist

| Question | Options Presented | User's Choice |
|---|---|---|
| Where should the Customer Account API setup checklist live? | In Phase 14 docs/context plus developer error messages; Dedicated internal preflight route; Only in thrown errors; You decide | In Phase 14 docs/context plus developer error messages |
| How strict should missing setup be in production? | Fail closed with clear operator error; Show customer support fallback; Hide account entry points; You decide | Fail closed with clear operator error |
| Which setup prerequisites should downstream agents treat as launch-blocking? | Full Shopify account/OAuth/API checklist; Only credentials and callback URLs; Planner decides from Shopify docs; You decide | Full Shopify account/OAuth/API checklist |
| How should real checkout testing be represented in readiness docs? | Explicit blocked gate; Manual UAT checklist item; Omit from account readiness; You decide | Explicit blocked gate |

**Notes:** Setup readiness is a launch-blocking operator concern. Missing Customer Account API setup should fail closed, and real hosted checkout testing remains blocked until store-owner approval.

---

## Agent Discretion

- Exact component boundaries, file layout, helper names, and test organization are left to downstream planning/execution, provided they follow the locked context and project conventions.

## Context Refresh

**Date:** 2026-06-19

**Reason:** Phase 14 already had a completed context file, and later artifacts now exist for research, UI design, and validation. The user approved the recommended "Update it" path rather than reopening the full discussion.

**Update made:** Added `14-RESEARCH.md`, `14-UI-SPEC.md`, and `14-VALIDATION.md` to the canonical references in `14-CONTEXT.md`; refreshed code-context notes for fake Customer Account/OIDC fixtures, cart buyer identity fake-Shopify coverage, Storybook state requirements, and test-script wiring.

**New decisions:** None. The refresh did not reopen product, UX, auth, cart, B2B, migration, or readiness decisions.

## Deferred Ideas

- Guest order lookup.
- Custom account preferences.
- Reorder unless it is Shopify/cart authoritative.
- Customer-specific/B2B price display unless Shopify cart or checkout returns authoritative pricing.
