// LogoMark.jsx
import React from "react";
import { THEME as COLORS } from "./db.js";

export function LogoMark({ size = 44 }) {
  const petal = "M 0,0 C -13,-13 -13,-40 0,-55 C 13,-40 13,-13 0,0 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" fill="none">
      <g transform="translate(55,55)">
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d={petal} fill={COLORS.gold} stroke={COLORS.goldDim} strokeWidth="0.5" opacity={i % 2 === 0 ? 0.95 : 0.55} />
          </g>
        ))}
        <circle cx="0" cy="0" r="7" fill={COLORS.gold} />
      </g>
    </svg>
  );
}

export function LogoLockup({ height = 44 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden" }}>
      <LogoMark size={height} />
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(20px, 4.5vw, 22px)",
        letterSpacing: "0.14em",
        color: COLORS.gold,
        fontWeight: 600,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        JASBELA
      </span>
    </div>
  );
}