import Catalog from "@/components/Catalog";
import { bySport } from "@/data/products";
import { buildPriceIndex } from "@/data/offers";
import JsonLd from "@/components/JsonLd";
import { buildItemListSchema } from "@/data/schema";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/locales";
import { translate } from "@/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  return {
    title: translate(locale, "raquetas.metaTitle"),
    description: translate(locale, "raquetas.metaDesc"),
    alternates: {
      canonical: `/${locale}/raquetas`,
      languages: {
        es: "/es/raquetas",
        en: "/en/raquetas",
        "x-default": "/es/raquetas",
      },
    },
  };
}

export default async function RaquetasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const t = (k: Parameters<typeof translate>[1], p?: Record<string, string | number>) =>
    translate(locale, k, p);

  const products = bySport("tenis");
  const priceIndex = buildPriceIndex(products);
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <JsonLd
        data={buildItemListSchema(
          locale === "en" ? "Tennis rackets" : "Raquetas de tenis",
          products,
          locale
        )}
      />
      <header className="mb-8">
        <p className="text-xs font-bold text-tenis uppercase tracking-wider mb-1">
          {t("catalog.catalogoCompleto")}
        </p>
        <h1 className="font-display text-4xl font-bold">{t("raquetas.titulo")}</h1>
        <p className="text-muted mt-2">
          {t("raquetas.subtitulo", { n: products.length })}
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          {t("raquetas.intro")}
        </p>
      </header>
      <Catalog products={products} sport="tenis" priceIndex={priceIndex} />
    </div>
  );
}
