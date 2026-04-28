import Image from 'next/image'
import Link from 'next/link'
import type { ProductSummary } from '@/lib/shopify/types'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { Price } from '@/components/ui/price'

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
      className="group block overflow-hidden rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      style={{
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        transition: 'border-color 0.15s',
      }}
    >
      <div
        className="relative aspect-square"
        style={{ background: 'var(--color-border)' }}
      >
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
        <p
          className="truncate text-sm font-medium group-hover:underline"
          style={{ color: 'var(--color-text)' }}
        >
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
