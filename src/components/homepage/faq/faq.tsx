import { Plus } from 'lucide-react'

import { Eyebrow, Section, type SectionRootProps } from '@/components/ui'
import { cn } from '@/lib/utils'

import { FAQS, type FaqItem } from '../content'

type FaqProps = Pick<SectionRootProps, 'className' | 'spacing' | 'tone'> & {
  items?: FaqItem[]
  eyebrow?: string | null
  title?: string
  description?: string | null
}

const DEFAULT_DESCRIPTION =
  'You may have questions about sourcing wholesale tea, tea bags, and bulk spices. Below are answers to some of the most common queries from our partners.'

export function Faq({
  className,
  description = DEFAULT_DESCRIPTION,
  eyebrow = 'Questions',
  items = FAQS,
  spacing,
  title = 'Frequently asked questions',
  tone = 'sunken',
}: FaqProps) {
  return (
    <Section.Root tone={tone} spacing={spacing} className={className}>
      <Section.Container variant="base">
        {/* Design constrains FAQ content to 880px (55rem) */}
        <div className="mx-auto max-w-220 text-center">
          {eyebrow ? (
            <Eyebrow rule={false} className="justify-center">
              {eyebrow}
            </Eyebrow>
          ) : null}
          <h2 className={cn('type-heading-01 text-ink', eyebrow && 'mt-4')}>
            {title}
          </h2>
          {description ? (
            <p className="type-lede text-ink-soft mt-4">{description}</p>
          ) : null}
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
                  className="border-hairline text-brand group-open:border-brand group-open:bg-brand group-open:text-paper relative grid size-7.5 shrink-0 place-items-center rounded-full border transition-transform group-open:rotate-45 motion-reduce:transition-none"
                >
                  {/* 16px SVG plus per design .faq__q .ic — a text glyph sits small/off-center */}
                  <Plus className="size-4" strokeWidth={1.8} />
                </span>
              </summary>
              <div className="text-ink-soft pb-6.5">
                <p className="max-w-[60ch] whitespace-pre-line">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
