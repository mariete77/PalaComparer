import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/locales";
import { translate } from "@/i18n/locales";
import { absoluteLocaleUrl } from "@/data/site";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  return {
    title: translate(locale, "metodologia.metaTitle"),
    description: translate(locale, "metodologia.metaDesc"),
    alternates: {
      canonical: `/${locale}/metodologia`,
      languages: { es: "/es/metodologia", en: "/en/metodologia", "x-default": "/es/metodologia" },
    },
  };
}

export default async function MetodologiaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const title = t("metodologia.titulo");

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: title,
          description: t("metodologia.resumen"),
          url: absoluteLocaleUrl(locale, "/metodologia"),
          inLanguage: locale === "en" ? "en-GB" : "es-ES",
        }}
      />
      <header className="mb-12">
        <p className="text-xs font-bold uppercase tracking-wider text-padel-strong mb-2">{t("metodologia.eyebrow")}</p>
        <h1 className="font-display text-4xl font-bold leading-tight">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{t("metodologia.resumen")}</p>
      </header>

      <div className="space-y-12">
        <section>
          <h2 className="font-display text-2xl font-bold mb-3">{t("metodologia.especificacionesTitulo")}</h2>
          <p className="text-muted leading-relaxed">{t("metodologia.especificaciones")}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold mb-3">{t("metodologia.preciosTitulo")}</h2>
          <p className="text-muted leading-relaxed">{t("metodologia.precios")}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold mb-3">{t("metodologia.actualizacionTitulo")}</h2>
          <p className="text-muted leading-relaxed">{t("metodologia.actualizacion")}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold mb-3">{t("metodologia.criterioTitulo")}</h2>
          <p className="text-muted leading-relaxed">{t("metodologia.criterio")}</p>
        </section>
      </div>
    </main>
  );
}
