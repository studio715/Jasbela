import React, { useMemo } from "react";
import {
  Heart, ShoppingCart, Star, ChevronRight, Mail,
} from "lucide-react";

import { THEME as COLORS, SITE, CATEGORIES, PRODUCTS, HERO_IMAGES } from "./db.js";
import { currency } from "./utils.js";
import Header, { useStore } from "./Header.jsx";
import ProductDetails from "./ProductDetails.jsx";

/* Signature line-art flower */
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

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Jost:wght@300;400;500;600&display=swap');
`;

export default function JasbelaStore() {
  const {
    category, setCategory,
    query,
    wishlist, toggleWishlist,
    addToCart,
    setSelectedProductId: _unused, // not used here — kept out intentionally
  } = useStore();

  const [maxPrice, setMaxPrice] = React.useState(9999);
  const [onlyNew, setOnlyNew] = React.useState(false);
  const [onlySale, setOnlySale] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("featured");
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  const [heroIndex, setHeroIndex] = React.useState(0);

  React.useEffect(() => {
    if (HERO_IMAGES.length < 2) return;
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % HERO_IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId) || null;

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

  return (
    <div style={{ background: COLORS.bg, color: COLORS.ivory, minHeight: "100%", fontFamily: "Jost, sans-serif", position: "relative", overflowX: "hidden", paddingBottom: 56 }}>
      <style>{FONTS}{`
        * { box-sizing: border-box; }
        .jb-card:hover .jb-card-img { transform: scale(1.04); }
        input[type=range].jb-range { accent-color:${COLORS.gold}; }
        @media (max-width: 720px){
          .jb-footer-grid{ grid-template-columns: 1fr 1fr !important; }
          .jb-hero{ flex-direction: column !important; text-align:center; align-items:center !important; }
        }
        @media (max-width: 480px){
          .jb-footer-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Header />

      {/* Hero */}
      <section className="jb-hero" style={{ position: "relative", maxWidth: 1240, margin: "0 auto", padding: "110px 20px 90px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, overflow: "hidden" }}>
        {HERO_IMAGES.length > 0 && (
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            {HERO_IMAGES.map((src, i) => (
              <img key={src + i} src={src} alt=""
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === heroIndex ? 1 : 0, transition: "opacity 1.8s ease-in-out" }} />
            ))}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, ${COLORS.bg} 18%, rgba(251,249,243,0.82) 35%, rgba(251, 249, 243, 0) 100%)` }} />
          </div>
        )}
        <div style={{ maxWidth: 560, zIndex: 2, position: "relative" }}>
          <p style={{ letterSpacing: "0.28em", fontSize: 12, color: COLORS.gold, textTransform: "uppercase", marginBottom: 18 }}>{SITE.hero.eyebrow}</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "clamp(38px, 6vw, 64px)", lineHeight: 1.08, margin: "0 0 22px", color: COLORS.ivory }}>
            {SITE.hero.titleLine1}<br /><em style={{ fontStyle: "italic", color: COLORS.gold }}>{SITE.hero.titleLine2}</em>
          </h1>
          <p style={{ color: "#000", fontSize: 15, lineHeight: 1.7, maxWidth: 420, marginBottom: 32 }}>{SITE.hero.subtitle}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#shop" className="jb-btn-gold" style={{ padding: "13px 30px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", cursor: "pointer", borderRadius: 2 }}>{SITE.hero.primaryCta}</a>
            <a href="#shop" onClick={() => setCategory("all")} className="jb-btn-outline" style={{ padding: "13px 30px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", cursor: "pointer", borderRadius: 2 }}>{SITE.hero.secondaryCta}</a>
          </div>
        </div>
        <div className="jb-desktop-only" style={{ position: "relative", flexShrink: 0, zIndex: 2 }}>
          <SignatureFlower w={340} opacity={0.5} />
        </div>
        <div style={{ position: "absolute", left: -60, bottom: -80, opacity: 0.06, pointerEvents: "none", zIndex: 1 }}>
          <SignatureFlower w={420} />
        </div>
      </section>

      {/* Shop */}
      <section id="shop" style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 20px 20px", display: "flex", gap: 36 }}>
        <aside className="jb-desktop-only" style={{ width: 220, flexShrink: 0 }}>
          <FilterPanel {...{ maxPrice, setMaxPrice, onlyNew, setOnlyNew, onlySale, setOnlySale }} />
        </aside>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26, flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: COLORS.muted, fontSize: 13 }}>
              Showing <span style={{ color: COLORS.ivory }}>{filtered.length}</span> of {PRODUCTS.length} pieces
            </p>
            <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.muted }}>
              <SignatureFlower w={70} opacity={0.4} />
              <p style={{ marginTop: 14, fontSize: 14 }}>No pieces match those filters just yet.</p>
              <button onClick={() => { setCategory("all"); setMaxPrice(9999); setOnlyNew(false); setOnlySale(false); }}
                className="jb-btn-outline" style={{ marginTop: 16, padding: "9px 20px", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer" }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 22 }}>
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={() => addToCart(p.id)}
                  isWishlisted={!!wishlist[p.id]}
                  onToggleWishlist={() => toggleWishlist(p.id)}
                  onOpenDetails={() => setSelectedProductId(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo banner */}
      <section style={{ borderTop: `1px solid ${COLORS.line}`, marginTop: 60, background: COLORS.surface }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "64px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 30, textAlign: "center", flexDirection: "column" }}>
          <SignatureFlower w={54} opacity={0.7} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 500, maxWidth: 640, lineHeight: 1.3 }}>{SITE.promo.heading}</h2>
          <p style={{ color: COLORS.muted, fontSize: 14, maxWidth: 480, lineHeight: 1.7 }}>{SITE.promo.body}</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${COLORS.line}`, marginTop: 20 }}>
        <div className="jb-footer-grid" style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 20px 30px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <SignatureFlower w={22} opacity={0.8} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: COLORS.gold, letterSpacing: "0.14em" }}>{SITE.name}</span>
            </div>
            <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>{SITE.footer.description}</p>
          </div>
          <FooterCol title="Shop" items={SITE.footer.shopLinks} />
          <FooterCol title="Help" items={SITE.footer.helpLinks} />
          <div>
            <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.gold, marginBottom: 14 }}>{SITE.footer.newsletterHeading}</p>
            <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 14 }}>{SITE.footer.newsletterText}</p>
            <div style={{ display: "flex", border: `1px solid ${COLORS.line}`, borderRadius: 2, overflow: "hidden" }}>
              <input placeholder={SITE.footer.newsletterPlaceholder} style={{ flex: 1, background: "transparent", border: "none", color: COLORS.ivory, padding: "11px 12px", fontSize: 13, outline: "none", fontFamily: "Jost" }} />
              <button aria-label="Subscribe" style={{ background: COLORS.gold, border: "none", padding: "0 14px", cursor: "pointer" }}><Mail size={15} color="#161310" /></button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.line}`, padding: "18px 20px", maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: COLORS.muted, fontSize: 12 }}>&copy; {new Date().getFullYear()} {SITE.footer.copyrightName || SITE.name}. All rights reserved.</span>
          <span style={{ color: COLORS.muted, fontSize: 12 }}>{SITE.footer.tagline}</span>
        </div>
      </footer>

      {/* Product details overlay */}
      {selectedProduct && (
        <ProductDetailsWrapper
          product={selectedProduct}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}

/* Bridges ProductDetails (prop-driven) to the shared store, so cart/wishlist
   clicks inside the modal update the same state everything else uses. */
function ProductDetailsWrapper({ product, onClose }) {
  const { cart, addToCart, changeQty, wishlist, toggleWishlist } = useStore();
  return (
    <ProductDetails
      product={product}
      onClose={onClose}
      onAddToCart={() => addToCart(product.id)}
      cartQty={cart[product.id] || 0}
      onIncrementQty={() => changeQty(product.id, 1)}
      onDecrementQty={() => changeQty(product.id, -1)}
      isWishlisted={!!wishlist[product.id]}
      onToggleWishlist={() => toggleWishlist(product.id)}
    />
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

function SortSelect({ sortBy, setSortBy }) {
  return (
    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
      style={{ appearance: "none", background: "transparent", border: `1px solid ${COLORS.line}`, color: COLORS.ivory, padding: "8px 32px 8px 14px", borderRadius: 2, fontSize: 12, cursor: "pointer", fontFamily: "Jost" }}>
      <option style={{ background: COLORS.surface }} value="featured">Featured</option>
      <option style={{ background: COLORS.surface }} value="price-asc">Price: low to high</option>
      <option style={{ background: COLORS.surface }} value="price-desc">Price: high to low</option>
      <option style={{ background: COLORS.surface }} value="rating">Top rated</option>
      <option style={{ background: COLORS.surface }} value="new">Newest</option>
    </select>
  );
}

function ProductCard({ product, onAdd, isWishlisted, onToggleWishlist, onOpenDetails }) {
  const thumb = product.images?.[0];
  const iconBtnStyle = {
    background: "rgba(255, 255, 255, 0.85)", border: "none", borderRadius: "50%",
    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  };
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
  return (
    <div className="jb-card jb-fade-in" onClick={onOpenDetails} style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}>
      <div style={{ position: "relative", aspectRatio: "1", borderRadius: 4, overflow: "hidden", background: `radial-gradient(circle at 50% 40%, ${COLORS.surfaceAlt}, ${COLORS.surface})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        {thumb && <img src={thumb} alt={product.name} className="jb-card-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s ease" }} />}
        {product.tag && (
          <span style={{ position: "absolute", top: 10, left: 10, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 2, background: product.tag === "sale" ? COLORS.rose : COLORS.gold, color: "#ffffff" }}>
            {product.tag === "sale" ? "Sale" : "New"}
          </span>
        )}
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <button onClick={stop(onToggleWishlist)} aria-label="Toggle wishlist" style={iconBtnStyle}>
            <Heart size={14} strokeWidth={1.5} fill={isWishlisted ? COLORS.rose : "none"} color={isWishlisted ? COLORS.rose : COLORS.ivory} />
          </button>
          <button onClick={stop(onAdd)} aria-label="Add to bag" style={iconBtnStyle}>
            <ShoppingCart size={14} strokeWidth={1.5} color={COLORS.ivory} />
          </button>
        </div>
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