import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "es";
  const english = locale === "en";

  return {
    title: english
      ? "Find a padel paddle or tennis racket | PalaComparer"
      : "Encuentra tu pala o raqueta por nivel y estilo | PalaComparer",
    description: english
      ? "Find padel paddles and tennis rackets by skill level, play style and budget."
      : "Encuentra palas de pádel y raquetas de tenis según tu nivel, estilo de juego y presupuesto.",
    alternates: {
      canonical: `/${locale}/finder`,
      languages: {
        es: "/es/finder",
        en: "/en/finder",
        "x-default": "/es/finder",
      },
    },
  };
}

export default function FinderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
