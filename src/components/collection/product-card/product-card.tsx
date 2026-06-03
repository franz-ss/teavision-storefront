import Image from 'next/image'
import Link from 'next/link'

import type { CollectionProductSummary } from '@/lib/shopify/types'
import { Badge, Card, Price, StarRating } from '@/components/ui'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'
import { cn } from '@/lib/utils'

import { ProductPurchaseForm } from './product-purchase-form'

const CERT_KEYWORDS = ['organic', 'aco', 'certified', 'haccp'] as const

function getCertificationBadges(tags: string[]): string[] {
  const labelMap: Record<string, string> = {
    organic: 'Organic',
    aco: 'ACO',
    certified: 'Certified',
    haccp: 'HACCP',
  }
  const found: string[] = []
  for (const keyword of CERT_KEYWORDS) {
    if (tags.some((tag) => tag.toLowerCase().includes(keyword))) {
      found.push(labelMap[keyword])
      if (found.length === 2) break
    }
  }
  return found
}

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
  const certBadges = getCertificationBadges(product.tags)

  return (
    <Card
      as="article"
      radius="md"
      overflow="hidden"
      interactive
      className={cn('group', className)}
    >
      <div className="grid min-h-full grid-cols-[10rem_1fr] sm:grid-cols-[16rem_1fr] lg:grid-cols-[20rem_1fr]">
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
              sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 10rem"
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

        <div className="flex min-h-full min-w-0 flex-col p-4 sm:p-5 lg:p-6">
          {/* Identity zone — grows to push purchase zone down */}
          <div className="flex-1 space-y-3">
            {product.productType.trim() && (
              <p className="type-eyebrow text-muted">{product.productType.trim()}</p>
            )}
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
              />
            )}
            {certBadges.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {certBadges.map((label) => (
                  <span
                    key={label}
                    className="type-eyebrow inline-block rounded-sm border border-default bg-surface-sunken px-1.5 py-0.5 text-muted"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Purchase zone — pinned to bottom of card */}
          <div className="mt-4">
            <p className="type-body-sm mb-3 flex items-center gap-1.5">
              <span className="text-muted">From</span>
              <Price
                price={product.priceRange.minVariantPrice}
                size="sm"
                className="text-strong"
              />
            </p>
            {product.availableForSale ? (
              <ProductPurchaseForm
                variants={product.variants}
                productTitle={product.title}
                showQuantity={false}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  )
}
