import { Section } from '@/components/ui'

import { FAQS } from '../content'

export function Faq() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <Section.Intro
          title="Frequently asked questions"
          copy="You may have questions about sourcing wholesale tea, tea bags, and bulk spices. Below are answers to some of the most common queries from our partners."
        />
        <div className="mx-auto mt-10 max-w-prose divide-y">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group bg-surface">
              <summary className="type-label text-strong focus-visible:ring-ring flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 focus-visible:ring-2 focus-visible:outline-none">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="border-brand h-2 w-2 rotate-45 border-r border-b transition-transform group-open:rotate-225"
                />
              </summary>
              <p className="type-body-sm text-muted px-4 pb-5">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
