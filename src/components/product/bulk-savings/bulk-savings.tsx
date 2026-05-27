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
    <div className={cn('flex min-w-0 flex-col gap-4', className)}>
      <h2 className="type-label text-strong">Buy in Bulk and Save</h2>

      <ul className="flex flex-col gap-2" role="list">
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
                  'border-default bg-canvas focus-visible:ring-ring aria-pressed:border-brand aria-pressed:bg-brand-subtle aria-pressed:text-default grid min-h-[72px] w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-md border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:grid-cols-[auto_minmax(0,1fr)_auto]',
                  onSelectTier && 'hover:border-brand',
                  isActive && 'border-brand bg-brand-subtle',
                )}
                onClick={() => onSelectTier?.(tier.minimumQuantity)}
              >
                <span
                  className={cn(
                    'border-brand flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                    isActive && 'bg-brand-subtle',
                  )}
                  aria-hidden="true"
                >
                  {isActive ? (
                    <span className="bg-brand size-2 rounded-full" />
                  ) : null}
                </span>

                <span className="type-body-sm text-default min-w-0 break-words">
                  {getTierLabel(tier)}
                </span>

                <span className="col-start-2 min-w-0 text-left sm:col-start-3 sm:row-start-1 sm:text-right">
                  {tierPrice ? (
                    <>
                      <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:justify-end">
                        <span className="type-label text-strong whitespace-nowrap tabular-nums">
                          {formatCurrency(tierPrice)}
                        </span>
                        <span className="type-caption text-muted whitespace-nowrap tabular-nums line-through">
                          {formatCurrency(basePrice)}
                        </span>
                      </span>
                      {tierTotal ? (
                        <span className="type-caption text-default flex min-w-0 flex-wrap gap-x-1 tabular-nums sm:justify-end">
                          <span className="whitespace-nowrap">
                            Total {formatCurrency(tierTotal)}
                          </span>
                          <span className="text-muted whitespace-nowrap line-through">
                            {formatCurrency(baseTotal)}
                          </span>
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className="type-caption text-muted">In cart</span>
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
            GRAB THIS DEAL
          </Button>
          <p className="type-caption text-brand text-center">
            Note: When ordering in sizes over 1kg, your package may not be
            packed in individual 1kg bags and will instead come in bulk packed
            bags (2kg 5kg 10kg etc)
          </p>
        </>
      ) : null}
    </div>
  )
}
