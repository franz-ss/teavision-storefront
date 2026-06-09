/* ============================================================
   TEAVISION — Product detail page
   ============================================================ */
function ProductPage({ id }) {
  const { go, addItem } = useShop();
  const p = TV.products.find((x)=>x.id===id) || TV.products[0];
  const sizes = [
    { w:"100g", mult:1 }, { w:"250g", mult:2.4 }, { w:"500g", mult:4.6 }, { w:"1kg", mult:8.5 },
  ];
  const [size, setSize] = useState(sizes[1]);
  const [qty, setQty] = useState(1);
  const [thumb, setThumb] = useState(0);
  const [acc, setAcc] = useState("tasting");
  useReveal();
  useEffect(()=>{ setSize(sizes[1]); setQty(1); setThumb(0); window.scrollTo(0,0); }, [id]);

  const tiers = [
    { q:"1–4 kg", price:p.price*8.5, save:null },
    { q:"5–24 kg", price:p.price*7.8, save:"8%", best:true },
    { q:"25 kg+", price:p.price*6.9, save:"19%" },
  ];
  const related = TV.products.filter((x)=>x.id!==p.id && (x.type===p.type||x.origin===p.origin)).slice(0,4);
  const relList = related.length>=4 ? related : TV.products.filter(x=>x.id!==p.id).slice(0,4);
  const award = p.tags.find(t=>/award|gold/i.test(t));

  const Acc = ({ k, title, children }) => (
    <div className={"spec-acc"+(acc===k?" open":"")}>
      <button className="spec-acc__h" onClick={()=>setAcc(acc===k?"":k)}>{title}<Icon name="chevD" className="ic"/></button>
      <div className="spec-acc__c" style={{maxHeight:acc===k?600:0}}>{children}</div>
    </div>
  );

  return (
    <main>
      <div className="wrap-wide">
        <div className="crumb">
          <a href="#" onClick={(e)=>{e.preventDefault();go("home");}}>Home</a><Icon name="chevR"/>
          <a href="#" onClick={(e)=>{e.preventDefault();go("collection",{title:p.type});}}>{p.type}</a><Icon name="chevR"/>
          <span style={{color:"var(--ink)"}}>{p.name}</span>
        </div>

        <div className="pdp">
          {/* Gallery */}
          <div className="pdp__gallery">
            <div className="pdp__main">
              <Ph variant={p.organic?"on-dark":(thumb===2?"on-gold":"")} label={["loose leaf · macro","dry leaf in scoop","brewed cup","origin / farm"][thumb]}/>
              <div className="pdp__badge">{p.organic && <span className="pill organic"><span className="dot"/> Certified Organic</span>}</div>
            </div>
            <div className="pdp__thumbs">
              {[0,1,2,3].map((i)=>(
                <div key={i} className={"pdp__thumb"+(thumb===i?" on":"")} onClick={()=>setThumb(i)}>
                  <Ph variant={i===0&&p.organic?"on-dark":(i===2?"on-gold":"")} label=""/>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pdp__info">
            <span className="eyebrow"><Icon name="globe" w={13}/> {p.origin} · {p.type} · Grade {p.grade}</span>
            <h1 className="serif">{p.name}</h1>
            <div className="pdp__rating">
              <span className="pdp__stars">{[0,1,2,3,4].map(i=>(<Icon key={i} name="star" w={16}/>))}</span>
              <span className="n">4.9 · 128 wholesale reviews</span>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:16}}>
              {p.tags.map(t=>(<span key={t} className={"pill"+(/award|gold/i.test(t)?" gold":"")}>{t}</span>))}
            </div>

            <div className="pdp__price">
              <span className="now serif">{aud(p.price*size.mult)}</span>
              <span className="unit">/ {size.w}</span>
              <span className="ws">{aud(p.price)} {p.kg} base</span>
            </div>
            <p className="pdp__desc">{p.blurb}</p>

            <div className="pdp__opts">
              <h5>Pack size</h5>
              <div className="sizes">
                {sizes.map((s)=>(
                  <div key={s.w} className={"size"+(size.w===s.w?" on":"")} onClick={()=>setSize(s)}>
                    <div className="w">{s.w}</div><div className="p">{aud(p.price*s.mult)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pdp__buy">
              <div className="qty">
                <button onClick={()=>setQty(Math.max(1,qty-1))}><Icon name="minus" w={16}/></button>
                <span>{qty}</span>
                <button onClick={()=>setQty(qty+1)}><Icon name="plus" w={16}/></button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={()=>addItem(p,size.w,qty,p.price*size.mult)}>
                Add to order · {aud(p.price*size.mult*qty)} <Icon name="cart" w={17}/>
              </button>
            </div>

            <div className="pdp__assure">
              <div className="a"><Icon name="truck"/> Freight-insured & tracked</div>
              <div className="a"><Icon name="leaf"/> Air-tight, resealable packing</div>
              <div className="a"><Icon name="shield"/> HACCP food-safety program</div>
            </div>

            {/* Wholesale tiers */}
            <div className="tiers">
              <h5>Wholesale bulk pricing — per kg</h5>
              <div className="tiers__grid">
                {tiers.map((t)=>(
                  <div className={"tier"+(t.best?" best":"")} key={t.q}>
                    <div className="q">{t.q}</div>
                    <div className="pr serif">{aud(t.price)}</div>
                    {t.save && <div className="sv">Save {t.save}</div>}
                  </div>
                ))}
              </div>
              <button className="link-arrow" style={{marginTop:16}} onClick={()=>go("wholesale")}>Apply for a wholesale account <Icon name="arrow"/></button>
            </div>

            {/* Spec accordions */}
            <div className="specs">
              <Acc k="tasting" title="Tasting & brewing">
                <table className="spectable"><tbody>
                  <tr><td>Origin</td><td>{p.origin}</td></tr>
                  <tr><td>Grade</td><td>{p.grade}</td></tr>
                  <tr><td>Aroma</td><td>Soft, floral and well-balanced with a clean finish</td></tr>
                  <tr><td>Brew</td><td>1–2 tsp per 250ml · 90–95°C · steep 1–3 min</td></tr>
                  <tr><td>Caffeine</td><td>{p.tags.includes("Caffeine-free")?"Caffeine-free":"Moderate"}</td></tr>
                </tbody></table>
              </Acc>
              <Acc k="ingredients" title="Ingredients & certification">
                <p>{p.organic ? "Certified Organic (ACO + USDA). " : ""}Single-line ingredient, no artificial flavours, colours or preservatives. Sourced direct from ethical farms and quality-graded on receival under our HACCP program.</p>
              </Acc>
              <Acc k="shipping" title="Packing, shipping & storage">
                <p>Delivered in sealed, air-tight, resealable pouches. Store below 18°C in a dry place, out of direct light. Australia-wide freight with worldwide options for wholesale and private-label clients — every shipment insured and tracked.</p>
              </Acc>
              <Acc k="private" title="Private label this blend">
                <p>Available for private-label packing from 20kg per blend — pouches, tins, cylinders and cello bags, filled, sealed and labelled under your own brand. Talk to our team to develop a variation tuned to your menu.</p>
              </Acc>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="related">
          <div className="related__head">
            <h2 className="h-lg serif">You may also like</h2>
            <button className="link-arrow" onClick={()=>go("collection",{title:p.type})}>More {p.type} <Icon name="arrow"/></button>
          </div>
          <div className="rail">{relList.map((x)=>(<ProductCard key={x.id} p={x}/>))}</div>
        </div>
      </div>

      <div style={{height:"clamp(50px,7vw,90px)"}}/>
    </main>
  );
}

Object.assign(window, { ProductPage });
