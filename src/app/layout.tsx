import type { Metadata } from "next";
import { Montserrat, Hanken_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CompareProvider } from "@/components/CompareContext";
import CompareBar from "@/components/CompareBar";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

const SITE_DESCRIPTION =
  "Compara palas de pádel y raquetas de tenis por especificaciones, nivel y estilo de juego. Encuentra tu arma perfecta.";

// Define NEXT_PUBLIC_SITE_URL en producción: sin él, las URLs absolutas de las
// tarjetas para compartir apuntarían a localhost.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Google Analytics 4. Sobreescribible con NEXT_PUBLIC_GA_ID para poder apuntar
// a otra propiedad (staging) sin tocar el código.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-4YZ39NTPE6";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PalaComparer — Encuentra tu pala o raqueta perfecta",
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: "PalaComparer",
    locale: "es_ES",
    type: "website",
    title: "PalaComparer — Encuentra tu pala o raqueta perfecta",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${hanken.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-surface/80 border-b border-white/10">
          <nav className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shadow-[inset_0_1px_4px_rgba(255,255,255,0.4)]">
                <Image
                  src="/logo-mark.png"
                  alt=""
                  width={24}
                  height={24}
                  priority
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tighter text-primary-container">
                PalaComparer
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6 font-display font-bold text-sm">
              <Link
                href="/palas"
                className="text-on-surface-variant hover:text-primary transition-colors hover:scale-105 transform"
              >
                Palas
              </Link>
              <Link
                href="/raquetas"
                className="text-on-surface-variant hover:text-primary transition-colors hover:scale-105 transform"
              >
                Raquetas
              </Link>
              <Link
                href="/noticias"
                className="text-on-surface-variant hover:text-primary transition-colors hover:scale-105 transform"
              >
                Noticias
              </Link>
              <Link
                href="/finder"
                className="text-on-surface-variant hover:text-primary transition-colors hover:scale-105 transform"
              >
                Encuentra la tuya
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/comparar"
                className="btn-primary px-5 py-2.5 rounded-lg"
              >
                Comparar
              </Link>
            </div>
          </nav>
        </header>
        <CompareProvider>
          <main className="min-h-screen pt-[72px]">{children}</main>
          <CompareBar />
        </CompareProvider>
        <footer className="border-t border-white/5 mt-24 bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="font-display font-extrabold text-lg text-primary-container tracking-tighter">
                PalaComparer
              </span>
              <p className="text-sm text-muted">
                © 2026 PalaComparer. Engineered for Performance.
              </p>
            </div>
            <p className="text-xs text-muted">
              Datos de especificaciones de fabricantes. Precios orientativos.
            </p>
          </div>
        </footer>
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}
