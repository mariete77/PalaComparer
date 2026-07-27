/**
 * Scraper de precios reales de PadelNuestro.
 * npx tsx scripts/scrape-padelnuestro.ts
 * Output: src/data/real-offers-padelnuestro.json
 *
 * Método: usa las URLs de categoría por marca (Magento):
 *   https://www.padelnuestro.com/palas-padel/nox
 *   https://www.padelnuestro.com/palas-padel/bullpadel
 *   etc.
 * Extrae todos los productos de cada marca y hace match
 * con nuestro catálogo por nombre/año. Mucho más fiable que
 * la búsqueda (que usa Doofinder JS y está bloqueada para bots).
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

interface ProductRef {
  id: string;
  brand: string;
  model: string;
  year: number;
}

interface ScrapedOffer {
  productId: string;
  title: string;
  price: number | null;
  url: string;
  inStock: boolean;
  scrapedAt: string;
}

interface CatalogItem {
  name: string;
  price: number | null;
  url: string;
}

/** Slug de PadelNuestro por marca (minúsculas, guiones) */
const BRAND_SLUGS: Record<string, string> = {
  "nox": "nox",
  "bullpadel": "bullpadel",
  "adidas": "adidas",
  "head": "head",
  "wilson": "wilson",
  "babolat": "babolat",
  "siux": "siux",
  "starvie": "starvie",
  "black crown": "black-crown",
  "varlion": "varlion",
  "dunlop": "dunlop",
  "asics": "asics",
  "joma": "joma",
  "kelme": "kelme",
  "drop shot": "drop-shot",
  "cartri": "cartri",
  "royal padel": "royal-padel",
  "vibora": "vibora",
  "vairo": "vairo",
  "softee": "softee",
  "eze": "eze",
  "osaka": "osaka",
  "mystica": "mystica",
  "dabber": "dabber",
  "furia": "furia",
  "kombat": "kombat",
  "metalbone": "adidas", // metalbone es adidas
};

function loadProducts(): ProductRef[] {
  const content = readFileSync(join(__dirname, "../src/data/products.ts"), "utf-8");
  const products: ProductRef[] = [];
  const re = /id:\s*"([^"]+)".*?brand:\s*"([^"]+)".*?model:\s*"([^"]+)".*?year:\s*(\d+)/gs;
  let m;
  while ((m = re.exec(content)) !== null) {
    products.push({ id: m[1], brand: m[2], model: m[3], year: parseInt(m[4]) });
  }
  return products;
}

function brandSlug(brand: string): string | null {
  const key = brand.toLowerCase().trim();
  return BRAND_SLUGS[key] ?? null;
}

function isMatch(title: string, p: ProductRef): boolean {
  const t = title.toLowerCase();
  const brand = p.brand.toLowerCase();
  const brandOk = t.includes(brand) || t.includes(brand.replace(/\s+/g, ""));
  const kws = p.model.toLowerCase().replace(/by\s+[^,]+$/i, "")
    .split(/\s+/).filter(w => w.length > 2 && !["the", "pro", "by", "pala"].includes(w));
  const hits = kws.filter(k => t.includes(k)).length;
  const score = kws.length > 0 ? hits / kws.length : 0;
  const yearOk = t.includes(String(p.year)) || t.includes(String(p.year + 1)) || t.includes(String(p.year - 1));
  return brandOk && (score >= 0.5 || (score >= 0.3 && yearOk));
}

const EXCLUDE = [
  "zapatilla", "mochila", "paletero", "camiseta", "sudadera", "pack",
  "blister", "overgrip", "manguito", "falda", "vestido", "pantalon",
  "polo", "caja", "muñequera", "calcetin", "gorra", "pelota", "bolas",
  "protector", "cordaje", "grip", "antivibrador", "bolsa", "bandolera",
  "t-shirt", "leggins", "top", "chanclas", "sandalias", "toalla",
];

async function scrapeBrandPage(page: any, brandSlugStr: string): Promise<CatalogItem[]> {
  const items: CatalogItem[] = [];
  let pageNum = 1;
  const maxPages = 5; // límite de seguridad

  while (pageNum <= maxPages) {
    const url = pageNum === 1
      ? `https://www.padelnuestro.com/palas-padel/${brandSlugStr}`
      : `https://www.padelnuestro.com/palas-padel/${brandSlugStr}?p=${pageNum}`;

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(2500);

      // Aceptar cookies si aparece el banner (solo primera vez)
      if (pageNum === 1) {
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll<HTMLElement>("button, a, [role=button]"));
          const accept = btns.find(b => /aceptar|accept|agree/i.test(b.textContent ?? ""));
          if (accept) accept.click();
        });
        await page.waitForTimeout(1000);
      }

      const pageItems = await page.evaluate(() => {
        const out: { name: string; price: string | null; url: string }[] = [];
        document.querySelectorAll(".product-item").forEach(el => {
          const nameEl = el.querySelector(".product-item-name a, .product-item-link");
          const priceEl = el.querySelector(".price");
          if (nameEl?.textContent?.trim()) {
            out.push({
              name: nameEl.textContent.trim(),
              price: priceEl?.textContent?.trim() ?? null,
              url: (nameEl as HTMLAnchorElement).href ?? "",
            });
          }
        });
        return out;
      });

      if (pageItems.length === 0) break; // no hay más productos

      for (const item of pageItems) {
        const priceNum = item.price
          ? parseFloat(item.price.replace("€", "").trim().replace(/\./g, "").replace(",", "."))
          : null;
        items.push({ name: item.name, price: priceNum, url: item.url });
      }

      console.log(`    Página ${pageNum}: ${pageItems.length} productos`);
      pageNum++;
    } catch (err) {
      console.log(`    ⚠️ Error en página ${pageNum}: ${(err as Error).message.slice(0, 50)}`);
      break;
    }
  }

  return items;
}

async function scrapePadelNuestro() {
  const products = loadProducts();
  console.log(`📋 ${products.length} productos en catálogo\n`);

  const outputPath = join(__dirname, "../src/data/real-offers-padelnuestro.json");
  const existing: Record<string, ScrapedOffer> = existsSync(outputPath)
    ? JSON.parse(readFileSync(outputPath, "utf-8"))
    : {};

  // Agrupar productos por marca
  const byBrand = new Map<string, ProductRef[]>();
  for (const p of products) {
    const slug = brandSlug(p.brand);
    if (!slug) {
      console.log(`  ⚠️ Marca sin slug: "${p.brand}" (${p.id})`);
      continue;
    }
    if (!byBrand.has(slug)) byBrand.set(slug, []);
    byBrand.get(slug)!.push(p);
  }

  console.log(`🏷️ ${byBrand.size} marcas a scrapear: ${[...byBrand.keys()].join(", ")}\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "es-ES",
    viewport: { width: 1366, height: 768 },
    extraHTTPHeaders: { "Accept-Language": "es-ES,es;q=0.9,en;q=0.8" },
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  const results: Record<string, ScrapedOffer> = { ...existing };
  let found = 0;
  let missed = 0;

  const page = await context.newPage();

  for (const [slug, brandProducts] of byBrand) {
    console.log(`\n🔍 Marca: ${slug} (${brandProducts.length} productos en catálogo)`);

    // Saltar marcas ya completas
    const pending = brandProducts.filter(p => !existing[p.id]?.price);
    if (pending.length === 0) {
      console.log(`  ⏭️ Ya scrapeada completa`);
      found += brandProducts.length;
      continue;
    }

    const catalog = await scrapeBrandPage(page, slug);
    console.log(`  📦 ${catalog.length} productos en PadelNuestro`);

    // Filtrar solo palas/raquetas
    const padelCatalog = catalog.filter(item => {
      const n = item.name.toLowerCase();
      return !EXCLUDE.some(w => n.includes(w));
    });
    console.log(`  🎾 ${padelCatalog.length} palas tras filtrar accesorios`);

    for (const product of pending) {
      const matched = padelCatalog.find(item => isMatch(item.name, product));
      if (matched && matched.price) {
        results[product.id] = {
          productId: product.id,
          title: matched.name,
          price: matched.price,
          url: matched.url,
          inStock: true,
          scrapedAt: new Date().toISOString(),
        };
        writeFileSync(outputPath, JSON.stringify(results, null, 2));
        console.log(`  ✅ ${product.id}: €${matched.price} → ${matched.url.slice(0, 70)}`);
        found++;
      } else {
        console.log(`  ❌ ${product.id}: no match`);
        missed++;
      }
    }

    // Delay entre marcas
    await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));
  }

  await browser.close();
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 ${found} encontrados, ${missed} fallidos`);
  console.log(`💾 src/data/real-offers-padelnuestro.json`);
}

scrapePadelNuestro().catch(console.error);
