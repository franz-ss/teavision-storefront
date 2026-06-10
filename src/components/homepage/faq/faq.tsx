import { Eyebrow, Section } from '@/components/ui'

import { FAQS } from '../content'

export function Faq() {
  return (
    <Section.Root tone="sunken">
      <Section.Container variant="base">
        <div className="mx-auto max-w-base text-center">
          <Eyebrow rule={false} className="justify-center">
            Questions
          </Eyebrow>
          <h2 className="type-heading-01 mt-4 text-ink">Frequently asked.</h2>
          <p className="type-lede mt-4 text-ink-soft">
            You may have questions about sourcing wholesale tea, tea bags, and
            bulk spices. Below are answers to some of the most common queries
            from our partners.
          </p>
        </div>

        <div className="mt-11 border-b border-hairline">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group border-t border-hairline">
              <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-5 py-6.5 font-display text-[clamp(1.1rem,1.8vw,1.4rem)] text-ink transition-colors marker:content-none hover:text-brand focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="relative grid h-7.5 w-7.5 shrink-0 place-items-center rounded-full border border-hairline text-brand transition-transform group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-paper motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <div className="pb-6.5 text-ink-soft">
                <p className="max-w-[60ch]">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
