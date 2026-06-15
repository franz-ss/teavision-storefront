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
      <Section.Container variant="compact">
        <p className="type-body-sm text-ink-soft">
          {COMPLIANCE_NOTICE_LEAD}
          <Link
            href={COMPLIANCE_NOTICE_LINK_HREF}
            className="text-brand hover:text-brand-deep underline underline-offset-2"
          >
            {COMPLIANCE_NOTICE_LINK_LABEL}
          </Link>
        </p>

        <div className="mt-12 space-y-12">
          {page.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="type-heading-03 text-ink">{section.heading}</h2>
              <p className="type-body text-ink-soft mt-3">
                {section.description}
              </p>

              <div className="mt-5 space-y-6">
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
          ))}

          {page.jurisdiction ? (
            <p className="type-body-sm text-ink-soft">{page.jurisdiction}</p>
          ) : null}
        </div>
      </Section.Container>
    </Section.Root>
  )
}
