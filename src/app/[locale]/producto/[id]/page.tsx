import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getDescription, PRODUCTS } from "@/data/products";
import { getProductImage } from "@/data/product-image";
import {
  formatPrice,
  getBestPrice,
  getOffers,
  getPriceHistory,
  getPriceSummary,
} from "@/data/offers";
import { kindLabel, getArticlesForProduct, articleHref } from "@/data/news";
import { buildProductSchema, buildBreadcrumbSchema } from "@/data/schema";
import JsonLd from "@/components/JsonLd";
import AddToCompare from "@/components/AddToCompare";
import ProductCard from "@/components/ProductCard";
import OfferTable from "@/components/OfferTable";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import type { Metadata } from "next";
import { isLocale, type Locale, localePath } from "@/i18n/locales";
import { translate, type TranslationKey } from "@/i18n/locales";
import { getRatings } from "@/data/ratings";
import { RatingGrid } from "@/components/RatingBar";

export function generateStaticParams() {
  return PRODUCTS.flatMap((p) => [
    { locale: "es", id: p.id },
    { locale: "en", id: p.id },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const p = getProduct(id);
  if (!p) return {};
  const description = getDescription(p, locale);
  return {
    title: `${p.brand} ${p.model} (${p.year}) — PalaComparer`,
    description,
    // Evita duplicados por www/apex y por parámetros de campaña.
    alternates: {
      canonical: `/${locale}/producto/${p.id}`,
      languages: {
        es: `/es/producto/${p.id}`,
        en: `/en/producto/${p.id}`,
        "x-default": `/es/producto/${p.id}`,
      },
    },
    openGraph: {
      title: `${p.brand} ${p.model} (${p.year})`,
      description,
      url: `/${locale}/producto/${p.id}`,
      type: "website",
      locale: locale === "en" ? "en_US" : "es_ES",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const lp = (path: string) => localePath(locale, path);
  const t = (key: TranslationKey, params?: Record<string, string | number>) =>
    translate(locale, key, params);

  const p = getProduct(id);
  if (!p) notFound();

  const accentText = p.sport === "padel" ? "text-padel-strong" : "text-tenis-strong";
  const accentBg = p.sport === "padel" ? "bg-padel" : "bg-tenis";
  const accentVar = p.sport === "padel" ? "var(--accent-padel)" : "var(--accent-tenis)";

  const image = getProductImage(p);
  const summary = getPriceSummary(p.id);
  const offers = getOffers(p.id);
  const history = getPriceHistory(p.id);
  const noticias = getArticlesForProduct(p.id);
  const description = getDescription(p, locale);

  // Etiquetas de specs localizadas, vía el diccionario.
  const specsLabel = (k: TranslationKey) => t(k);
  const specs: [string, string][] =
    p.sport === "padel" && p.padel
      ? [
          [specsLabel("product.forma"), localizeEnumShape(p.padel.shape, locale)],
          [specsLabel("product.peso"), p.padel.weight],
          [specsLabel("product.balance"), localizeEnumBalance(p.padel.balance, locale)],
          [specsLabel("product.nucleo"), p.padel.core],
          [specsLabel("product.caras"), p.padel.faces],
          [specsLabel("product.superficie"), localizeEnumSurface(p.padel.surface, locale)],
          [specsLabel("product.dureza"), localizeEnumHardness(p.padel.hardness, locale)],
        ]
      : p.tenis
        ? [
            [specsLabel("product.tamis"), `${p.tenis.headSize} in²`],
            [specsLabel("product.pesoEncordada"), `${p.tenis.weightStrung} g`],
            [specsLabel("product.longitud"), `${p.tenis.length} cm`],
            [specsLabel("product.patronEncordado"), p.tenis.stringPattern],
            [specsLabel("product.rigidez"), String(p.tenis.stiffness)],
            [specsLabel("product.balance"), `${p.tenis.balancePoints} mm`],
            [specsLabel("product.swingweight"), String(p.tenis.swingweight)],
          ]
        : [];

  const similares = PRODUCTS.filter(
    (x) =>
      x.id !== p.id &&
      x.sport === p.sport &&
      (x.style.some((s) => p.style.includes(s)) || x.brand === p.brand)
  ).slice(0, 4);

  const listado = p.sport === "padel" ? "/palas" : "/raquetas";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* El dato que hace citable esta ficha: specs de fabricante + precios
          reales de varias tiendas, legibles como entidad por sistemas de IA. */}
      <JsonLd data={buildProductSchema(p, offers, locale, description, image.isReal ? image.src : undefined)} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: t("product.inicio"), path: "/" },
          { name: p.sport === "padel" ? t("nav.palas") : t("nav.raquetas"), path: listado },
          { name: `${p.brand} ${p.model}`, path: `/producto/${p.id}` },
        ], locale)}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-6">
        <Link href={lp("/")} className="hover:text-foreground">{t("product.inicio")}</Link>
        {" / "}
        <Link href={lp(listado)} className="hover:text-foreground">
          {p.sport === "padel" ? t("nav.palas") : t("nav.raquetas")}
        </Link>
        {" / "}
        <span className="text-foreground">{p.model}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Imagen */}
        <div>
          <div className={`relative aspect-[2/3] max-h-[600px] rounded-3xl overflow-hidden card-glow ${
            image.isReal ? "bg-white" : "bg-gradient-to-b from-overlay-5 to-transparent"
          }`}>
            <Image
              src={image.src}
              unoptimized={image.unoptimized}
              alt={`${p.brand} ${p.model}`}
              fill
              className="object-contain p-8"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!image.isReal && (
              <span className="absolute bottom-3 left-3 text-[10px] text-muted bg-background/70 px-2 py-1 rounded-full">
                {t("product.ilustracionOrientativa")}
              </span>
            )}
          </div>
          {image.credit && (
            <p className="mt-2 text-[11px] text-muted text-right">
              {image.source ? (
                <a
                  href={image.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {image.credit}
                </a>
              ) : (
                image.credit
              )}
            </p>
          )}
        </div>

        {/* Info */}
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider ${accentText}`}>
            {p.brand} · {p.year}
          </p>
          <h1 className="font-display text-4xl font-bold mt-2 leading-tight">
            {p.model}
          </h1>
          {p.player && (
            <p className="mt-2 text-sm text-muted">
              🏆 {t("product.eleccionDe")} <span className="text-foreground font-medium">{p.player}</span>
            </p>
          )}

          {summary ? (
            <div className="mt-6">
              <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                <span className="font-display text-4xl font-bold">
                  {formatPrice(summary.min)}
                </span>
                {summary.discountPct > 0 && (
                  <>
                    <span className="text-muted line-through text-sm">
                      {formatPrice(p.price)}
                    </span>
                    <span className={`text-sm font-semibold ${accentText}`}>
                      −{summary.discountPct}%
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">
                {t("product.mejorPrecioTiendas", {
                  n: summary.offerCount,
                  tiendas: summary.offerCount === 1
                    ? (locale === "en" ? "store" : "tienda")
                    : (locale === "en" ? "stores" : "tiendas"),
                  pvp: formatPrice(p.price),
                })}
              </p>
              {summary.atHistoricalLow && (
                <p className="mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-padel/15 text-padel border border-padel/30">
                  {t("product.minimoHistorico")}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold">
                {formatPrice(p.price)}
              </span>
              <span className="text-xs text-muted">{t("product.pvpOrientativo")}</span>
            </div>
          )}

          <p className="mt-6 text-muted leading-relaxed">{description}</p>

          {/* Rating bars */}
          {(() => {
            const ratings = getRatings(p);
            return ratings ? (
              <div className="mt-6 rounded-2xl bg-overlay-3 border border-overlay-5 p-5">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted mb-3">
                  {t("product.rendimiento")}
                </h3>
                <RatingGrid ratings={ratings} />
              </div>
            ) : null;
          })()}

          <div className="mt-6 flex flex-wrap gap-2">
            {p.level.map((l) => (
              <span
                key={l}
                className="px-3 py-1 rounded-full text-xs font-medium bg-overlay-5 border border-overlay-10"
              >
                {translate(locale, `catalog.nivel.${l}`)}
              </span>
            ))}
            {p.style.map((s) => (
              <span
                key={s}
                className={`px-3 py-1 rounded-full text-xs font-medium ${accentBg} text-black`}
              >
                {translate(locale, `catalog.estilo.${s}`)}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <AddToCompare productId={p.id} />
          </div>
        </div>
      </div>

      {/* Specs */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold mb-6">
          {t("product.specsTecnicas")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {specs.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl bg-overlay-3 border border-overlay-5 p-4"
            >
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dónde comprar */}
      {offers.length > 0 && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
            <h2 className="font-display text-2xl font-bold">{t("product.dondeComprar")}</h2>
            <p className="text-xs text-muted">
              {t("product.dondeComprarNota")}
            </p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <OfferTable offers={offers} locale={locale} />

            {history.length > 1 && (
              <div className="rounded-2xl bg-overlay-2 border border-overlay-5 p-5">
                <h3 className="font-display font-semibold mb-1">
                  {t("product.evolucionPrecio")}
                </h3>
                <p className="text-xs text-muted mb-4">
                  {t("product.evolucionPrecioSub")}
                </p>
                <PriceHistoryChart points={history} accent={accentVar} />
                {summary && (
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted uppercase tracking-wider">
                        {t("product.minimoHistoricoLabel")}
                      </dt>
                      <dd className="font-semibold tabular-nums mt-0.5">
                        {formatPrice(summary.historicalMin)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted uppercase tracking-wider">
                        {t("product.maximoActual")}
                      </dt>
                      <dd className="font-semibold tabular-nums mt-0.5">
                        {formatPrice(summary.max)}
                      </dd>
                    </div>
                  </dl>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Noticias relacionadas */}
      {noticias.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6">
            {p.sport === "padel" ? t("product.hablamosPala") : t("product.hablamosRaqueta")}
          </h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {noticias.map((a) => (
              <li key={a.slug}>
                <Link
                  href={articleHref(a, locale)}
                  className="block h-full rounded-xl bg-overlay-2 border border-overlay-5 p-5 hover:bg-overlay-5 transition-colors"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">
                    {kindLabel(a.kind, locale)} · {a.readingMinutes} {t("common.min")}
                  </span>
                  <p className="font-display font-semibold mt-1.5 leading-snug">
                    {a.title[locale]}
                  </p>
                  <p className="text-sm text-muted mt-1.5 leading-relaxed">
                    {a.excerpt[locale]}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Similares */}
      {similares.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">
            {t("product.tambienInteresa")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similares.map((s) => (
              <ProductCard
                key={s.id}
                product={s}
                bestPrice={getBestPrice(s.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Traducciones de enums de specs de pádel. Viven aquí porque son específicas de
// la ficha de producto; las del catálogo (chips) usan el diccionario.
function localizeEnumShape(v: string, locale: Locale): string {
  const map: Record<Locale, Record<string, string>> = {
    es: { redonda: "Redonda", lagrima: "Lágrima", diamante: "Diamante", hibrida: "Híbrida" },
    en: { redonda: "Round", lagrima: "Teardrop", diamante: "Diamond", hibrida: "Hybrid" },
  };
  return map[locale][v] ?? v;
}
function localizeEnumBalance(v: string, locale: Locale): string {
  const map: Record<Locale, Record<string, string>> = {
    es: { bajo: "Bajo", medio: "Medio", alto: "Alto" },
    en: { bajo: "Low", medio: "Medium", alto: "High" },
  };
  return map[locale][v] ?? v;
}
function localizeEnumSurface(v: string, locale: Locale): string {
  const map: Record<Locale, Record<string, string>> = {
    es: { rugosa: "Rugosa", lisa: "Lisa" },
    en: { rugosa: "Rough", lisa: "Smooth" },
  };
  return map[locale][v] ?? v;
}
function localizeEnumHardness(v: string, locale: Locale): string {
  const map: Record<Locale, Record<string, string>> = {
    es: { blanda: "Blanda", media: "Media", dura: "Dura" },
    en: { blanda: "Soft", media: "Medium", dura: "Hard" },
  };
  return map[locale][v] ?? v;
}
