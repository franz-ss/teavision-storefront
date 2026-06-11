import { FOOTER_COLUMNS, PAYMENT_METHODS } from '../data'
import { FooterLinkList } from '../link-list'
import type { FooterNewsletterAction } from '../newsletter-form'
import { NewsletterColumn } from '../newsletter-column'
import { PopularSearches } from '../popular-searches'
import { QualityColumn } from '../quality-column'

export type FooterViewProps = {
  newsletterAction: FooterNewsletterAction
}

export function FooterView({ newsletterAction }: FooterViewProps) {
  return (
    <footer role="contentinfo" className="bg-ink text-paper/75 font-sans">
      <div className="max-w-wide px-gutter mx-auto">
        {/* footer-local vertical padding: clamp(50px,7vw,90px) per design .ft__top */}
        <div className="grid grid-cols-1 gap-10 py-[clamp(50px,7vw,90px)] sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
          <QualityColumn />
          {FOOTER_COLUMNS.map((column) => (
            <FooterLinkList
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}
          <NewsletterColumn action={newsletterAction} />
        </div>
        <PopularSearches paymentMethods={PAYMENT_METHODS} />
      </div>
    </footer>
  )
}
