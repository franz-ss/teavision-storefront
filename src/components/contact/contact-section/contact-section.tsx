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
          <h2 className="type-heading-01 text-paper mt-4">
            Speak with our ingredients experts.
          </h2>
          <p className="type-lede text-paper/80 mt-4 max-w-[42ch]">
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
                  className="group focus-visible:ring-ring flex items-center gap-3.5 rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span className="bg-brand-tint text-brand grid h-11 w-11 shrink-0 place-items-center rounded-full">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="type-mono-meta text-paper/60 block">
                      {method.label}
                    </span>
                    <span className="font-display text-paper group-hover:text-gold block text-[1.15rem] transition-colors">
                      {method.value}
                    </span>
                  </span>
                </a>
              )
            })}
          </div>
        </div>

        <div className="border-hairline-2 bg-card text-ink rounded-lg border p-7">
          <ContactSectionForm action={action} />
        </div>
      </Section.Container>
    </Section.Root>
  )
}
