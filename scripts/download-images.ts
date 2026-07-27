/**
 * Descarga imágenes reales de productos desde PadelNuestro y Amazon.
 * npx tsx scripts/download-images.ts
 *
 * Para cada producto sin foto real que tenga URL en real-offers-stores.json
 * o real-offers.json, visita la página del producto y extrae la imagen
 * principal (og:image o la primera imagen del producto).
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

interface ProductRef {
  id: string;
  brand: string;
  model: string;
  sport: string;
}

interface StoreOffer {
  storeId: string;
  title: string;
  price: number;
  url: string;
  inStock: boolean;
}

interface AmazonOffer {
  productId: string;
  title: string;
  price: number | null;
  url: string;
  asin: string | null;
  inStock: boolean;
}

function loadProducts(): ProductRef[] {
  const content = readFileSync(join(__dirname, "../src/data/products.ts"), "utf-8");
  const products: ProductRef[] = [];
  const re = /id:\s*"([^"]+)".*?brand:\s*"([^"]+)".*?model:\s*"([^"]+)".*?sport:\s*"([^"]+)"/gs;
  let m;
  while ((m = re.exec(content)) !== null) {
    products.push({ id: m[1], brand: m[2], model: m[3], sport: m[4] });
  }
  return products;
}

function getRealImageIds(): Set<string> {
  const dir = join(__dirname, "../public/images/rackets/real");
  if (!existsSync(dir)) return new Set();
  const files = require("fs").readdirSync(dir);
  return new Set(files.map((f: string) => f.replace(/\.[^.]+$/, "")));
}

async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        "Referer": "https://www.padelnuestro.com/",
      },
    });
    if (!resp.ok) return false;
    const buffer = await resp.arrayBuffer();
    writeFileSync(outputPath, Buffer.from(buffer));
    return true;
  } catch {
    return false;
  }
}

async function extractImageFromPage(page: any, url: string): Promise<string | null> {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(3000);

    // Aceptar cookies si aparece
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll<HTMLElement>("button, a, [role=button]"));
      const accept = btns.find(b => /aceptar|accept|agree/i.test(b.textContent ?? ""));
      if (accept) accept.click();
    });
    await page.waitForTimeout(1000);

    // Estrategia 1: og:image
    let imgUrl = await page.evaluate(() => {
      const og = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
      return og?.content ?? null;
    });
    if (imgUrl) return imgUrl;

    // Estrategia 2: imagen principal del producto
    imgUrl = await page.evaluate(() => {
      // Magento: .gallery-placeholder img, .product-image-photo
      const selectors = [
        ".product-image-photo",
        ".gallery-placeholder__image",
        ".product.media img",
        "#main-image",
        ".main-image img",
        "img[data-role='product-image']",
        ".product-img-main img",
        "#product-image",
        ".product__image img",
      ];
      for (const sel of selectors) {
        const el = document.querySelector<HTMLImageElement>(sel);
        if (el?.src && !el.src.includes("placeholder") && !el.src.includes("loading")) {
          return el.src;
        }
      }
      // Cualquier imagen grande dentro de la ficha
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"))
        .filter(i => i.src && i.naturalWidth > 300 && i.naturalHeight > 300)
        .filter(i => !i.src.includes("logo") && !i.src.includes("icon") && !i.src.includes("banner"));
      return imgs[0]?.src ?? null;
    });
    return imgUrl;
  } catch {
    return null;
  }
}

async function main() {
  const products = loadProducts();
  const withRealImg = getRealImageIds();
  const storesData = JSON.parse(readFileSync(join(__dirname, "../src/data/real-offers-stores.json"), "utf-8"));
  const amazonData = JSON.parse(readFileSync(join(__dirname, "../src/data/real-offers.json"), "utf-8"));

  const outputDir = join(__dirname, "../public/images/rackets/real");
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const manifestPath = join(__dirname, "../src/data/real-images.json");
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf-8"))
    : { images: {} };

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "es-ES",
    viewport: { width: 1366, height: 768 },
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  const page = await context.newPage();

  let downloaded = 0;
  let failed = 0;

  for (const product of products) {
    if (withRealImg.has(product.id)) {
      console.log(`  ⏭️  ${product.id} (ya tiene foto)`);
      continue;
    }

    let url: string | null = null;
    let source = "";

    // Buscar URL en PadelNuestro (para pádel) o Amazon (para tenis)
    const storeOffers = storesData[product.id] as StoreOffer[] | undefined;
    const amazonOffer = amazonData[product.id] as AmazonOffer | undefined;

    if (product.sport === "padel" && storeOffers?.length) {
      url = storeOffers[0].url;
      source = "padelnuestro";
    } else if (product.sport === "tenis" && amazonOffer?.url) {
      url = amazonOffer.url;
      source = "amazon";
    } else if (storeOffers?.length) {
      url = storeOffers[0].url;
      source = "padelnuestro";
    } else if (amazonOffer?.url) {
      url = amazonOffer.url;
      source = "amazon";
    }

    if (!url) {
      console.log(`  ❌ ${product.id}: sin URL de producto`);
      failed++;
      continue;
    }

    console.log(`  🔍 ${product.id}: ${source} → ${url.slice(0, 60)}...`);

    const imgUrl = await extractImageFromPage(page, url);
    if (!imgUrl) {
      console.log(`    ⚠️  No se encontró imagen en la página`);
      failed++;
      continue;
    }

    // Determinar extensión
    const ext = imgUrl.match(/\.(jpg|jpeg|png|webp)(\?|$)/i)?.[1] ?? "jpg";
    const outputPath = join(outputDir, `${product.id}.${ext}`);

    const ok = await downloadImage(imgUrl, outputPath);
    if (ok) {
      // Actualizar manifiesto
      manifest.images[product.id] = {
        src: `/images/rackets/real/${product.id}.${ext}`,
        source: url,
        licence: "pendiente",
      };
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(`    ✅ Descargada: ${product.id}.${ext}`);
      downloaded++;
    } else {
      console.log(`    ⚠️  Error descargando ${imgUrl.slice(0, 60)}`);
      failed++;
    }

    // Delay entre productos
    await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));
  }

  await browser.close();
  console.log(`\n📊 ${downloaded} descargadas, ${failed} fallidos`);
  console.log(`💾 Manifiesto actualizado: src/data/real-images.json`);
}

main().catch(console.error);
