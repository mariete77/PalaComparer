import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/data/news";
import NewsList from "@/components/NewsList";

export const metadata: Metadata = {
  title: "Novedades de pádel y tenis — PalaComparer",
  description:
    "Lanzamientos y novedades de palas de pádel y raquetas de tenis. Para las guías de compra y los análisis de material, ve a la sección de guías.",
};

export default function NoticiasPage() {
  const noticias = getNews();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Novedades
        </h1>
        <p className="mt-3 text-muted max-w-2xl leading-relaxed">
          Lanzamientos y cambios de catálogo, con el contexto de qué se mueve
          respecto al modelo anterior.
        </p>
      </header>

      {noticias.length > 0 ? (
        <NewsList articles={noticias} />
      ) : (
        <div className="border-t border-white/10 py-16 text-center">
          <p className="font-display text-xl font-semibold">
            Todavía no hay novedades publicadas.
          </p>
          <p className="mt-2 text-sm text-muted max-w-md mx-auto leading-relaxed">
            Cuando salga material nuevo lo contamos aquí. Mientras tanto, las
            guías de compra y los análisis están en su propia sección.
          </p>
          <Link
            href="/guias"
            className="btn-lime mt-7 inline-block rounded-lg px-6 py-3 text-sm"
          >
            Ver las guías
          </Link>
        </div>
      )}
    </div>
  );
}
