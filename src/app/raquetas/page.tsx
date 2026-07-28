import Link from "next/link";
import { bySport } from "@/data/products";
import { withRealImage } from "@/data/product-image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raquetas de tenis — PalaComparer",
  description:
    "Todas las raquetas de tenis 2022-2026: Wilson, Babolat, Head, Yonex y más. Filtra por nivel, estilo y precio.",
};

export default function RaquetasPage() {
  const products = withRealImage(bySport("tenis"));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-bold text-tenis uppercase tracking-wider mb-1">
          Catálogo completo
        </p>
        <h1 className="font-display text-4xl font-bold">Raquetas de tenis</h1>
        <p className="text-muted mt-2">
          {products.length > 0
            ? `${products.length} raquetas de las mejores marcas. Usa los filtros para encontrar la tuya.`
            : "Estamos trabajando en conseguir fotos reales de cada raqueta."}
        </p>
      </header>

      {products.length > 0 ? (
        <p className="text-sm text-muted">
          <span className="font-bold text-tenis">{products.length}</span> raquetas
        </p>
      ) : (
        <div className="card-glow rounded-2xl bg-white/[0.02] p-12 text-center max-w-lg mx-auto">
          <div className="text-6xl mb-6">🎾</div>
          <h2 className="font-display text-2xl font-bold mb-3">
            Próximamente
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-8">
            Tenemos {bySport("tenis").length} raquetas con sus especificaciones técnicas completas en nuestra base de datos.
            Estamos consiguiendo fotos reales de cada una para que puedas verlas antes de comprar.
            Mientras tanto, puedes explorar nuestro catálogo de palas de pádel.
          </p>
          <Link
            href="/palas"
            className="inline-block px-6 py-3 rounded-xl bg-tenis text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Ver palas de pádel →
          </Link>
        </div>
      )}
    </div>
  );
}
