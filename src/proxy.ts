import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/locales";

/**
 * Detección de locale en cada petición sin prefijo.
 *
 * Orden de prioridad:
 *   1. Cookie `NEXT_LOCALE` (si el usuario ya eligió idioma antes).
 *   2. Cabecera `Accept-Language` del navegador.
 *   3. Locale por defecto (`es`).
 *
 * En Next.js 16 el middleware se renombró a «proxy»: este fichero sustituye al
 * `middleware.ts` clásico para el enrutado por idioma.
 */
function resolveLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && (LOCALES as readonly string[]).includes(cookie)) {
    return cookie as Locale;
  }
  const accept = request.headers.get("accept-language");
  if (accept) {
    // Parser ligero: saca los tags de idioma ordenados por q-value.
    const ranked = accept
      .split(",")
      .map((part) => {
        const [tag, q = "q=1"] = part.trim().split(";");
        const qNum = Number(q.split("=")[1] ?? 1);
        return { tag: tag.toLowerCase(), q: Number.isNaN(qNum) ? 1 : qNum };
      })
      .sort((a, b) => b.q - a.q);
    for (const { tag } of ranked) {
      if (tag.startsWith("en")) return "en";
      if (tag.startsWith("es")) return "es";
    }
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si la ruta ya lleva prefijo de locale, la dejamos pasar.
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Corre en todo salvo internos, estáticos y archivos con extensión.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
