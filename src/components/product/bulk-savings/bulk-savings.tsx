import type { BulkPricingTier, Money } from '@/lib/shopify/types'
import { cn } from '@/lib/utils'

type BulkSavingsProps = {
  tiers: BulkPricingTier[]
  basePrice: Money
  selectedQuantity: number
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

function getSavingsLabel(tier: BulkPricingTier, basePrice: Money): string {
  if (tier.discountPercent !== undefined) {
    return `Save ${formatPercent(tier.discountPercent)}%`
  }

  if (tier.price) {
    const baseAmount = parseAmount(basePrice)
    const tierAmount = parseAmount(tier.price)

    if (baseAmount > 0 && tierAmount > 0 && tierAmount < baseAmount) {
      const percent = ((baseAmount - tierAmount) / baseAmount) * 100
      return `Save ${formatPercent(percent)}%`
    }
  }

  return 'Bulk price'
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
  className,
}: BulkSavingsProps) {
  const visibleTiers = tiers
    .filter((tier) => tier.minimumQuantity > 0)
    .sort((a, b) => a.minimumQuantity - b.minimumQuantity)
  const activeTier = getActiveTier(visibleTiers, selectedQuantity)

  if (visibleTiers.length === 0) return null

  return (
    <div
      className={cn(
        'border-default bg-surface flex flex-col gap-3 rounded-md border p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="type-label text-strong">Buy in Bulk and Save</h2>
        {activeTier ? (
          <span className="type-eyebrow bg-success-bg text-success-text rounded-sm px-2 py-1">
            Applied
          </span>
        ) : null}
      </div>

      <ul
        className="border-default overflow-hidden rounded-md border"
        role="list"
      >
        {visibleTiers.map((tier, index) => {
          const isActive = activeTier?.minimumQuantity === tier.minimumQuantity
          const tierPrice = getTierPrice(tier, basePrice)

          return (
            <li
              key={`${tier.minimumQuantity}-${tier.label ?? tierPrice?.amount ?? 'tier'}`}
              className={cn(
                'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3',
                index > 0 && 'border-default border-t',
                isActive && 'bg-brand-subtle',
              )}
              aria-current={isActive ? 'true' : undefined}
            >
              <div className="min-w-0">
                <p className="type-label text-strong">
                  {tier.label ?? `Buy ${tier.minimumQuantity}+`}
                </p>
                <p className="type-caption text-muted">
                  {getSavingsLabel(tier, basePrice)}
                </p>
              </div>

              <div className="text-right">
                {tierPrice ? (
                  <>
                    <p className="type-caption text-muted">Each</p>
                    <p className="type-label text-strong tabular-nums">
                      {formatCurrency(tierPrice)}
                    </p>
                  </>
                ) : (
                  <span className="type-caption text-muted">In cart</span>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
