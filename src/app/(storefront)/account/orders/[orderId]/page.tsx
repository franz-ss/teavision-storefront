import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { withNoindexRobots } from '@/lib/seo/noindex'
import { getCustomerAccountOrder } from '@/lib/shopify/customer-account'

import { OrderDetail } from '../../_components/order-detail'
import { requireAccountSessionForPath } from '../../_lib/protection'
import AccountLoading from '../../loading'

export const metadata: Metadata = withNoindexRobots({
  title: 'Order Detail',
})

type OrderDetailPageProps = {
  params: Promise<{ orderId: string }>
}

async function OrderDetailContent({ params }: OrderDetailPageProps) {
  const { orderId } = await params
  const decodedOrderId = decodeURIComponent(orderId)
  const session = await requireAccountSessionForPath(
    `/account/orders/${orderId}`,
  )
  const order = await getCustomerAccountOrder(session, decodedOrderId)

  if (!order) notFound()

  return <OrderDetail order={order} />
}

export default function AccountOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  return (
    <Suspense fallback={<AccountLoading />}>
      <OrderDetailContent params={params} />
    </Suspense>
  )
}
