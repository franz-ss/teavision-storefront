import Image from 'next/image'
import Link from 'next/link'

import type { ProductSummary } from '@/lib/shopify/types'

import { Badge, type BadgeVariant } from './badge'
import { Price } from './price'

type ProductCardProps = {
  product: ProductSummary
  badge?: BadgeVariant
  priority?: boolean
}

export function ProductCard({
  product,
  badge,
  priority = false,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group border-border bg-surface block overflow-hidden rounded border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="bg-border relative aspect-square">
        {product.featuredImage &&
        product.featuredImage.width &&
        product.featuredImage.height ? (
          <Image
            src={`${product.featuredImage.url}&width=400`}
            alt={product.featuredImage.altText ?? product.title}
            width={product.featuredImage.width}
            height={product.featuredImage.height}
            priority={priority}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" aria-hidden="true" />
        )}
        {badge && (
          <div className="absolute top-2 left-2">
            <Badge variant={badge} />
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-text truncate text-sm font-medium group-hover:underline">
          {product.title}
        </p>
        <Price
          price={product.priceRange.minVariantPrice}
          size="sm"
          className="mt-1"
        />
      </div>
    </Link>
  )
}
