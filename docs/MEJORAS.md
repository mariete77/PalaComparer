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
9. [x] **US Open 2026 — la final femenina, hoy: Blade contra VCORE** — la final
   Sabalenka–Rybakina se juega HOY sábado 12 en el Arthur Ashe: pieza publicada la
   mañana del partido con el ángulo de duelo de raquetas (Blade 98 v10 vs VCORE 100,
   ambas en catálogo), el triquete que nadie firma desde Serena 2012-2014, la nº1 que
   Rybakina estrena el lunes y la final del domingo (Zverev + ganador de Shelton–Tiafoe).
   — **HECHO 2026-09-12**: artículo `us-open-2026-final-femenina-blade-vcore` (ES+EN,
   kind novedad, 4 relatedProducts con ProductRef/ProductGrid) con specs contrastadas
   Blade (98 in², 323 g, 330 mm, 62 RA) vs VCORE (100 in², 300 g, 320 mm, 65 RA), H2H
   10-7 y la final de Melbourne 2026 que ganó Rybakina. Fuentes: usopen.org (previa y
   semifinales), Yahoo/CBS (Sabalenka d. Pegula 7-5 6-2, 29 winners/12, 7 aces),
   Sky Sports (Rybakina d. Gauff 3-6 6-4 6-4, nº1 el lunes tras 99 semanas, triplete
   solo Serena desde 2014), wilson.com (edición US Open de la Blade), yonex.com (VCORE
   100 + POLYTOUR FIRE). Build + check:translations OK.
10. [x] **Paris Major 2026 — día de finales: Coello-Tapia por el tetra** — las finales
   se juegan HOY domingo 13 (femenina 14:00, masculina ~16:30, Philippe Chatrier).
   Pieza matinal con los resultados verificados de las 4 semifinales del sábado y las
   palas de los finalistas del catálogo. — **HECHO 2026-09-13**: artículo
   `paris-major-2026-dia-de-finales-coello-tapia-galan-chingotto` (ES+EN, kind
   novedad, 8 relatedProducts: Coello Pro, AT10 18K, Metalbone, Neuron 02, Neuron 02
   Edge 2027, Arrow HIT Light, Vertex 05 Woman, Hack 05) con las 4 semis verificadas
   (Sánchez-Ustero d. Ortega-Araújo 5-7 6-4 6-1; Calvo-Fernández d. Triay-Brea 6-4
   6-2, 3ª seguida sobre las nº1; Tapia-Coello d. Lebrón-Augsburger 7-5 6-3 en 1h07;
   Galán-Chingotto d. Di Nenno-Paquito 7-5 6-2), el ángulo tetra 2023-2026 vs
   revancha de la final 2025 y el gancho de la Neuron 02 Edge 2027 recién llegada.
   Fuentes: elneverazo (resultados semis + horarios finales), padel-magazine (crónicas
   semi Tapia-Coello y programa), premierpadel.com, redbull.com (Red Bull TV).
   Build + check:translations OK; /es y /en 200 con ProductRef/ProductGrid;
   screenshot docs/screenshots/2026-09-13-paris-major-dia-de-finales.png (1280×5448,
   página completa renderizada, verificación de píxeles OK).
11. [x] **US Open 2026 — final masculina: Zverev campeón con la Gravity** — la final
   Zverev–Shelton se jugó el domingo 13 y cerró el torneo: pieza de resultados con el
   ángulo de material (Gravity Tour Zverev 2026, la edición limitada que HEAD lanzó
   tras Roland Garros) y alta de esa raqueta en el catálogo con specs oficiales
   verificadas. — **HECHO 2026-09-14**: artículo `us-open-2026-final-zverev-gravity-tour`
   (ES+EN, kind novedad, 4 relatedProducts con ProductRef/ProductGrid) + alta de la
   Head Gravity Tour Zverev 2026 en products.ts (98 in², 323 g, 16x19, 61 RA, 318 mm,
   SW 326, 280 €; foto real descargada y verificada en real-images.json según el gate
   del skill add-pala) → genera /es+en/jugadores/alexander-zverev. Corrige además en
   el propio artículo el error de la pieza de cuartos (Zverev juega Gravity, no Speed
   MP) con Callout transparente. Resultados verificados: Zverev d. Shelton 6-3 7-6(2)
   5-7 6-2, 2º Slam del año, H2H 5-0 previo, 44-1 vs zurdos desde RG 2023, 6ª final
   de GS (3ª en 2026), 1er alemán campeón desde Becker AO 1996; semis Zverev d.
   Khachanov 6-3 7-6(7) 7-6(6) y Shelton d. Tiafoe 4-6 6-3 6-3 7-5. Fuentes:
   usopen.org (crónica oficial de la final), Guardian live, Olympics.com, ESPN
   (semi Shelton-Tiafoe), tennisexpress.com (specs oficiales + lanzamiento 20 ago +
   precio), tenniswarehouse-europe.com (PVP 280 €, hoy 251,90 €), head.com (atleta
   con Gravity). Build + check:translations OK; /es y /en 200 (noticia, ficha
   producto, jugador); screenshots docs/screenshots/2026-09-14-{us-open-final-zverev-
   noticia,gravity-tour-zverev-ficha,jugador-alexander-zverev}.png (1280×800, no
   en blanco: 379/501/365 colores únicos).
12. [x] **Davis Cup Qualifiers 2026 — el fin de semana de las eliminatorias** —
   torneo EN MARCHA (18-20 sep): 7 ties deciden quién acompaña a Italia en el Final
   8 de Bolonia (24-29 nov). Pieza original de raquetas con las del catálogo: la
   EZONE 98 de Shelton y la familia VCORE de Macháč en Praga (USA sin Fritz y Paul:
   entran Tien nº13 y Damm; viernes Tien–Mensik, rematch del US Open, y
   Shelton–Lehecka), la Pure Aero 98 de Auger-Aliassime en Québec (FAA en singles y
   dobles, el sorteo del 17 sep dejó fuera de la hoja a Fils), la Gravity Tour de
   Zverev en Halle y la familia TFight de Blockx en Viena. — **HECHO 2026-09-18**:
   artículo `davis-cup-2026-eliminatorias-raquetas` (ES+EN, kind novedad, 5
   relatedProducts con ProductRef/ProductGrid) + campo `player` de la Babolat Pure
   Aero 98 2026 ampliado a "Carlos Alcaraz / Holger Rune / Félix Auger-Aliassime"
   (verificado en babolat.com: "used on tour by Carlos Alcaraz, Holger Rune and
   Felix Auger-Aliassime") → nueva página /jugadores/felix-auger-aliassime. Fuentes:
   daviscup.com (nominaciones + formato + Final 8 Bolonia), USTA (equipo USA,
   ranking Tien 13 / Damm 104), AFP/Dawn (bajas de Fritz y Paul; Zverev nº2),
   tenngrand (orden de juego viernes + rematch), Tennis Canada (sorteo Québec 17
   sep: FAA singles+dobles, Rinderknech–Halys individuales, Bonzi–Herbert dobles),
   babolat.com + tennisgearguide (Pure Aero 98 de FAA/Fils/Alcaraz/Rune), iq.tennis
   (FAA 98 retail frame; Macháč VCORE → SV; Lehecka Six.One 95; Mensik Blade),
   tennistemple (Blockx T-Fight desde los 17). Build + check:translations OK; /es
  y /en 200 (noticia, listado, ficha Pure Aero 98, jugador FAA, jugadores Shelton
  y Macháč preexistentes).
13. [x] **Davis Cup Qualifiers 2026 — el sábado decisivo** — el torneo sigue EN MARCHA
  (18-20 sep) y este sábado 19 se reparten los primeros billetes al Final 8: pieza
  de la jornada con los resultados reales del viernes (Praga 1-1: Tien d. Mensik
  6-2 6-4 en su debut, 15 UE vs 34; Lehecka d. Shelton 6-4 6-4, 1er partido del
  subcampeón del US Open), Québec 1-0 (Draxl d. Rinderknech 6-2 7-5, mejor victoria
  de su carrera) y lo que se juega HOY: en Praga dobles + Mensik-Shelton y
  Lehecka-Tien (Lehecka a 2 victorias de igualar a Rosol, 12 singles checos), en
  Québec dobles Chan-FAA vs Bonzi-Herbert y el arranque de Alemania-Croacia en
  Halle (14:00 local: Zverev-Dodig y Altmaier-Prizmic, 5 días después del US Open;
  Croacia sin Čilić con Pavic-Mektic). — **HECHO 2026-09-19**: artículo
  `davis-cup-2026-sabado-decisivo` (ES+EN, kind novedad, 3 relatedProducts con
  ProductRef/ProductGrid: EZONE 98, Pure Aero 98, Gravity Tour Zverev). Fuentes:
  daviscup.com (crónica Tien + dato Rosol), AP (Lehecka-Shelton), USTA (formato +
  Delray 2025), Tennis Canada/Canadian Press (Draxl + condición de 1 punto),
  TSN (dobles Chan-FAA vs Bonzi-Herbert), tennisuptodate (cruces del sábado),
  tenniswatcher (Halle: horarios + 5 días + Trier 2023 + Hanfmann/Altmaier +
  Croacia sin Čilić), tennistemple (orden de juego sábado 19), archysport
  (Krawietz-Pütz finalistas dobles US Open). Build + check:translations OK; /es
  y /en prerenderizados con 3 enlaces a ficha por producto y página de jugador.
14. [x] **Laver Cup Londres 2026 — las raquetas de las dos selecciones** — el torneo
  se juega del 25 al 27 de septiembre en The O2 (empieza el viernes); previa con
  ángulo de material: las 12 raquetas de los dos equipos (5 HEAD, 3 Wilson, 2
  Yonex, 1 Babolat, 1 Diadem), las plantillas oficiales de lavercup.com, el 15-9
  de San Francisco 2025 y el duelo de revancha Zverev-Fritz. — **HECHO 2026-09-21**:
  artículo `laver-cup-2026-londres-raquetas` (ES+EN, kind novedad, 7 relatedProducts
  con ProductRef/ProductGrid) + ampliación de 4 campos `player` verificados
  (Blade 98 v10 +Jakub Menšík — comunicado oficial Wilson; Speed MP +Rafael
  Jodar — tennisexpress; Radical MP +Taylor Fritz — Tennisnerd; VCORE 98
  +Brandon Nakashima — iq.tennis/Tennisnerd) → **4 páginas de jugador nuevas**
  (rafael-jodar, taylor-fritz, jakub-mensik, brandon-nakashima; 45 totales).
  Fuentes: lavercup.com (plantillas, formato 13 puntos, capitanes Noah/Agassi,
  historial SF 15-9 y Berlín 13-11, debut de Nakashima y Bublik), atptour.com
  (Jodar: Next Gen Race líder 2.509, Nº13, Marrakech, cuartos Madrid/Roma, RG
  27º cabo), Wikipedia (Jodar career-high nº11), Wilson (PR Blade v10),
  tennisexpress (Jodar Speed MP 2026), Tennisnerd (Fritz Radical MP/TGT 260.3,
  De Minaur Ultra Pro 99, Tien molde no retail, Nakashima VCORE 98, Cerúndolo
  PT57A 18x20), iq.tennis (Nakashima VCORE 98), head.com (Cerúndolo familia
  Prestige), diademsports.com (Bublik Project Bublik 98 "plays with"),
  yonex.com (Nakashima Next Gen 2022 + finalista National Bank Open 2026),
  tennis.com (Cobolli Radical Pro 2025), perfect-tennis (Ruud endosa EZONE 100),
  tennisuptodate (Fritz-Cerúndolo US Open 3R). Build + check:translations OK;
  15 URLs a 200 en local (noticia ES/EN, 4 jugadores ES (+2 EN), 7 fichas).
  Screenshot: docs/screenshots/2026-09-21-laver-cup-londres-raquetas.png
  (1280×577, 5.790 colores, título y hero renderizados).
15. [x] **Davis Cup Qualifiers 2026 — el Final 8 de Bolonia ya tiene dueños** —
   ronda cerrada el domingo 20 de septiembre; hoy (22 sep) la historia fresca es la
   foto completa del cuadro: Chequia 3-2 EE.UU. (remontada en reverse singles tras
   el 2-1 americano con dobles Harrison-Krajicek salvando 4 MPs), Canadá 3-1 Francia
   (FAA héroe en la 1ª Davis de Québec desde 1975), Alemania 3-2 Croacia (Zverev
   cierra el domingo d. Prizmic 6-2 6-4, una semana tras el US Open), España 4-0
   Chile sin ceder un partido (Jodar debut 6-0 6-2 a Garín; Mérida 5-7 6-3 6-3 a
   Tabilo; Martínez-Munar sentencian en el dobles), GB 4-0 Ecuador (1er Final 8
   desde 2023), Corea 3-1 India (Kwon d. Nagal 6-1 6-2), Austria 3-1 Bélgica
   (Rodionov d. Bergs 7-6(6) 6-3). Final 8 = Italia + esos 7 (Bolonia, 24-29 nov).
   — **HECHO 2026-09-22**: artículo `davis-cup-2026-final-8-bolonia-clasificados`
   (ES+EN, kind novedad, 5 relatedProducts con ProductRef/ProductGrid: Blade 98 v10,
   EZONE 98, Pure Aero 98, Gravity Tour Zverev, Speed MP) + nota Rune en Grupo
   Mundial I (d. Dimitrov 3-6 6-3 7-6(4), Pure Aero 98) + enlace a la previa de la
   Laver Cup. Fuentes: daviscup.com, AP/ajc, worldtennismagazine, Tennis Canada,
   tennistemple, RFI/ground.news, T13, Sunday Guardian. Build + check:translations
   OK; /es y /en 200 con contenido verificado en DOM; listado OK; screenshot
   docs/screenshots/2026-09-22-davis-cup-final-8.png (1280×577, 5.605 colores).


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
2. [x] **Blossom Carousel en homepage** — integrar blossom-carousel para los destacados
   de palas y raquetas (reemplazar o mejorar el ProductCarousel actual si gana en tacto
   y transiciones). Mario quiere probarlo. Verificar: build + screenshot del carousel.
   — **HECHO 2026-09-16**: `ProductCarousel` reescrito sobre `@blossom-carousel/react`
   1.5.2 (scroll nativo + drag con física en desktop, snap por tarjeta). Cambios: (1)
   scroller semántico `<ul>` con grid-auto-flow column (iguala alturas como el flex de
   Embla) y 1→2→3→4 cards por breakpoint; (2) flechas circulares con tokens ProCourt
   vía BlossomPrev/Next (se autodeshabilitan en los extremos); (3) dots BlossomDots en
   móvil con marcador activo en primario (ocultos ≥md con CSS propio porque la capa
   del paquete pisa las utilidades Tailwind); (4) autoplay propio del de ofertas:
   scroll suave cada 4,2 s que se detiene con la 1ª interacción, hover, pestaña
   oculta o prefers-reduced-motion; (5) destacados ampliados de 4 a 8 items reales
   (pádel: +Metalbone, Hack 04, Neuron 02, Varlion Carrera C Black Ltd; tenis: +
   Gravity Tour Zverev, Pure Aero 98, Boom MP, EZONE 98) para que haya overflow real
   y el drag/flechas aporten; (6) embla-carousel* desinstalado. Archivos:
   src/components/ProductCarousel.tsx (reescrito), src/app/[locale]/page.tsx,
   src/app/[locale]/globals.css (@import + bloque .pc-blossom*), src/i18n/locales.ts
   (3 claves ES/EN), package.json (+@blossom-carousel/react, −embla×2),
   scripts/verify-blossom.mts (verificación sin visión, 38 checks). Build +
   check:translations OK; verificado en prod local ES/EN: snap delta 0 tras drag,
   drag 624 px, flechas habilitan/deshabilitan, dots móviles, sin overflow en
   375 px, tema claro OK, 0 errores JS. Screenshots:
   docs/screenshots/2026-09-16-blossom-carousel{,-light}.png.
3. [x] **ProductCard premium** — hover con lift + sombra suave + zoom sutil de la foto,
   badge de descuento real animado cuando hay oferta (< PVP), transiciones 150-250ms
   respetando `prefers-reduced-motion`. Verificar: build + screenshot (o check de estilos).
   — **HECHO 2026-09-17**: hover unificado a 220 ms (lift −6px + `--shadow-card-hover`,
   que existía sin usar + zoom foto 1.06/300 ms) y **badge −X% nuevo** (lima `--primary-container`,
   pop elástico `deal-pop` 0,5 s con delay 0,25 s, `aria-label` ES/EN) que SOLO aparece con
   **precio real scrapeado** en stock y descuento ≥10% sobre PVP (52/129 productos del catálogo;
   precios sintéticos nunca generan badge). Con badge, el precio del card pasa a ser el real
   verificado y el PVP se tacha encima → badge, precio y tachado siempre cuadran. Módulo nuevo
   `src/data/real-best-price.ts` (JSON-only, client-safe, no arrastra el generador de ofertas
   ni products.ts al bundle). Verificado: build OK, check:translations OK, DOM+estilos computados
   (deal-pop activa, `text-decoration: line-through` en PVP, regla `:hover` servida),
   reduced-motion → `animation: none`, móvil 375 px sin overflow ni colisión con el botón +,
   EN/ES OK. Archivos: src/components/ProductCard.tsx, src/data/real-best-price.ts (nuevo),
   src/app/[locale]/globals.css, src/i18n/locales.ts. Screenshot:
   docs/screenshots/2026-09-17-productcard-badge-descuento.png (1280×800, 57.853 colores,
   8.879 px lima = badges renderizados).
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
12. [x] 🔝 **PRIORIDAD ESTA SEMANA** — **"Jugador del día" en homepage** — módulo rotativo
    que destaca cada día a un jugador del catálogo con su pala y 3 datos verificados
    (mientras haya torneos en curso da vidilla a la portada y combina con la Regla 0).
    Rotación determinista por fecha para que el SSR sea estable. Verificar: build +
    screenshot. — **HECHO 2026-09-15**: módulo `PlayerOfTheDay` (banda editorial a 2
    columnas: pregunta H2 "¿Qué pala usa X?" + specs dl + 2 facts en bullets + foto real
    sobre fondo blanco con halo lima/naranja por deporte) alimentado por
    `src/data/daily-player.ts`: 14 jugadores (8 pádel + 6 tenis), 3 facts ES+EN verificados
    cada uno (torneos de esta semana, specs del catálogo, precios reales), rotación
    `dayOfYear % 14` + `revalidate = 6h` (ISR recoge el cambio de jugador sin redeploy).
    Homepage con claves nuevas ES/EN. Verificado: build OK, check:translations OK, ES/EN
    a 200 con imagen real cargada, specs localizadas ("High" en EN), sin overflow en
    375px, dark theme OK (card rgb(23,27,39)). Screenshots:
    docs/screenshots/2026-09-15-jugador-del-dia{,-dark,-mobile}.png. Archivos:
    src/data/daily-player.ts (nuevo), src/components/PlayerOfTheDay.tsx (nuevo),
    src/app/[locale]/page.tsx, src/i18n/locales.ts, globals.css (halos).
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

- 2026-09-22 — **Regla 0 (Davis Cup Qualifiers 2ª ronda CERRADA, resultados del
  18-20 sep)**: publicado `davis-cup-2026-final-8-bolonia-clasificados` (ES+EN) con
  el cuadro definitivo del Final 8 de Bolonia (24-29 nov): Italia (anfitriona, busca
  el 4º título seguido) + España, Alemania, Gran Bretaña, Austria, Canadá, Chequia y
  Corea del Sur. Datos CLAVE verificados: Praga Chequia 3-2 USA (viernes 1-1: Tien
  d. Mensik 6-2 6-4, Lehecka d. Shelton 6-4 6-4; sábado dobles Harrison-Krajicek
  d. [pareja checa] salvando 4 MP → 2-1 USA; Lehecka d. Tien 6-3 7-5 y Mensik d.
  Shelton 5-7 6-4 6-3); Québec Canadá 3-1 Francia (Draxl d. Rinderknech 6-2 7-5;
  FAA d. Halys 7-6(5) 4-6 6-3; Bonzi-Herbert d. Chan-FAA 7-6(4) 6-3; FAA d.
  Rinderknech 4-6 7-6(4) 6-4 clausura); Halle Alemania 3-2 Croacia (Krawietz-Pütz d.
  Pavic-Mektic 7-5 6-2; Zverev d. Prizmic 6-2 6-4 el domingo); Santiago España 4-0
  Chile sin ceder un partido (Jodar d. Garín 6-0 6-2, debut + 20-4 en tierra 2026;
  Mérida d. Tabilo 5-7 6-3 6-3; dobles Martínez-Munar 6-0 6-3; Ferrer capitán; la
  incógnita Alcaraz para noviembre); Londres GB 4-0 Ecuador (Samuel 4-6 6-4 6-1
  debut; Fery 7-5 6-0; Patten-Skupski; Wendelken) 1er Final 8 desde 2023; Seúl Corea
  3-1 India (Kwon d. Nagal 6-1 6-2); Viena Austria 3-1 Bélgica (Rodionov d. Bergs
  7-6(6) 6-3). Bola extra: Grupo Mundial I, Rune (Dinamarca 3-2 Bulgaria) d.
  Dimitrov 3-6 6-3 7-6(4) con Pure Aero 98. Tabla de demanda real: no se tocó (todo
  ✓; Kwon Soon-woo y Rodionov no usan marcos del catálogo — no añadir sin fuente).
  HUECOS: seguir abiertos la Gravity Tour estándar (no-Zverev) y las Wilson no
  retail de Tien; el cron de noticias del lunes 28 tiene Laver Cup (resultados
  25-27) y Rotterdam P2 (arranca 28 sep) como agenda natural.

- 2026-09-21 — **Regla 0 (Laver Cup Londres 25-27 sep, arranca el viernes)**: publicada
  `laver-cup-2026-londres-raquetas` (ES+EN) con el arsenal completo de las dos selecciones
  y 4 páginas de jugador nuevas (Rafael Jodar, Taylor Fritz, Jakub Menšík, Brandon
  Nakashima) vía campos `player` ampliados y verificados. Plantillas oficiales
  (lavercup.com): Europa = Alcaraz, Zverev, Mensik, Cobolli, Jodar, Ruud; Mundo = Fritz,
  De Minaur, Nakashima, Bublik, Tien, Cerúndolo. Capitanes Noah (Europa) y Agassi (Mundo);
  el Mundo defiende el 15-9 de San Francisco 2025. Formato: primero a 13 puntos, 4 partidos
  viernes + 4 sábado + hasta 4 domingo (sesiones 14:00/20:00 hora española). Raquetas
  verificadas: Alcaraz Pure Aero 98, Zverev Gravity Tour Zverev 2026, Mensik Blade v10
  (PR oficial Wilson), Jodar Speed MP 2026 (tennisexpress), Cobolli familia Radical (Pro
  retail, pro stock TGT), Ruud EZONE 100 (endoso; molde DR 100), Fritz Radical MP (pro
  stock TGT 260.3, 18x20), De Minaur Wilson Ultra Pro 99, Nakashima VCORE 98 (iq.tennis),
  Bublik Diadem Project Bublik 98 (firma, único no gran marca; debut), Tien Wilson molde
  NO retail, Cerúndolo Prestige PT57A pro stock (18x20, ~350 g). HUECOS para futuros
  crons: (1) la Head Gravity Tour estándar (no-Zverev) sigue sin estar en catálogo (nota
  del 14 sep); (2) para el cron de noticias del lunes 28: resultados del fin de semana de
  Laver Cup (25-27) y arranque del Rotterdam P2 de Premier Padel (28 sep-4 oct); (3) la
  Wilson Ultra Pro 99 de De Minaur y la Diadem Project Bublik 98 podrían ser altas
  futuras si hay fuentes retail con foto verificable. Tabla de demanda real: no se tocó
  (todo ✓); Fritz y Jodar ahora tienen página limpia, candidatos a vigilar en Search
  Console (Laver Cup = pico de búsquedas "qué raqueta usa X").
- 2026-09-19 — **Regla 0 (Davis Cup Qualifiers 2ª ronda, EN MARCHA 18-20 sep)**: publicada
  `davis-cup-2026-sabado-decisivo` (ES+EN) con los resultados del viernes y la jornada
  decisiva del sábado. Datos CLAVE verificados del viernes: Praga 1-1 (Tien d. Mensik
  6-2 6-4, debut DC + 15 UE vs 34; Lehecka d. Shelton 6-4 6-4, Shelton sin ritmo tras
  la final del US Open — AP), Québec 1-0 (Draxl d. Rinderknech 6-2 7-5 — Tennis Canada,
  "career-best win"). Sábado: Praga dobles + Mensik-Shelton y Lehecka-Tien (tennisuptodate);
  Québec dobles Chan-FAA vs Bonzi-Herbert (TSN) + reverse singles si hace falta; Halle
  arranca 14:00 local (12:00 UTC) con Zverev-Matej Dodig y Altmaier-Prizmic (tennistemple);
  domingo en Halle dobles + reverse desde las 12:00 (tenniswatcher). PENDIENTE de verificar
  al cierre de esta noche: resultado FAA–Halys (partido nocturno del viernes, no publicado
  a la hora de escribir — se formuló como condicional con fuente de Tennis Canada) y los
  ganadores de hoy — el cron de noticias del lunes puede cerrar la ronda con los 7
  clasificados a Bolonia. Laver Cup Londres 25-27 sep (candidata Regla 0 para el domingo/
  lunes). Tabla de demanda real: no se tocó (todo ✓). HUECOS: ninguno nuevo; para palas
  seguiría abierta la Gravity Tour estándar (no-Zverev) anotada el 14 sep.
- 2026-09-18 — **Regla 0 (Davis Cup Qualifiers 2ª ronda, EN MARCHA 18-20 sep)**: publicada
  `davis-cup-2026-eliminatorias-raquetas` (ES+EN) con las raquetas del catálogo en Praga
  (EZONE 98 de Shelton, familia VCORE de Macháč), Québec (Pure Aero 98 de FAA), Halle
  (Gravity Tour de Zverev) y Viena (familia TFight de Blockx). Alta de Félix
  Auger-Aliassime en el campo `player` de la Pure Aero 98 (verificado en babolat.com) →
  página /jugadores/felix-auger-aliassime nueva. Datos CLAVE del fin de semana (para
  futuras piezas/el cron de noticias del lunes): USA sin Fritz y Paul (entran Tien nº13
  y Damm #104); viernes en Praga Tien–Mensik y Shelton–Lehecka; el sorteo de Québec dejó
  a Fils fuera de la hoja (Rinderknech y Halys individuales; FAA juega singles y dobles,
  debut de Duncan Chan); Alemania-Croacia el sábado en Halle con Zverev nº2. Laver Cup
  Londres 25-27 sep (candidata Regla 0 para el domingo/lunes) y Rotterdam P2 desde el 28.
  No se tocó la tabla de demanda real (todo ✓). HUECO detectado para el cron de palas:
  ninguna pala nueva; para jugadores: Learner Tien juega una Wilson (mold no retail,
  fuentes contradictorias: Ultra vs Blade Pro — no añadir al catálogo sin fuente oficial
  de marca).
- 2026-09-17 — Sin torneo en curso (US Open y Paris Major cerraron el 13; **Davis Cup
  Qualifiers 2ª ronda juega 18-20 sep** → candidato Regla 0 para mañana: verificar
  selecciones y raquetas de jugadores en catálogo antes de escribir) → backlog: item 3
  Visual "ProductCard premium". Detalle de datos: `getBestPrice` mezcla precios reales y
  sintéticos; para el badge se creó `src/data/real-best-price.ts` (solo JSON scrapeados,
  client-safe). IMPORTANTE para futuras mejoras: en 21 productos el mínimo mostrado en
  cards SIN badge sigue siendo sintético (más bajo que el real) — si algún día se quiere
  pureza total de precios, queda pendiente decidir qué se muestra cuando no hay precio
  real (PVP a secas vs "desde" sintético). El umbral del badge es ≥10% real; subirlo a
  ≥15% dejaría 50 productos con badge, bajarlo a ≥5% daría 66.

- 2026-09-16 — Sin torneo en curso (US Open y Paris Major cerraron el 13; Davis Cup
  18-20, Laver Cup 25-27, Rotterdam P2 empieza el 28) → backlog: item 2 Visual
  "Blossom Carousel en homepage" implementado (ver sección 🎨 Visual). Detalle
  técnico: el CSS del paquete declara su @layer DESPUÉS que Tailwind, así que sus
  reglas pisan utilidades (ej. `md:hidden` en los dots) — el theming de Blossom va
  en CSS propio (globals.css, bloque .pc-blossom*). OJO con ISR en local: `next
  start` cachea la homepage 6 h (revalidate 21600); tras cambiar page.tsx hay que
  reiniciar el server para verificar. El autoplay de ofertas es código propio
  (hooks en ProductCarousel.tsx): si algún día Blossom saca autoplay nativo,
  migrar. verify-blossom.mts queda en scripts/ para re-verificar tras toques
  (arranca server propio si BASE no responde). Próxima cita Regla 0: Davis Cup
  Qualifiers 2ª ronda (18-20 sep) — verificar qué selecciones juegan y si hay
  raquetas de jugadores en catálogo antes de escribir.

- 2026-09-15 — Sin torneo en curso (US Open y Paris Major cerraron el 13; Davis Cup
  18-20, Laver Cup 25-27, Rotterdam P2 empieza el 28) → backlog: item 12 🔝
  "Jugador del día" implementado (ver sección 🎨 Visual / Jugadores). La rotación
  diaria hace que la portada muestre a Ari Sánchez hoy (índice 258 % 14 = 6). Para
  MEJORAR EL MÓDULO cuando toque: los facts caducan con los torneos (ej. "campeón
  del US Open 2026" vale un año; "nueva nº1" vale hasta el siguiente cambio) —
  re-verificar al editar daily-player.ts; añadir jugadores es copiar un bloque.
  NOTA RYBAKINA: la final femenina la ganó Rybakina 6-4 5-7 6-2 (Guardian/usopen),
  no Sabalenka — la pieza del 12 sep la anticipaba como "hoy se juega", sin
  resultado, así que no hubo que corregir nada. Próximas citas para Regla 0:
  Davis Cup Qualifiers 2ª ronda (18-20 sep), Laver Cup Londres (25-27),
  Rotterdam P2 (28 sep-4 oct), Alemania P2 (5-11 oct), Milano P1 (12-18 oct).

- 2026-09-14 — Regla 0 (US Open): publicada la crónica de la final masculina
  `us-open-2026-final-zverev-gravity-tour` (Zverev d. Shelton 6-3 7-6(2) 5-7 6-2) y
  dada de alta la **Head Gravity Tour Zverev 2026** (280 €, specs oficiales, foto real
  verificada) → nueva página /jugadores/alexander-zverev. Corregido en el artículo
  nuevo el error de la pieza de cuartos (Zverev juega Gravity Tour, no Speed MP) con
  Callout transparente. RESULTADOS PARIS MAJOR (para el cron de noticias del lunes):
  campeones **Tapia-Coello** (tetra en París, reedición exacta de la final 2025) y
  **Ari Sánchez–Andrea Ustero** (primer Major juntas; la final femenina era la
  inédita Fernández-Calvo). 81.000 espectadores en la semana (premierpadel.com).
  HUECO detectado: la Gravity Tour estándar (no Zverev) no está en el catálogo; el
  cron de palas puede valorarla. Tabla de demanda real: todo ✓ (no se tocó).
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