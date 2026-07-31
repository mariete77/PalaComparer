"use client";

import { Suspense, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { findProducts, Product, PRODUCTS, getDescription } from "@/data/products";
import { getProductImage } from "@/data/product-image";
import { formatPrice, getBestPrice, getPriceSummary } from "@/data/offers";
import { useCompare } from "@/components/CompareContext";
import { ScaleIcon } from "@/components/icons";
import { useLocale } from "@/i18n/LocaleContext";
import { translate, type TranslationKey } from "@/i18n/locales";
import { useState } from "react";

/** Mejor precio entre tiendas, o "—" si no hay ofertas. */
function makeBestPriceLabel(locale: Parameters<typeof translate>[0]) {
  return (p: Product): string => {
    const best = getBestPrice(p.id);
    return best === null ? "—" : formatPrice(best);
  };
}

function makeStoreCountLabel(locale: Parameters<typeof translate>[0]) {
  const t = (k: TranslationKey, params?: Record<string, string | number>) =>
    translate(locale, k, params);
  return (p: Product): string => {
    const summary = getPriceSummary(p.id);
    if (!summary) return "—";
    const tienda = summary.offerCount === 1 ? t("offers.tiendaSingular") : t("offers.tiendaPlural");
    return `${summary.offerCount} ${tienda}`;
  };
}

function CompareContent() {
  const searchParams = useSearchParams();
  const { locale, lp, t } = useLocale();
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
        <ScaleIcon className="w-12 h-12 text-muted mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold mb-3">
          {t("compare.vacioTitulo")}
        </h1>
        <p className="text-muted mb-8">{t("compare.vacioCuerpo")}</p>
        <AddSearch
          query={query}
          setQuery={setQuery}
          results={searchResults}
          onAdd={add}
          placeholder={t("compare.buscarPlaceholder")}
        />
      </div>
    );
  }

  // check same sport
  const sameSport = products.every((p) => p.sport === products[0].sport);
  const isPadel = products[0]?.sport === "padel";

  const bestPriceLabel = makeBestPriceLabel(locale);
  const storeCountLabel = makeStoreCountLabel(locale);
  // Helper para traducir enum de specs según el dict.
  const enumT = (ns: "formaPala", v: string) => translate(locale, `catalog.${ns}.${v}` as TranslationKey);

  const specRows: { label: string; get: (p: Product) => string }[] = sameSport
    ? isPadel
      ? [
          { label: t("product.mejorPrecio"), get: bestPriceLabel },
          { label: t("product.disponibleEn"), get: storeCountLabel },
          { label: t("product.pvp"), get: (p) => formatPrice(p.price) },
          { label: t("product.ano"), get: (p) => String(p.year) },
          { label: t("product.forma"), get: (p) => p.padel ? enumT("formaPala", p.padel.shape) : "—" },
          { label: t("product.peso"), get: (p) => p.padel?.weight ?? "—" },
          { label: t("product.balance"), get: (p) => p.padel ? translate(locale, `catalog.balance.${p.padel.balance}` as TranslationKey) : "—" },
          { label: t("product.nucleo"), get: (p) => p.padel?.core ?? "—" },
          { label: t("product.caras"), get: (p) => p.padel?.faces ?? "—" },
          { label: t("product.superficie"), get: (p) => p.padel ? translate(locale, `catalog.superficie.${p.padel.surface}` as TranslationKey) : "—" },
          { label: t("product.dureza"), get: (p) => p.padel ? translate(locale, `catalog.dureza.${p.padel.hardness}` as TranslationKey) : "—" },
          { label: t("product.nivel"), get: (p) => p.level.map((l) => translate(locale, `catalog.nivel.${l}` as TranslationKey)).join(", ") },
          { label: t("product.estiloLabel"), get: (p) => p.style.map((s) => translate(locale, `catalog.estilo.${s}` as TranslationKey)).join(", ") },
          { label: t("product.jugador"), get: (p) => p.player ?? "—" },
        ]
      : [
          { label: t("product.mejorPrecio"), get: bestPriceLabel },
          { label: t("product.disponibleEn"), get: storeCountLabel },
          { label: t("product.pvp"), get: (p) => formatPrice(p.price) },
          { label: t("product.ano"), get: (p) => String(p.year) },
          { label: t("product.tamis"), get: (p) => (p.tenis ? `${p.tenis.headSize} in²` : "—") },
          { label: t("product.pesoEncordada"), get: (p) => (p.tenis ? `${p.tenis.weightStrung} g` : "—") },
          { label: t("product.longitud"), get: (p) => (p.tenis ? `${p.tenis.length} cm` : "—") },
          { label: t("product.patronEncordado"), get: (p) => p.tenis?.stringPattern ?? "—" },
          { label: t("product.rigidez"), get: (p) => String(p.tenis?.stiffness ?? "—") },
          { label: t("product.balance"), get: (p) => (p.tenis ? `${p.tenis.balancePoints} mm` : "—") },
          { label: t("product.swingweight"), get: (p) => String(p.tenis?.swingweight ?? "—") },
          { label: t("product.nivel"), get: (p) => p.level.map((l) => translate(locale, `catalog.nivel.${l}` as TranslationKey)).join(", ") },
          { label: t("product.estiloLabel"), get: (p) => p.style.map((s) => translate(locale, `catalog.estilo.${s}` as TranslationKey)).join(", ") },
          { label: t("product.jugador"), get: (p) => p.player ?? "—" },
        ]
    : [
        { label: t("product.mejorPrecio"), get: bestPriceLabel },
        { label: t("product.disponibleEn"), get: storeCountLabel },
        { label: t("product.pvp"), get: (p) => formatPrice(p.price) },
        { label: t("product.ano"), get: (p) => String(p.year) },
        { label: t("product.deporte"), get: (p) => (p.sport === "padel" ? t("common.padel") : t("common.tenis")) },
        { label: t("product.nivel"), get: (p) => p.level.map((l) => translate(locale, `catalog.nivel.${l}` as TranslationKey)).join(", ") },
        { label: t("product.estiloLabel"), get: (p) => p.style.map((s) => translate(locale, `catalog.estilo.${s}` as TranslationKey)).join(", ") },
      ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold">{t("compare.titulo")}</h1>
        <p className="text-muted mt-2">
          {t("compare.seleccionadas", { n: products.length })}{" "}
          {!sameSport && (
            <span className="text-tenis">
              {t("compare.deportesDistintos")}
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
            placeholder={t("compare.anadirPlaceholder")}
          />
        </div>
      )}

      {/* Comparison table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="text-left p-3 w-40" />
              {products.map((p) => {
                const img = getProductImage(p);
                return (
                <th key={p.id} className="p-3 align-top">
                  <div className={`relative rounded-2xl border border-white/5 p-4 group ${img.isReal ? "bg-white" : "bg-white/[0.03]"}`}>
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    <Link href={lp(`/producto/${p.id}`)}>
                      <div className="relative w-full aspect-[2/3] max-w-[160px] mx-auto mb-3">
                        <Image
                          src={img.src}
                          unoptimized={img.unoptimized}
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
                );
              })}
            </tr>
          </thead>
          <tbody>
            {specRows.map((row, i) => {
              const values = products.map((p) => row.get(p));
              const allSame = values.every((v) => v === values[0]);
              const isPrice = row.label === t("product.mejorPrecio");
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
                        isPrice
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
            <p className="text-xs text-muted leading-relaxed">{getDescription(p, locale)}</p>
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
  placeholder,
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

export default function CompararPage() {
  const { t } = useLocale();
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-muted">
          {t("compare.cargando")}
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
