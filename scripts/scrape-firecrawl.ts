/**
 * Scraper de precios reales en tiendas distintas de Amazon, vía la API de
 * Firecrawl. Automatiza lo que hasta ahora se hacía a mano desde el MCP.
 *
 *   FIRECRAWL_API_KEY=fc-... npx tsx scripts/scrape-firecrawl.ts
 *
 * Opciones:
 *   --store=padelnuestro   solo esa tienda (por defecto, todas)
 *   --only=id1,id2         solo esos productos
 *   --refresh              revisita los que ya tienen precio guardado
 *   --dry-run              no escribe el JSON, solo enseña lo que haría
 *
 * Output: src/data/real-offers-stores.json
 *
 * El procedimiento y las trampas de cada tienda están en docs/SCRAPING.md.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const API = "https://api.firecrawl.dev/v2";

/** Peticiones por minuto que admite el plan. */
const RATE_LIMIT_PER_MIN = 11;

interface ProductRef {
  id: string;
  sport: string;
  brand: string;
  model: string;
  year: number;
}

interface StoreOffer {
  storeId: string;
  title: string;
  price: number;
  /** PVP tachado en la tienda, si lo publica. Informativo. */
  listPrice?: number;
  url: string;
  inStock: boolean;
  scrapedAt: string;
}

interface Target {
  storeId: string;
  /** Home desde la que se mapea. */
  site: string;
  /** Deporte que vende. Padel Nuestro no tiene raquetas de tenis. */
  sport: "padel" | "tenis";
  /**
   * Fragmentos que descartan una URL de ficha: carritos, comparadores, fichas
   * de segunda mano o de prueba, que tienen otro precio y no son el producto.
   */
  excluye?: string[];
}

// Ojo: nunca se usa el buscador interno de la tienda. El `catalogsearch` de
// Padel Nuestro responde 200 y devuelve la portada, así que te quedas con los
// destacados creyendo que son resultados. `map` con `search` va al sitemap.
const TARGETS: Target[] = [
  {
    storeId: "padelnuestro",
    site: "https://www.padelnuestro.com",
    sport: "padel",
    // El prefijo /int/ es la web internacional: otros precios y, a veces, otro
    // slug. Nos quedamos siempre con la española.
    excluye: ["/int/", "/blog/", "/outlet"],
  },
  {
    storeId: "tennispro",
    site: "https://www.tennispro.es",
    sport: "tenis",
    excluye: ["-test-", "usada", "/outlet", "pack-de-2", "raquetas-test"],
  },
];

function arg(nombre: string): string | undefined {
  const found = process.argv.find((a) => a.startsWith(`--${nombre}=`));
  return found?.split("=")[1];
}
const FLAG_REFRESH = process.argv.includes("--refresh");
const FLAG_DRY = process.argv.includes("--dry-run");

function loadProducts(): ProductRef[] {
  const content = readFileSync(join(__dirname, "../src/data/products.ts"), "utf-8");
  const products: ProductRef[] = [];
  const re =
    /id:\s*"([^"]+)".*?sport:\s*"([^"]+)".*?brand:\s*"([^"]+)".*?model:\s*"([^"]+)".*?year:\s*(\d+)/gs;
  let m;
  while ((m = re.exec(content)) !== null) {
    products.push({ id: m[1], sport: m[2], brand: m[3], model: m[4], year: parseInt(m[5]) });
  }
  return products;
}

/** Quita el "by Jugador" del final, que ninguna tienda pone igual. */
function limpiaModelo(model: string): string {
  return model.replace(/by\s+[^,]+$/i, "").replace(/\s+/g, " ").trim();
}

function buildQuery(p: ProductRef): string {
  return `${p.brand} ${limpiaModelo(p.model)} ${p.year}`;
}

/**
 * Mismo criterio que el scraper de Amazon: la marca es obligatoria y el modelo
 * tiene que casar de sobra. El año baja el listón pero nunca lo sustituye —
 * si bastara con marca + año, cualquier pala de esa temporada valdría.
 *
 * Los tokens de dos letras cuentan: en "RX Carbon" el "rx" es lo único que
 * distingue el modelo del resto de la gama.
 */
function isMatch(title: string, p: ProductRef): boolean {
  const t = title.toLowerCase();
  const brand = p.brand.toLowerCase();
  const brandOk = t.includes(brand) || t.includes(brand.replace(/\s+/g, ""));
  const kws = limpiaModelo(p.model)
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !["the", "pro", "by", "de"].includes(w));
  const hits = kws.filter((k) => t.includes(k)).length;
  const score = kws.length > 0 ? hits / kws.length : 0;
  const yearOk = t.includes(String(p.year)) || t.includes(String(p.year + 1));
  return brandOk && score >= (yearOk ? 0.5 : 0.7);
}

// --- Rate limit -------------------------------------------------------------

const ventana: number[] = [];

/** Espera lo justo para no pasar de RATE_LIMIT_PER_MIN peticiones por minuto. */
async function esperaHueco(): Promise<void> {
  const ahora = Date.now();
  while (ventana.length > 0 && ahora - ventana[0] > 60_000) ventana.shift();
  if (ventana.length >= RATE_LIMIT_PER_MIN) {
    const espera = 60_000 - (ahora - ventana[0]) + 250;
    console.log(`  ⏳ límite de ${RATE_LIMIT_PER_MIN}/min, esperando ${Math.ceil(espera / 1000)} s`);
    await new Promise((r) => setTimeout(r, espera));
    return esperaHueco();
  }
  ventana.push(Date.now());
}

async function firecrawl<T>(ruta: string, body: unknown): Promise<T> {
  await esperaHueco();
  const res = await fetch(`${API}${ruta}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status === 429) {
    // El plan puede tener otro límite del que creemos: respetar su Retry-After.
    const espera = (parseInt(res.headers.get("retry-after") ?? "30") || 30) * 1000;
    console.log(`  ⏳ 429, reintentando en ${espera / 1000} s`);
    await new Promise((r) => setTimeout(r, espera));
    return firecrawl<T>(ruta, body);
  }
  if (!res.ok) throw new Error(`${ruta} → HTTP ${res.status}`);
  return (await res.json()) as T;
}

interface MapResponse {
  success: boolean;
  links?: { url: string; title?: string; description?: string }[];
}

interface ScrapeResponse {
  success: boolean;
  data?: {
    markdown?: string;
    metadata?: Record<string, string | string[] | number | undefined>;
  };
}

// --- Extracción -------------------------------------------------------------

function meta(md: ScrapeResponse["data"], clave: string): string | undefined {
  const v = md?.metadata?.[clave];
  return Array.isArray(v) ? v[0] : typeof v === "number" ? String(v) : v;
}

function aNumero(raw: string | undefined): number | null {
  if (!raw) return null;
  // "1.234,56 €" y "1,234.56" conviven según la tienda: el último separador
  // manda como decimal.
  const limpio = raw.replace(/[^\d.,]/g, "");
  if (!limpio) return null;
  const ultimaComa = limpio.lastIndexOf(",");
  const ultimoPunto = limpio.lastIndexOf(".");
  let normal = limpio;
  if (ultimaComa > ultimoPunto) normal = limpio.replace(/\./g, "").replace(",", ".");
  else if (ultimoPunto > ultimaComa) normal = limpio.replace(/,/g, "");
  const n = parseFloat(normal);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * En las tiendas Magento el precio ya viene en la metadata Open Graph, así que
 * basta `markdown` (1 crédito) en vez de extracción con schema (5).
 */
function extraePrecio(data: ScrapeResponse["data"]): number | null {
  for (const clave of ["product:price:amount", "og:price:amount", "og:product:price:amount"]) {
    const n = aNumero(meta(data, clave));
    if (n) return n;
  }
  // Fallback: el primer importe en euros del markdown.
  const m = data?.markdown?.match(/(\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})?)\s*€/);
  return aNumero(m?.[1]);
}

/** PVP tachado, que en markdown llega como ~~230,00€~~. */
function extraeListPrice(markdown: string | undefined): number | undefined {
  const m = markdown?.match(/~~\s*([\d.,]+)\s*€\s*~~/);
  return aNumero(m?.[1]) ?? undefined;
}

/**
 * El stock se lee del markdown: el botón lo dice todo. "Notifícame" es la
 * variante de Padel Nuestro cuando la pala está agotada.
 */
function extraeStock(markdown: string | undefined): boolean {
  const t = (markdown ?? "").toLowerCase();
  const agotado = ["notifícame", "notificame", "avísame", "avisame", "agotado", "sin stock", "no disponible"];
  if (agotado.some((s) => t.includes(s))) return false;
  const disponible = ["añadir al carrito", "añadir a la cesta", "add to cart", "hay existencias", "en stock"];
  return disponible.some((s) => t.includes(s));
}

// --- Main -------------------------------------------------------------------

async function main() {
  if (!process.env.FIRECRAWL_API_KEY) {
    console.error("Falta FIRECRAWL_API_KEY. Sácala de https://firecrawl.dev/app/api-keys");
    process.exit(1);
  }

  const soloTienda = arg("store");
  const soloIds = arg("only")?.split(",").map((s) => s.trim());
  const targets = TARGETS.filter((t) => !soloTienda || t.storeId === soloTienda);
  if (targets.length === 0) {
    console.error(`No hay ninguna tienda con id "${soloTienda}". Conocidas: ${TARGETS.map((t) => t.storeId).join(", ")}`);
    process.exit(1);
  }

  const products = loadProducts();
  const outputPath = join(__dirname, "../src/data/real-offers-stores.json");
  const cached: Record<string, StoreOffer[]> = existsSync(outputPath)
    ? JSON.parse(readFileSync(outputPath, "utf-8"))
    : {};

  // Poda las entradas cuyo producto ya no existe: al pasar un modelo a la
  // temporada siguiente cambia su id y el precio viejo queda huérfano. Nunca se
  // reasigna a mano al id nuevo — son productos distintos.
  const vivos = new Set(products.map((p) => p.id));
  const resultados: Record<string, StoreOffer[]> = {};
  const huerfanos: string[] = [];
  for (const [id, ofertas] of Object.entries(cached)) {
    if (vivos.has(id)) resultados[id] = ofertas;
    else huerfanos.push(id);
  }
  if (huerfanos.length > 0) {
    console.log(`🧹 ${huerfanos.length} huérfanas podadas: ${huerfanos.join(", ")}\n`);
  }

  const guarda = () => {
    if (!FLAG_DRY) writeFileSync(outputPath, JSON.stringify(resultados, null, 2) + "\n");
  };

  let encontrados = 0;
  let fallidos = 0;

  for (const target of targets) {
    const candidatos = products.filter(
      (p) => p.sport === target.sport && (!soloIds || soloIds.includes(p.id))
    );
    console.log(`\n🏪 ${target.storeId}: ${candidatos.length} productos de ${target.sport}\n`);

    for (const p of candidatos) {
      const yaTiene = resultados[p.id]?.some((o) => o.storeId === target.storeId);
      if (yaTiene && !FLAG_REFRESH) {
        console.log(`  ⏭️  ${p.id} (ya guardado)`);
        encontrados++;
        continue;
      }

      try {
        const mapa = await firecrawl<MapResponse>("/map", {
          url: target.site,
          search: buildQuery(p),
          limit: 20,
        });

        const ficha = (mapa.links ?? []).find((l) => {
          if (!l.url.startsWith(target.site.replace("https://www.", "https://"))
              && !l.url.startsWith(target.site)) return false;
          if (target.excluye?.some((frag) => l.url.toLowerCase().includes(frag))) return false;
          // Sin título no se puede comprobar que sea el producto: descartar
          // antes que arriesgarse a publicar el precio de otro modelo.
          return l.title ? isMatch(l.title, p) : false;
        });

        if (!ficha) {
          console.log(`  ❌ ${p.id}: sin ficha que case (${mapa.links?.length ?? 0} urls)`);
          fallidos++;
          continue;
        }

        const scrape = await firecrawl<ScrapeResponse>("/scrape", {
          url: ficha.url,
          formats: ["markdown"],
          onlyMainContent: true,
        });

        // La URL que devuelve el scrape es la final tras redirecciones. Si la
        // tienda te ha mandado a la portada, el título deja de casar.
        const titulo = meta(scrape.data, "title") ?? ficha.title ?? "";
        const urlFinal = meta(scrape.data, "url") ?? ficha.url;
        if (!isMatch(titulo, p)) {
          console.log(`  ⚠️  ${p.id}: la ficha redirige a otra página ("${titulo.slice(0, 50)}")`);
          fallidos++;
          continue;
        }

        const price = extraePrecio(scrape.data);
        if (!price) {
          console.log(`  ❌ ${p.id}: ficha sin precio legible → ${urlFinal}`);
          fallidos++;
          continue;
        }

        const oferta: StoreOffer = {
          storeId: target.storeId,
          title: titulo.trim(),
          price,
          listPrice: extraeListPrice(scrape.data?.markdown),
          url: urlFinal,
          inStock: extraeStock(scrape.data?.markdown),
          scrapedAt: new Date().toISOString(),
        };
        if (oferta.listPrice === undefined) delete oferta.listPrice;

        const previas = (resultados[p.id] ??= []).filter((o) => o.storeId !== target.storeId);
        previas.push(oferta);
        resultados[p.id] = previas;
        guarda();

        console.log(`  ✅ ${p.id}: ${price} €${oferta.inStock ? "" : " (agotado)"} → ${urlFinal}`);
        encontrados++;
      } catch (err) {
        console.log(`  ⚠️  ${p.id}: ${(err as Error).message.slice(0, 80)}`);
        fallidos++;
      }
    }
  }

  guarda();
  console.log(`\n📊 ${encontrados} con precio, ${fallidos} sin él`);
  console.log(FLAG_DRY ? "🔍 --dry-run: no se ha escrito nada" : "💾 src/data/real-offers-stores.json");
}

// Se exportan las funciones puras para poder probarlas sin gastar créditos.
export { aNumero, extraePrecio, extraeListPrice, extraeStock, isMatch, loadProducts };

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
