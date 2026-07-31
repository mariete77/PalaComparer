import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/data/products";
import { getProductImage } from "@/data/product-image";
import {
  formatPrice,
  getBestPrice,
  getOffers,
  getPriceHistory,
  getPriceSummary,
} from "@/data/offers";
import { KIND_LABEL, getArticlesForProduct, articleHref } from "@/data/news";
import { buildProductSchema, buildBreadcrumbSchema } from "@/data/schema";
import JsonLd from "@/components/JsonLd";
import AddToCompare from "@/components/AddToCompare";
import ProductCard from "@/components/ProductCard";
import OfferTable from "@/components/OfferTable";
import PriceHistoryChart from "@/components/PriceHistoryChart";
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
  const path = `/producto/${p.id}`;
  return {
    title: `${p.brand} ${p.model} (${p.year}) — PalaComparer`,
    description: p.description,
    // Evita duplicados por www/apex y por parámetros de campaña.
    alternates: { canonical: path },
    openGraph: {
      title: `${p.brand} ${p.model} (${p.year})`,
      description: p.description,
      url: path,
      type: "website",
    },
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
  const accentVar = p.sport === "padel" ? "var(--accent-padel)" : "var(--accent-tenis)";

  const image = getProductImage(p);
  const summary = getPriceSummary(p.id);
  const offers = getOffers(p.id);
  const history = getPriceHistory(p.id);
  const noticias = getArticlesForProduct(p.id);

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

  const listado = p.sport === "padel" ? "/palas" : "/raquetas";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* El dato que hace citable esta ficha: specs de fabricante + precios
          reales de varias tiendas, legibles como entidad por sistemas de IA. */}
      <JsonLd data={buildProductSchema(p, offers, image.isReal ? image.src : undefined)} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: p.sport === "padel" ? "Palas" : "Raquetas", path: listado },
          { name: `${p.brand} ${p.model}`, path: `/producto/${p.id}` },
        ])}
      />

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
        <div>
          <div className={`relative aspect-[2/3] max-h-[600px] rounded-3xl overflow-hidden card-glow ${
            image.isReal ? "bg-white" : "bg-gradient-to-b from-white/5 to-transparent"
          }`}>
            <Image
              src={image.src}
              unoptimized={image.unoptimized}
              alt={`${p.brand} ${p.model}`}
              fill
              className="object-contain p-8"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!image.isReal && (
              <span className="absolute bottom-3 left-3 text-[10px] text-muted bg-background/70 px-2 py-1 rounded-full">
                Ilustración orientativa
              </span>
            )}
          </div>
          {image.credit && (
            <p className="mt-2 text-[11px] text-muted text-right">
              {image.source ? (
                <a
                  href={image.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {image.credit}
                </a>
              ) : (
                image.credit
              )}
            </p>
          )}
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

          {summary ? (
            <div className="mt-6">
              <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                <span className="font-display text-4xl font-bold">
                  {formatPrice(summary.min)}
                </span>
                {summary.discountPct > 0 && (
                  <>
                    <span className="text-muted line-through text-sm">
                      {formatPrice(p.price)}
                    </span>
                    <span className={`text-sm font-semibold ${accentText}`}>
                      −{summary.discountPct}%
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">
                Mejor precio entre {summary.offerCount}{" "}
                {summary.offerCount === 1 ? "tienda" : "tiendas"} · PVP{" "}
                {formatPrice(p.price)}
              </p>
              {summary.atHistoricalLow && (
                <p className="mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-padel/15 text-padel border border-padel/30">
                  ↓ Mínimo histórico
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold">
                {formatPrice(p.price)}
              </span>
              <span className="text-xs text-muted">PVP orientativo</span>
            </div>
          )}

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

      {/* Dónde comprar */}
      {offers.length > 0 && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
            <h2 className="font-display text-2xl font-bold">Dónde comprar</h2>
            <p className="text-xs text-muted">
              Precios orientativos. Confirma siempre el importe final en la tienda.
            </p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <OfferTable offers={offers} />

            {history.length > 1 && (
              <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                <h3 className="font-display font-semibold mb-1">
                  Evolución del precio
                </h3>
                <p className="text-xs text-muted mb-4">
                  Evolución del mejor precio
                </p>
                <PriceHistoryChart points={history} accent={accentVar} />
                {summary && (
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted uppercase tracking-wider">
                        Mínimo histórico
                      </dt>
                      <dd className="font-semibold tabular-nums mt-0.5">
                        {formatPrice(summary.historicalMin)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted uppercase tracking-wider">
                        Máximo actual
                      </dt>
                      <dd className="font-semibold tabular-nums mt-0.5">
                        {formatPrice(summary.max)}
                      </dd>
                    </div>
                  </dl>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Noticias relacionadas */}
      {noticias.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6">
            Hablamos de esta {p.sport === "padel" ? "pala" : "raqueta"}
          </h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {noticias.map((a) => (
              <li key={a.slug}>
                <Link
                  href={articleHref(a)}
                  className="block h-full rounded-xl bg-white/[0.02] border border-white/5 p-5 hover:bg-white/[0.05] transition-colors"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">
                    {KIND_LABEL[a.kind]} · {a.readingMinutes} min
                  </span>
                  <p className="font-display font-semibold mt-1.5 leading-snug">
                    {a.title}
                  </p>
                  <p className="text-sm text-muted mt-1.5 leading-relaxed">
                    {a.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Similares */}
      {similares.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similares.map((s) => (
              <ProductCard
                key={s.id}
                product={s}
                bestPrice={getBestPrice(s.id)}
              />
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
