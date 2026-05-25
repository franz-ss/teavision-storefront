'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { IconButton, ProductCard } from '@/components/ui'
import type { ProductSummary } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

import { ProductQuickView } from '../product-quick-view'

const AUTOPLAY_DELAY_MS = 4000

type RelatedProductsCarouselProps = {
  products: ProductSummary[]
  className?: string
}

export function RelatedProductsCarousel({
  products,
  className,
}: RelatedProductsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    slidesToScroll: 1,
  })
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollPrevious, setCanScrollPrevious] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return

    setActiveIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrevious(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  const scrollPrevious = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const frameId = window.requestAnimationFrame(onSelect)
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      window.cancelAnimationFrame(frameId)
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi || isPaused || !canScrollNext) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const intervalId = window.setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        window.clearInterval(intervalId)
      }
    }, AUTOPLAY_DELAY_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [canScrollNext, emblaApi, isPaused])

  if (products.length === 0) return null

  return (
    <div
      className={cn('relative', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Related products"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="absolute -top-14 right-0 flex gap-2">
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Show previous related products"
          disabled={!canScrollPrevious}
          onClick={scrollPrevious}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </IconButton>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="Show next related products"
          disabled={!canScrollNext}
          onClick={scrollNext}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </IconButton>
      </div>

      <div ref={emblaRef} className="overflow-hidden">
        <ul className="-ml-4 flex" role="list">
          {products.map((product, index) => (
            <li
              key={product.id}
              className="min-w-0 flex-[0_0_100%] pl-4 min-[360px]:flex-[0_0_50%] sm:flex-[0_0_33.333333%] lg:flex-[0_0_25%]"
              aria-roledescription="slide"
            >
              <ProductCard
                product={product}
                priority={index === activeIndex}
                quickViewAction={<ProductQuickView product={product} />}
              />
            </li>
          ))}
        </ul>
      </div>

      <p className="sr-only" aria-live="polite">
        Related product {activeIndex + 1} of {products.length}
      </p>
    </div>
  )
}
