'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

export const SEARCHANISE_READY_EVENT = 'teavision:searchanise-ready'
export const SEARCHANISE_FAILED_EVENT = 'teavision:searchanise-failed'

type SearchaniseStateWindow = Window & {
  __TEAVISION_SEARCHANISE_FAILED__?: boolean
  __TEAVISION_SEARCHANISE_READY__?: boolean
}

type SearchaniseScriptLoaderProps = {
  apiKey: string
}

const SEARCHANISE_SKIP_PATHS = [
  '/search',
  '/pages/search-results',
  '/pages/search-results-page',
]

const SEARCHANISE_STICKY_SEARCH_SELECTORS =
  '.snize-sticky-searchbox, #snize-modal-sticky-searchbox'

function shouldSkipSearchaniseScript(pathname: string): boolean {
  return SEARCHANISE_SKIP_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

function getSearchaniseWindow(): SearchaniseStateWindow {
  return window as SearchaniseStateWindow
}

function dispatchSearchaniseEvent(eventName: string) {
  window.dispatchEvent(new Event(eventName))
}

function markSearchaniseReady() {
  const searchaniseWindow = getSearchaniseWindow()

  searchaniseWindow.__TEAVISION_SEARCHANISE_READY__ = true
  searchaniseWindow.__TEAVISION_SEARCHANISE_FAILED__ = false
  dispatchSearchaniseEvent(SEARCHANISE_READY_EVENT)
}

function markSearchaniseFailed() {
  const searchaniseWindow = getSearchaniseWindow()

  searchaniseWindow.__TEAVISION_SEARCHANISE_FAILED__ = true
  dispatchSearchaniseEvent(SEARCHANISE_FAILED_EVENT)
}

function removeSearchaniseStickySearch() {
  document
    .querySelectorAll(SEARCHANISE_STICKY_SEARCH_SELECTORS)
    .forEach((element) => element.remove())
}

export function isSearchaniseReady(): boolean {
  if (typeof window === 'undefined') return false

  return getSearchaniseWindow().__TEAVISION_SEARCHANISE_READY__ === true
}

export function isSearchaniseFailed(): boolean {
  if (typeof window === 'undefined') return false

  return getSearchaniseWindow().__TEAVISION_SEARCHANISE_FAILED__ === true
}

export function SearchaniseScriptLoader({
  apiKey,
}: SearchaniseScriptLoaderProps) {
  const pathname = usePathname()
  const shouldLoadScript = !shouldSkipSearchaniseScript(pathname)

  useEffect(() => {
    removeSearchaniseStickySearch()

    const observer = new MutationObserver(removeSearchaniseStickySearch)

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoadScript) return

    document.addEventListener('Searchanise.Loaded', markSearchaniseReady)

    return () => {
      document.removeEventListener('Searchanise.Loaded', markSearchaniseReady)
    }
  }, [shouldLoadScript])

  if (!shouldLoadScript) return null

  return (
    <Script
      id="searchanise-shopify-init"
      src={`https://searchserverapi.com/widgets/shopify/init.js?a=${encodeURIComponent(apiKey)}`}
      strategy="afterInteractive"
      onReady={markSearchaniseReady}
      onError={markSearchaniseFailed}
    />
  )
}
