import type { Metadata } from 'next'
import { Caveat, Hanken_Grotesk, Space_Mono, Spectral } from 'next/font/google'

import { withNoindexRobots } from '@/lib/seo/noindex'
import { SITE_URL } from '@/lib/seo/site-url'
import { cn } from '@/lib/utils'

import './globals.css'

const spectral = Spectral({
  weight: ['400', '500'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-spectral',
  display: 'optional',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
  display: 'optional',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'optional',
  // Critical above-the-fold chrome (header utility bar, footer, mega panels,
  // cart badge) — MUST be preloaded. Without it, `optional` misses its window
  // on first paint and locks the fallback monospace in until a manual refresh.
  // preload: false here was the original bug. (next/font emits this preload as
  // an HTTP Link response header, not a <head> tag.)
  preload: true,
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'optional',
  preload: false,
})

export const metadata: Metadata = withNoindexRobots({
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | Teavision',
    default: "Teavision — Australia's #1 Tea Supplier",
  },
  description:
    'Bulk wholesale tea, herbs, and spices for cafes, restaurants, and retailers.',
  openGraph: {
    type: 'website',
    siteName: 'Teavision',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU">
      <body
        className={cn(
          spectral.variable,
          hankenGrotesk.variable,
          spaceMono.variable,
          caveat.variable,
        )}
      >
        {children}
      </body>
    </html>
  )
}
