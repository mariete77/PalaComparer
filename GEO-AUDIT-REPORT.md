# GEO Audit Report: PalaComparer

**Fecha:** 30 de julio de 2026
**URL:** https://www.palacomparer.com
**Tipo de negocio:** E-commerce comparativo (afiliación) con capa editorial
**Páginas analizadas:** homepage, `/palas`, `/raquetas`, `/producto/*`, `/noticias/*`, `/finder`, `/comparar`

---

## Resumen ejecutivo

**GEO Score global: 35/100 (Crítico)**

El sitio tiene un activo real y poco común: precios verificados de varias tiendas junto a specs de fabricante, servidos con SSR limpio. Ese activo hoy es invisible para los sistemas de IA, porque no hay ni un solo bloque de datos estructurados en todo el dominio y no existe ruta de descubrimiento (robots, sitemap y llms.txt devuelven 404). A eso se suma que la marca no existe como entidad fuera de su propio dominio: cero menciones en Wikipedia, Reddit, YouTube y LinkedIn. Un comparador sin entidad reconocible y sin `Product`/`Offer` no se cita, por bueno que sea su dato.

### Desglose de puntuación

| Categoría | Score | Peso | Ponderado |
|---|---|---|---|
| AI Citability | 56/100 | 25% | 14,0 |
| Brand Authority | 4/100 | 20% | 0,8 |
| Content E-E-A-T | 41/100 | 20% | 8,2 |
| Technical GEO | 64/100 | 15% | 9,6 |
| Schema & Structured Data | 0/100 | 10% | 0,0 |
| Platform Optimization | 27/100 | 10% | 2,7 |
| **GEO Score global** | | | **35,3/100** |

---

## Problemas críticos (arreglar ya)

1. **`NEXT_PUBLIC_SITE_URL` no está definida en Vercel.** `og:image` y `twitter:image` sirven `http://localhost:3000/opengraph-image.png` (4 ocurrencias en el HTML de portada). Cada vez que alguien comparte una ficha en WhatsApp, X, Slack o ChatGPT, la preview sale rota. Es una variable de entorno: el arreglo con mejor relación impacto/esfuerzo de todo el informe.
2. **Cero JSON-LD en el sitio entero.** Sin `Product`, `AggregateOffer`, `Organization`, `Article` ni `BreadcrumbList`. Las fichas ya muestran 3 tiendas reales y rangos de 214,90 a 259,95 €, pero ninguna IA puede leerlos como oferta.
3. **`robots.txt`, `sitemap.xml` y `llms.txt` devuelven 404.** Nada está bloqueado, pero tampoco hay descubrimiento dirigido de las ~53 URLs. Sin sitemap no hay indexación fiable en Bing, y sin Bing quedan fuera Copilot y parte de ChatGPT.
4. **La marca no existe como entidad.** Cero resultados de "PalaComparer" en Wikipedia (ES/EN), Reddit, YouTube y LinkedIn. Las consultas "comparador palas pádel" las dominan PadelZoom, Padelful, Tumejorpala y Compadelator.
5. **No hay páginas legales ni de confianza.** Faltan Sobre nosotros, Contacto, Aviso legal, Política de privacidad y Cookies, mientras corren Google Analytics y Vercel Analytics. Además de hundir el E-E-A-T, es un problema de RGPD y LSSI en España.
6. **Sin declaración de afiliación.** `OfferTable.tsx:31` invita a ir a la tienda pero no declara si hay comisión. Si la hay, es incumplimiento; si no la hay, se está regalando una señal de transparencia.

## Alta prioridad

- Sin `<link rel="canonical">` ni `og:url` en ninguna página: riesgo de duplicados www/apex y con los parámetros del comparador.
- Faltan bloques-respuesta de 40-60 palabras en `/palas` y `/producto/*`. La ficha tiene una tabla de specs excelente pero solo 2-3 frases de prosa, sin veredicto ni pros y contras.
- Los H2 no son interrogativos. "Las palas del momento" no coincide con ninguna consulta real; falta "¿Qué pala de pádel es mejor para principiantes?" con la respuesta justo debajo.
- Ninguna página cubre "qué pala usa [jugador]" (Tapia, Coello, Galán). Es el patrón de consulta español con más volumen y sin competencia estructurada, y el catálogo ya tiene el campo `player`.
- Autoría genérica: `author: "Redacción PalaComparer"` en los 5 MDX, sin persona, bio, credenciales ni schema `Person`.
- Contenido delgado: las 5 guías suman 2.181 palabras (368-481 cada una), por debajo del umbral competitivo.
- Sin experiencia de primera mano: cero pruebas en pista, fotos propias u opiniones de jugadores.
- Faltan cabeceras de seguridad: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. HSTS existe pero sin `includeSubDomains; preload`.
- `/palas` lista los productos sin `ItemList`, y el breadcrumb visual existe en el DOM pero no está marcado.

## Prioridad media

- Procedencia de precios opaca: "orientativos" y `checkedDaysAgo` sin explicar quién scrapea, cada cuánto ni qué tiendas entran. Falta una página de metodología.
- GTM con `<link rel="preload" as="script">` en `<head>`: tarea larga de terceros en el hilo principal, el principal riesgo de INP en la tabla comparativa.
- Sin fecha de "última actualización" en las fichas de producto.
- Faltan subtemas obvios para autoridad temática: encordado, grip, tabla de nivel, comparativas por marca.

## Prioridad baja

- `llms.txt` ausente. Con 48 fichas y 5 guías el índice es trivial de generar.
- Sin negociación `text/markdown` para agentes (oportunidad futura, no estándar aún).

---

## Detalle por categoría

### AI Citability (56/100)
Las guías puntúan bien, 72-78: definiciones autocontenidas y cifras concretas ("3K = 3.000 filamentos por hilo"). Las fichas se quedan en ~55 por falta de prosa evaluativa. El listado `/palas` cae a ~22 porque solo dice "Usa los filtros para encontrar la tuya": es interfaz, no respuesta citable.

### Brand Authority (4/100)
El punto más débil y el de arreglo más lento. La marca no aparece en ninguna plataforma de terceros. Ninguna cantidad de schema compensa que un modelo no reconozca la entidad.

### Content E-E-A-T (41/100)
Experiencia 8/25 · Pericia 9/25 · Autoridad 6/25 · Confianza 9/25. El texto está bien escrito y tiene voz propia, pero es explicación de manual, no experiencia. Solo la guía de gama alta aporta dato propio: el análisis de los modelos del catálogo.

### Technical GEO (64/100)
La mejor nota, y con razón: SSR verificado (66 KB de HTML, 1.703 palabras en ficha), `<html lang="es">`, viewport correcto, apex→www con 308 limpio, URLs legibles. Lo que hunde la nota es crawlability (15/100) y meta/indexabilidad (45/100).

### Schema & Structured Data (0/100)
Cero marcado en las cuatro plantillas auditadas. Es un cero literal, no un redondeo.

### Platform Optimization (27/100)
Google AI Overviews 30 · ChatGPT 30 · Perplexity 29 · Bing Copilot 24 · Gemini 22.

---

## Quick wins (esta semana)

1. Definir `NEXT_PUBLIC_SITE_URL=https://www.palacomparer.com` en Vercel. Arregla todas las previews sociales. 2 minutos.
2. Añadir `src/app/robots.ts` y `src/app/sitemap.ts`. Next los genera desde `PRODUCTS` y `ARTICLES`. Media hora.
3. Inyectar `Product` + `AggregateOffer` en `/producto/[id]` desde el Server Component. Los datos ya están en `real-offers*.json`.
4. Añadir `Organization` + `WebSite` con `SearchAction` en el layout.
5. Publicar Aviso legal, Privacidad, Cookies y Sobre nosotros, y declarar la relación de afiliación en `OfferTable`.

## Plan a 30 días

### Semana 1: cimientos técnicos
- [ ] `NEXT_PUBLIC_SITE_URL` en Vercel y verificar `og:image` en producción
- [ ] `robots.ts` + `sitemap.ts` generados desde los datos
- [ ] `canonical` y `og:url` en todas las plantillas
- [ ] Cabeceras de seguridad en `next.config.ts`

### Semana 2: datos estructurados
- [ ] `Product` + `AggregateOffer` en fichas de producto
- [ ] `Organization` + `WebSite`/`SearchAction` en el layout
- [ ] `Article` + `Person` en las guías
- [ ] `BreadcrumbList` e `ItemList` en los listados

### Semana 3: contenido y confianza
- [ ] Páginas legales y Sobre nosotros, con declaración de afiliación
- [ ] Página de metodología: de dónde salen precios y specs, y cada cuánto se actualizan
- [ ] Autor real con bio y credenciales en lugar de "Redacción PalaComparer"
- [ ] Bloque-respuesta de 40-60 palabras al inicio de cada ficha y de cada listado

### Semana 4: cobertura de consultas y entidad
- [ ] Páginas "qué pala usa [jugador]" para Tapia, Coello, Galán, Lamperti y Tello
- [ ] Reescribir H2 a formato pregunta en guías y listados
- [ ] `llms.txt`
- [ ] Crear presencia de marca: LinkedIn, YouTube y participación real en r/padel y foros españoles

---

## Ejemplo de JSON-LD para una ficha

Inyectar server-side desde el Server Component, nunca desde cliente: GPTBot y ClaudeBot no ejecutan JS.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nox AT10 Luxury Genius 18K Alum 2026",
  "brand": { "@type": "Brand", "name": "Nox" },
  "sku": "nox-at10-genius-18k-2026",
  "url": "https://www.palacomparer.com/producto/nox-at10-genius-18k-2026",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": "214.90",
    "highPrice": "259.95",
    "offerCount": 3
  }
}
```

---

## Nota sobre el alcance

Auditado sobre el estado desplegado a 30/07/2026, que corresponde al árbol actual del repositorio. No incluye el trabajo revertido de la sesión (sección `/guias`, redirecciones 308, hero rediseñado, footer con crédito de Ayanip ni las dos palas nuevas). Si ese trabajo se recupera y se despliega, conviene revisar al menos la parte de arquitectura de URLs y sitemap.
