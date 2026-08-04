import { isMatch, loadProducts } from "./lib/product-match";
import * as fs from "fs";

const products = loadProducts();
const byId = new Map(products.map((p) => [p.id, p]));

let bad = 0;
for (const [file, kind] of [
  ["src/data/real-offers.json", "single"],
  ["src/data/real-offers-decathlon.json", "single"],
  ["src/data/real-offers-stores.json", "array"],
] as const) {
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  console.log(`\n=== ${file} ===`);
  for (const [pid, entry] of Object.entries(data) as [string, any][]) {
    const p = byId.get(pid);
    if (!p) {
      console.log(`  ⚠️ HUÉRFANO  ${pid}`);
      continue;
    }
    if (kind === "array") {
      for (const off of entry) {
        if (!isMatch(off.title, p)) {
          console.log(`  ❌ ${pid} → "${off.title}"`);
          bad++;
        }
      }
    } else {
      if (!isMatch(entry.title, p)) {
        console.log(`  ❌ ${pid} → "${entry.title}"`);
        bad++;
      }
    }
  }
}
console.log(`\nTOTAL rechazados por el matcher nuevo: ${bad}`);
