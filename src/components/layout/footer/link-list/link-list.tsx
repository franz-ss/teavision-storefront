import { FooterTextLink } from '../text-link'
import type { FooterColumn } from '../types'

export function FooterLinkList({ title, links }: FooterColumn) {
  return (
    <nav aria-label={title}>
      <h3 className="mb-4.5 font-mono text-[10.5px] tracking-[0.16em] uppercase text-gold">
        {title}
      </h3>
      <ul className="flex flex-col gap-3" role="list">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <FooterTextLink {...link} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
