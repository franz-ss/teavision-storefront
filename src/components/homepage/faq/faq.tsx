import { Plus } from 'lucide-react'

import { Eyebrow, Section } from '@/components/ui'

import { FAQS, type FaqItem } from '../content'

type FaqProps = {
  items?: FaqItem[]
}

export function Faq({ items = FAQS }: FaqProps) {
  return (
    <Section.Root tone="sunken">
      <Section.Container variant="base">
        {/* Design constrains FAQ content to 880px (55rem) */}
        <div className="mx-auto max-w-220 text-center">
          <Eyebrow rule={false} className="justify-center">
            Questions
          </Eyebrow>
          <h2 className="type-heading-01 text-ink mt-4">
            Frequently asked questions
          </h2>
          <p className="type-lede text-ink-soft mt-4">
            You may have questions about sourcing wholesale tea, tea bags, and
            bulk spices. Below are answers to some of the most common queries
            from our partners.
          </p>
        </div>

        <div className="border-hairline mx-auto mt-11 max-w-220 border-b">
          {items.map((faq) => (
            <details
              key={faq.question}
              className="group border-hairline border-t"
            >
              <summary className="focus-visible:ring-ring font-display text-ink hover:text-brand flex cursor-pointer list-none items-center justify-between gap-5 py-6.5 text-[clamp(1.1rem,1.8vw,1.4rem)] transition-colors marker:content-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="border-hairline text-brand group-open:border-brand group-open:bg-brand group-open:text-paper relative grid h-7.5 w-7.5 shrink-0 place-items-center rounded-full border transition-transform group-open:rotate-45 motion-reduce:transition-none"
                >
                  {/* 16px SVG plus per design .faq__q .ic — a text glyph sits small/off-center */}
                  <Plus className="size-4" strokeWidth={1.8} />
                </span>
              </summary>
              <div className="text-ink-soft pb-6.5">
                <p className="max-w-[60ch]">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
