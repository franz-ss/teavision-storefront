import type { Metadata } from 'next'
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'

import { withNoindexRobots } from '@/lib/seo/noindex'
import { SITE_URL } from '@/lib/seo/site-url'
import { cn } from '@/lib/utils'

import './globals.css'

const fraunces = Fraunces({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-fraunces',
})

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetBrainsMono = JetBrains_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
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
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          fraunces.variable,
          jetBrainsMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  )
}
