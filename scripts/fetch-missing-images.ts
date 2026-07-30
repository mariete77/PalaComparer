/**
 * Busca y descarga fotos reales para las palas sin imagen.
 * Para cada producto, busca en PadelNuestro, encuentra la ficha del producto
 * y extrae la imagen principal (og:image).
 *
 * npx tsx scripts/fetch-missing-images.ts
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

interface MissingProduct {
  id: string;
  model: string;
  brand: string;
}

const MISSING: MissingProduct[] = [
  { id: "babolat-counter-viper-2025", brand: "Babolat", model: "Counter Viper" },
  { id: "adidas-drive-2024", brand: "Adidas", model: "Drive 3.3" },
  { id: "varlion-l-bourne-summum-2025", brand: "Varlion", model: "L Bourne Summum" },
  { id: "drop-shot-explorer-pro-comfort-10-2025", brand: "Drop Shot", model: "Explorer Pro Comfort 1.0 2025" },
  { id: "royal-padel-m27-light-2026", brand: "Royal Padel", model: "M27 Light 2026" },
  { id: "royal-padel-36th-anniversary-poly-2026", brand: "Royal Padel", model: "36th Anniversary Poly 2026" },
  { id: "royal-padel-whip-eva-2025", brand: "Royal Padel", model: "Whip EVA" },
  { id: "drop-shot-conqueror-attack-2-0-2025", brand: "Drop Shot", model: "Conqueror Attack 2.0 2025" },
  { id: "drop-shot-explorer-pro-attack-2-0-2025", brand: "Drop Shot", model: "Explorer Pro Attack 2.0 2025" },
  { id: "drop-shot-axion-attack-1-0-2025", brand: "Drop Shot", model: "Axion Attack 1.0 2025" },
  { id: "royal-padel-whip-extreme-2026", brand: "Royal Padel", model: "Whip Extreme 2026" },
  { id: "royal-padel-rp-r30-golden-white-2025", brand: "Royal Padel", model: "RP R30 Golden White 2025" },
  { id: "royal-padel-rp-fury-2026", brand: "Royal Padel", model: "RP Fury 2026" },
  { id: "akkeron-black-diablo-pro-2025", brand: "Akkeron", model: "Black Diablo Pro 2025" },
  { id: "akkeron-black-predator-pro-2025", brand: "Akkeron", model: "Black Predator Pro 2025" },
  { id: "bullpadel-xplo-premier-padel-2026", brand: "Bullpadel", model: "XPLO Premier Pádel 2026" },
  { id: "bullpadel-vertex-05-geo-premier-padel-2026", brand: "Bullpadel", model: "Vertex 05 GEO Premier Pádel 2026" },
  { id: "bullpadel-indiga-power-2026", brand: "Bullpadel", model: "Indiga Power 2026" },
  { id: "head-coello-pro-2026", brand: "Head", model: "Coello Pro 2026" },
  { id: "head-coello-motion-2026", brand: "Head", model: "Coello Motion 2026" },
  { id: "head-extreme-one-x-2025", brand: "Head", model: "Extreme One X 2025" },
  { id: "adidas-crossit-carbon-2026", brand: "Adidas", model: "Cross IT Carbon 2026" },
  { id: "adidas-arrow-hit-attk-2026", brand: "Adidas", model: "Arrow HIT ATTK 2026" },
  { id: "siux-electra-pro-2026", brand: "Siux", model: "Electra Pro Fire Red 2026" },
  { id: "siux-valkiria-pro-2026", brand: "Siux", model: "Valkiria Pro 2026" },
  { id: "starvie-triton-power-2025", brand: "StarVie", model: "Triton Power+ 2025" },
  { id: "nox-nextgen-pro-attack-12k-2026", brand: "Nox", model: "NextGen Pro Attack 12K 2026" },
];

async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });
    if (!resp.ok) return false;
    const buffer = await resp.arrayBuffer();
    if (buffer.byteLength < 3000) return false; // too small, probably a placeholder
    writeFileSync(outputPath, Buffer.from(buffer));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const outputDir = join(__dirname, "../public/images/rackets/real");
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const manifestPath = join(__dirname, "../src/data/real-images.json");
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf-8"))
    : { images: {} };

  // Skip products that already have real images
  const existingReal = new Set(
    readdirSync(outputDir).map((f) => f.replace(/\.[^.]+$/, ""))
  );

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "es-ES",
    viewport: { width: 1366, height: 768 },
  });

  const page = await context.newPage();

  let downloaded = 0;
  let failed = 0;

  for (const product of MISSING) {
    if (existingReal.has(product.id)) {
      console.log(`  ⏭️  ${product.id} (ya tiene foto)`);
      continue;
    }

    const searchQuery = encodeURIComponent(`${product.brand} ${product.model} pala padel`);
    const searchUrl = `https://www.padelnuestro.com/catalogsearch/result/?q=${searchQuery}`;

    console.log(`\n🔍 ${product.id}: buscando "${product.brand} ${product.model}"...`);

    try {
      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForTimeout(3000);

      // Accept cookies
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll<HTMLElement>("button, a, [role=button]"));
        const accept = btns.find((b) => /aceptar|accept|agree|todo/i.test(b.textContent ?? ""));
        if (accept) accept.click();
      });
      await page.waitForTimeout(1500);

      // Find first product link from search results
      const productLink = await page.evaluate((modelName) => {
        // PadelNuestro search results
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href*='/int/palas-padel/'], a[href*='palas-padel']"));
        // Try to find a link whose text matches the model name
        const match = links.find((l) => {
          const text = (l.textContent ?? "").toLowerCase();
          const href = l.href.toLowerCase();
          return text.includes(modelName.toLowerCase().split(" ")[0]) || href.includes(modelName.toLowerCase().split(" ")[0]);
        });
        return (match ?? links[0])?.href ?? null;
      }, product.model);

      if (!productLink) {
        console.log(`    ⚠️  No se encontró producto en los resultados`);
        failed++;
        continue;
      }

      console.log(`    → Ficha: ${productLink.slice(0, 80)}...`);

      // Visit the product page
      await page.goto(productLink, { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForTimeout(3000);

      // Extract og:image or product image
      const imgUrl = await page.evaluate(() => {
        // Strategy 1: og:image
        const og = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
        if (og?.content) return og.content;

        // Strategy 2: product image selectors
        const selectors = [
          ".product-image-photo",
          ".gallery-placeholder__image",
          ".product.media img",
          "#main-image",
          ".fotorama__img",
          ".product-img-box img",
          "img[data-role='product-image']",
        ];
        for (const sel of selectors) {
          const el = document.querySelector<HTMLImageElement>(sel);
          if (el?.src && !el.src.includes("placeholder") && el.naturalWidth > 200) {
            return el.src;
          }
        }

        // Strategy 3: any large product-like image
        const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"))
          .filter((i) => i.src && (i.naturalWidth > 300 || i.width > 300))
          .filter((i) => !i.src.includes("logo") && !i.src.includes("icon") && !i.src.includes("banner") && !i.src.includes("sprite"));
        return imgs[0]?.src ?? null;
      });

      if (!imgUrl) {
        console.log(`    ⚠️  No se encontró imagen en la ficha`);
        failed++;
        continue;
      }

      console.log(`    → Imagen: ${imgUrl.slice(0, 80)}...`);

      // Determine extension
      const ext = imgUrl.match(/\.(jpg|jpeg|png|webp)(\?|$)/i)?.[1]?.toLowerCase() ?? "jpg";
      const outputPath = join(outputDir, `${product.id}.${ext}`);

      const ok = await downloadImage(imgUrl, outputPath);
      if (ok) {
        manifest.images[product.id] = {
          src: `/images/rackets/real/${product.id}.${ext}`,
          source: productLink,
          licence: "pendiente",
        };
        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log(`    ✅ Descargada: ${product.id}.${ext}`);
        downloaded++;
        existingReal.add(product.id);
      } else {
        console.log(`    ⚠️  Error descargando imagen`);
        failed++;
      }
    } catch (err) {
      console.log(`    ⚠️  Error: ${(err as Error).message.slice(0, 80)}`);
      failed++;
    }

    // Delay between products
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));
  }

  await browser.close();
  console.log(`\n📊 ${downloaded} descargadas, ${failed} fallidos`);
  console.log(`💾 Manifiesto: src/data/real-images.json`);
}

main().catch(console.error);
