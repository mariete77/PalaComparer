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
    return GUIAS_MOVIDAS_DESDE_NOTICIAS.map((slug) => ({
      source: `/noticias/${slug}`,
      destination: `/guias/${slug}`,
      permanent: true,
    }));
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
