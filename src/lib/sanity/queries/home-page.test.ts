import { describe, expect, it } from 'vitest'

import { homePageQuery } from './home-page'

describe('homePageQuery', () => {
  it('targets the published homepage singleton at the root slug', () => {
    expect(homePageQuery).toContain('_type == "homePage"')
    expect(homePageQuery).toContain('slug.current == "/"')
    expect(homePageQuery).toContain('[0]')
  })

  it('projects render-critical SEO and image metadata fields', () => {
    expect(homePageQuery).toContain('seo{')
    expect(homePageQuery).toContain('metaTitle')
    expect(homePageQuery).toContain('metaDescription')
    expect(homePageQuery).toContain('canonicalPath')
    expect(homePageQuery).toContain('noIndex')
    expect(homePageQuery).toContain('metadata{')
    expect(homePageQuery).toContain('dimensions{')
    expect(homePageQuery).toContain('lqip')
    expect(homePageQuery).toContain('crop')
    expect(homePageQuery).toContain('hotspot')
  })

  it('includes every fixed homepage section modeled in Phase 21', () => {
    expect(homePageQuery).toContain('hero{')
    expect(homePageQuery).toContain('productRange{')
    expect(homePageQuery).toContain('newsletter{')
    expect(homePageQuery).toContain('privateLabel{')
    expect(homePageQuery).toContain('organicHerbs{')
    expect(homePageQuery).toContain('supplyChain{')
    expect(homePageQuery).toContain('certificationCoverage{')
    expect(homePageQuery).toContain('supplyChainProtection{')
    expect(homePageQuery).toContain('testimonials{')
    expect(homePageQuery).toContain('teaJournal{')
    expect(homePageQuery).toContain('blogHandle')
    expect(homePageQuery).toContain('linkLabel')
    expect(homePageQuery).toContain('maxPosts')
    expect(homePageQuery).toContain('contact{')
    expect(homePageQuery).toContain('catalogueCta{')
    expect(homePageQuery).toContain('secondaryCta')
    expect(homePageQuery).toContain('faq{')
  })
})
