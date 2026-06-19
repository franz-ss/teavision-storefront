import { LegacyBridge } from '../../_components/legacy-bridge'
import {
  getLegacyAccountBridgeCopy,
  getLegacyAccountLoginStartHref,
  type LegacyAccountSearchParams,
} from '../../_lib/legacy-routing'

type AccountResetPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<LegacyAccountSearchParams>
}

export default async function AccountResetPage({
  params,
  searchParams,
}: AccountResetPageProps) {
  void (await params).id
  const copy = getLegacyAccountBridgeCopy(['reset'])

  return (
    <LegacyBridge
      {...copy}
      primaryHref={getLegacyAccountLoginStartHref(await searchParams)}
    />
  )
}
