import { Footer, Header } from '@/components/layout'
import { SearchaniseScriptLoader } from '@/components/product'

const SEARCHANISE_API_KEY = process.env.NEXT_PUBLIC_SEARCHANISE_API_KEY
const SEARCHANISE_ENABLED =
  process.env.NEXT_PUBLIC_SEARCHANISE_ENABLED === 'true'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      {SEARCHANISE_ENABLED && SEARCHANISE_API_KEY ? (
        <SearchaniseScriptLoader apiKey={SEARCHANISE_API_KEY} />
      ) : null}
    </>
  )
}
