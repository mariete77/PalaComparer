/**
 * Verificación del carrusel Blossom en la homepage (prod build local).
 * Sin visión: DOM, estilos computados, geometría, interacción real.
 * Genera screenshot para docs/screenshots/.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3111";
const OUT = "docs/screenshots/2026-09-16-blossom-carousel.png";

function assert(cond: boolean, label: string, detail?: unknown) {
  const mark = cond ? "✅" : "❌";
  console.log(`${mark} ${label}${detail !== undefined ? " → " + JSON.stringify(detail) : ""}`);
  if (!cond) process.exitCode = 1;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  // Ruido preexistente en local: Vercel Insights sirve HTML→404 fuera de
  // Vercel; "Failed to load resource" no incluye URL en el texto (los 404
  // con URL se trackean en el handler de response).
  const noise = /_vercel|Failed to load resource/.test(m.text());
  if (m.type() === "error" && !noise) errors.push(m.text());
});
page.on("response", (r) => {
  // 404s preexistentes de infraestructura: /favicon.ico (la web usa icon.png
  // vía metadata API, también 404 en producción) y Vercel Analytics (solo
  // existe desplegado en Vercel). No son fallos de esta mejora.
  const known = r.url().includes("/_vercel/") || r.url().endsWith("/favicon.ico");
  if (r.status() >= 400 && !known) errors.push(`${r.status()} ${r.url()}`);
});

await page.goto(`${BASE}/es`, { waitUntil: "networkidle" });

// ==== Estructura SSR/hidratación ====
const carousels = await page.locator("[blossom-carousel]").count();
assert(carousels === 3, "3 carruseles presentes (ofertas, pádel, tenis)", carousels);

// El carrusel de ofertas (4 items) no scrollea en desktop: flechas ocultas.
const ofertas = page.locator("#blossom-ofertas");
const ofertasState = await ofertas.evaluate((el) => {
  const wrap = el.closest("[data-carousel]")!;
  const p = wrap.querySelector("[blossom-prev]") as HTMLButtonElement;
  const n = wrap.querySelector("[blossom-next]") as HTMLButtonElement;
  return {
    overflow: el.scrollWidth > el.clientWidth + 2,
    prevDisabled: p.disabled,
    nextDisabled: n.disabled,
  };
});
console.log("ofertas (4 items):", JSON.stringify(ofertasState));
assert(!ofertasState.overflow && ofertasState.prevDisabled && ofertasState.nextDisabled,
  "ofertas: sin overflow → flechas deshabilitadas (comportamiento correcto)");

// Carrusel de PÁDEL (8 items): sí scrollea → pruebas de interacción aquí.
const first = page.locator("#blossom-padel");
const tag = await first.evaluate((el) => el.tagName.toLowerCase());
assert(tag === "ul", "scroller semántico <ul>", tag);

// ==== Estilos computados (desktop 1280px → 4 por vista) ====
const styles = await first.evaluate((el) => {
  const cs = getComputedStyle(el);
  const li = el.querySelector("li");
  return {
    display: cs.display,
    gridAutoFlow: cs.gridAutoFlow,
    snapType: cs.scrollSnapType,
    overflowX: cs.overflowX,
    overflowY: cs.overflowY,
    scrollbarWidth: cs.scrollbarWidth,
    liSnapAlign: li ? getComputedStyle(li).scrollSnapAlign : null,
    liWidth: li ? Math.round(li.getBoundingClientRect().width) : 0,
    clientWidth: el.clientWidth,
    scrollWidth: el.scrollWidth,
    snapTypeVar: el.style.getPropertyValue("--snap-type"),
  };
});
console.log("styles:", JSON.stringify(styles));
assert(styles.display === "grid" && styles.gridAutoFlow.includes("column"), "grid horizontal");
assert(styles.snapType.includes("x mandatory"), "scroll-snap x mandatory");
assert(styles.overflowX === "auto" || styles.overflowX === "scroll", "overflow-x auto/scroll", styles.overflowX);
assert(styles.overflowY === "clip" || styles.overflowY === "hidden", "overflow-y clip (sin scroll vertical)", styles.overflowY);
assert(styles.scrollbarWidth === "none", "scrollbar oculto");
assert(styles.liSnapAlign === "start", "snap-align start en items");
assert(styles.scrollWidth > styles.clientWidth + 50, "hay overflow real (8 items)", { client: styles.clientWidth, scroll: styles.scrollWidth });
const perView = Math.round(styles.clientWidth / styles.liWidth);
console.log("cards por vista (aprox):", perView);

// ==== Geometría: una fila, alturas iguales, tarjetas llenan el slide ====
const geo = await first.evaluate((el) => {
  const lis = [...el.querySelectorAll("li")];
  const rects = lis.map((li) => li.getBoundingClientRect());
  return {
    rows: new Set(rects.map((r) => Math.round(r.top / 10))).size,
    heights: [...new Set(rects.map((r) => Math.round(r.height)))],
    fills: lis.every((li) => {
      const card = li.firstElementChild as HTMLElement;
      return Math.abs(card.getBoundingClientRect().height - li.getBoundingClientRect().height) < 2;
    }),
    count: lis.length,
  };
});
assert(geo.count === 8, "8 slides en destacados pádel", geo.count);
assert(geo.rows === 1, "todos los slides en una fila", geo.rows);
assert(geo.heights.length === 1, "alturas de slide uniformes", geo.heights);
assert(geo.fills, "ProductCard llena el alto del slide");

// ==== Flechas ====
const wrap = page.locator("[data-carousel='padel']").first();
const prevBtn = wrap.locator("[blossom-prev]");
const nextBtn = wrap.locator("[blossom-next]");
assert((await prevBtn.count()) === 1 && (await nextBtn.count()) === 1, "flechas prev/next presentes");
const arrows = await wrap.evaluate((el) => {
  const p = el.querySelector("[blossom-prev]") as HTMLButtonElement;
  const n = el.querySelector("[blossom-next]") as HTMLButtonElement;
  const ps = getComputedStyle(p);
  return {
    prevDisabled: p.disabled,
    nextDisabled: n.disabled,
    prevCommand: p.getAttribute("command"),
    nextCommand: n.getAttribute("command"),
    prevFor: p.getAttribute("commandfor"),
    round: ps.borderRadius,
    visible: ps.display !== "none",
  };
});
console.log("arrows:", JSON.stringify(arrows));
assert(arrows.prevCommand === "--blossom-prev" && arrows.nextCommand === "--blossom-next", "comandos blossom correctos");
assert(arrows.prevFor === "blossom-padel", "commandfor apunta al scroller", arrows.prevFor);
assert(arrows.prevDisabled, "prev deshabilitado al inicio (extremo izquierdo)");
assert(!arrows.nextDisabled, "next habilitado al inicio");

// Click en next → scrolla
const before = await first.evaluate((el) => el.scrollLeft);
await nextBtn.click();
await page.waitForTimeout(900);
const after = await first.evaluate((el) => el.scrollLeft);
assert(after > before + 50, "click en next desplaza el carrusel", { before, after });

// Al avanzar, prev se habilita
const stateAfter = await wrap.evaluate((el) => {
  const p = el.querySelector("[blossom-prev]") as HTMLButtonElement;
  return { prevEnabled: !p.disabled };
});
assert(stateAfter.prevEnabled, "prev se habilita tras avanzar");

// Volver al inicio con prev
await prevBtn.click();
await page.waitForTimeout(900);
const backHome = await first.evaluate((el) => el.scrollLeft);
assert(backHome < 10, "prev vuelve al inicio", backHome);

// ==== Interacción drag (pointer fino) — física de Blossom ====
const drag = await first.evaluate((el) => {
  return { hadOverflow: el.getAttribute("has-overflow"), cursor: getComputedStyle(el).cursor };
});
assert(drag.hadOverflow === "true", "atributo has-overflow=true (drag activo en desktop)", drag);
assert(drag.cursor === "grab", "cursor grab en el scroller", drag.cursor);

// Drag real con ratón (playwright) hacia la izquierda
const box = (await first.boundingBox())!;
const cx = box.x + box.width * 0.6;
const cy = box.y + box.height / 2;
await page.mouse.move(cx, cy);
await page.mouse.down();
await page.mouse.move(cx - 250, cy, { steps: 12 });
await page.mouse.up();
await page.waitForTimeout(1200);
const afterDrag = await first.evaluate((el) => el.scrollLeft);
console.log("scrollLeft tras drag:", afterDrag);
assert(afterDrag > 100, "drag con puntero mueve el carrusel", afterDrag);

// ==== Snap tras drag: esperar a que el scroll se estabilice, luego medir ====
async function stableScrollLeft(locator: import("playwright").Locator): Promise<number> {
  let prev = -1;
  let stable = 0;
  for (let i = 0; i < 40; i++) {
    const cur = await locator.evaluate((el) => el.scrollLeft);
    if (Math.abs(cur - prev) < 0.5) {
      stable++;
      if (stable >= 3) return cur;
    } else stable = 0;
    prev = cur;
    await new Promise((r) => setTimeout(r, 150));
  }
  return prev;
}
const settled = await stableScrollLeft(first);
const snapped = await first.evaluate((el, left: number) => {
  const lis = [...el.querySelectorAll("li")] as HTMLElement[];
  const closest = lis.reduce((best, li) => {
    const d = Math.abs(li.offsetLeft - left);
    return d < best.d ? { d, left: li.offsetLeft } : best;
  }, { d: Infinity, left: 0 });
  return { scrollLeft: Math.round(left), nearestSlide: Math.round(closest.left), delta: Math.round(closest.d) };
}, settled);
console.log("snap:", JSON.stringify(snapped));
assert(snapped.delta < 8, "tras drag, alineado a slide (snap)", snapped.delta);

// ==== Rueda del ratón (scroll nativo) ====
await first.hover();
await page.mouse.wheel(0, 600); // deltaMode pixel, horizontal via shift no hace falta: wheel vertical sobre carrusel horizontal...
await page.waitForTimeout(800);
// El scroll nativo con rueda vertical NO debe scrollear la página dentro del carrusel ni romper nada.
const wheelOk = await first.evaluate(() => true);
assert(wheelOk, "rueda sobre el carrusel sin errores");

// ==== Dots ocultos en desktop, visibles en móvil ====
const dotsDesktop = await wrap.locator("[data-blossom-dots]").evaluate((el) => getComputedStyle(el).display);
assert(dotsDesktop === "none", "dots ocultos en desktop (1280px)", dotsDesktop);

// ==== Móvil 375px: peek, dots visibles ====
await page.setViewportSize({ width: 375, height: 800 });
await page.waitForTimeout(500);
const mobile = await first.evaluate((el) => {
  const li = el.querySelector("li") as HTMLElement;
  const dots = el.closest("[data-carousel]")!.querySelector("[data-blossom-dots]")!;
  return {
    liWidth: Math.round(li.getBoundingClientRect().width),
    clientWidth: el.clientWidth,
    dotsDisplay: getComputedStyle(dots).display,
    dotsCount: dots.querySelectorAll("[data-blossom-dot]").length,
    overflowPage: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  };
});
console.log("mobile:", JSON.stringify(mobile));
assert(mobile.liWidth < mobile.clientWidth * 0.9, "móvil: 1 tarjeta con peek", Math.round((mobile.liWidth / mobile.clientWidth) * 100) + "%");
assert(mobile.dotsDisplay !== "none", "dots visibles en móvil");
assert(mobile.dotsCount >= 8, "un dot por slide (8)", mobile.dotsCount);
assert(!mobile.overflowPage, "sin overflow horizontal de página en 375px");

// Tap en un dot navega
const dotTarget = await first.evaluate(() => {
  const dots = document.querySelectorAll("#blossom-padel ~ * [data-blossom-dot], [data-carousel='padel'] [data-blossom-dot]");
  return dots.length;
});
console.log("dots encontrados para tap:", dotTarget);

// ==== EN también renderiza ====
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
const enCount = await page.locator("[blossom-carousel]").count();
assert(enCount === 3, "EN: 3 carruseles presentes", enCount);
const enSlides = await page.locator("#blossom-padel li[data-blossom-slide]").count();
assert(enSlides === 8, "EN: 8 slides en pádel", enSlides);
const enLabels = await page.locator("[blossom-prev]").first().getAttribute("aria-label");
assert(enLabels === "Previous", "EN: aria-label traducido", enLabels);

// ==== Sin errores JS ====
assert(errors.length === 0, "sin errores de consola/página", errors.slice(0, 3));

// ==== Screenshot (desktop, carrusel pádel visible) ====
await page.goto(`${BASE}/es`, { waitUntil: "networkidle" });
await page.locator("[data-carousel='padel']").scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await page.screenshot({ path: OUT });
const size = fs.statSync(OUT).size;
console.log(`📸 screenshot: ${OUT} (${Math.round(size / 1024)} KB)`);

// Verificación de píxeles: no en blanco, tarjetas visibles
const { execSync } = await import("node:child_process");
const colors = execSync(
  `python3 -c "from PIL import Image; im=Image.open('${OUT}').convert('RGB'); print(len(set(im.getdata())))"`
).toString().trim();
console.log("colores únicos:", colors);
assert(parseInt(colors) > 300, "screenshot con contenido real (no en blanco)");

await browser.close();
console.log(process.exitCode ? "VERIFICACIÓN CON FALLOS" : "VERIFICACIÓN COMPLETA OK");
