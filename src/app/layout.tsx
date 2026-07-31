import type { Metadata } from "next";
import { Space_Grotesk, Hanken_Grotesk } from "next/font/google";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { CompareProvider } from "@/components/CompareContext";
import { LocaleProvider } from "@/i18n/LocaleContext";
import CompareBar from "@/components/CompareBar";
import Nav from "@/components/Nav";
import AyanipCredit from "@/components/AyanipCredit";
import JsonLd from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_URL } from "@/data/site";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/data/schema";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-4YZ39NTPE6";

export const metadata: Metadata = {
  // SITE_URL cae al dominio de producción, no a localhost: sin eso, og:image
  // servía http://localhost:3000/opengraph-image.png y todas las previews al
  // compartir salían rotas.
  metadataBase: new URL(SITE_URL),
  title: "PalaComparer — Encuentra tu pala o raqueta perfecta",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "PalaComparer",
    locale: "es_ES",
    type: "website",
    url: "/",
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
    <html lang="es" className={`${spaceGrotesk.variable} ${hanken.variable}`}>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <LocaleProvider>
          {/* Entidad de marca: sin esto, ninguna IA puede verificar quién compara
            ni con qué autoridad. */}
        <JsonLd data={buildOrganizationSchema()} />
        <JsonLd data={buildWebSiteSchema()} />
        <Nav />
          <CompareProvider>
            <main className="min-h-screen pt-[72px]">{children}</main>
            <CompareBar />
          </CompareProvider>
        <footer className="border-t border-white/5 mt-24 bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-10">
              <div className="col-span-2 md:col-span-1">
                <span className="font-display font-extrabold text-lg text-primary-container tracking-tighter">
                  PalaComparer
                </span>
                <p className="text-sm text-muted mt-3 leading-relaxed">
                  Compara palas de pádel y raquetas de tenis por especificaciones
                  reales. Decide con datos, no con marketing.
                </p>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm mb-4">Catálogo</h4>
                <nav className="flex flex-col gap-2.5">
                  <Link href="/palas" className="text-sm text-muted hover:text-primary-container transition-colors">Palas de pádel</Link>
                  <Link href="/raquetas" className="text-sm text-muted hover:text-primary-container transition-colors">Raquetas de tenis</Link>
                  <Link href="/finder" className="text-sm text-muted hover:text-primary-container transition-colors">Encuentra la tuya</Link>
                  <Link href="/comparar" className="text-sm text-muted hover:text-primary-container transition-colors">Comparador</Link>
                </nav>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm mb-4">Contenido</h4>
                <nav className="flex flex-col gap-2.5">
                  <Link href="/noticias" className="text-sm text-muted hover:text-primary-container transition-colors">Noticias y guías</Link>
                </nav>
              </div>
              <div>
                <p className="text-xs text-muted leading-relaxed">
                  Datos de especificaciones de fabricantes. Precios orientativos.
                </p>
                <p className="text-xs text-muted mt-3">
                  © {new Date().getFullYear()} PalaComparer
                </p>
              </div>
            </div>
            <AyanipCredit />
          </div>
        </footer>
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
        {/* Vercel Analytics: visitas y páginas vistas. Solo recoge datos en el
            despliegue de Vercel; en local no envía nada. */}
        <Analytics />
        </LocaleProvider>
      </body>
    </html>
  );
}
