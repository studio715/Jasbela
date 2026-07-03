// Header.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  Menu, X, Search, Heart, ShoppingCart, User, Plus, Minus, Trash2, Check,
  Shirt, Gem, Sparkles, ShoppingBag, Footprints,
} from "lucide-react";
import { THEME as COLORS, SITE, CATEGORIES, PRODUCTS } from "./db.js";
import { currency } from "./utils.js";

const ICON_COMPONENTS = {
  sparkles: Sparkles,
  shirt: Shirt,
  gem: Gem,
  "shopping-bag": ShoppingBag,
  footprints: Footprints,
};

/* ---------------------------------------------------------------
   Shared store — cart, wishlist, category, search — lives here so
   ANY page can read/write it via useStore(), and <Header /> needs
   zero props to be fully functional everywhere.
--------------------------------------------------------------- */
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [wishlist, setWishlist] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    const p = PRODUCTS.find((p) => p.id === id);
    if (p) setToast(p.name + " added to bag");
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

  const toggleWishlist = (id) => {
    const p = PRODUCTS.find((p) => p.id === id);
    setWishlist((w) => {
      const next = { ...w };
      if (next[id]) { delete next[id]; if (p) setToast(p.name + " removed from wishlist"); }
      else { next[id] = true; if (p) setToast(p.name + " added to wishlist"); }
      return next;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartItems = Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === Number(id)), qty }));
  const subtotal = cartItems.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);

  const wishlistItems = PRODUCTS.filter((p) => wishlist[p.id]);
  const wishlistCount = wishlistItems.length;

  const value = {
    category, setCategory,
    query, setQuery,
    cart, cartItems, cartCount, subtotal, addToCart, changeQty, removeFromCart,
    wishlist, wishlistItems, wishlistCount, toggleWishlist,
    cartOpen, setCartOpen,
    wishlistOpen, setWishlistOpen,
    toast, setToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

/* Minimal inline social glyphs */
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

const CategoryGlyph = ({ category, size = 24 }) => {
  const iconName = CATEGORIES.find((c) => c.id === category)?.icon;
  const Icon = ICON_COMPONENTS[iconName] || Sparkles;
  return <Icon size={size} strokeWidth={1} color={COLORS.gold} style={{ opacity: 0.55 }} />;
};

/* =================================================================
   Header — fully self-contained. Drop it into any page with zero
   props: <Header />. It reads/writes everything through useStore().
================================================================= */
export default function Header({ showCategoryRail = true }) {
  const {
    category, setCategory, setQuery,
    cartCount, wishlistCount,
    cartOpen, setCartOpen,
    wishlistOpen, setWishlistOpen,
  } = useStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.focus();
      mobileSearchRef.current?.focus();
    }
  }, [searchOpen]);

  const handleQueryChange = (val) => {
    setLocalQuery(val);
    setQuery(val);
  };

  const navLinks = CATEGORIES.filter((c) => c.id !== "all");
  const Icon = (name) => ICON_COMPONENTS[name];

  return (
    <>
      <style>{`
        @media (max-width: 860px){ .jb-desktop-only{ display:none !important; } }
        @media (min-width: 861px){ .jb-mobile-only{ display:none !important; } }
        @media (max-width: 480px){ .jb-header-icons { gap: 1px !important; } }
        .jb-scroll::-webkit-scrollbar { height: 2px; width: 6px; }
        .jb-scroll::-webkit-scrollbar-thumb { background: ${COLORS.goldDim}; border-radius: 4px; }
        .jb-slide-left { animation: jbSlideLeft 0.3s ease; }
        @keyframes jbSlideLeft { from { transform: translateX(-100%);} to { transform: translateX(0);} }
        .jb-fade-in { animation: jbFadeIn 0.35s ease; }
        @keyframes jbFadeIn { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:none;} }
        .jb-btn-gold { background:${COLORS.gold}; color:#161310; border:1px solid ${COLORS.gold}; }
        .jb-btn-gold:hover { background:${COLORS.goldLight}; border-color:${COLORS.goldLight}; }
        .jb-btn-outline { background:transparent; color:${COLORS.ivory}; border:1px solid ${COLORS.gold}; }
        .jb-btn-outline:hover { background:rgba(173,138,68,0.12); }
      `}</style>

      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 95, background: "rgba(251,249,243,0.98)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${COLORS.line}`, width: "100%" }}>
        <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.line}`, textAlign: "center", padding: "6px 12px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.gold }}>
          {SITE.announcement}
        </div>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <button className="jb-mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu"
            style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer", padding: 6 }}>
            <Menu size={22} strokeWidth={1.4} />
          </button>

          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flex: 1, minWidth: 0, textDecoration: "none" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(23px, 5vw, 26px)", letterSpacing: "0.18em", color: COLORS.gold, fontWeight: 600, whiteSpace: "nowrap" }}>{SITE.name}</span>
          </a>

          <nav className="jb-desktop-only" style={{ display: "flex", gap: 28 }}>
            {navLinks.map((c) => (
              <a key={c.id} href="#shop" onClick={() => setCategory(c.id)}
                style={{ color: category === c.id ? COLORS.gold : COLORS.ivory, textDecoration: "none", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 400, transition: "color .2s" }}>
                {c.label}
              </a>
            ))}
          </nav>

          <div className="jb-header-icons" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              {searchOpen && (
                <input ref={searchRef} value={localQuery} onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder={`Search ${SITE.name}`}
                  className="jb-desktop-only"
                  style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.line}`, color: COLORS.ivory, borderRadius: 20, padding: "7px 14px", fontSize: 13, width: 170, marginRight: 4, outline: "none", fontFamily: "Jost" }} />
              )}
              <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search"
                style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer", padding: "10px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {searchOpen ? <X size={20} strokeWidth={1.4} /> : <Search size={20} strokeWidth={1.4} />}
              </button>
            </div>

            <button aria-label="Account" style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer", padding: "10px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={20} strokeWidth={1.4} />
            </button>
            <button onClick={() => setWishlistOpen(true)} aria-label="Open wishlist" style={{ position: "relative", background: "none", border: "none", color: COLORS.ivory, cursor: "pointer", padding: "10px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={20} strokeWidth={1.4} fill={wishlistCount > 0 ? COLORS.rose : "none"} color={wishlistCount > 0 ? COLORS.rose : COLORS.ivory} />
              {wishlistCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, background: COLORS.rose, color: "#fff", fontSize: 10, fontWeight: 600, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {wishlistCount}
                </span>
              )}
            </button>
            <button onClick={() => setCartOpen(true)} aria-label="Open bag" style={{ position: "relative", background: "none", border: "none", color: COLORS.ivory, cursor: "pointer", padding: "10px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShoppingCart size={20} strokeWidth={1.4} />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, background: COLORS.gold, color: "#161310", fontSize: 10, fontWeight: 600, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Category rail */}
      {showCategoryRail && (
        <section style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 39, background: COLORS.surface, borderTop: `1px solid ${COLORS.line}`, width: "100%" }}>
          <div className="jb-scroll" style={{ maxWidth: 1240, margin: "0 auto", display: "flex", gap: 10, overflowX: "auto", padding: "12px 20px",  ...(window.innerWidth >= 768 && {justifyContent: "center",alignItems: "center",}), }}>
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              const CatIcon = Icon(c.icon);
              return (
                <a key={c.id} href="#shop" onClick={() => setCategory(c.id)}
                  style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, padding: "8px 16px", borderRadius: 20, border: `1px solid ${active ? COLORS.gold : COLORS.line}`, background: active ? "rgba(173,138,68,0.12)" : "transparent", color: active ? COLORS.gold : COLORS.muted, fontSize: 12, textDecoration: "none", letterSpacing: "0.04em", transition: "all .2s" }}>
                  {CatIcon && <CatIcon size={13} strokeWidth={1.4} />}
                  {c.label}
                </a>
              );
            })} 
          </div>
        </section>
      )}

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="jb-mobile-only jb-fade-in" style={{ position: "fixed", top: 96, left: 0, right: 0, zIndex: 96, background: COLORS.surface, borderBottom: `1px solid ${COLORS.line}`, padding: "12px 20px" }}>
          <input ref={mobileSearchRef} value={localQuery} onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={`Search ${SITE.name}`}
            style={{ width: "100%", boxSizing: "border-box", background: COLORS.surfaceAlt, border: `1px solid ${COLORS.line}`, color: COLORS.ivory, borderRadius: 20, padding: "10px 16px", fontSize: 14, outline: "none", fontFamily: "Jost" }} />
        </div>
      )}

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 97, display: "flex" }}>
          <div className="jb-slide-left" style={{ width: 280, background: COLORS.surface, height: "100%", padding: 24, borderRight: `1px solid ${COLORS.line}`, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: COLORS.gold, letterSpacing: "0.14em" }}>MENU</span>
              <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer" }} aria-label="Close menu"><X size={20} /></button>
            </div>
            {CATEGORIES.map((c) => {
              const CatIcon = Icon(c.icon);
              return (
                <a key={c.id} href="#shop" onClick={() => { setCategory(c.id); setMenuOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: `1px solid ${COLORS.line}`, color: COLORS.ivory, textDecoration: "none", fontSize: 15 }}>
                  {CatIcon && <CatIcon size={17} strokeWidth={1.3} color={COLORS.gold} />}
                  {c.label}
                </a>
              );
            })}
            <div style={{ marginTop: "auto", paddingTop: 24, borderTop: `1px solid ${COLORS.line}`, display: "flex", gap: 16 }}>
              {SITE.social.map((s) => <SocialIcon key={s} type={s} size={18} />)}
            </div>
          </div>
          <div onClick={() => setMenuOpen(false)} style={{ flex: 1, background: "rgba(0,0,0,0.6)" }} />
        </div>
      )}

      {/* Cart drawer */}
      <CartDrawer />
      {/* Wishlist drawer */}
      <WishlistDrawer />
      {/* Toast */}
      <ToastNotice />
    </>
  );
}

function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, cartCount, subtotal, changeQty, removeFromCart } = useStore();
  if (!cartOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 98, display: "flex", justifyContent: "flex-end" }}>
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
              <p style={{ marginTop: 14, fontSize: 14 }}>Your bag is empty.</p>
              <button onClick={() => setCartOpen(false)} className="jb-btn-outline" style={{ marginTop: 16, padding: "9px 20px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}>Continue shopping</button>
            </div>
          ) : cartItems.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: 12, padding: "16px 0", borderBottom: `1px solid ${COLORS.line}` }}>
              <div style={{ width: 64, height: 64, borderRadius: 4, background: COLORS.surfaceAlt, overflow: "hidden", flexShrink: 0 }}>
                {item.images?.[0]
                  ? <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><CategoryGlyph category={item.category} /></div>}
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
              <span>Shipping</span><span>{subtotal >= SITE.freeShippingThreshold ? "Complimentary" : currency(SITE.shippingFee)}</span>
            </div>
            <button className="jb-btn-gold" style={{ width: "100%", padding: "14px 0", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}>
              Checkout &bull; {currency(subtotal >= SITE.freeShippingThreshold ? subtotal : subtotal + SITE.shippingFee)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function WishlistDrawer() {
  const { wishlistOpen, setWishlistOpen, wishlistItems, wishlistCount, toggleWishlist, addToCart } = useStore();
  if (!wishlistOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 98, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={() => setWishlistOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
      <div className="jb-fade-in" style={{ position: "relative", width: "min(400px, 100%)", height: "100%", background: COLORS.surface, borderLeft: `1px solid ${COLORS.line}`, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px", borderBottom: `1px solid ${COLORS.line}` }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, color: COLORS.gold, display: "flex", alignItems: "center", gap: 8 }}>
            <Heart size={17} /> Wishlist ({wishlistCount})
          </span>
          <button onClick={() => setWishlistOpen(false)} style={{ background: "none", border: "none", color: COLORS.ivory, cursor: "pointer" }} aria-label="Close wishlist"><X size={20} /></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "10px 22px" }}>
          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
              <p style={{ marginTop: 14, fontSize: 14 }}>Nothing saved yet.</p>
              <button onClick={() => setWishlistOpen(false)} className="jb-btn-outline" style={{ marginTop: 16, padding: "9px 20px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}>Continue shopping</button>
            </div>
          ) : wishlistItems.map((item) => (
            <div key={item.id} style={{ display: "flex", gap: 12, padding: "16px 0", borderBottom: `1px solid ${COLORS.line}` }}>
              <div style={{ width: 64, height: 64, borderRadius: 4, background: COLORS.surfaceAlt, overflow: "hidden", flexShrink: 0 }}>
                {item.images?.[0]
                  ? <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><CategoryGlyph category={item.category} /></div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, marginBottom: 4 }}>{item.name}</p>
                <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "capitalize", marginBottom: 8 }}>{item.category}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: COLORS.gold }}>{currency(item.price)}</span>
                  <button onClick={() => addToCart(item.id)} aria-label="Add to bag"
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${COLORS.line}`, color: COLORS.ivory, padding: "5px 10px", borderRadius: 2, fontSize: 11.5, cursor: "pointer" }}>
                    <ShoppingCart size={12} /> Add to bag
                  </button>
                </div>
              </div>
              <button onClick={() => toggleWishlist(item.id)} aria-label="Remove from wishlist" style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", height: "fit-content" }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToastNotice() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="jb-fade-in" style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: COLORS.surface, border: `1px solid ${COLORS.gold}`, color: COLORS.ivory, padding: "12px 20px", borderRadius: 3, fontSize: 13, display: "flex", alignItems: "center", gap: 8, zIndex: 99 }}>
      <Check size={15} color={COLORS.gold} /> {toast}
    </div>
  );
}