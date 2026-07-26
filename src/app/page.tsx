import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { getBestPrice } from "@/data/offers";
import { ARTICLES, KIND_LABEL, formatArticleDate } from "@/data/news";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const destacadosPadel = PRODUCTS.filter(
    (p) =>
      p.sport === "padel" &&
      ["nox-at10-genius-18k-2025", "bullpadel-vertex-04-2024", "head-extreme-pro-2024", "adidas-metalbone-31-2024"].includes(p.id)
  );
  const destacadosTenis = PRODUCTS.filter(
    (p) =>
      p.sport === "tenis" &&
      ["babolat-pure-aero-2023", "wilson-blade-98-v9-2024", "head-speed-mp-2024", "yonex-ezone-100-2022"].includes(p.id)
  );
  const ultimasNoticias = ARTICLES.slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-padel/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-padel/30 bg-padel/10 text-padel text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-padel animate-pulse" />
            47 palas y raquetas · 2022-2026
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05]">
            Encuentra tu
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-padel via-emerald-300 to-tenis">
              arma perfecta
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
            Compara palas de pádel y raquetas de tenis por especificaciones reales.
            Filtra por nivel, estilo de juego y presupuesto. Decide con datos, no por marketing.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/finder"
              className="px-6 py-3 rounded-xl bg-padel text-black font-semibold hover:bg-lime-300 transition-all hover:scale-105"
            >
              🎯 Encuentra mi pala ideal
            </Link>
            <Link
              href="/comparar"
              className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold"
            >
              ⚖️ Comparar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="max-w-7xl mx-auto px-6 -mt-4 mb-16">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: "📊", title: "Specs reales", desc: "Peso, balance, núcleo, caras. Datos del fabricante, sin humo." },
            { icon: "🎯", title: "Por tu juego", desc: "Filtros por nivel y estilo: control, potencia, polivalente." },
            { icon: "⚖️", title: "Comparador lado a lado", desc: "Hasta 3 palas/raquetas cara a cara, spec por spec." },
          ].map((f) => (
            <div key={f.title} className="card-glow rounded-2xl bg-white/[0.02] p-6 backdrop-blur-sm">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-display font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PÁDEL DESTACADO */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-padel uppercase tracking-wider mb-1">Pádel</p>
            <h2 className="font-display text-3xl font-bold">Las palas del momento</h2>
          </div>
          <Link href="/palas" className="text-sm text-padel hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destacadosPadel.map((p) => (
            <ProductCard key={p.id} product={p} bestPrice={getBestPrice(p.id)} />
          ))}
        </div>
      </section>

      {/* TENIS DESTACADO */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-tenis uppercase tracking-wider mb-1">Tenis</p>
            <h2 className="font-display text-3xl font-bold">Raquetas destacadas</h2>
          </div>
          <Link href="/raquetas" className="text-sm text-tenis hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destacadosTenis.map((p) => (
            <ProductCard key={p.id} product={p} bestPrice={getBestPrice(p.id)} />
          ))}
        </div>
      </section>

      {/* NOTICIAS */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">
              Noticias
            </p>
            <h2 className="font-display text-3xl font-bold">
              Antes de comprar, léete esto
            </h2>
          </div>
          <Link href="/noticias" className="text-sm text-padel hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {ultimasNoticias.map((a) => (
            <Link
              key={a.slug}
              href={`/noticias/${a.slug}`}
              className="card-glow rounded-2xl bg-white/[0.02] p-6 flex flex-col"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-padel">
                {KIND_LABEL[a.kind]}
              </span>
              <h3 className="font-display font-semibold text-lg mt-2 leading-snug">
                {a.title}
              </h3>
              <p className="text-sm text-muted mt-2 leading-relaxed flex-1">
                {a.excerpt}
              </p>
              <p className="text-xs text-muted mt-4">
                {formatArticleDate(a.date)} · {a.readingMinutes} min
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
