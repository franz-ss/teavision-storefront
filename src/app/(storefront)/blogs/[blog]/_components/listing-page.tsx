import { Suspense } from 'react'

import { Hero } from '@/components/blog'
import { Section } from '@/components/ui'

import { HeroSlot } from './hero-slot'
import { ListingContent } from './listing-content'
import type { ListingProps } from '../_lib/types'

export function ListingPage(props: ListingProps) {
  return (
    <>
      <Suspense fallback={<Hero />}>
        <HeroSlot params={props.params} searchParams={props.searchParams} />
      </Suspense>

      <Suspense
        fallback={
          <Section.Root tone="sunken">
            <Section.Container
              variant="compact"
              className="type-body text-ink-soft"
              aria-live="polite"
            >
              Loading articles…
            </Section.Container>
          </Section.Root>
        }
      >
        <ListingContent
          params={props.params}
          searchParams={props.searchParams}
        />
      </Suspense>
    </>
  )
}
