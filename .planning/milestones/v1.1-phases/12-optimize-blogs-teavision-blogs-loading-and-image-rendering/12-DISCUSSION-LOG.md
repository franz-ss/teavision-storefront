# Phase 12: optimize /blogs/teavision-blogs loading and image rendering - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-11
**Phase:** 12-optimize /blogs/teavision-blogs loading and image rendering
**Areas discussed:** Aggressiveness, Freshness, Image Experience, Measurement

---

## Aggressiveness

| Question | Options | Selected |
| -------- | ------- | -------- |
| How broad should the Phase 12 optimization pass be? | Image/preload cleanup only; Image cleanup + contained query trimming; Full performance pass | Image cleanup + contained query trimming |
| How far should query trimming go in the first implementation? | Default listing first; Default + tag pages; Default + tag + search | Default listing first |
| What should happen to tag and search modes while optimizing the default page? | Keep existing fallback path; Partially share the new query; Force everything through the new query | Keep existing fallback path |
| If the default-listing query trim turns out messier than expected, what should the planner do? | Keep it optional behind image wins; Treat query trimming as required; Escalate to a separate phase | Keep it optional behind image wins |

**User's choice:** Optimize images plus a contained default-listing query trim. Keep tag/search behavior on the existing fallback path. Treat query trimming as optional behind the image wins.

**Notes:** The user accepted the recommended conservative-middle path.

---

## Freshness

| Question | Options | Selected |
| -------- | ------- | -------- |
| How should Phase 12 treat Sanity freshness versus performance? | Keep current freshness model; Use CDN for published blog reads where safe; Change cache timing only | Use CDN for published blog reads where safe |
| If CDN-backed Sanity reads introduce a short delay after publishing or editing, what delay is acceptable? | Near-immediate; Short editorial lag; Longer cache window | Short editorial lag |
| Should this phase require Sanity webhook/tag invalidation to be verified before enabling CDN-backed reads? | Yes, verify invalidation first; Enable CDN and rely on TTL; Defer CDN if invalidation is unclear | Yes, verify invalidation first |
| Should Phase 12 change the blog cache lifetime, or keep timing conservative and focus on CDN + invalidation? | Keep cacheLife('hours') for now; Move blog listing to cacheLife('days'); Use a custom editorial cache profile | Keep cacheLife('hours') for now |

**User's choice:** CDN-backed published reads are allowed where safe, a short editorial lag is acceptable, invalidation must be verified first, and `cacheLife('hours')` should remain.

**Notes:** The user accepted the recommended balance of speed and editorial correctness.

---

## Image Experience

| Question | Options | Selected |
| -------- | ------- | -------- |
| How should above-the-fold image preloads behave? | One LCP image policy; Hero + first card; No explicit preloads | One LCP image policy |
| How should image placeholders work? | Use Sanity LQIP blur where available; Keep solid color placeholders; Blur only article cards | Use Sanity LQIP blur where available |
| How strict should image URL sizing be? | Next Image only; Bound Sanity URLs by use case; Custom Sanity loader | Bound Sanity URLs by use case |
| What should happen if a Sanity image is missing width/height metadata? | Use safe fallback rendering; Render with fill everywhere; Skip affected articles | Use safe fallback rendering |

**User's choice:** Use a single LCP preload target, carry Sanity LQIP into blur placeholders, bound Sanity image URLs by use case, and retain safe fallbacks when metadata is incomplete.

**Notes:** This aligns with current code findings: the hero fallback currently preloads, featured articles can also preload, and LQIP is queried but not exposed to UI components.

---

## Measurement

| Question | Options | Selected |
| -------- | ------- | -------- |
| What proof should Phase 12 require? | Code gates only; Code gates + browser evidence; Full performance audit | Code gates + browser evidence |
| Should Phase 12 require before/after numeric performance targets? | No hard numeric targets; Soft targets; Hard targets | No hard numeric targets |
| Where should browser evidence focus? | Actual blog listing route; Storybook components; Both route and Storybook | Actual blog listing route |
| Should the planner include a specific check for Sanity webhook/cache invalidation if CDN-backed reads are changed? | Yes, explicit verification item; Mention as implementation note; No, skip for this phase | Yes, explicit verification item |

**User's choice:** Require `pnpm lint`, `pnpm build`, and browser evidence on `/blogs/teavision-blogs`, with no hard numeric performance targets. If CDN-backed Sanity reads change, invalidation verification is required.

**Notes:** The user accepted the recommendation to verify the real route rather than use only component-level evidence.

---

## Codex's Discretion

- Exact implementation boundary for optional default-listing query trimming.
- Exact Sanity image width and quality caps.
- Exact route-level browser evidence method.

## Deferred Ideas

- None.
