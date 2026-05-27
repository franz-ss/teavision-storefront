import type { SVGProps } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'

import type { IconName } from '../_lib/page-data'

const iconClassName = 'h-5 w-5'

const svgProps = {
  className: iconClassName,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
} satisfies SVGProps<SVGSVGElement>

export function Icon({ name }: { name: IconName }) {
  switch (name) {
    case 'phone':
      return (
        <Phone className={iconClassName} aria-hidden="true" strokeWidth={1.8} />
      )
    case 'mail':
      return (
        <Mail className={iconClassName} aria-hidden="true" strokeWidth={1.8} />
      )
    case 'pin':
      return (
        <MapPin
          className={iconClassName}
          aria-hidden="true"
          strokeWidth={1.8}
        />
      )
    case 'youtube':
      return (
        <svg {...svgProps}>
          <path
            d="M4.5 8.5c.25-1.25 1-1.75 2.25-1.9C8 6.5 10 6.5 12 6.5s4 0 5.25.1c1.25.15 2 .65 2.25 1.9.15.8.25 1.9.25 3.5s-.1 2.7-.25 3.5c-.25 1.25-1 1.75-2.25 1.9-1.25.1-3.25.1-5.25.1s-4 0-5.25-.1c-1.25-.15-2-.65-2.25-1.9-.15-.8-.25-1.9-.25-3.5s.1-2.7.25-3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="m10.5 9.75 4 2.25-4 2.25v-4.5Z" fill="currentColor" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...svgProps}>
          <path
            d="M8.5 4.75h7A3.75 3.75 0 0 1 19.25 8.5v7a3.75 3.75 0 0 1-3.75 3.75h-7a3.75 3.75 0 0 1-3.75-3.75v-7A3.75 3.75 0 0 1 8.5 4.75Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M16.4 7.6h.01" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...svgProps}>
          <path
            d="M14 8.25h2V5.5h-2.5c-2.25 0-3.5 1.35-3.5 3.6v1.65H8v2.75h2v5h3v-5h2.25l.5-2.75H13V9.1c0-.55.35-.85 1-.85Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg {...svgProps}>
          <path
            d="M5.5 19.25 6.4 16.5A7.25 7.25 0 1 1 9 18.8l-3.5.45Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.75 8.75c.35 2.6 1.9 4.15 4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )
  }
}
