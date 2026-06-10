import { Accordion, Section } from '@/components/ui'

import { FAQ_ITEMS } from '../_lib/data'

const faqAccordionItems = FAQ_ITEMS.map((item) => ({
  id: item.id,
  title: item.question,
  content: item.answer,
}))

export function FaqSection() {
  return (
    <Section.Root tone="surface">
      <Section.Container variant="base">
        <div className="mb-8 max-w-prose">
          <h2 className="type-heading-01 text-ink">
            Frequently asked questions
          </h2>
          <p className="type-body text-ink-soft mt-4">
            You may have questions about sourcing wholesale tea, tea bags, and
            bulk spices. Below are answers to some of the most common queries
            from our partners.
          </p>
        </div>
        <Accordion items={faqAccordionItems} />
      </Section.Container>
    </Section.Root>
  )
}
