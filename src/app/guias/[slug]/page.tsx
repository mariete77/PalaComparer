import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getGuides, isGuide } from "@/data/news";
import ArticleDetail from "@/components/ArticleDetail";

export function generateStaticParams() {
  return getGuides().map((a) => ({ slug: a.slug }));
}

// Solo existen las guías registradas: cualquier otro slug es 404.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: `${article.title} — PalaComparer`,
    description: article.excerpt,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      tags: article.tags,
    },
  };
}

export default async function GuiaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  // Una novedad no se sirve desde /guias aunque el slug exista.
  if (!article || !isGuide(article)) notFound();

  // Todo el contenido vive en src/content/noticias, también el de las guías:
  // la carpeta es el almacén, la sección la decide `kind`.
  const { default: Body } = await import(`@/content/noticias/${slug}.mdx`);

  return <ArticleDetail article={article} Body={Body} />;
}
