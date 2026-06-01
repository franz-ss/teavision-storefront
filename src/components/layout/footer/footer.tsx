import { sendNewsletterSignupFormAction } from '@/lib/contact/actions'

import { FooterView } from './view'

export function Footer() {
  return <FooterView newsletterAction={sendNewsletterSignupFormAction} />
}
