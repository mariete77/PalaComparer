// Resolución de la imagen de un producto.
//
// Estrategia: si existe una foto real registrada en el manifiesto, se usa esa;
// si no, se cae al SVG procedural generado por `npm run gen:images`. Así el
// catálogo nunca se ve roto mientras se van incorporando fotos de verdad.

import manifest from "./real-images.json";
import type { Product } from "./products";

export interface RealImageEntry {
  /** Ruta pública (`/images/...`) o URL absoluta de un CDN permitido. */
  src: string;
  /** Autoría / procedencia, para mostrarla junto a la foto. */
  credit?: string;
  /** Página de origen desde la que se descargó. */
  source?: string;
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

/** Cuántos productos tienen ya foto real. Útil para medir el avance. */
export function realImageCount(): number {
  return Object.keys(REAL_IMAGES).length;
}
