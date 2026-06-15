import { Eyebrow, Section } from '@/components/ui'

import { FACTORS } from '../_lib/data'

export function FactorsSection() {
  return (
    <Section.Root tone="sunken">
      <Section.Container>
        <div className="max-w-prose">
          <Eyebrow>{FACTORS.eyebrow}</Eyebrow>
          <h2 className="type-heading-02 text-ink mt-4 text-balance">
            {FACTORS.title}
          </h2>
          <div className="type-body-lg text-ink-soft mt-6 space-y-4">
            {FACTORS.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="type-body-lg text-ink mt-6 font-medium">
            {FACTORS.bridge}
          </p>
        </div>

        <dl className="border-hairline mt-10 border-t">
          {FACTORS.items.map((item) => (
            <div
              key={item.label}
              className="border-hairline grid gap-2 border-b py-6 md:grid-cols-[10rem_1fr] md:gap-10"
            >
              <dt className="flex items-baseline gap-4">
                <span className="type-mono-meta text-gold-deep">
                  {item.index}
                </span>
                <span className="type-heading-04 text-ink">{item.label}</span>
              </dt>
              <dd className="type-body-lg text-ink-soft max-w-[62ch]">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      </Section.Container>
    </Section.Root>
  )
}
