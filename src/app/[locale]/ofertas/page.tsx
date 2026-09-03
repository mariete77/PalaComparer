import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { getPriceSummary } from "@/data/offers";
import ProductCard from "@/components/ProductCard";
import { isLocale, type Locale, localePath } from "@/i18n/locales";
import { translate } from "@/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  return {
    title: translate(locale, "ofertas.metaTitle"),
    description: translate(locale, "ofertas.metaDesc"),
    alternates: {
      canonical: `/${locale}/ofertas`,
      languages: {
        es: "/es/ofertas",
        en: "/en/ofertas",
        "x-default": "/es/ofertas",
      },
    },
  };
}

export default async function OfertasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const t = (k: Parameters<typeof translate>[1], params?: Record<string, string | number>) =>
    translate(locale, k, params);

  // Productos con precio real scrapeado y descuento real frente al PVP.
  const withDeals = PRODUCTS.map((p) => ({ p, s: getPriceSummary(p.id) }))
    .filter((x): x is { p: (typeof PRODUCTS)[number]; s: NonNullable<ReturnType<typeof getPriceSummary>> } =>
      Boolean(x.s && x.s.min < x.p.price && x.s.discountPct! >= 10)
    )
    .sort((a, b) => (b.s.discountPct ?? 0) - (a.s.discountPct ?? 0));

  const maxDiscount = withDeals[0]?.s.discountPct ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          {t("ofertas.titulo")}
        </h1>
        <p className="mt-3 text-muted max-w-2xl leading-relaxed">
          {t("ofertas.subtitulo")}
        </p>
      </header>

      {withDeals.length > 0 ? (
        <>
          <p className="text-sm text-muted mb-6">
            {t("ofertas.contador", { n: String(withDeals.length), max: String(maxDiscount) })}
          </p>

          {/* Cross-link: análisis calidad/precio con metodología y contexto. */}
          <Link
            href={localePath(locale, "/guias/mejores-palas-calidad-precio-2026")}
            className="card-glow group mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-overlay-2 border border-overlay-10 p-6 transition-colors hover:bg-overlay-4"
          >
            <div>
              <p className="text-xs font-semibold text-padel-strong uppercase tracking-wider">
                {t("ofertas.analisisTag")}
              </p>
              <p className="mt-1 font-display text-lg font-bold group-hover:text-primary-strong transition-colors">
                {t("ofertas.analisisTitulo")}
              </p>
              <p className="mt-1 text-sm text-muted leading-relaxed max-w-xl">
                {t("ofertas.analisisDesc")}
              </p>
            </div>
            <span className="shrink-0 btn-outline rounded-lg px-5 py-2.5 text-sm">
              {t("ofertas.leerAnalisis")}
            </span>
          </Link>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {withDeals.map(({ p, s }) => (
              <ProductCard key={p.id} product={p} bestPrice={s.min} />
            ))}
          </div>
        </>
      ) : (
        <div className="border-t border-overlay-10 py-16 text-center">
          <p className="font-display text-xl font-semibold">{t("ofertas.sinOfertas")}</p>
        </div>
      )}
    </div>
  );
}
