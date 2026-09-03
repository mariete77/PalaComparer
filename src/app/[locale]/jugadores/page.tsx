import type { Metadata } from "next";
import Link from "next/link";
import { PLAYERS } from "@/data/players";
import { LOCALES, isLocale, localePath, type Locale } from "@/i18n/locales";
import { buildItemListSchema } from "@/data/schema";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const en = locale === "en";

  return {
    title: en
      ? "What paddle does each pro use? — PalaComparer"
      : "¿Qué pala usa cada profesional? — PalaComparer",
    description: en
      ? "The paddles and rackets used by professional players, with manufacturer specs and prices across stores."
      : "Las palas y raquetas que usan los jugadores profesionales, con specs de fabricante y precios en varias tiendas.",
    alternates: {
      canonical: `/${locale}/jugadores`,
      languages: {
        es: "/es/jugadores",
        en: "/en/jugadores",
        "x-default": "/es/jugadores",
      },
    },
  };
}

export default async function JugadoresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const lp = (path: string) => localePath(locale, path);
  const en = locale === "en";

  const grupos = [
    { titulo: en ? "Padel" : "Pádel", jugadores: PLAYERS.filter((p) => p.sport === "padel") },
    { titulo: en ? "Tennis" : "Tenis", jugadores: PLAYERS.filter((p) => p.sport === "tenis") },
  ].filter((g) => g.jugadores.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <JsonLd
        data={buildItemListSchema(
          en ? "Professional players" : "Jugadores profesionales",
          PLAYERS.map((p) => ({
            id: `jugadores/${p.slug}`,
            brand: "",
            model: p.name,
          })),
          locale
        )}
      />

      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          {en ? "What each pro plays with" : "Con qué juega cada profesional"}
        </h1>
        <p className="mt-3 max-w-[65ch] text-muted leading-relaxed">
          {en
            ? "The exact model each professional uses, with manufacturer specs and current prices. Nothing here is a guess: every model links to its own page."
            : "El modelo exacto que usa cada profesional, con specs de fabricante y precios actuales. Nada de suposiciones: cada modelo enlaza a su ficha."}
        </p>
      </header>

      {grupos.map((grupo) => (
        <section key={grupo.titulo} className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-5">{grupo.titulo}</h2>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3 border-t border-overlay-10">
            {grupo.jugadores.map((p) => {
              const actual = p.products[0];
              return (
                <li key={p.slug} className="border-b border-overlay-10">
                  <Link
                    href={lp(`/jugadores/${p.slug}`)}
                    className="group block py-4 transition-colors hover:text-primary-strong"
                  >
                    <span className="font-display font-semibold">{p.name}</span>
                    <span className="block text-sm text-muted">
                      {actual.brand} {actual.model}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
