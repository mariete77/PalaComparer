import { firefox } from "playwright";

async function main() {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
    locale: "es-ES",
    viewport: { width: 1366, height: 768 },
  });

  const page = await context.newPage();
  await page.goto("https://www.decathlon.es/es", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll<HTMLElement>("button"));
    const accept = btns.find(b => /aceptar todo|accept all/i.test(b.textContent ?? ""));
    if (accept) accept.click();
  });
  await page.waitForTimeout(1500);

  await page.goto("https://www.decathlon.es/es/search?Ntt=pala+padel+nox+at10", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(6000);

  // Buscar desde el precio hacia arriba hasta encontrar el contenedor del producto
  const products = await page.evaluate(() => {
    const priceEls = Array.from(document.querySelectorAll(".vp-price-amount"))
      .filter(el => el.offsetParent !== null);
    
    const seen = new Set<string>();
    const results: { name: string; price: string; url: string; img: string }[] = [];
    
    for (const priceEl of priceEls) {
      // Subir hasta encontrar un contenedor con nombre y link
      let el: HTMLElement | null = priceEl;
      for (let depth = 0; depth < 10 && el; depth++) {
        el = el.parentElement;
        if (!el) break;
        
        // Buscar un link o título dentro
        const link = el.querySelector("a[href]");
        const title = el.querySelector("h2, h3, [class*='title'], [class*='name']");
        
        if (link && (link.textContent?.trim() || title?.textContent?.trim())) {
          const name = (title?.textContent ?? link.textContent ?? "").trim();
          const href = (link as HTMLAnchorElement).href;
          
          // Solo productos, no navegación
          if (href.includes("/p/") && name.length > 5 && !seen.has(href)) {
            seen.add(href);
            const img = el.querySelector("img");
            results.push({
              name: name.slice(0, 100),
              price: priceEl.textContent?.trim() ?? "",
              url: href,
              img: img?.src ?? "",
            });
            break;
          }
        }
      }
    }
    
    return results;
  });

  console.log(`${products.length} productos:\n`);
  products.forEach((p, i) => {
    console.log(`${i+1}. ${p.name}`);
    console.log(`   💰 ${p.price}`);
    console.log(`   🔗 ${p.url.slice(0, 90)}`);
    console.log();
  });

  await browser.close();
}

main().catch(console.error);
