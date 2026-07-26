import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/data/products";
import AddToCompare from "@/components/AddToCompare";
import ProductCard from "@/components/ProductCard";
import { Metadata } from "next";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return {};
  return {
    title: `${p.brand} ${p.model} (${p.year}) — PalaComparer`,
    description: p.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();

  const accentText = p.sport === "padel" ? "text-padel" : "text-tenis";
  const accentBg = p.sport === "padel" ? "bg-padel" : "bg-tenis";

  const specs: [string, string][] =
    p.sport === "padel" && p.padel
      ? [
          ["Forma", capitalize(p.padel.shape)],
          ["Peso", p.padel.weight],
          ["Balance", capitalize(p.padel.balance)],
          ["Núcleo", p.padel.core],
          ["Caras", p.padel.faces],
          ["Superficie", capitalize(p.padel.surface)],
          ["Dureza", capitalize(p.padel.hardness)],
        ]
      : p.tenis
        ? [
            ["Tamis", `${p.tenis.headSize} in²`],
            ["Peso encordada", `${p.tenis.weightStrung} g`],
            ["Longitud", `${p.tenis.length} cm`],
            ["Patrón encordado", p.tenis.stringPattern],
            ["Rigidez (RA)", String(p.tenis.stiffness)],
            ["Balance", `${p.tenis.balancePoints} mm`],
            ["Swingweight", String(p.tenis.swingweight)],
          ]
        : [];

  const similares = PRODUCTS.filter(
    (x) =>
      x.id !== p.id &&
      x.sport === p.sport &&
      (x.style.some((s) => p.style.includes(s)) || x.brand === p.brand)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-6">
        <Link href="/" className="hover:text-foreground">Inicio</Link>
        {" / "}
        <Link
          href={p.sport === "padel" ? "/palas" : "/raquetas"}
          className="hover:text-foreground"
        >
          {p.sport === "padel" ? "Palas" : "Raquetas"}
        </Link>
        {" / "}
        <span className="text-foreground">{p.model}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Imagen */}
        <div className="relative aspect-[2/3] max-h-[600px] rounded-3xl bg-gradient-to-b from-white/5 to-transparent overflow-hidden card-glow">
          <Image
            src={p.image}
            unoptimized
            alt={`${p.brand} ${p.model}`}
            fill
            className="object-contain p-8"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Info */}
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider ${accentText}`}>
            {p.brand} · {p.year}
          </p>
          <h1 className="font-display text-4xl font-bold mt-2 leading-tight">
            {p.model}
          </h1>
          {p.player && (
            <p className="mt-2 text-sm text-muted">
              🏆 La elección de <span className="text-foreground font-medium">{p.player}</span>
            </p>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold">
              {p.price.toFixed(2)} €
            </span>
            <span className="text-xs text-muted">PVP orientativo</span>
          </div>

          <p className="mt-6 text-muted leading-relaxed">{p.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {p.level.map((l) => (
              <span
                key={l}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10"
              >
                {capitalize(l)}
              </span>
            ))}
            {p.style.map((s) => (
              <span
                key={s}
                className={`px-3 py-1 rounded-full text-xs font-medium ${accentBg} text-black`}
              >
                {capitalize(s)}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <AddToCompare productId={p.id} />
          </div>
        </div>
      </div>

      {/* Specs */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold mb-6">
          Especificaciones técnicas
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {specs.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl bg-white/[0.03] border border-white/5 p-4"
            >
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Similares */}
      {similares.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similares.map((s) => (
              <ProductCard key={s.id} product={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
