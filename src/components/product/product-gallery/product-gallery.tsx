'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import { ToggleButton } from '@/components/ui'
import type { ShopifyImage } from '@/lib/shopify/types'
import { getSizedShopifyImageUrl } from '@/lib/shopify/image-url'
import { cn } from '@/lib/utils'

type ProductGalleryProps = {
  images: ShopifyImage[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  if (images.length === 0) {
    return <div className="aspect-[1/1.05] w-full rounded-lg bg-paper-2" />
  }

  return (
    <div
      className="w-full lg:sticky lg:top-30"
      role="region"
      aria-label={`${title} image gallery`}
    >
      <div
        className="aspect-[1/1.05] w-full overflow-hidden rounded-lg bg-paper-2"
        ref={emblaRef}
      >
        <div className="flex">
          {images.map((image, i) => (
            <div
              key={image.url}
              className="relative aspect-[1/1.05] min-w-0 flex-[0_0_100%]"
              aria-hidden={selectedIndex !== i}
            >
              {image.width && image.height ? (
                <Image
                  src={getSizedShopifyImageUrl(image.url, 800)}
                  alt={image.altText ?? title}
                  width={image.width}
                  height={image.height}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  preload={i === 0}
                  sizes="(min-width: 1280px) 38rem, (min-width: 1024px) calc(50vw - 3.5rem), calc(100vw - 2rem)"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-paper-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, i) => (
            <ToggleButton
              key={image.url}
              variant="thumbnail"
              className={cn(
                'aspect-square h-auto w-full rounded-lg border-2 border-transparent bg-paper-2 opacity-70 hover:opacity-100 aria-pressed:border-brand aria-pressed:opacity-100 aria-pressed:ring-0',
              )}
              aria-label={`View image ${i + 1}`}
              pressed={selectedIndex === i}
              onClick={() => emblaApi?.scrollTo(i)}
            >
              {image.width && image.height ? (
                <Image
                  src={getSizedShopifyImageUrl(image.url, 120)}
                  alt={image.altText ?? `${title} ${i + 1}`}
                  width={image.width}
                  height={image.height}
                  sizes="120px"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-paper-2" />
              )}
            </ToggleButton>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Image {selectedIndex + 1} of {images.length}
      </p>
    </div>
  )
}
