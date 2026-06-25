import test from 'node:test'
import assert from 'node:assert/strict'

import {
  DEFAULT_COLLECTION_ROUTE,
  DEFAULT_PRODUCT_ROUTE,
  evaluateRouteHtml,
  findSchemaNodes,
  parseArgs,
} from './probe-crawlable-html.mjs'

const collectionHtml = `
<!doctype html>
<html lang="en-AU">
  <head>
    <link rel="canonical" href="https://www.teavision.com.au/collections/all">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "CollectionPage", "name": "All products" },
          { "@type": "ItemList", "name": "All products products" }
        ]
      }
    </script>
  </head>
  <body>
    <h1>All products</h1>
    <ul id="product-grid">
      <li><a href="/products/test-standard-tea">Test Standard Tea</a></li>
    </ul>
  </body>
</html>`

const productHtml = `
<!doctype html>
<html lang="en-AU">
  <head>
    <link rel="canonical" href="https://www.teavision.com.au/products/test-standard-tea">
    <script type="application/ld+json">
      { "@context": "https://schema.org", "@type": "Product", "name": "Test Standard Tea" }
    </script>
  </head>
  <body>
    <h1>Test Standard Tea</h1>
    <button>Add to Cart</button>
  </body>
</html>`

test('default arguments target representative collection and PDP routes', () => {
  const args = parseArgs([])

  assert.equal(args.collectionRoute, DEFAULT_COLLECTION_ROUTE)
  assert.equal(args.productRoute, DEFAULT_PRODUCT_ROUTE)
  assert.equal(args.startServer, false)
})

test('collection HTML passes with one H1, product grid content, canonical, and JSON-LD', () => {
  const rows = evaluateRouteHtml({
    expectedTitle: 'All products',
    html: collectionHtml,
    kind: 'collection',
    route: '/collections/all',
  })

  assert.equal(
    rows.every((row) => row.status === 'PASS'),
    true,
  )
})

test('PDP HTML passes with one H1, product title, buy marker, canonical, and Product JSON-LD', () => {
  const rows = evaluateRouteHtml({
    expectedTitle: 'Test Standard Tea',
    html: productHtml,
    kind: 'product',
    route: '/products/test-standard-tea',
  })

  assert.equal(
    rows.every((row) => row.status === 'PASS'),
    true,
  )
})

test('skeleton-only collection HTML fails crawl-critical content checks', () => {
  const rows = evaluateRouteHtml({
    expectedTitle: 'All products',
    html: `
      <html>
        <head><link rel="canonical" href="/collections/all"></head>
        <body>
          <div role="status" aria-live="polite">
            <span>Loading collection</span>
          </div>
        </body>
      </html>
    `,
    kind: 'collection',
    route: '/collections/all',
  })
  const skeletonRow = rows.find((row) => row.check === 'skeleton-only shell')
  const contentRow = rows.find(
    (row) => row.check === 'collection product content',
  )

  assert.equal(skeletonRow?.status, 'FAIL')
  assert.equal(contentRow?.status, 'FAIL')
})

test('JSON-LD traversal finds schema nodes inside @graph objects', () => {
  const nodes = findSchemaNodes(
    [
      {
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'BreadcrumbList' },
          { '@type': 'Product', name: 'Test Standard Tea' },
        ],
      },
    ],
    'Product',
  )

  assert.equal(nodes.length, 1)
  assert.equal(nodes[0].name, 'Test Standard Tea')
})
