import Image from 'next/image'

import { Card, Section } from '@/components/ui'

import { TESTIMONIALS } from '../content'
import { TestimonialsSlider } from './testimonials-slider'

export function Testimonials() {
  return (
    <Section.Root tone="sunken">
      <Section.Container>
        <Section.Intro
          align="center"
          title="Trusted by leading Australian brands"
          copy="Clients rely on Teavision for responsive supply, fresh organic ingredients, and flexible solutions across bulk tea bags, loose-leaf supply, and custom blends."
        />

        <TestimonialsSlider slideCount={TESTIMONIALS.length}>
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="min-w-0 shrink-0 grow-0 basis-full pl-4"
              role="group"
              aria-roledescription="slide"
              aria-label={`${testimonial.name} testimonial`}
            >
              <Card
                as="article"
                padding="lg"
                radius="md"
                className="mx-auto max-w-3xl"
              >
                <div className="grid gap-5 md:grid-cols-[9rem_1fr] md:gap-8">
                  <div className="flex items-center justify-between gap-4 md:flex-col md:items-start md:justify-start">
                    <Image
                      src={testimonial.logo.src}
                      alt={testimonial.logo.alt}
                      width={testimonial.logo.width}
                      height={testimonial.logo.height}
                      sizes="(min-width: 768px) 128px, 96px"
                      className="border-default bg-canvas h-24 w-24 shrink-0 rounded-md border object-contain md:h-32 md:w-32"
                    />
                    <span className="type-eyebrow text-brand shrink-0">
                      Partner
                    </span>
                  </div>

                  <blockquote>
                    <p className="type-body text-default">
                      {testimonial.quote}
                    </p>
                    <footer className="border-default mt-5 border-t pt-4">
                      <cite className="not-italic">
                        <span className="type-heading-05 text-strong block">
                          {testimonial.name}
                        </span>
                        <span className="type-body-sm text-muted mt-1 block">
                          {testimonial.role}
                        </span>
                      </cite>
                    </footer>
                  </blockquote>
                </div>
              </Card>
            </div>
          ))}
        </TestimonialsSlider>
      </Section.Container>
    </Section.Root>
  )
}
