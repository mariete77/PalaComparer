import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { getBestPrice, getPriceSummary } from "@/data/offers";
import { ARTICLES, kindLabel, formatArticleDate, articleHref } from "@/data/news";
import ProductCarousel from "@/components/ProductCarousel";
import Hero from "@/components/Hero";
import StoreMarquee from "@/components/StoreMarquee";
import { isLocale, type Locale, localePath } from "@/i18n/locales";
import { translate, type TranslationKey } from "@/i18n/locales";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const lp = (path: string) => localePath(locale, path);
  const t = (key: TranslationKey, params?: Record<string, string | number>) =>
    translate(locale, key, params);

  const destacadosPadel = PRODUCTS.filter(
    (p) =>
      p.sport === "padel" &&
      ["nox-at10-genius-18k-2026", "bullpadel-vertex-05-2026", "siux-diablo-pro-2026", "starvie-raptor-2026"].includes(p.id)
  );
  const destacadosTenis = PRODUCTS.filter(
    (p) =>
      p.sport === "tenis" &&
      ["wilson-blade-98-v10-2026", "babolat-pure-aero-2026", "head-speed-mp-2026", "yonex-vcore-98-2026"].includes(p.id)
  );
  const ultimasNoticias = ARTICLES.slice(0, 3);

  // Ofertas de la semana: los 4 productos con mayor descuento real verificado.
  const ofertasSemana = PRODUCTS.map((p) => ({ p, s: getPriceSummary(p.id) }))
    .filter(
      (x): x is { p: (typeof PRODUCTS)[number]; s: NonNullable<ReturnType<typeof getPriceSummary>> } =>
        Boolean(x.s && x.s.min < x.p.price && (x.s.discountPct ?? 0) >= 10)
    )
    .sort((a, b) => (b.s.discountPct ?? 0) - (a.s.discountPct ?? 0))
    .slice(0, 4)
    .map((x) => x.p);

  const pilares = [
    {
      title: t("home.pilarSpecsTitulo"),
      desc: t("home.pilarSpecsDesc"),
    },
    {
      title: t("home.pilarFiltrosTitulo"),
      desc: t("home.pilarFiltrosDesc"),
    },
    {
      title: t("home.pilarComparadorTitulo"),
      desc: t("home.pilarComparadorDesc"),
    },
  ];

  return (
    <div>
      {/* HERO — Artistic Asymmetry with video background */}
      <Hero
        content={{
          eyebrow: `${PRODUCTS.length} ${t("home.modelosRango")}`,
          titleA: t("home.encuentraTu"),
          titleB: t("home.armaPerfecta"),
          tagline: t("footer.tagline"),
          updateNote: t("home.actualizacionSemanal"),
          primaryHref: lp("/finder"),
          primaryLabel: t("home.encontrarMiPala"),
          secondaryHref: lp("/comparar"),
          secondaryLabel: t("home.compararModelos"),
        }}
      />

      {/* Store marquee */}
      <StoreMarquee />

      {/* PILARES */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:col-span-4">
            {t("home.pilarTitulo")}
          </h2>
          <dl className="divide-y divide-white/10 border-t border-white/10 md:col-span-7 md:col-start-6">
            {pilares.map((p) => (
              <div key={p.title} className="grid gap-1 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8">
                <dt className="font-display font-semibold text-primary-container">
                  {p.title}
                </dt>
                <dd className="text-sm leading-relaxed text-muted">{p.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* OFERTAS DE LA SEMANA — las 4 con mayor descuento real */}
      <section className="max-w-7xl mx-auto px-6 mb-20 md:mb-28">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            {t("home.ofertasSemana")}
          </h2>
          <Link href={lp("/ofertas")} className="shrink-0 text-sm font-semibold text-padel hover:underline">
            {t("common.verTodas")}
          </Link>
        </div>
        <ProductCarousel
          id="ofertas"
          autoplay
          items={ofertasSemana.map((p) => ({
            product: p,
            bestPrice: getBestPrice(p.id),
          }))}
        />
      </section>

      {/* PADEL DESTACADO */}
      <section className="max-w-7xl mx-auto px-6 mb-20 md:mb-28">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            {t("home.palasDelMomento")}
          </h2>
          <Link href={lp("/palas")} className="shrink-0 text-sm font-semibold text-padel hover:underline">
            {t("common.verTodas")}
          </Link>
        </div>
        <ProductCarousel
          id="padel"
          items={destacadosPadel.map((p) => ({
            product: p,
            bestPrice: getBestPrice(p.id),
          }))}
        />
      </section>

      {/* TENIS DESTACADO */}
      <section className="max-w-7xl mx-auto px-6 mb-20 md:mb-28">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            {t("home.raquetasDestacadas")}
          </h2>
          <Link href={lp("/raquetas")} className="shrink-0 text-sm font-semibold text-tenis hover:underline">
            {t("common.verTodas")}
          </Link>
        </div>
        <ProductCarousel
          id="tenis"
          items={destacadosTenis.map((p) => ({
            product: p,
            bestPrice: getBestPrice(p.id),
          }))}
        />
      </section>

      {/* NOTICIAS — editorial layout */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            {t("home.antesDeComprar")}
          </h2>
          <Link href={lp("/noticias")} className="shrink-0 text-sm font-semibold text-padel hover:underline">
            {t("common.verTodas")}
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {ultimasNoticias.map((a) => (
            <Link
              key={a.slug}
              href={articleHref(a, locale)}
              className="group card-glow rounded-2xl bg-white/[0.02] p-6 flex flex-col"
            >
              <span className="text-xs font-semibold text-padel">
                {kindLabel(a.kind, locale)}
              </span>
              <h3 className="mt-3 font-display text-lg font-bold leading-snug transition-colors group-hover:text-primary-container flex-1">
                {a.title[locale]}
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-2">
                {a.excerpt[locale]}
              </p>
              <p className="mt-4 text-xs text-muted">
                {formatArticleDate(a.date, locale)} · {a.readingMinutes} {t("common.min")}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
