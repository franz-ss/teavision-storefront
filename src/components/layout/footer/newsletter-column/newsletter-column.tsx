import { CONTACT_LINKS } from '../data'
import { MailIcon, PhoneIcon } from '../icons'
import {
  FooterNewsletterForm,
  type FooterNewsletterAction,
} from '../newsletter-form'
import { FooterTextLink, MENU_LINK_CLASS } from '../text-link'

export function NewsletterColumn({
  action,
}: {
  action: FooterNewsletterAction
}) {
  const phoneLink = CONTACT_LINKS.find((link) => link.kind === 'phone')
  const emailLink = CONTACT_LINKS.find((link) => link.kind === 'email')

  return (
    <div>
      <h3 className="text-footer-muted mb-4 font-sans text-base leading-[1.4] font-semibold">
        Keep in Touch
      </h3>
      <p className="text-on-brand text-base leading-[1.4]">
        Sign up for exclusive offers, market trends and new product alerts.
      </p>
      <FooterNewsletterForm action={action} />
      <div className="mt-6 flex flex-col gap-4">
        {phoneLink ? (
          <p className="text-on-brand flex items-center gap-2 text-base leading-[1.4]">
            <PhoneIcon />
            <FooterTextLink {...phoneLink} className={MENU_LINK_CLASS} />
          </p>
        ) : null}
        {emailLink ? (
          <p className="text-on-brand flex items-center gap-2 text-base leading-[1.4]">
            <MailIcon />
            <FooterTextLink {...emailLink} className={MENU_LINK_CLASS} />
          </p>
        ) : null}
      </div>
    </div>
  )
}
