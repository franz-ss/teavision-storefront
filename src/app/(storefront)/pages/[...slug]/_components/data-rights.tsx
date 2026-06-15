import { TriangleAlert } from 'lucide-react'

import { Button, Eyebrow, Section } from '@/components/ui'
import { cn } from '@/lib/utils'

import { buildRequestHref, type DataRightsProfile } from '../_lib/data-rights'

export function DataRights({ profile }: { profile: DataRightsProfile }) {
  return (
    <>
      <Section.Root tone="surface">
        <Section.Container>
          <div className="max-w-3xl">
            <Eyebrow>Your data rights</Eyebrow>
            <h2 className="type-heading-02 text-ink mt-4 max-w-[18ch]">
              Control your personal data
            </h2>
            <p className="type-body text-ink-soft mt-4 max-w-[58ch]">
              Choose a request below. Each opens a pre-filled email so our team
              can verify your identity and respond.
            </p>

            <ol className="mt-10 border-t border-hairline">
              {profile.rights.map((right, index) => (
                <li
                  key={right.subject}
                  className="flex flex-col gap-4 border-b border-hairline py-6 sm:flex-row sm:items-start sm:gap-8"
                >
                  <span
                    aria-hidden
                    className="type-mono-meta text-gold-deep sm:pt-1.5"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="type-heading-04 text-ink">{right.title}</h3>
                    <p className="type-body-sm text-ink-soft mt-2 max-w-[48ch]">
                      {right.description}
                    </p>
                    {right.warning ? (
                      <p className="bg-danger-tint text-danger mt-3 flex max-w-[48ch] items-start gap-2 rounded-md p-3">
                        <TriangleAlert
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0"
                        />
                        <span className="type-body-sm">{right.warning}</span>
                      </p>
                    ) : null}
                  </div>
                  <Button
                    href={buildRequestHref(right.subject)}
                    variant={right.variant === 'erasure' ? 'secondary' : 'brand'}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    {right.requestLabel}
                  </Button>
                </li>
              ))}
            </ol>
          </div>
        </Section.Container>
      </Section.Root>

      <Section.Root
        tone="sunken"
        spacing="compact"
        className="border-hairline border-t"
      >
        <Section.Container>
          <Eyebrow>How requests work</Eyebrow>
          <dl
            className={cn(
              'mt-8 grid gap-x-8 gap-y-6',
              'sm:grid-cols-2 lg:grid-cols-3',
            )}
          >
            {profile.process.map((note) => (
              <div key={note.term} className="max-w-[34ch]">
                <dt className="type-heading-05 text-ink">{note.term}</dt>
                <dd className="type-body-sm text-ink-soft mt-2">
                  {note.detail}
                </dd>
              </div>
            ))}
          </dl>
        </Section.Container>
      </Section.Root>
    </>
  )
}
