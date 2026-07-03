import React, { useEffect, useState } from "react";
import { X, Heart, ShoppingCart, Plus, Minus, Star } from "lucide-react";
import { THEME as COLORS } from "./db.js";
import { currency, CATEGORY_DETAILS, DELIVERY_NOTE } from "./utils.js"; 
/* ---------------------------------------------------------------
   ProductDetails — full-screen overlay shown when a product card
   is clicked. Own component, driven entirely by props so it has
   no knowledge of cart/wishlist state beyond what it's handed.
--------------------------------------------------------------- */
export default function ProductDetails({
  product,
  onClose,
  onAddToCart,
  cartQty = 0,
  onIncrementQty,
  onDecrementQty,
  isWishlisted,
  onToggleWishlist,
}) {
  const [activeImage, setActiveImage] = useState(0);

  // Lock page scroll while the overlay is open, and reset image index
  // whenever a different product is opened.
  useEffect(() => {
    setActiveImage(0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [product?.id]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  const images = product.images?.length ? product.images : [];
  const details = CATEGORY_DETAILS[product.category] || [];
  const fullRating = Math.round(product.rating);

  return (
    <>
    <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
             
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />

        <div
        className="jb-fade-in jb-pd-scroll"
        style={{
            position: "relative",
            width: "min(1000px, 100%)",
            maxHeight: "100vh",
            overflowY: "auto",
            overflowX: "hidden",   // add this
            background: COLORS.surface,
            margin: "0 auto",
            boxShadow: "0 0 60px rgba(0,0,0,0.25)",
        }}
        >
        <style>{`
        .jb-pd-grid { display:grid; grid-template-columns: 1.1fr 1fr; gap: 40px; }
        .jb-pd-grid > div { min-width: 0; }
        @media (max-width: 760px){ .jb-pd-grid{ grid-template-columns: 1fr; gap:0; } }
        `}</style>

        <button onClick={onClose} aria-label="Close details"
          style={{ position: "sticky", top: 16, float: "right", marginRight: 16, marginTop: 16, zIndex: 5, background: COLORS.surface, border: `1px solid ${COLORS.line}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={18} color={COLORS.ivory} />
        </button>

        <div className="jb-pd-grid" style={{ padding: "28px 28px 40px", clear: "both" }}>
          {/* Gallery */}
          <div>
            <div style={{ aspectRatio: "1", borderRadius: 6, overflow: "hidden", background: COLORS.surfaceAlt, marginBottom: 12 }}>
              {images[activeImage] && (
                <img src={images[activeImage]} alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )}
            </div>
            {images.length > 1 && (
            <div style={{ display: "flex", gap: 10, overflowX: "auto", minWidth: 0 }}>
                {images.map((src, i) => (
                <button key={src} onClick={() => setActiveImage(i)} aria-label={`View image ${i + 1}`}
                    style={{ padding: 0, border: `2px solid ${activeImage === i ? COLORS.gold : "transparent"}`, borderRadius: 4, width: 68, height: 68, flexShrink: 0, cursor: "pointer", overflow: "hidden", background: COLORS.surfaceAlt }}>
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </button>
                ))}
            </div>
            )}
          </div>

          {/* Info */}
          <div style={{ paddingTop: 4 }}>
            <p style={{ fontSize: 11.5, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{product.category}</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 30, lineHeight: 1.15, margin: "0 0 10px", color: COLORS.ivory }}>{product.name}</h2>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 1 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} strokeWidth={1.5} fill={i < fullRating ? COLORS.gold : "none"} color={COLORS.gold} />
                ))}
              </div>
              <span style={{ fontSize: 12.5, color: COLORS.muted }}>{product.rating.toFixed(1)}</span>
              {product.tag && (
                <span style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2, background: product.tag === "sale" ? COLORS.rose : COLORS.gold, color: "#fff", marginLeft: 4 }}>
                  {product.tag === "sale" ? "Sale" : "New"}
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 24, color: COLORS.gold }}>{currency(product.price)}</span>
              {product.oldPrice && <span style={{ fontSize: 15, color: COLORS.muted, textDecoration: "line-through" }}>{currency(product.oldPrice)}</span>}
            </div>

            <p style={{ fontSize: 14, lineHeight: 1.75, color: COLORS.muted, marginBottom: 22 }}>{product.description}</p>

            {details.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 26px", display: "flex", flexDirection: "column", gap: 8 }}>
                {details.map((d) => (
                  <li key={d} style={{ fontSize: 13, color: COLORS.ivory, display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: COLORS.gold, marginTop: 2 }}>&#8226;</span>{d}
                  </li>
                ))}
                <li style={{ fontSize: 12.5, color: COLORS.muted, marginTop: 4 }}>{DELIVERY_NOTE}</li>
              </ul>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {cartQty > 0 ? (
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.line}`, borderRadius: 2 }}>
                  <button onClick={onDecrementQty} aria-label="Decrease quantity" style={{ background: "none", border: "none", color: COLORS.ivory, padding: "12px 16px", cursor: "pointer" }}><Minus size={14} /></button>
                  <span style={{ fontSize: 14, minWidth: 20, textAlign: "center" }}>{cartQty}</span>
                  <button onClick={onIncrementQty} aria-label="Increase quantity" style={{ background: "none", border: "none", color: COLORS.ivory, padding: "12px 16px", cursor: "pointer" }}><Plus size={14} /></button>
                </div>
              ) : (
                <button onClick={onAddToCart} className="jb-btn-gold"
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 28px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer", border: "none" }}>
                  <ShoppingCart size={16} /> Add to bag
                </button>
              )}

              <button onClick={onToggleWishlist}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: 2, cursor: "pointer", background: "transparent", border: `1px solid ${isWishlisted ? COLORS.rose : COLORS.line}`, color: isWishlisted ? COLORS.rose : COLORS.ivory }}>
                <Heart size={16} fill={isWishlisted ? COLORS.rose : "none"} />
                {isWishlisted ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}