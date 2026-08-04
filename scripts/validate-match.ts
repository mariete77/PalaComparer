/**
 * Guardia anti-ofertas-falsas.
 *
 * Recorre los JSONs de ofertas reales (Amazon, Decathlon, Firecrawl) y
 * rechaza cualquier entrada que el matcher común (lib/product-match.ts) no
 * considere el producto del catálogo. Sale con código 1 si encuentra algo
 * que no esté en la ALLOWLIST — el workflow semanal falla y no publica datos
 * sucios en vez de colar un enlace a un producto equivocado (Speed Jr. como
 * Speed MP, Indiga Girl como Indiga Power…).
 *
 *   npx tsx scripts/validate-match.ts
 */

import { isMatch, loadProducts } from "./lib/product-match";
import * as fs from "fs";

/**
 * Ofertas verificadas a mano que el matcher rechaza por límites conocidos
 * (título sin marca en Amazon, o token "w" = "woman" abreviado). NO añadir
 * aquí nada nuevo sin comprobar antes el enlace real.
 */
const ALLOWLIST = new Map<string, string>([
  ["bullpadel-vertex-04-comfort-2024", 'Amazon sin marca: "Vertex 04 Comfort" (verificado)'],
  ["bullpadel-flow-2024", 'Amazon sin marca: "Flow Woman"; Firecrawl usa "FLOW W 24" (misma pala)'],
  ["head-extreme-motion-2024", 'Amazon sin marca: "Extreme Motion" (verificado)'],
  ["babolat-technical-viper-2025", 'Amazon sin marca: "Technical Viper" (verificado)'],
  ["babolat-technical-veron-2025", 'Amazon sin marca: "Technical Veron" (verificado)'],
  ["babolat-counter-viper-2025", 'Amazon sin marca: "Counter Viper" (verificado)'],
  ["dunlop-aero-star-pro-2024", 'Amazon sin marca: "Aero-Star Pro" (verificado)'],
  ["dunlop-cx-200-2024", 'Amazon sin marca: "CX 200" (verificado)'],
]);

const products = loadProducts();
const byId = new Map(products.map((p) => [p.id, p]));

let bad = 0;
let allowed = 0;
for (const [file, kind] of [
  ["src/data/real-offers.json", "single"],
  ["src/data/real-offers-decathlon.json", "single"],
  ["src/data/real-offers-stores.json", "array"],
] as const) {
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  for (const [pid, entry] of Object.entries(data) as [string, any][]) {
    const p = byId.get(pid);
    if (!p) {
      console.log(`  ⚠️ HUÉRFANO (no está en products.ts): ${pid}`);
      bad++;
      continue;
    }
    const entries: { title: string }[] = kind === "array" ? entry : [entry];
    for (const off of entries) {
      if (!isMatch(off.title, p)) {
        const why = ALLOWLIST.get(pid);
        if (why) {
          allowed++;
          continue;
        }
        console.log(`  🔴 ${pid} → "${off.title}"`);
        bad++;
      }
    }
  }
}

if (allowed > 0) console.log(`\nℹ️  ${allowed} entradas permitidas (verificadas a mano, en ALLOWLIST)`);
if (bad > 0) {
  console.error(`\n❌ ${bad} ofertas sospechosas — revisar antes de publicar. Añadir a ALLOWLIST solo si se verifica el enlace.`);
  process.exit(1);
}
console.log("\n✅ Sin ofertas sospechosas — matcher común OK");
