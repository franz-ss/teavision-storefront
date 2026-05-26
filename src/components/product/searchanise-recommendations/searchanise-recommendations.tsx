'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
  isSearchaniseFailed,
  isSearchaniseReady,
  SEARCHANISE_FAILED_EVENT,
  SEARCHANISE_READY_EVENT,
} from './searchanise-script-loader'

const DEFAULT_WIDGET_ID = '1T8K1Y6Q6G8R3B3'
const DEFAULT_FALLBACK_DELAY_MS = 2500

type SearchaniseRenderState = 'waiting' | 'rendered' | 'fallback'

export type SearchaniseRecommendationsProps = {
  className?: string
  fallback?: ReactNode
  fallbackDelayMs?: number
  widgetId?: string
}

function hasSearchaniseContent(element: HTMLDivElement | null): boolean {
  if (!element) return false

  return (
    element.children.length > 0 || (element.textContent?.trim().length ?? 0) > 0
  )
}

export function SearchaniseRecommendations({
  className,
  fallback,
  fallbackDelayMs = DEFAULT_FALLBACK_DELAY_MS,
  widgetId = DEFAULT_WIDGET_ID,
}: SearchaniseRecommendationsProps) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [renderState, setRenderState] =
    useState<SearchaniseRenderState>('waiting')
  const hasFallback =
    fallback !== undefined && fallback !== null && fallback !== false

  useEffect(() => {
    const widget = widgetRef.current
    if (!widget) return

    let fallbackTimer: number | null = null

    function clearFallbackTimer() {
      if (fallbackTimer === null) return

      window.clearTimeout(fallbackTimer)
      fallbackTimer = null
    }

    function markRenderedIfPopulated() {
      if (!hasSearchaniseContent(widget)) return

      clearFallbackTimer()
      setRenderState('rendered')
    }

    function markFallbackIfEmpty() {
      if (hasSearchaniseContent(widget)) {
        setRenderState('rendered')
        return
      }

      if (!hasFallback) return

      setRenderState('fallback')
    }

    function startFallbackTimer() {
      clearFallbackTimer()

      if (fallbackDelayMs <= 0) {
        markFallbackIfEmpty()
        return
      }

      fallbackTimer = window.setTimeout(markFallbackIfEmpty, fallbackDelayMs)
    }

    function handleSearchaniseReady() {
      markRenderedIfPopulated()
      startFallbackTimer()
    }

    function handleSearchaniseFailed() {
      markFallbackIfEmpty()
    }

    const observer = new MutationObserver(markRenderedIfPopulated)

    observer.observe(widget, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    markRenderedIfPopulated()

    window.addEventListener(SEARCHANISE_READY_EVENT, handleSearchaniseReady)
    window.addEventListener(SEARCHANISE_FAILED_EVENT, handleSearchaniseFailed)

    if (fallbackDelayMs <= 0 || isSearchaniseReady()) {
      handleSearchaniseReady()
    } else if (isSearchaniseFailed()) {
      handleSearchaniseFailed()
    }

    return () => {
      clearFallbackTimer()
      observer.disconnect()
      window.removeEventListener(
        SEARCHANISE_READY_EVENT,
        handleSearchaniseReady,
      )
      window.removeEventListener(
        SEARCHANISE_FAILED_EVENT,
        handleSearchaniseFailed,
      )
    }
  }, [fallbackDelayMs, hasFallback, widgetId])

  return (
    <div
      className={cn('min-w-0', className)}
      data-searchanise-state={renderState}
    >
      <div
        className={cn(renderState === 'fallback' && 'hidden')}
        aria-hidden={renderState === 'fallback'}
      >
        <div
          ref={widgetRef}
          className="searchanise-recommendations"
          id={widgetId}
        />
      </div>

      {renderState === 'fallback' && fallback ? (
        <div data-searchanise-fallback>{fallback}</div>
      ) : null}
    </div>
  )
}
