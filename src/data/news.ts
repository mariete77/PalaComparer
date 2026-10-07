// Índice de noticias y guías.
//
// Cada artículo vive en src/content/noticias/<slug>.mdx y exporta su propio
// `metadata`. Este fichero solo los registra: para publicar uno nuevo basta con
// crear el .mdx y añadir una línea en ARTICLES.
//
// El contenido es bilingüe (ES/EN). Los MDX en español siguen siendo la fuente
// para el cuerpo ES; el cuerpo EN vive en src/content/noticias/en/<slug>.mdx.
// Los metadatos EN (title/excerpt/tags) se mantienen aquí, junto al registro,
// para no duplicarlos dentro de cada .mdx.

import type { Sport } from "./products";
import type { Locale, LocalizedText } from "@/i18n/locales";
import { localePath } from "@/i18n/locales";

export type ArticleKind = "guia" | "analisis" | "novedad";

export interface ArticleMeta {
  /** Título localizado. */
  title: LocalizedText;
  /** Entradilla para el listado y la meta description. */
  excerpt: LocalizedText;
  /** ISO YYYY-MM-DD */
  date: string;
  author: string;
  kind: ArticleKind;
  /** A qué catálogo pertenece. `ambos` aparece en los dos filtros. */
  sport: Sport | "ambos";
  /** Etiquetas localizadas. */
  tags: LocalizedText[];
  /** Minutos de lectura estimados. */
  readingMinutes: number;
  /** Ids de productos tratados en el artículo (enlaces cruzados). */
  relatedProducts?: string[];
}

export interface Article extends ArticleMeta {
  slug: string;
}

import { metadata as formasDePala } from "@/content/noticias/formas-de-pala-cual-te-toca.mdx";
import { metadata as carbono } from "@/content/noticias/carbono-3k-12k-18k-diferencias.mdx";
import { metadata as iniciacion } from "@/content/noticias/palas-iniciacion-que-mirar.mdx";
import { metadata as tamis } from "@/content/noticias/tamis-y-patron-de-cuerdas.mdx";
import { metadata as gamaAlta } from "@/content/noticias/gama-alta-2025-2026-tendencias.mdx";
import { metadata as calidadPrecio } from "@/content/noticias/mejores-palas-calidad-precio-2026.mdx";
import { metadata as sudafrica } from "@/content/noticias/triay-brea-chingalan-campeones-sudafrica.mdx";
import { metadata as london } from "@/content/noticias/london-p1-primer-torneo-londres.mdx";
import { metadata as malaga } from "@/content/noticias/malaga-p1-numeros-1-martin-carpena.mdx";
import { metadata as fanatics } from "@/content/noticias/premier-padel-fanatics-acuerdo-licencias.mdx";
import { metadata as londonCampeones } from "@/content/noticias/london-p1-2026-campeones-calvo-coello.mdx";
import { metadata as stupaczukSanz } from "@/content/noticias/stupaczuk-jon-sanz-nueva-pareja-p1-madrid.mdx";
import { metadata as alexRuizCristal } from "@/content/noticias/alex-ruiz-ileso-rotura-cristal-fip-gold-san-luis.mdx";
import { metadata as madridP1 } from "@/content/noticias/madrid-p1-2026-lucha-por-el-numero-uno.mdx";
import { metadata as madridP1Palas } from "@/content/noticias/madrid-p1-2026-palas-cuartos-final.mdx";
import { metadata as usOpenRaquetas } from "@/content/noticias/us-open-2026-raquetas-cuartos-final.mdx";
import { metadata as parisMajorPrevia } from "@/content/noticias/paris-major-2026-previa-roland-garros.mdx";
import { metadata as parisMajorDieciseisavos } from "@/content/noticias/paris-major-2026-dieciseisavos-revancha-chatrier.mdx";
import { metadata as madridP1Campeones } from "@/content/noticias/madrid-p1-2026-campeones-chingalan-triay-brea.mdx";
import { metadata as aleSalazarDespedida } from "@/content/noticias/alejandra-salazar-despide-madrid-p1.mdx";
import { metadata as parisMajorCuartos } from "@/content/noticias/paris-major-2026-cuartos-goni-alonso.mdx";
import { metadata as usOpenMartesYonex } from "@/content/noticias/us-open-2026-martes-cuartos-yonex.mdx";
import { metadata as usOpenSemifinalesYonex } from "@/content/noticias/us-open-2026-semifinales-tiafoe-shelton-yonex.mdx";
import { metadata as usOpenFinalFemenina } from "@/content/noticias/us-open-2026-final-femenina-blade-vcore.mdx";
import { metadata as usOpenFinalMasculina } from "@/content/noticias/us-open-2026-final-zverev-gravity-tour.mdx";
import { metadata as parisMajorFinales } from "@/content/noticias/paris-major-2026-dia-de-finales-coello-tapia-galan-chingotto.mdx";
import { metadata as parisMajorCampeones } from "@/content/noticias/paris-major-2026-campeones-coello-tapia-tetra-sanchez-ustero.mdx";
import { metadata as davisCupEliminatorias } from "@/content/noticias/davis-cup-2026-eliminatorias-raquetas.mdx";
import { metadata as davisCupSabado } from "@/content/noticias/davis-cup-2026-sabado-decisivo.mdx";
import { metadata as laverCupLondres } from "@/content/noticias/laver-cup-2026-londres-raquetas.mdx";
import { metadata as laverCupDia1 } from "@/content/noticias/laver-cup-2026-dia-1-jodar-europa-3-1.mdx";
import { metadata as laverCupDomingo } from "@/content/noticias/laver-cup-2026-domingo-decisivo-europa-7-5.mdx";
import { metadata as espanaPrelistaMundial } from "@/content/noticias/espana-prelista-mundial-qatar-2026.mdx";
import { metadata as espanaConvocatoriaMundial } from "@/content/noticias/espana-convocatoria-mundial-qatar-2026-palas.mdx";
import { metadata as davisCupFinal8 } from "@/content/noticias/davis-cup-2026-final-8-bolonia-clasificados.mdx";
import { metadata as fipPlatinumLyon } from "@/content/noticias/fip-platinum-lyon-2026-palas-favoritos.mdx";
import { metadata as fipPlatinumLyonOctavos } from "@/content/noticias/fip-platinum-lyon-2026-octavos-garrido-sanyo-fuera.mdx";
import { metadata as rotterdamP2Race } from "@/content/noticias/rotterdam-p2-2026-race-numero-uno-palas.mdx";
import { metadata as rotterdamP2Jornada1 } from "@/content/noticias/rotterdam-p2-2026-cuadro-final-jornada-1.mdx";
import { metadata as rotterdamP2Sorpresa } from "@/content/noticias/rotterdam-p2-2026-primera-sorpresa-goni-alonso.mdx";
import { metadata as chinaOpenDjokovic } from "@/content/noticias/china-open-2026-djokovic-beijing-raquetas.mdx";
import { metadata as juegosSudamericanos } from "@/content/noticias/juegos-sudamericanos-2026-primeros-oros-padel.mdx";
import { metadata as rotterdamP2Cuartos } from "@/content/noticias/rotterdam-p2-2026-cuartos-libaak-alfonso-premio-envenenado.mdx";
import { metadata as rotterdamP2Semis } from "@/content/noticias/rotterdam-p2-2026-semifinales-revolucion.mdx";
import { metadata as rotterdamP2Finales } from "@/content/noticias/rotterdam-p2-2026-dia-de-finales.mdx";
import { metadata as rotterdamP2Campeones } from "@/content/noticias/rotterdam-p2-2026-campeones-coello-tapia-sanchez-ustero.mdx";
import { metadata as chinaOpenSemis } from "@/content/noticias/china-open-2026-semifinales-djokovic-record-nadal.mdx";
import { metadata as chinaOpenFinal } from "@/content/noticias/china-open-2026-final-djokovic-de-minaur.mdx";
import { metadata as chinaOpenCampeon } from "@/content/noticias/china-open-2026-djokovic-campeon-102-titulos.mdx";

/**
 * Traducciones EN de los metadatos de cada artículo. Las ES vienen del propio
 * .mdx (su `metadata`); las EN se mantienen aquí para no tocar el frontmatter
 * original y centralizar el trabajo de traducción.
 */
const EN_META: Record<string, { title: string; excerpt: string; tags: string[] }> = {
  "formas-de-pala-cual-te-toca": {
    title: "Round, teardrop or diamond: which paddle shape is for you",
    excerpt:
      "The shape decides where the sweet spot sits and how much it forgives your mishits. It's the first decision — and the one most people skip.",
    tags: ["Shapes", "Beginners", "Buying guide"],
  },
  "carbono-3k-12k-18k-diferencias": {
    title: "Carbon 3K, 12K and 18K: what actually changes",
    excerpt:
      "The number doesn't measure quality, it measures the weave. And it affects feel more than power. What each figure means and when you'll notice the difference.",
    tags: ["Materials", "Carbon", "Buying guide"],
  },
  "palas-iniciacion-que-mirar": {
    title: "Your first paddle: the four numbers that matter",
    excerpt:
      "Weight, balance, hardness and shape. With those you'll choose well without overspending — and without ending up with a pro paddle you can't use.",
    tags: ["Beginners", "Buying guide", "Budget"],
  },
  "tamis-y-patron-de-cuerdas": {
    title: "Head size, string pattern and swingweight: reading a racket's spec sheet",
    excerpt:
      "Seven numbers almost nobody checks — and they explain why one racket suits you and another doesn't. With examples from the catalog.",
    tags: ["Specs", "Buying guide", "Stringing"],
  },
  "gama-alta-2025-2026-tendencias": {
    title: "What our catalog says about the 2025-2026 premium segment",
    excerpt:
      "We analyze the 48 models in the catalog: 18K has taken over the padel premium, diamond dominates signature paddles, and tennis has standardized on 100 in².",
    tags: ["Analysis", "Trends", "Catalog"],
  },
  "mejores-palas-calidad-precio-2026": {
    title: "Best value padel paddles of 2026 (real price data)",
    excerpt:
      "We cross the catalog's specs with real scraped Amazon prices: these are the paddles that offer the most paddle per euro in 2026.",
    tags: ["Value for money", "Analysis", "Deals", "2026"],
  },
  "triay-brea-chingalan-campeones-sudafrica": {
    title: "Triay-Brea and Chingalán win South Africa's first Premier Padel crown",
    excerpt:
      "Gemma Triay and Delfi Brea on one side, Galán and Chingotto on the other: the two favourites lift the title in Pretoria after two finals decided in third-set tie-breaks.",
    tags: ["Premier Padel", "Pretoria", "Triay", "Chingotto", "Galán"],
  },
  "london-p1-primer-torneo-londres": {
    title: "Pro padel lands in London: London P1 kicks off at Olympia",
    excerpt:
      "For the first time ever, a Premier Padel tournament is held in the British capital. The main draw starts this week at Olympia London in Kensington.",
    tags: ["Premier Padel", "London P1", "Calendar"],
  },
  "malaga-p1-numeros-1-martin-carpena": {
    title: "Málaga P1: world No.1s reign at Martín Carpena in front of 44,000 fans",
    excerpt:
      "Triay and Brea battle for over three hours to beat Josemaría-González; Coello and Tapia crush Lebrón-Augsburger in 53 minutes. Attendance record in Málaga.",
    tags: ["Premier Padel", "Málaga P1", "Coello", "Tapia", "Triay"],
  },
  "premier-padel-fanatics-acuerdo-licencias": {
    title: "Premier Padel signs historic licensing deal with Fanatics",
    excerpt:
      "The sports merchandising giant becomes Master Licensee of the tour: official online store already live, with in-venue retail coming in December.",
    tags: ["Premier Padel", "Fanatics", "Merchandising"],
  },
  "london-p1-2026-campeones-calvo-coello": {
    title: "London P1: Calvo-Fernández make history as Coello-Tapia reclaim the throne at Olympia",
    excerpt:
      "Martina Calvo, aged 18, becomes the youngest champion in Premier Padel history alongside Claudia Fernández. Coello and Tapia claim their eighth title of the season in a near two-hour final against Chingalán.",
    tags: ["Premier Padel", "London P1", "Coello", "Tapia", "Calvo"],
  },
  "stupaczuk-jon-sanz-nueva-pareja-p1-madrid": {
    title: "Stupaczuk and Jon Sanz to team up from the Madrid P1",
    excerpt:
      "The partner shuffle shakes up the top of the rankings: Franco Stupaczuk will play with Jon Sanz from the Madrid P1, while Coki Nieto and Mike Yanguas reunite at the Movistar Arena.",
    tags: ["Premier Padel", "Madrid P1", "Stupaczuk", "Jon Sanz", "Signings"],
  },
  "alex-ruiz-ileso-rotura-cristal-fip-gold-san-luis": {
    title: "Álex Ruiz unharmed after glass pane shatters at FIP Gold San Luis",
    excerpt:
      "A glass wall exploded mid-semi-final at the FIP Gold San Luis (Mexico) when Álex Ruiz leaned into it. The Spaniard dodged the fragments by centimetres and reopened the debate over court safety.",
    tags: ["Álex Ruiz", "CUPRA FIP Tour", "FIP Gold", "Safety", "San Luis"],
  },
  "madrid-p1-2026-lucha-por-el-numero-uno": {
    title: "Madrid P1 2026: the race for No.1 and the new pairs take over the Movistar Arena",
    excerpt:
      "Premier Padel is back from the break with the Comunidad de Madrid P1: €479,068 in prize money, Coello-Tapia and Galán-Chingotto separated by 1,290 points in the Race, debuts for Stupa-Sanz and Nieto-Yanguas and a tribute to Alejandra Salazar.",
    tags: ["Premier Padel", "Madrid P1", "Coello", "Tapia", "Galán", "Chingotto"],
  },
  "madrid-p1-2026-palas-cuartos-final": {
    title: "Madrid P1 2026: the rackets of the quarter-finals at the Movistar Arena",
    excerpt:
      "Coello-Tapia defend No.1 with NOX and Head, Galán-Chingotto arrive with the Metalbone and the Neuron 02, and Libaak-Alfonso, the pair that knocked out Lebrón, play with the Siux Diablo Pro. A look at the material in the quarter-final matchups, with the catalog specs.",
    tags: ["Premier Padel", "Madrid P1", "Coello", "Tapia", "Galán", "Chingotto", "Libaak"],
  },
  "us-open-2026-raquetas-cuartos-final": {
    title: "US Open 2026: the rackets on the road to the quarter-finals",
    excerpt:
      "Alcaraz is already in the fourth round with his Pure Aero 98, top seed Zverev leads the draw with the Speed MP, and Sabalenka, Pegula and Gauff rule the women's side with Blade, EZONE and Boom. The catalog models being played in New York.",
    tags: ["US Open", "Grand Slam", "Alcaraz", "Zverev", "Sabalenka", "Gauff", "Rybakina"],
  },
  "paris-major-2026-previa-roland-garros": {
    title: "Paris Major 2026: padel lands at Roland-Garros with the Race wide open",
    excerpt:
      "The Alpine Paris Major takes Premier Padel to the Stade Roland-Garros from September 6 to 13: €1,044,849 in prize money, 2,000 FIP points and a Race blown wide open after Coello-Tapia's fall in Madrid. Preview, draw and the catalog rackets.",
    tags: ["Premier Padel", "Paris Major", "Roland-Garros", "Coello", "Tapia", "Galán", "Chingotto"],
  },
  "paris-major-2026-dieciseisavos-revancha-chatrier": {
    title: "Paris Major 2026: seeds' debut day — Coello-Tapia open Chatrier against Lebrón's slayers",
    excerpt:
      "Two days of round-of-64 action proved the Paris Major gives nothing away: Libaak-Alfonso booked a Philippe Chatrier date with Coello-Tapia, Collombon and the wild cards fell at home and the women's favourites start on Thursday straight in the round of 16. Recap and the catalog rackets on court this Wednesday.",
    tags: ["Premier Padel", "Paris Major", "Roland-Garros", "Coello", "Tapia", "Libaak", "Lebrón", "Galán"],
  },
  "paris-major-2026-dia-de-finales-coello-tapia-galan-chingotto": {
    title: "Paris Major 2026: finals day at Roland-Garros — Coello-Tapia chase four in a row, Galán-Chingotto chase revenge",
    excerpt:
      "Saturday's semi-finals set the dream card: Coello-Tapia, three-time champions in Paris, replay the 2025 final against the Galán-Chingotto pair that just won the Madrid P1; and an unexpected women's final between the Sánchez-Ustero duo that came back from a set down and the Fernández-Calvo pair that has now beaten the world No. 1s three times in a row. Schedule, the finalists' rackets and the story lines closing out the Major.",
    tags: ["Premier Padel", "Paris Major", "Roland-Garros", "Coello", "Tapia", "Galán", "Chingotto", "Ari Sánchez"],
  },
  "paris-major-2026-campeones-coello-tapia-tetra-sanchez-ustero": {
    title: "Paris Major 2026: Coello and Tapia complete the four-peat as Sánchez-Ustero lift their first Major",
    excerpt:
      "The Golden Boys came back from 5-2 down in the third to beat Galán-Chingotto (6-3, 4-6, 7-6) and win their fourth straight Paris Major; Ari Sánchez and Andrea Ustero crushed Calvo-Fernández (6-2, 6-0) in 71 minutes for their first Major together. A record 81,000 spectators over the week.",
    tags: ["Premier Padel", "Paris Major", "Roland-Garros", "Coello", "Tapia", "Ari Sánchez", "Ustero", "Galán", "Chingotto"],
  },
  "paris-major-2026-cuartos-goni-alonso": {
    title: "Paris Major 2026: Goñi and Alonso knock out the Madrid runners-up — quarter-finals day",
    excerpt:
      "The round of 16 delivered the statement win of the tournament: Edu Alonso and Aimar Goñi eliminated Yanguas-Nieto, the Madrid P1 finalists, 6-4 6-3. Recap of a round that also ended the Moya-Leygue run, Friday's order of play at Roland-Garros and the catalog rackets on court, from Paquito's Hack 05 to Momo's Endure.",
    tags: ["Premier Padel", "Paris Major", "Roland-Garros", "Edu Alonso", "Goñi", "Stupaczuk", "Lebrón", "Paquito Navarro"],
  },
  "madrid-p1-2026-campeones-chingalan-triay-brea": {
    title: "Chingalán and Triay-Brea conquer the Madrid P1: the rackets behind the double",
    excerpt:
      "Galán-Chingotto lift their seventh title of the season after a near three-hour battle with Nieto-Yanguas (6-4, 5-7, 6-4), and Triay-Brea come from behind to beat Josemaría-González (6(5)-7, 6-3, 6-3). The rackets that won at the Movistar Arena, and what it means for the Race.",
    tags: ["Premier Padel", "Madrid P1", "Chingalán", "Galán", "Chingotto", "Triay", "Brea"],
  },
  "alejandra-salazar-despide-madrid-p1": {
    title:
      "Alejandra Salazar bids farewell at home: Movistar Arena pays tribute to the most decorated player in padel history",
    excerpt:
      "The Madrid-born player, 40 and with 58 titles to her name, played her last tournament in her home city: she fell to Triay-Brea (6-3, 6-3) in the Madrid P1 quarter-finals amid tears and tributes. Her career goes on with one last goal: the Premier Padel Finals in Barcelona.",
    tags: ["Premier Padel", "Madrid P1", "Alejandra Salazar", "Retirement", "Movistar Arena"],
  },
  "us-open-2026-martes-cuartos-yonex": {
    title: "US Open 2026: Tuesday's quarterfinals belong to Yonex (plus Alcaraz–Shelton, the main course)",
    excerpt:
      "Five of Tuesday's eight quarterfinalists play Yonex: the EZONE of Shelton, Pegula and Noskova, Navarro's VCORE and Tiafoe's Percept 97. With Alcaraz–Shelton as an early final, we break down the day's rackets — and the ones already in our catalog.",
    tags: ["US Open", "Grand Slam", "Alcaraz", "Shelton", "Yonex", "Sabalenka", "Noskova"],
  },
  "us-open-2026-semifinales-tiafoe-shelton-yonex": {
    title: "US Open 2026: the Tiafoe–Shelton semifinal will be 100% American, 100% Yonex",
    excerpt:
      "Shelton ended Alcaraz's reign in the latest-finishing match in US Open history, setting up an all-American — and all-Yonex — Friday semifinal against Tiafoe. With Rybakina already the new world No. 1 and Gauff saving two match points, a look at dream semifinals and the rackets from our catalog playing them.",
    tags: ["US Open", "Grand Slam", "Ben Shelton", "Frances Tiafoe", "Yonex", "Rybakina", "Gauff"],
  },
  "us-open-2026-final-femenina-blade-vcore": {
    title: "US Open 2026: women's final today — Blade vs VCORE",
    excerpt:
      "Sabalenka chases the three-peat in New York and Rybakina her first US Open title, and today's final at Arthur Ashe Stadium is also a clash of racket philosophies: Wilson Blade 98 vs Yonex VCORE 100. The technical keys to Saturday's match.",
    tags: ["US Open", "Grand Slam", "Sabalenka", "Rybakina", "Wilson", "Yonex"],
  },
  "us-open-2026-final-zverev-gravity-tour": {
    title:
      "US Open 2026: Zverev champion with the Gravity — the double-Slam racquet is now in the catalog",
    excerpt:
      "Zverev beat Shelton 6-3, 7-6(2), 5-7, 6-2 to claim his second Grand Slam of the year, powered by the Head Gravity Tour. The gold-and-purple limited edition HEAD launched after Roland Garros, the keys to the match, and the clash of styles against Shelton's EZONE 98.",
    tags: ["US Open", "Grand Slam", "Zverev", "Shelton", "Head", "Yonex"],
  },
  "davis-cup-2026-eliminatorias-raquetas": {
    title:
      "Davis Cup 2026: qualifiers kick off — the racquets of Prague, Quebec City and Halle",
    excerpt:
      "The Davis Cup Qualifiers start Friday: seven ties to decide who joins Italy in Bologna's Final 8. Shelton, Auger-Aliassime, Machac and Zverev in action with racquets that are already in our catalog.",
    tags: ["Davis Cup", "Zverev", "Shelton", "Auger-Aliassime", "Bologna", "Tennis"],
  },
  "davis-cup-2026-sabado-decisivo": {
    title:
      "Davis Cup: tickets to Bologna up for grabs — Prague and Quebec City get decided, Zverev lands in Halle",
    excerpt:
      "Friday left Prague 1-1 (Tien beat Mensik, Lehecka stopped Shelton) and Canada 1-0 up in Quebec City, thanks to Draxl. Today the first Final 8 tickets are handed out, and Germany-Croatia opens with Zverev.",
    tags: ["Davis Cup", "Zverev", "Shelton", "Lehecka", "Auger-Aliassime", "Bologna", "Tennis"],
  },
  "laver-cup-2026-londres-raquetas": {
    title: "Laver Cup 2026 in London: the racquets of the two teams",
    excerpt:
      "The O2 hosts the ninth Laver Cup from September 25 to 27: 12 players, 5 racquet brands and a Diadem as the only 'independent' frame on the roster. We break down the arsenal of Team Europe and Team World with the racquets in our catalog.",
    tags: ["Laver Cup", "Alcaraz", "Zverev", "Fritz", "Jodar", "London", "Tennis"],
  },
  "laver-cup-2026-dia-1-jodar-europa-3-1": {
    title: "Laver Cup 2026, Day 1: Jódar crushes Bublik, Alcaraz & Menšík seal the doubles and Europe lead 3-1",
    excerpt:
      "The Madrid man debuted at The O2 with a 6-2 6-3 over the Kazakh, Ruud came from a set down to beat Cerúndolo in the Laver Breaker, and Alcaraz and Menšík won the doubles to close Friday: Europe lead 3-1 before a Saturday worth two points per win.",
    tags: ["Laver Cup", "Alcaraz", "Jodar", "Ruud", "London", "Tennis"],
  },
  "laver-cup-2026-domingo-decisivo-europa-7-5": {
    title: "Europe lead 7-5 into the decisive Sunday: De Minaur topples Zverev and Alcaraz exacts his revenge",
    excerpt:
      "The Australian came from behind to beat the US Open champion saving a match point (2-6, 7-6(5), 11-9), Alcaraz paid back San Francisco against Fritz in a 13-11 Laver Breaker, and Ruud-Zverev sealed Saturday with the doubles: Europe take a 7-5 lead into a Sunday worth three points per win, with the trophy on the line at The O2.",
    tags: ["Laver Cup", "Alcaraz", "De Minaur", "Zverev", "London", "Tennis"],
  },
  "espana-prelista-mundial-qatar-2026": {
    title: "Spain unveils its 24-player preliminary squad for the 2026 Qatar World Cup",
    excerpt:
      "Spain's federation named 12 men and 12 women on September 16 for the World Championships in Doha (November 2-7). Selectors Juanjo Gutiérrez and Carolina Navarro will trim the list to 16 at an event in Madrid on September 24, with notable absences already making headlines.",
    tags: ["Spain national team", "World Cup", "FIP World Cup", "Doha"],
  },
  "espana-convocatoria-mundial-qatar-2026-palas": {
    title: "Spain's squad for Doha is set: the rackets of the 16 World Cup picks",
    excerpt:
      "Spain's federation confirmed the definitive squad for the World Cup in Qatar (Doha, November 2-7) on Thursday: Goñi and Marta Ortega make the cut, Salazar misses out in her final year. We break down the catalog rackets of Gutiérrez's eight and Navarro's eight.",
    tags: ["Spain national team", "World Cup", "FIP World Cup", "Squad", "Doha"],
  },
  "davis-cup-2026-final-8-bolonia-clasificados": {
    title: "Davis Cup: the Bologna Final 8 field is set — Czechia knock out the USA and Spain cruise without Alcaraz",
    excerpt:
      "Czechia come from behind to beat the United States in Prague, Auger-Aliassime seals Canada's place at home and Spain sweep Chile without dropping a rubber. The Bologna Final 8 (November 24-29) has its eight teams.",
    tags: ["Davis Cup", "Final 8", "Bologna", "Spain", "Zverev", "Tennis"],
  },
  "fip-platinum-lyon-2026-palas-favoritos": {
    title: "FIP Platinum Lyon 2026: 300 points that could earn a Finals spot — the rackets of the favourites",
    excerpt:
      "The fourth FIP Platinum of the year starts its main draw in Lyon with 300 Race points on the line toward the Premier Padel Finals in Barcelona. Stupaczuk-Sanz, Di Nenno-Tello and Momo-Campagnolo lead the draw, and Alejandra Salazar defends her title in her final year as a pro.",
    tags: ["FIP Platinum", "Lyon", "Premier Padel Finals", "Stupaczuk", "Salazar", "Padel"],
  },
  "fip-platinum-lyon-2026-octavos-garrido-sanyo-fuera": {
    title:
      "FIP Platinum Lyon 2026: the favourites hit the court in the round of 16 as Garrido-Sanyo fall on their debut",
    excerpt:
      "The first round produced the upset of the tournament: Axelsson-Guichard came from behind to beat Garrido-Sanyo 3-6 6-4 6-4. On Thursday the top four seeds —Stupaczuk-Sanz, Di Nenno-Tello, Momo-Campagnolo and Salazar-Osoro— make their debut in a round of 16 featuring 16 matches from 11:00 at the Palais des Sports de Gerland.",
    tags: ["FIP Platinum", "Lyon", "Round of 16", "Garrido", "Salazar", "Padel"],
  },
  "rotterdam-p2-2026-race-numero-uno-palas": {
    title:
      "Rotterdam P2: the double race for world No. 1 resumes in the Netherlands — the aspirants' rackets",
    excerpt:
      "The CUPRA Rotterdam P2 (September 28 – October 4) restarts Premier Padel with both world No. 1 races at stake: Coello-Tapia (9 titles) against Galán-Chingotto (7) on the men's side, and six titles apiece for Triay-Brea and Josemaría-González on the women's, with Leal-Guerrero arriving fresh off their FIP Platinum Lyon title. Official draw with the top four seeds in each bracket and their rackets in our catalog.",
    tags: ["Premier Padel", "Rotterdam P2", "Tapia", "Coello", "Galán", "Chingotto", "Ranking"],
  },
  "rotterdam-p2-2026-cuadro-final-jornada-1": {
    title:
      "Rotterdam P2: the main draw gets underway — Day 1 matchups and Lamperti one win away",
    excerpt:
      "The CUPRA Rotterdam P2 (Sep 27 – Oct 4, Rotterdam Ahoy) opens its main draw on Tuesday at 18:30: Goñi-Alonso, Tello-Arce and Libaak-Alfonso headline the round of 32, the morning qualifying leaves Lamperti (47) one match from the draw, and Di Nenno-Paquito Navarro debut their partnership with a bye straight to the last 16. The catalog's rackets, inside.",
    tags: ["Premier Padel", "Rotterdam P2", "Lamperti", "Tello", "Libaak", "Goñi"],
  },
  "rotterdam-p2-2026-primera-sorpresa-goni-alonso": {
    title:
      "Rotterdam P2: Montiel-Santigosa pull off the first upset and knock out Goñi-Alonso",
    excerpt:
      "The CUPRA Rotterdam P2 main draw opened with a bang: Montiel-Santigosa eliminated Goñi-Alonso (7-6(9) 6-3) on their debut, while Tello-Arce, Libaak-Alfonso and Lijó-Gil delivered. Today (12:00) the first round wraps up with the debuts of Stupaczuk-Sanz, Leal-Guerrero, Yanguas-Nieto and Momo-Campagnolo, and the women's draw joining in.",
    tags: ["Premier Padel", "Rotterdam P2", "Goñi", "Montiel", "Santigosa", "Stupaczuk", "Leal"],
  },
  "china-open-2026-djokovic-beijing-raquetas": {
    title:
      "Djokovic returns to Beijing after 11 years: a 30-0 fortress record and the racquets of the 2026 China Open",
    excerpt:
      "Novak Djokovic is back at the ATP 500 in Beijing — a city where he has never lost (30-0, six titles in six visits) — and opened his return by beating Borges (6-3, 7-6(2)) in his first match since Wimbledon. Second seed Auger-Aliassime is already out: here are the racquets of the favourites still alive.",
    tags: ["ATP", "China Open", "Djokovic", "Zverev", "Medvedev", "Menšík"],
  },
  "rotterdam-p2-2026-cuartos-libaak-alfonso-premio-envenenado": {
    title:
      "Rotterdam P2: Libaak-Alfonso knock out Leal-Guerrero and earn a quarterfinal date with Tapia-Coello",
    excerpt:
      "Libaak-Alfonso (7-5 3-6 6-4) are the only pair outside the top eight seeds in the Rotterdam P2 quarterfinals, where Tapia-Coello await. All 8 matches today from 10:30 (Red Bull TV and Movistar+): full schedule, round-of-16 results and the catalog rackets of the last eight.",
    tags: ["Premier Padel", "Rotterdam P2", "Libaak", "Alfonso", "Leal", "Guerrero", "Tapia", "Coello"],
  },
  "rotterdam-p2-2026-semifinales-revolucion": {
    title:
      "Rotterdam P2: seeds 2, 3 and 4 fall in the quarters — the semi-finals line-up and the rackets",
    excerpt:
      "Stupa-Sanz beat Galán-Chingotto (6-4 6-4), Yanguas-Nieto beat Augsburger-Lebrón (7-6(0) 6-3) and Momo-Campagnolo came from behind to beat Di Nenno-Navarro (2-6 7-6(1) 7-5): the Rotterdam P2 quarter-finals knocked out three of the top four men's seeds. Today, four semi-finals at the Ahoy from 12:00 on Red Bull TV, with the catalog rackets of the 10 semi-finalists.",
    tags: ["Premier Padel", "Rotterdam P2", "Stupaczuk", "Sanz", "Galán", "Chingotto", "Tapia", "Coello"],
  },
  "rotterdam-p2-2026-dia-de-finales": {
    title:
      "Rotterdam P2 finals day: Ari Sánchez hits 100 career finals and Stupa-Sanz play their first final as a pair",
    excerpt:
      "Sánchez-Ustero beat top seeds Triay-Brea (6-2 6-3) and Ari reached her 100th professional final, the youngest player ever to do it; Josemaría-González chase a seventh title of the year. In the men's draw, Tapia-Coello face Stupa-Sanz, who play their first Premier Padel final together after winning the battle for the top 4 (6-0 6-4 over Yanguas-Nieto). Finals today at the Ahoy from 16:00, with the catalog rackets of the finalists.",
    tags: ["Premier Padel", "Rotterdam P2", "Ari Sánchez", "Andrea Ustero", "Stupaczuk", "Jon Sanz", "Tapia", "Coello"],
  },
  "rotterdam-p2-2026-campeones-coello-tapia-sanchez-ustero": {
    title:
      "Rotterdam P2: Coello-Tapia defend the crown and Ari Sánchez's 100th final ends in victory",
    excerpt:
      "Ari Sánchez and Andrea Ustero beat Josemaría-González 6-4 6-4 for their second consecutive title: Magic Ari won her 100th career final, the youngest player ever to reach that mark. In the men's draw, world No. 1s Tapia-Coello beat Stupa-Sanz 6-3 6-2 to defend their Rotterdam crown and claim a tenth title in 2026.",
    tags: ["Premier Padel", "Rotterdam P2", "Ari Sánchez", "Andrea Ustero", "Tapia", "Coello", "Stupaczuk", "Jon Sanz"],
  },
  "china-open-2026-semifinales-djokovic-record-nadal": {
    title:
      "Djokovic goes 32-0 in Beijing: Nadal's record falls and the semi-finals arrive — the racquets of the 2026 China Open",
    excerpt:
      "The 39-year-old Serb fought past Zverev 4-6, 6-4, 6-4 and now owns the best start to a single event in Open Era men's tennis (leaving Nadal's 31-0 at Roland Garros behind). Today, the semi-finals: Djokovic-Medvedev and De Minaur-Hurkacz, with the catalog racquets of all four.",
    tags: ["ATP", "China Open", "Djokovic", "Medvedev", "Hurkacz", "De Minaur"],
  },
  "china-open-2026-final-djokovic-de-minaur": {
    title:
      "Djokovic-De Minaur: Beijing's 34-0 on the line in the China Open final — Medvedev defaulted and the racquets",
    excerpt:
      "Both of Monday's semi-finals ended early: Medvedev was defaulted for hitting a spectator with a ball while Djokovic led 7-5, 5-3, and Hurkacz retired injured (6-4, 3-2). Today (7 p.m. local, 1 p.m. CEST) the final is played: a seventh Beijing crown, Djokovic's 102nd title and the Race to Turin on the line.",
    tags: ["ATP", "China Open", "Djokovic", "De Minaur", "Medvedev", "Hurkacz"],
  },
  "china-open-2026-djokovic-campeon-102-titulos": {
    title:
      "Djokovic wins his seventh China Open: 102 titles, an eternal 34-0 and De Minaur's retirement",
    excerpt:
      "The Serb takes the Beijing title (7-6[3], 0-1 ret.) after De Minaur retired with an adductor injury following a 67-minute first set without a single break. His first title of 2026, one shy of Federer and unbeaten in Beijing: 34-0. Shanghai starts today without Sinner, who has ended his season.",
    tags: ["ATP", "China Open", "Djokovic", "De Minaur", "Sinner", "Shanghai"],
  },
  "juegos-sudamericanos-2026-primeros-oros-padel": {
    title: "History made: Abud-Dehnike and Vilchez-Mosca win padel's first-ever South American Games gold medals",
    excerpt:
      "Padel debuts as an official sport at the XIII South American Games in Santa Fe 2026 with a sold-out Estadio Invencible in Rafaela: gold for Abud-Dehnike (Paraguay) and Vilchez-Mosca (Argentina) in the discipline's first finals at the event.",
    tags: ["South American Games", "Santa Fe 2026", "Argentina", "Paraguay", "FIP"],
  },
};

/**
 * Combina la metadata ES del .mdx con su traducción EN, produciendo un Article
 * bilingüe. Si falta la traducción EN, cae al texto ES (mejor que romper).
 */
function localize(raw: { slug: string } & Record<string, unknown>): Article {
  const slug = raw.slug;
  const en = EN_META[slug];
  return {
    slug,
    title: { es: raw.title as string, en: en?.title ?? (raw.title as string) },
    excerpt: { es: raw.excerpt as string, en: en?.excerpt ?? (raw.excerpt as string) },
    date: raw.date as string,
    author: raw.author as string,
    kind: raw.kind as ArticleKind,
    sport: raw.sport as Sport | "ambos",
    tags: (raw.tags as string[]).map((es, i) => ({ es, en: en?.tags[i] ?? es })),
    readingMinutes: raw.readingMinutes as number,
    relatedProducts: raw.relatedProducts as string[] | undefined,
  };
}

export const ARTICLES: Article[] = [
  localize({ slug: "formas-de-pala-cual-te-toca", ...formasDePala }),
  localize({ slug: "carbono-3k-12k-18k-diferencias", ...carbono }),
  localize({ slug: "palas-iniciacion-que-mirar", ...iniciacion }),
  localize({ slug: "tamis-y-patron-de-cuerdas", ...tamis }),
  localize({ slug: "gama-alta-2025-2026-tendencias", ...gamaAlta }),
  localize({ slug: "mejores-palas-calidad-precio-2026", ...calidadPrecio }),
  localize({ slug: "triay-brea-chingalan-campeones-sudafrica", ...sudafrica }),
  localize({ slug: "london-p1-primer-torneo-londres", ...london }),
  localize({ slug: "malaga-p1-numeros-1-martin-carpena", ...malaga }),
  localize({ slug: "premier-padel-fanatics-acuerdo-licencias", ...fanatics }),
  localize({ slug: "london-p1-2026-campeones-calvo-coello", ...londonCampeones }),
  localize({ slug: "stupaczuk-jon-sanz-nueva-pareja-p1-madrid", ...stupaczukSanz }),
  localize({ slug: "alex-ruiz-ileso-rotura-cristal-fip-gold-san-luis", ...alexRuizCristal }),
  localize({ slug: "madrid-p1-2026-lucha-por-el-numero-uno", ...madridP1 }),
  localize({ slug: "madrid-p1-2026-palas-cuartos-final", ...madridP1Palas }),
  localize({ slug: "us-open-2026-raquetas-cuartos-final", ...usOpenRaquetas }),
  localize({ slug: "paris-major-2026-previa-roland-garros", ...parisMajorPrevia }),
  localize({ slug: "paris-major-2026-dieciseisavos-revancha-chatrier", ...parisMajorDieciseisavos }),
  localize({ slug: "madrid-p1-2026-campeones-chingalan-triay-brea", ...madridP1Campeones }),
  localize({ slug: "alejandra-salazar-despide-madrid-p1", ...aleSalazarDespedida }),
  localize({ slug: "us-open-2026-martes-cuartos-yonex", ...usOpenMartesYonex }),
  localize({ slug: "us-open-2026-semifinales-tiafoe-shelton-yonex", ...usOpenSemifinalesYonex }),
  localize({ slug: "paris-major-2026-cuartos-goni-alonso", ...parisMajorCuartos }),
  localize({ slug: "us-open-2026-final-femenina-blade-vcore", ...usOpenFinalFemenina }),
  localize({ slug: "us-open-2026-final-zverev-gravity-tour", ...usOpenFinalMasculina }),
  localize({ slug: "paris-major-2026-dia-de-finales-coello-tapia-galan-chingotto", ...parisMajorFinales }),
  localize({ slug: "paris-major-2026-campeones-coello-tapia-tetra-sanchez-ustero", ...parisMajorCampeones }),
  localize({ slug: "davis-cup-2026-eliminatorias-raquetas", ...davisCupEliminatorias }),
  localize({ slug: "davis-cup-2026-sabado-decisivo", ...davisCupSabado }),
  localize({ slug: "laver-cup-2026-londres-raquetas", ...laverCupLondres }),
  localize({ slug: "laver-cup-2026-dia-1-jodar-europa-3-1", ...laverCupDia1 }),
  localize({ slug: "laver-cup-2026-domingo-decisivo-europa-7-5", ...laverCupDomingo }),
  localize({ slug: "espana-prelista-mundial-qatar-2026", ...espanaPrelistaMundial }),
  localize({ slug: "espana-convocatoria-mundial-qatar-2026-palas", ...espanaConvocatoriaMundial }),
  localize({ slug: "davis-cup-2026-final-8-bolonia-clasificados", ...davisCupFinal8 }),
  localize({ slug: "fip-platinum-lyon-2026-palas-favoritos", ...fipPlatinumLyon }),
  localize({ slug: "fip-platinum-lyon-2026-octavos-garrido-sanyo-fuera", ...fipPlatinumLyonOctavos }),
  localize({ slug: "rotterdam-p2-2026-race-numero-uno-palas", ...rotterdamP2Race }),
  localize({ slug: "rotterdam-p2-2026-cuadro-final-jornada-1", ...rotterdamP2Jornada1 }),
  localize({ slug: "juegos-sudamericanos-2026-primeros-oros-padel", ...juegosSudamericanos }),
  localize({ slug: "rotterdam-p2-2026-primera-sorpresa-goni-alonso", ...rotterdamP2Sorpresa }),
  localize({ slug: "china-open-2026-djokovic-beijing-raquetas", ...chinaOpenDjokovic }),
  localize({ slug: "rotterdam-p2-2026-cuartos-libaak-alfonso-premio-envenenado", ...rotterdamP2Cuartos }),
  localize({ slug: "rotterdam-p2-2026-semifinales-revolucion", ...rotterdamP2Semis }),
  localize({ slug: "rotterdam-p2-2026-dia-de-finales", ...rotterdamP2Finales }),
  localize({ slug: "rotterdam-p2-2026-campeones-coello-tapia-sanchez-ustero", ...rotterdamP2Campeones }),
  localize({ slug: "china-open-2026-semifinales-djokovic-record-nadal", ...chinaOpenSemis }),
  localize({ slug: "china-open-2026-final-djokovic-de-minaur", ...chinaOpenFinal }),
  localize({ slug: "china-open-2026-djokovic-campeon-102-titulos", ...chinaOpenCampeon }),
].sort((a, b) => b.date.localeCompare(a.date));

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Artículos que mencionan un producto concreto. */
export function getArticlesForProduct(productId: string): Article[] {
  return ARTICLES.filter((a) => a.relatedProducts?.includes(productId));
}

export function getArticlesBySport(sport: Sport): Article[] {
  return ARTICLES.filter((a) => a.sport === sport || a.sport === "ambos");
}

/**
 * Guías y noticias viven en secciones distintas.
 *
 * Guías = contenido perenne de ayuda a la compra. Los análisis entran aquí
 * porque un análisis de material sigue sirviendo meses después, a diferencia de
 * una novedad, que caduca.
 */
export const GUIDE_KINDS: ArticleKind[] = ["guia", "analisis"];

export function isGuide(article: Article): boolean {
  return GUIDE_KINDS.includes(article.kind);
}

/** Artículos de la sección /guias, del más reciente al más antiguo. */
export function getGuides(): Article[] {
  return ARTICLES.filter(isGuide);
}

/** Artículos de la sección /noticias (novedades de actualidad). */
export function getNews(): Article[] {
  return ARTICLES.filter((a) => !isGuide(a));
}

/**
 * URL de un artículo según su sección y locale. Centralizado aquí para que
 * ningún enlace del sitio pueda apuntar a la sección equivocada.
 */
export function articleHref(article: Article, locale: Locale): string {
  const base = isGuide(article) ? `/guias/${article.slug}` : `/noticias/${article.slug}`;
  return localePath(locale, base);
}

/** Ruta interna (sin locale) de un artículo, según su sección. */
export function articleBasePath(article: Article): string {
  return isGuide(article) ? `/guias/${article.slug}` : `/noticias/${article.slug}`;
}

const KIND_LABEL: Record<Locale, Record<ArticleKind, string>> = {
  es: { guia: "Guía", analisis: "Análisis", novedad: "Novedad" },
  en: { guia: "Guide", analisis: "Review", novedad: "News" },
};

/** Etiqueta humana del tipo de artículo, en el locale dado. */
export function kindLabel(kind: ArticleKind, locale: Locale): string {
  return KIND_LABEL[locale][kind];
}

const MESES: Record<Locale, string[]> = {
  es: [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

/**
 * Formato manual: `toLocaleDateString` puede diferir entre Node y el navegador.
 * ES: «22 de julio de 2026». EN: «July 22, 2026».
 */
export function formatArticleDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-");
  if (locale === "en") {
    return `${MESES.en[Number(m) - 1]} ${Number(d)}, ${y}`;
  }
  return `${Number(d)} de ${MESES.es[Number(m) - 1]} de ${y}`;
}
