import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Menu, X, Search, Heart, SlidersHorizontal,
  Star, Plus, Minus, Trash2, ArrowUpDown, ShoppingCart, User,
  Shirt, Gem, Sparkles, ShoppingBag, Footprints, Check,
  Mail, ChevronRight
} from "lucide-react";

/* ---------------------------------------------------------------
   JASBELA — single page storefront
   Palette drawn from the brand mark: ivory ground, warm antique
   gold, deep ink type, a whisper of blush for sale/new accents.
   NOTE: `ivory` below is repurposed as the primary TEXT color
   (dark ink) now that the theme is light — key name kept for
   minimal diff across the file.
--------------------------------------------------------------- */

const COLORS = {
  bg: "#FBF9F3",
  surface: "#FFFFFF",
  surfaceAlt: "#F3EDDF",
  line: "#E4DCC7",
  gold: "#AD8A44",
  goldLight: "#C7A25E",
  goldDim: "#8C6B33",
  ivory: "#241F18",
  muted: "#867A66",
  rose: "#A85D50",
};

/* Minimal inline social glyphs — avoids relying on brand icons that
   vary or go missing between lucide-react versions. */
function SocialIcon({ type, size = 16, color = COLORS.muted }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "instagram") return (
    <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill={color} stroke="none" /></svg>
  );
  if (type === "facebook") return (
    <svg {...common}><path d="M14 9h2V6h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14v-1.5c0-.4.3-1 1.5-1z" /></svg>
  );
  return (
    <svg {...common}><path d="M20 5.5c-.7.3-1.5.6-2.2.7.8-.5 1.4-1.2 1.7-2.1-.8.5-1.6.8-2.5 1a3.9 3.9 0 0 0-6.7 3.6A11.1 11.1 0 0 1 2.3 4.6a3.9 3.9 0 0 0 1.2 5.2c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.4 3.1 3.8-.6.2-1.2.2-1.8.1.5 1.6 2 2.7 3.7 2.7A7.9 7.9 0 0 1 1 18.6 11.1 11.1 0 0 0 7.3 20c7.1 0 11-6 11-11.1v-.5c.8-.6 1.4-1.2 1.9-2z" /></svg>
  );
}

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Jost:wght@300;400;500;600&display=swap');
`;

const CATEGORIES = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "clothing", label: "Clothing", icon: Shirt },
  { id: "jewelry", label: "Jewelry", icon: Gem },
  { id: "grooming", label: "Grooming", icon: Sparkles },
  { id: "bags", label: "Bags", icon: ShoppingBag },
  { id: "footwear", label: "Footwear", icon: Footprints },
];

const PRODUCTS = [
  { id: 1, name: "Silk Wrap Midi Dress", category: "clothing", price: 4999, oldPrice: null, rating: 4.7, tag: "new" },
  { id: 2, name: "Embroidered Anarkali Gown", category: "clothing", price: 7499, oldPrice: 9999, rating: 4.8, tag: "sale" },
  { id: 3, name: "Tailored Linen Blazer", category: "clothing", price: 5299, oldPrice: null, rating: 4.5, tag: null },
  { id: 4, name: "Chiffon Co-ord Set", category: "clothing", price: 3799, oldPrice: null, rating: 4.6, tag: "new" },
  { id: 5, name: "Kundan Necklace Set", category: "jewelry", price: 6999, oldPrice: 8999, rating: 4.9, tag: "sale" },
  { id: 6, name: "Pearl Drop Earrings", category: "jewelry", price: 1899, oldPrice: null, rating: 4.6, tag: null },
  { id: 7, name: "Layered Chain Bracelet", category: "jewelry", price: 2299, oldPrice: null, rating: 4.4, tag: "new" },
  { id: 8, name: "Diamond Cut Nose Pin", category: "jewelry", price: 1299, oldPrice: null, rating: 4.3, tag: null },
  { id: 9, name: "Rose Gold Hair Serum", category: "grooming", price: 899, oldPrice: null, rating: 4.5, tag: null },
  { id: 10, name: "Vitamin C Radiance Cream", category: "grooming", price: 1199, oldPrice: null, rating: 4.7, tag: "new" },
  { id: 11, name: "Silk Press Hair Straightener", category: "grooming", price: 3499, oldPrice: 4299, rating: 4.6, tag: "sale" },
  { id: 12, name: "Luxury Perfume Oil Duo", category: "grooming", price: 2199, oldPrice: null, rating: 4.8, tag: null },
  { id: 13, name: "Structured Handbag", category: "bags", price: 4499, oldPrice: null, rating: 4.5, tag: null },
  { id: 14, name: "Embroidered Potli Clutch", category: "bags", price: 2799, oldPrice: null, rating: 4.4, tag: "new" },
  { id: 15, name: "Leather Tote", category: "bags", price: 5999, oldPrice: 7499, rating: 4.7, tag: "sale" },
  { id: 16, name: "Embellished Block Heels", category: "footwear", price: 3299, oldPrice: null, rating: 4.3, tag: null },
];

const currency = (n) => "\u20B9" + n.toLocaleString("en-IN");

/* Signature line-art flower + diamond, echoing the logo mark without
   reproducing it — used as a quiet recurring motif. */
function SignatureFlower({ w = 220, opacity = 1, stroke = COLORS.gold, className = "" }) {
  return (
    <svg className={className} width={w} height={w} viewBox="0 0 200 200" fill="none" style={{ opacity }}>
      <g stroke={stroke} strokeWidth="1.1" strokeLinecap="round">
        <path d="M100 40 C 84 55, 84 78, 100 92 C 116 78, 116 55, 100 40 Z" />
        <path d="M100 40 C 116 55, 116 78, 100 92 C 84 78, 84 55, 100 40 Z" opacity="0.5" />
        <path d="M60 60 C 70 68, 84 80, 100 92 C 84 88, 66 86, 55 78 C 48 72, 52 64, 60 60 Z" />
        <path d="M140 60 C 130 68, 116 80, 100 92 C 116 88, 134 86, 145 78 C 152 72, 148 64, 140 60 Z" />
        <path d="M70 100 C 82 92, 92 92, 100 92 C 92 100, 84 108, 70 112 C 62 114, 62 104, 70 100 Z" />
        <path d="M130 100 C 118 92, 108 92, 100 92 C 108 100, 116 108, 130 112 C 138 114, 138 104, 130 100 Z" />
        <circle cx="100" cy="92" r="5" />
        <path d="M100 97 L 100 150" strokeWidth="0.8" />
        <path d="M100 150 L 88 168 M100 150 L 112 168" strokeWidth="0.8" />
        <path d="M92 142 L100 128 L108 142 L100 152 Z" strokeWidth="0.9" />
      </g>
    </svg>
  );
}

function StarRow({ rating }) {
  const full = Math.round(rating);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={12} strokeWidth={1.5}
            fill={i < full ? COLORS.gold : "none"}
            color={COLORS.gold} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: "Jost" }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function CategoryGlyph({ category, size = 46 }) {
  const map = { clothing: Shirt, jewelry: Gem, grooming: Sparkles, bags: ShoppingBag, footwear: Footprints };
  const Icon = map[category] || Sparkles;
  return <Icon size={size} strokeWidth={1} color={COLORS.gold} style={{ opacity: 0.55 }} />;
}

export default function JasbelaStore() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(9999);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [cart, setCart] = useState({});
  const [toast, setToast] = useState("");
  const searchRef = useRef(null);

  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    const p = PRODUCTS.find((p) => p.id === id);
    setToast(p.name + " added to bag");
  };
  const changeQty = (id, delta) => {
    setCart((c) => {
      const next = { ...c };
      const q = (next[id] || 0) + delta;
      if (q <= 0) delete next[id]; else next[id] = q;
      return next;
    });
  };
  const removeFromCart = (id) => setCart((c) => { const n = { ...c }; delete n[id]; return n; });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartItems = Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === Number(id)), qty }));
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.price <= maxPrice);
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (onlyNew) list = list.filter((p) => p.tag === "new");
    if (onlySale) list = list.filter((p) => p.tag === "sale");
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.includes(q));
    }
    switch (sortBy) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "new": list = [...list].sort((a, b) => (b.tag === "new") - (a.tag === "new")); break;
      default: break;
    }
    return list;
  }, [category, sortBy, maxPrice, onlyNew, onlySale, query]);

  const navLinks = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div style={{ background: COLORS.bg, color: COLORS.ivory, minHeight: "100%", fontFamily: "Jost, sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{FONTS}{`
        * { box-sizing: border-box; }
        .jb-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .jb-scroll::-webkit-scrollbar-thumb { background: ${COLORS.goldDim}; border-radius: 4px; }
        .jb-fade-in { animation: jbFadeIn 0.35s ease; }
        @keyframes jbFadeIn { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:none;} }
        .jb-slide-left { animation: jbSlideLeft 0.3s ease; }
        @keyframes jbSlideLeft { from { transform: translateX(-100%);} to { transform: translateX(0);} }
        .jb-btn-gold { background:${COLORS.gold}; color:#161310; border:1px solid ${COLORS.gold}; }
        .jb-btn-gold:hover { background:${COLORS.goldLight}; border-color:${COLORS.goldLight}; }
        .jb-btn-outline { background:transparent; color:${COLORS.ivory}; border:1px solid ${COLORS.gold}; }
        .jb-btn-outline:hover { background:rgba(173,138,68,0.12); }
        .jb-card:hover .jb-card-img { transform: scale(1.04); }
        .jb-card:hover .jb-card-add { opacity:1; transform: translateY(0); }
        input[type=range].jb-range { accent-color:${COLORS.gold}; }
        @media (max-width: 860px){ .jb-desktop-only{ display:none !important; } }
        @media (min-width: 861px){ .jb-mobile-only{ display:none !important; } }
        @media (max-width: 720px){
          .jb-footer-grid{ grid-template-columns: 1fr 1fr !important; }
          .jb-hero{ flex-direction: column !important; text-align:center; align-items:center !important; }
        }
        @media (max-width: 480px){
          .jb-footer-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Announcement bar */}
      <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.line}`, textAlign: "center", padding: "8px 12px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.gold }}>
        Complimentary shipping on orders over {currency(4999)}
      </div>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(251,249,243,0.92)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <button className="jb-mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu"
            style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer", padding: 6 }}>
            <Menu size={22} strokeWidth={1.4} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <SignatureFlower w={26} opacity={0.9} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, letterSpacing: "0.18em", color: COLORS.gold, fontWeight: 600 }}>JASBELA</span>
          </div>

          <nav className="jb-desktop-only" style={{ display: "flex", gap: 28 }}>
            {navLinks.map((c) => (
              <a key={c.id} href="#shop" onClick={() => setCategory(c.id)}
                style={{ color: category === c.id ? COLORS.gold : COLORS.ivory, textDecoration: "none", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 400, transition: "color .2s" }}>
                {c.label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              {searchOpen && (
                <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search JASBELA"
                  style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.line}`, color: COLORS.ivory, borderRadius: 20, padding: "7px 14px", fontSize: 13, width: 170, marginRight: 4, outline: "none", fontFamily: "Jost" }} />
              )}
              <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search"
                style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer", padding: 6 }}>
                {searchOpen ? <X size={19} strokeWidth={1.4} /> : <Search size={19} strokeWidth={1.4} />}
              </button>
            </div>
            <button className="jb-desktop-only" aria-label="Account" style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer", padding: 6 }}>
              <User size={19} strokeWidth={1.4} />
            </button>
            <button onClick={() => setCartOpen(true)} aria-label="Open bag" style={{ position: "relative", background: "none", border: "none", color: COLORS.ivory, cursor: "pointer", padding: 6 }}>
              <ShoppingCart size={20} strokeWidth={1.4} />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: 0, right: 0, background: COLORS.gold, color: "#161310", fontSize: 10, fontWeight: 600, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex" }}>
          <div className="jb-slide-left" style={{ width: 280, background: COLORS.surface, height: "100%", padding: 24, borderRight: `1px solid ${COLORS.line}`, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: COLORS.gold, letterSpacing: "0.14em" }}>MENU</span>
              <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer" }} aria-label="Close menu"><X size={20} /></button>
            </div>
            {CATEGORIES.map((c) => (
              <a key={c.id} href="#shop" onClick={() => { setCategory(c.id); setMenuOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: `1px solid ${COLORS.line}`, color: COLORS.ivory, textDecoration: "none", fontSize: 15 }}>
                <c.icon size={17} strokeWidth={1.3} color={COLORS.gold} />
                {c.label}
              </a>
            ))}
            <div style={{ marginTop: "auto", paddingTop: 24, borderTop: `1px solid ${COLORS.line}`, display: "flex", gap: 16 }}>
              <SocialIcon type="instagram" size={18} />
              <SocialIcon type="facebook" size={18} />
              <SocialIcon type="twitter" size={18} />
            </div>
          </div>
          <div onClick={() => setMenuOpen(false)} style={{ flex: 1, background: "rgba(0,0,0,0.6)" }} />
        </div>
      )}

      {/* Hero */}
      <section className="jb-hero" style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "70px 20px 90px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, overflow: "hidden" }}>
        <div style={{ maxWidth: 560, zIndex: 2 }}>
          <p style={{ letterSpacing: "0.28em", fontSize: 12, color: COLORS.gold, textTransform: "uppercase", marginBottom: 18 }}>Womenswear &amp; Adornment</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "clamp(38px, 6vw, 64px)", lineHeight: 1.08, margin: "0 0 22px", color: COLORS.ivory }}>
            Adorn every<br /><em style={{ fontStyle: "italic", color: COLORS.gold }}>layer of you</em>
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 15, lineHeight: 1.7, maxWidth: 420, marginBottom: 32 }}>
            From tailored silhouettes to fine jewelry and quiet luxury grooming — a wardrobe built around you, curated in one place.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#shop" className="jb-btn-gold" style={{ padding: "13px 30px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", cursor: "pointer", borderRadius: 2 }}>Shop new arrivals</a>
            <a href="#shop" onClick={() => setCategory("all")} className="jb-btn-outline" style={{ padding: "13px 30px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", cursor: "pointer", borderRadius: 2 }}>Explore all</a>
          </div>
        </div>
        <div className="jb-desktop-only" style={{ position: "relative", flexShrink: 0 }}>
          <SignatureFlower w={340} opacity={0.5} />
        </div>
        <div style={{ position: "absolute", left: -60, bottom: -80, opacity: 0.06, pointerEvents: "none" }}>
          <SignatureFlower w={420} />
        </div>
      </section>

      {/* Category rail */}
      <section style={{ borderTop: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}`, background: COLORS.surface }}>
        <div className="jb-scroll" style={{ maxWidth: 1240, margin: "0 auto", display: "flex", gap: 10, overflowX: "auto", padding: "16px 20px" }}>
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <a key={c.id} href="#shop" onClick={() => setCategory(c.id)}
                style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, padding: "9px 18px", borderRadius: 20, border: `1px solid ${active ? COLORS.gold : COLORS.line}`, background: active ? "rgba(173,138,68,0.12)" : "transparent", color: active ? COLORS.gold : COLORS.muted, fontSize: 13, textDecoration: "none", letterSpacing: "0.04em", transition: "all .2s" }}>
                <c.icon size={14} strokeWidth={1.4} />
                {c.label}
              </a>
            );
          })}
        </div>
      </section>

      {/* Shop */}
      <section id="shop" style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 20px 20px", display: "flex", gap: 36 }}>
        {/* Filter sidebar - desktop */}
        <aside className="jb-desktop-only" style={{ width: 220, flexShrink: 0 }}>
          <FilterPanel {...{ maxPrice, setMaxPrice, onlyNew, setOnlyNew, onlySale, setOnlySale }} />
        </aside>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26, flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: COLORS.muted, fontSize: 13 }}>
              Showing <span style={{ color: COLORS.ivory }}>{filtered.length}</span> of {PRODUCTS.length} pieces
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="jb-mobile-only" onClick={() => setFilterOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${COLORS.line}`, color: COLORS.ivory, padding: "8px 14px", borderRadius: 2, fontSize: 12, cursor: "pointer" }}>
                <SlidersHorizontal size={14} /> Filter
              </button>
              <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
              <SignatureFlower w={70} opacity={0.4} />
              <p style={{ marginTop: 14, fontSize: 14 }}>No pieces match those filters just yet.</p>
              <button onClick={() => { setCategory("all"); setMaxPrice(9999); setOnlyNew(false); setOnlySale(false); setQuery(""); }}
                className="jb-btn-outline" style={{ marginTop: 16, padding: "9px 20px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 22 }}>
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={() => addToCart(p.id)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-end" }}>
          <div onClick={() => setFilterOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
          <div className="jb-fade-in" style={{ position: "relative", width: "100%", background: COLORS.surface, borderTop: `1px solid ${COLORS.line}`, borderRadius: "14px 14px 0 0", padding: 24, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: COLORS.gold }}>Filter &amp; sort</span>
              <button onClick={() => setFilterOpen(false)} style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer" }} aria-label="Close filters"><X size={20} /></button>
            </div>
            <FilterPanel {...{ maxPrice, setMaxPrice, onlyNew, setOnlyNew, onlySale, setOnlySale }} />
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 10 }}>Sort by</p>
              <SortSelect sortBy={sortBy} setSortBy={setSortBy} full />
            </div>
            <button onClick={() => setFilterOpen(false)} className="jb-btn-gold" style={{ width: "100%", marginTop: 22, padding: "13px 0", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}>
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}

      {/* Promo / craft banner */}
      <section style={{ borderTop: `1px solid ${COLORS.line}`, marginTop: 60, background: COLORS.surface }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 30, textAlign: "center", flexDirection: "column" }}>
          <SignatureFlower w={54} opacity={0.7} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 500, maxWidth: 640, lineHeight: 1.3 }}>
            Every piece chosen for the woman who layers meaning into what she wears
          </h2>
          <p style={{ color: COLORS.muted, fontSize: 14, maxWidth: 480, lineHeight: 1.7 }}>
            Small-batch clothing, fine jewelry and considered grooming — sourced with the same care as the mark we sign it with.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${COLORS.line}`, marginTop: 20 }}>
        <div className="jb-footer-grid" style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 20px 30px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <SignatureFlower w={22} opacity={0.8} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: COLORS.gold, letterSpacing: "0.14em" }}>JASBELA</span>
            </div>
            <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>Clothing, jewelry and grooming for every layer of her world.</p>
            <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
              <SocialIcon type="instagram" size={16} />
              <SocialIcon type="facebook" size={16} />
              <SocialIcon type="twitter" size={16} />
            </div>
          </div>
          <FooterCol title="Shop" items={["Clothing", "Jewelry", "Grooming", "Bags", "Footwear"]} />
          <FooterCol title="Help" items={["Shipping", "Returns", "Size guide", "Contact us"]} />
          <div>
            <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.gold, marginBottom: 14 }}>Stay in touch</p>
            <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 14 }}>New arrivals and quiet sales, sent occasionally.</p>
            <div style={{ display: "flex", border: `1px solid ${COLORS.line}`, borderRadius: 2, overflow: "hidden" }}>
              <input placeholder="Your email" style={{ flex: 1, background: "transparent", border: "none", color: COLORS.ivory, padding: "11px 12px", fontSize: 13, outline: "none", fontFamily: "Jost" }} />
              <button aria-label="Subscribe" style={{ background: COLORS.gold, border: "none", padding: "0 14px", cursor: "pointer" }}><Mail size={15} color="#161310" /></button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.line}`, padding: "18px 20px", maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: COLORS.muted, fontSize: 12 }}>&copy; {new Date().getFullYear()} JASBELA. All rights reserved.</span>
          <span style={{ color: COLORS.muted, fontSize: 12 }}>Crafted with care, worn with intent.</span>
        </div>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", justifyContent: "flex-end" }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
          <div className="jb-fade-in" style={{ position: "relative", width: "min(400px, 100%)", height: "100%", background: COLORS.surface, borderLeft: `1px solid ${COLORS.line}`, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px", borderBottom: `1px solid ${COLORS.line}` }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, color: COLORS.gold, display: "flex", alignItems: "center", gap: 8 }}>
                <ShoppingCart size={17} /> Your bag ({cartCount})
              </span>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer" }} aria-label="Close bag"><X size={20} /></button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "10px 22px" }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
                  <SignatureFlower w={60} opacity={0.35} />
                  <p style={{ marginTop: 14, fontSize: 14 }}>Your bag is empty.</p>
                  <button onClick={() => setCartOpen(false)} className="jb-btn-outline" style={{ marginTop: 16, padding: "9px 20px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}>Continue shopping</button>
                </div>
              ) : cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: 12, padding: "16px 0", borderBottom: `1px solid ${COLORS.line}` }}>
                  <div style={{ width: 64, height: 64, borderRadius: 4, background: COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CategoryGlyph category={item.category} size={24} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, marginBottom: 4 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "capitalize", marginBottom: 8 }}>{item.category}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.line}`, borderRadius: 2 }}>
                        <button onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity" style={{ background: "none", border: "none", color: COLORS.ivory, padding: "4px 8px", cursor: "pointer" }}><Minus size={12} /></button>
                        <span style={{ fontSize: 12, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)} aria-label="Increase quantity" style={{ background: "none", border: "none", color: COLORS.ivory, padding: "4px 8px", cursor: "pointer" }}><Plus size={12} /></button>
                      </div>
                      <span style={{ fontSize: 13, color: COLORS.gold }}>{currency(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} aria-label="Remove item" style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", height: "fit-content" }}><Trash2 size={15} /></button>
                </div>
              ))}
            </div>

            {cartItems.length > 0 && (
              <div style={{ padding: "18px 22px 24px", borderTop: `1px solid ${COLORS.line}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: COLORS.muted }}>
                  <span>Subtotal</span><span style={{ color: COLORS.ivory }}>{currency(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 12, color: COLORS.muted }}>
                  <span>Shipping</span><span>{subtotal >= 4999 ? "Complimentary" : currency(149)}</span>
                </div>
                <button className="jb-btn-gold" style={{ width: "100%", padding: "14px 0", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}>
                  Checkout &bull; {currency(subtotal >= 4999 ? subtotal : subtotal + 149)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="jb-fade-in" style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: COLORS.surface, border: `1px solid ${COLORS.gold}`, color: COLORS.ivory, padding: "12px 20px", borderRadius: 3, fontSize: 13, display: "flex", alignItems: "center", gap: 8, zIndex: 80 }}>
          <Check size={15} color={COLORS.gold} /> {toast}
        </div>
      )}
    </div>
  );
}

function FilterPanel({ maxPrice, setMaxPrice, onlyNew, setOnlyNew, onlySale, setOnlySale }) {
  return (
    <div>
      <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.gold, marginBottom: 16 }}>Filter</p>
      <div style={{ marginBottom: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: COLORS.muted, marginBottom: 8 }}>
          <span>Max price</span><span style={{ color: COLORS.ivory }}>{currency(maxPrice)}</span>
        </div>
        <input className="jb-range" type="range" min="500" max="9999" step="100" value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%" }} />
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, marginBottom: 14, cursor: "pointer", color: COLORS.ivory }}>
        <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} style={{ accentColor: COLORS.gold, width: 15, height: 15 }} />
        New arrivals only
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, cursor: "pointer", color: COLORS.ivory }}>
        <input type="checkbox" checked={onlySale} onChange={(e) => setOnlySale(e.target.checked)} style={{ accentColor: COLORS.gold, width: 15, height: 15 }} />
        On sale only
      </label>
    </div>
  );
}

function SortSelect({ sortBy, setSortBy, full }) {
  return (
    <div style={{ position: "relative", width: full ? "100%" : "auto" }}>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
        style={{ appearance: "none", background: "transparent", border: `1px solid ${COLORS.line}`, color: COLORS.ivory, padding: "8px 32px 8px 14px", borderRadius: 2, fontSize: 12, cursor: "pointer", width: full ? "100%" : "auto", fontFamily: "Jost" }}>
        <option style={{ background: COLORS.surface }} value="featured">Featured</option>
        <option style={{ background: COLORS.surface }} value="price-asc">Price: low to high</option>
        <option style={{ background: COLORS.surface }} value="price-desc">Price: high to low</option>
        <option style={{ background: COLORS.surface }} value="rating">Top rated</option>
        <option style={{ background: COLORS.surface }} value="new">Newest</option>
      </select>
      <ArrowUpDown size={12} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: COLORS.muted }} />
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  const [wish, setWish] = useState(false);
  return (
    <div className="jb-card jb-fade-in" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", aspectRatio: "1", borderRadius: 4, overflow: "hidden", background: `radial-gradient(circle at 50% 40%, ${COLORS.surfaceAlt}, ${COLORS.surface})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <div className="jb-card-img" style={{ transition: "transform .4s ease" }}>
          <CategoryGlyph category={product.category} size={54} />
        </div>
        {product.tag && (
          <span style={{ position: "absolute", top: 10, left: 10, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 2, background: product.tag === "sale" ? COLORS.rose : COLORS.gold, color: "#1A1310" }}>
            {product.tag === "sale" ? "Sale" : "New"}
          </span>
        )}
        <button onClick={() => setWish((w) => !w)} aria-label="Toggle wishlist"
          style={{ position: "absolute", top: 8, right: 8, background: "rgba(10,9,8,0.55)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Heart size={14} strokeWidth={1.5} fill={wish ? COLORS.rose : "none"} color={wish ? COLORS.rose : COLORS.ivory} />
        </button>
        <button onClick={onAdd} className="jb-card-add"
          style={{ position: "absolute", bottom: 10, left: 10, right: 10, background: COLORS.gold, color: "#161310", border: "none", padding: "9px 0", fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer", opacity: 0, transform: "translateY(6px)", transition: "all .25s ease" }}>
          Add to bag
        </button>
      </div>
      <p style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{product.category}</p>
      <p style={{ fontSize: 14.5, marginBottom: 6, lineHeight: 1.3 }}>{product.name}</p>
      <StarRow rating={product.rating} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
        <span style={{ fontSize: 15, color: COLORS.gold }}>{currency(product.price)}</span>
        {product.oldPrice && <span style={{ fontSize: 12.5, color: COLORS.muted, textDecoration: "line-through" }}>{currency(product.oldPrice)}</span>}
      </div>
    </div>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.gold, marginBottom: 14 }}>{title}</p>
      {items.map((it) => (
        <a key={it} href="#shop" style={{ display: "flex", alignItems: "center", gap: 4, color: COLORS.muted, fontSize: 13, textDecoration: "none", marginBottom: 10 }}>
          <ChevronRight size={11} /> {it}
        </a>
      ))}
    </div>
  );
}