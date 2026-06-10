'use client'

import { Minus, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

import { IconButton } from '../icon-button'

type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: string
  id?: string
  name?: string
  describedBy?: string
  className?: string
}

function getSafeStep(step: number): number {
  return Math.max(1, Math.trunc(step))
}

function clampQuantity(
  value: number,
  min: number,
  max: number | undefined,
  step: number,
): number {
  if (max !== undefined && max < min) return min

  const safeValue = Number.isFinite(value) ? Math.trunc(value) : min
  const lowerBounded = Math.max(min, safeValue)
  const upperBounded =
    max === undefined ? lowerBounded : Math.min(max, lowerBounded)

  return min + Math.floor((upperBounded - min) / step) * step
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  step = 1,
  disabled = false,
  label = 'Quantity',
  id,
  name,
  describedBy,
  className,
}: QuantityStepperProps) {
  const quantityStep = getSafeStep(step)
  const quantity = clampQuantity(value, min, max, quantityStep)
  const canDecrease = quantity > min && !disabled
  const canIncrease =
    max === undefined ? !disabled : quantity + quantityStep <= max && !disabled

  function updateQuantity(nextValue: number) {
    onChange(clampQuantity(nextValue, min, max, quantityStep))
  }

  return (
    <>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <div
        className={cn(
          'border-hairline inline-flex items-center rounded-full border',
          className,
        )}
      >
        <IconButton
          aria-label={`Decrease ${label.toLowerCase()}`}
          title={`Decrease ${label.toLowerCase()}`}
          disabled={!canDecrease}
          onClick={() => updateQuantity(quantity - quantityStep)}
          variant="ghost"
          className="size-11 rounded-none rounded-l-full"
        >
          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
        </IconButton>
        <input
          id={id}
          name={name}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={quantityStep}
          value={quantity}
          onChange={(event) =>
            updateQuantity(event.currentTarget.valueAsNumber)
          }
          disabled={disabled}
          className="border-hairline min-w-7 w-auto [appearance:textfield] border-x bg-transparent text-center font-mono text-[13px] tabular-nums focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label={label}
          aria-describedby={describedBy}
        />
        <IconButton
          aria-label={`Increase ${label.toLowerCase()}`}
          title={`Increase ${label.toLowerCase()}`}
          disabled={!canIncrease}
          onClick={() => updateQuantity(quantity + quantityStep)}
          variant="ghost"
          className="size-11 rounded-none rounded-r-full"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </IconButton>
      </div>
    </>
  )
}
