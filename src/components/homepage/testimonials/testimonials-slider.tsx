'use client'

import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import { cn } from '@/lib/utils'

type TestimonialsSliderProps = {
  children: ReactNode
  slideCount: number
}

export function TestimonialsSlider({
  children,
  slideCount,
}: TestimonialsSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [activeIndex, setActiveIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return

    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!emblaApi) return

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        emblaApi.scrollPrev()
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        emblaApi.scrollNext()
      }
    },
    [emblaApi],
  )

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div
      className="focus-visible:ring-ring mt-10 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials, use left and right arrow keys to move between testimonials"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="-ml-4 flex items-start">{children}</div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex h-1.5 w-24 gap-1" aria-hidden="true">
          {Array.from({ length: slideCount }, (_, index) => (
            <span
              key={index}
              className={cn(
                'h-full flex-1 rounded-full border transition-colors',
                index === activeIndex
                  ? 'border-brand bg-brand'
                  : 'border-default bg-surface',
              )}
            />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Testimonial {activeIndex + 1} of {slideCount}
        </p>
      </div>
    </div>
  )
}
