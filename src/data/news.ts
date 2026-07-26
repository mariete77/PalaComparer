// Índice de noticias y guías.
//
// Cada artículo vive en src/content/noticias/<slug>.mdx y exporta su propio
// `metadata`. Este fichero solo los registra: para publicar uno nuevo basta con
// crear el .mdx y añadir una línea en ARTICLES.

import type { Sport } from "./products";

export type ArticleKind = "guia" | "analisis" | "novedad";

export interface ArticleMeta {
  title: string;
  /** Entradilla para el listado y la meta description. */
  excerpt: string;
  /** ISO YYYY-MM-DD */
  date: string;
  author: string;
  kind: ArticleKind;
  /** A qué catálogo pertenece. `ambos` aparece en los dos filtros. */
  sport: Sport | "ambos";
  tags: string[];
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

export const ARTICLES: Article[] = [
  { slug: "formas-de-pala-cual-te-toca", ...formasDePala },
  { slug: "carbono-3k-12k-18k-diferencias", ...carbono },
  { slug: "palas-iniciacion-que-mirar", ...iniciacion },
  { slug: "tamis-y-patron-de-cuerdas", ...tamis },
  { slug: "gama-alta-2025-2026-tendencias", ...gamaAlta },
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

export const KIND_LABEL: Record<ArticleKind, string> = {
  guia: "Guía",
  analisis: "Análisis",
  novedad: "Novedad",
};

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Formato manual: `toLocaleDateString` puede diferir entre Node y el navegador. */
export function formatArticleDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} de ${MESES[Number(m) - 1]} de ${y}`;
}
