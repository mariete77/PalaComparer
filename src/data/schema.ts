// Constructores de JSON-LD (schema.org).
//
// Se inyectan siempre desde Server Components: GPTBot y ClaudeBot no ejecutan
// JavaScript, así que un schema montado en cliente es invisible para ellos.

import type { Product } from "./products";
import type { Offer } from "./offers";
import { STORES } from "./stores";
import { SITE_NAME, SITE_URL, absoluteUrl, absoluteLocaleUrl } from "./site";
import { LOCALE_BCP47, type Locale } from "@/i18n/locales";

// Descripciones de la organización por idioma (para JSON-LD).
const ORG_DESCRIPTION: Record<Locale, string> = {
  es: "Comparador independiente de palas de pádel y raquetas de tenis por especificaciones de fabricante y precios de varias tiendas.",
  en: "Independent padel paddle and tennis racket comparator by manufacturer specs and prices across multiple stores.",
};

function storeName(storeId: string): string {
  return STORES.find((s) => s.id === storeId)?.name ?? storeId;
}

/** Labels de specs por idioma para el JSON-LD. */
const SPEC_LABELS: Record<Locale, Record<string, string>> = {
  es: {
    forma: "Forma", peso: "Peso", balance: "Balance", nucleo: "Núcleo",
    caras: "Caras", dureza: "Dureza", tamiz: "Tamiz",
    pesoEncordada: "Peso encordada", patron: "Patrón de cuerdas",
    rigidez: "Rigidez (RA)",
  },
  en: {
    forma: "Shape", peso: "Weight", balance: "Balance", nucleo: "Core",
    caras: "Faces", dureza: "Hardness", tamiz: "Head size",
    pesoEncordada: "Strung weight", patron: "String pattern",
    rigidez: "Stiffness (RA)",
  },
};

/** Specs visibles como propiedades adicionales, que es lo que se puede citar. */
function additionalProperties(p: Product, locale: Locale) {
  const L = SPEC_LABELS[locale];
  if (p.padel) {
    return [
      { "@type": "PropertyValue", name: L.forma, value: p.padel.shape },
      { "@type": "PropertyValue", name: L.peso, value: p.padel.weight },
      { "@type": "PropertyValue", name: L.balance, value: p.padel.balance },
      { "@type": "PropertyValue", name: L.nucleo, value: p.padel.core },
      { "@type": "PropertyValue", name: L.caras, value: p.padel.faces },
      { "@type": "PropertyValue", name: L.dureza, value: p.padel.hardness },
    ];
  }
  if (p.tenis) {
    return [
      { "@type": "PropertyValue", name: L.tamiz, value: `${p.tenis.headSize} in²` },
      { "@type": "PropertyValue", name: L.pesoEncordada, value: `${p.tenis.weightStrung} g` },
      { "@type": "PropertyValue", name: L.patron, value: p.tenis.stringPattern },
      { "@type": "PropertyValue", name: L.rigidez, value: String(p.tenis.stiffness) },
      { "@type": "PropertyValue", name: L.balance, value: `${p.tenis.balancePoints} mm` },
    ];
  }
  return [];
}

/**
 * Product + AggregateOffer. Solo se emiten ofertas reales: si no hay ninguna,
 * se cae a un `Offer` único con el PVP, para no publicar precios de tienda que
 * no existen.
 */
export function buildProductSchema(
  p: Product,
  offers: Offer[],
  locale: Locale,
  description: string,
  imageUrl?: string
) {
  const enStock = offers.filter((o) => o.inStock);
  const precios = enStock.map((o) => o.price);

  const offerNode =
    enStock.length > 0
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice: Math.min(...precios).toFixed(2),
          highPrice: Math.max(...precios).toFixed(2),
          offerCount: enStock.length,
          offers: enStock.map((o) => ({
            "@type": "Offer",
            price: o.price.toFixed(2),
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: o.url,
            seller: { "@type": "Organization", name: storeName(o.storeId) },
          })),
        }
      : {
          "@type": "Offer",
          price: p.price.toFixed(2),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: absoluteLocaleUrl(locale, `/producto/${p.id}`),
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteLocaleUrl(locale, `/producto/${p.id}#product`),
    name: `${p.brand} ${p.model}`,
    sku: p.id,
    description,
    url: absoluteLocaleUrl(locale, `/producto/${p.id}`),
    ...(imageUrl
      ? { image: imageUrl.startsWith("http") ? imageUrl : absoluteUrl(imageUrl) }
      : {}),
    brand: { "@type": "Brand", name: p.brand },
    category: p.sport === "padel"
      ? locale === "en" ? "Padel paddles" : "Palas de pádel"
      : locale === "en" ? "Tennis rackets" : "Raquetas de tenis",
    inLanguage: LOCALE_BCP47[locale],
    releaseDate: String(p.year),
    additionalProperty: additionalProperties(p, locale),
    offers: offerNode,
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[],
  locale: Locale
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteLocaleUrl(locale, item.path),
    })),
  };
}

/**
 * Article + Person. Sin `author` y `datePublished` explícitos, una guía con
 * cuerpo experto no transmite ninguna señal E-E-A-T a los sistemas de IA.
 */
export function buildArticleSchema(
  article: {
    title: string;
    excerpt: string;
    date: string;
    author: string;
    slug: string;
    tags: string[];
  },
  locale: Locale,
  isGuideArticle: boolean
) {
  const section = isGuideArticle ? "guias" : "noticias";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: LOCALE_BCP47[locale],
    keywords: article.tags.join(", "),
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo-full.png") },
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".article-summary", "article h1", "article h2"],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteLocaleUrl(locale, `/${section}/${article.slug}`),
    },
  };
}

/** ItemList para los listados: convierte una rejilla de UI en datos legibles. */
export function buildItemListSchema(
  name: string,
  items: { id: string; brand: string; model: string }[],
  locale: Locale
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${p.brand} ${p.model}`,
      url: absoluteLocaleUrl(locale, `/producto/${p.id}`),
    })),
  };
}

export function buildOrganizationSchema(locale: Locale = "es") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo-full.png"),
    description: ORG_DESCRIPTION[locale],
    knowsAbout: locale === "en"
      ? ["Padel equipment", "Tennis rackets", "Manufacturer specifications", "Retail price comparison"]
      : ["Material de pádel", "Raquetas de tenis", "Especificaciones de fabricante", "Comparación de precios"],
  };
}

export function buildWebSiteSchema(locale: Locale = "es") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: LOCALE_BCP47[locale],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteLocaleUrl(locale, "/palas?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}
