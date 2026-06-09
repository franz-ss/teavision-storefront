/* ============================================================
   TEAVISION — Shared: ProductCard, Footer
   ============================================================ */
function ProductCard({ p }) {
  const { go, addItem } = useShop();
  const award = p.tags.find(t=>/award|gold/i.test(t));
  return (
    <article className="pcard reveal" onClick={()=>go("product",{id:p.id})}>
      <div className="pcard__media">
        <Ph variant={p.organic?"on-dark":""} label="" />
        <div className="pcard__badges">
          {p.organic && <span className="pill organic"><span className="dot"/> Organic</span>}
          {award && <span className="pill gold">{award}</span>}
        </div>
        <button className="pcard__fav" aria-label="Save" onClick={(e)=>e.stopPropagation()}><Icon name="drop" w={16}/></button>
        <div className="pcard__add">
          <button className="btn btn-gold btn-sm" style={{width:"100%"}}
            onClick={(e)=>{e.stopPropagation();addItem(p,"250g");}}>Add 250g · {aud(p.price*2.4)}</button>
        </div>
      </div>
      <div className="pcard__body">
        <div className="pcard__origin"><Icon name="globe" w={12}/> {p.origin} · {p.type}</div>
        <h3 className="pcard__name">{p.name}</h3>
        <div className="pcard__row">
          <span className="pcard__price">{aud(p.price)} <span className="unit">{p.kg}</span></span>
          <span className="pcard__grade">{p.grade}</span>
        </div>
      </div>
    </article>
  );
}

function Footer() {
  const { go } = useShop();
  return (
    <footer className="ft">
      <div className="wrap-wide">
        <div className="ft__top">
          <div className="ft__brand">
            <Logo on="paper" onClick={()=>go("home")}/>
            <p>Australia's leading wholesale tea, herb & spice house. Certified organic, award-winning, ethically sourced from 15+ countries — serving 2,000+ businesses since 2014.</p>
            <div className="ft__quality">
              {TV.certs.slice(0,4).map(c=>(<span className="pill" key={c}>{c}</span>))}
            </div>
          </div>
          <div>
            <h5>Shop</h5>
            <ul className="ft__links">
              {["Tea","Tea Bags","Herbs & Spices","Superfoods","Café Range","Organic Range"].map(x=>(
                <li key={x}><a href="#" onClick={(e)=>{e.preventDefault();go("collection",{title:x});}}>{x}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul className="ft__links">
              {[["Services","services"],["Custom Blending","services"],["Private Label","services"],["Our Story","story"],["Tea Journal","journal"],["Certifications","services"],["Contact","contact"]].map(([x,r])=>(
                <li key={x}><a href="#" onClick={(e)=>{e.preventDefault();go(r);}}>{x}</a></li>
              ))}
            </ul>
          </div>
          <div className="ft__news">
            <h5>Keep in touch</h5>
            <p style={{fontSize:"0.95rem"}}>Market trends, new lines and exclusive wholesale offers — monthly.</p>
            <form onSubmit={(e)=>e.preventDefault()}>
              <input placeholder="you@business.com.au"/>
              <button className="btn btn-light btn-sm" style={{width:"100%",marginTop:10}} type="submit">Subscribe <Icon name="arrow"/></button>
            </form>
            <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:8,fontFamily:"var(--mono)",fontSize:12}}>
              <a href="tel:1300729617" style={{display:"flex",gap:8,alignItems:"center"}}><Icon name="phone" w={14}/> 1300 729 617</a>
              <a href="mailto:info@teavision.com.au" style={{display:"flex",gap:8,alignItems:"center"}}><Icon name="mail" w={14}/> info@teavision.com.au</a>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap-wide">
        <div className="ft__bottom">
          <span>© 2026 Teavision · 100% Australian owned & operated</span>
          <div className="ft__pay">
            {["VISA","MASTERCARD","AMEX","PAYPAL","APPLE PAY","SHOP PAY","GOOGLE PAY"].map(x=>(<span key={x}>{x}</span>))}
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { ProductCard, Footer });
