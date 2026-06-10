import { Footer, Header } from '@/components/layout'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="type-label sr-only z-60 rounded-sm border border-hairline bg-paper px-4 py-3 text-ink focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
