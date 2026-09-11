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
  (`src/data/players.ts`, soporta nombres compartidos "A / B" o "A, B, C" desde
  2026-09-04). El catálogo tiene ~122 productos.
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
para no duplicar temas ya publicados (ej. ya existe `madrid-p1-2026-lucha-por-el-numero-uno`,
`us-open-2026-raquetas-cuartos-final` y `paris-major-2026-previa-roland-garros`)._

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
2. [x] **US Open 2026 — las raquetas de los cuartos de final** — torneo hasta el 13 de
   septiembre. Pieza original de tenis con los modelos del catálogo (Wilson Blade 98 V10,
   Babolat Pure Aero, Head Speed MP, Yonex VCore...): qué raqueta usa cada favorito y por
   qué encaja con su juego. Datos reales (usopen.org, atptour.com). Verificar: web_search +
   build + check:translations. — **HECHO 2026-09-05**: artículo
   `us-open-2026-raquetas-cuartos-final` (ES+EN, kind novedad, 6 relatedProducts: Pure
   Aero 98, Speed MP, Blade 98 v10, EZONE 98, Boom MP, VCORE 98) con hechos verificados
   (ESPN 4 sep: Alcaraz a octavos 6-3 6-4 6-1 a Wu, 10º triunfo seguido; Zverev d. Halys en
   5 sets; Sabalenka y Pegula en segunda semana; fechas de octavos/cuartos según cuadro;
   raquetas por marcas: Alcaraz Aero 98, Zverev Speed MP, Sabalenka Blade 98 18x20, Gauff
   Boom MP, Pegula y Shelton EZONE 98 (kit oficial Yonex), Rybakina VCORE). Build +
   check:translations OK; /es y /en 200; enlaces a jugadores y fichas verificados.
3. [x] **Paris Major 2026 — previa** — del 7 al 13 de septiembre. Cuando se acerque (o
   termine el Madrid P1), pieza de previa con los protagonistas y sus palas del catálogo.
   Verificar: web_search + build + check:translations. — **HECHO 2026-09-06**: artículo
   `paris-major-2026-previa-roland-garros` (ES+EN, kind novedad, 7 relatedProducts: AT10
   18K, Coello Pro, Metalbone, Neuron 02, Hack 04, Diablo Pro, Vertex 05 Woman) con el
   ángulo Roland-Garros (1er Major en el recinto de la FFT, 1.044.849 €, 2.000 pts, 6
   pistas outdoor, final dom 13 a las 14:00), la Race abierta tras Nieto-Yanguas d.
   Coello-Tapia 7-5 7-6(5) en cuartos del Madrid P1 (1ª vez sin semis desde mayo 2025) y
   finales de hoy: Chingalán vs Nieto-Yanguas y Triay-Brea vs Josemaría-González.
   Fuentes: padelfip.com, premierpadel.com, elneverazo (cuartos+semis 4-5 sep),
   parisjetaime (FFT). Build + check:translations OK, /es y /en 200.
4. [x] **Madrid P1 2026 — campeones y sus palas** — finales jugadas el domingo 6 de
   septiembre; resultados ya públicos la noche del 6 al 7. Pieza original de
   resultados + material: "Chingalán y Triay-Brea conquistan el Madrid P1: las palas
   del doblete" (Chingalán d. Nieto-Yanguas 6-4 5-7 6-4, 7º título del año, ~2,5 h;
   Triay-Brea d. Josemaría-González 6(5)-7 6-3 6-3). — **HECHO 2026-09-07**: artículo
   `madrid-p1-2026-campeones-chingalan-triay-brea` (ES+EN, kind novedad, 4
   relatedProducts: Metalbone 2026, Neuron 02 2026, Vertex 05 Woman 2026, Metalbone
   HRD+). Fuentes: MARCA directo, Olé, EFE/unitel.bo, elneverazo, infoeme, lu32.com.ar.
   Build + check:translations OK, página 200 en /es y /en.
5. [x] **US Open 2026 — el martes de cuartos** — cuartos de la mitad alta el martes
   8 de septiembre. Pieza original con ángulo de gear: 5 de los 8 cuartofinalistas
   del día juegan Yonex (Shelton/Pegula EZONE 98, Navarro VCORE, Noskova EZONE,
   Tiafoe Percept 97), con Alcaraz–Shelton (H2H 3-0) como final anticipada.
   — **HECHO 2026-09-08**: artículo `us-open-2026-martes-cuartos-yonex` (ES+EN,
   kind novedad, 7 relatedProducts) + mejora de catálogo: campo `player` de la
   Yonex Percept 97 actualizado a "Hubert Hurkacz / Frances Tiafoe" (verificado en
   yonex.com), lo que genera automáticamente la página /jugadores/frances-tiafoe.
   Fuentes: usopen.org, USA Today (orden de juego + resultado Blockx d. Cerúndolo
   6-3 4-6 7-5 7-5), Olympics.com, Reuters/BBC (Zheng d. Swiatek 7-5 6-3 desde 0-5),
   tennis.com (H2H Alcaraz–Shelton 3-0), yonex.com (Tiafoe Percept 97), Tennisnerd
   (Noskova EZONE 98L, Navarro VCORE 98), Tecnifibre (Blockx T-Fight desde los 9
   años). Build + check:translations OK; artículo, 5 páginas de jugador y 7 fichas
   de producto verificadas a 200 en local.
6. [x] **Paris Major 2026 — la jornada de los dieciseisavos** — el torneo está en marcha
   (7-13 sep, Roland-Garros) y este miércoles 9 debutan los cabezas de serie: pieza con
   los resultados reales de los treintaidosavos (lunes 7 y martes 8), el orden de juego
   del día (Coello-Tapia vs Libaak-Alfonso abriendo la Philippe Chatrier) y las palas
   del catálogo de quienes juegan hoy, con la novedad de los widgets `<ProductRef>` /
   `<ProductGrid>` incrustados en el cuerpo. — **HECHO 2026-09-09**: artículo
   `paris-major-2026-dieciseisavos-revancha-chatrier` (ES+EN, kind novedad, 7
   relatedProducts) con resultados verificados de elneverazo (2 jornadas de
   treintaidosavos + orden de juego del miércoles), bye de Triay-Brea a octavos del
   jueves (StudyPadel) y tercer título consecutivo de Coello-Tapia en París (Olé/El
   Ancasti). Primera noticia que usa ProductRef/ProductGrid en el cuerpo (con precio
   "desde" en vivo). Fuentes: elneverazo.com, studypadel.com, ole.com.ar. Build +
   check:translations OK; /es y /en a 200, en listado y 7 fichas enlazadas.
7. [x] **US Open 2026 — la semifinal 100% americana y 100% Yonex** — la historia grande
   del día: Shelton apeó a Alcaraz en el partido más tardío de la historia del US Open
   (6-7(5) 6-1 6-3 1-6 7-6(10-7), 146 mph el último saque) y el viernes Tiafoe–Shelton
   garantiza un USA en la final (ninguno gana desde Roddick 2004). — **HECHO
   2026-09-10**: artículo `us-open-2026-semifinales-tiafoe-shelton-yonex` (ES+EN, kind
   novedad, 7 relatedProducts con ProductRef/ProductGrid en el cuerpo) + campo `player:
   "Coco Gauff"` en la Head Boom MP 2026 (genera /jugadores/coco-gauff). Incluye
   Rybakina nueva nº1 (30ª desde 1975), Gauff salvando 2 match points ante Andreeva,
   Blockx retirado por costilla (Khachanov a semis) y Zverev–BVDZ en sesión nocturna.
   Fuentes: ESPN (marcador+146 mph+vómito Alcaraz+quote "war"), USA Today (Khachanov
   walkover, Rybakina nº1 30ª, Gauff 2 MP salvados), Guardian/Sky live (Gauff 2-6 7-6(7)
   6-2), Yahoo/SBNation (bracket semis viernes). Build + check:translations OK.
8. [x] **Paris Major 2026 — la jornada de cuartos** — el Major sigue en marcha (7-13 sep)
   y este viernes 11 se juegan los cuartos con Red Bull TV estrenando emisión: pieza con
   los resultados reales de los octavos (upset de Goñi-Alonso sobre los subcampeones de
   Madrid Yanguas-Nieto 6-4 6-3), el orden de juego del viernes y las palas del catálogo
   de los 14 protagonistas. — **HECHO 2026-09-11**: artículo
   `paris-major-2026-cuartos-goni-alonso` (ES+EN, kind novedad, 13 relatedProducts con
   ProductRef/ProductGrid: EA10 Ventus de Edu Alonso, Endure Pro V1 de Momo, Viper 3.0
   de Lebrón, Electra Pro IT 26 de Stupa, Axion Attack 2.0 de Jon Sanz, Hack 05 2027 de
   Paquito, Metalbone, Neuron 02, Coello Pro, AT10 18K, Arrow HIT Light, Flow y Vertex
   05 Woman). Fuentes: elneverazo (octavos + orden de juego de cuartos), premierpadel.com
   (nota del 10 sep: Orsi-Llaguno a cuartos por primera vez este curso). Build +
   check:translations OK; /es y /en a 200 con 13 fichas enlazadas verificadas en local.


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

### 🏸 Jugadores — demanda real (Search Console, sep 2026)

Búsquedas que ya traen clics; cada una debe tener página limpia del tipo
"¿Qué pala/raqueta usa X?" con specs verificadas. Estado a 2026-09-04:

- **hurkacz racket specs (16) / hurkacz racket (15)** → `/jugadores/hubert-hurkacz` ✓ (VCORE 98 2026, Prestige Tour Auxetic 2.0, Percept 97)
- **varlion carrera c black ltd (12)** → ficha `varlion-carrera-c-black-ltd-2025` ✓ (producto en catálogo)
- **tsitsipas racket (2)** → `/jugadores/stefanos-tsitsipas` ✓ (Blade 98 16x19 v10)
- **que raqueta usa rybakina (1)** → `/jugadores/elena-rybakina` ✓ creada 2026-09-04 (VCORE 98 + VCORE 100)
- **rublev racket (1)** → `/jugadores/andrey-rublev` ✓ (Radical MP Auxetic)
- **pala pádel diamante o lágrima (4)** → guías de formas; pendiente de enlazar desde /palas (item 20)
- **comparador de palas de padel (2)** → `/comparar` ✓
- **adidas metalbone (1)** → ficha Metalbone ✓

**Protocolo: el cron nocturno vigila esta tabla.** Si un jugador con demanda no tiene
página limpia o su modelo carece de specs reales → esa es la tarea de la noche
(dividir nombres compartidos, añadir `player` a un producto existente, o dar de alta la
raqueta de tenis que falte con el gate de foto real del skill add-pala; las palas de
pádel las cubre el cron de palas). Al terminar, actualizar el estado de la fila.

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

- 2026-09-07 — Finales del Madrid P1 (ayer): **Chingalán campeón** d. Nieto-Yanguas
  6-4 5-7 6-4 (7º título del año; "estrechan la pugna por el nº1", EFE) y
  **Triay-Brea campeonas** d. Josemaría-González 6(5)-7 6-3 6-3 (remontada).
  Publicado `madrid-p1-2026-campeones-chingalan-triay-brea` (Regla 0, item 4).
  HUECO para el cron de palas: la **Bullpadel Elite W 2026 (pala de Gemma Triay)** no
  está en el catálogo (las otras 3 palas de los campeones sí: Metalbone, Neuron 02,
  Vertex 05 Woman). Bea González juega la Bullpadel Pearl (tampoco en catálogo, menos
  prioritaria). Tabla de demanda real: todo ✓ (no se tocó).
- 2026-09-06 — Regla 0: publicada la previa del Paris Major (`paris-major-2026-previa-roland-garros`),
  que arranca mañana lunes 7 en Roland-Garros (qualy ya el domingo 6). Destacado de la
  semana: Nieto-Yanguas eliminaron a Coello-Tapia en cuartos del Madrid P1 (7-5 7-6(5)),
  primera vez que los nº1 se pierden unas semis desde mayo 2025; finales de Madrid hoy:
  Chingalán vs Nieto-Yanguas y Triay-Brea vs Josemaría-González. No se tocó la tabla de
  demanda real: todo ✓. Nota para el cron de noticias (lunes): el resultado de las finales
  del Madrid P1 (hoy 16:00) y la 1ª ronda de París (lun 7) serían la agenda natural de mañana.
- 2026-09-05 — US Open en marcha: publicado `us-open-2026-raquetas-cuartos-final`
  (Regla 0, item 2 del backlog). Fuentes: ESPN (resultados 4 sep), atptour.com,
  cuadro oficial via secretnyc, kits oficiales de marca (Yonex USA para Shelton,
  Wilson/Head/Babolat para el resto). No se tocó la tabla de demanda real: todo ✓.
- 2026-09-04 — Nombre compartidos en `player` arreglados (`players.ts` divide
  "A / B" y "A, B, C"; descarta "(anotaciones)"). Páginas nuevas: Elena Rybakina
  (2 raquetas), Holger Rune, Ben Shelton, Jessica Pegula, Jasmine Paolini, Tomáš
  Macháč; Djokovic limpio. Commit b0b942c. La tabla de demanda real (arriba)
  nació de las búsquedas de Search Console que pasó Mario.

_(Aquí el agente nocturno apunta huecos detectados: palas que faltan, noticias
importantes, ideas nuevas, mejoras pendientes de una tarea marcada.)_