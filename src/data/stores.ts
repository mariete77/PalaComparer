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
    // Padel Nuestro no vende raquetas de tenis: su catálogo es pádel (y tenis
    // playa). Solo aparece en el comparador de palas.
    sports: ["padel"],
    shipping: 4.95,
    freeShippingFrom: 60,
  },
  {
    id: "padelpoint",
    name: "PádelPoint",
    // La tienda online es tiendapadelpoint.com (OpenCart). padelpoint.es es la
    // web corporativa del club y no tiene buscador de productos.
    url: "https://www.tiendapadelpoint.com",
    searchUrl: "https://www.tiendapadelpoint.com/index.php?route=product/search&search={q}",
    color: "#0ea5e9",
    sports: ["padel"],
    shipping: 3.95,
    freeShippingFrom: 50,
  },
  {
    id: "time2padel",
    name: "Time2Pádel",
    // El dominio .es devuelve 421 (no está en el certificado); el bueno es .com.
    url: "https://www.time2padel.com",
    searchUrl: "https://www.time2padel.com/es/buscar?controller=search&s={q}",
    color: "#8b5cf6",
    sports: ["padel"],
    shipping: 4.5,
    freeShippingFrom: 70,
  },
  {
    id: "streetpadel",
    name: "StreetPadel",
    // streetpadel.es redirige a .com (Shopify), donde la ruta de búsqueda es
    // /search: /buscar daba 404.
    url: "https://www.streetpadel.com",
    searchUrl: "https://www.streetpadel.com/es/search?q={q}",
    color: "#f59e0b",
    sports: ["padel"],
    shipping: 4.9,
    freeShippingFrom: 80,
  },
  {
    id: "decathlon",
    name: "Decathlon",
    url: "https://www.decathlon.es",
    // Decathlon busca por `Ntt`. Con `?q=` la web ignora el término y te deja
    // en la portada.
    searchUrl: "https://www.decathlon.es/es/search?Ntt={q}",
    color: "#0082c3",
    sports: ["padel", "tenis"],
    shipping: 3.99,
    freeShippingFrom: 30,
  },
  // Aquí había dos tiendas de tenis, "Tenis Boutique" (tenisboutique.es) y
  // "Zona de Tenis" (zonadetenis.com). Ninguno de los dos dominios resuelve por
  // DNS —tenisboutique.com sí existe pero Cloudflare lo da por caído—, así que
  // enlazaban a la nada y se han eliminado. Si se añade una tienda de tenis,
  // comprobar antes que el dominio responde y que su buscador devuelve
  // resultados con el término del producto.
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
