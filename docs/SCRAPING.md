# 🛠️ Scraping de precios — PalaComparer

Pipeline para obtener precios y URLs reales de tiendas de pádel/tenis.

## Uso rápido

```bash
# Actualizar precios de Amazon ES (todos los productos)
npx tsx scripts/scrape-amazon.ts

# Actualizar precios del resto de tiendas (Padel Nuestro, Tennispro)
FIRECRAWL_API_KEY=fc-... npm run scrape:firecrawl
```

El script de Amazon lee `src/data/products.ts`, busca cada producto en Amazon ES y guarda los resultados en `src/data/real-offers.json`.

## Cómo funciona

```
products.ts (48 productos)
        ↓
scripts/scrape-amazon.ts          scripts/scrape-firecrawl.ts
        ↓                                    ↓
Amazon ES (búsqueda Playwright)    Padel Nuestro, Tennispro (Firecrawl)
        ↓                                    ↓
real-offers.json                   real-offers-stores.json
        └──────────┬─────────────────────────┘
                   ↓
              offers.ts (integra datos reales en la web)
```

### 1. Productos (`src/data/products.ts`)

Define los 47 productos con `id`, `brand`, `model`, `year`, `sport`, etc.

### 2. Scraper (`scripts/scrape-amazon.ts`)

- **Motor:** Playwright con Chromium headless
- **Anti-detección:** user-agent realista, `navigator.webdriver` eliminado, delays de 5-8s entre peticiones
- **Matching:** fuzzy — compara marca, modelo y año con los resultados de Amazon
- **Guardado incremental:** cada resultado se escribe inmediatamente (si se corta, no pierde lo ya hecho)
- **Cache:** si un producto ya tiene precio en `real-offers.json`, se salta (forzar re-scrape borrando la entrada del JSON)
- **Poda de huérfanas:** al arrancar elimina las entradas cuyo `id` ya no existe en `products.ts`

> **Ojo al renombrar ids.** El JSON se indexa por `id` de producto, así que
> cambiar el id de un modelo (por ejemplo al pasarlo a la temporada siguiente)
> deja su precio huérfano y el producto nuevo sin precio real. La poda limpia lo
> primero; lo segundo se arregla volviendo a lanzar el scraper, que gracias a la
> cache solo buscará los que falten.
>
> Nunca reasignes a mano el precio del id viejo al nuevo: son productos
> distintos y estarías publicando un precio que no es el de ese modelo.

### 3. Datos (`src/data/real-offers.json`)

```json
{
  "bullpadel-vertex-04-2024": {
    "productId": "bullpadel-vertex-04-2024",
    "title": "Bullpadel Vertex 04",
    "price": 109.0,
    "url": "https://www.amazon.es/dp/B0CL6PJG3R",
    "asin": "B0CL6PJG3R",
    "inStock": true,
    "scrapedAt": "2026-07-26T17:00:00.000Z"
  }
}
```

### 4. Integración (`src/data/offers.ts`)

- Si existe un precio real en `real-offers.json` para Amazon → usa ese precio y URL
- El resto de tiendas usan `buildSearchUrl()` (búsqueda real, nunca 404)

## Precios de otras tiendas con Firecrawl (MCP)

Amazon no tiene todo el catálogo. Para los productos que se le resisten se usa el
servidor MCP de Firecrawl, que renderiza JavaScript y atraviesa las protecciones
que tumban a Playwright. El resultado se guarda en
`src/data/real-offers-stores.json`, indexado por `id` de producto con una lista
de ofertas (una por tienda):

```json
{
  "head-gravity-pro-2024": [
    {
      "storeId": "padelnuestro",
      "title": "HEAD GRAVITY PRO 2024",
      "price": 139.95,
      "listPrice": 239.95,
      "url": "https://www.padelnuestro.com/head-gravity-pro-2024-113828-p",
      "inStock": false,
      "scrapedAt": "2026-07-26T20:00:00.000Z"
    }
  ]
}
```

`offers.ts` lo consume igual que el de Amazon: si una tienda tiene precio real
para ese producto, no se le genera oferta sintética.

### Procedimiento

1. **`firecrawl_map` con `search`**, no el buscador interno de la tienda. El
   `catalogsearch` de Padel Nuestro redirige a la home y devuelve los productos
   destacados de portada; si te fías del `markdown` sin mirar el campo `url` de
   la metadata, acabas apuntando precios de otra pala. `map` devuelve URLs de
   ficha directamente.
2. **Quitar el prefijo de idioma** de la URL antes de scrapear:
   `/int/…` es la web internacional. La española va sin prefijo.
3. **`firecrawl_scrape` con `formats: ["markdown"]`** sobre la ficha. En las
   tiendas Magento (Padel Nuestro, PádelPoint) el precio viene ya en
   `metadata["product:price:amount"]`, así que **no hace falta `json`**: markdown
   cuesta 1 crédito y la extracción con schema cuesta 5.
4. **Stock:** mirar el markdown. Botón "Notifícame" = agotado; "Añadir al
   carrito" = disponible. La extracción por schema acierta, pero se paga.
5. Si la ficha no aparece en `map`, tirar de `firecrawl_scrape` con `json` sobre
   la **página de categoría** de la marca, que sí lista el producto con su URL.

### Ojo con las URLs de Padel Nuestro

La web tiene versión española (sin prefijo) e internacional (`/int/`), **y los
slugs no siempre coinciden**. Quitarle el `/int/` a una URL funciona en unos
casos (`/int/head-gravity-pro-2024-113828-p`) y da 404 en otros: la Babolat
Technical Viper es `/int/babolat-technical-viper-2025` fuera pero
`/pala-babolat-technical-viper-150175-100` en España, y la Nox X-One es
`/int/nox-x-one-26` fuera y `/pala-nox-x-one-pxone26` aquí.

`firecrawl_map` devuelve casi siempre la variante `/int/`, así que cuando el
slug español no responda, la vía rápida es un `firecrawl_scrape` con `json`
sobre la **categoría de la marca** (`/palas-padel/{marca}`, con `?p=2` si hace
falta) pidiendo nombre + precio + URL de los modelos que buscas: sale la URL
española correcta y de paso el precio.

### Verificar antes de guardar

Comprobar que el modelo **y el año** son los del catálogo. Un precio de otra
generación es un precio falso, igual que reasignar el de un id viejo:

- La Yonex VCore 98 de 2023 (7ª gen) es la **Scarlet**; la Ruby Red es la
  generación siguiente. Cuestan casi lo mismo, así que el precio no distingue.
- Padel Nuestro publica fichas sin año en el nombre (`Wilson Bela Pro V2`). Si la
  tienda no lo dice, confírmalo por el colorway o la descripción antes de darlo
  por bueno.

#### Por qué no vale recorrer la categoría de la marca

Hubo un `scripts/scrape-padelnuestro.ts` que sacaba los precios de las páginas
de categoría (`/palas-padel/{marca}`) y llegaba a 32 de 48 productos, bastante
más que los 19 de aquí. Se retiró: **17 de sus 27 entradas vivas apuntaban a
otro producto**, porque recorrer la categoría te da los modelos de la marca y
el emparejamiento acaba cayendo en el más parecido.

Muestra de lo que guardaba:

| id | precio que le asignaba | lo que era en realidad |
|---|---|---|
| `head-speed-mp-2024` (raqueta de tenis) | 119,95 € | "HEAD SPEED PRO X 2023", una pala de pádel |
| `wilson-blade-98-v9-2024` (tenis) | 189,95 € | "WILSON BLADE V4 PADEL" |
| `nox-at10-genius-12k-xtrem-2026` | 176,90 € | la AT10 Genius 18K de 2025 |
| `babolat-counter-viper-2025` y `babolat-technical-viper-2025` | 274,95 € | los dos, el mismo "VIPER JUAN LEBRON 3.0" |

La categoría de la marca sigue siendo útil para **encontrar la URL española**
de una ficha concreta (ver arriba), pero el precio se lee de la ficha y solo si
el título casa con el modelo. Cobertura menor y correcta antes que mayor e
inventada.

### El script (`scripts/scrape-firecrawl.ts`)

Automatiza el procedimiento de arriba contra la API REST de Firecrawl. Necesita
`FIRECRAWL_API_KEY` (la del MCP es OAuth y no sirve aquí; se saca en
<https://firecrawl.dev/app/api-keys>).

```bash
npm run scrape:firecrawl -- --store=tennispro   # solo una tienda
npm run scrape:firecrawl -- --only=head-bolt-2026,nox-x-one-2026
npm run scrape:firecrawl -- --refresh           # revisita los ya guardados
npm run scrape:firecrawl -- --dry-run           # sin escribir el JSON
```

Las tiendas se declaran en `TARGETS`, con el deporte que venden y los
fragmentos de URL que hay que descartar (`/int/`, `-test-`, `usada`, packs…).
Por cada producto hace `map` con `search` + `scrape` en markdown: dos créditos
por producto, no cinco.

Tres cosas que el script no se salta:

1. **El título tiene que casar** con marca y modelo (mismo criterio que el
   scraper de Amazon) tanto en el resultado de `map` como en la página ya
   descargada. Si la tienda redirige a la portada, el segundo control lo pilla.
2. **Sin precio legible no se guarda nada**, ni se inventa desde el listado.
3. **Poda las huérfanas** al arrancar, igual que el de Amazon.

Respeta un límite de 11 peticiones/minuto y obedece el `Retry-After` de los 429.
Las funciones de parseo se exportan para poder probarlas sin gastar créditos.

## Estado de las tiendas (comprobado el 26/07/2026)

Cada dominio y cada URL de búsqueda de `stores.ts` se probó con Firecrawl
buscando "Head Gravity Pro":

| Tienda | Estado |
|--------|--------|
| Padel Nuestro | ✅ dominio y fichas OK. Su buscador (`/catalogsearch/result/?q=`) responde 200 pero **devuelve la portada** a los scrapers, con proxy normal y con stealth. No se ha podido confirmar si le pasa lo mismo a un usuario real; los productos con precio real ya enlazan a su ficha y no pasan por el buscador |
| PádelPoint | ✅ `tiendapadelpoint.com` (OpenCart). Añadido como target de Firecrawl. Su buscador funciona y el HTML incluye `datalayerDataGMT` con precios estructurados |
| Time2Pádel | ⚠️ `.es` devuelve 421 (no está en el certificado). La buena es `time2padel.com`, PrestaShop. Devuelve 403 a fetch simple — Firecrawl puede atravesar el bloqueo con su renderizado JS. Si falla, documentar como pendiente |
| StreetPadel | ✅ `.es` redirige a `.com` (Shopify). Ruta de búsqueda `/search?q=`. Añadido como target de Firecrawl |
| Decathlon | ⚠️ el parámetro es `Ntt`, no `q`: con `?q=` te deja en la portada. Corregido |
| Tenis Boutique | ❌ `tenisboutique.es` no resuelve por DNS y `.com` está caído en Cloudflare. **Eliminada** |
| Zona de Tenis | ❌ `zonadetenis.com` y `.es` no resuelven por DNS. **Eliminada** |
| Amazon | ✅ sin cambios |

Padel Nuestro además ha dejado de anunciarse como tienda de tenis (solo pádel y
tenis playa), así que ya no aparece en el comparador de raquetas.

## Añadir nuevas tiendas

Para añadir otra tienda (ej. PadelNuestro, Decathlon):

1. **Crear el scraper** en `scripts/scrape-{tienda}.ts`:
   - Usar Playwright con la URL de búsqueda de la tienda
   - Extraer precio + URL del producto
   - Guardar en `src/data/real-offers-{tienda}.json`

2. **Integrar** en `src/data/offers.ts`:
   - Importar el nuevo JSON
   - Añadir lógica para priorizar datos reales sobre sintéticos

## Re-scraping semanal

Para forzar la actualización de TODOS los precios:

```bash
# Borrar el cache y re-scrapear todo
rm src/data/real-offers.json
npx tsx scripts/scrape-amazon.ts

# Resto de tiendas (--refresh revisita las que ya tienen precio)
FIRECRAWL_API_KEY=fc-... npm run scrape:firecrawl -- --refresh
```

Para actualizar solo un producto concreto, borrar su entrada del JSON y re-ejecutar el script.

## Histórico de precios (snapshots)

El gráfico de evolución de precio en la ficha de producto usa datos reales
de snapshots semanales, no datos sintéticos.

### Capturar un snapshot

```bash
npx tsx scripts/snapshot-prices.ts
```

Este script:
1. Lee los JSONs de ofertas reales (Amazon, Firecrawl, Decathlon)
2. Calcula el mejor precio de cada producto
3. Guarda `src/data/price-history/YYYY-MM-DD.json` (snapshot individual)
4. Regenera `src/data/price-history/compiled.json` (índice completo)

**NO re-scrapea** las tiendas. Es un "fotografía" de los precios ya guardados.
Ejecutar después de actualizar los precios con los scrapers.

### Flujo semanal recomendado

```bash
# 1. Actualizar precios de todas las tiendas
npx tsx scripts/scrape-amazon.ts
FIRECRAWL_API_KEY=fc-... npm run scrape:firecrawl -- --refresh
npx tsx scripts/scrape-decathlon.ts

# 2. Capturar snapshot
npx tsx scripts/snapshot-prices.ts

# 3. Verificar en local
npm run dev
```

### Formato del snapshot

Cada archivo `YYYY-MM-DD.json` contiene:
```json
{
  "date": "2026-07-28",
  "scrapedAt": "2026-07-28T18:00:00.000Z",
  "products": {
    "bullpadel-vertex-04-2024": {
      "bestPrice": 109.0,
      "bestStoreId": "amazon",
      "offers": [
        { "storeId": "amazon", "price": 109.0, "inStock": true },
        { "storeId": "padelnuestro", "price": 119.95, "inStock": true }
      ]
    }
  }
}
```

`compiled.json` es un `Record<productId, PricePoint[]>` que `offers.ts` importa
directamente para alimentar el gráfico.

## Troubleshooting

| Problema | Solución |
|----------|----------|
| `Timeout exceeded` | Amazon rate-limiting → el script ya tiene delays de 5-8s. Si persiste, aumentar delay |
| `CAPTCHA detectado` | Amazon detectó el bot → el script lo loguea y continúa. Esperar y reintentar |
| `no match (0 resultados)` | El producto no está en Amazon ES o el nombre no coincide |
| Precio 0 / sin precio | El producto existe pero sin precio visible (agotado o solo 3ª parte) |
| `no match (48 resultados)` | Muchos resultados pero ninguno coincide — revisar `buildSearchQuery()` |

## Resultados actuales

- ✅ **36 de 48 productos** con precio real de Amazon ES (las 5 que perdieron su
  id al corregir el año se podaron y hay que volver a scrapearlas)
- ✅ **19 de las 31 palas de pádel** con precio real de Padel Nuestro (Firecrawl)
- ✅ **4 de las 17 raquetas de tenis** con precio real de Tennispro

### El aviso de "esta pala no existe" hay que hacerle caso

La primera pasada dejó una lista de productos que ninguna tienda listaba. No era
un fallo del scraper: **el año del catálogo estaba mal en 6 de ellos**, y se
corrigieron pasando cada uno al modelo de la temporada actual (ver el commit
"Catálogo: corrige 7 palas que llevaban un año que no existía").

Lo que queda sin precio y por qué:

| Producto | Motivo |
|----------|--------|
| `yonex-vcore-98-2023` | En Amazon sin precio ni stock. La que venden las tiendas es la Blast Blue / Ruby Red, otra generación |
| `head-speed-mp-2024`, `head-boom-mp-2024` | Tennispro solo tiene la generación **2026** |
| `babolat-pure-strike-97-2024` | La suya es la **2025**, y con patrón 16x20 en vez de 16x19 |
| `wilson-pro-staff-97-v14-2023`, `wilson-clash-100-v2-2022`, `babolat-pure-aero-2023`, `tecnifibre-tfight-305-2023` | Fuera del catálogo actual de Tennispro |
| `babolat-technical-viper-2025`, `babolat-technical-veron-2025`, `babolat-counter-viper-2025` | La web española ya solo tiene la generación **3.0 / 2.6** (2026). Las 2025 siguen en `/int/`, pero es otra tienda y otra generación |

## Ideas futuras

- [x] Automatizar el flujo de Firecrawl en `scripts/scrape-firecrawl.ts` con
      `FIRECRAWL_API_KEY` — falta estrenarlo contra la API con una clave real
- [ ] Volver a scrapear Amazon para los 7 ids nuevos del catálogo 2026
- [x] Scraping de Decathlon ES (marketplace: ojo al vendedor y a la generación)
- [ ] Más tiendas de **tenis**: con Tennispro solo casan 4 de 17 raquetas. El
      buscador de Smashinn (tradeinn) se genera por JS y no vale como
      `searchUrl`, aunque sus fichas sí son scrapeables
- [x] Time2Pádel — añadido como target de Firecrawl (pendiente verificar que no sea 403)
- [x] StreetPadel — añadido como target de Firecrawl
- [x] PádelPoint — añadido como target de Firecrawl
- [ ] Descargar imágenes reales de producto
- [x] Histórico semanal de precios — `scripts/snapshot-prices.ts` + `price-history/`
- [ ] Cron job semanal automático
- [ ] Patchright (undetected Playwright fork) para evitar CAPTCHAs
- [ ] FlareSolverr sidecar para Cloudflare
