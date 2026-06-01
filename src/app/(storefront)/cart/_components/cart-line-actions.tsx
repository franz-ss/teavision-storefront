'use client'

import { useActionState } from 'react'
import { Minus, Plus } from 'lucide-react'

import { Button, IconButton } from '@/components/ui'
import {
  cartLineFormAction,
  type CartLineFormState,
} from '@/lib/cart/actions'

const INITIAL_CART_LINE_FORM_STATE: CartLineFormState = {
  message: null,
}

type CartLineActionsProps = {
  lineId: string
  productTitle: string
  quantity: number
}

export function CartLineActions({
  lineId,
  productTitle,
  quantity,
}: CartLineActionsProps) {
  const [state, formAction, isPending] = useActionState(
    cartLineFormAction,
    INITIAL_CART_LINE_FORM_STATE,
  )
  const canDecrease = quantity > 1

  return (
    <>
      <div className="col-start-2 flex items-center gap-2 xl:col-start-3 xl:justify-center">
        <span className="type-caption text-muted mr-auto xl:sr-only">
          Quantity
        </span>
        <form action={formAction}>
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="lineId" value={lineId} />
          <input type="hidden" name="quantity" value={quantity - 1} />
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
          <input type="hidden" name="quantity" value={quantity + 1} />
          <IconButton
            type="submit"
            size="sm"
            disabled={isPending}
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
          className="w-full xl:w-auto"
        >
          Remove
        </Button>
      </form>

      {state.message ? (
        <p
          className="type-caption text-danger-text col-span-full"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}
    </>
  )
}
