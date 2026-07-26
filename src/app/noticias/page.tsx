import type { Metadata } from "next";
import { ARTICLES } from "@/data/news";
import NewsList from "@/components/NewsList";

export const metadata: Metadata = {
  title: "Noticias y guías de pádel y tenis — PalaComparer",
  description:
    "Guías de compra, análisis de material y tendencias de palas de pádel y raquetas de tenis. Sin humo: specs, datos y ejemplos del catálogo.",
};

export default function NoticiasPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <p className="text-xs font-bold text-padel uppercase tracking-wider mb-2">
          Noticias
        </p>
        <h1 className="font-display text-4xl font-bold">
          Guías, análisis y novedades
        </h1>
        <p className="mt-3 text-muted max-w-2xl">
          Todo lo que publicamos sale de las specs del catálogo. Si un artículo
          recomienda un modelo, puedes abrir su ficha y comprobar los números.
        </p>
      </header>

      <NewsList articles={ARTICLES} />
    </div>
  );
}
