// Componentes disponibles dentro de los .mdx sin necesidad de importarlos.
// Se registran en src/mdx-components.tsx.

import Link from "next/link";
import { getProduct } from "@/data/products";
import { formatPrice, getBestPrice } from "@/data/offers";
import ProductCard from "@/components/ProductCard";

/** Bloque destacado. `<Callout title="Ojo">…</Callout>` */
export function Callout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="not-prose my-8 rounded-2xl border border-padel/25 bg-padel/[0.06] p-5">
      {title && (
        <p className="font-display font-semibold text-padel mb-1">{title}</p>
      )}
      <div className="text-sm text-muted leading-relaxed [&>p]:m-0 [&>p+p]:mt-2">
        {children}
      </div>
    </aside>
  );
}

/** Enlace en línea a una ficha, con su mejor precio. `<ProductRef id="nox-x-one-2024" />` */
export function ProductRef({ id }: { id: string }) {
  const product = getProduct(id);
  if (!product) return null;
  const best = getBestPrice(id);

  return (
    <Link
      href={`/producto/${id}`}
      className="not-prose inline-flex items-baseline gap-1.5 font-medium text-padel hover:underline"
    >
      {product.brand} {product.model}
      {best !== null && (
        <span className="text-xs text-muted">desde {formatPrice(best)}</span>
      )}
    </Link>
  );
}

/** Rejilla de fichas. `<ProductGrid ids={["a","b"]} />` */
export function ProductGrid({ ids }: { ids: string[] }) {
  const products = ids
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) return null;

  return (
    <div className="not-prose my-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} bestPrice={getBestPrice(p.id)} />
      ))}
    </div>
  );
}

/** Tabla comparativa rápida de specs. `<SpecRow label="Peso" value="365 g" />` */
export function SpecList({ children }: { children: React.ReactNode }) {
  return (
    <dl className="not-prose my-6 grid sm:grid-cols-2 gap-3">{children}</dl>
  );
}

export function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
      <dt className="text-xs text-muted uppercase tracking-wider mb-1">{label}</dt>
      <dd className="font-semibold m-0">{value}</dd>
    </div>
  );
}
