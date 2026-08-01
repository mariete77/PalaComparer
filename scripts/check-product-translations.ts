import { PRODUCTS } from "../src/data/products";
import { PRODUCT_DESCRIPTIONS_EN } from "../src/data/product-descriptions-en";

const missing = PRODUCTS.filter((product) => !product.descriptionEn && !PRODUCT_DESCRIPTIONS_EN[product.id]);

if (missing.length > 0) {
  console.error(`Faltan traducciones EN para ${missing.length} productos:`);
  for (const product of missing) console.error(`- ${product.id}`);
  process.exit(1);
}

console.log(`OK: ${PRODUCTS.length} productos tienen descripción en español e inglés.`);
