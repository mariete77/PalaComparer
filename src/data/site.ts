// Configuración de sitio compartida.

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

export const SITE_DESCRIPTION =
  "Compara palas de pádel y raquetas de tenis por especificaciones, nivel y estilo de juego. Encuentra tu arma perfecta.";

/** URL absoluta a partir de una ruta interna (`/palas` → `https://.../palas`). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
