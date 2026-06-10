import type { PaymentMethod } from '../types'

export function PaymentMark({ method }: { method: PaymentMethod }) {
  return (
    <span className="inline-flex items-center justify-center rounded-[5px] border border-paper/15 px-2 py-1 font-mono text-[9.5px] tracking-[0.04em] uppercase text-paper/60">
      {method.label}
    </span>
  )
}
