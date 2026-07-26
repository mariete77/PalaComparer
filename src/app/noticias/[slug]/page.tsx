import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ARTICLES,
  KIND_LABEL,
  formatArticleDate,
  getArticle,
} from "@/data/news";
import { getProduct } from "@/data/products";
import { getBestPrice } from "@/data/offers";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// Solo existen los artículos registrados en ARTICLES: cualquier otro slug es 404.
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { default: Body } = await import(`@/content/noticias/${slug}.mdx`);

  const related = (article.relatedProducts ?? [])
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const others = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);
  const accent = article.sport === "tenis" ? "text-tenis" : "text-padel";

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <nav className="text-xs text-muted mb-8">
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        {" / "}
        <Link href="/noticias" className="hover:text-foreground">
          Noticias
        </Link>
        {" / "}
        <span className="text-foreground">{article.title}</span>
      </nav>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${accent}`}
          >
            {KIND_LABEL[article.kind]}
          </span>
          {article.tags.map((t) => (
            <span
              key={t}
              className="px-2.5 py-0.5 rounded-full text-xs bg-white/5 border border-white/10"
            >
              {t}
            </span>
          ))}
        </div>

        <h1 className="font-display text-4xl font-bold leading-tight">
          {article.title}
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          {article.excerpt}
        </p>
        <p className="mt-6 text-sm text-muted">
          {article.author} · <time dateTime={article.date}>{formatArticleDate(article.date)}</time> ·{" "}
          {article.readingMinutes} min de lectura
        </p>
      </header>

      <div
        className="prose prose-invert max-w-none
          prose-headings:font-display prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-12 prose-h3:text-xl
          prose-p:text-muted prose-p:leading-relaxed
          prose-li:text-muted
          prose-strong:text-foreground
          prose-a:text-padel prose-a:no-underline hover:prose-a:underline"
      >
        <Body />
      </div>

      {related.length > 0 && (
        <section className="mt-16 pt-10 border-t border-white/5">
          <h2 className="font-display text-2xl font-bold mb-6">
            Modelos de este artículo
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                bestPrice={getBestPrice(p.id)}
              />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="mt-16 pt-10 border-t border-white/5">
          <h2 className="font-display text-2xl font-bold mb-6">Seguir leyendo</h2>
          <ul className="space-y-3">
            {others.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/noticias/${a.slug}`}
                  className="block rounded-xl bg-white/[0.02] border border-white/5 p-4 hover:bg-white/[0.05] transition-colors"
                >
                  <span className="text-xs text-muted uppercase tracking-wider">
                    {KIND_LABEL[a.kind]}
                  </span>
                  <p className="font-display font-semibold mt-1">{a.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
