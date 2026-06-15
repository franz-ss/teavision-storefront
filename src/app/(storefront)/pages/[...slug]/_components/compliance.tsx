import Link from 'next/link'

import { Button, FormLabel, Section, TextInput } from '@/components/ui'

import {
  COMPLIANCE_EMAIL_CONFIRM_LABEL,
  COMPLIANCE_NOTICE_LEAD,
  COMPLIANCE_NOTICE_LINK_HREF,
  COMPLIANCE_NOTICE_LINK_LABEL,
  type CompliancePage,
} from '../_lib/compliance'

export function Compliance({ page }: { page: CompliancePage }) {
  return (
    <Section.Root tone="surface">
      <Section.Container>
        <p className="type-body-sm text-ink-soft max-w-[68ch]">
          {COMPLIANCE_NOTICE_LEAD}
          <Link
            href={COMPLIANCE_NOTICE_LINK_HREF}
            className="text-brand hover:text-brand-deep underline underline-offset-2"
          >
            {COMPLIANCE_NOTICE_LINK_LABEL}
          </Link>
        </p>

        <div className="border-hairline mt-10 border-t">
          {page.sections.map((section) => (
            <div
              key={section.heading}
              className="border-hairline grid gap-x-12 gap-y-6 border-b py-10 lg:grid-cols-12"
            >
              <div className="lg:col-span-4">
                <h2 className="type-heading-03 text-ink text-balance">
                  {section.heading}
                </h2>
              </div>
              <div className="lg:col-span-8 lg:col-start-5">
                <p className="type-body-lg text-ink-soft max-w-[60ch]">
                  {section.description}
                </p>

                <div className="mt-6 space-y-6">
                  {section.actions.map((action) => (
                    <div key={action.label} className="space-y-2.5">
                      <Button variant="secondary" size="sm" type="button">
                        {action.label}
                      </Button>
                      <FormLabel className="max-w-sm">
                        {COMPLIANCE_EMAIL_CONFIRM_LABEL}
                        <TextInput
                          type="email"
                          className="mt-1.5"
                          aria-label={`${COMPLIANCE_EMAIL_CONFIRM_LABEL} for ${action.label}`}
                        />
                      </FormLabel>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {page.jurisdiction ? (
          <p className="type-body-sm text-ink-soft mt-10 max-w-[68ch]">
            {page.jurisdiction}
          </p>
        ) : null}
      </Section.Container>
    </Section.Root>
  )
}
