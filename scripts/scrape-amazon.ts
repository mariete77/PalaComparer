/**
 * Scraper de precios reales de Amazon ES.
 * npx tsx scripts/scrape-amazon.ts
 * Output: src/data/real-offers.json
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { loadProducts, isMatch, buildQuery, type ProductRef } from "./lib/product-match";

interface ScrapedOffer {
  productId: string;
  title: string;
  price: number | null;
  url: string;
  asin: string | null;
  inStock: boolean;
  scrapedAt: string;
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
