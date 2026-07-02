import Image from 'next/image'

import { Eyebrow, Section } from '@/components/ui'
import type { HomepageContent } from '@/lib/sanity/home-page'

import { TESTIMONIALS_FIXTURE } from '../content'
import { TestimonialsSlider } from './testimonials-slider'

export type TestimonialsProps = {
  intro?: HomepageContent['testimonials']['intro']
  items?: HomepageContent['testimonials']['items']
}

export function Testimonials({
  intro = TESTIMONIALS_FIXTURE.intro,
  items = TESTIMONIALS_FIXTURE.items,
}: TestimonialsProps = {}) {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <div className="mx-auto max-w-3xl text-center">
          {intro.eyebrow && (
            <Eyebrow className="mb-4 justify-center">{intro.eyebrow}</Eyebrow>
          )}
          <h2 className="type-heading-01 text-ink">{intro.title}</h2>
          {intro.copy && <p className="text-ink-soft mt-4">{intro.copy}</p>}
        </div>

        <TestimonialsSlider slideCount={items.length}>
          {items.map((testimonial) => (
            <div
              key={testimonial.name}
              className="min-w-0 shrink-0 grow-0 basis-full pl-4"
              role="group"
              aria-roledescription="slide"
              aria-label={`${testimonial.name} testimonial`}
            >
              <article className="border-hairline-2 bg-card shadow-1 mx-auto max-w-5xl rounded-lg border p-5 sm:p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-[9rem_1fr] md:gap-9">
                  <div className="flex items-center justify-between gap-4 md:flex-col md:items-start md:justify-start">
                    <Image
                      src={testimonial.logo.src}
                      alt={testimonial.logo.alt}
                      width={testimonial.logo.width}
                      height={testimonial.logo.height}
                      sizes="(min-width: 768px) 128px, 96px"
                      className="border-hairline bg-paper size-24 shrink-0 rounded-md border object-contain md:size-32"
                    />
                    <span className="type-eyebrow text-brand shrink-0">
                      Partner
                    </span>
                  </div>

                  <blockquote>
                    <div
                      className="text-gold font-display mb-4 text-6xl leading-none opacity-60"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </div>
                    <p className="text-ink-soft text-base leading-relaxed md:text-[1.04rem]">
                      {testimonial.quote}
                    </p>
                    <footer className="border-hairline mt-6 border-t pt-4">
                      <cite className="not-italic">
                        <span className="font-display text-ink block text-[1.25rem] leading-tight">
                          {testimonial.name}
                        </span>
                        <span className="text-ink-faint mt-1 block text-sm">
                          {testimonial.role ? `${testimonial.role}` : null}
                          {testimonial.role && testimonial.brand ? ', ' : null}
                          {testimonial.brand ?? null}
                        </span>
                      </cite>
                    </footer>
                  </blockquote>
                </div>
              </article>
            </div>
          ))}
        </TestimonialsSlider>
      </Section.Container>
    </Section.Root>
  )
}
