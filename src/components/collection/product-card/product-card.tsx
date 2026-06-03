import Image from 'next/image'
import Link from 'next/link'

import { ProductQuickView } from '@/components/product'
import type { CollectionProductSummary } from '@/lib/shopify/types'
import { Badge, Button, Card, Price, StarRating } from '@/components/ui'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'
import { cn } from '@/lib/utils'

import { QuickAddButton } from '../quick-add-button'

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
  const quickAddVariantId =
    product.availableForSale && product.quickAdd?.availableForSale
      ? product.quickAdd.variantId
      : null
  const shouldShowQuickView =
    product.availableForSale && quickAddVariantId === null

  return (
    <Card
      as="article"
      radius="md"
      overflow="hidden"
      interactive
      className={cn('group', className)}
    >
      <div className="grid min-h-full grid-cols-[7.5rem_1fr] sm:grid-cols-[12rem_1fr] lg:grid-cols-[14rem_1fr]">
        <Link
          href={productUrl}
          className="bg-surface-sunken focus-visible:ring-ring relative min-h-40 overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:min-h-56"
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
              sizes="(min-width: 1024px) 14rem, (min-width: 640px) 12rem, 7.5rem"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="h-full w-full" aria-hidden="true" />
          )}
          {isSoldOut && (
            <div className="absolute top-3 left-3">
              <Badge variant="outOfStock" />
            </div>
          )}
        </Link>

        <div className="grid min-w-0 content-start gap-5 p-4 sm:p-5 lg:p-6">
          <div className="min-w-0">
            <h3 className="type-heading-04 text-strong wrap-break-word">
              <Link
                href={productUrl}
                className="focus-visible:ring-ring hover:text-brand rounded transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {product.title}
              </Link>
            </h3>

            {product.rating !== undefined && (
              <StarRating
                rating={product.rating}
                count={product.reviewCount}
                size="sm"
                className="mt-3"
              />
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <p className="type-body-sm mr-auto flex min-h-11 items-center gap-1.5">
                <span className="text-muted">From</span>
                <Price
                  price={product.priceRange.minVariantPrice}
                  size="sm"
                  className="text-strong"
                />
              </p>
              <Button href={productUrl} variant="secondary" size="sm">
                More info
              </Button>
              {quickAddVariantId ? (
                <QuickAddButton
                  productTitle={product.title}
                  variantId={quickAddVariantId}
                />
              ) : null}
              {shouldShowQuickView ? (
                <ProductQuickView product={product} buttonVariant="secondary" />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
