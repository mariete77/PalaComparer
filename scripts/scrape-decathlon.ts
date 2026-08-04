/**
 * Scraper de precios reales de Decathlon ES.
 * npx tsx scripts/scrape-decathlon.ts
 * Output: src/data/real-offers-decathlon.json
 *
 * Método: Firefox (Chromium es bloqueado por Cloudflare) + búsqueda con
 * parámetro Ntt. Los productos se extraen buscando desde los elementos
 * de precio (.vp-price-amount) hacia arriba hasta encontrar el contenedor
 * con nombre + link del producto.
 *
 * Delays de 5-8s entre búsquedas. Guardado incremental.
 */

import { firefox } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

interface ProductRef {
  id: string;
  brand: string;
  model: string;
  year: number;
  sport: string;
}

interface ScrapedOffer {
  productId: string;
  title: string;
  price: number | null;
  listPrice: number | null;
  url: string;
  inStock: boolean;
  scrapedAt: string;
}

const EXCLUDE = [
  "zapatilla", "mochila", "paletero", "camiseta", "sudadera", "pack",
  "blister", "overgrip", "manguito", "falda", "vestido", "pantalon",
  "polo", "caja", "muñequera", "calcetin", "gorra", "pelota", "bolas",
  "protector", "cordaje", "grip", "antivibrador", "bolsa", "bandolera",
  "t-shirt", "leggins", "top", "chanclas", "sandalias", "toalla",
  "junior", "niño", "niña", "kid",
  // Variantes de género: evita emparejar la versión femenina con el modelo unisex
  "girl", "woman", "women", "wta", "femenina", "lady",
];

function loadProducts(): ProductRef[] {
  const content = readFileSync(join(__dirname, "../src/data/products.ts"), "utf-8");
  const products: ProductRef[] = [];
  // ⚠️ El orden de campos en products.ts es id → model → brand (NO id → brand → model).
  // Un regex `id...brand...model` cruza entries y mezcla modelos de productos
  // vecinos. Por eso se extraen brand/model/year dentro de una ventana tras el id.
  const re = /id:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const win = content.slice(m.index, m.index + 600);
    const brand = /brand:\s*"([^"]+)"/.exec(win)?.[1];
    const model = /model:\s*"([^"]+)"/.exec(win)?.[1];
    const year = /year:\s*(\d+)/.exec(win)?.[1];
    if (!brand || !model || !year) continue;
    products.push({ id: m[1], brand, model, year: parseInt(year), sport: /sport:\s*"([^"]+)"/.exec(win)?.[1] ?? "" });
  }
  return products;
}

function buildQuery(p: ProductRef): string {
  const model = p.model.replace(/by\s+[^,]+$/i, "").replace(/\s+/g, " ").trim();
  if (p.sport === "padel") {
    return `pala padel ${p.brand} ${model} ${p.year}`;
  }
  return `raqueta tenis ${p.brand} ${model} ${p.year}`;
}

/** Palabras sin valor discriminante para el matching. */
const STOPWORDS = new Set([
  "the", "pro", "by", "de", "del", "padel", "pala", "palas", "raqueta",
  "raquetas", "adulto", "adultos", "gen",
]);

/**
 * Variantes del producto que NO deben emparejarse si el modelo del catálogo
 * no las menciona: versiones femeninas (Indiga Girl ≠ Indiga Power),
 * junior, light (Clash 100 L ≠ Clash 100), team, etc.
 */
const VARIANT_TOKENS = new Set([
  "girl", "woman", "women", "wta", "femenina", "fem", "lady",
  "junior", "júnior", "kid", "kids", "niño", "niña",
  "light", "team", "l", "w",
]);

/** Normaliza el modelo: quita paréntesis "(8th gen)", "by <jugador>" y años. */
function modelKeywords(model: string): string[] {
  return model
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ") // "(4th Gen)", "(8th gen)", "(300G)"…
    .replace(/by\s+[^,]+$/i, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w) && !/^\d{4}$/.test(w));
}

function isMatch(title: string, p: ProductRef): boolean {
  const t = title.toLowerCase();
  const brand = p.brand.toLowerCase();
  const brandOk = t.includes(brand) || t.includes(brand.replace(/\s+/g, ""));
  if (!brandOk) return false;

  // Variante del producto (género, light, junior…) no contemplada en el modelo → rechazar.
  // Ej.: título "INDIGA Girl 2026" contra modelo "Indiga Power 2026".
  const modelLower = p.model.toLowerCase();
  const modelTokens = new Set(modelLower.split(/\s+/));
  const tokens = t.split(/[^a-z0-9áéíóúñü]+/).filter(Boolean);
  if (tokens.some((tk) => VARIANT_TOKENS.has(tk) && !modelTokens.has(tk))) return false;

  const kws = modelKeywords(p.model);
  const hits = kws.filter((k) => t.includes(k)).length;
  const score = kws.length > 0 ? hits / kws.length : 0;

  // Umbral alto y fijo: mejor no mostrar oferta que mostrar un producto distinto.
  // 0.85 descarta "CTRL 3.4" contra "CTRL 3.3" (0.75) o "Blade v10" contra "v9" (0.8).
  return score >= 0.85;
}

function parsePrice(text: string): number | null {
  const m = text.match(/(\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})?)\s*€?/);
  if (!m) return null;
  const limpio = m[1].replace(/\./g, "").replace(/\s/g, "").replace(",", ".");
  const n = parseFloat(limpio);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function scrapeDecathlon() {
  const products = loadProducts();
  console.log(`📋 ${products.length} productos a buscar en Decathlon\n`);

  const outputPath = join(__dirname, "../src/data/real-offers-decathlon.json");
  const existing: Record<string, ScrapedOffer> = existsSync(outputPath)
    ? JSON.parse(readFileSync(outputPath, "utf-8"))
    : {};

  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
    locale: "es-ES",
    viewport: { width: 1366, height: 768 },
  });

  const results: Record<string, ScrapedOffer> = { ...existing };
  let found = 0;
  let missed = 0;

  const page = await context.newPage();

  // Home + aceptar cookies
  await page.goto("https://www.decathlon.es/es", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll<HTMLElement>("button"));
    const accept = btns.find(b => /aceptar todo|accept all/i.test(b.textContent ?? ""));
    if (accept) accept.click();
  });
  await page.waitForTimeout(1500);
  console.log("🍪 Cookies aceptadas\n");

  for (const product of products) {
    if (existing[product.id]?.price) {
      console.log(`  ⏭️  ${product.id} (cached: €${existing[product.id].price})`);
      found++;
      continue;
    }

    const query = buildQuery(product);
    const searchUrl = `https://www.decathlon.es/es/search?Ntt=${encodeURIComponent(query)}`;

    try {
      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(5000);

      const items = await page.evaluate((excludeKws: string[]) => {
        const priceEls = Array.from(document.querySelectorAll<HTMLElement>(".vp-price-amount"))
          .filter(el => el.offsetParent !== null);

        const seen = new Set<string>();
        const out: { name: string; price: string; url: string }[] = [];

        for (const priceEl of priceEls) {
          let el: HTMLElement | null = priceEl;
          for (let depth = 0; depth < 10 && el; depth++) {
            el = el.parentElement;
            if (!el) break;

            const link = el.querySelector("a[href]");
            const title = el.querySelector("h2, h3, [class*='title'], [class*='name']");

            if (link && (link.textContent?.trim() || title?.textContent?.trim())) {
              const name = (title?.textContent ?? link.textContent ?? "").trim();
              const href = (link as HTMLAnchorElement).href;

              if (href.includes("/p/") && name.length > 5 && !seen.has(href)) {
                const nLower = name.toLowerCase();
                if (!excludeKws.some(w => nLower.includes(w))) {
                  seen.add(href);
                  out.push({
                    name: name.slice(0, 120),
                    price: priceEl.textContent?.trim() ?? "",
                    url: href,
                  });
                }
                break;
              }
            }
          }
        }
        return out;
      }, EXCLUDE);

      const matched = items.find(item => isMatch(item.name, product));

      if (matched && matched.price) {
        const priceNum = parsePrice(matched.price);
        if (priceNum) {
          results[product.id] = {
            productId: product.id,
            title: matched.name,
            price: priceNum,
            listPrice: null,
            url: matched.url,
            inStock: true,
            scrapedAt: new Date().toISOString(),
          };

          writeFileSync(outputPath, JSON.stringify(results, null, 2));
          console.log(`  ✅ ${product.id}: €${priceNum} → ${matched.url.slice(0, 70)}`);
          found++;
        } else {
          console.log(`  ❌ ${product.id}: precio no parseable ("${matched.price}")`);
          missed++;
        }
      } else {
        console.log(`  ❌ ${product.id}: no match (${items.length} resultados)`);
        missed++;
      }
    } catch (err) {
      console.log(`  ⚠️  ${product.id}: ${(err as Error).message.slice(0, 60)}`);
      missed++;
    }

    // Delay anti-bloqueo
    await new Promise(r => setTimeout(r, 5000 + Math.random() * 3000));
  }

  await browser.close();
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 ${found} encontrados, ${missed} fallidos`);
  console.log(`💾 src/data/real-offers-decathlon.json`);
}

scrapeDecathlon().catch(console.error);
