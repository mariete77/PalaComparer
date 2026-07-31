/**
 * Captura un snapshot de los precios actuales de todos los productos.
 * Lee los JSONs de ofertas reales (Amazon, Firecrawl, Decathlon) y genera:
 *   - src/data/price-history/YYYY-MM-DD.json  (snapshot individual)
 *   - src/data/price-history/compiled.json     (índice completo para offers.ts)
 *
 * NO re-scrapea las tiendas. Es un "fotografía" de los datos ya guardados.
 *
 *   npx tsx scripts/snapshot-prices.ts
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

interface ProductRef {
  id: string;
  price: number; // PVP
}

interface RealOffer {
  productId: string;
  price: number | null;
  url: string;
  inStock: boolean;
  scrapedAt: string;
}

interface RealStoreOffer {
  storeId: string;
  price: number;
  url: string;
  inStock: boolean;
  scrapedAt: string;
}

interface SnapshotProduct {
  bestPrice: number;
  bestStoreId: string;
  offers: { storeId: string; price: number; inStock: boolean }[];
}

interface Snapshot {
  date: string;
  scrapedAt: string;
  products: Record<string, SnapshotProduct>;
}

interface PricePoint {
  date: string;
  price: number;
}

function loadProducts(): ProductRef[] {
  const content = readFileSync(join(__dirname, "../src/data/products.ts"), "utf-8");
  const products: ProductRef[] = [];
  const re = /id:\s*"([^"]+)".*?price:\s*([\d.]+)/gs;
  let m;
  while ((m = re.exec(content)) !== null) {
    products.push({ id: m[1], price: parseFloat(m[2]) });
  }
  return products;
}

function loadJson<T>(path: string): T {
  if (!existsSync(path)) return {} as T;
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function main() {
  const products = loadProducts();
  const today = new Date().toISOString().slice(0, 10);

  // Cargar ofertas reales de las tres fuentes
  const amazonOffers = loadJson<Record<string, RealOffer>>(
    join(__dirname, "../src/data/real-offers.json")
  );
  const storeOffers = loadJson<Record<string, RealStoreOffer[]>>(
    join(__dirname, "../src/data/real-offers-stores.json")
  );
  const decathlonOffers = loadJson<Record<string, RealOffer>>(
    join(__dirname, "../src/data/real-offers-decathlon.json")
  );

  const snapshot: Snapshot = {
    date: today,
    scrapedAt: new Date().toISOString(),
    products: {},
  };

  for (const product of products) {
    const offers: { storeId: string; price: number; inStock: boolean }[] = [];

    // Amazon
    const amazon = amazonOffers[product.id];
    if (amazon?.price) {
      offers.push({ storeId: "amazon", price: amazon.price, inStock: amazon.inStock });
    }

    // Firecrawl stores
    for (const offer of storeOffers[product.id] ?? []) {
      offers.push({ storeId: offer.storeId, price: offer.price, inStock: offer.inStock });
    }

    // Decathlon
    const decathlon = decathlonOffers[product.id];
    if (decathlon?.price) {
      offers.push({ storeId: "decathlon", price: decathlon.price, inStock: decathlon.inStock });
    }

    if (offers.length === 0) continue;

    // Mejor precio: el más barato entre los que están en stock, o el más barato
    // si ninguno lo está.
    const inStock = offers.filter((o) => o.inStock);
    const pool = inStock.length > 0 ? inStock : offers;
    pool.sort((a, b) => a.price - b.price);

    snapshot.products[product.id] = {
      bestPrice: pool[0].price,
      bestStoreId: pool[0].storeId,
      offers,
    };
  }

  // Guardar snapshot individual
  const snapshotDir = join(__dirname, "../src/data/price-history");
  const snapshotPath = join(snapshotDir, `${today}.json`);
  writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`💾 ${snapshotPath}`);

  // Generar compiled.json: Record<productId, PricePoint[]>
  // Lee todos los snapshots existentes y compila el histórico
  const compiled: Record<string, PricePoint[]> = {};
  const files = readdirSync(snapshotDir)
    .filter((f) => f.endsWith(".json") && f !== "compiled.json" && f !== "index.json")
    .sort();

  for (const file of files) {
    const snap: Snapshot = JSON.parse(readFileSync(join(snapshotDir, file), "utf-8"));
    for (const [productId, data] of Object.entries(snap.products)) {
      if (!compiled[productId]) compiled[productId] = [];
      compiled[productId].push({ date: snap.date, price: data.bestPrice });
    }
  }

  const compiledPath = join(snapshotDir, "compiled.json");
  writeFileSync(compiledPath, JSON.stringify(compiled, null, 2) + "\n");
  console.log(`💾 ${compiledPath}`);

  // Guardar la fecha del último snapshot para que offers.ts la importe
  // estáticamente (sin necesidad de require("fs") en el navegador)
  const latestPath = join(snapshotDir, "latest-date.json");
  writeFileSync(latestPath, JSON.stringify({ date: today }) + "\n");
  console.log(`💾 ${latestPath}`);

  const productCount = Object.keys(snapshot.products).length;
  console.log(`\n📊 ${productCount} productos con precio en snapshot ${today}`);
  console.log(`📈 ${files.length} snapshots en el histórico`);
}

main();
