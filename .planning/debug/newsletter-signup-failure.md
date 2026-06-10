---
status: diagnosed
trigger: "Phase 11 UAT test 7: Homepage newsletter signup shows 'Unable to send your signup right now. Please try again shortly.' on every submission. Expected: success confirmation."
created: 2026-06-10T00:00:00Z
updated: 2026-06-10T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED — RESEND_API_KEY missing from .env.local causes sendNewsletterSignupAction to short-circuit with NEWSLETTER_SEND_ERROR before any send attempt
test: complete (static analysis)
expecting: n/a
next_action: return diagnosis (goal: find_root_cause_only)

## Symptoms

expected: Submitting the homepage newsletter form shows "Thanks for signing up."
actual: Form shows "Unable to send your signup right now. Please try again shortly." every time
errors: "Unable to send your signup right now. Please try again shortly." (NEWSLETTER_SEND_ERROR in src/lib/contact/actions.ts:44-45)
reproduction: Submit any valid email in homepage (or footer) newsletter form in local dev
started: Phase 11 UAT — likely never worked locally (env var never set in .env.local)

## Eliminated

- hypothesis: Rate limiting (in-memory limiter or RATE_LIMIT_* flags) causes the failure
  evidence: Rate-limited path returns a DIFFERENT message ("Too many submissions. Please wait a moment before trying again.", actions.ts:46-47, returned at actions.ts:307). Limiter only triggers after 5 submissions per 60s per IP (actions.ts:52-53). RATE_LIMIT_EXTERNAL_PROTECTION / RATE_LIMIT_ALLOW_MEMORY_FALLBACK only control a production warning (src/lib/env/server.ts:18-24), not request rejection. Symptom occurs on first submission, every time.
  timestamp: 2026-06-10

- hypothesis: Client-side validation or honeypot triggering the error
  evidence: Honeypot path returns { success: true } silently (actions.ts:294-296). Invalid email returns a DIFFERENT message ("Please enter a valid email address.", actions.ts:43, returned at actions.ts:303). Symptom message matches only the send-error branch.
  timestamp: 2026-06-10

- hypothesis: Resend API call failing (bad key, network)
  evidence: Possible in principle (actions.ts:325-334 returns same message on Resend error/throw), but the key check at actions.ts:310-313 fires FIRST and deterministically — .env.local contains no RESEND_API_KEY at all, so execution never reaches the Resend call. Deterministic "every time" failure matches the missing-key branch, not an intermittent API failure.
  timestamp: 2026-06-10

## Evidence

- timestamp: 2026-06-10
  checked: src/components/homepage/newsletter/newsletter-form.tsx
  found: DEFAULT_ERROR (line 13-14) matches symptom text, but form displays result.error from the action when result.success is false (line 40) — action's NEWSLETTER_SEND_ERROR is the same string, so either path shows identical text. Action prop wired from page.
  implication: Error originates server-side in the action result, not a client throw.

- timestamp: 2026-06-10
  checked: src/app/(storefront)/page.tsx
  found: Homepage wires <HomepageNewsletter action={submitNewsletterSignupFormAction} /> (line 67) — delegates to sendNewsletterSignupAction.
  implication: Server Action under test is sendNewsletterSignupAction in src/lib/contact/actions.ts.

- timestamp: 2026-06-10
  checked: src/lib/contact/actions.ts (sendNewsletterSignupAction, lines 288-335)
  found: Exact symptom string NEWSLETTER_SEND_ERROR defined at lines 44-45. Returned in 3 places: (a) line 310-313 when getResendApiKey() is falsy, (b) line 325-328 when Resend API returns error, (c) line 331-334 on throw. Action sends an email via Resend (resend.emails.send to info@teavision.com.au) — no Shopify involvement.
  implication: Failure is in the Resend email path; first gate is the API key.

- timestamp: 2026-06-10
  checked: src/lib/env/server.ts + src/lib/env/read.ts
  found: getResendApiKey() = optionalEnv('RESEND_API_KEY'); optionalEnv returns undefined for missing/empty/whitespace values.
  implication: Without RESEND_API_KEY set, the action returns failure immediately, before any network call.

- timestamp: 2026-06-10
  checked: .env.local variable names (values not read)
  found: Contains only SITE_URL, SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN, NEXT_PUBLIC_TRUSTOO_SHOP_DOMAIN, NEXT_PUBLIC_SEARCHANISE_ENABLED, NEXT_PUBLIC_SEARCHANISE_API_KEY, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION, SANITY_API_READ_TOKEN. NO RESEND_API_KEY line at all. .env.example documents RESEND_API_KEY= (line 34) as an expected var.
  implication: ROOT CAUSE — getResendApiKey() returns undefined → action returns { success: false, error: NEWSLETTER_SEND_ERROR } deterministically on every submission.

- timestamp: 2026-06-10
  checked: src/components/layout/footer/footer.tsx + src/components/layout/footer/newsletter-form/newsletter-form.tsx
  found: Footer wires the SAME action (sendNewsletterSignupFormAction → sendNewsletterSignupAction) via useActionState; same fallback error string.
  implication: Footer newsletter form fails identically — same root cause, not a homepage-specific bug.

- timestamp: 2026-06-10
  checked: git log -- src/lib/contact/actions.ts src/lib/env/server.ts
  found: Recent commits 32f8df8 "fix: centralize integration env reads" and 56fed93 "feat: add centralized env helpers" moved the key read from (presumably) direct process.env access into getResendApiKey()/optionalEnv. No behavioral change to the missing-key branch — the action always required RESEND_API_KEY. No Phase 11 commit broke this; the env var was simply never provisioned locally.
  implication: Not a regression introduced by code change; an unprovisioned local environment dependency surfaced by UAT.

## Resolution

root_cause: RESEND_API_KEY is not set in .env.local (no entry at all, though .env.example line 34 documents it). sendNewsletterSignupAction (src/lib/contact/actions.ts:310-313) checks getResendApiKey() before attempting the Resend email send and returns { success: false, error: NEWSLETTER_SEND_ERROR } when the key is missing — producing the exact UAT error "Unable to send your signup right now. Please try again shortly." on every submission, deterministically, before any external call. The footer newsletter form and the contact/custom-tea-blend forms share the same gate and fail the same way.
fix: (not applied — diagnose-only) Provision RESEND_API_KEY in .env.local (copy from .env.example, obtain key from Resend dashboard). Optionally improve UX/observability: log a server-side warning distinguishing "email provider not configured" from genuine send failures, or surface a clearer admin-facing message in non-production.
verification: (not performed — diagnose-only) After setting the key, submit the homepage form with a valid email and confirm "Thanks for signing up." appears and an email arrives at info@teavision.com.au.
files_changed: []
