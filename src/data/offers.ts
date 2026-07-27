// Ofertas por producto y evolución de precio.
//
// ⚠️ MVP: las ofertas se generan de forma DETERMINISTA a partir del PVP del
// producto y del id de la tienda. No son precios reales — son un stub con la
// forma exacta que tendrá el feed definitivo, para poder construir la UI.
// Al conectar feeds/afiliación reales basta con sustituir `getOffers` y
// `getPriceHistory` por lecturas de la fuente de datos: el resto de la app
// consume únicamente estas funciones y los tipos de abajo.

import { getProduct, type Product } from "./products";
import { STORES, totalWithShipping, buildSearchUrl, type Store } from "./stores";

/** Fecha del snapshot de precios. Fija a propósito: mantiene el render
 *  determinista entre servidor y cliente y hace los builds reproducibles. */
export const PRICE_SNAPSHOT = "2026-07-20";

/** Días de histórico que se guardan por producto. */
const HISTORY_DAYS = 60;

export interface Offer {
  storeId: string;
  /** Precio del artículo, sin envío. */
  price: number;
  /** Precio + envío aplicable en esa tienda. */
  total: number;
  url: string;
  inStock: boolean;
  /** Días transcurridos desde la última comprobación del precio. */
  checkedDaysAgo: number;
}

export interface PricePoint {
  /** ISO YYYY-MM-DD */
  date: string;
  price: number;
}

export interface PriceSummary {
  /** Oferta más barata en stock (por precio de artículo). */
  best: Offer | null;
  /** Oferta más barata contando el envío. */
  bestWithShipping: Offer | null;
  min: number;
  max: number;
  /** Mínimo histórico en la ventana de `HISTORY_DAYS`. */
  historicalMin: number;
  /** % de descuento del mejor precio frente al PVP. Negativo = por encima. */
  discountPct: number;
  /** true si el mejor precio actual iguala el mínimo histórico. */
  atHistoricalLow: boolean;
  offerCount: number;
}

// ---------------------------------------------------------------------------
// PRNG determinista
// ---------------------------------------------------------------------------

function hashSeed(input: string): number {
  // FNV-1a de 32 bits
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: pequeño, rápido y estable entre entornos. */
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Redondea a un precio "de tienda": .95 o .99 según la tienda. */
function retailPrice(value: number, ending: number): number {
  const whole = Math.floor(value);
  return round2(whole + ending);
}

function shiftDate(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Datos reales scrapeados de Amazon ES (scripts/scrape-amazon.ts)
// ---------------------------------------------------------------------------

import realOffersData from "./real-offers.json";

interface RealOffer {
  productId: string;
  title: string;
  price: number | null;
  url: string;
  asin: string | null;
  inStock: boolean;
  scrapedAt: string;
}

const REAL_OFFERS = (realOffersData as Record<string, RealOffer>) ?? {};

// ---------------------------------------------------------------------------
// Datos reales del resto de tiendas (Firecrawl — ver docs/SCRAPING.md)
// ---------------------------------------------------------------------------

import realStoreOffersData from "./real-offers-stores.json";

interface RealStoreOffer {
  storeId: string;
  title: string;
  price: number;
  /** PVP tachado en la tienda, si lo publica. Informativo. */
  listPrice?: number;
  url: string;
  inStock: boolean;
  scrapedAt: string;
}

const REAL_STORE_OFFERS =
  (realStoreOffersData as Record<string, RealStoreOffer[]>) ?? {};

// ---------------------------------------------------------------------------
// Generación
// ---------------------------------------------------------------------------

function storesFor(product: Product): Store[] {
  return STORES.filter((s) => s.sports.includes(product.sport));
}

function buildOffers(product: Product): Offer[] {
  const offers: Offer[] = [];

  // 1. Si tenemos precio real de Amazon, usarlo
  const real = REAL_OFFERS[product.id];
  if (real && real.price) {
    const amazon = STORES.find((s) => s.id === "amazon");
    if (amazon) {
      offers.push({
        storeId: "amazon",
        price: real.price,
        total: round2(totalWithShipping(amazon, real.price)),
        url: real.url, // URL real con ASIN
        inStock: real.inStock,
        checkedDaysAgo: 0, // fresco
      });
    }
  }

  // 2. Precios reales scrapeados en el resto de tiendas
  for (const real of REAL_STORE_OFFERS[product.id] ?? []) {
    const store = STORES.find((s) => s.id === real.storeId);
    if (!store) continue;
    offers.push({
      storeId: store.id,
      price: real.price,
      total: round2(totalWithShipping(store, real.price)),
      url: real.url, // URL real de la ficha, no una búsqueda
      inStock: real.inStock,
      checkedDaysAgo: 0,
    });
  }

  // 3. Generar ofertas sintéticas para las tiendas que no tengan precio real
  const conPrecioReal = new Set(offers.map((o) => o.storeId));
  for (const store of storesFor(product).filter((s) => !conPrecioReal.has(s.id) && s.id !== "amazon")) {
    const r = rng(hashSeed(`${product.id}:${store.id}`));

    // ~25% de las tiendas no listan el producto.
    if (r() < 0.25) continue;

    // Descuento sobre PVP: entre -28% y +2%.
    const factor = 0.72 + r() * 0.3;
    const ending = r() < 0.5 ? 0.95 : 0.99;
    const price = retailPrice(product.price * factor, ending);
    const inStock = r() > 0.12;
    const checkedDaysAgo = Math.floor(r() * 3);

    offers.push({
      storeId: store.id,
      price,
      total: round2(totalWithShipping(store, price)),
      url: buildSearchUrl(store, product.brand, product.model),
      inStock,
      checkedDaysAgo,
    });
  }

  // Garantiza un mínimo de 2 ofertas aunque el sorteo las haya descartado.
  if (offers.length < 2) {
    for (const store of storesFor(product)) {
      if (offers.some((o) => o.storeId === store.id)) continue;
      const r = rng(hashSeed(`${product.id}:${store.id}:fallback`));
      const price = retailPrice(product.price * (0.85 + r() * 0.15), 0.95);
      offers.push({
        storeId: store.id,
        price,
        total: round2(totalWithShipping(store, price)),
        url: buildSearchUrl(store, product.brand, product.model),
        inStock: true,
        checkedDaysAgo: 0,
      });
      if (offers.length >= 2) break;
    }
  }

  return offers.sort((a, b) => a.price - b.price);
}

const offersCache = new Map<string, Offer[]>();

export function getOffers(productId: string): Offer[] {
  const cached = offersCache.get(productId);
  if (cached) return cached;

  const product = getProduct(productId);
  if (!product) return [];

  const offers = buildOffers(product);
  offersCache.set(productId, offers);
  return offers;
}

const historyCache = new Map<string, PricePoint[]>();

/**
 * Serie diaria del mejor precio en los últimos `HISTORY_DAYS` días.
 * El último punto coincide siempre con el mejor precio actual.
 */
export function getPriceHistory(productId: string): PricePoint[] {
  const cached = historyCache.get(productId);
  if (cached) return cached;

  const product = getProduct(productId);
  if (!product) return [];

  const offers = getOffers(productId);
  if (offers.length === 0) return [];

  const current = offers[0].price;
  const r = rng(hashSeed(`${productId}:history`));

  // Se parte de un precio cercano al PVP y se camina hasta el precio actual.
  let price = product.price * (0.92 + r() * 0.08);
  const points: PricePoint[] = [];

  for (let i = 0; i < HISTORY_DAYS; i++) {
    const roll = r();
    if (roll < 0.06) {
      price *= 0.9 + r() * 0.05; // promo puntual
    } else if (roll < 0.12) {
      price *= 1.02 + r() * 0.04; // rebote tras promo
    } else {
      price *= 0.997 + r() * 0.006; // deriva suave
    }
    // No se aleja más de un 30% por debajo del PVP.
    price = Math.min(Math.max(price, product.price * 0.7), product.price * 1.05);

    points.push({
      date: shiftDate(PRICE_SNAPSHOT, i - (HISTORY_DAYS - 1)),
      price: round2(price),
    });
  }

  // El punto de hoy es, por definición, el mejor precio actual.
  points[points.length - 1] = { date: PRICE_SNAPSHOT, price: current };

  historyCache.set(productId, points);
  return points;
}

export function getPriceSummary(productId: string): PriceSummary | null {
  const product = getProduct(productId);
  if (!product) return null;

  const offers = getOffers(productId);
  if (offers.length === 0) return null;

  const inStock = offers.filter((o) => o.inStock);
  const pool = inStock.length > 0 ? inStock : offers;

  const best = pool[0];
  const bestWithShipping = [...pool].sort((a, b) => a.total - b.total)[0];
  const prices = pool.map((o) => o.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  const history = getPriceHistory(productId);
  const historicalMin = history.length
    ? Math.min(...history.map((p) => p.price))
    : min;

  return {
    best,
    bestWithShipping,
    min,
    max,
    historicalMin,
    discountPct: Math.round(((product.price - min) / product.price) * 100),
    atHistoricalLow: min <= historicalMin + 0.01,
    offerCount: pool.length,
  };
}

/** Atajo para tarjetas y listados: precio "desde". */
export function getBestPrice(productId: string): number | null {
  return getPriceSummary(productId)?.min ?? null;
}

/**
 * Mapa id → mejor precio. Se calcula en el servidor y se pasa a los
 * componentes de cliente para no enviarles el generador de ofertas.
 */
export function buildPriceIndex(products: Pick<Product, "id">[]): Record<string, number> {
  const index: Record<string, number> = {};
  for (const p of products) {
    const best = getBestPrice(p.id);
    if (best !== null) index[p.id] = best;
  }
  return index;
}

export function formatPrice(value: number): string {
  return `${value.toFixed(2).replace(".", ",")} €`;
}
