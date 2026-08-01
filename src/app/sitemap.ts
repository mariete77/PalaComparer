import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
import { ARTICLES, isGuide } from "@/data/news";
import { PLAYERS } from "@/data/players";
import { absoluteLocaleUrl } from "@/data/site";
import type { Locale } from "@/i18n/locales";
import latestPriceDate from "@/data/price-history/latest-date.json";

const LOCALES: Locale[] = ["es", "en"];

/**
 * Alternates hreflang cruzados ES↔EN para una ruta interna dada.
 */
function alternates(internalPath: string) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = absoluteLocaleUrl(l, internalPath);
  }
  languages["x-default"] = absoluteLocaleUrl("es", internalPath);
  return { languages };
}

/**
 * Sirve /sitemap.xml.
 *
 * Se genera desde los datos, no a mano: al dar de alta un producto o un
 * artículo entra solo. Cada ruta se emite en /es y /en con hreflang cruzado.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const priceDataLastModified = new Date(`${latestPriceDate.date}T00:00:00.000Z`);

  type Entry = {
    internalPath: string;
    lastModified: Date;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  };

  const entries: Entry[] = [
    { internalPath: "/", lastModified: priceDataLastModified, changeFrequency: "daily", priority: 1 },
    { internalPath: "/palas", lastModified: priceDataLastModified, changeFrequency: "daily", priority: 0.9 },
    { internalPath: "/raquetas", lastModified: priceDataLastModified, changeFrequency: "daily", priority: 0.9 },
    { internalPath: "/finder", lastModified: priceDataLastModified, changeFrequency: "monthly", priority: 0.8 },
    { internalPath: "/comparar", lastModified: priceDataLastModified, changeFrequency: "monthly", priority: 0.6 },
    { internalPath: "/noticias", lastModified: priceDataLastModified, changeFrequency: "weekly", priority: 0.7 },
    { internalPath: "/guias", lastModified: priceDataLastModified, changeFrequency: "weekly", priority: 0.7 },
    { internalPath: "/metodologia", lastModified: priceDataLastModified, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Los precios se refrescan a menudo, así que las fichas son `daily`.
  for (const p of PRODUCTS) {
    entries.push({
      internalPath: `/producto/${p.id}`,
      lastModified: priceDataLastModified,
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  // Las legales no entran: van con noindex y solo gastarían presupuesto de
  // rastreo. Las de jugador sí, que son las que responden "qué pala usa X".
  entries.push({
    internalPath: "/jugadores",
    lastModified: priceDataLastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  });
  for (const p of PLAYERS) {
    entries.push({
      internalPath: `/jugadores/${p.slug}`,
      lastModified: priceDataLastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const a of ARTICLES) {
    const section = isGuide(a) ? "guias" : "noticias";
    entries.push({
      internalPath: `/${section}/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Cada entrada se expande a /es y /en con hreflang cruzado.
  return entries.flatMap((e) =>
    LOCALES.map((locale) => ({
      url: absoluteLocaleUrl(locale, e.internalPath),
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
      alternates: alternates(e.internalPath),
    }))
  );
}
