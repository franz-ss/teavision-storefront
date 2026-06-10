import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import type { ProductSummary } from '@/lib/shopify/types'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { Price } from '@/components/ui/price'
import { StarRating } from '@/components/ui/star-rating'

export type RecommendationProductCardProps = {
  product: ProductSummary
  badge?: BadgeVariant
  priority?: boolean
  quickViewAction?: ReactNode
}

export function RecommendationProductCard({
  product,
  badge,
  priority = false,
  quickViewAction,
}: RecommendationProductCardProps) {
  const productUrl = `/products/${product.handle}`

  return (
    <article className="group h-full">
      <div className="flex h-full flex-col">
        <div className="bg-paper-2 relative aspect-[1/1.12] overflow-hidden rounded-lg">
          <Link
            href={productUrl}
            className="focus-visible:ring-ring absolute inset-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={`View ${product.title}`}
          >
            {product.featuredImage &&
            product.featuredImage.width &&
            product.featuredImage.height ? (
              <Image
                src={getSizedShopifyImageUrl(product.featuredImage.url, 520)}
                alt={product.featuredImage.altText ?? product.title}
                width={product.featuredImage.width}
                height={product.featuredImage.height}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, (min-width: 360px) calc(50vw - 1.5rem), calc(100vw - 2rem)"
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-focus-within:scale-[1.06] group-hover:scale-[1.06] motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-focus-within:scale-100 motion-reduce:group-hover:scale-100"
              />
            ) : (
              <div className="h-full w-full" aria-hidden="true" />
            )}
            <span
              className="bg-ink/0 group-focus-within:bg-ink/20 group-hover:bg-ink/20 absolute inset-0 transition-colors duration-300 ease-out motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>

          {badge && (
            <div className="absolute top-2 left-2">
              <Badge variant={badge} />
            </div>
          )}

          {quickViewAction && (
            <div className="pointer-events-none absolute inset-3 flex items-center justify-center opacity-100 transition-opacity duration-200 ease-out motion-reduce:transition-none sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
              <div className="pointer-events-auto">{quickViewAction}</div>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <p className="type-mono-meta text-ink-faint">Teavision · wholesale</p>
          <Link
            href={productUrl}
            className="font-display text-ink hover:text-brand focus-visible:ring-ring my-1.5 line-clamp-2 rounded text-[1.2rem] leading-[1.1] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {product.title}
          </Link>

          {product.rating !== undefined && (
            <StarRating
              rating={product.rating}
              count={product.reviewCount}
              size="sm"
            />
          )}

          <p className="mt-auto flex flex-wrap items-baseline gap-1.5 pt-2">
            <span className="text-ink-faint font-mono text-[11px]">From</span>
            <Price
              price={product.priceRange.minVariantPrice}
              size="sm"
              className="text-ink font-bold"
            />
          </p>
        </div>
      </div>
    </article>
  )
}
