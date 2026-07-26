// Tiendas donde se listan palas y raquetas.
// El campo `sports` limita en qué catálogo aparece cada tienda: las tiendas
// especializadas de pádel no venden raquetas de tenis y viceversa.

import type { Sport } from "./products";

export interface Store {
  id: string;
  name: string;
  /** Home de la tienda. */
  url: string;
  /**
   * Plantilla de URL de búsqueda. `{q}` se reemplaza por el término
   * (marca + modelo codificado para URL). Esto garantiza que el botón "Ver
   * oferta" lleve siempre a resultados reales, nunca a un 404.
   */
  searchUrl: string;
  /** Color de marca, para el punto de color en la tabla de ofertas. */
  color: string;
  sports: Sport[];
  /** Gastos de envío en EUR. 0 = envío gratis siempre. */
  shipping: number;
  /** A partir de este importe el envío es gratis. */
  freeShippingFrom?: number;
}

export const STORES: Store[] = [
  {
    id: "padelnuestro",
    name: "Padel Nuestro",
    url: "https://www.padelnuestro.com",
    searchUrl: "https://www.padelnuestro.com/catalogsearch/result/?q={q}",
    color: "#e11d48",
    sports: ["padel", "tenis"],
    shipping: 4.95,
    freeShippingFrom: 60,
  },
  {
    id: "padelpoint",
    name: "PádelPoint",
    url: "https://www.padelpoint.es",
    searchUrl: "https://www.padelpoint.es/catalogsearch/result/?q={q}",
    color: "#0ea5e9",
    sports: ["padel"],
    shipping: 3.95,
    freeShippingFrom: 50,
  },
  {
    id: "time2padel",
    name: "Time2Pádel",
    url: "https://www.time2padel.es",
    searchUrl: "https://www.time2padel.es/search?q={q}",
    color: "##8b5cf6",
    sports: ["padel"],
    shipping: 4.5,
    freeShippingFrom: 70,
  },
  {
    id: "streetpadel",
    name: "StreetPadel",
    url: "https://www.streetpadel.es",
    searchUrl: "https://www.streetpadel.es/buscar?q={q}",
    color: "#f59e0b",
    sports: ["padel"],
    shipping: 4.9,
    freeShippingFrom: 80,
  },
  {
    id: "decathlon",
    name: "Decathlon",
    url: "https://www.decathlon.es",
    searchUrl: "https://www.decathlon.es/es/search?q={q}",
    color: "#0082c3",
    sports: ["padel", "tenis"],
    shipping: 3.99,
    freeShippingFrom: 30,
  },
  {
    id: "tenisboutique",
    name: "Tenis Boutique",
    url: "https://www.tenisboutique.es",
    searchUrl: "https://www.tenisboutique.es/catalogsearch/result/?q={q}",
    color: "#16a34a",
    sports: ["tenis"],
    shipping: 4.95,
    freeShippingFrom: 60,
  },
  {
    id: "zonadetenis",
    name: "Zona de Tenis",
    url: "https://www.zonadetenis.com",
    searchUrl: "https://www.zonadetenis.com/catalogsearch/result/?q={q}",
    color: "#dc2626",
    sports: ["tenis"],
    shipping: 5.5,
    freeShippingFrom: 90,
  },
  {
    id: "amazon",
    name: "Amazon",
    url: "https://www.amazon.es",
    searchUrl: "https://www.amazon.es/s?k={q}",
    color: "#ff9900",
    sports: ["padel", "tenis"],
    shipping: 0,
  },
];

const BY_ID = new Map(STORES.map((s) => [s.id, s]));

export function getStore(id: string): Store | undefined {
  return BY_ID.get(id);
}

/** Coste total: precio del artículo + envío aplicable. */
export function totalWithShipping(store: Store, price: number): number {
  if (store.shipping === 0) return price;
  if (store.freeShippingFrom !== undefined && price >= store.freeShippingFrom) {
    return price;
  }
  return price + store.shipping;
}

/**
 * Construye la URL de búsqueda del producto en la tienda.
 * Usa marca + modelo como término de búsqueda.
 */
export function buildSearchUrl(store: Store, brand: string, model: string): string {
  const query = encodeURIComponent(`${brand} ${model}`);
  return store.searchUrl.replace("{q}", query);
}
