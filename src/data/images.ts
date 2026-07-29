// Generate procedural racket/pala images per product (MVP placeholder until real photos)
// Each brand gets its signature color; padel shapes differ, tennis is oval.
import { PRODUCTS, Product } from "./products";

const BRAND_COLORS: Record<string, { primary: string; accent: string }> = {
  Nox: { primary: "#e11d48", accent: "#f43f5e" },
  Bullpadel: { primary: "#0ea5e9", accent: "#38bdf8" },
  Head: { primary: "#f97316", accent: "#fb923c" },
  Adidas: { primary: "#111827", accent: "#4b5563" },
  Babolat: { primary: "#2563eb", accent: "#60a5fa" },
  Wilson: { primary: "#dc2626", accent: "#ef4444" },
  Siux: { primary: "#7c3aed", accent: "#a78bfa" },
  "Black Crown": { primary: "#0f172a", accent: "#475569" },
  StarVie: { primary: "#0891b2", accent: "#22d3ee" },
  Dunlop: { primary: "#65a30d", accent: "#a3e635" },
  Yonex: { primary: "#166534", accent: "#4ade80" },
  Tecnifibre: { primary: "#b91c1c", accent: "#f87171" },
  Varlion: { primary: "#eab308", accent: "#facc15" },
  "Drop Shot": { primary: "#1d4ed8", accent: "#60a5fa" },
  "Royal Padel": { primary: "#be123c", accent: "#f43f5e" },
  Kombat: { primary: "#ea580c", accent: "#fb923c" },
};

function padelShapePath(shape: string): string {
  // SVG path in a 200x260 viewBox; returns outline path of face
  switch (shape) {
    case "redonda":
      return "M100 20 C 45 20, 25 70, 25 130 C 25 195, 60 230, 100 230 C 140 230, 175 195, 175 130 C 175 70, 155 20, 100 20 Z";
    case "lagrima":
      return "M100 15 C 50 15, 30 70, 30 120 C 30 180, 65 225, 100 235 C 135 225, 170 180, 170 120 C 170 70, 150 15, 100 15 Z";
    case "diamante":
      return "M100 12 C 55 18, 32 65, 30 110 C 28 165, 60 215, 100 238 C 140 215, 172 165, 170 110 C 168 65, 145 18, 100 12 Z";
    case "hibrida":
      return "M100 14 C 52 16, 31 68, 30 118 C 29 178, 62 222, 100 236 C 138 222, 171 178, 170 118 C 169 68, 148 16, 100 14 Z";
    default:
      return "M100 20 C 45 20, 25 70, 25 130 C 25 195, 60 230, 100 230 C 140 230, 175 195, 175 130 C 175 70, 155 20, 100 20 Z";
  }
}

function tennisOval(): string {
  // Tennis racket head — oval
  return "M100 10 C 55 10, 32 55, 32 110 C 32 165, 60 200, 100 200 C 140 200, 168 165, 168 110 C 168 55, 145 10, 100 10 Z";
}

export function productSvg(p: Product): string {
  const c = BRAND_COLORS[p.brand] ?? { primary: "#475569", accent: "#94a3b8" };
  const face = p.sport === "padel" ? padelShapePath(p.padel?.shape ?? "redonda") : tennisOval();
  const holes =
    p.sport === "padel"
      ? Array.from({ length: 28 })
          .map((_, i) => {
            const x = 50 + (i % 5) * 25 + (Math.floor(i / 5) % 2) * 12;
            const y = 60 + Math.floor(i / 5) * 30;
            return `<circle cx="${x}" cy="${y}" r="4" fill="rgba(15,23,42,0.7)"/>`;
          })
          .join("")
      : Array.from({ length: 12 })
          .map((_, i) => {
            const x = 50 + (i % 4) * 33;
            const y1 = 30, y2 = 190;
            return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>`;
          })
          .join("") +
        Array.from({ length: 10 })
          .map((_, i) => {
            const y = 40 + i * 16;
            return `<line x1="35" y1="${y}" x2="165" y2="${y}" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>`;
          })
          .join("");

  const handle =
    p.sport === "padel"
      ? `<rect x="92" y="228" width="16" height="60" rx="4" fill="#1f2937"/>
       <rect x="88" y="285" width="24" height="8" rx="2" fill="#111827"/>`
      : `<path d="M100 200 L 100 270" stroke="#1f2937" stroke-width="14" stroke-linecap="round"/>
       <path d="M88 268 L 112 268 L 110 290 L 90 290 Z" fill="#111827"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="400" height="600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.primary}"/>
      <stop offset="100%" stop-color="${c.accent}"/>
    </linearGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <filter id="s"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${c.primary}" flood-opacity="0.4"/></filter>
  </defs>
  <rect width="200" height="300" fill="url(#bg)"/>
  <ellipse cx="100" cy="150" rx="90" ry="130" fill="${c.primary}" opacity="0.06"/>
  <g filter="url(#s)">
    <path d="${face}" fill="url(#g)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    ${holes}
    ${handle}
  </g>
  <text x="100" y="${p.sport === "padel" ? 140 : 115}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="15" fill="#fff" letter-spacing="2" opacity="0.95">${p.brand.toUpperCase()}</text>
</svg>`;
}

export function allProducts(): Product[] {
  return PRODUCTS;
}
