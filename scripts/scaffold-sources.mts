// Genera/actualiza scripts/image-sources.json con los 47 productos del
// catálogo, dejando el hueco de `url` para rellenar.
//
//   npm run images:scaffold
//
// Es idempotente: conserva todo lo que ya hayas rellenado (url, credit,
// source, licence) y solo añade las entradas que falten. Puedes ejecutarlo
// cada vez que metas productos nuevos en products.ts.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { PRODUCTS } from "../src/data/products";
import type { ImageLicence } from "../src/data/product-image";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = join(ROOT, "scripts", "image-sources.json");

interface SourceEntry {
  url: string;
  credit?: string;
  source?: string;
  licence?: ImageLicence;
}

const COMMENT =
  "Fotos reales por producto. Clave = id en src/data/products.ts. Rellena 'url' con una imagen que tengas derecho a usar y ejecuta `npm run import:images`. Las entradas con url vacía se ignoran. Regenera esta plantilla con `npm run images:scaffold`.";

const LICENCE_HELP =
  "El campo 'licence' registra la situación de derechos: 'pendiente' (por defecto: en uso pero sin permiso del titular), 'prensa' (material de prensa del fabricante), 'feed' (feed de afiliación) o 'propia'. El importador te resume cuántas quedan pendientes.";

function readExisting(): Record<string, SourceEntry> {
  if (!existsSync(SOURCES)) return {};
  const raw = JSON.parse(readFileSync(SOURCES, "utf8")) as Record<string, unknown>;
  const out: Record<string, SourceEntry> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith("$")) continue;
    if (value && typeof value === "object" && "url" in value) {
      out[key] = value as SourceEntry;
    }
  }
  return out;
}

function main() {
  const existing = readExisting();

  // Orden estable y legible: primero pádel, luego tenis; dentro, por marca.
  const ordered = [...PRODUCTS].sort(
    (a, b) =>
      a.sport.localeCompare(b.sport) ||
      a.brand.localeCompare(b.brand) ||
      a.model.localeCompare(b.model)
  );

  const entries: Record<string, SourceEntry> = {};
  let filled = 0;

  for (const product of ordered) {
    const prev = existing[product.id];
    if (prev?.url) {
      entries[product.id] = prev;
      filled++;
    } else {
      entries[product.id] = { url: "" };
    }
  }

  // No se pierde nada que hubiera a mano para ids ya inexistentes.
  const orphans = Object.keys(existing).filter(
    (id) => !PRODUCTS.some((p) => p.id === id)
  );

  writeFileSync(
    SOURCES,
    `${JSON.stringify(
      { $comment: COMMENT, $licence: LICENCE_HELP, ...entries },
      null,
      2
    )}\n`
  );

  console.log(
    `${PRODUCTS.length} productos en la plantilla — ${filled} con url, ${
      PRODUCTS.length - filled
    } por rellenar.`
  );

  if (orphans.length > 0) {
    console.warn(
      `\nDescartadas ${orphans.length} entradas de ids que ya no existen en products.ts:`
    );
    for (const id of orphans) console.warn(`  - ${id}`);
  }
}

main();
