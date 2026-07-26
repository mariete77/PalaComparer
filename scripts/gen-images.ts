// Script: generate SVGs for all products into public/images/rackets/
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUT = join(__dirname, "../public/images/rackets");
mkdirSync(OUT, { recursive: true });

// Import after path setup
import { PRODUCTS } from "../src/data/products";
import { productSvg } from "../src/data/images";

for (const p of PRODUCTS) {
  const svg = productSvg(p);
  writeFileSync(join(OUT, `${p.id}.svg`), svg);
}
console.log(`Generated ${PRODUCTS.length} SVGs`);
