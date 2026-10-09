import { useState } from "react";

/* ===== IMAGE SLOTS: put your files in  public/images/  =====
   Any missing file falls back to a painted background, so nothing breaks. */
export const IMG = {
  hero: "/images/hero-temple.jpg",
  mahavidyaBg: "/images/Cosmic_Dasa_Mahavidya_Temple_Mandala.png", // your image
  kamakhya: "/images/kamakhya.jpg",
  tarapith: "/images/tarapith.jpg",
  kalighat: "/images/kalighat.jpg",
  dakshineswar: "/images/dakshineswar.jpg",
  devi: (name) => `/images/devis/${name.toLowerCase().replace(/ /g, "-")}.jpg`,
};

/* ===== palette: ink stone, sindoor red, antique gold, parchment ===== */
export const C = { ink: "#1b1410", red: "#9e2a1e", gold: "#c9993a", parchment: "#f3e9d2", sand: "#d9c3a0" };
export const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
export const sans = { fontFamily: "'Hind', system-ui, sans-serif" };

/* Image with painted fallback */
export function Pic({ src, alt, className = "", bg, children }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: bg || C.ink }}>
      {!bad && <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className="absolute inset-0 h-full w-full object-cover" />}
      {bad && children}
    </div>
  );
}

/* Gopuram (temple tower) silhouette */
export function Gopuram({ className = "" }) {
  return (
    <svg viewBox="0 0 400 300" className={className} fill="currentColor" aria-hidden>
      <rect x="40" y="262" width="320" height="38" />
      <polygon points="60,262 340,262 320,215 80,215" />
      <polygon points="90,215 310,215 292,175 108,175" />
      <polygon points="118,175 282,175 268,140 132,140" />
      <polygon points="142,140 258,140 248,108 152,108" />
      <polygon points="162,108 238,108 230,80 170,80" />
      <polygon points="178,80 222,80 214,56 186,56" />
      <ellipse cx="200" cy="46" rx="16" ry="10" />
      <rect x="198" y="14" width="4" height="30" />
    </svg>
  );
}

/* Lotus mandala line art */
export function Mandala({ className = "" }) {
  return (
    <svg viewBox="0 0 500 500" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <circle cx="250" cy="250" r="240" />
      <circle cx="250" cy="250" r="225" strokeDasharray="2 8" />
      {[...Array(16)].map((_, i) => <ellipse key={i} cx="250" cy="110" rx="26" ry="82" transform={`rotate(${i * 22.5} 250 250)`} />)}
      {[...Array(8)].map((_, i) => <ellipse key={"b" + i} cx="250" cy="170" rx="18" ry="52" transform={`rotate(${i * 45 + 22.5} 250 250)`} />)}
      <circle cx="250" cy="250" r="60" />
    </svg>
  );
}

/* Ornamental divider */
export function Divider({ color = C.gold }) {
  return (
    <div className="my-6 flex items-center gap-3" aria-hidden>
      <span className="h-px w-16" style={{ background: color }} />
      <span style={{ color }}>❖</span>
      <span className="h-px w-16" style={{ background: color }} />
    </div>
  );
}