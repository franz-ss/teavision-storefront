'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { Minus, Plus } from 'lucide-react'

import { IconButton } from '@/components/ui'
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
  const [isUpdatePending, startUpdateTransition] = useTransition()

  const [stepperState, setStepperState] = useState<CartLineFormState>(
    INITIAL_CART_LINE_FORM_STATE,
  )

  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(
    quantity,
    (_current: number, next: number) => next,
  )

  const normalizedQuantity = clampQuantity({
    maximumQuantity,
    minimumQuantity,
    quantityIncrement,
    value: optimisticQuantity,
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

  function handleStepperClick(newQuantity: number) {
    startUpdateTransition(async () => {
      setOptimisticQuantity(newQuantity)
      setStepperState(INITIAL_CART_LINE_FORM_STATE)
      const data = new FormData()
      data.append('intent', 'update')
      data.append('lineId', lineId)
      data.append('quantity', String(newQuantity))
      const result = await action(INITIAL_CART_LINE_FORM_STATE, data)
      setStepperState(result)
      if (result.cartChanged) {
        window.dispatchEvent(new Event(CART_CHANGED_EVENT))
      }
    })
  }

  return (
    <>
      {/* Pill quantity stepper */}
      <div className="border-hairline inline-flex items-center rounded-full border">
        <IconButton
          type="button"
          variant="ghost"
          disabled={!canDecrease}
          aria-busy={isUpdatePending || undefined}
          aria-label={`Decrease quantity of ${productTitle}`}
          className="text-ink-soft hover:text-brand size-11 rounded-full"
          onClick={() => handleStepperClick(decreasedQuantity)}
        >
          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
        </IconButton>
        <span
          className="min-w-7 text-center font-mono text-[13px] tabular-nums"
          role="status"
          aria-live="polite"
        >
          {optimisticQuantity}
        </span>
        <IconButton
          type="button"
          variant="ghost"
          disabled={!canIncrease}
          aria-busy={isUpdatePending || undefined}
          aria-label={`Increase quantity of ${productTitle}`}
          className="text-ink-soft hover:text-brand size-11 rounded-full"
          onClick={() => handleStepperClick(increasedQuantity)}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </IconButton>
      </div>

      {stepperState.message ? (
        <p className="type-caption text-danger" role="alert">
          {stepperState.message}
        </p>
      ) : null}
    </>
  )
}
