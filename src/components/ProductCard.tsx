"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { getProductImage } from "@/data/product-image";
import { formatPrice } from "@/data/offers";
import { useCompare } from "@/components/CompareContext";

export default function ProductCard({
  product,
  bestPrice,
}: {
  product: Product;
  /** Mejor precio entre tiendas. Si no se pasa, se muestra el PVP. */
  bestPrice?: number | null;
}) {
  const { add, remove, has, isFull } = useCompare();
  const selected = has(product.id);
  const image = getProductImage(product);

  // Spec chips: 2 primary specs según deporte
  const specs: { icon: string; label: string; value: string }[] =
    product.sport === "padel" && product.padel
      ? [
          { icon: "⚖️", label: "Peso", value: product.padel.weight.replace(" g", "g").replace(" (+12g sistema)", "") },
          { icon: "🎯", label: "Balance", value: cap(product.padel.balance) },
        ]
      : product.tenis
        ? [
            { icon: "⚖️", label: "Peso", value: `${product.tenis.weightStrung}g` },
            { icon: "🎾", label: "Tamis", value: `${product.tenis.headSize}in²` },
          ]
        : [];

  return (
    <div className="card-split group relative flex flex-col h-full">
      <Link href={`/producto/${product.id}`} className="block flex-1 flex flex-col">
        {/* Top: imagen split-tone */}
        <div className="card-split-img aspect-[4/5] flex items-center justify-center p-6">
          <span className="absolute top-3 left-3 bg-primary-container/20 text-primary-container font-bold text-[10px] px-2 py-1 rounded border border-primary-container/30 uppercase tracking-wider z-10">
            {product.sport === "padel" ? "Pádel" : "Tenis"}
          </span>
          <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
            <Image
              src={image.src}
              unoptimized={image.unoptimized}
              alt={`${product.brand} ${product.model}`}
              fill
              className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>

        {/* Bottom: data */}
        <div className="card-split-body p-4 flex-1 flex flex-col">
          <span className="text-muted font-bold text-[11px] uppercase tracking-wider">
            {product.brand}
          </span>
          <h3 className="font-display font-bold text-base text-primary mt-1 line-clamp-2 leading-tight min-h-[2.6em]">
            {product.model}
          </h3>

          {/* Spec grid */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 mt-3 mb-3">
              {specs.map((s) => (
                <div key={s.label} className="spec-cell px-2 py-1.5 flex items-center gap-1.5 overflow-hidden">
                  <span className="text-xs shrink-0">{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[8px] sm:text-[9px] text-muted font-bold uppercase tracking-wider leading-none">
                      {s.label}
                    </div>
                    <div className="text-[11px] sm:text-xs text-on-surface font-semibold leading-tight">
                      {s.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto flex justify-between items-end pt-2">
            <div>
              {bestPrice != null && (
                <span className="text-muted text-[10px] block">desde</span>
              )}
              <div className="font-display font-bold text-lg text-primary-container">
                {bestPrice != null ? formatPrice(bestPrice) : formatPrice(product.price)}
              </div>
            </div>
            <span className="text-muted font-bold text-[11px]">{product.year}</span>
          </div>
        </div>
      </Link>

      {/* Add to compare */}
      <button
        onClick={() => (selected ? remove(product.id) : add(product.id))}
        disabled={!selected && isFull}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all z-10 border ${
          selected
            ? "bg-primary-container text-on-primary border-primary-container scale-110"
            : isFull
              ? "bg-surface-container-highest text-muted border-white/5 cursor-not-allowed"
              : "bg-surface-container-highest text-on-surface-variant border-white/5 hover:bg-primary-container hover:text-on-primary hover:border-primary-container"
        }`}
        title={selected ? "Quitar del comparador" : "Añadir al comparador"}
      >
        {selected ? "✓" : "+"}
      </button>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
