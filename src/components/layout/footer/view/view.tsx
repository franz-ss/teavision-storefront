import { FOOTER_COLUMNS, PAYMENT_METHODS } from '../data'
import { FooterTextLink, BOTTOM_LINK_CLASS } from '../text-link'
import { FooterLinkList } from '../link-list'
import type { FooterNewsletterAction } from '../newsletter-form'
import { NewsletterColumn } from '../newsletter-column'
import { PaymentMark } from '../payment-mark'
import { QualityColumn } from '../quality-column'

export type FooterViewProps = {
  newsletterAction: FooterNewsletterAction
}

export function FooterView({ newsletterAction }: FooterViewProps) {
  return (
    <footer role="contentinfo" className="font-sans">
      <div className="bg-footer text-on-brand">
        <div className="max-w-wide mx-auto px-4 py-8 min-[768px]:py-15 min-[1440px]:px-12">
          <div className="grid grid-cols-1 gap-y-9 min-[767px]:grid-cols-2 min-[767px]:gap-x-8 min-[989px]:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <FooterLinkList
                key={column.title}
                title={column.title}
                links={column.links}
              />
            ))}
            <QualityColumn />
            <NewsletterColumn action={newsletterAction} />
          </div>
        </div>
      </div>
      <div className="bg-footer-bottom text-footer-bottom">
        <div className="max-w-wide mx-auto flex flex-col items-start gap-5 px-4 py-6 min-[989px]:flex-row min-[989px]:items-center min-[989px]:justify-between min-[1440px]:px-12">
          <ul
            className="order-2 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm leading-[1.4] min-[989px]:order-1"
            role="list"
          >
            <li>
              <span>© 2026 </span>
              <FooterTextLink
                href="/"
                label="Teavision"
                className={BOTTOM_LINK_CLASS}
              />
            </li>
            <li aria-hidden="true">|</li>
            <li>
              <FooterTextLink
                href="/search"
                label="Popular Searches"
                className={BOTTOM_LINK_CLASS}
              />
            </li>
          </ul>
          <ul
            className="order-1 flex flex-wrap gap-1 min-[989px]:order-2"
            role="list"
            aria-label="Payment methods"
          >
            {PAYMENT_METHODS.map((method) => (
              <li key={method.label}>
                <PaymentMark method={method} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
