import { FOOTER_COLUMNS, PAYMENT_METHODS } from '../data'
import { FooterLinkList } from '../link-list'
import type { FooterNewsletterAction } from '../newsletter-form'
import { NewsletterColumn } from '../newsletter-column'
import { PaymentMark } from '../payment-mark'
import { QualityColumn } from '../quality-column'
import { PopularSearches } from '../popular-searches'

export type FooterViewProps = {
  newsletterAction: FooterNewsletterAction
}

export function FooterView({ newsletterAction }: FooterViewProps) {
  return (
    <footer role="contentinfo" className="bg-ink text-paper/75 font-sans">
      <div className="max-w-wide mx-auto px-gutter">
        {/* footer-local vertical padding: clamp(50px,7vw,90px) per design .ft__top */}
        <div
          className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]"
          style={{ paddingBlock: 'clamp(50px,7vw,90px)' }}
        >
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
        {/* border opacity 0.12 per design .ft__bottom: rgba(255,255,255,.12) */}
        <div className="border-t border-paper/12 py-5.5">
          <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
            <ul
              className="order-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.06em] lg:order-1"
              role="list"
            >
              <li>
                {/* plain span, not a link — design has copyright as plain text */}
                {/* static year: new Date() breaks Next 16 prerendering (next-prerender-current-time) */}
                <span className="text-paper/75">&copy; 2026 Teavision</span>
              </li>
              <li aria-hidden="true" className="text-paper/30">
                ·
              </li>
              <li>
                <a
                  href="#popular-searches"
                  className="text-paper/75 underline-offset-2 transition-colors hover:text-paper focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
                >
                  Popular Searches
                </a>
              </li>
            </ul>
            {/* payment gap: 7px per design .ft__pay */}
            <ul
              className="order-1 flex flex-wrap lg:order-2"
              style={{ gap: '7px' }}
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

      {/* Popular Searches SEO link block — hidden below the footer bar */}
      <div id="popular-searches" className="sr-only">
        <div className="max-w-wide mx-auto px-gutter pb-8">
          <PopularSearches />
        </div>
      </div>
    </footer>
  )
}
