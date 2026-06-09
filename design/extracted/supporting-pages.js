/* ============================================================
   TEAVISION — Supporting pages (wholesale, services, simple)
   ============================================================ */
function WholesalePage() {
  const { go } = useShop();
  const [sent, setSent] = useState(false);
  useReveal();
  const benefits = [
    { ic:"scale", t:"Tiered bulk pricing", s:"Unlock further discounts on 100kg+ orders, across 1,000+ lines." },
    { ic:"truck", t:"Insured, tracked freight", s:"Every shipment covered end-to-end with full traceability." },
    { ic:"flask", t:"Dedicated account manager", s:"A tea master and supply specialist assigned to your business." },
    { ic:"spark", t:"Custom blends & private label", s:"Develop signature product from 20kg, packed under your brand." },
  ];
  return (
    <main>
      <section className="coll__hero" style={{paddingBlock:"clamp(56px,7vw,96px)"}}>
        <Ph variant="on-dark" label=""/>
        <div className="wrap-wide coll__hero__in">
          <span className="eyebrow">Wholesale accounts</span>
          <h1 className="display" style={{fontSize:"clamp(2.4rem,5vw,4.2rem)",maxWidth:"16ch"}}>Trade pricing for serious volume.</h1>
          <p style={{maxWidth:"54ch"}}>Join 2,000+ cafés, retailers and brands sourcing certified-organic tea, herbs and spices direct. Apply in minutes — approval within one business day.</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="wrap-wide">
          <div className="help" style={{alignItems:"start"}}>
            <div className="reveal">
              <span className="eyebrow">Why apply</span>
              <h2 className="h-lg" style={{marginTop:14,marginBottom:8}}>Built for businesses that buy by the kilo.</h2>
              <ul className="split__list" style={{marginTop:18}}>
                {benefits.map(b=>(
                  <li key={b.t}><Icon name={b.ic} className="ic"/><div><div className="t">{b.t}</div><div className="s">{b.s}</div></div></li>
                ))}
              </ul>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:26}}>
                {TV.certs.map(c=>(<span className="pill" key={c}>{c}</span>))}
              </div>
            </div>
            <div className="card-surface reveal" style={{padding:30}}>
              {sent ? (
                <div className="center" style={{flexDirection:"column",minHeight:380,textAlign:"center"}}>
                  <span style={{width:62,height:62,borderRadius:"50%",background:"var(--green-tint)",color:"var(--green)",display:"grid",placeItems:"center"}}><Icon name="check" w={30}/></span>
                  <h3 className="serif" style={{marginTop:20,fontSize:"1.7rem"}}>Application received.</h3>
                  <p className="muted" style={{marginTop:8,maxWidth:"36ch"}}>Our wholesale team will review and reach out within one business day to activate your trade pricing.</p>
                  <button className="btn btn-ghost btn-sm" style={{marginTop:22}} onClick={()=>go("collection",{title:"Tea"})}>Browse while you wait <Icon name="arrow"/></button>
                </div>
              ) : (
                <form className="help__form" onSubmit={(e)=>{e.preventDefault();setSent(true);window.scrollTo({top:0,behavior:"smooth"});}}>
                  <div className="field full"><label>Business name</label><input required placeholder="Trading name"/></div>
                  <div className="field"><label>Contact name</label><input required placeholder="Your name"/></div>
                  <div className="field"><label>Phone</label><input placeholder="Number"/></div>
                  <div className="field full"><label>Business email</label><input type="email" required placeholder="you@business.com.au"/></div>
                  <div className="field"><label>Business type</label><select><option>Café / Restaurant</option><option>Retailer</option><option>Manufacturer / Brand</option><option>Distributor</option><option>Other</option></select></div>
                  <div className="field"><label>Est. monthly volume</label><select><option>Under 20 kg</option><option>20–100 kg</option><option>100–500 kg</option><option>500 kg+</option></select></div>
                  <div className="field full"><label>What are you looking to source?</label><textarea placeholder="Tell us about your range…"/></div>
                  <button className="btn btn-primary btn-lg field full" type="submit">Apply for wholesale account <Icon name="arrow"/></button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ServicesPage() {
  const { go } = useShop();
  useReveal();
  const steps = TV.services;
  return (
    <main>
      <section className="coll__hero" style={{paddingBlock:"clamp(56px,7vw,96px)"}}>
        <Ph variant="on-dark" label=""/>
        <div className="wrap-wide coll__hero__in">
          <span className="eyebrow">Services</span>
          <h1 className="display" style={{fontSize:"clamp(2.4rem,5vw,4.2rem)",maxWidth:"15ch"}}>We make the tea. You build the brand.</h1>
          <p style={{maxWidth:"54ch"}}>From a single signature blend to fully-packaged, shelf-ready private label — our tea masters and naturopaths take you concept to execution.</p>
        </div>
      </section>
      <section className="section-pad">
        <div className="wrap-wide">
          <div className="svc">
            {steps.map(s=>(
              <article className="svc__card reveal" key={s.n}>
                <Ph className="svc__media" variant={s.n==="02"?"on-gold":"on-dark"} label=""/>
                <div className="svc__n">{s.n} · {s.tag}</div>
                <h3 className="serif">{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
          <div className="svc" style={{marginTop:18}}>
            {TV.services_menu.slice(3).map((s,i)=>(
              <article className="svc__card reveal" key={s.t}>
                <div className="svc__n">0{i+4}</div>
                <h3 className="serif">{s.t}</h3>
                <p className="muted">{s.s}</p>
              </article>
            ))}
          </div>
          <div className="news reveal" style={{marginTop:40}}>
            <Ph variant="on-dark" label=""/>
            <div className="news__body">
              <span className="eyebrow" style={{color:"var(--gold)"}}>Start a project</span>
              <h2 className="h-lg" style={{marginTop:14}}>Let's build your blend.</h2>
              <p>Tell us your brief — flavour, function, format — and we'll prototype it.</p>
              <div className="hero__cta" style={{marginTop:24}}>
                <button className="btn btn-light btn-lg" onClick={()=>go("contact")}>Contact the team <Icon name="arrow"/></button>
                <button className="btn btn-ghost btn-lg" style={{color:"var(--paper)",borderColor:"rgba(255,255,255,.35)"}} onClick={()=>go("wholesale")}>Open an account</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* Simple branded page for journal / story / account / contact */
function SimplePage({ page }) {
  const { go } = useShop();
  useReveal();
  const map = {
    journal: { eye:"Tea Journal", h:"Insights, guides & stories from the world of tea.", grid:"journal" },
    story:   { eye:"Our Story", h:"100% Australian, since 2014.", grid:"story" },
    account: { eye:"Account", h:"Sign in to your Teavision account.", grid:"account" },
    contact: { eye:"Contact", h:"Speak with our ingredients experts.", grid:"contact" },
  };
  const m = map[page] || map.journal;
  return (
    <main>
      <section className="coll__hero" style={{paddingBlock:"clamp(50px,6vw,84px)"}}>
        <Ph variant="on-dark" label=""/>
        <div className="wrap-wide coll__hero__in">
          <span className="eyebrow">{m.eye}</span>
          <h1 className="display" style={{fontSize:"clamp(2.2rem,4.4vw,3.6rem)",maxWidth:"18ch"}}>{m.h}</h1>
        </div>
      </section>
      <section className="section-pad">
        <div className="wrap-wide">
          {page==="journal" && (
            <div className="jrnl">
              {[...TV.journal,...TV.journal].map((j,i)=>(
                <article className="jcard reveal" key={i}>
                  <div className="jcard__media"><Ph variant="on-dark" label=""/></div>
                  <div className="jcard__meta"><span className="cat">{j.cat}</span><span>·</span><span>{j.date}</span></div>
                  <h3 className="serif">{j.t}</h3>
                  <p>{j.d}</p>
                </article>
              ))}
            </div>
          )}
          {page==="story" && (
            <div className="split">
              <div className="reveal">
                <span className="eyebrow">Mindfulness · Sincerity · Wholesomeness</span>
                <h2 className="h-lg" style={{margin:"16px 0 14px"}}>A tea house built on values.</h2>
                <p className="muted">Established in 2014 and proudly 100% Australian owned and operated, Teavision has grown into the country's leading wholesale supplier of tea, herbs and spices — creating private-label blends for 2,000+ businesses from concept to execution.</p>
                <p className="muted" style={{marginTop:14}}>We hold exclusive relationships direct from ethical farms across 15+ countries, run a HACCP-certified food-safety program, and carry ACO and USDA organic certification. Fifteen Golden Leaf medals — including five gold — speak to the quality in every kilo.</p>
                <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:24}}>{TV.certs.map(c=>(<span className="pill" key={c}>{c}</span>))}</div>
                <button className="btn btn-primary" style={{marginTop:26}} onClick={()=>go("collection",{title:"Tea"})}>Explore the range <Icon name="arrow"/></button>
              </div>
              <div className="split__media reveal"><Ph variant="on-dark" label="our story · team / origin"/></div>
            </div>
          )}
          {(page==="account"||page==="contact") && (
            <div className="wrap" style={{maxWidth:560,padding:0,margin:"0 auto"}}>
              <div className="card-surface reveal" style={{padding:32}}>
                {page==="account" ? (
                  <form onSubmit={(e)=>e.preventDefault()} style={{display:"flex",flexDirection:"column",gap:16}}>
                    <div className="field"><label>Email</label><input type="email" placeholder="you@business.com.au"/></div>
                    <div className="field"><label>Password</label><input type="password" placeholder="••••••••"/></div>
                    <button className="btn btn-primary btn-lg" type="submit">Sign in <Icon name="arrow"/></button>
                    <button className="link-arrow" style={{alignSelf:"center"}} onClick={(e)=>{e.preventDefault();go("wholesale");}}>New here? Apply for an account</button>
                  </form>
                ) : (
                  <form onSubmit={(e)=>e.preventDefault()} className="help__form">
                    <div className="field"><label>Name</label><input placeholder="Your name"/></div>
                    <div className="field"><label>Phone</label><input placeholder="Number"/></div>
                    <div className="field full"><label>Email</label><input type="email" placeholder="you@business.com.au"/></div>
                    <div className="field full"><label>Message</label><textarea placeholder="How can we help?"/></div>
                    <button className="btn btn-primary btn-lg field full" type="submit">Send message <Icon name="arrow"/></button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { WholesalePage, ServicesPage, SimplePage });
