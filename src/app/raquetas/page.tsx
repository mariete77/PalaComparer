import Catalog from "@/components/Catalog";
import { bySport } from "@/data/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raquetas de tenis — PalaComparer",
  description:
    "Todas las raquetas de tenis 2022-2026: Wilson, Babolat, Head, Yonex y más. Filtra por nivel, estilo y precio.",
};

export default function RaquetasPage() {
  const products = bySport("tenis");
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-bold text-tenis uppercase tracking-wider mb-1">
          Catálogo completo
        </p>
        <h1 className="font-display text-4xl font-bold">Raquetas de tenis</h1>
        <p className="text-muted mt-2">
          {products.length} raquetas de las mejores marcas. Usa los filtros
          para encontrar la tuya.
        </p>
      </header>
      <Catalog products={products} sport="tenis" />
    </div>
  );
}
