---
status: partial
phase: 12-optimize-blogs-teavision-blogs-loading-and-image-rendering
source: [12-VERIFICATION.md]
started: 2026-06-11T13:01:00Z
updated: 2026-06-11T13:24:44Z
---

# Phase 12 Human UAT

## Current Test

number: 4
name: Default listing hides scheduled featured posts
expected: |
  A future-dated featured post configured in Sanity Studio does not appear in the FeaturedArticles section.
awaiting: user response

## Tests

### 1. Default listing with no configured featuredPosts
expected: Article grid renders normally with latest published articles; no "0 articles" empty state.
result: pass

### 2. Blog hero LQIP behavior
expected: Blur-in effect when LQIP is valid; no render crash for empty or absent LQIP at desktop 1440px and mobile 375px.
result: pass

### 3. Tag/search pages include matching featured articles
expected: Featured articles appear in tag/search grids alongside non-featured articles when they match the active tag or query.
result: pass

### 4. Default listing hides scheduled featured posts
expected: A future-dated featured post configured in Sanity Studio does not appear in the FeaturedArticles section.
result: pending

## Summary

total: 4
passed: 3
issues: 0
pending: 1
skipped: 0
blocked: 0

## Gaps
