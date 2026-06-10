/* ============================================================
   TEAVISION — Brand-motif components & bands
   ============================================================ */
let _brushId = 0
const brushUid = (p) => p + '_' + ++_brushId

/* ---- Real hand-drawn brand assets (green brush-disc illustrations) ---- */
const RES = (id, fallback) =>
  (window.__resources && window.__resources[id]) || fallback
const ILLO_SRC = {
  handshake: {
    get src() {
      return RES('illoHandshake', 'images/illo-handshake.png')
    },
    alt: 'Two people shaking hands',
  },
  cup: {
    get src() {
      return RES('illoCup', 'images/illo-cup.png')
    },
    alt: 'Hands cradling a cup of tea',
  },
  teapot: {
    get src() {
      return RES('illoTeapot', 'images/illo-teapot.png')
    },
    alt: 'Teapot',
  },
}

function BrushCircle({ illo }) {
  const a = ILLO_SRC[illo]
  return (
    <div className={'brushcircle bc-float bc-' + illo}>
      <img src={a.src} alt={a.alt} loading="lazy" />
    </div>
  )
}

/* Hand-drawn green brush ring (real asset) with curved text overlaid */
function Stamp({ top, bottom }) {
  const tArc = useRef(brushUid('arcT')).current
  const bArc = useRef(brushUid('arcB')).current
  const R = 64
  return (
    <div className="stamp st-float">
      <img
        className="stamp__ring-img"
        src={RES('stampRing', 'images/stamp-ring.png')}
        alt=""
        loading="lazy"
      />
      <svg className="stamp__text" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          {/* top arc: left→right over the top (text upright) */}
          <path
            id={tArc}
            d={`M ${100 - R} 100 A ${R} ${R} 0 0 1 ${100 + R} 100`}
            fill="none"
          />
          {/* bottom arc: left→right under the bottom (text upright) */}
          <path
            id={bArc}
            d={`M ${100 - R} 103 A ${R} ${R} 0 0 0 ${100 + R} 103`}
            fill="none"
          />
        </defs>
        <text
          className="stamp__txt"
          textAnchor="middle"
          style={{ fontSize: 26 }}
        >
          <textPath href={`#${tArc}`} startOffset="50%">
            {top}
          </textPath>
        </text>
        <text
          className="stamp__txt"
          textAnchor="middle"
          style={{ fontSize: 32 }}
        >
          <textPath href={`#${bArc}`} startOffset="50%">
            {bottom}
          </textPath>
        </text>
      </svg>
    </div>
  )
}

/* ============================================================
   The three adapted sections
   ============================================================ */
function GrowBand() {
  const { go } = useShop()
  return (
    <section className="bband">
      <div className="wrap-wide bband__in">
        <div className="bband__illo reveal">
          <BrushCircle illo="handshake" />
        </div>
        <div className="bband__text reveal">
          <span className="eyebrow">For business</span>
          <h2 className="serif">
            Let the experts help <span className="hl">grow</span> your business.
          </h2>
          <p>
            We take pride in everything we do — always on a mission to source
            the best ingredients at the lowest prices. Our certified tea masters
            and herbalists are dedicated to helping your business grow and reach
            its goals.
          </p>
          <div className="bband__cta">
            <button
              className="btn btn-light btn-lg"
              onClick={() => go('contact')}
            >
              Contact the team <Icon name="arrow" />
            </button>
          </div>
        </div>
        <div className="bband__stamp">
          <Stamp top="Business" bottom="Teavision" />
        </div>
      </div>
    </section>
  )
}

function CatalogueBand() {
  const { go } = useShop()
  const [sent, setSent] = useState(false)
  return (
    <section className="bband green rev">
      <div className="wrap-wide bband__in">
        <div className="bband__stamp">
          <Stamp top="Catalog" bottom="Teavision" />
        </div>
        <div className="bband__text reveal">
          <span className="eyebrow">Wholesale catalogues</span>
          <h2 className="serif">Explore tea &amp; herb catalogues.</h2>
          <p>
            Browse hundreds of options across black tea, green tea, herbal
            blends and bulk spices. Every listing includes the quality detail
            you need to guide confident wholesale orders.
          </p>
          <div className="bband__cta">
            <button
              className="btn btn-light btn-lg"
              onClick={() => setSent(true)}
            >
              {sent ? (
                <>
                  Sent to your inbox <Icon name="check" />
                </>
              ) : (
                <>
                  Download catalogue <Icon name="arrowUR" />
                </>
              )}
            </button>
            <button
              className="btn btn-ghost btn-lg"
              style={{
                color: 'var(--paper)',
                borderColor: 'rgba(255,255,255,.35)',
              }}
              onClick={() => go('collection', { title: 'Tea' })}
            >
              Browse online
            </button>
          </div>
        </div>
        <div className="bband__illo reveal">
          <BrushCircle illo="cup" />
        </div>
      </div>
    </section>
  )
}

function NewsletterBand() {
  const [done, setDone] = useState(false)
  return (
    <section className="bband">
      <div className="wrap-wide bband__in">
        <div className="bband__illo reveal">
          <BrushCircle illo="teapot" />
        </div>
        <div className="bband__text reveal">
          <span className="eyebrow">Monthly newsletter</span>
          <h2 className="serif">Explore the world of tea, monthly.</h2>
          <p>
            Monthly updates on loose-leaf tea, bulk tea bags, herbs and spices —
            from market insights to brewing tips and the latest from trusted
            suppliers in Australia and beyond.
          </p>
          <form
            className="news__form"
            style={{ justifyContent: 'center' }}
            onSubmit={(e) => {
              e.preventDefault()
              setDone(true)
            }}
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              style={{ maxWidth: 320 }}
            />
            <button className="btn btn-light btn-lg" type="submit">
              {done ? (
                'Subscribed ✓'
              ) : (
                <>
                  Subscribe <Icon name="arrow" />
                </>
              )}
            </button>
          </form>
        </div>
        <div className="bband__stamp">
          <Stamp top="Subscribe" bottom="Teavision" />
        </div>
      </div>
    </section>
  )
}

Object.assign(window, {
  BrushCircle,
  Stamp,
  GrowBand,
  CatalogueBand,
  NewsletterBand,
})
