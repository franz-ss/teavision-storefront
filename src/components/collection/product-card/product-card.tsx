import Image from 'next/image'
import Link from 'next/link'
import { Leaf } from 'lucide-react'

import type { CollectionProductSummary } from '@/lib/shopify/types'
import { Badge, Button, Price, StarRating } from '@/components/ui'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'
import { cn } from '@/lib/utils'

import { ProductPurchaseForm } from './product-purchase-form'

const COLLECTION_CARD_VARIANT_LIMIT = 8

type ProductCardProps = {
  product: CollectionProductSummary
  priority?: boolean
  className?: string
}

export function ProductCard({
  product,
  priority = false,
  className,
}: ProductCardProps) {
  const productUrl = `/products/${product.handle}`
  const isSoldOut = !product.availableForSale
  const canQuickAdd =
    product.variants.length > 0 &&
    product.variants.length < COLLECTION_CARD_VARIANT_LIMIT

  return (
    <article className={cn('group flex gap-4 sm:gap-7', className)}>
      <Link
        href={productUrl}
        tabIndex={-1}
        aria-hidden="true"
        className="bg-surface-sunken border-subtle relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border sm:h-45 sm:w-45"
      >
        {product.featuredImage &&
        product.featuredImage.width &&
        product.featuredImage.height ? (
          <Image
            src={getSizedShopifyImageUrl(product.featuredImage.url, 360)}
            alt={product.featuredImage.altText ?? product.title}
            width={product.featuredImage.width}
            height={product.featuredImage.height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes="(min-width: 640px) 180px, 112px"
            className="max-h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            aria-hidden="true"
          >
            <Leaf className="text-muted/40 h-6 w-6" />
          </div>
        )}
        {isSoldOut && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
            <Badge variant="outOfStock" />
          </div>
        )}
      </Link>

      <div className="flex min-h-28 min-w-0 flex-1 flex-col gap-2 sm:min-h-45">
        <div className="min-w-0">
          <h3 className="text-strong w-full font-display leading-relaxed font-medium wrap-break-word">
            <Link
              href={productUrl}
              className="focus-visible:ring-ring hover:text-brand inline-block rounded transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {product.title}
            </Link>
          </h3>

          {product.rating !== undefined && (
            <StarRating
              rating={product.rating}
              count={product.reviewCount}
              size="sm"
              className="mt-2 flex w-fit"
            />
          )}

          {!canQuickAdd && (
            <Price
              price={product.priceRange.minVariantPrice}
              size="sm"
              className="text-strong mt-1 block font-semibold"
            />
          )}
        </div>

        <div className={cn('min-w-0', canQuickAdd ? 'flex flex-1' : 'mt-auto')}>
          {canQuickAdd ? (
            <ProductPurchaseForm
              variants={product.variants}
              productTitle={product.title}
              layout="inline"
              showPrice
              hideSubmit={isSoldOut}
              className="flex flex-1 flex-col justify-between"
            />
          ) : (
            <Button href={productUrl} size="sm" className="w-full sm:w-auto">
              View options
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
