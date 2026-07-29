import { chromium } from "playwright";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const PRODUCTS = [
  { id: "bullpadel-vertex-04-comfort-2024", url: "https://www.padelnuestro.com/bullpadel-vertex-04-comfort-110866-p" },
  { id: "bullpadel-flow-2024", url: "https://www.padelnuestro.com/bullpadel-flow-w-24-110860-p" },
  { id: "head-extreme-pro-2024", url: "https://www.padelnuestro.com/head-extreme-pro-arturo-coello-2024-11280" },
  { id: "adidas-metalbone-carbon-ctrl-2024", url: "https://www.padelnuestro.com/adidas-metalbone-carbon-ctrl-3-3-2024-110" },
  { id: "wilson-bela-pro-2024", url: "https://www.padelnuestro.com/wilson-bela-pro-v2-105138-p" },
  { id: "bullpadel-indiga-ctr-2024", url: "https://www.padelnuestro.com/bullpadel-indiga-ctr-2024-32438-p" },
];

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    viewport: { width: 1366, height: 768 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  const outputDir = join(__dirname, "../public/images/rackets/real");
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const page = await context.newPage();

  for (const p of PRODUCTS) {
    console.log(`\n== ${p.id} ==`);
    try {
      await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(3000);

      // Aceptar cookies
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll<HTMLElement>("button"));
        const accept = btns.find(b => /aceptar|accept/i.test(b.textContent ?? ""));
        if (accept) accept.click();
      });
      await page.waitForTimeout(1000);

      // Buscar la imagen del producto: en Magento está en .gallery-placeholder o .product.media
      const imgSrc = await page.evaluate(() => {
        // 1. Imagen de la galería del producto
        const galleryImg = document.querySelector<HTMLImageElement>(".gallery-placeholder img, .gallery-placeholder__image");
        if (galleryImg?.src && galleryImg.naturalWidth > 400) return galleryImg.src;
        
        // 2. Imagen dentro de .product.media
        const mediaImg = document.querySelector<HTMLImageElement>(".product.media img");
        if (mediaImg?.src && mediaImg.naturalWidth > 400) return mediaImg.src;
        
        // 3. Cualquier imagen con "pala" o "racket" en el src
        const productImgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"))
          .filter(i => i.src && i.naturalWidth > 300)
          .filter(i => /pala|racket|product|catalog/i.test(i.src));
        if (productImgs.length > 0) return productImgs[0].src;
        
        return null;
      });

      if (!imgSrc) {
        console.log("  ❌ No se encontró imagen de producto");
        continue;
      }

      console.log(`  Encontrada: ${imgSrc.slice(0, 80)}`);
      
      const ext = imgSrc.match(/\.(jpg|jpeg|png|webp)(\?|$)/i)?.[1] ?? "jpg";
      const outPath = join(outputDir, `${p.id}.${ext}`);
      
      const resp = await fetch(imgSrc, {
        headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://www.padelnuestro.com/" },
      });
      if (resp.ok) {
        const buf = await resp.arrayBuffer();
        writeFileSync(outPath, Buffer.from(buf));
        console.log(`  ✅ Guardada: ${p.id}.${ext} (${Math.round(buf.byteLength/1024)}KB)`);
      } else {
        console.log(`  ❌ HTTP ${resp.status}`);
      }
    } catch (err) {
      console.log(`  ❌ Error: ${(err as Error).message.slice(0, 60)}`);
    }
  }

  await browser.close();
}

main().catch(console.error);
