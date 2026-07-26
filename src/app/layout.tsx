import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { CompareProvider } from "@/components/CompareContext";
import CompareBar from "@/components/CompareBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
  title: "PalaComparer — Encuentra tu pala o raqueta perfecta",
  description:
    "Compara palas de pádel y raquetas de tenis por especificaciones, nivel y estilo de juego. Encuentra tu arma perfecta.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-grid">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🎾</span>
              <span className="font-display font-bold text-xl tracking-tight">
                Pala<span className="text-padel">Comparer</span>
              </span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-2 text-sm">
              <Link
                href="/palas"
                className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Palas
              </Link>
              <Link
                href="/raquetas"
                className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Raquetas
              </Link>
              <Link
                href="/finder"
                className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                Encuentra la tuya
              </Link>
              <Link
                href="/comparar"
                className="ml-1 px-4 py-2 rounded-lg bg-padel text-black font-semibold hover:bg-lime-300 transition-colors"
              >
                Comparar
              </Link>
            </div>
          </nav>
        </header>
        <CompareProvider>
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <CompareBar />
        </CompareProvider>
        <footer className="border-t border-white/5 mt-24">
          <div className="max-w-7xl mx-auto px-6 py-12 text-sm text-muted flex flex-col sm:flex-row justify-between gap-4">
            <p>© 2026 PalaComparer — Encuentra tu arma perfecta</p>
            <p className="text-xs">
              Datos de especificaciones de fabricantes. Precios orientativos.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
