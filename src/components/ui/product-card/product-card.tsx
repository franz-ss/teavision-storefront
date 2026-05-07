import Image from 'next/image'
import Link from 'next/link'

import type { ProductSummary } from '@/lib/shopify/types'

import { Badge, type BadgeVariant } from '../badge'
import { Price } from '../price'

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
      className="border-default bg-surface hover:border-brand focus-visible:ring-ring group block h-full overflow-hidden rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="bg-surface-sunken relative aspect-square">
        {product.featuredImage &&
        product.featuredImage.width &&
        product.featuredImage.height ? (
          <Image
            src={`${product.featuredImage.url}&width=400`}
            alt={product.featuredImage.altText ?? product.title}
            width={product.featuredImage.width}
            height={product.featuredImage.height}
            priority={priority}
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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

      <div className="p-4">
        <p className="type-label text-strong group-hover:text-brand line-clamp-2 transition-colors">
          {product.title}
        </p>
        <Price
          price={product.priceRange.minVariantPrice}
          size="sm"
          className="mt-2"
        />
      </div>
    </Link>
  )
}
