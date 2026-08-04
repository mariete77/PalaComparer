# Memoria de scraping — PalaComparer

> Reglas y errores aprendidos para que no se repitan. Si un precio de una
> tienda parece de otro producto, esto es lo primero que hay que consultar.

## Reglas de oro

1. **El matcher común manda**: `scripts/lib/product-match.ts` es el ÚNICO
   criterio de emparejamiento para Amazon, Decathlon y Firecrawl. Nunca
   escribir un `isMatch` propio en un scraper nuevo — importar el del lib.
2. **El año no rebaja el umbral.** El bug que coló la "Speed Jr. 25 2026"
   como Speed MP fue el umbral 0.5 cuando coincidía el año. Hoy: ≥85% de las
   palabras del modelo, siempre.
3. **Variantes = otro producto.** `jr`/`junior`, `girl`/`woman`, `light`,
   `kid`, tokens `l`/`w` en el título sin estar en el modelo → rechazo.
   (La "Indiga Girl" no es la "Indiga Power", la "Clash 100 L" no es la
   "Clash 100", la "Vertex 04 Pro Line W" no es la "Vertex 04".)
4. **`luxury` es gama, no modelo** — no cuenta como palabra (la tienda vende
   "AT10 Genius 18K Alum" donde el catálogo dice "AT10 Luxury Genius").
5. **Sufijos pegados** (Percept **97D** vs "Percept 97") son indetectables por
   tokens — revisar a mano y anotar aquí si vuelven a aparecer.
6. **Parseo de products.ts por ventana**: el orden de campos es
   `id → model → brand`; el regex `id…brand…model` cruza entries. Nunca
   reintroducir el regex encadenado.
7. **Mejor no mostrar oferta que mostrar la equivocada.** Si el matcher
   rechaza un título dudoso, se borra la entrada y el producto se queda sin
   oferta de esa tienda hasta re-scrapear.

## Guardia automática

- `npx tsx scripts/validate-match.ts` — recorre los 3 JSONs de ofertas y
  **falla (exit 1)** si encuentra algo que el matcher rechaza y no está en su
  ALLOWLIST. Corre en el workflow semanal (`weekly-prices.yml`) justo antes
  del snapshot: si cola un falso match el lunes, el job falla y **no se
  publica** ni se contamina el histórico.
- La ALLOWLIST del validate contiene solo ofertas verificadas a mano con
  límites conocidos del matcher (títulos de Amazon sin marca). Añadir algo a
  la ALLOWLIST = comprometerse a que el enlace es correcto.

## Historial de errores corregidos

### 04/08/2026 — Decathlon (scraper con umbral 0.5 + año)
- **Indiga Girl 2026 como Indiga Power** (50,90 €) — el reportado por Mario
- Valkiria Pro como Electra Pro Fire Red
- Axion Attack 1.0 como Explorer Pro Attack 2.0
- Whip Extreme como Whip EVA
- Metalbone CTRL 3.4 como CTRL 3.3 (otra generación)
- Clash 100 L como Clash 100 V3 (light)
- Vertex 04 Pro Line W como Vertex 04 (femenina)
- CX 200 Júnior 26" como CX 200
- Speed MP L como Speed MP 2026 (light)
- 5 entradas huérfanas (productos ya fuera del catálogo)

### 04/08/2026 — Amazon (mismo agujero: umbral 0.5 + año)
- **Speed Jr. 25 2026 como Speed MP 2026** (74,74 €) — el reportado por Mario
- Boom Jr. Alternate como Boom MP 2026 (73,55 €)
- Trilogy Pro como Diablo Pro 2026
- Percept 97D como Percept 97 (sufijo pegado — a mano)

## Casos verificados que parecen sospechosos pero no lo son

- Títulos de Amazon **sin marca** ("Counter Viper", "Technical Veron",
  "Extreme Motion", "Vertex 04 Comfort", "CX 200"…) — el ASIN es el correcto.
  Están en la ALLOWLIST del validate.
- "BULLPADEL FLOW W 24" = la Flow Woman del catálogo.
- "AT10 Genius 18K Alum" sin "Luxury" = la AT10 Luxury Genius del catálogo.
- "Vcore 98 (305gr) Rojo Rubí 2026" = la VCORE 98 (8th gen).
- "Pure Strike 100 16x19 2025" = la 4th Gen del catálogo (año comercial
  distinto, misma raqueta).

## Checklist tras cada limpieza manual

1. Borrar la entrada falsa del JSON de la tienda (`real-offers*.json`).
2. Corregir `src/data/price-history/YYYY-MM-DD.json` (quitar la oferta y
   recalcular bestPrice; si se queda sin ofertas, borrar la key del producto).
3. Corregir `src/data/price-history/compiled.json` (quitar el punto del día).
4. `npx tsx scripts/validate-match.ts` → debe salir ✅.
5. Documentar aquí (historial) y en `docs/SCRAPING.md` si el matcher necesita
   otro aprendizaje.
