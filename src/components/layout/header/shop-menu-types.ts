import type { ShopKey, ShopSection } from './mega-nav-data'

export type ShopMenuProps = {
  activeShop: ShopSection
  onActiveShopChange: (key: ShopKey) => void
  onClose: () => void
  open: boolean
}
