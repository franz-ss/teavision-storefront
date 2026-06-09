/* ============================================================
   TEAVISION — Homepage
   ============================================================ */

/* Hero switcher control */
function HeroSwitch({ variant, set, onLight }) {
  return (
    <div className={"heroSwitch"+(onLight?" onlight":"")}>
      {[["A","Editorial"],["B","Catalogue"],["C","Specimen"]].map(([k,label])=>(
        <button key={k} className={variant===k?"on":""} onClick={()=>set(k)}>{label}</button>
      ))}
    </div>
  );
}

function HeroA({ go }) {
  return (
    <section className="hero heroA">
      <Ph variant="on-dark fill" label="hero · tea field / loose leaf, full-bleed"/>
      <div className="heroA__inner">
        <div className="wrap-wide">
          <span className="eyebrow hero__eyebrow">Australia's tea, herb & spice house</span>
          <h1 className="display">A world of tea mastery,<br/><span className="italic-accent">by the kilogram.</span></h1>
          <p className="lede">Handpicked from the finest leaves across 15+ countries. Certified-organic loose leaf, bulk tea bags and botanical herbs — trusted by Australia's leading cafés, retailers and wellness brands.</p>
          <div className="hero__cta">
            <button className="btn btn-light btn-lg" onClick={()=>go("collection",{title:"Tea"})}>Explore our teas <Icon name="arrow"/></button>
            <button className="btn btn-ghost btn-lg" style={{color:"var(--paper)",borderColor:"rgba(255,255,255,.35)"}} onClick={()=>go("wholesale")}>Open a wholesale account</button>
          </div>
        </div>
      </div>
      <div className="heroA__strip">
        <div className="wrap-wide">
          {TV.stats.map((s)=>(
            <div className="heroA__stat" key={s.k}>
              <div className="k"><Icon name={s.ic} w={22}/> {s.k}</div>
              <div className="v">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroB({ go }) {
  return (
    <section className="hero heroB">
      <div className="wrap-wide">
        <div className="heroB__grid">
          <div>
            <span className="eyebrow hero__eyebrow">Wholesale · Private label · Retail</span>
            <h1 className="display">The supplier behind<br/>Australia's<br/><span style={{color:"var(--green)"}}>favourite cups.</span></h1>
            <p className="lede">1,000+ tea, herb and spice lines — 500+ certified organic — sourced direct and sold by the kilo. Buy online today, or apply for a bulk account on 100kg+ orders.</p>
            <div className="hero__cta">
              <button className="btn btn-primary btn-lg" onClick={()=>go("collection",{title:"Tea"})}>Shop the range <Icon name="arrow"/></button>
              <button className="btn btn-ghost btn-lg" onClick={()=>go("wholesale")}>Wholesale pricing</button>
            </div>
            <div className="hero__trust">
              <span className="pill organic"><span className="dot"/> ACO + USDA Organic</span>
              <span className="pill"><Icon name="medal" w={13}/> 15 Golden Leaf awards</span>
              <span className="pill"><Icon name="shield" w={13}/> HACCP certified</span>
            </div>
          </div>
          <div style={{position:"relative"}}>
            <div className="heroB__art">
              <Ph variant="on-dark" label="signature blend"/>
              <Ph label="loose leaf"/>
              <Ph variant="on-gold" label="matcha"/>
            </div>
            <div className="heroB__badge">
              <span className="ic"><Icon name="medal" w={16}/></span>
              <div><div className="serif">Gold Medal</div><div className="mono" style={{fontSize:10,color:"var(--ink-faint)"}}>CARAMEL SHIMMER</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroC({ go }) {
  return (
    <section className="hero heroC">
      <div className="wrap-wide">
        <div className="heroC__inner">
          <span className="eyebrow hero__eyebrow no-rule" style={{justifyContent:"center"}}>Est. Melbourne · 2014</span>
          <h1 className="display">Tea, sourced<br/>with intention.</h1>
          <p className="lede">A curated house of certified-organic teas, wild-grown herbs and rare botanicals — for the businesses that care where every leaf comes from.</p>
          <div className="hero__cta heroC__cta">
            <button className="btn btn-primary btn-lg" onClick={()=>go("collection",{title:"Tea"})}>Discover the collection <Icon name="arrow"/></button>
            <button className="btn btn-ghost btn-lg" onClick={()=>go("story")}>Our story</button>
          </div>
          <div className="heroC__specimen">
            <Ph variant="on-dark" label="specimen · single hero leaf, centered"/>
            <div className="heroC__chips">
              <span className="heroC__chip c1"><span className="dot"/> SINGLE ORIGIN</span>
              <span className="heroC__chip c2"><span className="dot"/> 500+ ORGANIC</span>
              <span className="heroC__chip c3"><span className="dot"/> 15 COUNTRIES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Product range grid */
function RangeSection({ go }) {
  return (
    <section className="section-pad">
      <div className="wrap-wide">
        <div className="range__head reveal">
          <div>
            <span className="eyebrow">Explore the range</span>
            <h2 className="h-xl" style={{marginTop:16}}>Wholesale online, direct<br/>to business or doorstep.</h2>
          </div>
          <p className="muted" style={{maxWidth:"34ch"}}>Buy any line online at wholesale prices — or apply for a bulk account and unlock further discounts on 100kg+ orders.</p>
        </div>
        <div className="range__grid">
          {TV.range.map((r)=>(
            <a key={r.title} className="rtile reveal" href="#" onClick={(e)=>{e.preventDefault();go("collection",{title:r.title});}}>
              <Ph variant={Math.random()>0.5?"on-dark":""} label=""/>
              <span className="rtile__tag">{r.tag}</span>
              <h3 className="serif">{r.title}</h3>
              <div className="sub">{r.sub}</div>
              <span className="rtile__go">Shop now <Icon name="arrow"/></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestSellers({ go }) {
  const picks = TV.products.filter(p=>p.tags.some(t=>/best|award/i.test(t))).slice(0,4);
  const list = picks.length>=4 ? picks : TV.products.slice(0,4);
  return (
    <section className="section-pad bg-paper2">
      <div className="wrap-wide">
        <div className="range__head reveal">
          <div>
            <span className="eyebrow">Cafe favourites</span>
            <h2 className="h-xl" style={{marginTop:16}}>The blends they reorder.</h2>
          </div>
          <button className="link-arrow" onClick={()=>go("collection",{title:"Best sellers"})}>Shop best sellers <Icon name="arrow"/></button>
        </div>
        <div className="rail">{list.map(p=>(<ProductCard key={p.id} p={p}/>))}</div>
      </div>
    </section>
  );
}

function StatBand() {
  return (
    <section className="statband">
      <div className="wrap-wide">
        {TV.stats.map((s)=>(
          <div className="statband__item reveal" key={s.k}>
            <Icon name={s.ic} className="statband__ic" w={40}/>
            <div className="statband__k serif">{s.k}</div>
            <div className="statband__v">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesSection({ go }) {
  return (
    <section className="section-pad">
      <div className="wrap-wide">
        <div className="range__head reveal">
          <div>
            <span className="eyebrow">Private label & custom solutions</span>
            <h2 className="h-xl" style={{marginTop:16}}>We make the tea.<br/>You build the brand.</h2>
          </div>
          <p className="muted" style={{maxWidth:"34ch"}}>Develop custom blends, manufacture tea bags and ship fully-packaged private-label product — all under one certified roof.</p>
        </div>
        <div className="svc">
          {TV.services.map((s)=>(
            <article className="svc__card reveal" key={s.n}>
              <Ph className="svc__media" variant={s.n==="02"?"on-gold":"on-dark"} label=""/>
              <div className="svc__n">{s.n} · {s.tag}</div>
              <h3 className="serif">{s.title}</h3>
              <p>{s.body}</p>
              <button className="link-arrow" onClick={()=>go("services")}>Explore <Icon name="arrow"/></button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrganicSplit({ go }) {
  return (
    <section className="section-pad bg-paper2">
      <div className="wrap-wide">
        <div className="split">
          <div className="reveal">
            <span className="eyebrow">Wild-grown & certified organic</span>
            <h2 className="h-lg" style={{margin:"16px 0 14px"}}>Herbs & spices, sourced direct from farm.</h2>
            <p className="muted">We supply only the freshest wild-grown herbs and certified-organic spices, sourced directly from trusted farmers and plantations across the globe — with quality, sustainability and reliability built in.</p>
            <ul className="split__list">
              {TV.supply.map((x)=>(
                <li key={x.t}><Icon name="check" className="ic"/><div><div className="t">{x.t}</div><div className="s">{x.s}</div></div></li>
              ))}
            </ul>
            <button className="btn btn-primary" style={{marginTop:26}} onClick={()=>go("collection",{title:"Herbs & Spices"})}>Shop herbs & spices <Icon name="arrow"/></button>
          </div>
          <div className="split__media reveal"><Ph variant="on-dark" label="organic herbs & spices · flat-lay"/></div>
        </div>
      </div>
    </section>
  );
}

function CertsMarquee() {
  const items = [...TV.certs, ...TV.certs];
  const ics = {0:"shield",1:"leaf",2:"flask",3:"medal",4:"flag",5:"truck"};
  return (
    <section className="certs">
      <div className="certs__track">
        {items.map((c,i)=>(<div className="certs__item" key={i}><Icon name={ics[i%6]} className="ic" w={26}/> {c}</div>))}
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const t = TV.testimonials[i];
  return (
    <section className="section-pad">
      <div className="wrap-wide">
        <div className="range__head reveal" style={{marginBottom:50}}>
          <div>
            <span className="eyebrow">Trusted partners</span>
            <h2 className="h-xl" style={{marginTop:16}}>Behind brands<br/>Australia loves.</h2>
          </div>
          <p className="muted" style={{maxWidth:"34ch"}}>From purpose-led startups to the country's biggest beverage names — they value fresh, organic ingredients and flexible, reliable supply.</p>
        </div>
        <div className="tst">
          <div className="tst__brands">
            {TV.testimonials.map((x,idx)=>(
              <button key={x.brand} className={"tst__brand"+(idx===i?" on":"")} onClick={()=>setI(idx)}>
                <Ph className="logo" variant={idx%2?"on-gold":""} label=""/>
                <div className="meta"><div className="b">{x.brand}</div><div className="r">{x.role}</div></div>
              </button>
            ))}
          </div>
          <div className="tst__panel" key={i}>
            <Icon name="quote" className="quoteicon" w={50}/>
            <blockquote className="tst__quote reveal in">"{t.quote}"</blockquote>
            <div className="tst__who">{t.who} — {t.brand}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="section-pad bg-paper2" style={{paddingTop:0}}>
      <div className="wrap-wide">
        <div className="news reveal">
          <Ph variant="on-dark" label=""/>
          <div className="news__body">
            <span className="eyebrow" style={{color:"var(--gold)"}}>Monthly newsletter</span>
            <h2 className="h-lg" style={{marginTop:16}}>Explore the world of tea, monthly.</h2>
            <p>Market insights, brewing tips and the latest from trusted suppliers in Australia and beyond.</p>
            <form className="news__form" onSubmit={(e)=>{e.preventDefault();setDone(true);}}>
              <input placeholder="Enter your email" type="email" required/>
              <button className="btn btn-light btn-lg" type="submit">{done?"Subscribed ✓":"Subscribe"}{!done&&<Icon name="arrow"/>}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function JournalSection({ go }) {
  return (
    <section className="section-pad">
      <div className="wrap-wide">
        <div className="range__head reveal">
          <div>
            <span className="eyebrow">Tea Journal</span>
            <h2 className="h-xl" style={{marginTop:16}}>Insights, guides & stories.</h2>
          </div>
          <button className="link-arrow" onClick={()=>go("journal")}>View all <Icon name="arrow"/></button>
        </div>
        <div className="jrnl">
          {TV.journal.map((j)=>(
            <article className="jcard reveal" key={j.t} onClick={()=>go("journal")} style={{cursor:"pointer"}}>
              <div className="jcard__media"><Ph variant="on-dark" label=""/></div>
              <div className="jcard__meta"><span className="cat">{j.cat}</span><span>·</span><span>{j.date}</span></div>
              <h3 className="serif">{j.t}</h3>
              <p>{j.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HelpSection() {
  const [sent, setSent] = useState(false);
  return (
    <section className="section-pad bg-green" style={{background:"var(--ink)"}}>
      <div className="wrap-wide">
        <div className="help">
          <div className="reveal">
            <span className="eyebrow" style={{color:"var(--gold)"}}>Let the experts grow your business</span>
            <h2 className="h-xl" style={{color:"var(--paper)",marginTop:16}}>Speak with our<br/>ingredients experts.</h2>
            <p style={{color:"oklch(0.9 0.02 100 / 0.8)",marginTop:16,maxWidth:"42ch"}}>Our tea masters, naturopaths and supply-chain specialists are on hand to source the right ingredients — at the right price — for your business.</p>
            <div className="help__contact" style={{marginTop:36}}>
              <a className="line" href="tel:1300729617"><span className="ic"><Icon name="phone"/></span><div><div className="k">Call us</div><div className="v" style={{color:"var(--paper)"}}>1300 729 617</div></div></a>
              <a className="line" href="mailto:info@teavision.com.au"><span className="ic"><Icon name="mail"/></span><div><div className="k">Email</div><div className="v" style={{color:"var(--paper)"}}>info@teavision.com.au</div></div></a>
            </div>
          </div>
          <div className="card-surface reveal" style={{padding:"30px"}}>
            {sent ? (
              <div className="center" style={{flexDirection:"column",minHeight:320,textAlign:"center"}}>
                <span className="ic" style={{width:60,height:60,borderRadius:"50%",background:"var(--green-tint)",color:"var(--green)",display:"grid",placeItems:"center"}}><Icon name="check" w={28}/></span>
                <h3 className="serif" style={{marginTop:20,fontSize:"1.6rem"}}>Thanks — we'll be in touch.</h3>
                <p className="muted" style={{marginTop:8}}>One of our specialists will reach out within one business day.</p>
              </div>
            ) : (
            <form className="help__form" onSubmit={(e)=>{e.preventDefault();setSent(true);}}>
              <div className="field"><label>Name</label><input required placeholder="Your name"/></div>
              <div className="field"><label>Phone</label><input placeholder="Number"/></div>
              <div className="field full"><label>Email</label><input type="email" required placeholder="you@business.com.au"/></div>
              <div className="field full"><label>Message</label><textarea placeholder="Tell us what you're looking to source…"/></div>
              <button className="btn btn-primary btn-lg field full" type="submit">Contact the team <Icon name="arrow"/></button>
            </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section-pad bg-paper2">
      <div className="wrap" style={{maxWidth:880}}>
        <div className="reveal" style={{textAlign:"center",marginBottom:44}}>
          <span className="eyebrow no-rule">Questions</span>
          <h2 className="h-xl" style={{marginTop:16}}>Frequently asked.</h2>
        </div>
        <div className="reveal">
          {TV.faqs.map((f,i)=>(
            <div className={"faq__item"+(open===i?" open":"")} key={i}>
              <button className="faq__q" onClick={()=>setOpen(open===i?-1:i)}>{f.q}<span className="ic"><Icon name="plus" w={16}/></span></button>
              <div className="faq__a" style={{maxHeight:open===i?260:0}}><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ heroVariant, setHeroVariant }) {
  const { go } = useShop();
  useReveal();
  return (
    <main>
      <div style={{position:"relative"}}>
        <HeroSwitch variant={heroVariant} set={setHeroVariant} onLight={heroVariant!=="A"}/>
        {heroVariant==="A" && <HeroA go={go}/>}
        {heroVariant==="B" && <HeroB go={go}/>}
        {heroVariant==="C" && <HeroC go={go}/>}
      </div>
      <RangeSection go={go}/>
      <StatBand/>
      <BestSellers go={go}/>
      <ServicesSection go={go}/>
      <OrganicSplit go={go}/>
      <CertsMarquee/>
      <Testimonials/>
      <GrowBand/>
      <JournalSection go={go}/>
      <CatalogueBand/>
      <NewsletterBand/>
      <FAQSection/>
    </main>
  );
}

Object.assign(window, { HomePage });
