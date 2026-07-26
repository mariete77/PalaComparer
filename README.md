# PalaComparer

Comparador de palas de pádel y raquetas de tenis: catálogo con specs reales,
comparación lado a lado, buscador por perfil de juego, precios por tienda y una
sección de guías y análisis.

```bash
npm install
npm run dev     # http://localhost:3000
```

Next.js 16 (App Router, Turbopack), React 19, Tailwind v4.

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Portada: destacados de cada deporte y últimas noticias |
| `/palas`, `/raquetas` | Catálogo con filtros por marca, nivel, estilo, forma y precio |
| `/producto/[id]` | Ficha: specs, dónde comprar, evolución de precio y artículos relacionados |
| `/comparar` | Hasta 3 modelos lado a lado, spec por spec |
| `/finder` | Cuestionario que recomienda modelos por nivel, estilo y presupuesto |
| `/noticias`, `/noticias/[slug]` | Guías y análisis en MDX |

## Datos

Todo el contenido vive en `src/data/`. No hay base de datos ni API externa.

| Fichero | Contenido |
|---|---|
| `products.ts` | Los 48 modelos y sus specs (`PadelSpecs` / `TenisSpecs`) |
| `stores.ts` | Tiendas, gastos de envío y umbral de envío gratis |
| `offers.ts` | Ofertas por tienda e histórico de precios |
| `news.ts` | Índice de artículos |
| `real-images.json` | Manifiesto de fotos reales (lo genera un script) |

### ⚠️ Los precios son simulados

`offers.ts` **genera las ofertas de forma determinista** a partir del PVP y del id
de la tienda. No son precios reales: son un stub con la forma exacta que tendrá
el feed definitivo, para poder construir la UI.

Para conectar datos de verdad basta con sustituir `getOffers` y
`getPriceHistory`; el resto de la app solo consume esas funciones y sus tipos.
`PRICE_SNAPSHOT` fija la fecha del snapshot para que el render sea determinista
entre servidor y cliente.

## Imágenes

Cada producto usa, por este orden:

1. La foto real registrada en `src/data/real-images.json`, si existe.
2. Si no, el SVG procedural de `public/images/rackets/` — se marca en la ficha
   como «Ilustración orientativa».

```bash
npm run gen:images        # regenera los SVG placeholder desde las specs
npm run images:scaffold   # plantilla con los 48 ids, para ir rellenando
npm run import:images     # descarga las fotos del manifiesto
```

`images:scaffold` deja `scripts/image-sources.json` con una entrada por
producto y el hueco de `url` vacío. Es idempotente: conserva lo ya rellenado y
solo añade lo que falte, así que puedes reejecutarlo al meter productos nuevos.
Las entradas con `url` vacía se ignoran y ese producto se queda con su SVG.

```json
{
  "nox-x-one-2026": {
    "url": "https://cdn.ejemplo.com/nox-x-one.jpg",
    "credit": "© Nox Sport",
    "source": "https://www.noxsport.com/prensa",
    "licence": "prensa"
  }
}
```

Solo imágenes que tengas derecho a usar: material de prensa de la marca, fotos
propias o assets con licencia. El `credit` se muestra bajo la foto en la ficha.

### Seguimiento de derechos

`licence` registra la situación de cada imagen — `pendiente` (por defecto),
`prensa`, `feed` o `propia` — y el importador resume cuántas quedan sin
regularizar. Cada entrada guarda además su `source` con la URL exacta de
origen, que es lo que permite después reclamar el permiso o sustituir la
imagen de forma selectiva en lugar de rehacerlo todo.

Si prefieres servir desde un CDN sin descargar nada, añade `#remote` al final de
la URL y da de alta el dominio en `images.remotePatterns` (`next.config.ts`).

## Publicar un artículo

1. Crea `src/content/noticias/<slug>.mdx` con su `export const metadata`
   (ver `ArticleMeta` en `src/data/news.ts`).
2. Regístralo en `ARTICLES`, en `src/data/news.ts`.

Dentro del MDX tienes disponibles, sin importarlos, estos componentes:

| Componente | Uso |
|---|---|
| `<Callout title="…">` | Bloque destacado |
| `<ProductRef id="…" />` | Enlace en línea a una ficha, con su mejor precio |
| `<ProductGrid ids={[…]} />` | Rejilla de tarjetas de producto |
| `<SpecList>` + `<SpecRow label value />` | Tabla de specs |

Los ids de `relatedProducts` generan los enlaces cruzados en las dos
direcciones: el artículo enseña las fichas y cada ficha enseña sus artículos.

## Scripts

```bash
npm run dev            # servidor de desarrollo
npm run build          # build de producción
npm run lint           # eslint
npm run gen:images       # SVG placeholder
npm run gen:logo         # derivados del logo (cabecera, favicon, Open Graph)
npm run images:scaffold  # plantilla de fuentes con los 48 ids
npm run import:images    # fotos reales (-- --force para volver a descargar)
```
