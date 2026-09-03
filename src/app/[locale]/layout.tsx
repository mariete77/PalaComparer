import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Hanken_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { CompareProvider } from "@/components/CompareContext";
import { LocaleProvider } from "@/i18n/LocaleContext";
import CompareBar from "@/components/CompareBar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import {
  absoluteUrl,
  SITE_DESCRIPTIONS,
  SITE_URL,
} from "@/data/site";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/data/schema";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_BCP47,
  type Locale,
} from "@/i18n/locales";
import { translate } from "@/i18n/locales";
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

/**
 * Init de tema antes del primer paint (se inyecta en <head> vía
 * beforeInteractive): lee la preferencia guardada o respeta
 * prefers-color-scheme. Sin esto habría un flash de tema incorrecto.
 */
const THEME_INIT = `(function(){try{var t=localStorage.getItem("pc-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

// Solo existen /es y /en: cualquier otro prefijo es 404.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const bcp = LOCALE_BCP47[loc];
  const title = translate(loc, "layout.title");
  const description = SITE_DESCRIPTIONS[loc];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${loc}`,
      languages: {
        es: SITE_URL + "/es",
        en: SITE_URL + "/en",
        "x-default": SITE_URL + "/es",
      },
    },
    openGraph: {
      siteName: "PalaComparer",
      locale: bcp.replace("-", "_"),
      type: "website",
      url: `/${loc}`,
      title,
      description,
      images: [{
        url: absoluteUrl("/opengraph-image.png"),
        alt: "PalaComparer: comparison of padel paddles and tennis rackets",
      }],
    },
    twitter: {
      card: "summary_large_image",
      images: [absoluteUrl("/opengraph-image.png")],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const bcp = LOCALE_BCP47[locale];

  return (
    <html
      lang={bcp}
      data-theme="dark"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${hanken.variable}`}
    >
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT }}
        />
        <LocaleProvider locale={locale}>
          {/* Entidad de marca: sin esto, ninguna IA puede verificar quién compara
            ni con qué autoridad. */}
          <JsonLd data={buildOrganizationSchema(locale)} />
          <JsonLd data={buildWebSiteSchema(locale)} />
          <Nav />
          <CompareProvider>
            {/* 12px de separación superior + 64px de cápsula + aire. */}
            <main className="min-h-screen pt-[92px] sm:pt-[96px]">{children}</main>
            <CompareBar />
          </CompareProvider>
          <Footer />
          {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
          {/* Vercel Analytics: visitas y páginas vistas. Solo recoge datos en el
            despliegue de Vercel; en local no envía nada. */}
          <Analytics />
        </LocaleProvider>
      </body>
    </html>
  );
}
