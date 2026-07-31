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
      ? "Compare padel paddles and tennis rackets | PalaComparer"
      : "Compara palas de pádel y raquetas de tenis | PalaComparer",
    description: english
      ? "Compare up to three padel paddles or tennis rackets side by side, including specs and current prices."
      : "Compara hasta tres palas de pádel o raquetas de tenis lado a lado, con especificaciones y precios actuales.",
    alternates: {
      canonical: `/${locale}/comparar`,
      languages: {
        es: "/es/comparar",
        en: "/en/comparar",
        "x-default": "/es/comparar",
      },
    },
  };
}

export default function CompararLayout({ children }: { children: React.ReactNode }) {
  return children;
}
