'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import { ToggleButton } from '@/components/ui'
import { cn } from '@/lib/utils'

type TestimonialSelector = {
  logo: {
    src: string
    alt: string
    width: number
    height: number
  }
  name: string
  role: string
  brand?: string
}

type TestimonialsSliderProps = {
  children: ReactNode
  testimonials: TestimonialSelector[]
}

export function TestimonialsSlider({
  children,
  testimonials,
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

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
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
      className="focus-visible:ring-ring mt-12 grid gap-8 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:grid-cols-[0.9fr_1.6fr] lg:items-center lg:gap-[clamp(30px,5vw,70px)]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials, use left and right arrow keys to move between testimonials"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="flex flex-col gap-2">
        {testimonials.map((testimonial, index) => (
          <ToggleButton
            key={testimonial.name}
            variant="menuCard"
            pressed={index === activeIndex}
            onClick={() => scrollTo(index)}
            className={cn(
              // Design .tst__brand: logo + meta in a left-aligned row (override
              // menuCard's justify-between), 14px gap, padding 16px 18px
              'items-center justify-start gap-3.5 rounded-lg px-4.5 py-4',
              index === activeIndex && 'shadow-1',
            )}
          >
            <Image
              src={testimonial.logo.src}
              alt={testimonial.logo.alt}
              width={testimonial.logo.width}
              height={testimonial.logo.height}
              sizes="80px"
              className="h-15 w-20 shrink-0 rounded-sm object-contain"
            />
            <span className="min-w-0">
              <span className="text-ink block font-bold">
                {testimonial.brand ?? testimonial.name}
              </span>
              <span className="text-ink-faint mt-1 block text-[0.8rem]">
                {testimonial.name}
              </span>
            </span>
          </ToggleButton>
        ))}
      </div>

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex items-start">{children}</div>
      </div>

      <div className="sr-only">
        <div className="flex h-1.5 w-24 gap-1" aria-hidden="true">
          {Array.from({ length: testimonials.length }, (_, index) => (
            <span
              key={index}
              className={cn(
                'h-full flex-1 rounded-full border transition-colors',
                index === activeIndex
                  ? 'border-brand bg-brand'
                  : 'border-hairline bg-card',
              )}
            />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Testimonial {activeIndex + 1} of {testimonials.length}
        </p>
      </div>
    </div>
  )
}
