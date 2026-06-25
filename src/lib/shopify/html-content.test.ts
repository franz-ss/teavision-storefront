import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { sanitizeShopifyCompactHtml } from './html-content'

describe('sanitizeShopifyCompactHtml', () => {
  it('demotes imported H1 and H2 headings to compact H3 elements', () => {
    const html = sanitizeShopifyCompactHtml(
      '<h1>Imported product title</h1><h2>Imported section</h2><p>Body copy</p>',
    )

    expect(html).toContain(
      '<h3 class="type-heading-05 text-ink mt-5">Imported product title</h3>',
    )
    expect(html).toContain(
      '<h3 class="type-heading-05 text-ink mt-5">Imported section</h3>',
    )
    expect(html).not.toContain('<h1')
    expect(html).not.toContain('<h2')
  })
})
