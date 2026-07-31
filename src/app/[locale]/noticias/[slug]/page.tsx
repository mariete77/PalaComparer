import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getNews, isGuide } from "@/data/news";
import ArticleDetail from "@/components/ArticleDetail";
import { isLocale, type Locale } from "@/i18n/locales";

export function generateStaticParams() {
  const locales: Locale[] = ["es", "en"];
  return locales.flatMap((locale) =>
    getNews().map((a) => ({ locale, slug: a.slug }))
  );
}

// Solo existen las novedades registradas: cualquier otro slug es 404. Las guías
// viven en /guias/[slug] y sus URLs antiguas se redirigen desde el proxy.
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
      canonical: `/${locale}/noticias/${slug}`,
      languages: {
        es: `/es/noticias/${slug}`,
        en: `/en/noticias/${slug}`,
        "x-default": `/es/noticias/${slug}`,
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

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const article = getArticle(slug);
  if (!article || isGuide(article)) notFound();

  const Body = await importBody(slug, locale);

  return <ArticleDetail article={article} locale={locale} Body={Body} />;
}

/**
 * Carga el cuerpo MDX del locale pedido. Para EN cae al ES si todavía no existe
 * la traducción (mejor mostrar el original que romper la página).
 */
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
