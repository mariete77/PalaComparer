"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCompare } from "@/components/CompareContext";

export default function ProductCard({ product }: { product: Product }) {
  const { add, remove, has, isFull } = useCompare();
  const selected = has(product.id);
  const accent = product.sport === "padel" ? "text-padel" : "text-tenis";

  return (
    <div className="card-glow rounded-2xl bg-white/[0.02] overflow-hidden group relative">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="aspect-[2/3] relative bg-gradient-to-b from-white/5 to-transparent">
          <Image
            src={product.image}
            unoptimized
            alt={`${product.brand} ${product.model}`}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              product.sport === "padel"
                ? "bg-padel/20 text-padel"
                : "bg-tenis/20 text-tenis"
            }`}
          >
            {product.sport === "padel" ? "Pádel" : "Tenis"}
          </span>
        </div>
        <div className="p-4">
          <p className="text-xs text-muted font-medium">{product.brand}</p>
          <h3 className="font-display font-semibold text-sm leading-tight mt-0.5 line-clamp-2 min-h-[2.5em]">
            {product.model}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className={`font-display font-bold ${accent}`}>
              {product.price.toFixed(2)} €
            </span>
            <span className="text-[10px] text-muted">{product.year}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={() => (selected ? remove(product.id) : add(product.id))}
        disabled={!selected && isFull}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
          selected
            ? "bg-padel text-black scale-110"
            : isFull
              ? "bg-white/5 text-muted cursor-not-allowed"
              : "bg-white/10 hover:bg-padel hover:text-black"
        }`}
        title={selected ? "Quitar del comparador" : "Añadir al comparador"}
      >
        {selected ? "✓" : "+"}
      </button>
    </div>
  );
}
