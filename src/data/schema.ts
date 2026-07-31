// Constructores de JSON-LD (schema.org).
//
// Se inyectan siempre desde Server Components: GPTBot y ClaudeBot no ejecutan
// JavaScript, así que un schema montado en cliente es invisible para ellos.

import type { Product } from "./products";
import type { Offer } from "./offers";
import { STORES } from "./stores";
import { SITE_NAME, SITE_URL, absoluteUrl } from "./site";

function storeName(storeId: string): string {
  return STORES.find((s) => s.id === storeId)?.name ?? storeId;
}

/** Specs visibles como propiedades adicionales, que es lo que se puede citar. */
function additionalProperties(p: Product) {
  if (p.padel) {
    return [
      { "@type": "PropertyValue", name: "Forma", value: p.padel.shape },
      { "@type": "PropertyValue", name: "Peso", value: p.padel.weight },
      { "@type": "PropertyValue", name: "Balance", value: p.padel.balance },
      { "@type": "PropertyValue", name: "Núcleo", value: p.padel.core },
      { "@type": "PropertyValue", name: "Caras", value: p.padel.faces },
      { "@type": "PropertyValue", name: "Dureza", value: p.padel.hardness },
    ];
  }
  if (p.tenis) {
    return [
      { "@type": "PropertyValue", name: "Tamiz", value: `${p.tenis.headSize} in²` },
      { "@type": "PropertyValue", name: "Peso encordada", value: `${p.tenis.weightStrung} g` },
      { "@type": "PropertyValue", name: "Patrón de cuerdas", value: p.tenis.stringPattern },
      { "@type": "PropertyValue", name: "Rigidez (RA)", value: String(p.tenis.stiffness) },
      { "@type": "PropertyValue", name: "Balance", value: `${p.tenis.balancePoints} mm` },
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
          url: absoluteUrl(`/producto/${p.id}`),
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.brand} ${p.model}`,
    sku: p.id,
    description: p.description,
    url: absoluteUrl(`/producto/${p.id}`),
    ...(imageUrl
      ? { image: imageUrl.startsWith("http") ? imageUrl : absoluteUrl(imageUrl) }
      : {}),
    brand: { "@type": "Brand", name: p.brand },
    category: p.sport === "padel" ? "Palas de pádel" : "Raquetas de tenis",
    releaseDate: String(p.year),
    additionalProperty: additionalProperties(p),
    offers: offerNode,
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo-full.png"),
    description:
      "Comparador independiente de palas de pádel y raquetas de tenis por especificaciones de fabricante y precios de varias tiendas.",
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "es-ES",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/palas?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}
