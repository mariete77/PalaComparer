import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Las noticias se escriben en .mdx (src/content/noticias).
  pageExtensions: ["ts", "tsx", "md", "mdx"],
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
