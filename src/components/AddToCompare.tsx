"use client";

import { useCompare } from "./CompareContext";

export default function AddToCompare({ productId }: { productId: string }) {
  const { add, remove, has, isFull, ids } = useCompare();
  const selected = has(productId);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => (selected ? remove(productId) : add(productId))}
        disabled={!selected && isFull}
        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
          selected
            ? "bg-padel text-black"
            : isFull
              ? "bg-white/5 text-muted cursor-not-allowed"
              : "bg-white/10 hover:bg-padel hover:text-black"
        }`}
      >
        {selected ? "✓ En el comparador" : "+ Añadir al comparador"}
      </button>
      {ids.length >= 2 && (
        <a
          href={`/comparar?ids=${ids.join(",")}`}
          className="px-6 py-3 rounded-xl bg-padel text-black font-semibold hover:bg-lime-300 transition-colors"
        >
          Comparar ahora ({ids.length})
        </a>
      )}
    </div>
  );
}
