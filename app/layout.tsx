import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://teavision.com.au'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  )
}
