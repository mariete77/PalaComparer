"use client";

import type { RatingKey } from "@/data/ratings";
import { useLocale } from "@/i18n/LocaleContext";

/**
 * 10-segment coloured bar that visualises a 1–10 performance rating.
 *
 * Active segments take a colour from a red→amber→green gradient based on
 * the raw value, so a 9/10 "potencia" reads as deep green at a glance.
 * Inactive segments stay as faint outlines.
 */

// Colour for a given 1–10 value: red (1–3) → amber (4–6) → green (7–10)
function activeColor(value: number): string {
  if (value >= 9) return "#22c55e"; // green-500
  if (value >= 7) return "#84cc16"; // lime-500
  if (value >= 5) return "#eab308"; // yellow-500
  if (value >= 3) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
}

const LABELS: Record<RatingKey, { es: string; en: string }> = {
  potencia: { es: "Potencia", en: "Power" },
  control: { es: "Control", en: "Control" },
  dulce: { es: "Punto dulce", en: "Sweet spot" },
  manejo: { es: "Manejabilidad", en: "Maneuverability" },
};

interface Props {
  labelKey: RatingKey;
  value: number; // 1–10
  /** "full" = 10 big segments with label + value number (product page, compare).
   *  "compact" = smaller bar, just label, no number (product card). */
  variant?: "full" | "compact";
  /** Show the numeric value (e.g. "9") next to the bar. Default true in full. */
  showValue?: boolean;
}

export default function RatingBar({
  labelKey,
  value,
  variant = "full",
  showValue,
}: Props) {
  const { locale } = useLocale();
  const label = LABELS[labelKey][locale];
  const color = activeColor(value);
  const showNum = showValue ?? (variant === "full");
  const compact = variant === "compact";

  return (
    <div className="flex items-center gap-2.5">
      {/* Label */}
      <span
        className={`font-bold uppercase tracking-wider text-muted shrink-0 ${
          compact ? "text-[7px] w-12" : "text-[9px] sm:text-[10px] w-20 sm:w-24"
        }`}
      >
        {label}
      </span>

      {/* Segments */}
      <div className={`flex gap-[2px] flex-1 ${compact ? "h-2" : "h-3 sm:h-3.5"}`}>
        {Array.from({ length: 10 }, (_, i) => {
          const active = i < value;
          return (
            <div
              key={i}
              className="flex-1 rounded-[2px] transition-colors"
              style={{
                backgroundColor: active ? color : "var(--overlay-6)",
                boxShadow: active ? `0 0 4px ${color}40` : "none",
              }}
            />
          );
        })}
      </div>

      {/* Numeric value */}
      {showNum && (
        <span
          className={`font-display font-bold tabular-nums shrink-0 ${
            compact ? "text-[9px] w-3" : "text-xs sm:text-sm w-5 text-right"
          }`}
          style={{ color }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

/** Compact 2×2 grid of all four ratings, for product cards. */
export function RatingGrid({
  ratings,
  variant = "full",
}: {
  ratings: { potencia: number; control: number; dulce: number; manejo: number };
  variant?: "full" | "compact";
}) {
  const keys: RatingKey[] = ["potencia", "control", "dulce", "manejo"];
  return (
    <div className={variant === "compact" ? "space-y-1" : "space-y-2.5"}>
      {keys.map((k) => (
        <RatingBar key={k} labelKey={k} value={ratings[k]} variant={variant} />
      ))}
    </div>
  );
}
