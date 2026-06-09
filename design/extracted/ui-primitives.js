/* ============================================================
   TEAVISION — UI primitives → window
   ============================================================ */
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

/* ---------- Icons (simple line set) ---------- */
const I = {
  arrow:  <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUR:<path d="M7 17L17 7M7 7h10v10" />,
  cart:   <path d="M3 4h2l2.4 12.2a1 1 0 001 .8h8.6a1 1 0 001-.8L21 8H6M9 21a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" />,
  search: <g><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></g>,
  user:   <g><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></g>,
  menu:   <path d="M3 6h18M3 12h18M3 18h18" />,
  close:  <path d="M6 6l12 12M18 6L6 18" />,
  plus:   <path d="M12 5v14M5 12h14" />,
  minus:  <path d="M5 12h14" />,
  chevD:  <path d="M6 9l6 6 6-6" />,
  chevR:  <path d="M9 6l6 6-6 6" />,
  check:  <path d="M4 12l5 5L20 6" />,
  star:   <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17l-5.3 2.6 1.1-6L3.4 9.4l6-.8z" />,
  phone:  <path d="M5 4h4l2 5-3 2a14 14 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z" />,
  mail:   <g><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></g>,
  leaf:   <path d="M5 20c0-9 6-15 15-15 0 9-6 15-15 15zM5 20c4-4 7-6 11-8" />,
  flask:  <path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M7 15h10" />,
  medal:  <g><circle cx="12" cy="15" r="6"/><path d="M9 9L6 3M15 9l3-6M12 13l1 2 2 .2-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 15.2l2-.2z"/></g>,
  truck:  <g><rect x="1" y="6" width="13" height="11" rx="1"/><path d="M14 9h4l3 3v5h-7M5.5 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></g>,
  flag:   <path d="M5 21V4M5 4h12l-2 4 2 4H5" />,
  globe:  <g><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></g>,
  shield: <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />,
  spark:  <path d="M12 3v6m0 6v6M3 12h6m6 0h6M6 6l3 3m6 6l3 3M18 6l-3 3M6 18l3-3" />,
  drop:   <path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z" />,
  clock:  <g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>,
  scale:  <path d="M12 3v18M7 7h10M5 7l-2.5 6h5L5 7zm14 0l-2.5 6h5L19 7zM8 20h8" />,
  quote:  <path d="M9 7H5a2 2 0 00-2 2v3a2 2 0 002 2h2v3H4m15-10h-4a2 2 0 00-2 2v3a2 2 0 002 2h2v3h-3" />,
};
function Icon({ name, className, w }) {
  return (
    <svg className={className} width={w||20} height={w||20} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {I[name]}
    </svg>
  );
}

/* ---------- Logo (typographic wordmark — placeholder for real logo) ---------- */
function Logo({ on = "ink", className = "", onClick }) {
  const col = on === "paper" ? "var(--paper)" : "var(--ink)";
  const acc = on === "paper" ? "var(--gold)" : "var(--accent)";
  return (
    <button className={"tv-logo " + className} onClick={onClick} aria-label="Teavision home" style={{ color: col }}>
      <span className="tv-logo__mark" style={{ borderColor: acc }}>
        <Icon name="leaf" w={17} />
      </span>
      <span className="tv-logo__word serif">Teavision</span>
    </button>
  );
}

/* ---------- Placeholder image ---------- */
function Ph({ label, variant = "", className = "", style, children }) {
  return (
    <div className={`ph ${variant} ${className}`} style={style}>
      {label && <span className="ph__tag">{label}</span>}
      {children}
    </div>
  );
}

/* ---------- Reveal-on-scroll ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* AUD formatting */
function aud(n) { return "$" + Number(n).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

Object.assign(window, { Icon, I, Logo, Ph, useReveal, aud,
  useState, useEffect, useRef, useCallback, createContext, useContext });
