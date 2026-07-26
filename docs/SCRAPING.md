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

- ✅ **35 de 47 productos** con precio real de Amazon ES (75%)
- ❌ 12 no encontrados (no disponibles en Amazon ES o matching fallido)
- Cobertura: todas las marcas principales (Nox, Bullpadel, Head, Adidas, Babolat, Wilson, etc.)

## Ideas futuras

- [ ] Scraping de PadelNuestro (Magento)
- [ ] Scraping de Decathlon ES
- [ ] Scraping de Time2Pádel
- [ ] Descargar imágenes reales de producto
- [ ] Cron job semanal automático
- [ ] Patchright (undetected Playwright fork) para evitar CAPTCHAs
- [ ] FlareSolverr sidecar para Cloudflare
