import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/data/news";
import NewsList from "@/components/NewsList";
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
    title: translate(locale, "noticias.metaTitle"),
    description: translate(locale, "noticias.metaDesc"),
    alternates: {
      canonical: `/${locale}/noticias`,
      languages: {
        es: "/es/noticias",
        en: "/en/noticias",
        "x-default": "/es/noticias",
      },
    },
  };
}

export default async function NoticiasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const lp = (path: string) => localePath(locale, path);
  const t = (k: Parameters<typeof translate>[1]) => translate(locale, k);

  const noticias = getNews();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          {t("noticias.titulo")}
        </h1>
        <p className="mt-3 text-muted max-w-2xl leading-relaxed">
          {t("noticias.subtitulo")}
        </p>
      </header>

      {noticias.length > 0 ? (
        <NewsList articles={noticias} />
      ) : (
        <div className="border-t border-overlay-10 py-16 text-center">
          <p className="font-display text-xl font-semibold">
            {t("news.sinNovedades")}
          </p>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto leading-relaxed">
            {t("noticias.vacioCuerpo")}
          </p>
          <Link
            href={lp("/guias")}
            className="btn-lime mt-7 inline-block rounded-lg px-6 py-3 text-sm"
          >
            {t("news.verGuias")}
          </Link>
        </div>
      )}
    </div>
  );
}
