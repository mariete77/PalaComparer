import type { Metadata } from "next";
import { getGuides } from "@/data/news";
import NewsList from "@/components/NewsList";
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
    title: translate(locale, "guias.metaTitle"),
    description: translate(locale, "guias.metaDesc"),
    alternates: {
      canonical: `/${locale}/guias`,
      languages: {
        es: "/es/guias",
        en: "/en/guias",
        "x-default": "/es/guias",
      },
    },
  };
}

export default async function GuiasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const t = (k: Parameters<typeof translate>[1]) => translate(locale, k);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          {t("guias.titulo")}
        </h1>
        <p className="mt-3 text-muted max-w-2xl leading-relaxed">
          {t("guias.subtitulo")}
        </p>
      </header>

      <NewsList articles={getGuides()} />
    </div>
  );
}
