import { Suspense } from 'react'

import { BlogLoadingSkeleton, Hero } from '@/components/blog'

import { HeroSlot } from './hero-slot'
import { ListingContent } from './listing-content'
import type { ListingProps } from '../_lib/types'

export function ListingPage(props: ListingProps) {
  return (
    <>
      <Suspense fallback={<Hero headingLevel="p" preload={false} />}>
        <HeroSlot params={props.params} searchParams={props.searchParams} />
      </Suspense>

      <Suspense
        fallback={<BlogLoadingSkeleton includeFeatured articleCount={6} />}
      >
        <ListingContent
          params={props.params}
          searchParams={props.searchParams}
        />
      </Suspense>
    </>
  )
}
