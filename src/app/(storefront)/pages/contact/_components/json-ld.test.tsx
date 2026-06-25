import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { EMAIL, PHONE } from '../_lib/page-data'
import { JsonLd } from './json-ld'

function readJsonLdGraph() {
  const html = renderToStaticMarkup(<JsonLd />)
  const match = html.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>(.*)<\/script>/,
  )

  expect(match?.[1]).toBeDefined()

  const payload = JSON.parse(match?.[1] ?? 'null') as {
    '@graph': Array<{ '@type': string; [key: string]: unknown }>
  }

  return payload['@graph']
}

describe('contact page JsonLd', () => {
  it('emits parseable LocalBusiness schema from visible contact details', () => {
    const graph = readJsonLdGraph()
    const localBusiness = graph.find(
      (entry) => entry['@type'] === 'LocalBusiness',
    )

    expect(localBusiness).toMatchObject({
      '@type': 'LocalBusiness',
      name: 'Teavision',
      url: expect.stringMatching(/\/pages\/contact$/),
      telephone: PHONE,
      email: EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '29 Palladium Circuit',
        addressLocality: 'Clyde North',
        addressRegion: 'VIC',
        postalCode: '3978',
        addressCountry: 'AU',
      },
    })
  })
})
