import { CONTACT_LINKS } from '../data'
import { MailIcon, PhoneIcon } from '../icons'
import {
  FooterNewsletterForm,
  type FooterNewsletterAction,
} from '../newsletter-form'
import { FooterTextLink } from '../text-link'

export function NewsletterColumn({
  action,
}: {
  action: FooterNewsletterAction
}) {
  const phoneLink = CONTACT_LINKS.find((link) => link.kind === 'phone')
  const emailLink = CONTACT_LINKS.find((link) => link.kind === 'email')

  return (
    <div>
      <h3 className="mb-4.5 font-mono text-[10.5px] tracking-[0.16em] uppercase text-gold">
        Keep in Touch
      </h3>
      <p className="text-[0.95rem] text-paper/75 leading-normal">
        Market trends, new lines and exclusive wholesale offers — monthly.
      </p>
      <FooterNewsletterForm action={action} />
      <div className="mt-5 flex flex-col gap-2 font-mono text-[12px]">
        {phoneLink ? (
          <p className="flex items-center gap-2">
            <PhoneIcon />
            <FooterTextLink {...phoneLink} />
          </p>
        ) : null}
        {emailLink ? (
          <p className="flex items-center gap-2">
            <MailIcon />
            <FooterTextLink {...emailLink} />
          </p>
        ) : null}
      </div>
    </div>
  )
}
