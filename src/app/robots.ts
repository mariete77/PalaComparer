import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/data/site";

/**
 * Sirve /robots.txt.
 *
 * Los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, etc.) entran sin
 * restricción a propósito: el objetivo del sitio es ser citado como fuente de
 * specs y precios. Lo que sí se excluye son las rutas sin valor de indexación.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
