import { Footer, Header } from '@/components/layout'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <a
        href="#main-content"
        className="type-label bg-action-primary text-action-primary-text focus-visible:ring-ring sr-only z-60 rounded-md px-4 py-3 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
