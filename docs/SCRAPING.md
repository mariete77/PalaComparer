# 🛠️ Scraping de precios — PalaComparer

Pipeline para obtener precios y URLs reales de tiendas de pádel/tenis.

## Uso rápido

```bash
# Actualizar precios de Amazon ES (todos los productos)
npx tsx scripts/scrape-amazon.ts
```

El script lee `src/data/products.ts`, busca cada producto en Amazon ES y guarda los resultados en `src/data/real-offers.json`.

## Cómo funciona

```
products.ts (47 productos)
        ↓
scripts/scrape-amazon.ts
        ↓
Amazon ES (búsqueda headless con Playwright)
        ↓
real-offers.json (precio real + URL real)
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

## Estado de las tiendas (comprobado el 26/07/2026)

Cada dominio y cada URL de búsqueda de `stores.ts` se probó con Firecrawl
buscando "Head Gravity Pro":

| Tienda | Estado |
|--------|--------|
| Padel Nuestro | ✅ dominio y fichas OK. Su buscador (`/catalogsearch/result/?q=`) responde 200 pero **devuelve la portada** a los scrapers, con proxy normal y con stealth. No se ha podido confirmar si le pasa lo mismo a un usuario real; los productos con precio real ya enlazan a su ficha y no pasan por el buscador |
| PádelPoint | ⚠️ la tienda es `tiendapadelpoint.com` (OpenCart), no `padelpoint.es`. URL corregida |
| Time2Pádel | ⚠️ `.es` devuelve 421 (no está en el certificado). La buena es `time2padel.com`, PrestaShop, con búsqueda en `/es/buscar?controller=search&s=`. Corregida |
| StreetPadel | ⚠️ `.es` redirige a `.com` (Shopify) y `/buscar` daba **404**. La ruta es `/search?q=`. Corregida |
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
```

Para actualizar solo un producto concreto, borrar su entrada del JSON y re-ejecutar el script.

## Troubleshooting

| Problema | Solución |
|----------|----------|
| `Timeout exceeded` | Amazon rate-limiting → el script ya tiene delays de 5-8s. Si persiste, aumentar delay |
| `CAPTCHA detectado` | Amazon detectó el bot → el script lo loguea y continúa. Esperar y reintentar |
| `no match (0 resultados)` | El producto no está en Amazon ES o el nombre no coincide |
| Precio 0 / sin precio | El producto existe pero sin precio visible (agotado o solo 3ª parte) |
| `no match (48 resultados)` | Muchos resultados pero ninguno coincide — revisar `buildSearchQuery()` |

## Resultados actuales

- ✅ **41 de 48 productos** con precio real de Amazon ES
- ✅ **19 de las 31 palas de pádel** con precio real de Padel Nuestro (Firecrawl)
- ❌ **3 sin ningún precio real**, y no por fallo del scraper:
  - `adidas-rx-carbon-2024` — Adidas no sacó RX Carbon en 2024. Existe la de
    2023 y la RX Series; el año del catálogo parece equivocado.
  - `siux-diablo-revolution-2024` — la "Diablo Revolution 2 12K" no se vende en
    tiendas ES; la de 2024 es la Diablo Revolution **Pro 3**.
  - `yonex-vcore-98-2023` — está en Amazon (ASIN B0BSNNC7T5, versión Scarlet)
    pero sin precio ni stock. Decathlon tiene una VCore 98 a 274,99 € que no
    confirma generación.

### Palas que Padel Nuestro no lista

No es un fallo del scraper: la tienda ya no vende ese modelo/temporada. Varias
apuntan a errores de año en `products.ts`, que conviene revisar:

| Producto | Qué hay en la tienda |
|----------|----------------------|
| `adidas-metalbone-31-2024` | La gama 2024 de Adidas es la **3.3**; la 3.1 es de temporadas anteriores |
| `black-crown-piton-2024` | Solo Piton 11 **Soft 2023**, Piton 14 y Piton Attack 15K 2024 |
| `head-speed-pro-2024` | Head Speed Pro **2023** y **2025**; no hay 2024 |
| `head-extreme-motion-2024` | Extreme Motion **2023** y **2025**; no hay 2024 |
| `head-flash-2024` | Ninguna Flash en catálogo |
| `starvie-aquila-2024` | Ninguna Aquila Space Pro |
| `wilson-bela-elite-2024` | Wilson Bela Pro V2/V2.5, LT y LS; no hay "Bela Elite" |
| `babolat-technical-viper-2025`, `babolat-technical-veron-2025`, `babolat-counter-viper-2025` | La web española ya solo tiene la generación **3.0 / 2.6** (2026). Las 2025 siguen en `/int/`, pero es otra tienda y otra generación |

## Ideas futuras

- [ ] Automatizar el flujo de Firecrawl en un script (`scripts/scrape-firecrawl.ts`)
      con `FIRECRAWL_API_KEY`: hoy se hace a mano desde el MCP
- [ ] Scraping de Decathlon ES (marketplace: ojo al vendedor y a la generación)
- [ ] Precios reales para las raquetas de **tenis**: hoy solo tienen Amazon,
      porque Padel Nuestro no vende tenis y las dos tiendas de tenis que había
      en `stores.ts` no existían
- [ ] Descargar imágenes reales de producto
- [ ] Cron job semanal automático
- [ ] Patchright (undetected Playwright fork) para evitar CAPTCHAs
- [ ] FlareSolverr sidecar para Cloudflare
