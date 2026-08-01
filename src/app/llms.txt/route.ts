import { PRODUCTS } from "@/data/products";
import { ARTICLES, isGuide } from "@/data/news";
import { absoluteLocaleUrl, SITE_DESCRIPTIONS, SITE_NAME, SITE_URL } from "@/data/site";

export const dynamic = "force-static";

/** Human-readable discovery file for AI agents and other text-first crawlers. */
export function GET() {
  const featuredIds = [
    "nox-at10-genius-18k-2026",
    "bullpadel-vertex-05-2026",
    "babolat-pure-aero-2026",
    "wilson-blade-98-v10-2026",
    "head-speed-mp-2026",
  ];
  const featured = featuredIds
    .map((id) => PRODUCTS.find((product) => product.id === id))
    .filter((product): product is (typeof PRODUCTS)[number] => Boolean(product));
  const editorial = ARTICLES.slice(0, 8);

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTIONS.en}`,
    "",
    "PalaComparer is an independent comparison site for padel paddles and tennis rackets. Product specs come from manufacturers; prices are checked across several stores and refreshed weekly.",
    "",
    "## Docs",
    `- [Home](${absoluteLocaleUrl("en", "/")}): Overview of the comparison service, weekly price updates and latest padel and tennis models.`,
    `- [Padel paddle catalogue](${absoluteLocaleUrl("en", "/palas")}): Filterable catalogue with manufacturer specs, skill level, play style and current prices.`,
    `- [Tennis racket catalogue](${absoluteLocaleUrl("en", "/raquetas")}): Filterable catalogue with racket specifications, player level, style and price comparisons.`,
    `- [Finder](${absoluteLocaleUrl("en", "/finder")}): Guided recommendations based on level, play style, priorities and budget.`,
    `- [Comparator](${absoluteLocaleUrl("en", "/comparar")}): Side-by-side comparison of up to three paddles or rackets.`,
    `- [Guides](${absoluteLocaleUrl("en", "/guias")}): Editorial explainers about shapes, carbon grades, string patterns and choosing a model.`,
    `- [Methodology](${absoluteLocaleUrl("en", "/metodologia")}): Explains how manufacturer specifications, retailer prices, stock and weekly snapshots are collected.`,
    "",
    "## Products",
    ...featured.map((product) => `- [${product.brand} ${product.model}](${absoluteLocaleUrl("en", `/producto/${product.id}`)}): Product page with manufacturer specifications, store offers, availability and price history.`),
    "",
    "## Resources",
    ...editorial.map((article) => {
      const section = isGuide(article) ? "guias" : "noticias";
      return `- [${article.title.en}](${absoluteLocaleUrl("en", `/${section}/${article.slug}`)}): ${article.excerpt.en}`;
    }),
    "",
    "## Key Facts",
    "- Industry: sports equipment comparison and editorial content",
    "- Languages: Spanish and English",
    "- Data sources: manufacturer specifications and retailer price checks",
    "- Update cadence: prices and latest product news are reviewed weekly",
    "",
    "## Source and methodology",
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- Robots: ${SITE_URL}/robots.txt`,
    "- Use each product page as the canonical source for current specs, prices, availability and price history.",
    "- Prices are indicative; confirm the final amount at the retailer before buying.",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
