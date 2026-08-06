// Performance ratings derived from a racket's physical specs.
//
// Each metric is 1–10. The derivation uses heuristics from the padel/tennis
// fitting world: shape, balance, core hardness, face material, and weight all
// predict how a racket plays.
//
// Design goal: the full 1–10 range must be used. A typical "power" racket
// should land at 7-8, only the most extreme at 9-10, and control-oriented
// rackets should genuinely score low on power (3-4).

import type { Product, PadelSpecs, TenisSpecs } from "./products";

export interface Ratings {
  potencia: number;   // power
  control: number;    // control / precision
  dulce: number;      // sweet spot size / forgiveness
  manejo: number;     // maneuverability / swing ease
}

const clamp = (n: number) => Math.max(1, Math.min(10, Math.round(n)));

/** Parse a weight range like "360-375 g" → midpoint in grams. */
function weightMid(weight: string): number {
  const m = weight.match(/(\d{3})\s*[-–]\s*(\d{3})/);
  if (m) return (parseInt(m[1]) + parseInt(m[2])) / 2;
  const single = weight.match(/(\d{3})/);
  return single ? parseInt(single[1]) : 365;
}

/** Detect face material quality from the faces string. */
function faceCarbonLevel(faces: string): number {
  const f = faces.toLowerCase();
  // Higher K = stiffer = more power, but also more demanding
  if (/24k|18k/.test(f)) return 2;
  if (/12k/.test(f)) return 1.5;
  if (/carbon/.test(f)) return 1;       // generic carbon
  if (/fibra de vidrio|glass fiber|fiberglass/.test(f)) return 0.5;
  return 1; // unknown — neutral
}

// --- Padel rating derivation -------------------------------------------

function padelRatings(padel: PadelSpecs): Ratings {
  const { shape, balance, hardness, faces, weight } = padel;
  const wm = weightMid(weight);
  const carbon = faceCarbonLevel(faces);

  // --- Power (base 3, range should spread 3-10) ---
  // Key drivers: shape (diamante), balance (alto), hardness (dura), carbon, weight
  let power = 3;
  if (shape === "diamante") power += 2.5;
  else if (shape === "lagrima") power += 1.2;
  else if (shape === "hibrida") power += 0.5;
  // redonda: +0

  if (balance === "alto") power += 1.5;
  else if (balance === "medio") power += 0.5;
  else power -= 0.5; // bajo reduces power

  if (hardness === "dura") power += 1;
  else if (hardness === "media") power += 0.3;

  power += (carbon - 1) * 0.8; // carbon 12K: +0.4, 18K/24K: +0.8, fiberglass: -0.4

  // Weight: continuous, not stepped. 355g→−0.5, 370g→0, 385g→+1
  power += (wm - 370) * 0.06;

  // --- Control (base 3, mirror of power) ---
  let control = 3;
  if (shape === "redonda") control += 3;
  else if (shape === "hibrida") control += 1.5;
  else if (shape === "lagrima") control += 0.8;
  // diamante: small bonus, it's not that it has zero control
  else control += 0.3;

  if (balance === "bajo") control += 2;
  else if (balance === "medio") control += 1;

  if (hardness === "blanda") control += 1.5;
  else if (hardness === "media") control += 0.5;

  // Lighter = slightly easier to direct
  control += (365 - wm) * 0.03;

  // --- Sweet spot ---
  let sweet = 3;
  if (shape === "redonda") sweet += 3;
  else if (shape === "hibrida") sweet += 2;
  else if (shape === "lagrima") sweet += 1;
  // diamante: smallest sweet spot

  if (balance === "bajo") sweet += 1.5;
  else if (balance === "medio") sweet += 0.8;

  if (hardness === "blanda") sweet += 0.8;

  // --- Maneuverability ---
  let mano = 4;
  if (balance === "bajo") mano += 2.5;
  else if (balance === "medio") mano += 1;
  // alto: +0 (head-heavy = slower)

  if (shape === "redonda") mano += 1;
  else if (shape === "hibrida") mano += 0.5;

  if (wm <= 360) mano += 1.5;
  else if (wm <= 367) mano += 0.5;
  else if (wm >= 378) mano -= 1;

  return {
    potencia: clamp(power),
    control: clamp(control),
    dulce: clamp(sweet),
    manejo: clamp(mano),
  };
}

// --- Tennis rating derivation -------------------------------------------

function tennisRatings(t: TenisSpecs): Ratings {
  const sw = t.swingweight ?? 320;

  // Power: higher stiffness + bigger head + higher swingweight
  let power = 3;
  power += (t.stiffness - 62) * 0.25;
  power += (t.headSize - 98) * 0.15;
  if (sw > 335) power += 1.5;
  else if (sw > 322) power += 0.5;
  else if (sw < 308) power -= 1;

  // Control: lower stiffness, smaller head, lower swingweight
  let control = 3;
  control += (64 - t.stiffness) * 0.25;
  control += (98 - t.headSize) * 0.12;
  if (sw < 312) control += 1.5;
  else if (sw < 322) control += 0.5;
  else if (sw > 340) control -= 1;

  // Sweet spot: bigger head = more forgiving
  let sweet = 3;
  sweet += (t.headSize - 97) * 0.3;
  if (t.stiffness >= 66) sweet += 0.5;

  // Maneuverability: lighter + lower swingweight
  let mano = 4;
  mano += (310 - t.weightStrung) * 0.035;
  mano += (325 - sw) * 0.03;

  return {
    potencia: clamp(power),
    control: clamp(control),
    dulce: clamp(sweet),
    manejo: clamp(mano),
  };
}

export function getRatings(p: Product): Ratings | null {
  if (p.sport === "padel" && p.padel) return padelRatings(p.padel);
  if (p.sport === "tenis" && p.tenis) return tennisRatings(p.tenis);
  return null;
}

export type RatingKey = keyof Ratings;
