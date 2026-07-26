// Tipa el export nombrado `metadata` de los .mdx. El export por defecto (el
// componente) ya lo declara @types/mdx; aquí solo se amplía la declaración.
declare module "*.mdx" {
  export const metadata: import("@/data/news").ArticleMeta;
}
