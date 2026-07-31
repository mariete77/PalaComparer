/**
 * Busca imágenes de producto en tiendas online usando Firecrawl.
 * Rellena scripts/image-sources.json con las URLs de og:image encontradas.
 *
 *   FIRECRAWL_API_KEY=fc-... npx tsx scripts/scrape-images-firecrawl.ts
 *
 * Opciones:
 *   --dry-run    no escribe el JSON, solo enseña lo que haría
 *   --refresh    revisita productos que ya tienen URL en image-sources.json
 *   --only=id1,id2  solo esos productos
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const API = "https://api.firecrawl.dev/v2";
const RATE_LIMIT_PER_MIN = 11;

interface ProductRef {
  id: string;
  brand: string;
  model: string;
  year: number;
}

interface RealOffer {
  price: number | null;
  url: string;
  inStock: boolean;
}

interface RealStoreOffer {
  storeId: string;
  price: number;
  url: string;
  inStock: boolean;
}

interface ImageSource {
  url: string;
  credit?: string;
  source?: string;
  licence?: string;
}

interface ScrapeResponse {
  success: boolean;
  data?: {
    markdown?: string;
    metadata?: Record<string, string | string[] | number | undefined>;
  };
}

// --- Args ---

function arg(nombre: string): string | undefined {
  const found = process.argv.find((a) => a.startsWith(`--${nombre}=`));
  return found?.split("=")[1];
}
const FLAG_DRY = process.argv.includes("--dry-run");
const FLAG_REFRESH = process.argv.includes("--refresh");
const soloIds = arg("only")?.split(",").map((s) => s.trim());

// --- Rate limit ---

const ventana: number[] = [];

async function esperaHueco(): Promise<void> {
  const ahora = Date.now();
  while (ventana.length > 0 && ahora - ventana[0] > 60_000) ventana.shift();
  if (ventana.length >= RATE_LIMIT_PER_MIN) {
    const espera = 60_000 - (ahora - ventana[0]) + 250;
    console.log(`  ⏳ rate limit, esperando ${Math.ceil(espera / 1000)} s`);
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
    const espera = (parseInt(res.headers.get("retry-after") ?? "30") || 30) * 1000;
    console.log(`  ⏳ 429, reintentando en ${espera / 1000} s`);
    await new Promise((r) => setTimeout(r, espera));
    return firecrawl<T>(ruta, body);
  }
  if (!res.ok) throw new Error(`${ruta} → HTTP ${res.status}`);
  return (await res.json()) as T;
}

// --- Helpers ---

function meta(data: ScrapeResponse["data"], clave: string): string | undefined {
  const v = data?.metadata?.[clave];
  return Array.isArray(v) ? v[0] : typeof v === "number" ? String(v) : v;
}

/**
 * Extrae la URL de la imagen del producto de una página scrapeada.
 * Prioriza og:image, luego og:image:secure_url.
 */
function extraeImagen(data: ScrapeResponse["data"]): string | null {
  for (const clave of [
    "og:image",
    "og:image:secure_url",
    "twitter:image",
    "twitter:image:src",
  ]) {
    const v = meta(data, clave);
    if (v && v.startsWith("http")) return v;
  }
  // Fallback: buscar imagen grande en el markdown
  const md = data?.markdown ?? "";
  const imgMatch = md.match(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/);
  if (imgMatch) return imgMatch[1];
  return null;
}

function loadProducts(): ProductRef[] {
  const content = readFileSync(join(__dirname, "../src/data/products.ts"), "utf-8");
  const products: ProductRef[] = [];
  const re =
    /id:\s*"([^"]+)".*?brand:\s*"([^"]+)".*?model:\s*"([^"]+)".*?year:\s*(\d+)/gs;
  let m;
  while ((m = re.exec(content)) !== null) {
    products.push({ id: m[1], brand: m[2], model: m[3], year: parseInt(m[4]) });
  }
  return products;
}

/**
 * Busca la mejor URL de tienda para un producto.
 * Prioridad: PadelNuestro > Amazon > otras tiendas.
 */
function findStoreUrl(productId: string, storeOffers: Record<string, RealStoreOffer[]>, amazonOffers: Record<string, RealOffer>): string | null {
  // Prioridad: PadelNuestro (mejores fotos de pádel)
  const stores = storeOffers[productId] ?? [];
  const pn = stores.find((o) => o.storeId === "padelnuestro");
  if (pn?.url) return pn.url;

  // Amazon
  const amazon = amazonOffers[productId];
  if (amazon?.url) return amazon.url;

  // Cualquier otra tienda
  if (stores.length > 0 && stores[0].url) return stores[0].url;

  return null;
}

// --- Main ---

async function main() {
  if (!process.env.FIRECRAWL_API_KEY) {
    console.error("Falta FIRECRAWL_API_KEY. Sácala de https://firecrawl.dev/app/api-keys");
    process.exit(1);
  }

  const products = loadProducts();
  const sourcesPath = join(__dirname, "image-sources.json");
  const sources: Record<string, ImageSource> = JSON.parse(readFileSync(sourcesPath, "utf-8"));

  const storeOffers = JSON.parse(readFileSync(join(__dirname, "../src/data/real-offers-stores.json"), "utf-8")) as Record<string, RealStoreOffer[]>;
  const amazonOffers = JSON.parse(readFileSync(join(__dirname, "../src/data/real-offers.json"), "utf-8")) as Record<string, RealOffer>;

  let encontradas = 0;
  let fallidas = 0;
  let saltadas = 0;

  for (const product of products) {
    if (soloIds && !soloIds.includes(product.id)) continue;

    const existing = sources[product.id];
    if (existing?.url && !FLAG_REFRESH) {
      saltadas++;
      continue;
    }

    const storeUrl = findStoreUrl(product.id, storeOffers, amazonOffers);
    if (!storeUrl) {
      console.log(`  ⚠️  ${product.id}: sin URL de tienda`);
      fallidas++;
      continue;
    }

    try {
      const scrape = await firecrawl<ScrapeResponse>("/scrape", {
        url: storeUrl,
        formats: ["markdown"],
        onlyMainContent: true,
      });

      const imageUrl = extraeImagen(scrape.data);
      if (!imageUrl) {
        console.log(`  ❌ ${product.id}: sin imagen en ${storeUrl}`);
        fallidas++;
        continue;
      }

      // Determinar crédito y licencia según la tienda
      const storeId = storeOffers[product.id]?.[0]?.storeId ?? "unknown";
      const creditMap: Record<string, string> = {
        padelnuestro: "Padel Nuestro",
        amazon: "Amazon",
        padelpoint: "PadelPoint",
        time2padel: "Time2Pádel",
        streetpadel: "StreetPadel",
        tennispro: "Tennispro",
        decathlon: "Decathlon",
      };

      sources[product.id] = {
        url: imageUrl,
        credit: creditMap[storeId] ?? storeId,
        source: storeUrl,
        licence: "pendiente",
      };

      if (!FLAG_DRY) {
        writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
      }

      console.log(`  ✅ ${product.id}: ${imageUrl.slice(0, 80)}...`);
      encontradas++;
    } catch (err) {
      console.log(`  ⚠️  ${product.id}: ${(err as Error).message.slice(0, 80)}`);
      fallidas++;
    }
  }

  console.log(`\n📊 ${encontradas} encontradas, ${fallidas} fallidas, ${saltadas} ya tenían URL`);
  console.log(FLAG_DRY ? "🔍 --dry-run: no se ha escrito nada" : "💾 scripts/image-sources.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
