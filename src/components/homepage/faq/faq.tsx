import { Accordion, Section } from '@/components/ui'

import { FAQS } from '../content'

export function Faq() {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <Section.Intro
          title="Frequently asked questions"
          copy="You may have questions about sourcing wholesale tea, tea bags, and bulk spices. Below are answers to some of the most common queries from our partners."
        />
        <Accordion
          className="mx-auto mt-10 max-w-prose"
          items={FAQS.map((faq) => ({
            id: faq.question,
            title: faq.question,
            content: <p>{faq.answer}</p>,
          }))}
        />
      </Section.Container>
    </Section.Root>
  )
}
