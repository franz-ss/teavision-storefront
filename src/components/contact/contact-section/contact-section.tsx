import { Mail, Phone } from 'lucide-react'

import { Eyebrow, Section } from '@/components/ui'
import type { ContactActionResult } from '@/lib/contact/types'

import { ContactSectionForm } from '../contact-section-form'

type ContactSectionProps = {
  action: (formData: FormData) => Promise<ContactActionResult>
}

const CONTACT_METHODS = [
  {
    label: 'Call us',
    value: '1300 729 617',
    href: 'tel:1300729617',
    icon: Phone,
  },
  {
    label: 'Email',
    value: 'info@teavision.com.au',
    href: 'mailto:info@teavision.com.au',
    icon: Mail,
  },
] as const

export function ContactSection({ action }: ContactSectionProps) {
  return (
    <Section.Root id="need-help" tone="inverse">
      <Section.Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <Eyebrow tone="gold">Let the experts grow your business</Eyebrow>
          <h2 className="type-heading-01 mt-4 text-paper">
            Speak with our ingredients experts.
          </h2>
          <p className="type-lede mt-4 max-w-[42ch] text-paper/80">
            Our tea masters, naturopaths and supply-chain specialists are on
            hand to source the right ingredients at the right price for your
            business.
          </p>
          <div className="mt-9 flex flex-col gap-5">
            {CONTACT_METHODS.map((method) => {
              const Icon = method.icon

              return (
                <a
                  key={method.href}
                  href={method.href}
                  className="group flex items-center gap-3.5 focus-visible:ring-ring rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="type-mono-meta block text-paper/60">
                      {method.label}
                    </span>
                    <span className="block font-display text-[1.15rem] text-paper transition-colors group-hover:text-gold">
                      {method.value}
                    </span>
                  </span>
                </a>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-hairline-2 bg-card p-7 text-ink">
          <ContactSectionForm action={action} />
        </div>
      </Section.Container>
    </Section.Root>
  )
}
