import type { Metadata } from "next";
import { getGuides } from "@/data/news";
import NewsList from "@/components/NewsList";

export const metadata: Metadata = {
  title: "Guías de compra de palas y raquetas — PalaComparer",
  description:
    "Guías y análisis de material para elegir pala de pádel o raqueta de tenis: formas, carbono, tamiz, peso y balance explicados con las specs del catálogo.",
};

export default function GuiasPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Guías para elegir bien
        </h1>
        <p className="mt-3 text-muted max-w-2xl leading-relaxed">
          Cómo leer una ficha técnica y qué cambia de verdad en la pista. Si una
          guía recomienda un modelo, puedes abrir su ficha y comprobar los
          números.
        </p>
      </header>

      <NewsList articles={getGuides()} />
    </div>
  );
}
