---
status: resolved
trigger: "the megamenu is not showing when clicked"
created: "2026-06-22T12:50:37+08:00"
updated: "2026-06-22T12:56:00+08:00"
---

# Debug Session: megamenu-is-not-showing

## Symptoms

- expected_behavior: "Megamenu shows when clicked."
- actual_behavior: "Nothing happens."
- error_messages: "web-socket.ts:50 WebSocket connection to 'wss://detonate-trickster-venus.ngrok-free.dev/_next/webpack-hmr?id=WvMoJnnu74Ub56--a5yQS' failed"
- timeline: "It works on localhost:3000."
- reproduction: "Open the app through the ngrok URL and click the megamenu trigger."

## Current Focus

- hypothesis: "A real pointer click fires hover before click, opening the menu and then immediately toggling it closed; the ngrok WebSocket error is a separate missing dev-origin allowlist."
- test: "Use a Storybook interaction with userEvent.click and direct browser probes to compare DOM click, hover, and real pointer click behavior."
- expecting: "A real pointer click fails before the fix and passes after tracking whether hover already opened the menu for that click approach."
- next_action: "Restart the existing Next dev server so the next.config.ts dev-origin allowlist is loaded."
- reasoning_checkpoint: ""
- tdd_checkpoint: "TDD mode false; add focused regression coverage if root cause is component behavior."

## Evidence

- timestamp: "2026-06-22T12:50:37+08:00"
  observation: "User reports megamenu click does nothing only on ngrok URL; localhost:3000 works. Browser console shows Next webpack HMR WebSocket connection failure for the ngrok host."
- timestamp: "2026-06-22T12:53:19+08:00"
  observation: "After changing the Storybook interaction from DOM .click() to userEvent.click(), pnpm test:stories src/components/layout/header/mega-nav.stories.tsx failed with 'Shop mega panel did not open'."
- timestamp: "2026-06-22T12:55:46+08:00"
  observation: "After the menu fix, pnpm test:stories src/components/layout/header/mega-nav.stories.tsx passed: 6 tests passed."
- timestamp: "2026-06-22T12:56:00+08:00"
  observation: "pnpm lint and pnpm typecheck both exited 0. Existing localhost:3000 dev server continued serving the old module and Next refused a second dev server for the same project; restart is needed for runtime confirmation on that server and for next.config.ts changes."

## Eliminated

- hypothesis: "The ngrok tunnel itself is down."
  reason: "Both http://localhost:3000 and https://detonate-trickster-venus.ngrok-free.dev returned the storefront HTML with __next content."
- hypothesis: "The megamenu component lacks client interactivity."
  reason: "A pure DOM dispatchEvent('click') opened the menu; the failure was specific to real pointer hover-plus-click sequencing."

## Resolution

- root_cause: "The desktop trigger combined hover-open with click-toggle. A real click enters the trigger first, so hover opened the menu before the click handler ran; the click handler then saw the menu as open and closed it. Separately, Next dev HMR was not allowlisted for the ngrok origin."
- fix: "Track menus opened by hover and consume that state on the first matching click so the menu remains open; keep subsequent click-to-close behavior. Add the ngrok hostname to Next allowedDevOrigins."
- verification: "Red: pnpm test:stories src/components/layout/header/mega-nav.stories.tsx failed with 'Shop mega panel did not open'. Green: same command passed with 6/6 tests. pnpm lint passed. pnpm typecheck passed."
- files_changed: "next.config.ts; src/components/layout/header/mega-nav.tsx; src/components/layout/header/mega-nav.stories.tsx"
