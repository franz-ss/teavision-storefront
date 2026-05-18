import { Accordion, Section } from '@/components/ui'

import { FAQS } from './custom-tea-blends-data'

export function FaqSection() {
  return (
    <Section.Root tone="surface">
      <Section.Container variant="compact">
        <Section.Intro title="FAQs" />
        <Accordion
          className="mt-8"
          items={FAQS.map((faq, index) => ({
            id: faq.title,
            title: faq.title,
            content: <p>{faq.description}</p>,
            defaultOpen: index === 0,
          }))}
        />
      </Section.Container>
    </Section.Root>
  )
}
