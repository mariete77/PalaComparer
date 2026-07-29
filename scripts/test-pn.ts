import { chromium } from "playwright";

async function main() {
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
  
  for (const url of ["https://www.padelnuestro.com/palas-padel/nox", "https://www.padelnuestro.com/palas-padel/nox?p=2"]) {
    console.log(`\n== ${url} ==`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(3000);
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll<HTMLElement>("button, a, [role=button]"));
      const accept = btns.find(b => /aceptar|accept|agree/i.test(b.textContent ?? ""));
      if (accept) accept.click();
    });
    await page.waitForTimeout(1000);
    
    const items = await page.evaluate(() => {
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
    
    console.log(`${items.length} productos:`);
    items.slice(0, 8).forEach((it, i) => console.log(`  ${i + 1}. ${it.name} | ${it.price}`));
  }
  
  await browser.close();
}

main().catch(console.error);
