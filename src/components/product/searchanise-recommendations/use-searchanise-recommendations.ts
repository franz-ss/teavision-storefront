'use client'

import { useEffect, useRef, useState } from 'react'

import type { ProductSummary } from '@/lib/shopify/types'

import { parseSearchaniseProducts } from './searchanise-product-parser'
import {
  isSearchaniseFailed,
  isSearchaniseReady,
  SEARCHANISE_FAILED_EVENT,
  SEARCHANISE_READY_EVENT,
} from './searchanise-script-loader'

export type SearchaniseRenderState =
  | 'waiting'
  | 'rendered'
  | 'fallback'
  | 'empty'

type UseSearchaniseRecommendationsProps = {
  enabled: boolean
  fallbackDelayMs: number
  hasFallback: boolean
  widgetId: string
}

export function useSearchaniseRecommendations({
  enabled,
  fallbackDelayMs,
  hasFallback,
  widgetId,
}: UseSearchaniseRecommendationsProps) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [renderState, setRenderState] =
    useState<SearchaniseRenderState>('waiting')
  const [products, setProducts] = useState<ProductSummary[]>([])

  useEffect(() => {
    if (!enabled) return

    const widget = widgetRef.current
    if (!widget) return
    const searchaniseWidget = widget

    let fallbackTimer: number | null = null
    let observer: MutationObserver | null = null
    let productsKey = ''

    function clearFallbackTimer() {
      if (fallbackTimer === null) return

      window.clearTimeout(fallbackTimer)
      fallbackTimer = null
    }

    function markRenderedIfProductsFound(): boolean {
      const nextProducts = parseSearchaniseProducts(searchaniseWidget)
      if (nextProducts.length === 0) return false

      clearFallbackTimer()
      observer?.disconnect()

      const nextProductsKey = nextProducts
        .map((product) => `${product.id}:${product.handle}`)
        .join('|')

      if (nextProductsKey !== productsKey) {
        productsKey = nextProductsKey
        setProducts(nextProducts)
      }

      setRenderState('rendered')
      return true
    }

    function markFallbackIfEmpty() {
      const nextProducts = parseSearchaniseProducts(searchaniseWidget)
      observer?.disconnect()

      if (nextProducts.length > 0) {
        setProducts(nextProducts)
        setRenderState('rendered')
        return
      }

      if (!hasFallback) {
        setRenderState('empty')
        return
      }

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
      if (!markRenderedIfProductsFound()) {
        startFallbackTimer()
      }
    }

    function handleSearchaniseFailed() {
      markFallbackIfEmpty()
    }

    observer = new MutationObserver(markRenderedIfProductsFound)

    observer.observe(searchaniseWidget, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    if (!markRenderedIfProductsFound()) {
      startFallbackTimer()
    }

    window.addEventListener(SEARCHANISE_READY_EVENT, handleSearchaniseReady)
    window.addEventListener(SEARCHANISE_FAILED_EVENT, handleSearchaniseFailed)

    if (fallbackDelayMs <= 0 || isSearchaniseReady()) {
      handleSearchaniseReady()
    } else if (isSearchaniseFailed()) {
      handleSearchaniseFailed()
    }

    return () => {
      clearFallbackTimer()
      observer?.disconnect()
      window.removeEventListener(
        SEARCHANISE_READY_EVENT,
        handleSearchaniseReady,
      )
      window.removeEventListener(
        SEARCHANISE_FAILED_EVENT,
        handleSearchaniseFailed,
      )
    }
  }, [enabled, fallbackDelayMs, hasFallback, widgetId])

  return { products, renderState, widgetRef }
}
