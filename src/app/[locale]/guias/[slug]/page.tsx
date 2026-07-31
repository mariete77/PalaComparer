import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getGuides, isGuide } from "@/data/news";
import ArticleDetail from "@/components/ArticleDetail";
import { isLocale, type Locale } from "@/i18n/locales";

export function generateStaticParams() {
  const locales: Locale[] = ["es", "en"];
  return locales.flatMap((locale) =>
    getGuides().map((a) => ({ locale, slug: a.slug }))
  );
}

// Solo existen las guías registradas: cualquier otro slug es 404.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: `${article.title[locale]} — PalaComparer`,
    description: article.excerpt[locale],
    authors: [{ name: article.author }],
    alternates: {
      canonical: `/${locale}/guias/${slug}`,
      languages: {
        es: `/es/guias/${slug}`,
        en: `/en/guias/${slug}`,
        "x-default": `/es/guias/${slug}`,
      },
    },
    openGraph: {
      title: article.title[locale],
      description: article.excerpt[locale],
      type: "article",
      publishedTime: article.date,
      tags: article.tags.map((t) => t[locale]),
      locale: locale === "en" ? "en_US" : "es_ES",
    },
  };
}

export default async function GuiaPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const article = getArticle(slug);
  // Una novedad no se sirve desde /guias aunque el slug exista.
  if (!article || !isGuide(article)) notFound();

  // Todo el contenido vive en src/content/noticias, también el de las guías:
  // la carpeta es el almacén, la sección la decide `kind`.
  const Body = await importBody(slug, locale);

  return <ArticleDetail article={article} locale={locale} Body={Body} />;
}

async function importBody(slug: string, locale: Locale) {
  if (locale === "en") {
    try {
      const mod = await import(`@/content/noticias/en/${slug}.mdx`);
      return mod.default;
    } catch {
      // Sin traducción todavía: usa el cuerpo español.
    }
  }
  const mod = await import(`@/content/noticias/${slug}.mdx`);
  return mod.default;
}
