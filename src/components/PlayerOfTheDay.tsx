import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { getProductImage } from "@/data/product-image";
import { getBestPrice, formatPrice } from "@/data/offers";
import type { DailyPlayer } from "@/data/daily-player";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/locales";

/**
 * "Jugador del día" — módulo diario de la portada.
 *
 * Diseño: banda editorial a dos columnas. La izquierda reproduce el lenguaje
 * del "Pilares" (lista técnica con dt/dd); la derecha lleva la foto del arma
 * sobre el fondo blanco de foto real (como las ProductCard), con un halo del
 * color del deporte (lima pádel / naranja tenis) que asciende desde el borde.
 * El título es la pregunta exacta que responde /jugadores/<slug> ("¿Qué pala
 * usa X?"), así que el módulo funciona como escaparate de esa página.
 */

export default function PlayerOfTheDay({
  feature,
  product,
  locale,
  labels,
}: {
  feature: DailyPlayer;
  product: Product;
  locale: Locale;
  labels: {
    eyebrow: string;
    pregunta: string;
    verFicha: string;
    verProducto: string;
    nota: string;
    desde: string;
    padel: string;
    tenis: string;
  };
}) {
  const en = locale === "en";
  const lp = (path: string) => localePath(locale, path);
  const image = getProductImage(product);
  const best = getBestPrice(product.id);
  const esPadel = product.sport === "padel";

  const specs: { label: string; value: string }[] = esPadel && product.padel
    ? [
        { label: en ? "Shape" : "Forma", value: shapeLabel(product.padel.shape, en) },
        { label: en ? "Weight" : "Peso", value: product.padel.weight },
        { label: en ? "Balance" : "Balance", value: balanceLabel(product.padel.balance, en) },
        { label: en ? "Faces" : "Caras", value: product.padel.faces },
      ]
    : product.tenis
      ? [
          { label: en ? "Head size" : "Tamiz", value: `${product.tenis.headSize} in²` },
          { label: en ? "Strung weight" : "Peso encordada", value: `${product.tenis.weightStrung} g` },
          { label: en ? "String pattern" : "Patrón", value: product.tenis.stringPattern },
          { label: en ? "Stiffness" : "Rigidez", value: `${product.tenis.stiffness} RA` },
        ]
      : [];

  return (
    <section className="max-w-7xl mx-auto px-6 mb-20 md:mb-28">
      <div className="relative overflow-hidden rounded-2xl border border-overlay-10 bg-surface-container-low">
        {/* Halo del color del deporte, anclado abajo; casi imperceptible en
            reposo y crece al hover como el resto de cards de la web. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 transition-opacity duration-500 ${
            esPadel ? "player-halo-padel" : "player-halo-tenis"
          }`}
        />

        <div className="relative grid gap-0 md:grid-cols-12">
          {/* Columna editorial */}
          <div className="p-8 sm:p-10 md:col-span-7 lg:p-12">
            <div className="flex items-center gap-3">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  esPadel ? "bg-padel-strong" : "bg-tenis-strong"
                }`}
              />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                {labels.eyebrow}
                <span className="mx-2 text-overlay-20" aria-hidden>
                  ·
                </span>
                <span className={esPadel ? "text-padel-strong" : "text-tenis-strong"}>
                  {esPadel ? labels.padel : labels.tenis}
                </span>
              </p>
            </div>

            <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {labels.pregunta}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted">
              <span className="font-semibold text-primary-strong">
                {product.brand} {product.model}
              </span>{" "}
              ({product.year}).{" "}
              {feature.facts[0][locale]}
            </p>

            <dl className="mt-7 divide-y divide-overlay-10 border-t border-overlay-10">
              {specs.map((s) => (
                <div key={s.label} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="font-display text-sm font-semibold text-primary-strong">
                    {s.label}
                  </dt>
                  <dd className="text-sm text-muted">{s.value}</dd>
                </div>
              ))}
              <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="font-display text-sm font-semibold text-primary-strong">
                  {en ? "Best price" : "Mejor precio"}
                </dt>
                <dd className="text-sm text-muted">
                  {best != null ? (
                    <>
                      <span className="sr-only">{labels.desde} </span>
                      {formatPrice(best)}
                    </>
                  ) : (
                    formatPrice(product.price)
                  )}
                </dd>
              </div>
            </dl>

            <ul className="mt-7 space-y-3">
              {feature.facts.slice(1).map((f) => (
                <li key={f.es} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${
                      esPadel ? "bg-padel-strong/70" : "bg-tenis-strong/70"
                    }`}
                  />
                  <span>{f[locale]}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={lp(`/jugadores/${feature.slug}`)}
                className="btn-lime rounded-lg px-6 py-3 text-xs"
              >
                {labels.verFicha}
              </Link>
              <Link
                href={lp(`/producto/${product.id}`)}
                className="btn-outline rounded-lg px-6 py-3 text-xs"
              >
                {labels.verProducto}
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted/80">{labels.nota}</p>
          </div>

          {/* Columna visual */}
          <div className="relative flex items-center justify-center border-t border-overlay-10 bg-white p-8 sm:p-10 md:col-span-5 md:border-l md:border-t-0">
            <Link
              href={lp(`/producto/${product.id}`)}
              className="group relative block h-72 w-full max-w-sm sm:h-80"
              aria-label={`${product.brand} ${product.model}`}
            >
              <Image
                src={image.src}
                unoptimized={image.unoptimized}
                alt={`${product.brand} ${product.model} — ${feature.name}`}
                fill
                className={`object-contain drop-shadow-[0_18px_35px_rgba(9,14,25,0.35)] transition-transform duration-500 ease-out group-hover:scale-105 ${
                  image.isReal ? "" : "opacity-90"
                }`}
                sizes="(max-width: 768px) 90vw, 40vw"
              />
            </Link>
            <span className="absolute top-5 right-5 font-display text-sm font-bold text-black/15 select-none">
              {product.year}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function shapeLabel(shape: string, en: boolean): string {
  const map: Record<string, [string, string]> = {
    redonda: ["Redonda", "Round"],
    lagrima: ["Lágrima", "Teardrop"],
    diamante: ["Diamante", "Diamond"],
    hibrida: ["Híbrida", "Hybrid"],
  };
  const pair = map[shape];
  return pair ? (en ? pair[1] : pair[0]) : shape;
}

function balanceLabel(balance: string, en: boolean): string {
  const map: Record<string, [string, string]> = {
    bajo: ["Bajo", "Low"],
    medio: ["Medio", "Medium"],
    alto: ["Alto", "High"],
  };
  const pair = map[balance];
  return pair ? (en ? pair[1] : pair[0]) : cap(balance);
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
