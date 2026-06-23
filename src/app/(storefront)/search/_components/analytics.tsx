'use client'

import { useEffect } from 'react'

import { dispatchClientAnalyticsEvent } from '@/lib/analytics/client'
import { createSearchEvent } from '@/lib/analytics/events'

type SearchAnalyticsProps = {
  query: string
  resultCount: number
}

export function SearchAnalytics({ query, resultCount }: SearchAnalyticsProps) {
  useEffect(() => {
    if (!query) return

    void dispatchClientAnalyticsEvent(
      createSearchEvent({
        query,
        resultCount,
      }),
    )
  }, [query, resultCount])

  return null
}
