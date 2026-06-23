'use client'

import { useEffect } from 'react'

import { dispatchClientAnalyticsEvent } from '@/lib/analytics/client'
import { createProductViewEvent } from '@/lib/analytics/events'

type ProductViewAnalyticsProps = {
  handle: string
  id: string
  title: string
}

export function ProductViewAnalytics({
  handle,
  id,
  title,
}: ProductViewAnalyticsProps) {
  useEffect(() => {
    void dispatchClientAnalyticsEvent(
      createProductViewEvent({
        handle,
        id,
        title,
      }),
    )
  }, [handle, id, title])

  return null
}
