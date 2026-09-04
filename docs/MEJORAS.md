# PalaComparer — Backlog de mejoras nocturnas

> Este documento es el contrato del cron **"PalaComparer — Mejora nocturna diaria"** (01:00 UTC).
> Cada noche se implementa UNA tarea, se verifica, se marca y se pushea. Mario revisa los
> cambios en GitHub y en producción (Vercel hace deploy automático al hacer push).

## Protocolo (para el agente nocturno)

0. **Actualidad primero** — ANTES del backlog, buscar qué hay EN CURSO: torneos de tenis y
   pádel (Grand Slams, Premier Padel, FIP, ATP) y grandes historias de menos de una semana.
   Si hay un torneo importante en marcha → la tarea de esa noche es contenido ORIGINAL y
   ACTUAL sobre él (ver sección 📰 Actualidad abajo). Si no hay nada relevante → ir al paso 1.
1. `git pull` antes de tocar nada.
2. Leer este archivo y elegir la **PRIMERA tarea sin marcar** (checkbox sin `[x]`). Los
   items etiquetados `🔝 PRIORIDAD ESTA SEMANA` van antes que el resto de la lista.
3. Si no queda ninguna → proponer e implementar una mejora nueva, añadiéndola al backlog
   (y esa es la de esa noche).
4. Verificación SIEMPRE obligatoria:
   - `npm run build` debe pasar sin errores.
   - `npm run check:translations` debe pasar (textos nuevos → ES + EN).
   - Cambio visual → screenshot en `docs/screenshots/<fecha-YYYY-MM-DD>-<slug>.png`,
     commiteado con la mejora (se ve desde GitHub web).
5. Datos reales o nada: sin precios, modelos, jugadores ni noticias inventados. Si un dato
   no se puede verificar, no se pone. (Norma de oro de Mario.)
6. Marcar `[x]` con la fecha y un resumen de una línea. Commit + push enfocado
   (`feat(ui): ...`, `feat(jugadores): ...`, `feat(data): ...`, `feat(seo): ...`, `fix: ...`).
7. Si no se puede terminar → REVERTIR (`git checkout -- .`) y reportar qué falló y por qué.
   Nunca commitear código roto.

## Notas permanentes

- Las palas las añade el **cron de palas** (cada 2 noches a las 03:00) y las noticias de
  agenda el **cron de noticias** (lunes a las 04:00). El cron nocturno NO las crea, salvo
  contenido de **actualidad por Regla 0** (torneo grande en curso). Si se detecta un hueco,
  añadir nota al final del backlog, no implementarlo.
- Las páginas de jugador se generan solas desde el campo `player` de los productos
  (`src/data/players.ts`). El catálogo tiene ~58 productos.
- El repo usa **Next.js con breaking changes**: leer `node_modules/next/dist/docs/`
  antes de escribir código si hay dudas (aviso en `AGENTS.md`).
- Repo: github.com/mariete77/palacomparer · Dominio: www.palacomparer.com
- El modelo del agente no tiene visión: verificar lo visual con píxeles/DOM/estilos
  (skills de verificación sin visión), no con screenshots oculares.

---

## Backlog

### 📰 Actualidad (contenido original y actual)

_Por la Regla 0 del protocolo, si un torneo está en curso este item va primero. Hechos
verificados a 2026-09-03: US Open del 23 ago al 13 sep (cuadro principal en marcha);
Comunidad de Madrid Premier Padel P1 del 29 ago al 6 sep (cuadro en el Movistar Arena,
1-6 sep); Paris Major del 7 al 13 sep. Antes de escribir, comprobar `src/content/noticias/`
para no duplicar temas ya publicados (ej. ya existe `madrid-p1-2026-lucha-por-el-numero-uno`)._

1. [x] **Madrid P1 2026 — las palas de los favoritos** — torneo en curso hasta el 6 de
   septiembre (Movistar Arena). Pieza original con ángulo propio: "Las palas del Madrid P1:
   qué juegan Tapia, Coello y Galán en el Movistar Arena", con los modelos reales presentes
   en el catálogo. Datos verificados en premierpadel.com / madridpremierpadel.com.
   Verificar: web_search + build + check:translations. — **HECHO 2026-09-04**: artículo
   `madrid-p1-2026-palas-cuartos-final` (ES+EN, kind novedad, 6 relatedProducts:
   AT10 18K, Coello Pro, Metalbone, Neuron 02, Hack 04, Diablo Pro) con resultados reales
   de octavos (Libaak-Alfonso eliminan a Lebrón-Augsburger; Stupa-Sanz fuera). Archivos:
   src/content/noticias/{,en/}madrid-p1-2026-palas-cuartos-final.mdx, src/data/news.ts.
   Build + check:translations OK, página 200 en ES/EN con enlaces a producto verificados.
2. [ ] **US Open 2026 — las raquetas de los cuartos de final** — torneo hasta el 13 de
   septiembre. Pieza original de tenis con los modelos del catálogo (Wilson Blade 98 V10,
   Babolat Pure Aero, Head Speed MP, Yonex VCore...): qué raqueta usa cada favorito y por
   qué encaja con su juego. Datos reales (usopen.org, atptour.com). Verificar: web_search +
   build + check:translations.
3. [ ] **Paris Major 2026 — previa** — del 7 al 13 de septiembre. Cuando se acerque (o
   termine el Madrid P1), pieza de previa con los protagonistas y sus palas del catálogo.
   Verificar: web_search + build + check:translations.

### 🎨 Visual (mejoras visuales)

1. [x] **Dark mode completo** — toggle sol/luna en la Nav con persistencia
   (`localStorage`), respeta `prefers-color-scheme` por defecto, paleta oscura diseñada
   (no un invertido genérico) en toda la web: hero, cards, marquee, tablas de comparar,
   fichas, footer, noticias. Verificar: build + screenshots claro/oscuro.
   — `2026-09-03`: la web ya era oscura por diseño (tokens ProCourt); se ha añadido el
   MODO CLARO como segunda paleta diseñada (tokens `html[data-theme="light"]`), toggle
   sol/luna en la Nav (clave `pc-theme` en localStorage), default = `prefers-color-scheme`
   (script inline antes del primer paint, sin FOUC), tokens `overlay-*`/`primary-strong`/
   `padel-strong`/`tenis-strong` para que overlays, bordes y acentos se adapten en toda la
   web (16 componentes/páginas), y prose de artículos re-mapeado en claro. Build OK +
   verificación DOM (fondos, colores calculados, toggle, persistencia) + screenshots
   `docs/screenshots/2026-09-03-dark-mode-{oscuro,claro}.png`. Archivos: globals.css,
   layout.tsx, Nav.tsx, ThemeToggle.tsx (nuevo), icons.tsx, locales.ts y barrido de
   overlays en componentes y páginas. NOTA: con el default por sistema, usuarios con OS
   claro verán la web en claro; si Mario prefiere oscuro por defecto es un cambio de 1
   línea en THEME_INIT.
2. [ ] **Blossom Carousel en homepage** — integrar blossom-carousel para los destacados
   de palas y raquetas (reemplazar o mejorar el ProductCarousel actual si gana en tacto
   y transiciones). Mario quiere probarlo. Verificar: build + screenshot del carousel.
3. [ ] **ProductCard premium** — hover con lift + sombra suave + zoom sutil de la foto,
   badge de descuento real animado cuando hay oferta (< PVP), transiciones 150-250ms
   respetando `prefers-reduced-motion`. Verificar: build + screenshot (o check de estilos).
4. [ ] **Nav sticky con blur** — barra fija con `backdrop-blur` al hacer scroll, estado
   activo por sección, menú móvil con animación de entrada. Verificar: build + screenshot
   scrolleado y móvil (375px).
5. [ ] **Scroll-reveal CSS-only** — aparición escalonada de secciones en homepage
   (hero → marquee → pilares → destacados → noticias → ofertas) con animaciones CSS puras
   (sin librerías) y respeto a `prefers-reduced-motion`. Verificar: build + screenshot.
6. [ ] **Comparador mejorado** — tabla con fila/columna sticky, chip verde en el mejor
   precio de cada producto, toggle de mostrar/ocultar specs. Verificar: build + screenshot
   de `/comparar`.
7. [ ] **Ficha de producto v2** — layout de dos columnas (foto + specs), badges de nivel
   y estilo, bloque "veredicto" final con pros/contras, fecha de última actualización de
   precios. Verificar: build + screenshot de una ficha.
8. [ ] **Página de jugador visual** — header con gradiente del color de la marca de su
   pala, armament (palas actuales del jugador), chips de estilo, enlaces a palas
   similares. Verificar: build + screenshot `/jugadores/<slug>`.
9. [ ] **Empty states y skeletons** — finder sin resultados → sugerencias y CTA;
   imágenes con skeleton shimmer mientras cargan. Verificar: build + screenshot del
   empty state del finder.
10. [ ] **Micro-interacciones** — botón "Añadir a comparar" con feedback de éxito,
    contador del CompareBar con animación, hover states consistentes en todos los
    enlaces/botones. Verificar: build.

### 🏸 Jugadores (info de jugador)

11. [ ] **Fichas de jugador con bio real** — bio corta verificada (ranking actual,
    estilo de juego, pareja actual, títulos) en las páginas de jugador, con fuente
    citada. Empezar por los del catálogo: Tapia, Coello, Galán, Momo González, Javi
    Garrido, J. Sanz, Lamperti, Bela... Verificar: web_search + build.
12. [ ] 🔝 **PRIORIDAD ESTA SEMANA** — **"Jugador del día" en homepage** — módulo rotativo
    que destaca cada día a un jugador del catálogo con su pala y 3 datos verificados
    (mientras haya torneos en curso da vidilla a la portada y combina con la Regla 0).
    Rotación determinista por fecha para que el SSR sea estable. Verificar: build +
    screenshot.
13. [ ] **FAQ por jugador** — para los 5 jugadores top del catálogo: "¿Qué pala usa X?",
    "¿Qué specs tiene?", "¿Por qué cambió de marca?" con respuestas basadas en fuentes
    reales y enlaces. Verificar: contenido citado + build.
14. [ ] **Cerrar gaps de jugadores** — revisar qué jugadores destacados del circuito
    (ej. Paquito Navarro, Chingotto, Stupa, Ale Alonso, Sanyo...) usan palas presentes
    en el catálogo y enlazar sus páginas; añadir campo `player` donde falte. SÓLO con
    datos verificados. Verificar: coherencia de jugadores + build.

### 🎯 Recomendaciones

15. [ ] **Finder v2** — ampliar el quiz con presupuesto máximo y frecuencia de juego, y
    mostrar "por qué esta pala" (3 razones basadas en specs → ratings). Verificar:
    build + screenshot del resultado del finder.
16. [ ] **"Parecidas a esta"** — en cada ficha, 3 palas con mayor similitud (scoring
    self-hosted por forma/peso/balance/núcleo/caras/nivel) explicando el parecido.
    Verificar: build + screenshot de ficha.
17. [ ] **Matchmaking por jugador** — en la página de cada jugador: "¿Te gusta el estilo
    de X? Prueba estas palas" (similitud con la suya). Verificar: build + screenshot.
18. [ ] **Listas curadas** — "Mejores palas por nivel" (principiante/intermedio/
    avanzado/profesional) y "Mejores por menos de 150€" con veredicto razonado y precios
    reales. Verificar: precios verificados + build.
19. [ ] **Widget "Tu pala ideal" en homepage** — mini-finder de 2 pasos (nivel + estilo)
    → top 3 con enlaces a fichas. Verificar: build + screenshot.

### 📊 Contenido y datos

20. [ ] **Bloques-respuesta SEO** — 40-60 palabras respondiendo a "¿cuál es la mejor
    pala para...?" al inicio de `/palas` y de las fichas, con veredicto y pros/contras
    (pendiente de la auditoría GEO). Verificar: build + redacción sin inventar datos.
21. [ ] **Guía: encordado y grips** — guía nueva (kind: `guia`, ES+EN) sobre encordado
    de palas y grips, con Callout enlazando palas del catálogo. Verificar: datos reales
    (web_search) + build.
22. [ ] **Guía: niveles y estilos** — tabla de niveles (principiante→profesional) y
    estilos (control/potencia/polivalente), cómo elegir, con palas reales del catálogo
    recomendadas (ES+EN). Verificar: build.
23. [ ] **/ofertas con historial** — mostrar en cada oferta el historial de precios
    (ya existe `price-history/`) y badge "precio más bajo en X días" cuando aplique.
    Verificar: build + screenshot.
24. [ ] **H2 interrogativos + schema Article** — revisar guías/noticias: H2 en formato
    pregunta donde encaje; schema `Article` con autor real y fechas. Verificar: build +
    JSON-LD servido en HTML (curl).

### 🔍 SEO / GEO

25. [ ] **ItemList y BreadcrumbList** — verificar y completar JSON-LD en `/palas`
    (ItemList) y fichas + breadcrumbs si falta (revisar `src/data/schema.ts`).
    Verificar: JSON-LD en HTML servido (curl).
26. [ ] **llms.txt enriquecido** — maestro de páginas clave con descripciones útiles
    para agentes de IA (resumen del sitio, fichas destacadas, notas). Verificar: build +
    curl de `/llms.txt`.

---

## Notas (varias noches)

_(Aquí el agente nocturno apunta huecos detectados: palas que faltan, noticias
importantes, ideas nuevas, mejoras pendientes de una tarea marcada.)_