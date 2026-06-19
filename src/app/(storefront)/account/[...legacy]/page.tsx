import { LegacyBridge } from '../_components/legacy-bridge'
import {
  getLegacyAccountBridgeCopy,
  getLegacyAccountLoginStartHref,
  type LegacyAccountSearchParams,
} from '../_lib/legacy-routing'

type AccountLegacyPageProps = {
  params: Promise<{ legacy: string[] }>
  searchParams: Promise<LegacyAccountSearchParams>
}

export default async function AccountLegacyPage({
  params,
  searchParams,
}: AccountLegacyPageProps) {
  const [{ legacy }, query] = await Promise.all([params, searchParams])
  const copy = getLegacyAccountBridgeCopy(legacy)

  return (
    <LegacyBridge
      {...copy}
      primaryHref={getLegacyAccountLoginStartHref(query)}
    />
  )
}
