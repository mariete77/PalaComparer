import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Guías que antes vivían bajo /noticias/<slug>. Se redirigen con 301 para no
// perder el posicionamiento de las URLs ya indexadas.
//
// La lista es explícita a propósito: importar ARTICLES aquí arrastraría los MDX
// dentro de la config. Al mover un artículo de sección, añade su slug.
const GUIAS_MOVIDAS_DESDE_NOTICIAS = [
  "formas-de-pala-cual-te-toca",
  "carbono-3k-12k-18k-diferencias",
  "palas-iniciacion-que-mirar",
  "tamis-y-patron-de-cuerdas",
  "gama-alta-2025-2026-tendencias",
];

const nextConfig: NextConfig = {
  // Las noticias se escriben en .mdx (src/content/noticias).
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async redirects() {
    // Las guías vivían bajo /noticias/<slug> (o /{locale}/noticias/<slug> tras
    // el i18n). Se redirigen con 301 para no perder el posicionamiento de las
    // URLs ya indexadas. El `:locale(*)` captura el prefijo opcional.
    return GUIAS_MOVIDAS_DESDE_NOTICIAS.flatMap((slug) => [
      {
        source: `/:locale(es|en)/noticias/${slug}`,
        destination: `/:locale/guias/${slug}`,
        permanent: true,
      },
      {
        source: `/noticias/${slug}`,
        destination: `/guias/${slug}`,
        permanent: true,
      },
    ]);
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  images: {
    // Fotos reales servidas desde un CDN. Da de alta aquí cada dominio antes de
    // referenciarlo en scripts/image-sources.json con el sufijo `#remote`.
    remotePatterns: [],
  },
};

const withMDX = createMDX({
  options: {
    // Turbopack (por defecto desde Next 16) no admite funciones en la config:
    // los plugins se declaran por nombre.
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
