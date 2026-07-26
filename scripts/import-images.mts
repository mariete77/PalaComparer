// Descarga fotos reales de producto y actualiza el manifiesto.
//
//   npm run import:images            descarga lo que falte
//   npm run import:images -- --force vuelve a descargar todo
//
// Entrada:  scripts/image-sources.json  → { "<id-producto>": { url, credit?, source? } }
// Salida:   public/images/rackets/real/<id>.<ext>  +  src/data/real-images.json
//
// Solo debes añadir a image-sources.json URLs de imágenes que tengas derecho a
// usar (material de prensa de la marca, fotos propias, o assets con licencia).

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { PRODUCTS } from "../src/data/products";
import type { ImageLicence, RealImageEntry } from "../src/data/product-image";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = join(ROOT, "scripts", "image-sources.json");
const OUT_DIR = join(ROOT, "public", "images", "rackets", "real");
const MANIFEST = join(ROOT, "src", "data", "real-images.json");
const PUBLIC_PREFIX = "/images/rackets/real";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

interface SourceEntry {
  url: string;
  credit?: string;
  source?: string;
  /** Situación de derechos. Si no se indica, se registra como `pendiente`. */
  licence?: ImageLicence;
}

const force = process.argv.includes("--force");

function readSources(): Record<string, SourceEntry> {
  if (!existsSync(SOURCES)) {
    console.error(`No existe ${SOURCES}.`);
    console.error(`Crea el fichero con la forma: { "nox-x-one-2024": { "url": "https://..." } }`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(SOURCES, "utf8"));
}

/** Borra descargas previas del mismo producto (la extensión puede cambiar). */
function clearExisting(id: string) {
  if (!existsSync(OUT_DIR)) return;
  for (const file of readdirSync(OUT_DIR)) {
    if (file.replace(/\.[^.]+$/, "") === id) unlinkSync(join(OUT_DIR, file));
  }
}

function findExisting(id: string): string | null {
  if (!existsSync(OUT_DIR)) return null;
  const hit = readdirSync(OUT_DIR).find((f) => f.replace(/\.[^.]+$/, "") === id);
  return hit ? `${PUBLIC_PREFIX}/${hit}` : null;
}

async function download(id: string, entry: SourceEntry): Promise<RealImageEntry> {
  // Una URL absoluta de un CDN se referencia tal cual; recuerda añadir el
  // dominio a `images.remotePatterns` en next.config.ts.
  if (entry.url.startsWith("http") && entry.url.includes("#remote")) {
    return {
      src: entry.url.replace("#remote", ""),
      credit: entry.credit,
      source: entry.source,
      licence: entry.licence ?? "pendiente",
    };
  }

  const res = await fetch(entry.url, {
    headers: { "user-agent": "PalaComparer image importer" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  const type = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const ext = EXT_BY_TYPE[type];
  if (!ext) throw new Error(`content-type no soportado: ${type || "(vacío)"}`);

  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.byteLength < 1024) throw new Error(`respuesta demasiado pequeña (${bytes.byteLength} B)`);

  clearExisting(id);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, `${id}.${ext}`), bytes);

  return {
    src: `${PUBLIC_PREFIX}/${id}.${ext}`,
    credit: entry.credit,
    // Sin `source` explícito se guarda la URL de origen: es lo que permite
    // volver luego a pedir permiso o sustituir la imagen de forma selectiva.
    source: entry.source ?? entry.url,
    licence: entry.licence ?? "pendiente",
  };
}

async function main() {
  const sources = readSources();
  const known = new Set(PRODUCTS.map((p) => p.id));
  const images: Record<string, RealImageEntry> = {};

  let downloaded = 0;
  let reused = 0;
  const failures: string[] = [];

  let empty = 0;

  for (const [id, entry] of Object.entries(sources)) {
    if (id.startsWith("$")) continue; // claves de comentario

    // Huecos de la plantilla: todavía sin decidir de dónde sale la imagen.
    if (!entry?.url) {
      empty++;
      continue;
    }

    if (!known.has(id)) {
      failures.push(`${id}: no existe ningún producto con ese id`);
      continue;
    }

    if (!force) {
      const existing = findExisting(id);
      if (existing) {
        images[id] = {
          src: existing,
          credit: entry.credit,
          source: entry.source ?? entry.url,
          licence: entry.licence ?? "pendiente",
        };
        reused++;
        continue;
      }
    }

    try {
      images[id] = await download(id, entry);
      downloaded++;
      console.log(`✓ ${id}`);
    } catch (err) {
      failures.push(`${id}: ${err instanceof Error ? err.message : String(err)}`);
      console.error(`✗ ${id} — ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  writeFileSync(
    MANIFEST,
    `${JSON.stringify(
      {
        $comment:
          "Manifiesto de fotos reales. Lo escribe `npm run import:images` a partir de scripts/image-sources.json. Clave = id de producto.",
        images,
      },
      null,
      2
    )}\n`
  );

  const withPhoto = Object.keys(images).length;
  console.log(
    `\n${withPhoto}/${PRODUCTS.length} productos con foto real ` +
      `(${downloaded} descargadas, ${reused} ya estaban).`
  );

  if (empty > 0) {
    console.log(
      `${empty} sin url en la plantilla — se quedan con el SVG generado.`
    );
  }

  // Desglose por situación de derechos.
  const byLicence = new Map<ImageLicence, number>();
  for (const entry of Object.values(images)) {
    const licence = entry.licence ?? "pendiente";
    byLicence.set(licence, (byLicence.get(licence) ?? 0) + 1);
  }

  const LABEL: Record<ImageLicence, string> = {
    pendiente: "sin permiso todavía",
    prensa: "material de prensa",
    feed: "feed de afiliación",
    propia: "fotografía propia",
  };

  if (byLicence.size > 0) {
    console.log("\nDerechos:");
    for (const [licence, n] of [...byLicence].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(n).padStart(3)}  ${LABEL[licence]}`);
    }
  }

  const pending = byLicence.get("pendiente") ?? 0;
  if (pending > 0) {
    console.log(
      `\n${pending} imagen${pending === 1 ? "" : "es"} en uso sin permiso del titular.` +
        `\nCada entrada guarda su 'source', así que puedes reclamarlas o sustituirlas una a una.` +
        `\nAl conseguir permiso, marca esa entrada en scripts/image-sources.json con` +
        ` "licence": "prensa" (o "feed" / "propia").`
    );
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} fallos:`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
}

main();
