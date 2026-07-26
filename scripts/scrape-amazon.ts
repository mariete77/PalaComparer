/**
 * Scraper de precios reales de Amazon ES.
 * npx tsx scripts/scrape-amazon.ts
 * Output: src/data/real-offers.json
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
  asin: string | null;
  inStock: boolean;
  scrapedAt: string;
}

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

function buildQuery(p: ProductRef): string {
  const model = p.model.replace(/by\s+[^,]+$/i, "").replace(/\s+/g, " ").trim();
  return `${p.brand} ${model} ${p.year}`;
}

function isMatch(title: string, p: ProductRef): boolean {
  const t = title.toLowerCase();
  const brand = p.brand.toLowerCase();
  const brandOk = t.includes(brand) || t.includes(brand.replace(/\s+/g, ""));
  // Tokens de 2 letras incluidos: en modelos como "RX Carbon" el "rx" es lo
  // único que distingue, y descartarlo dejaba "carbon", que casa con media
  // gama de la marca.
  const kws = p.model.toLowerCase().replace(/by\s+[^,]+$/i, "")
    .split(/\s+/).filter(w => w.length >= 2 && !["the", "pro", "by", "de"].includes(w));
  const hits = kws.filter(k => t.includes(k)).length;
  const score = kws.length > 0 ? hits / kws.length : 0;
  const yearOk = t.includes(String(p.year)) || t.includes(String(p.year + 1));
  // El año ajusta el listón, nunca sustituye al modelo: con `score >= 0.4 ||
  // yearOk` bastaba con que coincidieran marca y año, así que cualquier pala de
  // esa marca y temporada se daba por buena.
  return brandOk && score >= (yearOk ? 0.5 : 0.7);
}

async function scrapeAmazon() {
  const products = loadProducts();
  console.log(`📋 ${products.length} productos a buscar en Amazon ES\n`);

  const outputPath = join(__dirname, "../src/data/real-offers.json");
  const cached: Record<string, ScrapedOffer> = existsSync(outputPath)
    ? JSON.parse(readFileSync(outputPath, "utf-8"))
    : {};

  // Poda las entradas cuyo producto ya no existe. Al renombrar un id (p. ej. al
  // pasar un modelo a la temporada siguiente) su precio queda huérfano: no lo
  // usa nadie, pero sin esto se arrastraría para siempre en el JSON.
  const vivos = new Set(products.map((p) => p.id));
  const existing: Record<string, ScrapedOffer> = {};
  const huerfanos: string[] = [];
  for (const [id, offer] of Object.entries(cached)) {
    if (vivos.has(id)) existing[id] = offer;
    else huerfanos.push(id);
  }
  if (huerfanos.length > 0) {
    console.log(`🧹 ${huerfanos.length} huérfanas podadas:`);
    huerfanos.forEach((id) => console.log(`     ${id}`));
    console.log();
  }

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

  // Eliminar navigator.webdriver
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  const results: Record<string, ScrapedOffer> = { ...existing };
  let found = 0;
  let missed = 0;

  // Un ASIN pertenece a un solo producto. Sin esto, el matching difuso puede
  // asignar el mismo anuncio a dos modelos parecidos de la misma marca y uno de
  // los dos acaba enlazando —y mostrando el precio de— la pala equivocada.
  const asinsUsados = new Map<string, string>();
  for (const [id, o] of Object.entries(existing)) {
    if (o.asin) asinsUsados.set(o.asin, id);
  }

  for (const product of products) {
    if (existing[product.id]?.price) {
      console.log(`  ⏭️  ${product.id} (cached: €${existing[product.id].price})`);
      found++;
      continue;
    }

    const query = buildQuery(product);
    const searchUrl = `https://www.amazon.es/s?k=${encodeURIComponent(query)}&i=sports`;

    try {
      const page = await context.newPage();
      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 20000 });

      // Detectar CAPTCHA
      const title = await page.title();
      if (title.includes("Robot") || title.includes("CAPTCHA") || title.includes("Type the characters")) {
        console.log(`  🤖 ${product.id}: CAPTCHA — skip`);
        await page.close();
        missed++;
        await new Promise(r => setTimeout(r, 8000));
        continue;
      }

      // Aceptar cookies
      try {
        const btn = page.locator("#sp-cc-accept").first();
        if (await btn.isVisible({ timeout: 1500 })) { await btn.click(); await page.waitForTimeout(500); }
      } catch {}

      // Esperar y extraer
      let items: { asin: string; title: string; price: string | null; url: string }[] = [];
      try {
        await page.waitForSelector("[data-asin]", { timeout: 10000 });
        await page.waitForTimeout(1500);
        items = await page.evaluate(() => {
          const out: { asin: string; title: string; price: string | null; url: string }[] = [];
          document.querySelectorAll("[data-asin]").forEach(el => {
            const asin = el.getAttribute("data-asin");
            if (!asin || asin.length !== 10) return;
            const titleEl = el.querySelector("h2 a, .s-link-style") as HTMLAnchorElement | null;
            const priceEl = el.querySelector(".a-offscreen");
            if (titleEl?.textContent?.trim() && titleEl.href) {
              out.push({ asin, title: titleEl.textContent.trim(), price: priceEl?.textContent?.trim() ?? null, url: titleEl.href });
            }
          });
          return out;
        });
      } catch {}

      await page.close();

      const matched = items.find(
        item => isMatch(item.title, product) && !asinsUsados.has(item.asin)
      );

      if (matched && matched.price) {
        asinsUsados.set(matched.asin, product.id);
        const priceNum = parseFloat(matched.price.replace("€", "").replace(/\./g, "").replace(",", ".").trim());
        const cleanUrl = `https://www.amazon.es/dp/${matched.asin}`;
        results[product.id] = {
          productId: product.id, title: matched.title, price: priceNum,
          url: cleanUrl, asin: matched.asin, inStock: true, scrapedAt: new Date().toISOString(),
        };
        // Guardar incrementalmente
        writeFileSync(outputPath, JSON.stringify(results, null, 2));
        console.log(`  ✅ ${product.id}: €${priceNum} → ${cleanUrl}`);
        found++;
      } else {
        console.log(`  ❌ ${product.id}: no match (${items.length} resultados)`);
        missed++;
      }
    } catch (err) {
      console.log(`  ⚠️  ${product.id}: ${(err as Error).message.slice(0, 60)}`);
      missed++;
    }

    // Delay anti-bloqueo: 5-8s entre peticiones
    await new Promise(r => setTimeout(r, 5000 + Math.random() * 3000));
  }

  await browser.close();
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 ${found} encontrados, ${missed} fallidos`);
  console.log(`💾 src/data/real-offers.json`);
}

scrapeAmazon().catch(console.error);
