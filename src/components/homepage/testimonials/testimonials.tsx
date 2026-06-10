import { Eyebrow, Section } from '@/components/ui'

import { TESTIMONIALS } from '../content'
import { TestimonialsSlider } from './testimonials-slider'

export function Testimonials() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        {/* Split range__head layout: eyebrow+h2 left, muted paragraph right */}
        <div className="mb-12.5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow className="mb-4">Testimonials</Eyebrow>
            <h2 className="type-heading-01 text-ink max-w-[16ch]">
              Teavision Testimonials
            </h2>
          </div>
          <p className="text-ink-soft max-w-[34ch]">
            We&apos;re proud to be the trusted tea supplier for Australia&apos;s
            biggest and most loved brands. Our clients value our ability to
            source fresh, organic ingredients and provide flexible solutions for
            bulk tea bags, loose tea in bulk, and custom blends.
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
                {/* Design SVG quote mark: 50x50, gold stroke, opacity .5 */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gold mb-4.5 size-12.5 shrink-0 opacity-50"
                  aria-hidden="true"
                >
                  <path d="M9 7H5a2 2 0 00-2 2v3a2 2 0 002 2h2v3H4m15-10h-4a2 2 0 00-2 2v3a2 2 0 002 2h2v3h-3" />
                </svg>
                <p className="font-display text-ink text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.32]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="text-ink-faint mt-6.5 font-mono text-[12px] tracking-widest uppercase">
                  <cite className="not-italic">
                    {testimonial.name}
                    {testimonial.brand ? ` — ${testimonial.brand}` : null}
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
