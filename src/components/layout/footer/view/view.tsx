import { FOOTER_COLUMNS, PAYMENT_METHODS } from '../data'
import { FooterTextLink } from '../text-link'
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
    <footer role="contentinfo" className="bg-ink text-paper/75 font-sans">
      <div className="max-w-wide mx-auto px-gutter">
        <div className="grid grid-cols-1 gap-10 py-section lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
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
        <div className="border-t border-paper/10 py-5.5">
          <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
            <ul
              className="order-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.06em] lg:order-1"
              role="list"
            >
              <li>
                <FooterTextLink
                  href="/"
                  label="© 2026 Teavision · 100% Australian owned &amp; operated"
                />
              </li>
              <li aria-hidden="true" className="text-paper/30">
                ·
              </li>
              <li>
                <FooterTextLink href="/search" label="Popular Searches" />
              </li>
            </ul>
            <ul
              className="order-1 flex flex-wrap gap-1 lg:order-2"
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
      </div>
    </footer>
  )
}
