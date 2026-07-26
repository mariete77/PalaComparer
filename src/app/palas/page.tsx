import Catalog from "@/components/Catalog";
import { bySport } from "@/data/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palas de pádel — PalaComparer",
  description:
    "Todas las palas de pádel 2022-2026: Nox, Bullpadel, Head, Adidas, Babolat y más. Filtra por nivel, forma, estilo y precio.",
};

export default function PalasPage() {
  const products = bySport("padel");
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-bold text-padel uppercase tracking-wider mb-1">
          Catálogo completo
        </p>
        <h1 className="font-display text-4xl font-bold">Palas de pádel</h1>
        <p className="text-muted mt-2">
          {products.length} palas de las mejores marcas. Usa los filtros para
          encontrar la tuya.
        </p>
      </header>
      <Catalog products={products} sport="padel" />
    </div>
  );
}
