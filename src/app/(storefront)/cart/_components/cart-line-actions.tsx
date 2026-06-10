'use client'

import { useActionState, useEffect } from 'react'
import { Minus, Plus } from 'lucide-react'

import { Button, IconButton } from '@/components/ui'
import { cartLineFormAction, type CartLineFormState } from '@/lib/cart/actions'
import { CART_CHANGED_EVENT } from '@/lib/cart/events'
import { clampQuantity } from '@/lib/shopify/quantity-rules'

const INITIAL_CART_LINE_FORM_STATE: CartLineFormState = {
  message: null,
}

type CartLineActionsProps = {
  lineId: string
  maximumQuantity?: number
  minimumQuantity?: number
  productTitle: string
  quantity: number
  quantityIncrement?: number
  action?: typeof cartLineFormAction
}

export function CartLineActions({
  lineId,
  maximumQuantity,
  minimumQuantity = 1,
  productTitle,
  quantity,
  quantityIncrement = 1,
  action = cartLineFormAction,
}: CartLineActionsProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_CART_LINE_FORM_STATE,
  )
  const normalizedQuantity = clampQuantity({
    maximumQuantity,
    minimumQuantity,
    quantityIncrement,
    value: quantity,
  })
  const decreasedQuantity = clampQuantity({
    maximumQuantity,
    minimumQuantity,
    quantityIncrement,
    value: normalizedQuantity - quantityIncrement,
  })
  const increasedQuantity = clampQuantity({
    maximumQuantity,
    minimumQuantity,
    quantityIncrement,
    value: normalizedQuantity + quantityIncrement,
  })
  const canDecrease = decreasedQuantity < normalizedQuantity
  const canIncrease = increasedQuantity > normalizedQuantity

  useEffect(() => {
    if (!state.cartChanged) return

    window.dispatchEvent(new Event(CART_CHANGED_EVENT))
  }, [state.cartChanged])

  return (
    <>
      {/* Pill quantity stepper */}
      <div className="inline-flex items-center rounded-full border border-hairline">
        <form action={formAction}>
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="lineId" value={lineId} />
          <input type="hidden" name="quantity" value={decreasedQuantity} />
          <IconButton
            type="submit"
            variant="ghost"
            disabled={!canDecrease || isPending}
            aria-busy={isPending || undefined}
            aria-label={`Decrease quantity of ${productTitle}`}
            className="size-11 text-ink-soft hover:text-brand rounded-full"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </IconButton>
        </form>
        <span
          className="min-w-7 text-center font-mono text-[13px] tabular-nums"
          role="status"
          aria-live="polite"
        >
          {quantity}
        </span>
        <form action={formAction}>
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="lineId" value={lineId} />
          <input type="hidden" name="quantity" value={increasedQuantity} />
          <IconButton
            type="submit"
            variant="ghost"
            disabled={!canIncrease || isPending}
            aria-busy={isPending || undefined}
            aria-label={`Increase quantity of ${productTitle}`}
            className="size-11 text-ink-soft hover:text-brand rounded-full"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </IconButton>
        </form>
      </div>

      {/* Remove link */}
      <form action={formAction}>
        <input type="hidden" name="intent" value="remove" />
        <input type="hidden" name="lineId" value={lineId} />
        <Button
          variant="ghost"
          size="sm"
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          aria-label={`Remove ${productTitle} from cart`}
        >
          Remove
        </Button>
      </form>

      {state.message ? (
        <p className="type-caption text-danger" role="alert">
          {state.message}
        </p>
      ) : null}
    </>
  )
}
