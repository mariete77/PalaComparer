import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, isLocale, type Locale } from "@/i18n/locales";
import { LEGAL_PAGES, LEGAL_SLUGS, getLegalPage } from "@/data/legal";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    LEGAL_SLUGS.map((slug) => ({ locale, slug }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const page = getLegalPage(slug);
  if (!page) return {};

  return {
    title: `${page.title[locale]} — PalaComparer`,
    description: page.description[locale],
    // Las legales no aportan nada en buscadores y diluyen el presupuesto de
    // rastreo, pero deben seguir siendo accesibles y enlazables.
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/${locale}/legal/${slug}`,
      languages: {
        es: `/es/legal/${slug}`,
        en: `/en/legal/${slug}`,
        "x-default": `/es/legal/${slug}`,
      },
    },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const page = getLegalPage(slug);
  if (!page) notFound();

  const en = locale === "en";
  // Mientras queden marcadores sin rellenar, la página se marca como borrador.
  const incompleta = page.sections[locale].some((s) => s.body.includes("["));

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        {page.title[locale]}
      </h1>
      <p className="mt-3 text-muted leading-relaxed">{page.description[locale]}</p>

      {incompleta && (
        <p className="mt-8 rounded-xl border border-warning/40 bg-warning/10 px-5 py-4 text-sm leading-relaxed">
          <strong className="font-semibold">
            {en ? "Draft, not publishable yet." : "Borrador, todavía no publicable."}
          </strong>{" "}
          {en
            ? "The fields in square brackets must be filled with the real details of the site owner before this page goes live."
            : "Los campos entre corchetes hay que rellenarlos con los datos reales del titular antes de publicar esta página."}
        </p>
      )}

      <div className="mt-10 space-y-8">
        {page.sections[locale].map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-bold mb-2">
              {section.heading}
            </h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-overlay-10 pt-6 text-xs text-muted">
        {en ? "Last updated" : "Última actualización"}: {LEGAL_PAGES.updated}
      </p>
    </div>
  );
}
