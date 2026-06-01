'use client'

import { useId, useState } from 'react'

import { DisclosureButton } from '@/components/ui'

import type { StoryValue } from '../_lib/data'
import { StoryImage } from './story-image'

type StoryValuesAccordionProps = {
  values: StoryValue[]
}

export function StoryValuesAccordion({ values }: StoryValuesAccordionProps) {
  const accordionId = useId()
  const [openValueId, setOpenValueId] = useState(values[0]?.id ?? '')

  if (values.length === 0) {
    return null
  }

  return (
    <div className="divide-muted/20 divide-y">
      {values.map((value) => {
        const isOpen = openValueId === value.id
        const panelId = `${accordionId}-${value.id}-panel`
        const buttonId = `${accordionId}-${value.id}-button`

        return (
          <div key={value.id} className="bg-surface">
            <h3>
              <DisclosureButton
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenValueId(value.id)}
                className="text-strong group min-h-14 w-full justify-between rounded-none px-4 py-3 text-left"
              >
                <span>{value.title}</span>
                <span
                  aria-hidden="true"
                  className="border-brand h-2 w-2 shrink-0 rotate-45 border-r border-b transition-transform group-aria-expanded:rotate-225"
                />
              </DisclosureButton>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="grid gap-5 px-4 pb-5 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)] md:items-start md:pb-6"
            >
              <p className="type-body text-muted">{value.description}</p>
              <div className="aspect-4/3 overflow-hidden rounded-md">
                <StoryImage
                  image={value.image}
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
