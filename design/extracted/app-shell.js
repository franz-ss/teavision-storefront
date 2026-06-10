/* ============================================================
   TEAVISION — App shell: router + cart + tweaks
   ============================================================ */
window.ShopContext = createContext(null)

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  hero: 'A',
  palette: 'green',
  accent: '#0d5a43',
  radius: 10,
  headline: 'A world of tea mastery, by the kilogram.',
} /*EDITMODE-END*/

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS)
  const [route, setRoute] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tv_route')) || { page: 'home' }
    } catch {
      return { page: 'home' }
    }
  })
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tv_cart')) || {}
    } catch {
      return {}
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastT = useRef(null)

  useEffect(() => {
    localStorage.setItem('tv_route', JSON.stringify(route))
  }, [route])
  useEffect(() => {
    localStorage.setItem('tv_cart', JSON.stringify(cart))
  }, [cart])

  // Apply palette + accent + radius live
  useEffect(() => {
    document.documentElement.setAttribute('data-palette', t.palette || 'green')
    if (t.palette === 'green' && t.accent) {
      // map hex accent → override via style (accent + deep)
      document.documentElement.style.setProperty('--accent', t.accent)
    } else {
      document.documentElement.style.removeProperty('--accent')
    }
    document.documentElement.style.setProperty(
      '--radius-lg',
      (t.radius ?? 10) + 'px',
    )
  }, [t.palette, t.accent, t.radius])

  const go = useCallback((page, params = {}) => {
    setRoute({ page, ...params })
    setCartOpen(false)
    window.scrollTo({
      top: 0,
      behavior: 'instant' in window ? 'instant' : 'auto',
    })
  }, [])

  const flashToast = (msg) => {
    setToast(msg)
    clearTimeout(toastT.current)
    toastT.current = setTimeout(() => setToast(null), 2400)
  }

  const addItem = useCallback((p, size = '250g', qty = 1, price = null) => {
    const key = p.id + '_' + size
    const unit = price != null ? price : p.price * 2.4
    setCart((c) => {
      const ex = c[key]
      return {
        ...c,
        [key]: {
          key,
          id: p.id,
          name: p.name,
          origin: p.origin,
          organic: p.organic,
          size,
          price: unit,
          qty: (ex ? ex.qty : 0) + qty,
        },
      }
    })
    flashToast(`Added ${p.name} · ${size}`)
    setCartOpen(true)
  }, [])

  const setQty = useCallback((key, q) => {
    setCart((c) => {
      if (q <= 0) {
        const n = { ...c }
        delete n[key]
        return n
      }
      return { ...c, [key]: { ...c[key], qty: q } }
    })
  }, [])
  const removeItem = useCallback(
    (key) =>
      setCart((c) => {
        const n = { ...c }
        delete n[key]
        return n
      }),
    [],
  )

  const count = Object.values(cart).reduce((s, i) => s + i.qty, 0)
  const subtotal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0)

  const ctx = {
    go,
    route,
    cart,
    addItem,
    setQty,
    removeItem,
    count,
    subtotal,
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
  }

  const setHero = (v) => setTweak('hero', v)

  let page
  switch (route.page) {
    case 'collection':
      page = <CollectionPage title={route.title || 'Tea'} />
      break
    case 'product':
      page = <ProductPage id={route.id} />
      break
    case 'wholesale':
      page = <WholesalePage />
      break
    case 'services':
      page = <ServicesPage />
      break
    case 'journal':
    case 'story':
    case 'account':
    case 'contact':
      page = <SimplePage page={route.page} />
      break
    default:
      page = <HomePage heroVariant={t.hero || 'A'} setHeroVariant={setHero} />
  }

  return (
    <ShopContext.Provider value={ctx}>
      <Header />
      {page}
      <Footer />
      <CartDrawer />
      {toast && (
        <div className="toast">
          <Icon name="check" w={18} /> {toast}
        </div>
      )}

      <TweaksPanel>
        <TweakSection label="Hero direction" />
        <TweakRadio
          label="Layout"
          value={t.hero || 'A'}
          options={['A', 'B', 'C']}
          onChange={(v) => {
            setHero(v)
            if (route.page !== 'home') go('home')
          }}
        />
        <div
          style={{
            fontSize: 11,
            color: '#8a8a85',
            fontFamily: 'var(--mono)',
            padding: '2px 2px 8px',
          }}
        >
          A · Editorial &nbsp; B · Catalogue &nbsp; C · Specimen
        </div>
        <TweakSection label="Brand palette" />
        <TweakRadio
          label="Scheme"
          value={t.palette || 'green'}
          options={['green', 'earth', 'ink']}
          onChange={(v) => setTweak('palette', v)}
        />
        <TweakColor
          label="Accent (green scheme)"
          value={t.accent}
          options={['#0d5a43', '#0a4733', '#106040', '#16785a', '#1f6f5c']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Shape" />
        <TweakSlider
          label="Corner radius"
          value={t.radius ?? 10}
          min={0}
          max={22}
          unit="px"
          onChange={(v) => setTweak('radius', v)}
        />
      </TweaksPanel>
    </ShopContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
