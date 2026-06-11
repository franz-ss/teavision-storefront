import { describe, expect, it } from 'vitest'

import * as pageHelpers from './page-helpers'

const richHeroHtml = `
<section class="bulk-header">
  <h1>Ready-Made Bulk Tea Bags for Cafes, Hotels &amp; Retail</h1>
  <p>Teavision's most-loved blends in convenient <strong>biodegradable pyramid tea bags</strong>.</p>
  <img src="https://cdn.shopify.com/s/files/1/0786/8339/files/TeaVision-14_1.jpg?v=1761279097" alt="Teavision Bulk Tea Bags">
  <div>
    <a href="https://cdn.shopify.com/s/files/1/0786/8339/files/Teavision_Tea_Bag_Catalogue_1.pdf?v=1640138688">View our Tea Bag Manufacturing Catalogue</a>
    <a href="mailto:info@teavision.com.au?subject=Custom%20Tea%20Bag%20Enquiry">Speak to Our Team About Custom Tea Bags</a>
  </div>
  <a href="https://www.teavision.com.au/collections/all">Create Your Own White Label Tea Bag</a>
  <p>Minimum Order Quantity: <strong>6,000 Tea Bags Per Blend</strong></p>
</section>
`

describe('parseCollectionRichHero', () => {
  it('parses the strict Shopify rich hero block into structured content', () => {
    expect(typeof pageHelpers.parseCollectionRichHero).toBe('function')

    const richHero = pageHelpers.parseCollectionRichHero(richHeroHtml)

    expect(richHero).toEqual({
      actions: [
        {
          href: 'https://cdn.shopify.com/s/files/1/0786/8339/files/Teavision_Tea_Bag_Catalogue_1.pdf?v=1640138688',
          label: 'View our Tea Bag Manufacturing Catalogue',
        },
        {
          href: 'mailto:info@teavision.com.au?subject=Custom%20Tea%20Bag%20Enquiry',
          label: 'Speak to Our Team About Custom Tea Bags',
        },
      ],
      footnote: 'Minimum Order Quantity: 6,000 Tea Bags Per Blend',
      highlightAction: {
        href: 'https://www.teavision.com.au/collections/all',
        label: 'Create Your Own White Label Tea Bag',
      },
      image: {
        altText: 'Teavision Bulk Tea Bags',
        height: 577,
        url: 'https://cdn.shopify.com/s/files/1/0786/8339/files/TeaVision-14_1.jpg?v=1761279097',
        width: 1600,
      },
      introHtml:
        "Teavision's most-loved blends in convenient <strong>biodegradable pyramid tea bags</strong>.",
      title: 'Ready-Made Bulk Tea Bags for Cafes, Hotels & Retail',
    })
  })

  it('returns null for normal collection rich text without the opt-in marker', () => {
    const normalDescriptionHtml = `
      <h1>Wholesale Tea</h1>
      <p>Browse loose leaf tea in bulk.</p>
      <img src="https://cdn.shopify.com/s/files/1/0786/8339/files/other.jpg" alt="Tea">
    `

    expect(
      pageHelpers.parseCollectionRichHero(normalDescriptionHtml),
    ).toBeNull()
  })
})
