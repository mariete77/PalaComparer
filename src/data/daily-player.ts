// El jugador del día de la portada.
//
// POR QUÉ: "qué pala usa X" es el patrón de consulta con más volumen del nicho
// en español, y la portada no le daba salida. Este módulo rota un jugador al
// día con su pala del catálogo y 3 datos verificados (el mismo dato que
// responde /jugadores/<slug>, donde enlaza).
//
// CÓMO SE ROTA: índice = dayOfYear % FEATURES.length. Es determinista, así que
// el HTML prerenderizado es idéntico en todos los builds del mismo día y el
// jugador cambia solo al cambiar la fecha. La página declara `revalidate = 6h`
// para que ISR recoja el cambio sin redeploy.
//
// REGLA DE DATOS: cada fact lleva `since` (fecha de verificación) y solo se
// usan hechos comprobados en fuentes oficiales (premierpadel.com, usopen.org,
// atptour.com, webs de marca) — en su mayoría ya publicados y citados en
// nuestras noticias de los últimos días. Nada de rumores ni datos sin fuente.
// Al añadir una feature, dejar pasar los torneos que caduquen el dato
// (ej. "campeón de X" aguanta hasta la siguiente edición) y re-verificar.

import type { Product } from "./products";
import { PRODUCTS } from "./products";

export interface PlayerFact {
  /** Dato corto y concreto, ya traducido. */
  es: string;
  en: string;
  /** Fecha en la que se verificó (YYYY-MM-DD). Para auditar la frescura. */
  since: string;
}

export interface DailyPlayer {
  /** Slug de /jugadores/<slug> (playerSlug del nombre). */
  slug: string;
  /** Nombre canónico del jugador. */
  name: string;
  /** ID del producto del catálogo que usa ahora mismo. */
  productId: string;
  facts: [PlayerFact, PlayerFact, PlayerFact];
}

function product(id: string): Product {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) throw new Error(`DailyPlayer: producto "${id}" no existe en el catálogo`);
  return p;
}

export const DAILY_PLAYER_FEATURES: DailyPlayer[] = [
  {
    slug: "agustin-tapia",
    name: "Agustín Tapia",
    productId: "nox-at10-genius-18k-2026",
    facts: [
      {
        es: "Nº1 del mundo y campeón del Paris Major 2026 con Coello: su cuarto título consecutivo en Roland-Garros.",
        en: "World No. 1 and 2026 Paris Major champion with Coello — his fourth straight title at Roland-Garros.",
        since: "2026-09-14",
      },
      {
        es: "Juega la Nox AT10 Luxury Genius 18K Alum: lágrima, 360-375 g y carbono 18K con aluminio.",
        en: "Plays the Nox AT10 Luxury Genius 18K Alum: teardrop shape, 360-375 g and 18K carbon with aluminium.",
        since: "2026-09-14",
      },
      {
        es: "La AT10 es su línea firma desde 2019; en el catálogo hay 5 modelos, desde la Pro Cup Soft (199,99 €) hasta la 18K.",
        en: "The AT10 has been his signature line since 2019; the catalogue carries 5 models, from the Pro Cup Soft (€199.99) up to the 18K.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "arturo-coello",
    name: "Arturo Coello",
    productId: "head-coello-pro-2026",
    facts: [
      {
        es: "Nº1 del mundo junto a Tapia: tetra campeón del Paris Major (2023-2026), reeditando la final exacta de 2025.",
        en: "World No. 1 alongside Tapia: four-time Paris Major champion (2023-2026), replaying the exact 2025 final.",
        since: "2026-09-14",
      },
      {
        es: "Su pala firma es la Head Coello Pro 2026: lágrima, balance medio, núcleo FOAM y caras de carbono 12K.",
        en: "His signature racket is the Head Coello Pro 2026: teardrop, medium balance, FOAM core and 12K carbon faces.",
        since: "2026-09-14",
      },
      {
        es: "En el catálogo tiene además la Coello Motion (redonda, balance bajo) para quien busque su juego con más control.",
        en: "The catalogue also carries the Coello Motion (round, low balance) for those who want his game with extra control.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "juan-lebron",
    name: "Juan Lebrón",
    productId: "babolat-viper-3-0-2026-juan-lebron",
    facts: [
      {
        es: "Primer español nº1 del ranking masculino; en el Paris Major 2026 cayó en semis con Augsburger ante los campeones.",
        en: "First Spanish male world No. 1; at the 2026 Paris Major he fell in the semis with Augsburger against the champions.",
        since: "2026-09-14",
      },
      {
        es: "Juega la Babolat Viper 3.0: diamante, 365-375 g, balance alto y caras de carbono 3K — pura potencia.",
        en: "Plays the Babolat Viper 3.0: diamond, 365-375 g, high balance and 3K carbon faces — pure power.",
        since: "2026-09-14",
      },
      {
        es: "Es el jugador con más palas propias del catálogo: 6 modelos Babolat de su línea Viper.",
        en: "He has the most signature rackets in the catalogue: 6 Babolat models from his Viper line.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "federico-chingotto",
    name: "Federico Chingotto",
    productId: "bullpadel-neuron-02-edge-2027",
    facts: [
      {
        es: "Campeón del Madrid P1 2026 con Galán (7º título del año) y subcampeón del Paris Major tras caer con Coello-Tapia.",
        en: "2026 Madrid P1 champion with Galán (7th title of the year) and Paris Major runner-up, falling to Coello-Tapia.",
        since: "2026-09-14",
      },
      {
        es: "Estrenó la Bullpadel Neuron 02 Edge 2027 en París: diamante, 365-375 g y carbono X-Tend 3K.",
        en: "He debuted the Bullpadel Neuron 02 Edge 2027 in Paris: diamond, 365-375 g and X-Tend 3K carbon.",
        since: "2026-09-14",
      },
      {
        es: "La Neuron 02 Edge es lo más nuevo de su línea en el catálogo (339,99 €), junto a la Neuron 02 2026.",
        en: "The Neuron 02 Edge is the newest of his line in the catalogue (€339.99), alongside the Neuron 02 2026.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "tino-libaak",
    name: "Tino Libaak",
    productId: "siux-diablo-pro-2026",
    facts: [
      {
        es: "Con Alfonso apeó a los campeones de 2025 (Lebrón-Augsburger) en el Madrid P1 2026, la sorpresa del torneo.",
        en: "With Alfonso he knocked out the 2025 champions (Lebrón-Augsburger) at the 2026 Madrid P1 — the upset of the tournament.",
        since: "2026-09-14",
      },
      {
        es: "Juega la Siux Diablo Pro: forma híbrida, 355-375 g y caras de carbono 18K TeXtreme + 3K.",
        en: "Plays the Siux Diablo Pro: hybrid shape, 355-375 g and 18K TeXtreme + 3K carbon faces.",
        since: "2026-09-14",
      },
      {
        es: "La Diablo Pro 2026 (350 €) es una de las gambas altas del catálogo Siux, la marca de los orígenes de Libaak.",
        en: "The Diablo Pro 2026 (€350) is one of the top-end Siux rackets in the catalogue — the brand of Libaak's roots.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "delfi-brea",
    name: "Delfi Brea",
    productId: "bullpadel-vertex-05-woman-2026",
    facts: [
      {
        es: "Nº1 del mundo junto a Triay; en el Paris Major 2026 cayeron en semis ante las futuras campeonas Calvo-Fernández.",
        en: "World No. 1 alongside Triay; at the 2026 Paris Major they fell in the semis to eventual champions Calvo-Fernández.",
        since: "2026-09-14",
      },
      {
        es: "Juega la Bullpadel Vertex 05 Woman: diamante, 350-360 g y caras Fibrix, su pala de competición.",
        en: "Plays the Bullpadel Vertex 05 Woman: diamond, 350-360 g and Fibrix faces — her competition racket.",
        since: "2026-09-14",
      },
      {
        es: "La Vertex 05 Woman está en el catálogo a 158,95 €: una de las palas de la nº1 más asequibles del mercado.",
        en: "The Vertex 05 Woman sits at €158.95 in the catalogue: one of the most affordable No.1 rackets on the market.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "ari-sanchez",
    name: "Ari Sánchez",
    productId: "adidas-arrow-hit-light-2026",
    facts: [
      {
        es: "Campeona del Paris Major 2026 con Ustero: su primer Major juntas, venciendo a Ortega-Araújo en la final.",
        en: "2026 Paris Major champion with Ustero: their first Major together, beating Ortega-Araújo in the final.",
        since: "2026-09-14",
      },
      {
        es: "Juega la Adidas Arrow HIT Light: diamante, 345-360 g, balance alto y caras de carbono ASC.",
        en: "Plays the Adidas Arrow HIT Light: diamond, 345-360 g, high balance and ASC carbon faces.",
        since: "2026-09-14",
      },
      {
        es: "La Arrow HIT Light (229,95 €) es la versión aligerada de su línea: la pala de una campeona de Major por menos de 230 €.",
        en: "The Arrow HIT Light (€229.95) is the lightened version of her line: a Major champion's racket under €230.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "ale-galan",
    name: "Ale Galán",
    productId: "adidas-metalbone-2026",
    facts: [
      {
        es: "Campeón del Madrid P1 2026 con Chingotto y subcampeón del Paris Major; una de las parejas del año.",
        en: "2026 Madrid P1 champion with Chingotto and Paris Major runner-up — one of the pairs of the year.",
        since: "2026-09-14",
      },
      {
        es: "Juega la Adidas Metalbone: diamante, 345-360 g y carbono aluminizado 16K, con pesos extra de 11 g ajustables.",
        en: "Plays the Adidas Metalbone: diamond, 345-360 g and aluminised 16K carbon, with adjustable 11 g extra weights.",
        since: "2026-09-14",
      },
      {
        es: "La Metalbone HRD+ (252 €), su versión endurecida, también está en el catálogo para golpear como él.",
        en: "The Metalbone HRD+ (€252), his hardened version, is also in the catalogue for hitting like him.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "carlos-alcaraz",
    name: "Carlos Alcaraz",
    productId: "babolat-pure-aero-2026",
    facts: [
      {
        es: "Cayó en cuartos del US Open 2026 ante Shelton en el partido más tardío de la historia del torneo (último saque: 146 mph).",
        en: "Fell in the 2026 US Open quarter-finals to Shelton in the latest match in tournament history (final serve: 146 mph).",
        since: "2026-09-14",
      },
      {
        es: "Juega la Babolat Pure Aero Gen 9: 100 in², 318 g encordada, 16x19 y 67 RA, la raqueta del spin desde junior.",
        en: "Plays the Babolat Pure Aero Gen 9: 100 in², 318 g strung, 16x19 and 67 RA — his spin racket since juniors.",
        since: "2026-09-14",
      },
      {
        es: "En el catálogo también está la Pure Aero 98 (323 g, 16x20) que comparte con Holger Rune, para más control.",
        en: "The catalogue also carries the Pure Aero 98 (323 g, 16x20) he shares with Holger Rune, for extra control.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "ben-shelton",
    name: "Ben Shelton",
    productId: "yonex-ezone-98-2025",
    facts: [
      {
        es: "Finalista del US Open 2026: apeó a Alcaraz en cuartos y a Tiafoe en semis antes de caer con Zverev.",
        en: "2026 US Open runner-up: he knocked out Alcaraz in the quarters and Tiafoe in the semis before falling to Zverev.",
        since: "2026-09-14",
      },
      {
        es: "Juega la Yonex EZONE 98 (8ª gen): 98 in², 320 g, 16x19 y 63 RA, con el punto dulce ISOMETRIC ampliado.",
        en: "Plays the Yonex EZONE 98 (8th gen): 98 in², 320 g, 16x19 and 63 RA, with the widened ISOMETRIC sweet spot.",
        since: "2026-09-14",
      },
      {
        es: "La semifinal 100% americana y 100% Yonex ante Tiafoe garantizaba un local en la final, algo que no pasaba desde Roddick (2004).",
        en: "The all-American, all-Yonex semi against Tiafoe guaranteed a home finalist — unheard of since Roddick (2004).",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "frances-tiafoe",
    name: "Frances Tiafoe",
    productId: "yonex-percept-97-2023",
    facts: [
      {
        es: "Semifinalista del US Open 2026: cayó con Shelton 4-6 6-3 6-3 7-5 en la semifinal 100% americana y 100% Yonex.",
        en: "2026 US Open semi-finalist: fell to Shelton 4-6 6-3 6-3 7-5 in the all-American, all-Yonex semi-final.",
        since: "2026-09-14",
      },
      {
        es: "Juega la Yonex Percept 97: 97 in², 310 g y 61 RA — una de las raquetas más controladas del circuito.",
        en: "Plays the Yonex Percept 97: 97 in², 310 g and 61 RA — one of the most control-oriented rackets on tour.",
        since: "2026-09-14",
      },
      {
        es: "La Percept 97 (249,95 €) también la firma Hurkacz en el catálogo: control de élite por menos de 250 €.",
        en: "The Percept 97 (€249.95) is also signed by Hurkacz in the catalogue: elite control under €250.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "alexander-zverev",
    name: "Alexander Zverev",
    productId: "head-gravity-tour-zverev-2026",
    facts: [
      {
        es: "Campeón del US Open 2026 (6-3 7-6(2) 5-7 6-2 a Shelton): segundo Slam del año y primer alemán campeón desde Becker (1996).",
        en: "2026 US Open champion (6-3 7-6(2) 5-7 6-2 over Shelton): second Slam of the year and first German champion since Becker (1996).",
        since: "2026-09-14",
      },
      {
        es: "Juega la Head Gravity Tour Zverev 2026: 98 in², 323 g, 16x19 y 61 RA, la edición limitada lanzada tras Roland Garros.",
        en: "Plays the Head Gravity Tour Zverev 2026: 98 in², 323 g, 16x19 and 61 RA — the limited edition launched after Roland Garros.",
        since: "2026-09-14",
      },
      {
        es: "Llegó a la final con 44-1 contra zurdos desde Roland Garros 2023; la Gravity Tour Zverev está a 280 € en el catálogo.",
        en: "He reached the final 44-1 against lefties since Roland Garros 2023; the Gravity Tour Zverev sits at €280 in the catalogue.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "coco-gauff",
    name: "Coco Gauff",
    productId: "head-boom-mp-2026",
    facts: [
      {
        es: "Semifinalista del US Open 2026: salvó 2 puntos de partido ante Andreeva antes de caer con Rybakina.",
        en: "2026 US Open semi-finalist: saved 2 match points against Andreeva before falling to Rybakina.",
        since: "2026-09-14",
      },
      {
        es: "Juega la Head Boom MP 2026: 100 in², 312 g, 16x19 y 61 RA, con el núcleo ampliado para potencia fácil.",
        en: "Plays the Head Boom MP 2026: 100 in², 312 g, 16x19 and 61 RA, with the enlarged core for easy power.",
        since: "2026-09-14",
      },
      {
        es: "La Boom MP (259,95 €) es una de las raquetas de WTA más accesibles del catálogo: la de Gauff por menos de 260 €.",
        en: "The Boom MP (€259.95) is one of the most accessible WTA rackets in the catalogue: Gauff's for under €260.",
        since: "2026-09-14",
      },
    ],
  },
  {
    slug: "elena-rybakina",
    name: "Elena Rybakina",
    productId: "yonex-vcore-100-2026",
    facts: [
      {
        es: "Campeona del US Open 2026 (6-4 5-7 6-2 a Sabalenka) y nueva nº1 del mundo desde este lunes.",
        en: "2026 US Open champion (6-4 5-7 6-2 over Sabalenka) and the new world No. 1 as of Monday.",
        since: "2026-09-14",
      },
      {
        es: "Juega la Yonex VCORE 100 (8ª gen): 100 in², 300 g, 16x19 y 65 RA, la versión de spin de la línea.",
        en: "Plays the Yonex VCORE 100 (8th gen): 100 in², 300 g, 16x19 and 65 RA — the spin version of the line.",
        since: "2026-09-14",
      },
      {
        es: "En el catálogo también está la VCORE 98 (8ª gen) que comparte con Hurkacz, más orientada al control.",
        en: "The catalogue also carries the VCORE 98 (8th gen) she shares with Hurkacz, more control-oriented.",
        since: "2026-09-14",
      },
    ],
  },
];

/**
 * El jugador destacado de hoy (UTC). Determinista por fecha: mismo jugador
 * durante todo el día en ES y EN, sin importar cuándo se genere el build.
 */
export function getDailyPlayer(date: Date = new Date()): {
  feature: DailyPlayer;
  product: Product;
} {
  const dayOfYear = Math.floor(
    (date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86_400_000
  );
  const feature = DAILY_PLAYER_FEATURES[dayOfYear % DAILY_PLAYER_FEATURES.length];
  return { feature, product: product(feature.productId) };
}

/** Para pre-render estático: el módulo solo depende de PRODUCTS, no de fetch. */
export function dailyPlayerProduct(id: string): Product {
  return product(id);
}
