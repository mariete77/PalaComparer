"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompare } from "./CompareContext";
import { findProducts } from "@/data/products";
import { getProductImage } from "@/data/product-image";
import { useLocale } from "@/i18n/LocaleContext";

export default function CompareBar() {
  const { ids, remove, clear } = useCompare();
  const { lp, t } = useLocale();
  if (ids.length === 0) return null;

  const products = findProducts(ids);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl">
      <div className="glass-bar rounded-2xl p-3 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {products.map((p) => {
            const img = getProductImage(p);
            return (
            <div
              key={p.id}
              className="relative w-12 h-16 rounded-lg bg-overlay-5 overflow-hidden flex-shrink-0 group"
            >
              <Image src={img.src}
            unoptimized={img.unoptimized} alt={p.model} fill className="object-contain p-1" sizes="48px" />
              <button
                onClick={() => remove(p.id)}
                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
            );
          })}
          {ids.length < 3 && (
            <div className="w-12 h-16 rounded-lg border-2 border-dashed border-overlay-20 flex items-center justify-center text-muted text-xs flex-shrink-0">
              +
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clear}
            className="text-xs text-muted hover:text-foreground transition-colors px-2"
          >
            {t("compareBar.limpiar")}
          </button>
          <Link
            href={lp(`/comparar?ids=${ids.join(",")}`)}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
              ids.length >= 2
                ? "btn-primary"
                : "bg-overlay-10 text-muted cursor-not-allowed pointer-events-none"
            }`}
          >
            {t("compareBar.compararN", { n: ids.length })}
          </Link>
        </div>
      </div>
    </div>
  );
}
