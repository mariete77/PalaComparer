"use client";

import { useMemo, useState } from "react";
import type { PricePoint } from "@/data/offers";
import { formatPrice } from "@/data/offers";
import { useLocale } from "@/i18n/LocaleContext";

const MESES = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
} as const;

/** Formato manual: `toLocaleDateString` puede diferir entre Node y el navegador. */
function shortDate(iso: string, locale: "es" | "en"): string {
  const [, m, d] = iso.split("-");
  return `${Number(d)} ${MESES[locale][Number(m) - 1]}`;
}

const W = 640;
const H = 180;
const PAD = { top: 16, right: 16, bottom: 26, left: 52 };

export default function PriceHistoryChart({
  points,
  accent,
}: {
  points: PricePoint[];
  accent: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const { locale } = useLocale();

  const chart = useMemo(() => {
    const prices = points.map((p) => p.price);
    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);
    // Un poco de aire arriba y abajo para que la línea no toque los bordes.
    const pad = Math.max((rawMax - rawMin) * 0.15, 1);
    const lo = rawMin - pad;
    const hi = rawMax + pad;

    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    const x = (i: number) =>
      PAD.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
    const y = (v: number) => PAD.top + plotH - ((v - lo) / (hi - lo)) * plotH;

    const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.price).toFixed(1)}`).join(" ");
    const area = `${line} L${x(points.length - 1).toFixed(1)},${(PAD.top + plotH).toFixed(1)} L${x(0).toFixed(1)},${(PAD.top + plotH).toFixed(1)} Z`;

    const minIdx = prices.indexOf(rawMin);

    // Tres líneas de referencia, redondeadas a valores legibles.
    const ticks = [lo + (hi - lo) * 0.15, (lo + hi) / 2, hi - (hi - lo) * 0.15];

    return { x, y, line, area, minIdx, ticks, plotH, plotW, rawMin };
  }, [points]);

  if (points.length < 2) return null;

  const active = hover ?? points.length - 1;
  const activePoint = points[active];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label={`${locale === "en" ? "Best-price history between" : "Evolución del mejor precio entre el"} ${shortDate(points[0].date, locale)} ${locale === "en" ? "and" : "y el"} ${shortDate(points[points.length - 1].date, locale)}`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * W;
          const ratio = (px - PAD.left) / chart.plotW;
          const idx = Math.round(ratio * (points.length - 1));
          setHover(Math.min(Math.max(idx, 0), points.length - 1));
        }}
      >
        <defs>
          <linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Rejilla recesiva */}
        {chart.ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={chart.y(t)}
              y2={chart.y(t)}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={chart.y(t)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted"
              fontSize="10"
            >
              {Math.round(t)} €
            </text>
          </g>
        ))}

        <path d={chart.area} fill="url(#price-fill)" />
        <path
          d={chart.line}
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Mínimo del periodo, etiquetado directamente */}
        <circle
          cx={chart.x(chart.minIdx)}
          cy={chart.y(chart.rawMin)}
          r="4"
          fill={accent}
          stroke="var(--background)"
          strokeWidth="2"
        />

        {/* Fechas: extremos */}
        <text x={PAD.left} y={H - 8} className="fill-muted" fontSize="10">
          {shortDate(points[0].date, locale)}
        </text>
        <text x={W - PAD.right} y={H - 8} textAnchor="end" className="fill-muted" fontSize="10">
          {shortDate(points[points.length - 1].date, locale)}
        </text>

        {/* Crosshair */}
        <line
          x1={chart.x(active)}
          x2={chart.x(active)}
          y1={PAD.top}
          y2={PAD.top + chart.plotH}
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
        <circle
          cx={chart.x(active)}
          cy={chart.y(activePoint.price)}
          r="5"
          fill={accent}
          stroke="var(--background)"
          strokeWidth="2"
        />
      </svg>

      <figcaption className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted">
          {shortDate(activePoint.date, locale)}
        </span>
        <span className="font-semibold tabular-nums">{formatPrice(activePoint.price)}</span>
      </figcaption>
    </figure>
  );
}
