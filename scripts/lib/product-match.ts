/**
 * Matching de producto compartido por los scrapers (Amazon, Decathlon,
 * Firecrawl). Centraliza el aprendizaje anti-ofertas-falsas:
 *
 * 1. **Parseo de products.ts por ventana** — el orden de campos es
 *    `id → model → brand`; un regex `id…brand…model` cruza entries y mezcla
 *    modelos de productos vecinos (causa de varios falsos matches).
 * 2. **Umbral fijo ≥ 0.85** — el año ya no rebaja el listón a 0.5; con el
 *    umbral bajo bastaba marca + año + una palabra ("Speed Jr. 25 2026" colaba
 *    como "Speed MP 2026").
 * 3. **Variantes rechazadas** — si el título menciona una variante que el
 *    modelo del catálogo no tiene, se descarta: femeninas (girl, woman, wta…),
 *    junior/jr/kid, light/team y los tokens `l`/`w` (Clash 100 **L**,
 *    Vertex 04 **W**).
 * 4. **Acentos normalizados** — "Agustín" = "Agustin" al comparar.
 */

import { readFileSync } from "fs";
import { join } from "path";

export interface ProductRef {
  id: string;
  brand: string;
  model: string;
  year: number;
  sport?: string;
}

/** Palabras sin valor discriminante para el matching. */
const STOPWORDS = new Set([
  "the", "pro", "by", "de", "del", "padel", "pala", "palas", "raqueta",
  "raquetas", "adulto", "adultos", "gen", "unisex", "tenis", "tamano",
  // "Luxury" es gama, no modelo: la tienda vende la "AT10 Genius 18K Alum"
  // cuando el catálogo dice "AT10 Luxury Genius 18K Alum" — misma pala.
  "luxury",
]);

/**
 * Variantes que NO deben emparejarse si el modelo del catálogo no las
 * menciona. (Tokens ya normalizados sin acentos: "júnior" → "junior",
 * "niño/niña" → "nino/nina".)
 */
const VARIANT_TOKENS = new Set([
  "girl", "woman", "women", "wta", "femenina", "fem", "lady",
  "junior", "jr", "kid", "kids", "nino", "nina",
  "light", "team", "l", "w",
]);

/** Minúsculas y sin acentos ("Agustín" → "agustin", "Júnior" → "junior"). */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Extrae los productos del catálogo. ⚠️ El orden de campos en products.ts es
 * `id → model → brand` (NO `id → brand → model`): un regex encadenado cruza
 * entries. Se extrae por ventana de 600 chars tras cada `id`.
 */
export function loadProducts(productsPath = join(__dirname, "../../src/data/products.ts")): ProductRef[] {
  const content = readFileSync(productsPath, "utf-8");
  const products: ProductRef[] = [];
  const re = /id:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const win = content.slice(m.index, m.index + 600);
    const brand = /brand:\s*"([^"]+)"/.exec(win)?.[1];
    const model = /model:\s*"([^"]+)"/.exec(win)?.[1];
    const year = /year:\s*(\d+)/.exec(win)?.[1];
    if (!brand || !model || !year) continue;
    products.push({
      id: m[1],
      brand,
      model,
      year: parseInt(year, 10),
      sport: /sport:\s*"([^"]+)"/.exec(win)?.[1] ?? "",
    });
  }
  return products;
}

/** Normaliza el modelo: minúsculas, sin acentos, sin "(8th gen)", sin "by <jugador>", sin años. */
export function modelKeywords(model: string): string[] {
  return normalize(model)
    .replace(/\([^)]*\)/g, " ")
    .replace(/by\s+[^,]+$/i, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w) && !/^\d{4}$/.test(w));
}

/** Quita el "by Jugador" del final, que ninguna tienda pone igual. */
export function limpiaModelo(model: string): string {
  return normalize(model).replace(/by\s+[^,]+$/i, "").replace(/\s+/g, " ").trim();
}

export function buildQuery(p: ProductRef): string {
  return `${p.brand} ${limpiaModelo(p.model)} ${p.year}`;
}

/**
 * ¿El título de la tienda es el producto del catálogo?
 * - La marca es obligatoria.
 * - Variante (género, junior, light…) no contemplada en el modelo → no.
 * - ≥85% de las palabras del modelo deben aparecer en el título.
 */
export function isMatch(title: string, p: ProductRef): boolean {
  const t = normalize(title);
  const brand = normalize(p.brand);
  if (!t.includes(brand) && !t.includes(brand.replace(/\s+/g, ""))) return false;

  const modelLower = normalize(p.model);
  const modelTokens = new Set(modelLower.split(/\s+/));
  const toks = t.split(/[^a-z0-9]+/).filter(Boolean);
  if (toks.some((tk) => VARIANT_TOKENS.has(tk) && !modelTokens.has(tk))) return false;

  const kws = modelKeywords(p.model);
  const hits = kws.filter((k) => t.includes(k)).length;
  const score = kws.length > 0 ? hits / kws.length : 0;

  // Umbral alto y fijo: mejor no mostrar oferta que mostrar un producto distinto.
  return score >= 0.85;
}
