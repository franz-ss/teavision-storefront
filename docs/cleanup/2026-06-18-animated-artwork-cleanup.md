# Animated Artwork Cleanup

Date: 2026-06-18

## Summary

Decorative floating artwork now uses the generic `AnimatedElement` UI primitive. Homepage and blog sections keep their own content, layout, form, and CTA responsibilities while passing image metadata into the shared primitive.

## Removed

- Legacy brush illustration component folder under `src/components/homepage/`.
- Legacy curved-label component folder under `src/components/homepage/`.
- Temporary content-named animated image helper under `src/components/homepage/`.
- Retired duplicate image aliases in `public/images/`.
- Retired one-off design-bundle extraction script.

## Breaking Changes

- Code that imported the retired homepage artwork helpers must use `AnimatedElement` from `@/components/ui`.
- The old extracted image aliases are no longer available. Use the current semantic asset names already referenced by storefront sections.

## CMS Migration Notes

- Model decorative animated media as CMS fields with `src`, `width`, `height`, `sizes`, width class, and animation variant.
- Keep animation variant values generic, currently `float-primary` and `float-secondary`.
- Avoid coupling CMS schema names to specific page content, campaign labels, or visual motifs.
- Keep section copy, CTA data, and decorative media separate so content can move into the CMS without changing the animation primitive.
