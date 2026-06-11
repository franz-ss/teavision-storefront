import type { PaymentMethod } from '../types'

// Design .ft__pay span: padding 5px 9px, border rgba(255,255,255,.16), radius 5px,
// font-size 9.5px, letter-spacing .08em, color inherits .ft (~paper/78)
export function PaymentMark({ method }: { method: PaymentMethod }) {
  return (
    <span
      className="border-paper/16 text-paper/75 inline-flex items-center justify-center rounded-[5px] border px-2.25 py-1.25 font-mono text-[9.5px] tracking-[0.08em] uppercase"
    >
      {method.label}
    </span>
  )
}
