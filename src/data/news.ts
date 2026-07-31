// Índice de noticias y guías.
//
// Cada artículo vive en src/content/noticias/<slug>.mdx y exporta su propio
// `metadata`. Este fichero solo los registra: para publicar uno nuevo basta con
// crear el .mdx y añadir una línea en ARTICLES.
//
// El contenido es bilingüe (ES/EN). Los MDX en español siguen siendo la fuente
// para el cuerpo ES; el cuerpo EN vive en src/content/noticias/en/<slug>.mdx.
// Los metadatos EN (title/excerpt/tags) se mantienen aquí, junto al registro,
// para no duplicarlos dentro de cada .mdx.

import type { Sport } from "./products";
import type { Locale, LocalizedText } from "@/i18n/locales";
import { localePath } from "@/i18n/locales";

export type ArticleKind = "guia" | "analisis" | "novedad";

export interface ArticleMeta {
  /** Título localizado. */
  title: LocalizedText;
  /** Entradilla para el listado y la meta description. */
  excerpt: LocalizedText;
  /** ISO YYYY-MM-DD */
  date: string;
  author: string;
  kind: ArticleKind;
  /** A qué catálogo pertenece. `ambos` aparece en los dos filtros. */
  sport: Sport | "ambos";
  /** Etiquetas localizadas. */
  tags: LocalizedText[];
  /** Minutos de lectura estimados. */
  readingMinutes: number;
  /** Ids de productos tratados en el artículo (enlaces cruzados). */
  relatedProducts?: string[];
}

export interface Article extends ArticleMeta {
  slug: string;
}

import { metadata as formasDePala } from "@/content/noticias/formas-de-pala-cual-te-toca.mdx";
import { metadata as carbono } from "@/content/noticias/carbono-3k-12k-18k-diferencias.mdx";
import { metadata as iniciacion } from "@/content/noticias/palas-iniciacion-que-mirar.mdx";
import { metadata as tamis } from "@/content/noticias/tamis-y-patron-de-cuerdas.mdx";
import { metadata as gamaAlta } from "@/content/noticias/gama-alta-2025-2026-tendencias.mdx";

/**
 * Traducciones EN de los metadatos de cada artículo. Las ES vienen del propio
 * .mdx (su `metadata`); las EN se mantienen aquí para no tocar el frontmatter
 * original y centralizar el trabajo de traducción.
 */
const EN_META: Record<string, { title: string; excerpt: string; tags: string[] }> = {
  "formas-de-pala-cual-te-toca": {
    title: "Round, teardrop or diamond: which paddle shape is for you",
    excerpt:
      "The shape decides where the sweet spot sits and how much it forgives your mishits. It's the first decision — and the one most people skip.",
    tags: ["Shapes", "Beginners", "Buying guide"],
  },
  "carbono-3k-12k-18k-diferencias": {
    title: "Carbon 3K, 12K and 18K: what actually changes",
    excerpt:
      "The number doesn't measure quality, it measures the weave. And it affects feel more than power. What each figure means and when you'll notice the difference.",
    tags: ["Materials", "Carbon", "Buying guide"],
  },
  "palas-iniciacion-que-mirar": {
    title: "Your first paddle: the four numbers that matter",
    excerpt:
      "Weight, balance, hardness and shape. With those you'll choose well without overspending — and without ending up with a pro paddle you can't use.",
    tags: ["Beginners", "Buying guide", "Budget"],
  },
  "tamis-y-patron-de-cuerdas": {
    title: "Head size, string pattern and swingweight: reading a racket's spec sheet",
    excerpt:
      "Seven numbers almost nobody checks — and they explain why one racket suits you and another doesn't. With examples from the catalog.",
    tags: ["Specs", "Buying guide", "Stringing"],
  },
  "gama-alta-2025-2026-tendencias": {
    title: "What our catalog says about the 2025-2026 premium segment",
    excerpt:
      "We analyze the 48 models in the catalog: 18K has taken over the padel premium, diamond dominates signature paddles, and tennis has standardized on 100 in².",
    tags: ["Analysis", "Trends", "Catalog"],
  },
};

/**
 * Combina la metadata ES del .mdx con su traducción EN, produciendo un Article
 * bilingüe. Si falta la traducción EN, cae al texto ES (mejor que romper).
 */
function localize(raw: { slug: string } & Record<string, unknown>): Article {
  const slug = raw.slug;
  const en = EN_META[slug];
  return {
    slug,
    title: { es: raw.title as string, en: en?.title ?? (raw.title as string) },
    excerpt: { es: raw.excerpt as string, en: en?.excerpt ?? (raw.excerpt as string) },
    date: raw.date as string,
    author: raw.author as string,
    kind: raw.kind as ArticleKind,
    sport: raw.sport as Sport | "ambos",
    tags: (raw.tags as string[]).map((es, i) => ({ es, en: en?.tags[i] ?? es })),
    readingMinutes: raw.readingMinutes as number,
    relatedProducts: raw.relatedProducts as string[] | undefined,
  };
}

export const ARTICLES: Article[] = [
  localize({ slug: "formas-de-pala-cual-te-toca", ...formasDePala }),
  localize({ slug: "carbono-3k-12k-18k-diferencias", ...carbono }),
  localize({ slug: "palas-iniciacion-que-mirar", ...iniciacion }),
  localize({ slug: "tamis-y-patron-de-cuerdas", ...tamis }),
  localize({ slug: "gama-alta-2025-2026-tendencias", ...gamaAlta }),
].sort((a, b) => b.date.localeCompare(a.date));

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Artículos que mencionan un producto concreto. */
export function getArticlesForProduct(productId: string): Article[] {
  return ARTICLES.filter((a) => a.relatedProducts?.includes(productId));
}

export function getArticlesBySport(sport: Sport): Article[] {
  return ARTICLES.filter((a) => a.sport === sport || a.sport === "ambos");
}

/**
 * Guías y noticias viven en secciones distintas.
 *
 * Guías = contenido perenne de ayuda a la compra. Los análisis entran aquí
 * porque un análisis de material sigue sirviendo meses después, a diferencia de
 * una novedad, que caduca.
 */
export const GUIDE_KINDS: ArticleKind[] = ["guia", "analisis"];

export function isGuide(article: Article): boolean {
  return GUIDE_KINDS.includes(article.kind);
}

/** Artículos de la sección /guias, del más reciente al más antiguo. */
export function getGuides(): Article[] {
  return ARTICLES.filter(isGuide);
}

/** Artículos de la sección /noticias (novedades de actualidad). */
export function getNews(): Article[] {
  return ARTICLES.filter((a) => !isGuide(a));
}

/**
 * URL de un artículo según su sección y locale. Centralizado aquí para que
 * ningún enlace del sitio pueda apuntar a la sección equivocada.
 */
export function articleHref(article: Article, locale: Locale): string {
  const base = isGuide(article) ? `/guias/${article.slug}` : `/noticias/${article.slug}`;
  return localePath(locale, base);
}

/** Ruta interna (sin locale) de un artículo, según su sección. */
export function articleBasePath(article: Article): string {
  return isGuide(article) ? `/guias/${article.slug}` : `/noticias/${article.slug}`;
}

const KIND_LABEL: Record<Locale, Record<ArticleKind, string>> = {
  es: { guia: "Guía", analisis: "Análisis", novedad: "Novedad" },
  en: { guia: "Guide", analisis: "Review", novedad: "News" },
};

/** Etiqueta humana del tipo de artículo, en el locale dado. */
export function kindLabel(kind: ArticleKind, locale: Locale): string {
  return KIND_LABEL[locale][kind];
}

const MESES: Record<Locale, string[]> = {
  es: [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

/**
 * Formato manual: `toLocaleDateString` puede diferir entre Node y el navegador.
 * ES: «22 de julio de 2026». EN: «July 22, 2026».
 */
export function formatArticleDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-");
  if (locale === "en") {
    return `${MESES.en[Number(m) - 1]} ${Number(d)}, ${y}`;
  }
  return `${Number(d)} de ${MESES.es[Number(m) - 1]} de ${y}`;
}
