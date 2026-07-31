import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { getBestPrice } from "@/data/offers";
import { ARTICLES, kindLabel, formatArticleDate, articleHref } from "@/data/news";
import ProductCard from "@/components/ProductCard";
import HeroMedia from "@/components/HeroMedia";
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
      ["babolat-pure-aero-2023", "wilson-blade-98-v9-2024", "head-speed-mp-2024", "yonex-ezone-100-2022"].includes(p.id)
  );
  const ultimasNoticias = ARTICLES.slice(0, 3);

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
      <section className="relative isolate overflow-hidden">
        {/* Video background */}
        <div className="absolute inset-0 -z-10">
          <HeroMedia />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="max-w-3xl">
            <p className="rise text-sm text-muted">
              {PRODUCTS.length} {t("home.modelosRango")}
            </p>
            <h1
              className="rise mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "60ms" }}
            >
              {t("home.encuentraTu")}
              <br />
              <span className="text-primary-container">{t("home.armaPerfecta")}</span>
            </h1>
            <p
              className="rise mt-6 max-w-[48ch] text-lg leading-relaxed text-muted"
              style={{ animationDelay: "120ms" }}
            >
              {t("footer.tagline")}
            </p>
            <div
              className="rise mt-10 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "180ms" }}
            >
              <Link href={lp("/finder")} className="btn-lime rounded-lg px-7 py-4 text-sm">
                {t("home.encontrarMiPala")}
              </Link>
              <Link href={lp("/comparar")} className="btn-outline rounded-lg px-7 py-4 text-sm">
                {t("home.compararModelos")}
              </Link>
            </div>
          </div>
        </div>
      </section>

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destacadosPadel.map((p) => (
            <ProductCard key={p.id} product={p} bestPrice={getBestPrice(p.id)} />
          ))}
        </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destacadosTenis.map((p) => (
            <ProductCard key={p.id} product={p} bestPrice={getBestPrice(p.id)} />
          ))}
        </div>
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
