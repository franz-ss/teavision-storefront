'use client'

import { Minus, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

import { IconButton } from '../icon-button'

type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  label?: string
  id?: string
  describedBy?: string
  className?: string
}

function clampQuantity(value: number, min: number, max?: number): number {
  const safeValue = Number.isFinite(value) ? Math.trunc(value) : min
  const lowerBounded = Math.max(min, safeValue)
  return max === undefined ? lowerBounded : Math.min(max, lowerBounded)
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  label = 'Quantity',
  id,
  describedBy,
  className,
}: QuantityStepperProps) {
  const quantity = clampQuantity(value, min, max)
  const canDecrease = quantity > min && !disabled
  const canIncrease = max === undefined ? !disabled : quantity < max && !disabled

  function updateQuantity(nextValue: number) {
    onChange(clampQuantity(nextValue, min, max))
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <IconButton
        aria-label={`Decrease ${label.toLowerCase()}`}
        title={`Decrease ${label.toLowerCase()}`}
        disabled={!canDecrease}
        onClick={() => updateQuantity(quantity - 1)}
        size="sm"
        variant="outline"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={1}
        value={quantity}
        onChange={(event) => updateQuantity(event.currentTarget.valueAsNumber)}
        disabled={disabled}
        className="type-label border-default bg-canvas text-strong focus-visible:ring-ring h-11 w-16 rounded-md border px-2 text-center tabular-nums focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={label}
        aria-describedby={describedBy}
      />
      <IconButton
        aria-label={`Increase ${label.toLowerCase()}`}
        title={`Increase ${label.toLowerCase()}`}
        disabled={!canIncrease}
        onClick={() => updateQuantity(quantity + 1)}
        size="sm"
        variant="outline"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    </div>
  )
}
