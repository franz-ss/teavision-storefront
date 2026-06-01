import { FooterTextLink, MENU_LINK_CLASS } from '../text-link'
import type { FooterColumn } from '../types'

export function FooterLinkList({ title, links }: FooterColumn) {
  return (
    <nav aria-label={title}>
      <h3 className="text-footer-muted mb-4 font-sans text-base leading-[1.4] font-semibold">
        {title}
      </h3>
      <ul className="flex flex-col gap-[15.5px]" role="list">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <FooterTextLink {...link} className={MENU_LINK_CLASS} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
