'use client'

import { useActionState } from 'react'
import { Minus, Plus } from 'lucide-react'

import { Button, IconButton } from '@/components/ui'
import { cartLineFormAction, type CartLineFormState } from '@/lib/cart/actions'
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

  return (
    <>
      <div className="col-start-2 flex items-center gap-2 xl:col-start-3 xl:justify-center">
        <span className="type-caption text-muted mr-auto xl:sr-only">
          Quantity
        </span>
        <form action={formAction}>
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="lineId" value={lineId} />
          <input type="hidden" name="quantity" value={decreasedQuantity} />
          <IconButton
            type="submit"
            size="sm"
            disabled={!canDecrease || isPending}
            aria-busy={isPending || undefined}
            aria-label={`Decrease quantity of ${productTitle}`}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </form>
        <span
          className="min-w-8 text-center tabular-nums"
          aria-label={`Quantity: ${quantity}`}
        >
          {quantity}
        </span>
        <form action={formAction}>
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="lineId" value={lineId} />
          <input type="hidden" name="quantity" value={increasedQuantity} />
          <IconButton
            type="submit"
            size="sm"
            disabled={!canIncrease || isPending}
            aria-busy={isPending || undefined}
            aria-label={`Increase quantity of ${productTitle}`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </form>
      </div>

      <form action={formAction} className="col-start-2 xl:col-start-5">
        <input type="hidden" name="intent" value="remove" />
        <input type="hidden" name="lineId" value={lineId} />
        <Button
          variant="ghost"
          size="sm"
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          aria-label={`Remove ${productTitle} from cart`}
          className="w-full xl:w-auto"
        >
          Remove
        </Button>
      </form>

      {state.message ? (
        <p className="type-caption text-danger-text col-span-full" role="alert">
          {state.message}
        </p>
      ) : null}
    </>
  )
}
