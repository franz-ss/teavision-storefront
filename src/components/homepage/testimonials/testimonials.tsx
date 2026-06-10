import { Eyebrow, Section } from '@/components/ui'

import { TESTIMONIALS } from '../content'
import { TestimonialsSlider } from './testimonials-slider'

export function Testimonials() {
  return (
    <Section.Root tone="sunken">
      <Section.Container>
        <div className="mx-auto max-w-prose text-center">
          <Eyebrow className="justify-center">Testimonials</Eyebrow>
          <h2 className="type-heading-01 mt-4 text-ink">
            Trusted by leading Australian brands
          </h2>
          <p className="type-lede mt-4 text-ink-soft">
            Clients rely on Teavision for responsive supply, fresh organic
            ingredients, and flexible solutions across bulk tea bags, loose-leaf
            supply, and custom blends.
          </p>
        </div>

        <TestimonialsSlider testimonials={TESTIMONIALS}>
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`${testimonial.name} testimonial`}
            >
              <blockquote className="relative">
                <div
                  className="mb-4 font-display text-[4rem] leading-none text-gold/50"
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <p className="font-display text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.32] text-ink">
                  {testimonial.quote}
                </p>
                <footer className="type-mono-meta mt-6 text-ink-faint">
                  <cite className="not-italic">
                    {testimonial.name} - {testimonial.role}
                  </cite>
                </footer>
              </blockquote>
            </div>
          ))}
        </TestimonialsSlider>
      </Section.Container>
    </Section.Root>
  )
}
