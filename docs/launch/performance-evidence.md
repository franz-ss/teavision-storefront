# Performance Evidence

## Command

`pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173`

Initial evidence shell created for Phase 17 Plan 04. Run the command above to refresh local mobile Lighthouse lab evidence against the fake-provider production lifecycle. Lighthouse cannot replace field Core Web Vitals data; it is used here as repeatable launch regression evidence.

## Representative Routes

- `/`
- `/products/test-standard-tea`
- `/collections/all`
- `/cart`
- `/search?q=tea`
- `/account`
- `/pages/privacy-policy`

## Mobile Lighthouse Results

| Route       | LCP | CLS | TBT | A11y | Status | Mitigation                                                                                                |
| ----------- | --: | --: | --: | ---: | ------ | --------------------------------------------------------------------------------------------------------- |
| Pending run | n/a | n/a | n/a |  n/a | WARN   | Run `pnpm test:performance -- --start-server --base-url http://127.0.0.1:4173` to capture route evidence. |

## UX And Accessibility Polish

- duplicate skip link resolved: Pending Task 3 verification.
- mobile text wrapping checked: Pending Task 3 verification.
- Remaining non-blocking UX/accessibility polish items: Pending Task 3 verification.

## Remaining Mitigations

- Pending mobile Lighthouse run.
