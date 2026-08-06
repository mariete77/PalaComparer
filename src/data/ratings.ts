// Performance ratings derived from a racket's physical specs.
//
// Each metric is 1–10. The derivation uses heuristics from the padel/tennis
// fitting world: shape, balance, core hardness, and face material all predict
// how a racket plays. Numbers are deterministic — same specs always yield the
// same bars.

import type { Product, PadelSpecs, TenisSpecs } from "./products";

export interface Ratings {
  potencia: number;   // power
  control: number;    // control / precision
  dulce: number;      // sweet spot size / forgiveness
  manejo: number;     // maneuverability / swing ease
}

const clamp = (n: number) => Math.max(1, Math.min(10, Math.round(n)));

// --- Padel rating derivation -------------------------------------------

function padelRatings(padel: PadelSpecs): Ratings {
  const { shape, balance, hardness, faces, weight } = padel;

  // --- Power ---
  let power = 5;
  if (shape === "diamante") power += 2.5;
  else if (shape === "lagrima") power += 1.2;
  else if (shape === "hibrida") power += 0.8;
  if (balance === "alto") power += 2;
  else if (balance === "medio") power += 0.5;
  if (hardness === "dura") power += 1.5;
  else if (hardness === "media") power += 0.5;
  if (/carbon/i.test(faces)) power += 0.8;
  // Heavier = more plow-through
  const weightNum = parseInt(weight);
  if (!isNaN(weightNum) && weightNum >= 370) power += 0.5;

  // --- Control ---
  let control = 5;
  if (shape === "redonda") control += 3;
  else if (shape === "hibrida") control += 1.5;
  else if (shape === "lagrima") control += 0.8;
  if (balance === "bajo") control += 2;
  else if (balance === "medio") control += 1;
  if (hardness === "blanda") control += 1.5;
  else if (hardness === "media") control += 0.5;

  // --- Sweet spot ---
  let sweet = 5;
  if (shape === "redonda") sweet += 3;
  else if (shape === "hibrida") sweet += 2;
  else if (shape === "lagrima") sweet += 1;
  // diamante = no bonus
  if (balance === "bajo") sweet += 1.5;
  else if (balance === "medio") sweet += 0.8;
  if (hardness === "blanda") sweet += 0.8;

  // --- Maneuverability ---
  let mano = 5;
  if (balance === "bajo") mano += 2.5;
  else if (balance === "medio") mano += 1;
  // alto = no bonus (head-heavy = slower)
  if (shape === "redonda") mano += 1;
  else if (shape === "hibrida") mano += 0.5;
  if (!isNaN(weightNum) && weightNum <= 360) mano += 1;
  else if (!isNaN(weightNum) && weightNum >= 375) mano -= 0.5;

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

  // Power: higher stiffness + head-light-ish + bigger head
  let power = 4;
  power += (t.stiffness - 60) * 0.2;       // ~62 RA → +0.4, 70 RA → +2
  power += (t.headSize - 98) * 0.15;       // 100 → +0.3, 105 → +1.05
  if (sw > 330) power += 1;
  else if (sw < 310) power -= 1;

  // Control: lower stiffness, smaller head, lower swingweight
  let control = 4;
  control += (66 - t.stiffness) * 0.2;     // 60 RA → +1.2
  control += (100 - t.headSize) * 0.1;     // 95 → +0.5
  if (sw < 315) control += 1;

  // Sweet spot: bigger head = more forgiving
  let sweet = 4;
  sweet += (t.headSize - 98) * 0.25;       // 100 → +0.5, 105 → +1.75
  sweet += (t.stiffness - 62) * 0.1;       // stiffer = slightly more forgiving

  // Maneuverability: lighter + lower swingweight
  let mano = 5;
  mano += (305 - t.weightStrung) * 0.03;   // 300g → +0.15
  mano += (320 - sw) * 0.02;

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
