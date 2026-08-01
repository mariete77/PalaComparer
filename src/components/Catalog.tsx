"use client";

import { useState, useMemo } from "react";
import { Product, Sport, Level, PlayStyle, PadelShape } from "@/data/products";
import { useLocale } from "@/i18n/LocaleContext";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
  sport: Sport;
  priceIndex: Record<string, number>;
}

export default function Catalog({ products, sport, priceIndex }: Props) {
  const { t } = useLocale();
  const [brand, setBrand] = useState<string>("");
  const [level, setLevel] = useState<Level | "">("");
  const [style, setStyle] = useState<PlayStyle | "">("");
  const [shape, setShape] = useState<PadelShape | "">("");
  const [maxPrice, setMaxPrice] = useState<number>(350);
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "year">("year");
  const [query, setQuery] = useState("");

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  const levels: { value: Level; label: string }[] = [
    { value: "principiante", label: t("catalog.nivel.principiante") },
    { value: "intermedio", label: t("catalog.nivel.intermedio") },
    { value: "avanzado", label: t("catalog.nivel.avanzado") },
    { value: "profesional", label: t("catalog.nivel.profesional") },
  ];

  const styles: { value: PlayStyle; label: string }[] = [
    { value: "control", label: t("catalog.estilo.control") },
    { value: "potencia", label: t("catalog.estilo.potencia") },
    { value: "polivalente", label: t("catalog.estilo.polivalente") },
  ];

  const shapes: { value: PadelShape; label: string }[] = [
    { value: "redonda", label: t("catalog.formaPala.redonda") },
    { value: "lagrima", label: t("catalog.formaPala.lagrima") },
    { value: "diamante", label: t("catalog.formaPala.diamante") },
    { value: "hibrida", label: t("catalog.formaPala.hibrida") },
  ];

  const filtered = useMemo(() => {
    const priceOf = (p: Product) => priceIndex[p.id] ?? p.price;
    let r = products.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (level && !p.level.includes(level)) return false;
      if (style && !p.style.includes(style)) return false;
      if (shape && p.sport === "padel" && p.padel?.shape !== shape) return false;
      if (priceOf(p) > maxPrice) return false;
      if (
        query &&
        !`${p.brand} ${p.model}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
    switch (sort) {
      case "price-asc":
        r = [...r].sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case "price-desc":
        r = [...r].sort((a, b) => priceOf(b) - priceOf(a));
        break;
      case "year":
        r = [...r].sort((a, b) => b.year - a.year);
        break;
    }
    return r;
  }, [products, priceIndex, brand, level, style, shape, maxPrice, sort, query]);

  const accentText = sport === "padel" ? "text-padel" : "text-tenis";

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-8">
      {/* FILTROS */}
      <aside className="space-y-6 lg:sticky lg:top-24 self-start rounded-xl bg-surface-container-high/50 backdrop-blur-md border border-white/5 p-5">
        <div>
          <h2 className="font-display font-bold text-sm text-primary uppercase tracking-widest mb-1">
            {t("catalog.filtros")}
          </h2>
          <p className="text-muted text-xs">{t("catalog.busquedaPrecision")}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder={t("catalog.placeholderBusqueda")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-high border border-outline-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none text-sm"
          />
        </div>

        <FilterGroup title={t("catalog.marca")}>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant text-sm focus:outline-none focus:border-primary-container"
          >
            <option value="">{t("catalog.todas")}</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </FilterGroup>

        <FilterGroup title={t("catalog.nivelLabel")}>
          <div className="flex flex-wrap gap-1.5">
            {levels.map((l) => (
              <Chip
                key={l.value}
                active={level === l.value}
                onClick={() => setLevel(level === l.value ? "" : l.value)}
              >
                {l.label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup title={t("catalog.estiloLabel")}>
          <div className="flex flex-wrap gap-1.5">
            {styles.map((s) => (
              <Chip
                key={s.value}
                active={style === s.value}
                onClick={() => setStyle(style === s.value ? "" : s.value)}
              >
                {s.label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        {sport === "padel" && (
          <FilterGroup title={t("catalog.forma")}>
            <div className="flex flex-wrap gap-1.5">
              {shapes.map((s) => (
                <Chip
                  key={s.value}
                  active={shape === s.value}
                  onClick={() => setShape(shape === s.value ? "" : s.value)}
                >
                  {s.label}
                </Chip>
              ))}
            </div>
          </FilterGroup>
        )}

        <FilterGroup title={`${t("catalog.precioMaximo")}: ${maxPrice} €`}>
          <input
            type="range"
            min={50}
            max={350}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#c3f400]"
          />
        </FilterGroup>

        <button
          onClick={() => {
            setBrand("");
            setLevel("");
            setStyle("");
            setShape("");
            setMaxPrice(350);
            setQuery("");
          }}
          className="w-full border border-outline-variant text-on-surface-variant font-bold text-xs uppercase tracking-widest p-3 rounded-lg hover:bg-white/5 transition-colors"
        >
          {t("catalog.limpiarTodo")}
        </button>
      </aside>

      {/* GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted">
            <span className={`font-bold ${accentText}`}>{filtered.length}</span>{" "}
            {sport === "padel" ? t("catalog.cuentaPalas") : t("catalog.cuentaRaquetas")}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant text-sm focus:outline-none focus:border-primary-container"
          >
            <option value="year">{t("catalog.ordenar.recientes")}</option>
            <option value="price-asc">{t("catalog.ordenar.precioAsc")}</option>
            <option value="price-desc">{t("catalog.ordenar.precioDesc")}</option>
          </select>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p>{t("catalog.noResultados")}</p>
            <button
              onClick={() => {
                setBrand("");
                setLevel("");
                setStyle("");
                setShape("");
                setMaxPrice(350);
                setQuery("");
              }}
              className="mt-3 text-sm text-padel hover:underline"
            >
              {t("catalog.limpiarFiltros")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                bestPrice={priceIndex[p.id] ?? null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`pill px-3 py-1.5 rounded-full text-xs font-semibold ${active ? "active" : ""}`}
    >
      {children}
    </button>
  );
}
