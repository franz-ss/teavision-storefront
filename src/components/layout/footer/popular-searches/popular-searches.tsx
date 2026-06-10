const POPULAR_SEARCH_COLUMNS = [
  [
    { href: '/', label: 'teas australia' },
    { href: '/', label: 'tea shop australia' },
    { href: '/collections/organic-tea', label: 'organic tea australia' },
    { href: '/collections/loose-leaf-tea', label: 'loose leaf tea' },
    { href: '/collections/chinese-tea', label: 'Chinese Tea' },
    { href: '/collections/green-tea', label: 'green tea leaves' },
    { href: '/collections/black-tea', label: 'black tea' },
    { href: '/collections/burdock-root', label: 'burdock root' },
    { href: '/collections/dandelion-tea', label: 'dandelion tea' },
    { href: '/collections/organic-sleepy-tea/', label: 'sleep tea' },
    { href: '/collections/organic-probiotic-tea', label: 'probiotic tea' },
    { href: '/collections/herbal-tea', label: 'herb tea' },
    { href: '/collections/custom-tea-blend', label: 'tea blends' },
    { href: '/collections/wholesale-detox-tea/', label: 'detox tea' },
    { href: '/products/spearmint-organic', label: 'spearmint tea' },
    { href: '/collections/spearmint-tea', label: 'buy spearmint tea' },
    {
      href: '/collections/licorice-mint',
      label: 'peppermint and licorice tea',
    },
    { href: '/collections/lemon-myrtle', label: 'lemon myrtle tea' },
    { href: '/collections/organic-lemon-balm', label: 'lemon balm tea' },
    { href: '/collections/organic-black-assam-tea', label: 'assam tea' },
    { href: '/products/instant-chai-powder', label: 'chai tea powder' },
    { href: '/collections/chai', label: 'chai tea' },
    { href: '/collections/chai', label: 'chai leaves' },
    { href: '/collections/japanese-green-tea', label: 'japanese green tea' },
    { href: '/collections/japanese-sencha-tea', label: 'sencha tea' },
    { href: '/collections/australian-grown-tea', label: 'australian tea' },
    { href: '/collections/marshmallow-root', label: 'marshmallow root tea' },
  ],
  [
    { href: '/collections/matcha-tea', label: 'matcha' },
    { href: '/collections/matcha-tea', label: 'matcha powder' },
    { href: '/collections/olive-leaf-wholesale', label: 'olive leaf tea' },
    { href: '/collections/organic-cold-flu', label: 'cold & flu tea' },
    { href: '/collections/organic-rooibos-tea', label: 'buy rooibos tea' },
    { href: '/collections/yerba-mate', label: 'yerba mate tea' },
    { href: '/collections/chamomile', label: 'chamomile leaves' },
    { href: '/collections/chamomile', label: 'chamomile teas' },
    {
      href: '/products/organic-chamomile-pyramid-tea-bags',
      label: 'chamomile tea bags',
    },
    { href: '/collections/oolong-tea-wholesale', label: 'buy oolong tea' },
    { href: '/pages/tea-packaging', label: 'tea packaging' },
    {
      href: '/collections/organic-body-colon-cleanse',
      label: 'organic herbal colon cleanse',
    },
    {
      href: '/collections/organic-turmeric-powder',
      label: 'organic turmeric powder',
    },
    { href: '/collections/organic-cinnamon-powder', label: 'bulk cinnamon' },
    { href: '/collections/organic-hibiscus', label: 'dried hibiscus flowers' },
    {
      href: '/pages/import-tea-herbs-australia',
      label: 'import herbs to australias',
    },
    {
      href: '/pages/tea-importers-australia',
      label: 'tea importers australia',
    },
    { href: '/collections/white-tea', label: 'buy white tea' },
    { href: '/collections/organic-honeybush', label: 'honeybush tea' },
    { href: '/collections/pu-erh-tea', label: 'pu erh tea australia' },
    { href: '/collections/scullcap', label: 'scullcap' },
    { href: '/collections/english-breakfast-tea', label: 'breakfast tea' },
    { href: '/collections/cloves', label: 'clove tea' },
    {
      href: '/collections/organic-calendula-petals',
      label: 'calendula flowers',
    },
  ],
  [
    { href: '/collections/organic-digestive-tea', label: 'digestive tea' },
    { href: '/collections/organic-earl-grey', label: 'organic earl grey tea' },
    { href: '/collections/speciality-tea', label: 'speciality tea' },
    { href: '/collections/cocoa-tea-shells', label: 'cocoa tea' },
    { href: '/collections/cloves-wholesale', label: 'cloves wholesale' },
    {
      href: '/collections/organic-wholesale-peppermint-tea',
      label: 'loose leaf peppermint tea',
    },
    { href: '/collections/licorice-tea', label: 'licorice root tea' },
    { href: '/collections/aniseed-tea', label: 'aniseed tea' },
    { href: '/collections/rose-tea', label: 'rose bud tea' },
    { href: '/collections/rose-buds', label: 'wholesale rose buds' },
    { href: '/collections/nettle-leaf', label: 'nettle leaf' },
    { href: '/collections/pekoe-tea', label: 'pekoe tea' },
    { href: '/collections/siberian-ginseng', label: 'siberian ginseng' },
    { href: '/collections/ginseng-tea', label: 'ginseng tea' },
    { href: '/collections/elderberries', label: 'elderberries' },
    { href: '/collections/blooming-tea', label: 'blooming tea' },
    {
      href: '/collections/lemongrass-ginger-tea',
      label: 'lemongrass and ginger tea',
    },
    { href: '/collections/lemon-verbena-tea', label: 'lemon verbena tea' },
    { href: '/collections/genmaicha-tea', label: 'genmaicha tea' },
    { href: '/collections/lapsang-souchong', label: 'lapsang souchong tea' },
    { href: '/collections/longjing-tea', label: 'longjing tea' },
    { href: '/collections/silver-needle', label: 'silver needle' },
    { href: '/collections/tulsi-tea', label: 'buy tulsi tea' },
  ],
  [
    { href: '/collections/hibiscus-tea', label: 'buy hibiscus tea' },
    { href: '/collections/white-peony', label: 'white peony tea' },
    { href: '/collections/ginger-tea-bags', label: 'ginger tea bags' },
    { href: '/collections/ginkgo-biloba-tea', label: 'ginkgo biloba tea' },
    { href: '/collections/keemun-tea', label: 'keemun tea' },
    { href: '/collections/damiana-tea', label: 'damiana tea' },
    { href: '/collections/complexion-tea', label: 'complexion tea' },
    { href: '/collections/cinnamon-cassia', label: 'cinnamon cassia' },
    { href: '/collections/calendula-tea', label: 'calendula tea' },
    {
      href: '/collections/darjeeling-tea',
      label: 'darjeeling tea online australia',
    },
    { href: '/collections/ceylon-tea', label: 'ceylon tea' },
    { href: '/collections/jasmine-tea', label: 'jasmine tea' },
    { href: '/collections/moringa-leaves', label: 'moringa leaf' },
    { href: '/collections/cardamom-pods', label: 'cardamom pods' },
    { href: '/collections/cardamom-powder', label: 'cardamom powder' },
    { href: '/collections/passionflower', label: 'passionflower' },
    { href: '/collections/raspberry-leaf', label: 'raspberry leaf' },
    { href: '/collections/vervain', label: 'vervain wholesale' },
    { href: '/collections/ginger', label: 'ginger powder' },
    { href: '/collections/ginger', label: 'dried ginger' },
    { href: '/collections/star-anise', label: 'star anise' },
    { href: '/collections/cinnamon-chips', label: 'cinnamon chips' },
    { href: '/collections/japanese-matcha', label: 'japanese matcha' },
  ],
] as const

export function PopularSearches() {
  return (
    <nav aria-label="Popular searches">
      <h2 className="text-gold mb-4 font-mono text-[10.5px] tracking-[0.16em] uppercase">
        Popular Searches
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {POPULAR_SEARCH_COLUMNS.map((column, colIndex) => (
          <ul
            key={colIndex}
            className="flex flex-col gap-1.5 text-[0.85rem]"
            role="list"
          >
            {column.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <a
                  href={link.href}
                  className="text-paper/60 hover:text-paper transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </nav>
  )
}
