// Mejor precio REAL de cada producto (badge de descuento en ProductCard).
//
// Solo se consideran precios scrapeados de tiendas (Amazon, Decathlon y resto
// de tiendas conectadas) que estén en stock. Los precios sintéticos del
// generador de ofertas NUNCA alimentan el badge: un "-40%" sobre un precio
// inventado sería publicidad engañosa.
//
// Este módulo es deliberadamente JSON-only (no importa products.ts) para que
// el bundle de cliente solo reciba los datos de ofertas, no el catálogo
// completo. El PVP lo aporta quien llama (el card ya tiene `product.price`).

import realAmazon from "./real-offers.json";
import realStores from "./real-offers-stores.json";
import realDecathlon from "./real-offers-decathlon.json";

interface RealOfferJson {
  price: number;
  inStock?: boolean;
}
type StoreOffersJson = { storeId: string; price: number; inStock?: boolean }[];

const AMAZON = realAmazon as Record<string, RealOfferJson>;
const STORES = realStores as Record<string, StoreOffersJson>;
const DECATHLON = realDecathlon as Record<string, RealOfferJson>;

/** id → mejor precio real en stock. Solo productos con al menos una tienda real. */
const realBestPrices = new Map<string, number>();

function collect(entries: Iterable<string>) {
  for (const id of entries) {
    if (realBestPrices.has(id)) continue;
    const candidates: number[] = [];
    const amazon = AMAZON[id];
    if (amazon?.price && amazon.inStock !== false) candidates.push(amazon.price);
    for (const o of STORES[id] ?? []) {
      if (o.price && o.inStock !== false) candidates.push(o.price);
    }
    const dec = DECATHLON[id];
    if (dec?.price && dec.inStock !== false) candidates.push(dec.price);
    if (candidates.length) realBestPrices.set(id, Math.min(...candidates));
  }
}

collect(Object.keys(AMAZON));
collect(Object.keys(STORES));
collect(Object.keys(DECATHLON));

/**
 * Mejor precio scrapeado en stock para un producto, o null si ninguna tienda
 * real lo lista (en ese caso el card NO muestra badge de descuento).
 */
export function getRealBestPrice(productId: string): number | null {
  return realBestPrices.get(productId) ?? null;
}

/**
 * % de descuento real sobre el PVP (entero, ≥ 1), o null si el mejor precio
 * real no existe o no mejora el PVP.
 */
export function realDiscountPct(pvp: number, best: number | null): number | null {
  if (best == null || best >= pvp) return null;
  const pct = Math.round((1 - best / pvp) * 100);
  return pct >= 1 ? pct : null;
}
