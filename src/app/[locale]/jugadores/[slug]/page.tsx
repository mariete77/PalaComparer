import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PLAYERS, getPlayer } from "@/data/players";
import { getBestPrice, formatPrice } from "@/data/offers";
import { LOCALES, isLocale, localePath, type Locale } from "@/i18n/locales";
import { buildBreadcrumbSchema } from "@/data/schema";
import { absoluteLocaleUrl } from "@/data/site";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    PLAYERS.map((p) => ({ locale, slug: p.slug }))
  );
}

export const dynamicParams = false;

/**
 * Frase de respuesta directa, 40-60 palabras, al principio de la página.
 * Es el formato que extraen AI Overviews, ChatGPT y Perplexity para responder
 * "qué pala usa X"; sin ella la página no se cita aunque tenga el dato.
 */
function answerSentence(
  name: string,
  modelo: string,
  marca: string,
  year: number,
  locale: Locale
): string {
  return locale === "en"
    ? `${name} plays with the ${marca} ${modelo} (${year}). Below are its manufacturer specs and current prices across stores, plus the other models the player has used.`
    : `${name} juega con la ${marca} ${modelo} (${year}). Debajo tienes sus especificaciones de fabricante y los precios actuales en varias tiendas, además del resto de modelos que ha usado.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const player = getPlayer(slug);
  if (!player) return {};

  const actual = player.products[0];
  const esPadel = player.sport === "padel";
  const title =
    locale === "en"
      ? `What ${esPadel ? "paddle" : "racket"} does ${player.name} use? — PalaComparer`
      : `¿Qué ${esPadel ? "pala" : "raqueta"} usa ${player.name}? — PalaComparer`;

  return {
    title,
    description: answerSentence(
      player.name,
      actual.model,
      actual.brand,
      actual.year,
      locale
    ),
    alternates: {
      canonical: `/${locale}/jugadores/${slug}`,
      languages: {
        es: `/es/jugadores/${slug}`,
        en: `/en/jugadores/${slug}`,
        "x-default": `/es/jugadores/${slug}`,
      },
    },
  };
}

export default async function JugadorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const player = getPlayer(slug);
  if (!player) notFound();

  const lp = (path: string) => localePath(locale, path);
  const actual = player.products[0];
  const anteriores = player.products.slice(1);
  const esPadel = player.sport === "padel";
  const en = locale === "en";
  const mejorPrecio = getBestPrice(actual.id);

  const titulo = en
    ? `What ${esPadel ? "paddle" : "racket"} does ${player.name} use?`
    : `¿Qué ${esPadel ? "pala" : "raqueta"} usa ${player.name}?`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    jobTitle: en
      ? esPadel
        ? "Professional padel player"
        : "Professional tennis player"
      : esPadel
        ? "Jugador profesional de pádel"
        : "Jugador profesional de tenis",
    url: absoluteLocaleUrl(locale, `/jugadores/${player.slug}`),
    // El vínculo jugador-producto es el dato que hace citable la página.
    owns: player.products.map((p) => ({
      "@type": "Product",
      name: `${p.brand} ${p.model}`,
      url: absoluteLocaleUrl(locale, `/producto/${p.id}`),
    })),
  };

  const specs: [string, string][] = actual.padel
    ? [
        [en ? "Shape" : "Forma", actual.padel.shape],
        [en ? "Weight" : "Peso", actual.padel.weight],
        [en ? "Balance" : "Balance", actual.padel.balance],
        [en ? "Core" : "Núcleo", actual.padel.core],
        [en ? "Faces" : "Caras", actual.padel.faces],
      ]
    : actual.tenis
      ? [
          [en ? "Head size" : "Tamiz", `${actual.tenis.headSize} in²`],
          [en ? "Strung weight" : "Peso encordada", `${actual.tenis.weightStrung} g`],
          [en ? "String pattern" : "Patrón", actual.tenis.stringPattern],
          [en ? "Stiffness (RA)" : "Rigidez (RA)", String(actual.tenis.stiffness)],
        ]
      : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <JsonLd data={personSchema} />
      <JsonLd
        data={buildBreadcrumbSchema(
          [
            { name: en ? "Home" : "Inicio", path: "/" },
            { name: en ? "Players" : "Jugadores", path: "/jugadores" },
            { name: player.name, path: `/jugadores/${player.slug}` },
          ],
          locale
        )}
      />

      <nav className="text-xs text-muted mb-6">
        <Link href={lp("/")} className="hover:text-foreground">
          {en ? "Home" : "Inicio"}
        </Link>
        {" / "}
        <Link href={lp("/jugadores")} className="hover:text-foreground">
          {en ? "Players" : "Jugadores"}
        </Link>
        {" / "}
        <span className="text-foreground">{player.name}</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight leading-tight">
          {titulo}
        </h1>
        <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-muted">
          {answerSentence(player.name, actual.model, actual.brand, actual.year, locale)}
        </p>
      </header>

      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold mb-5">
          {en ? "Current model" : "Modelo actual"}
        </h2>
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <ProductCard product={actual} bestPrice={mejorPrecio} />
          </div>
          <dl className="md:col-span-7 md:col-start-6 divide-y divide-overlay-10 border-t border-overlay-10">
            {specs.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="font-display font-semibold text-primary-strong">{k}</dt>
                <dd className="text-sm text-muted">{v}</dd>
              </div>
            ))}
            <div className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="font-display font-semibold text-primary-strong">
                {en ? "Best price" : "Mejor precio"}
              </dt>
              <dd className="text-sm text-muted">
                {formatPrice(mejorPrecio ?? actual.price)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {anteriores.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-5">
            {en ? "Other models used" : "Otros modelos que ha usado"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {anteriores.map((p) => (
              <ProductCard key={p.id} product={p} bestPrice={getBestPrice(p.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
