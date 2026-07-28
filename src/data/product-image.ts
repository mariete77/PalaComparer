// Resolución de la imagen de un producto.
//
// Estrategia: si existe una foto real registrada en el manifiesto, se usa esa;
// si no, se cae al SVG procedural generado por `npm run gen:images`. Así el
// catálogo nunca se ve roto mientras se van incorporando fotos de verdad.

import manifest from "./real-images.json";
import type { Product } from "./products";

/**
 * Situación de derechos de cada imagen.
 *
 * `pendiente` es el estado por defecto: la imagen está en uso pero todavía no
 * hay permiso del titular. Sirve para poder listar en cualquier momento qué
 * queda por regularizar y sustituirlo de forma selectiva — sin esto, "ya
 * pediré permiso" se vuelve inaplicable en cuanto hay unas cuantas.
 */
export type ImageLicence =
  | "pendiente"
  | "prensa" // material de prensa del fabricante
  | "feed" // feed de afiliación (licencia incluida en el programa)
  | "propia"; // fotografía propia

export interface RealImageEntry {
  /** Ruta pública (`/images/...`) o URL absoluta de un CDN permitido. */
  src: string;
  /** Autoría / procedencia, para mostrarla junto a la foto. */
  credit?: string;
  /** Página de origen desde la que se descargó. */
  source?: string;
  /** Situación de derechos. Si falta, se asume `pendiente`. */
  licence?: ImageLicence;
}

export interface ResolvedImage {
  src: string;
  /** false = es el SVG placeholder, no una foto del producto. */
  isReal: boolean;
  /** Los SVG generados no pasan por el optimizador de next/image. */
  unoptimized: boolean;
  credit?: string;
  source?: string;
}

const REAL_IMAGES = (manifest.images ?? {}) as Record<string, RealImageEntry>;

export function getProductImage(product: Product): ResolvedImage {
  const real = REAL_IMAGES[product.id];
  if (real) {
    return {
      src: real.src,
      isReal: true,
      unoptimized: false,
      credit: real.credit,
      source: real.source,
    };
  }
  return { src: product.image, isReal: false, unoptimized: true };
}

export function hasRealImage(productId: string): boolean {
  return productId in REAL_IMAGES;
}

/**
 * Filtra un array de productos y devuelve solo los que tienen foto real.
 * Se usa en catálogos públicos para que nunca aparezca una card con SVG placeholder.
 */
export function withRealImage<T extends { id: string }>(products: T[]): T[] {
  return products.filter((p) => p.id in REAL_IMAGES);
}

/** Cuántos productos tienen ya foto real. Útil para medir el avance. */
export function realImageCount(): number {
  return Object.keys(REAL_IMAGES).length;
}

export function getImageLicence(productId: string): ImageLicence | null {
  const real = REAL_IMAGES[productId];
  if (!real) return null;
  return real.licence ?? "pendiente";
}

/** Ids con imagen en uso pero sin permiso del titular todavía. */
export function pendingLicenceIds(): string[] {
  return Object.entries(REAL_IMAGES)
    .filter(([, entry]) => (entry.licence ?? "pendiente") === "pendiente")
    .map(([id]) => id);
}
