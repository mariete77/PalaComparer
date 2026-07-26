// Genera todos los derivados del logo a partir de assets/logo-master.png.
//
//   npm run gen:logo
//
// El máster vive fuera de public/ a propósito: pesa 2,24 MB y no debe servirse.
// Lo que se sirve son los derivados que emite este script.
//
// El original es un lockup cuadrado (icono + marca denominativa) sobre fondo
// blanco plano y sin canal alfa. Este script:
//   1. Recorta el fondo a transparente con un relleno por inundación desde los
//      bordes, para no agujerear las zonas blancas del interior del dibujo.
//   2. Separa el icono de la marca denominativa buscando la banda horizontal
//      vacía que hay entre los dos.
//   3. Emite cada tamaño en su sitio.
//
// Salidas:
//   public/logo-mark.png          icono con alfa, para la cabecera
//   public/logo-full.png          lockup completo con alfa
//   src/app/icon.png              favicon (lo enlaza Next automáticamente)
//   src/app/apple-icon.png        icono de iOS, sobre fondo opaco
//   src/app/opengraph-image.png   tarjeta 1200x630 para compartir enlaces

import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// sharp usa `export =`, así que su namespace no es accesible desde el import
// por defecto: el tipo se deriva del propio valor.
type SharpImage = ReturnType<typeof sharp>;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "assets", "logo-master.png");
const PUBLIC = join(ROOT, "public");
const APP = join(ROOT, "src", "app");

/** Fondo de la marca (mismo valor que --background en globals.css). */
const BRAND_DARK = { r: 10, g: 15, b: 28 };

/**
 * El logo es azul marino (#002040) sobre blanco. Ese azul tiene 1,17:1 de
 * contraste contra el fondo oscuro del sitio: puesto directamente encima,
 * desaparece. Por eso todas las superficies opacas (favicon, icono de iOS,
 * tarjeta de Open Graph) lo montan sobre un panel claro, que es el contexto
 * para el que está diseñado. Dentro de la UI oscura se usa en cambio la
 * variante recoloreada de `forDarkSurface`, sin contenedor.
 */
const PANEL_LIGHT = { r: 255, g: 255, b: 255 };

/** Distancia máxima al blanco para considerar un píxel "fondo". */
const WHITE_TOLERANCE = 34;

/** Color de texto del sitio (--foreground en globals.css). */
const INK_LIGHT: [number, number, number] = [0xe6, 0xed, 0xf7];

function isNearWhite(r: number, g: number, b: number): boolean {
  return (
    255 - r < WHITE_TOLERANCE &&
    255 - g < WHITE_TOLERANCE &&
    255 - b < WHITE_TOLERANCE
  );
}

/** El verde de marca se reconoce por dominancia del canal G. */
function isBrandGreen(r: number, g: number, b: number): boolean {
  return g > r + 40 && g > b + 40;
}

/**
 * Variante para fondos oscuros.
 *
 * El azul marino del original (#002040) sobre --background (#0a0f1c) da 1.17:1
 * de contraste: la pala, la balanza y "Comparer" son invisibles. Aquí ese azul
 * pasa al color de texto del sitio. El verde se deja intacto — ya da ~10:1.
 *
 * Los blancos interiores (los puntos de la pala) pasan a transparentes: si se
 * dejaran opacos quedarían blancos sobre una pala ya clara, y desaparecerían
 * igual. Como agujeros dejan ver el fondo y la pala se lee.
 */
async function forDarkSurface(png: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels: C } = info;

  for (let i = 0; i < data.length; i += C) {
    if (data[i + 3] === 0) continue;
    if (isBrandGreen(data[i], data[i + 1], data[i + 2])) continue;
    if (isNearWhite(data[i], data[i + 1], data[i + 2])) {
      data[i + 3] = 0;
      continue;
    }
    [data[i], data[i + 1], data[i + 2]] = INK_LIGHT;
  }

  return sharp(data, { raw: { width, height, channels: C as 4 } })
    .png()
    .toBuffer();
}

/**
 * Marca como transparente todo el fondo conectado con el borde de la imagen.
 * Un umbral global convertiría también en transparentes los blancos internos
 * (los platillos de la balanza, los puntos de la pala), por eso va por
 * inundación en lugar de por color suelto.
 */
async function cutBackground(input: string): Promise<SharpImage> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: W, height: H, channels: C } = info;
  const isBackground = new Uint8Array(W * H);

  const nearWhite = (i: number) => {
    const o = i * C;
    return (
      255 - data[o] < WHITE_TOLERANCE &&
      255 - data[o + 1] < WHITE_TOLERANCE &&
      255 - data[o + 2] < WHITE_TOLERANCE
    );
  };

  // Inundación desde los cuatro bordes.
  const stack: number[] = [];
  const push = (i: number) => {
    if (!isBackground[i] && nearWhite(i)) {
      isBackground[i] = 1;
      stack.push(i);
    }
  };

  for (let x = 0; x < W; x++) {
    push(x);
    push((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    push(y * W);
    push(y * W + W - 1);
  }

  while (stack.length > 0) {
    const i = stack.pop()!;
    const x = i % W;
    const y = (i / W) | 0;
    if (x > 0) push(i - 1);
    if (x < W - 1) push(i + 1);
    if (y > 0) push(i - W);
    if (y < H - 1) push(i + W);
  }

  let cut = 0;
  for (let i = 0; i < W * H; i++) {
    if (isBackground[i]) {
      data[i * C + 3] = 0;
      cut++;
    }
  }

  console.log(
    `  fondo recortado: ${((cut / (W * H)) * 100).toFixed(1)}% de los píxeles`
  );

  return sharp(data, { raw: { width: W, height: H, channels: C as 4 } }).png();
}

/**
 * Encuentra la banda horizontal vacía que separa el icono de la marca
 * denominativa, y devuelve la altura a la que hay que cortar.
 */
async function findWordmarkSplit(image: SharpImage): Promise<number | null> {
  const { data, info } = await image
    .clone()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const opaquePerRow = new Int32Array(H);
  for (let y = 0; y < H; y++) {
    let n = 0;
    for (let x = 0; x < W; x++) if (data[(y * W + x) * C + 3] > 16) n++;
    opaquePerRow[y] = n;
  }

  // Una fila no llega a cero limpio: el antialiasing deja píxeles sueltos.
  const isEmpty = (y: number) => opaquePerRow[y] < W * 0.005;
  const MIN_GAP = Math.max(4, Math.floor(H * 0.008));

  // Se recogen los huecos de la mitad inferior, que es donde va el texto.
  const gaps: { start: number; end: number }[] = [];
  let runStart = -1;

  for (let y = Math.floor(H * 0.45); y < H; y++) {
    if (isEmpty(y)) {
      if (runStart === -1) runStart = y;
    } else if (runStart !== -1) {
      if (y - runStart >= MIN_GAP) gaps.push({ start: runStart, end: y });
      runStart = -1;
    }
  }

  // La marca denominativa es el último bloque de contenido, así que la
  // separación buena es el hueco más bajo que todavía tenga algo debajo.
  for (let i = gaps.length - 1; i >= 0; i--) {
    const { start, end } = gaps[i];
    let below = 0;
    for (let y = end; y < H; y++) if (!isEmpty(y)) below++;
    if (below < H * 0.03) continue; // debajo solo hay ruido

    const split = start + Math.floor((end - start) / 2);
    console.log(
      `  separación icono/texto en y=${split} (hueco de ${end - start}px, ${below}px de texto debajo)`
    );
    return split;
  }

  console.log("  no se encontró separación icono/texto — se usa el lockup entero");
  return null;
}

async function main() {
  console.log(`Leyendo ${SOURCE}`);
  const cut = await cutBackground(SOURCE);

  // El lockup completo, ya sin márgenes blancos.
  const fullBuffer = await cut.clone().trim().png().toBuffer();
  const full = sharp(fullBuffer);
  const fullMeta = await full.metadata();
  console.log(`  lockup recortado: ${fullMeta.width}x${fullMeta.height}`);

  const split = await findWordmarkSplit(full);

  // El icono solo, para cabecera y favicon: a 32px la marca denominativa es
  // ilegible, así que ahí interesa únicamente el símbolo.
  const markBuffer =
    split !== null
      ? await sharp(fullBuffer)
          .extract({ left: 0, top: 0, width: fullMeta.width!, height: split })
          .trim()
          .png()
          .toBuffer()
      : fullBuffer;

  const markMeta = await sharp(markBuffer).metadata();
  console.log(`  icono: ${markMeta.width}x${markMeta.height}`);

  mkdirSync(PUBLIC, { recursive: true });
  mkdirSync(APP, { recursive: true });

  // Estos dos van siempre sobre la UI oscura, así que llevan la variante clara.
  const markDark = await forDarkSurface(markBuffer);
  const fullDark = await forDarkSurface(fullBuffer);

  // --- Cabecera -----------------------------------------------------------
  await sharp(markDark)
    .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(PUBLIC, "logo-mark.png"));

  await sharp(fullDark)
    .resize(1024, 1024, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(PUBLIC, "logo-full.png"));

  // --- Favicon ------------------------------------------------------------
  // Sobre blanco: así se lee tanto en una pestaña clara como en una oscura.
  const onLightSquare = async (size: number, inset: number) =>
    sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { ...PANEL_LIGHT, alpha: 1 },
      },
    })
      .composite([
        {
          input: await sharp(markBuffer)
            .resize(size - inset * 2, size - inset * 2, {
              fit: "contain",
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png()
            .toBuffer(),
          gravity: "center",
        },
      ])
      .png({ compressionLevel: 9 });

  await (await onLightSquare(512, 24)).toFile(join(APP, "icon.png"));

  // iOS ignora la transparencia y compone sobre blanco por su cuenta, así que
  // se le da ya el fondo resuelto y con margen para el recorte redondeado.
  await (await onLightSquare(180, 14)).toFile(join(APP, "apple-icon.png"));

  // --- Open Graph ---------------------------------------------------------
  const OG_W = 1200;
  const OG_H = 630;
  const PANEL_W = 660;
  const PANEL_H = 470;

  const panel = Buffer.from(
    `<svg width="${PANEL_W}" height="${PANEL_H}" xmlns="http://www.w3.org/2000/svg">
       <rect width="${PANEL_W}" height="${PANEL_H}" rx="48" ry="48" fill="#ffffff"/>
     </svg>`
  );

  await sharp({
    create: {
      width: OG_W,
      height: OG_H,
      channels: 4,
      background: { ...BRAND_DARK, alpha: 1 },
    },
  })
    .composite([
      { input: await sharp(panel).png().toBuffer(), gravity: "center" },
      {
        input: await sharp(fullBuffer)
          .resize(PANEL_W - 120, PANEL_H - 90, {
            fit: "inside",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toBuffer(),
        gravity: "center",
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(join(APP, "opengraph-image.png"));

  console.log("\nGenerado:");
  console.log("  public/logo-mark.png");
  console.log("  public/logo-full.png");
  console.log("  src/app/icon.png");
  console.log("  src/app/apple-icon.png");
  console.log("  src/app/opengraph-image.png");
}

main();
