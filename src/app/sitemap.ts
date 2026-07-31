import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
import { ARTICLES } from "@/data/news";
import { absoluteUrl } from "@/data/site";

/**
 * Sirve /sitemap.xml.
 *
 * Se genera desde los datos, no a mano: al dar de alta un producto o un
 * artículo entra solo. Sin esto, las fichas dependían de que un crawler las
 * descubriera siguiendo enlaces internos.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const hoy = new Date();

  const estaticas: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: hoy, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/palas"), lastModified: hoy, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/raquetas"), lastModified: hoy, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/finder"), lastModified: hoy, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/comparar"), lastModified: hoy, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/noticias"), lastModified: hoy, changeFrequency: "weekly", priority: 0.7 },
  ];

  // Los precios se refrescan a menudo, así que las fichas son `daily`.
  const productos: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: absoluteUrl(`/producto/${p.id}`),
    lastModified: hoy,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const articulos: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: absoluteUrl(`/noticias/${a.slug}`),
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...estaticas, ...productos, ...articulos];
}
