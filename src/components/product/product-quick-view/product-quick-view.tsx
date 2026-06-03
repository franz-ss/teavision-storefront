'use client'

import { useMemo, useState } from 'react'
import { Eye, ShoppingCart } from 'lucide-react'

import type {
  Money,
  ProductQuickViewDetails,
  ProductSummary,
  ShopifyImage,
  ProductVariant,
} from '@/lib/shopify/types'
import {
  Button,
  type ButtonProps,
  Dialog,
  Price,
  StarRating,
  ToggleButton,
} from '@/components/ui'

import { ProductQuickViewImage } from './product-quick-view-image'
import { useAddToCart } from '../use-add-to-cart'

type ProductQuickViewProps = {
  product: ProductSummary
  buttonVariant?: NonNullable<ButtonProps['variant']>
  initialProduct?: ProductQuickViewDetails
}

function getInitialVariantId(variants: ProductVariant[]): string {
  return (
    variants.find((variant) => variant.availableForSale)?.id ??
    variants[0]?.id ??
    ''
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isMoney(value: unknown): value is Money {
  return (
    isRecord(value) &&
    typeof value.amount === 'string' &&
    typeof value.currencyCode === 'string'
  )
}

function isShopifyImage(value: unknown): value is ShopifyImage {
  return (
    isRecord(value) &&
    typeof value.url === 'string' &&
    (typeof value.altText === 'string' || value.altText === null) &&
    (typeof value.width === 'number' || value.width === null) &&
    (typeof value.height === 'number' || value.height === null)
  )
}

function isProductVariant(value: unknown): value is ProductVariant {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.availableForSale === 'boolean' &&
    isMoney(value.price) &&
    Array.isArray(value.quantityPriceBreaks) &&
    (value.image === undefined ||
      value.image === null ||
      isShopifyImage(value.image))
  )
}

function isProductOption(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    Array.isArray(value.values) &&
    value.values.every((optionValue) => typeof optionValue === 'string')
  )
}

function isQuickViewDetails(value: unknown): value is ProductQuickViewDetails {
  return (
    isRecord(value) &&
    typeof value.description === 'string' &&
    typeof value.handle === 'string' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    isRecord(value.priceRange) &&
    isMoney(value.priceRange.minVariantPrice) &&
    Array.isArray(value.images) &&
    value.images.every(isShopifyImage) &&
    Array.isArray(value.options) &&
    value.options.every(isProductOption) &&
    Array.isArray(value.variants) &&
    value.variants.every(isProductVariant)
  )
}

function getVariantLabel(
  product: ProductQuickViewDetails,
  variant: ProductVariant,
): string {
  const optionName = product.options[0]?.name ?? 'Size'
  return `${optionName}: ${variant.title}`
}

export function ProductQuickView({
  buttonVariant = 'inverse',
  product,
  initialProduct,
}: ProductQuickViewProps) {
  const [open, setOpen] = useState(false)
  const [productData, setProductData] = useState<ProductQuickViewDetails | null>(
    initialProduct ?? null,
  )
  const [selectedVariantId, setSelectedVariantId] = useState(() =>
    initialProduct ? getInitialVariantId(initialProduct.variants) : '',
  )
  const [isLoading, setIsLoading] = useState(false)
  const {
    addItem,
    error,
    isPending,
    message,
    reportError,
    resetFeedback,
  } = useAddToCart({
    getSuccessMessage: () => 'Added to cart',
  })

  const selectedVariant = useMemo(() => {
    if (!productData) return null
    return (
      productData.variants.find(
        (variant) => variant.id === selectedVariantId,
      ) ??
      productData.variants[0] ??
      null
    )
  }, [productData, selectedVariantId])

  const selectedImage =
    selectedVariant?.image ??
    productData?.images[0] ??
    product.featuredImage ??
    null
  const canAddToCart = selectedVariant?.availableForSale === true
  const hasVariants = (productData?.variants.length ?? 0) > 0

  async function loadProduct() {
    if (productData || isLoading) return

    setIsLoading(true)
    resetFeedback()

    try {
      const response = await fetch(
        `/api/products/${encodeURIComponent(product.handle)}/quick-view`,
      )

      if (!response.ok) {
        throw new Error('Unable to load product')
      }

      const nextProduct: unknown = await response.json()
      if (!isQuickViewDetails(nextProduct)) {
        throw new Error('Invalid quick-view product')
      }

      setProductData(nextProduct)
      setSelectedVariantId(getInitialVariantId(nextProduct.variants))
    } catch {
      reportError('Unable to load product details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpen() {
    setOpen(true)
    void loadProduct()
  }

  function handleAddToCart() {
    if (!selectedVariant || !canAddToCart) return

    addItem(selectedVariant.id, 1)
  }

  return (
    <>
      <Button
        type="button"
        variant={buttonVariant}
        size="sm"
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Eye className="h-4 w-4" aria-hidden="true" />
        Quick View
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Quick View"
        description={product.title}
        className="sm:max-h-[88vh]"
      >
        {isLoading && !productData ? (
          <div
            className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]"
            role="status"
            aria-live="polite"
            aria-label="Loading product details"
          >
            <span className="sr-only">Loading product details…</span>
            <div className="bg-surface-sunken aspect-square animate-pulse rounded-md motion-reduce:animate-none" />
            <div className="grid content-start gap-4">
              <div className="bg-surface-sunken h-8 w-4/5 animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-surface-sunken h-5 w-1/2 animate-pulse rounded motion-reduce:animate-none" />
              <div className="bg-surface-sunken h-28 animate-pulse rounded motion-reduce:animate-none" />
            </div>
          </div>
        ) : productData ? (
          <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:gap-7">
            <div className="bg-surface-sunken relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-md">
              <ProductQuickViewImage
                image={selectedImage}
                title={productData.title}
              />
            </div>

            <div className="grid content-start gap-5">
              <div className="grid gap-2">
                <h3 className="type-heading-04">{productData.title}</h3>
                {productData.rating !== undefined && (
                  <StarRating
                    rating={productData.rating}
                    count={productData.reviewCount}
                    size="sm"
                  />
                )}
                <div>
                  {selectedVariant ? (
                    <Price price={selectedVariant.price} size="lg" />
                  ) : (
                    <Price
                      price={productData.priceRange.minVariantPrice}
                      size="lg"
                    />
                  )}
                </div>
              </div>

              {productData.description && (
                <p className="type-body-sm text-muted line-clamp-5">
                  {productData.description}
                </p>
              )}

              {hasVariants && (
                <fieldset className="grid gap-2">
                  <legend className="type-label text-strong">
                    Available sizes
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {productData.variants.map((variant) => (
                      <ToggleButton
                        key={variant.id}
                        pressed={selectedVariantId === variant.id}
                        disabled={!variant.availableForSale || isPending}
                        aria-label={`${getVariantLabel(productData, variant)}${
                          !variant.availableForSale ? ', sold out' : ''
                        }`}
                        onClick={() => {
                          setSelectedVariantId(variant.id)
                          resetFeedback()
                        }}
                      >
                        {variant.title}
                      </ToggleButton>
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  size="lg"
                  isLoading={isPending}
                  disabled={!canAddToCart || isPending}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  {canAddToCart ? 'Add to Cart' : 'Sold Out'}
                </Button>
                <Button
                  href={`/products/${productData.handle}`}
                  variant="secondary"
                  size="lg"
                >
                  More Info
                </Button>
              </div>

              {message && (
                <p role="status" className="type-caption text-brand">
                  {message}
                </p>
              )}
              {error && (
                <p role="alert" className="type-caption text-danger-text">
                  {error}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 p-5">
            <p role="alert" className="type-body-sm text-danger-text">
              {error ?? 'Product details are unavailable.'}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => void loadProduct()}
            >
              Try again
            </Button>
          </div>
        )}
      </Dialog>
    </>
  )
}
