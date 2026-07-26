"use client";

import { useState, useMemo } from "react";
import { Product, Sport, Level, PlayStyle, PadelShape } from "@/data/products";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
  sport: Sport;
}

const LEVELS: { value: Level; label: string }[] = [
  { value: "principiante", label: "Principiante" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "profesional", label: "Profesional" },
];

const STYLES: { value: PlayStyle; label: string }[] = [
  { value: "control", label: "Control" },
  { value: "potencia", label: "Potencia" },
  { value: "polivalente", label: "Polivalente" },
];

const SHAPES: { value: PadelShape; label: string }[] = [
  { value: "redonda", label: "Redonda" },
  { value: "lagrima", label: "Lágrima" },
  { value: "diamante", label: "Diamante" },
  { value: "hibrida", label: "Híbrida" },
];

export default function Catalog({ products, sport }: Props) {
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

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (level && !p.level.includes(level)) return false;
      if (style && !p.style.includes(style)) return false;
      if (shape && p.sport === "padel" && p.padel?.shape !== shape) return false;
      if (p.price > maxPrice) return false;
      if (
        query &&
        !`${p.brand} ${p.model}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
    switch (sort) {
      case "price-asc":
        r = [...r].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        r = [...r].sort((a, b) => b.price - a.price);
        break;
      case "year":
        r = [...r].sort((a, b) => b.year - a.year);
        break;
    }
    return r;
  }, [products, brand, level, style, shape, maxPrice, sort, query]);

  const accentText = sport === "padel" ? "text-padel" : "text-tenis";

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-8">
      {/* FILTROS */}
      <aside className="space-y-6 lg:sticky lg:top-24 self-start">
        <div>
          <input
            type="text"
            placeholder="Buscar marca o modelo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-padel/50 focus:outline-none text-sm"
          />
        </div>

        <FilterGroup title="Marca">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-padel/50"
          >
            <option value="">Todas</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </FilterGroup>

        <FilterGroup title="Nivel">
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((l) => (
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

        <FilterGroup title="Estilo de juego">
          <div className="flex flex-wrap gap-1.5">
            {STYLES.map((s) => (
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
          <FilterGroup title="Forma">
            <div className="flex flex-wrap gap-1.5">
              {SHAPES.map((s) => (
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

        <FilterGroup title={`Precio máximo: ${maxPrice} €`}>
          <input
            type="range"
            min={50}
            max={350}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-lime-400"
          />
        </FilterGroup>
      </aside>

      {/* GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted">
            <span className={`font-bold ${accentText}`}>{filtered.length}</span>{" "}
            {sport === "padel" ? "palas" : "raquetas"}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none"
          >
            <option value="year">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-4xl mb-3">🎾</p>
            <p>No hay resultados con esos filtros.</p>
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
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
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
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? "bg-padel text-black"
          : "bg-white/5 border border-white/10 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
