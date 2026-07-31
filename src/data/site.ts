// Configuración de sitio compartida.

import type { Locale } from "@/i18n/locales";

/**
 * URL canónica del sitio, sin barra final.
 *
 * El fallback es el dominio de producción, no localhost: si la variable no
 * llega a definirse en el hosting, las URLs absolutas siguen siendo correctas.
 * La auditoría GEO de julio de 2026 encontró `og:image` sirviendo
 * `http://localhost:3000/opengraph-image.png` en producción justamente por
 * tener localhost como valor por defecto.
 *
 * En desarrollo, define NEXT_PUBLIC_SITE_URL=http://localhost:3000 si necesitas
 * que las URLs absolutas apunten a tu máquina.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.palacomparer.com"
).replace(/\/$/, "");

export const SITE_NAME = "PalaComparer";

/**
 * Descripción SEO del sitio en cada idioma. Se usa en metadatos y JSON-LD.
 */
export const SITE_DESCRIPTIONS = {
  es: "Compara palas de pádel y raquetas de tenis por especificaciones, nivel y estilo de juego. Encuentra tu arma perfecta.",
  en: "Compare padel paddles and tennis rackets by specs, skill level and play style. Find your perfect weapon.",
} as const;

/** Descripción para un locale concreto (con fallback a español). */
export function siteDescription(locale: Locale): string {
  return SITE_DESCRIPTIONS[locale] ?? SITE_DESCRIPTIONS.es;
}

/** URL absoluta a partir de una ruta interna (`/palas` → `https://.../palas`). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * URL absoluta para una ruta en un locale dado.
 *
 *   absoluteLocaleUrl("en", "/palas") → "https://.../en/palas"
 */
export function absoluteLocaleUrl(locale: Locale, path: string): string {
  const internal = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${internal}`;
}

