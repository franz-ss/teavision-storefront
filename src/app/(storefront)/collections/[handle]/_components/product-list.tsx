import { ProductCard } from '@/components/collection'
import { Button, Card } from '@/components/ui'
import type { CollectionProductSummary } from '@/lib/shopify/types'

type ProductListProps = {
  nextPageHref?: string | null
  products: CollectionProductSummary[]
}

export function ProductList({
  nextPageHref = null,
  products,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <ul className="grid gap-2" role="list">
        <Card as="li" padding="lg" radius="md" className="text-center">
          <h3 className="type-heading-03 text-strong">
            No products match these filters
          </h3>
          <p className="type-body-sm text-muted mx-auto mt-3 max-w-lg">
            Clear the selected filters or ask the Teavision team to confirm
            suitable options for this range.
          </p>
          <Button href="/pages/contact" className="mt-6">
            Contact Teavision
          </Button>
        </Card>
      </ul>
    )
  }

  return (
    <Card padding="md">
      <ul
        className="[&>li]:border-subtle space-y-8 divide-y [&>li:not(:last-child)]:pb-8"
        role="list"
      >
        {products.map((product, index) => (
          <li key={product.id}>
            <ProductCard product={product} priority={index === 0} />
          </li>
        ))}
      </ul>

      {nextPageHref && (
        <div className="mt-8 flex justify-center">
          <Button href={nextPageHref} variant="secondary">
            Next products
          </Button>
        </div>
      )}
    </Card>
  )
}
