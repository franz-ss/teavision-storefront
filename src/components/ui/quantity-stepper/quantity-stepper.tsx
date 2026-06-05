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
  density?: 'default' | 'compact'
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
  density = 'default',
}: QuantityStepperProps) {
  const quantityStep = getSafeStep(step)
  const quantity = clampQuantity(value, min, max, quantityStep)
  const canDecrease = quantity > min && !disabled
  const canIncrease =
    max === undefined ? !disabled : quantity + quantityStep <= max && !disabled
  const isCompact = density === 'compact'

  function updateQuantity(nextValue: number) {
    onChange(clampQuantity(nextValue, min, max, quantityStep))
  }

  return (
    <div
      className={cn(
        isCompact
          ? 'grid grid-cols-[2.5rem_2.5rem_2.5rem] gap-0'
          : 'flex items-center gap-2',
        className,
      )}
    >
      <IconButton
        aria-label={`Decrease ${label.toLowerCase()}`}
        title={`Decrease ${label.toLowerCase()}`}
        disabled={!canDecrease}
        onClick={() => updateQuantity(quantity - quantityStep)}
        size="sm"
        variant="outline"
        className={cn(isCompact && 'h-10 w-10 rounded-r-none border-r-0')}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={quantityStep}
        value={quantity}
        onChange={(event) => updateQuantity(event.currentTarget.valueAsNumber)}
        disabled={disabled}
        className={cn(
          'type-label border-default bg-canvas text-strong focus-visible:ring-ring h-11 w-16 [appearance:textfield] rounded-md border px-2 text-center tabular-nums focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          isCompact && 'h-10 w-10 rounded-none px-1',
        )}
        aria-label={label}
        aria-describedby={describedBy}
      />
      <IconButton
        aria-label={`Increase ${label.toLowerCase()}`}
        title={`Increase ${label.toLowerCase()}`}
        disabled={!canIncrease}
        onClick={() => updateQuantity(quantity + quantityStep)}
        size="sm"
        variant="outline"
        className={cn(isCompact && 'h-10 w-10 rounded-l-none border-l-0')}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    </div>
  )
}
