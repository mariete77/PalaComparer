// Jugadores profesionales y las palas o raquetas que usan.
//
// No hay tabla de jugadores: se derivan del campo `player` de PRODUCTS, así que
// al dar de alta un producto con jugador su página aparece sola.
//
// Existe porque "qué pala usa Agustín Tapia" es el patrón de consulta con más
// volumen del nicho en español y no había ninguna página que lo respondiera.

import { PRODUCTS, type Product, type Sport } from "./products";

/**
 * Nombres que aparecen escritos de varias formas en el catálogo. Sin esto,
 * "Tello" y "Juan Tello" generan dos páginas distintas para la misma persona.
 */
const ALIASES: Record<string, string> = {
  Tello: "Juan Tello",
  Coello: "Arturo Coello",
  Galán: "Ale Galán",
  Tapia: "Agustín Tapia",
  Lamperti: "Miguel Lamperti",
  Bela: "Fernando Belasteguín",
};

function canonicalName(raw: string): string {
  const name = raw.trim();
  return ALIASES[name] ?? name;
}

/** `Agustín Tapia` → `agustin-tapia`. Estable: entra en la URL. */
export function playerSlug(name: string): string {
  return canonicalName(name)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface Player {
  slug: string;
  name: string;
  sport: Sport;
  products: Product[];
}

function buildPlayers(): Player[] {
  const bySlug = new Map<string, Player>();

  for (const product of PRODUCTS) {
    if (!product.player) continue;
    const name = canonicalName(product.player);
    const slug = playerSlug(name);

    const existing = bySlug.get(slug);
    if (existing) {
      existing.products.push(product);
      continue;
    }
    bySlug.set(slug, { slug, name, sport: product.sport, products: [product] });
  }

  for (const player of bySlug.values()) {
    // El modelo más reciente primero: es el que la gente busca.
    player.products.sort((a, b) => b.year - a.year);
  }

  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export const PLAYERS: Player[] = buildPlayers();

export function getPlayer(slug: string): Player | undefined {
  return PLAYERS.find((p) => p.slug === slug);
}

export function playersBySport(sport: Sport): Player[] {
  return PLAYERS.filter((p) => p.sport === sport);
}
