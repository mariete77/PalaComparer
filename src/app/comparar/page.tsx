"use client";

import { Suspense, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { findProducts, Product, PRODUCTS } from "@/data/products";
import { getProductImage } from "@/data/product-image";
import { formatPrice, getBestPrice, getPriceSummary } from "@/data/offers";
import { useCompare } from "@/components/CompareContext";
import { useState } from "react";

/** Mejor precio entre tiendas, o "—" si no hay ofertas. */
function bestPriceLabel(p: Product): string {
  const best = getBestPrice(p.id);
  return best === null ? "—" : formatPrice(best);
}

function storeCountLabel(p: Product): string {
  const summary = getPriceSummary(p.id);
  if (!summary) return "—";
  return `${summary.offerCount} ${summary.offerCount === 1 ? "tienda" : "tiendas"}`;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const { ids: ctxIds, add, remove } = useCompare();
  const [query, setQuery] = useState("");

  const ids = useMemo(() => {
    if (idsParam) return idsParam.split(",").filter(Boolean);
    return ctxIds;
  }, [idsParam, ctxIds]);

  const products = findProducts(ids);

  // search to add
  const searchResults = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        !ids.includes(p.id) &&
        `${p.brand} ${p.model}`.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query, ids]);

  if (products.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-5xl mb-4">⚖️</p>
        <h1 className="font-display text-3xl font-bold mb-3">
          Elige qué comparar
        </h1>
        <p className="text-muted mb-8">
          Añade hasta 3 palas o raquetas con el botón + de cualquier tarjeta, o
          búscalas aquí:
        </p>
        <AddSearch
          query={query}
          setQuery={setQuery}
          results={searchResults}
          onAdd={add}
        />
      </div>
    );
  }

  // check same sport
  const sameSport = products.every((p) => p.sport === products[0].sport);
  const isPadel = products[0]?.sport === "padel";

  const specRows: { label: string; get: (p: Product) => string }[] = sameSport
    ? isPadel
      ? [
          { label: "Mejor precio", get: bestPriceLabel },
          { label: "Disponible en", get: storeCountLabel },
          { label: "PVP", get: (p) => formatPrice(p.price) },
          { label: "Año", get: (p) => String(p.year) },
          { label: "Forma", get: (p) => cap(p.padel?.shape ?? "—") },
          { label: "Peso", get: (p) => p.padel?.weight ?? "—" },
          { label: "Balance", get: (p) => cap(p.padel?.balance ?? "—") },
          { label: "Núcleo", get: (p) => p.padel?.core ?? "—" },
          { label: "Caras", get: (p) => p.padel?.faces ?? "—" },
          { label: "Superficie", get: (p) => cap(p.padel?.surface ?? "—") },
          { label: "Dureza", get: (p) => cap(p.padel?.hardness ?? "—") },
          { label: "Nivel", get: (p) => p.level.map(cap).join(", ") },
          { label: "Estilo", get: (p) => p.style.map(cap).join(", ") },
          { label: "Jugador", get: (p) => p.player ?? "—" },
        ]
      : [
          { label: "Mejor precio", get: bestPriceLabel },
          { label: "Disponible en", get: storeCountLabel },
          { label: "PVP", get: (p) => formatPrice(p.price) },
          { label: "Año", get: (p) => String(p.year) },
          { label: "Tamis", get: (p) => (p.tenis ? `${p.tenis.headSize} in²` : "—") },
          { label: "Peso encordada", get: (p) => (p.tenis ? `${p.tenis.weightStrung} g` : "—") },
          { label: "Longitud", get: (p) => (p.tenis ? `${p.tenis.length} cm` : "—") },
          { label: "Patrón encordado", get: (p) => p.tenis?.stringPattern ?? "—" },
          { label: "Rigidez (RA)", get: (p) => String(p.tenis?.stiffness ?? "—") },
          { label: "Balance", get: (p) => (p.tenis ? `${p.tenis.balancePoints} mm` : "—") },
          { label: "Swingweight", get: (p) => String(p.tenis?.swingweight ?? "—") },
          { label: "Nivel", get: (p) => p.level.map(cap).join(", ") },
          { label: "Estilo", get: (p) => p.style.map(cap).join(", ") },
          { label: "Jugador", get: (p) => p.player ?? "—" },
        ]
    : [
        { label: "Mejor precio", get: bestPriceLabel },
        { label: "Disponible en", get: storeCountLabel },
        { label: "PVP", get: (p) => formatPrice(p.price) },
        { label: "Año", get: (p) => String(p.year) },
        { label: "Deporte", get: (p) => (p.sport === "padel" ? "Pádel" : "Tenis") },
        { label: "Nivel", get: (p) => p.level.map(cap).join(", ") },
        { label: "Estilo", get: (p) => p.style.map(cap).join(", ") },
      ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold">Comparador</h1>
        <p className="text-muted mt-2">
          {products.length} de 3 seleccionadas.{" "}
          {!sameSport && (
            <span className="text-tenis">
              ⚠️ Estás comparando deportes distintos — mostrando specs comunes.
            </span>
          )}
        </p>
      </header>

      {/* Add more */}
      {products.length < 3 && (
        <div className="mb-8 max-w-md">
          <AddSearch
            query={query}
            setQuery={setQuery}
            results={searchResults}
            onAdd={add}
            placeholder="Añadir otra para comparar..."
          />
        </div>
      )}

      {/* Comparison table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="text-left p-3 w-40" />
              {products.map((p) => (
                <th key={p.id} className="p-3 align-top">
                  <div className="relative rounded-2xl bg-white/[0.03] border border-white/5 p-4 group">
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    <Link href={`/producto/${p.id}`}>
                      <div className="relative w-full aspect-[2/3] max-w-[160px] mx-auto mb-3">
                        <Image
                          src={getProductImage(p).src}
                          unoptimized={getProductImage(p).unoptimized}
                          alt={p.model}
                          fill
                          className="object-contain"
                          sizes="160px"
                        />
                      </div>
                      <p className="text-xs text-muted text-center">{p.brand}</p>
                      <p className="font-display font-semibold text-sm text-center leading-tight">
                        {p.model}
                      </p>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map((row, i) => {
              const values = products.map((p) => row.get(p));
              const allSame = values.every((v) => v === values[0]);
              return (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-white/[0.02]" : ""}
                >
                  <td className="p-3 text-xs font-bold uppercase tracking-wider text-muted">
                    {row.label}
                  </td>
                  {values.map((v, j) => (
                    <td
                      key={j}
                      className={`p-3 text-sm text-center ${
                        row.label === "Mejor precio"
                          ? "font-display font-bold text-padel"
                          : allSame
                            ? "text-muted"
                            : ""
                      }`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Descriptions */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-white/[0.03] border border-white/5 p-5"
          >
            <h3 className="font-display font-semibold text-sm mb-2">
              {p.brand} {p.model}
            </h3>
            <p className="text-xs text-muted leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddSearch({
  query,
  setQuery,
  results,
  onAdd,
  placeholder = "Buscar pala o raqueta...",
}: {
  query: string;
  setQuery: (q: string) => void;
  results: Product[];
  onAdd: (id: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-padel/50 focus:outline-none"
      />
      {results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 rounded-xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden z-20">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onAdd(p.id);
                setQuery("");
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
            >
              <div className="relative w-8 h-12 flex-shrink-0">
                <Image
                  src={getProductImage(p).src}
                  unoptimized={getProductImage(p).unoptimized}
                  alt={p.model}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted">{p.brand}</p>
                <p className="text-sm font-medium truncate">{p.model}</p>
              </div>
              <span className="ml-auto text-padel font-bold">+</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CompararPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-muted">
          Cargando comparador...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
