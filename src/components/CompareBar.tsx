"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompare } from "./CompareContext";
import { findProducts } from "@/data/products";

export default function CompareBar() {
  const { ids, remove, clear } = useCompare();
  if (ids.length === 0) return null;

  const products = findProducts(ids);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl">
      <div className="rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-3 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {products.map((p) => (
            <div
              key={p.id}
              className="relative w-12 h-16 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 group"
            >
              <Image src={p.image}
            unoptimized alt={p.model} fill className="object-contain p-1" sizes="48px" />
              <button
                onClick={() => remove(p.id)}
                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          {ids.length < 3 && (
            <div className="w-12 h-16 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center text-muted text-xs flex-shrink-0">
              +
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clear}
            className="text-xs text-muted hover:text-foreground transition-colors px-2"
          >
            Limpiar
          </button>
          <Link
            href={`/comparar?ids=${ids.join(",")}`}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              ids.length >= 2
                ? "bg-padel text-black hover:bg-lime-300"
                : "bg-white/10 text-muted cursor-not-allowed pointer-events-none"
            }`}
          >
            Comparar {ids.length > 0 && `(${ids.length})`}
          </Link>
        </div>
      </div>
    </div>
  );
}
