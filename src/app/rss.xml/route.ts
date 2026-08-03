// Feed RSS del sitio: novedades + guías más recientes.
//
// Sirve /rss.xml con los últimos artículos en español e inglés. Lo consumen
// agregadores, apps de lectura y Google News: es una vía más para que el
// contenido nuevo llegue a usuarios sin depender solo del buscador.

import { ARTICLES, articleHref, isGuide } from "@/data/news";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/data/site";

const MAX_ITEMS = 20;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function itemXml(
  a: (typeof ARTICLES)[number],
  locale: "es" | "en",
  kind: string
): string {
  const title = a.title[locale];
  const excerpt = a.excerpt[locale];
  const href = articleHref(a, locale);
  const url = absoluteUrl(href);
  const guid = `${url}#${a.date}`;
  return [
    "    <item>",
    `      <title>${xmlEscape(title)}</title>`,
    `      <link>${xmlEscape(url)}</link>`,
    `      <guid isPermaLink="false">${xmlEscape(guid)}</guid>`,
    `      <description>${xmlEscape(excerpt)}</description>`,
    `      <pubDate>${new Date(`${a.date}T00:00:00Z`).toUTCString()}</pubDate>`,
    `      <category>${xmlEscape(kind)}</category>`,
    "    </item>",
  ].join("\n");
}

export function GET() {
  const items = ARTICLES.slice(0, MAX_ITEMS)
    .map((a) => {
      const kind = isGuide(a) ? "guia" : "novedad";
      const es = itemXml(a, "es", kind);
      const en = itemXml(a, "en", kind);
      return [es, en].join("\n");
    })
    .join("\n");

  const lastBuild = ARTICLES[0]?.date
    ? new Date(`${ARTICLES[0].date}T00:00:00Z`).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_NAME)} — Novedades y guías</title>
    <link>${xmlEscape(SITE_URL)}</link>
    <description>Compara palas de pádel y raquetas de tenis: novedades del circuito, análisis de calidad/precio y guías de compra con precios reales.</description>
    <language>es-es</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${xmlEscape(SITE_URL)}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
