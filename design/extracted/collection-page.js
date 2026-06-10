/* ============================================================
   TEAVISION — Collection page
   ============================================================ */
function CollectionPage({ title }) {
  const { go } = useShop()
  const [active, setActive] = useState({ type: [], attr: [], origin: [] })
  const [sort, setSort] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  useReveal()

  const toggle = (group, val) =>
    setActive((a) => {
      const has = a[group].includes(val)
      return {
        ...a,
        [group]: has ? a[group].filter((x) => x !== val) : [...a[group], val],
      }
    })
  const clearAll = () => setActive({ type: [], attr: [], origin: [] })
  const activeCount =
    active.type.length + active.attr.length + active.origin.length

  // Filtering
  let list = TV.products.filter((p) => {
    if (active.type.length && !active.type.includes(p.type)) return false
    if (active.origin.length && !active.origin.includes(p.origin)) return false
    if (active.attr.length) {
      const ok = active.attr.every((a) => {
        if (a === 'Certified Organic') return p.organic
        if (a === 'Caffeine-free') return p.tags.includes('Caffeine-free')
        if (a === 'Award-winning')
          return p.tags.some((t) => /award|gold/i.test(t))
        if (a === 'Best seller') return p.tags.includes('Best seller')
        if (a === 'Rare & Limited')
          return p.tags.some((t) => /rare|limited/i.test(t))
        if (a === 'Native grown') return p.tags.includes('Native')
        return true
      })
      if (!ok) return false
    }
    return true
  })
  if (sort === 'price-low') list = [...list].sort((a, b) => a.price - b.price)
  if (sort === 'price-high') list = [...list].sort((a, b) => b.price - a.price)
  if (sort === 'name')
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))

  const counts = (group, val) =>
    TV.products.filter((p) => {
      if (group === 'type') return p.type === val
      if (group === 'origin') return p.origin === val
      if (val === 'Certified Organic') return p.organic
      if (val === 'Caffeine-free') return p.tags.includes('Caffeine-free')
      if (val === 'Award-winning')
        return p.tags.some((t) => /award|gold/i.test(t))
      if (val === 'Best seller') return p.tags.includes('Best seller')
      if (val === 'Rare & Limited')
        return p.tags.some((t) => /rare|limited/i.test(t))
      if (val === 'Native grown') return p.tags.includes('Native')
      return false
    }).length

  const FilterGroup = ({ label, group, opts }) => (
    <div className="filters__group">
      <h4>{label}</h4>
      {opts.map((o) => (
        <div
          key={o}
          className={'fopt' + (active[group].includes(o) ? ' on' : '')}
          onClick={() => toggle(group, o)}
        >
          <span className="fbox">
            <Icon name="check" w={12} />
          </span>
          {o}
          <span className="cnt">{counts(group, o)}</span>
        </div>
      ))}
    </div>
  )

  return (
    <main>
      {/* Collection hero */}
      <section className="coll__hero">
        <Ph variant="on-dark" label="" />
        <div className="wrap-wide coll__hero__in">
          <div className="crumb" style={{ color: 'rgba(255,255,255,.6)' }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                go('home')
              }}
              style={{ color: 'rgba(255,255,255,.6)' }}
            >
              Home
            </a>
            <Icon name="chevR" />
            <span style={{ color: 'var(--gold)' }}>{title}</span>
          </div>
          <span className="eyebrow">Wholesale collection</span>
          <h1
            className="display"
            style={{ fontSize: 'clamp(2.4rem,5vw,4rem)' }}
          >
            {title}
          </h1>
          <p>
            Sold by the kilogram at wholesale prices. Every line is sourced
            direct, quality-graded and freight-insured — buy online or apply for
            a bulk account for 100kg+ pricing.
          </p>
          <div className="coll__hero__meta">
            <div className="m">
              <div className="k serif">{list.length}+</div>
              <div className="v">Lines in stock</div>
            </div>
            <div className="m">
              <div className="k serif">500+</div>
              <div className="v">Certified organic</div>
            </div>
            <div className="m">
              <div className="k serif">15</div>
              <div className="v">Source countries</div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-pad"
        style={{ paddingTop: 'clamp(36px,5vw,64px)' }}
      >
        <div className="wrap-wide">
          <div className="coll__layout">
            {/* Filters */}
            <aside className={'filters' + (showFilters ? ' show' : '')}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 18,
                }}
              >
                <h4
                  className="mono"
                  style={{
                    fontSize: 13,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Filter
                </h4>
                {activeCount > 0 && (
                  <button className="filters__clear" onClick={clearAll}>
                    Clear ({activeCount})
                  </button>
                )}
                <button
                  className="hdr__icon filters__toggle"
                  onClick={() => setShowFilters(false)}
                  style={{ display: showFilters ? 'grid' : 'none' }}
                >
                  <Icon name="close" />
                </button>
              </div>
              <FilterGroup
                label="Tea type"
                group="type"
                opts={TV.filters.type}
              />
              <FilterGroup
                label="Attributes"
                group="attr"
                opts={TV.filters.attr}
              />
              <FilterGroup
                label="Origin"
                group="origin"
                opts={TV.filters.origin}
              />
              <div className="coll__wholesale">
                <h4 className="serif">Bulk 100kg+?</h4>
                <p>Apply for a wholesale account and unlock tiered pricing.</p>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => go('wholesale')}
                >
                  Apply now <Icon name="arrow" />
                </button>
              </div>
            </aside>

            {/* Grid */}
            <div>
              <div className="coll__bar">
                <span className="count">{list.length} products</span>
                <div className="right">
                  <button
                    className="coll__sort filters__toggle"
                    onClick={() => setShowFilters(true)}
                  >
                    <Icon name="menu" w={16} /> Filter
                    {activeCount > 0 ? ` (${activeCount})` : ''}
                  </button>
                  <div className="coll__sort">
                    <span
                      className="faint mono"
                      style={{ fontSize: 11, letterSpacing: '.06em' }}
                    >
                      SORT
                    </span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: low to high</option>
                      <option value="price-high">Price: high to low</option>
                      <option value="name">A – Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {activeCount > 0 && (
                <div className="coll__chips">
                  {[...active.type, ...active.attr, ...active.origin].map(
                    (c) => {
                      const grp = active.type.includes(c)
                        ? 'type'
                        : active.attr.includes(c)
                          ? 'attr'
                          : 'origin'
                      return (
                        <span className="chip" key={c}>
                          {c}
                          <button onClick={() => toggle(grp, c)}>
                            <Icon name="close" w={12} />
                          </button>
                        </span>
                      )
                    },
                  )}
                </div>
              )}

              {list.length === 0 ? (
                <div
                  className="center"
                  style={{
                    flexDirection: 'column',
                    padding: '80px 0',
                    textAlign: 'center',
                  }}
                >
                  <Icon name="leaf" w={44} />
                  <h3
                    className="serif"
                    style={{ marginTop: 16, fontSize: '1.5rem' }}
                  >
                    No matches
                  </h3>
                  <p className="muted" style={{ marginTop: 6 }}>
                    Try removing a filter, or reach out — we source to order.
                  </p>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 18 }}
                    onClick={clearAll}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="coll__grid">
                  {list.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

Object.assign(window, { CollectionPage })
