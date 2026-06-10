import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { BulkPricingTier, Money } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'
import { Button, ToggleButton } from '@/components/ui'

type BulkSavingsProps = {
  tiers: BulkPricingTier[]
  basePrice: Money
  selectedQuantity: number
  selectedTierQuantity?: number | null
  maximumQuantity?: number
  canAddToCart?: boolean
  isPending?: boolean
  onGrabDeal?: () => void
  onSelectTier?: (quantity: number) => void
  className?: string
}

function parseAmount(money: Money): number {
  const amount = Number.parseFloat(money.amount)
  return Number.isFinite(amount) ? amount : 0
}

function formatCurrency(money: Money): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(parseAmount(money))
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    maximumFractionDigits: 1,
  }).format(value)
}

function getTierLabel(tier: BulkPricingTier): string {
  if (tier.label) return tier.label

  if (tier.discountPercent !== undefined) {
    return `Buy ${tier.minimumQuantity} for ${formatPercent(
      tier.discountPercent,
    )}% Off`
  }

  return `Buy ${tier.minimumQuantity}+`
}

function getTierPrice(tier: BulkPricingTier, basePrice: Money): Money | null {
  if (tier.price) return tier.price
  if (tier.discountPercent === undefined) return null

  const baseAmount = parseAmount(basePrice)
  if (baseAmount <= 0) return null

  return {
    amount: (baseAmount * (1 - tier.discountPercent / 100)).toFixed(2),
    currencyCode: basePrice.currencyCode,
  }
}

function getTotalPrice(price: Money, quantity: number): Money {
  return {
    amount: (parseAmount(price) * quantity).toFixed(2),
    currencyCode: price.currencyCode,
  }
}

function getActiveTier(
  tiers: BulkPricingTier[],
  selectedQuantity: number,
): BulkPricingTier | null {
  return (
    tiers
      .filter((tier) => selectedQuantity >= tier.minimumQuantity)
      .sort((a, b) => b.minimumQuantity - a.minimumQuantity)[0] ?? null
  )
}

export function BulkSavings({
  tiers,
  basePrice,
  selectedQuantity,
  selectedTierQuantity = null,
  maximumQuantity,
  canAddToCart = true,
  isPending = false,
  onGrabDeal,
  onSelectTier,
  className,
}: BulkSavingsProps) {
  const visibleTiers = tiers
    .filter(
      (tier) =>
        tier.minimumQuantity > 0 &&
        (maximumQuantity === undefined ||
          tier.minimumQuantity <= maximumQuantity),
    )
    .sort((a, b) => a.minimumQuantity - b.minimumQuantity)
  const selectedTier =
    selectedTierQuantity === null
      ? null
      : (visibleTiers.find(
          (tier) => tier.minimumQuantity === selectedTierQuantity,
        ) ?? null)
  const activeTier =
    selectedTier ?? getActiveTier(visibleTiers, selectedQuantity)

  if (visibleTiers.length === 0) return null

  return (
    <div className={cn('flex min-w-0 flex-col gap-3', className)}>
      <h2 className="font-mono text-[11px] tracking-[0.12em] text-ink-faint uppercase">
        Buy in Bulk and Save
      </h2>

      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-3" role="list">
        {visibleTiers.map((tier) => {
          const isActive = activeTier?.minimumQuantity === tier.minimumQuantity
          const tierPrice = getTierPrice(tier, basePrice)
          const tierTotal = tierPrice
            ? getTotalPrice(tierPrice, tier.minimumQuantity)
            : null
          const baseTotal = getTotalPrice(basePrice, tier.minimumQuantity)

          return (
            <li
              key={`${tier.minimumQuantity}-${tier.label ?? tierPrice?.amount ?? 'tier'}`}
            >
              <ToggleButton
                type="button"
                pressed={isActive}
                className={cn(
                  'relative flex min-h-30 w-full flex-col items-center justify-center rounded-sm border border-hairline bg-card p-3.5 text-center transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none aria-pressed:border-brand',
                  onSelectTier && 'hover:border-brand',
                  isActive && 'border-brand',
                )}
                onClick={() => onSelectTier?.(tier.minimumQuantity)}
              >
                {isActive ? (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-brand px-2 py-0.5 font-mono text-[9px] tracking-widest whitespace-nowrap text-paper uppercase">
                    Best value
                  </span>
                ) : null}

                <span className="font-mono text-[11px] tracking-wider text-ink-faint">
                  {getTierLabel(tier)}
                </span>

                <span className="mt-1 min-w-0">
                  {tierPrice ? (
                    <>
                      <span className="flex min-w-0 flex-col items-center gap-1">
                        <span className="font-display text-[1.3rem] leading-tight text-ink tabular-nums">
                          {formatCurrency(tierPrice)}
                        </span>
                        <span className="font-mono text-[10px] text-ink-faint tabular-nums line-through">
                          {formatCurrency(basePrice)}
                        </span>
                      </span>
                      {tierTotal ? (
                        <span className="mt-1 flex min-w-0 flex-wrap justify-center gap-x-1 text-[11px] font-semibold text-brand tabular-nums">
                          <span className="whitespace-nowrap">
                            Total {formatCurrency(tierTotal)}
                          </span>
                          <span className="whitespace-nowrap text-ink-faint line-through">
                            {formatCurrency(baseTotal)}
                          </span>
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className="type-caption text-ink-faint">In cart</span>
                  )}
                </span>
              </ToggleButton>
            </li>
          )
        })}
      </ul>

      {onGrabDeal ? (
        <>
          <Button
            variant="brand"
            size="lg"
            className="w-full"
            onClick={onGrabDeal}
            isLoading={isPending}
            disabled={!canAddToCart || isPending}
          >
            Grab this deal
          </Button>
          <p className="type-caption text-brand text-center">
            Note: When ordering in sizes over 1kg, your package may not be
            packed in individual 1kg bags and will instead come in bulk packed
            bags (2kg 5kg 10kg etc)
          </p>
          <Link
            href="/pages/wholesale"
            className="type-label inline-flex items-center self-start border-b-[1.5px] border-hairline pb-1 text-ink transition-colors hover:border-brand hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Apply for a wholesale account
            <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </Link>
        </>
      ) : null}
    </div>
  )
}
