import Image from 'next/image'

import { Section } from '@/components/ui'

import { TESTIMONIALS } from '../content'
import { SectionIntro } from '../section-intro'

export function Testimonials() {
  return (
    <Section.Root tone="sunken">
      <Section.Container>
        <SectionIntro
          title="Teavision Testimonials"
          copy="We’re proud to be the trusted tea supplier for Australia’s biggest and most loved brands. Our clients value our ability to source fresh, organic ingredients and provide flexible solutions for bulk tea bags, loose tea in bulk, and custom blends."
        />
        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <li
              key={testimonial.name}
              className="border-default bg-surface shadow-1 grid gap-6 rounded-md border p-5 md:grid-cols-4 lg:grid-cols-1"
            >
              <Image
                src={testimonial.logo.src}
                alt={testimonial.logo.alt}
                width={testimonial.logo.width}
                height={testimonial.logo.height}
                sizes="(min-width: 1024px) 15vw, 120px"
                className="bg-canvas h-28 w-28 rounded-md object-contain p-3"
              />
              <div className="md:col-span-3 lg:col-span-1">
                <p className="type-body-sm text-muted">{testimonial.quote}</p>
                <h3 className="type-heading-05 text-strong mt-6">
                  {testimonial.name}
                </h3>
                <p className="type-body-sm text-muted mt-1">
                  {testimonial.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section.Container>
    </Section.Root>
  )
}
