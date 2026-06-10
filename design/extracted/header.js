/* ============================================================
   TEAVISION — Header, mega-menu, search, cart, mobile menu
   ============================================================ */
const useShop = () => useContext(window.ShopContext)

function Header() {
  const shop = useShop()
  const { go, cart, openCart, count } = shop
  const [open, setOpen] = useState(null) // mega menu key
  const [search, setSearch] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeT = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const enter = (k) => {
    clearTimeout(closeT.current)
    setOpen(k)
    setSearch(false)
  }
  const leave = () => {
    closeT.current = setTimeout(() => setOpen(null), 120)
  }

  return (
    <header
      className={'hdr' + (scrolled ? ' scrolled' : '')}
      onMouseLeave={leave}
    >
      {/* Utility bar */}
      <div className="hdr__bar">
        <div className="wrap-wide">
          <div className="ticker">
            <span>EST. MELBOURNE 2014</span>
            <span className="sep">·</span>
            <span>ACO + USDA CERTIFIED ORGANIC</span>
            <span className="sep">·</span>
            <span>FREIGHT-INSURED, WORLDWIDE</span>
          </div>
          <div className="ticker">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                go('wholesale')
              }}
            >
              <Icon name="spark" w={13} /> Apply for wholesale
            </a>
            <span className="sep">·</span>
            <a href="tel:1300729617">
              <Icon name="phone" w={13} /> 1300 729 617
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="hdr__main">
        <div className="wrap-wide">
          <Logo
            onClick={() => {
              go('home')
              setOpen(null)
            }}
          />
          <nav className="hdr__nav">
            {Object.keys(TV.nav).map((k) => (
              <button
                key={k}
                className={open === k ? 'active' : ''}
                onMouseEnter={() => enter(k)}
                onClick={() => go('collection', { title: k })}
              >
                {k} <Icon name="chevD" />
              </button>
            ))}
            <button
              className={open === 'Services' ? 'active' : ''}
              onMouseEnter={() => enter('Services')}
              onClick={() => go('services')}
            >
              Services <Icon name="chevD" />
            </button>
            <a
              className="navlink"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                go('journal')
              }}
            >
              Journal
            </a>
            <a
              className="navlink"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                go('story')
              }}
            >
              Our Story
            </a>
          </nav>

          <div className="hdr__spacer" />

          <div className="hdr__actions">
            <button
              className="hdr__icon"
              aria-label="Search"
              onClick={() => {
                setSearch((s) => !s)
                setOpen(null)
              }}
            >
              <Icon name="search" />
            </button>
            <button
              className="hdr__icon"
              aria-label="Account"
              onClick={() => go('account')}
            >
              <Icon name="user" />
            </button>
            <button className="hdr__icon" aria-label="Cart" onClick={openCart}>
              <Icon name="cart" />
              {count > 0 && <span className="hdr__count">{count}</span>}
            </button>
            <button
              className="btn btn-primary btn-sm hdr__cta"
              onClick={() => go('wholesale')}
            >
              Wholesale Account
            </button>
            <button
              className="hdr__icon hdr__burger"
              aria-label="Menu"
              onClick={() => setMobile(true)}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown panels — direct children of .hdr (clean containing block, no backdrop-filter) */}
      {open && open !== 'Services' && (
        <MegaMenu
          data={TV.nav[open]}
          title={open}
          onEnter={() => enter(open)}
          onLeave={leave}
          go={go}
        />
      )}
      {open === 'Services' && (
        <ServicesMenu
          go={go}
          onEnter={() => enter('Services')}
          onLeave={leave}
        />
      )}
      {search && <SearchBar go={go} close={() => setSearch(false)} />}

      {open && (
        <div
          className="scrim"
          onClick={() => setOpen(null)}
          style={{ top: 114 }}
        />
      )}
      {mobile && <MobileMenu close={() => setMobile(false)} go={go} />}
    </header>
  )
}

function MegaMenu({ data, title, onEnter, onLeave, go }) {
  return (
    <div className="mega" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="wrap-wide">
        <div className="mega__grid">
          <div className="mega__intro">
            <span className="eyebrow">{title}</span>
            <h4 className="serif">Shop {title}</h4>
            <p>{data.blurb}</p>
            <button
              className="link-arrow"
              style={{ marginTop: 18 }}
              onClick={() => go('collection', { title })}
            >
              View all {title} <Icon name="arrow" />
            </button>
          </div>
          <div className="mega__cols">
            {data.cols.map((c) => (
              <div className="mega__col" key={c.h}>
                <h5>{c.h}</h5>
                <ul>
                  {c.items.map((it) => (
                    <li key={it}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          go('collection', { title: it })
                        }}
                      >
                        {it} <Icon name="chevR" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <a
            className="mega__feature"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              go('collection', { title: data.feature.title })
            }}
          >
            <Ph variant="on-dark" />
            <div className="mega__feature__body">
              <span className="pill">{data.feature.tag}</span>
              <h5>{data.feature.title}</h5>
              <p>{data.feature.sub}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

function ServicesMenu({ go, onEnter, onLeave }) {
  return (
    <div className="mega" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="wrap-wide">
        <div
          className="mega__grid"
          style={{ gridTemplateColumns: '1.1fr 3.7fr' }}
        >
          <div className="mega__intro">
            <span className="eyebrow">Services</span>
            <h4 className="serif">Build your brand</h4>
            <p>
              From a single signature blend to fully-packaged private label —
              concept to shelf.
            </p>
            <button
              className="link-arrow"
              style={{ marginTop: 18 }}
              onClick={() => go('services')}
            >
              All services <Icon name="arrow" />
            </button>
          </div>
          <div
            className="mega__cols"
            style={{ gridTemplateColumns: 'repeat(3,1fr)' }}
          >
            {TV.services_menu.map((s) => (
              <a
                className="mega__col"
                key={s.t}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  go('services')
                }}
                style={{
                  display: 'block',
                  padding: '14px',
                  margin: '-4px',
                  borderRadius: 10,
                  transition: '.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'var(--green-tint)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                <div
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '1.15rem',
                    color: 'var(--ink)',
                  }}
                >
                  {s.t}
                </div>
                <div
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--ink-soft)',
                    marginTop: 4,
                  }}
                >
                  {s.s}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchBar({ go, close }) {
  const [q, setQ] = useState('')
  const ref = useRef(null)
  useEffect(() => {
    ref.current && ref.current.focus()
  }, [])
  const sugg = [
    'Earl Grey',
    'Matcha',
    'Sticky Chai',
    'Organic Peppermint',
    'Lemon Myrtle',
    'Sleep blends',
    'Bulk tea bags',
    'Turmeric',
  ]
  return (
    <div className="searchbar">
      <div className="wrap-wide">
        <form
          className="searchbar__field"
          onSubmit={(e) => {
            e.preventDefault()
            go('collection', { title: q || 'Search' })
            close()
          }}
        >
          <Icon name="search" w={26} />
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 1,000+ teas, herbs & spices…"
          />
          <button type="button" className="hdr__icon" onClick={close}>
            <Icon name="close" />
          </button>
        </form>
        <div className="searchbar__sugg">
          <span className="eyebrow muted no-rule" style={{ marginRight: 6 }}>
            Popular
          </span>
          {sugg.map((s) => (
            <button
              key={s}
              className="pill"
              onClick={() => {
                go('collection', { title: s })
                close()
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileMenu({ close, go }) {
  const [exp, setExp] = useState(null)
  const keys = [...Object.keys(TV.nav)]
  return (
    <div className="mmenu">
      <div className="mmenu__top">
        <Logo
          onClick={() => {
            go('home')
            close()
          }}
        />
        <button className="hdr__icon" onClick={close}>
          <Icon name="close" />
        </button>
      </div>
      <div className="mmenu__body">
        {keys.map((k) => (
          <div className={'mmenu__item' + (exp === k ? ' open' : '')} key={k}>
            <button onClick={() => setExp(exp === k ? null : k)}>
              {k} <Icon name={exp === k ? 'minus' : 'plus'} w={22} />
            </button>
            {exp === k && (
              <div className="mmenu__sub">
                {TV.nav[k].cols
                  .flatMap((c) => c.items)
                  .slice(0, 8)
                  .map((it) => (
                    <button
                      key={it}
                      className="pill"
                      onClick={() => {
                        go('collection', { title: it })
                        close()
                      }}
                    >
                      {it}
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
        <div className="mmenu__item">
          <button
            onClick={() => {
              go('services')
              close()
            }}
          >
            Services <Icon name="chevR" w={20} />
          </button>
        </div>
        <div className="mmenu__item">
          <button
            onClick={() => {
              go('journal')
              close()
            }}
          >
            Journal <Icon name="chevR" w={20} />
          </button>
        </div>
        <div className="mmenu__item">
          <button
            onClick={() => {
              go('story')
              close()
            }}
          >
            Our Story <Icon name="chevR" w={20} />
          </button>
        </div>
        <div className="mmenu__foot">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              go('wholesale')
              close()
            }}
          >
            Apply for Wholesale
          </button>
          <a className="btn btn-ghost btn-lg" href="tel:1300729617">
            <Icon name="phone" /> 1300 729 617
          </a>
        </div>
      </div>
    </div>
  )
}

/* ---------- Cart drawer ---------- */
function CartDrawer() {
  const { cart, cartOpen, closeCart, setQty, removeItem, subtotal, go } =
    useShop()
  if (!cartOpen) return null
  const items = Object.values(cart)
  return (
    <>
      <div className="scrim" style={{ zIndex: 79 }} onClick={closeCart} />
      <aside className="cart">
        <div className="cart__head">
          <h3 className="serif">
            <Icon name="cart" /> Your order{' '}
            {items.length > 0 && (
              <span
                className="faint"
                style={{ fontFamily: 'var(--mono)', fontSize: 13 }}
              >
                ({items.length})
              </span>
            )}
          </h3>
          <button className="hdr__icon" onClick={closeCart}>
            <Icon name="close" />
          </button>
        </div>
        <div className="cart__body">
          {items.length === 0 ? (
            <div className="cart__empty">
              <Icon name="leaf" w={40} />
              <p style={{ marginTop: 14 }}>Your order is empty.</p>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 18 }}
                onClick={() => {
                  closeCart()
                  go('collection', { title: 'Tea' })
                }}
              >
                Browse teas <Icon name="arrow" />
              </button>
            </div>
          ) : (
            items.map((it) => (
              <div className="cart__line" key={it.key}>
                <Ph variant={it.organic ? 'on-dark' : ''} label="" />
                <div className="cart__line__info">
                  <div className="cart__line__top">
                    <div>
                      <div className="cart__line__name serif">{it.name}</div>
                      <div className="cart__line__meta">
                        {it.size} · {it.origin}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {aud(it.price * it.qty)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div className="qty">
                      <button onClick={() => setQty(it.key, it.qty - 1)}>
                        <Icon name="minus" w={15} />
                      </button>
                      <span>{it.qty}</span>
                      <button onClick={() => setQty(it.key, it.qty + 1)}>
                        <Icon name="plus" w={15} />
                      </button>
                    </div>
                    <button
                      className="cart__remove"
                      onClick={() => removeItem(it.key)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart__foot">
            <div className="cart__row total">
              <span>Subtotal</span>
              <span className="serif">{aud(subtotal)}</span>
            </div>
            <div className="cart__note">
              <Icon name="truck" w={14} /> Free freight on wholesale orders over
              $300 · insured & tracked
            </div>
            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              Checkout <Icon name="arrow" />
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

Object.assign(window, { Header, CartDrawer, useShop })
