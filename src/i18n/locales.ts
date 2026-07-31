// Diccionario de cadenas de UI para los dos idiomas soportados.
//
// Uso: `const { t } = useLocale(); t("nav.palas")`.
// Las claves son estables; los valores cambian por idioma. Para añadir un texto
// nuevo, decláralo aquí en ambos idiomas y úsalo con su clave en el componente.
//
// El contenido largo de datos (descripciones de producto, cuerpos de artículos)
// vive junto a los propios datos, no aquí.

export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

// Etiquetas humanas del selector.
export const LOCALE_LABEL: Record<Locale, string> = {
  es: "ES",
  en: "EN",
};

// Código BCP-47 para <html lang> y Open Graph.
export const LOCALE_BCP47: Record<Locale, string> = {
  es: "es-ES",
  en: "en-US",
};

/** Comprueba que un string es uno de nuestros locales (type guard). */
export function isLocale(value: string | undefined | null): value is Locale {
  return value === "es" || value === "en";
}

/** El locale «otro» del dado (para el toggle). */
export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

/**
 * Prefija una ruta interna con el locale, sin duplicar barras ni reescribir
 * URLs que ya vienen prefijadas. Diseñado para rutas internas como `/palas`.
 *
 *   localePath("en", "/palas")        → "/en/palas"
 *   localePath("es", "/")             → "/es"
 *   localePath("en", "/producto/x?q") → "/en/producto/x?q"
 */
export function localePath(locale: Locale, path: string): string {
  if (path === "/" || path === "") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Quita el prefijo de locale de una ruta, si lo lleva. Devuelve la ruta «interna»
 * sin locale. Útil en el proxy y al conmutar idioma manteniendo la ruta.
 *
 *   stripLocale("/en/palas")   → "/palas"
 *   stripLocale("/palas")      → "/palas"
 *   stripLocale("/es")         → "/"
 */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(es|en)(?=\/|$)/);
  if (!m) return pathname === "/" ? "/" : pathname;
  const rest = pathname.slice(m[0].length);
  return rest === "" ? "/" : rest;
}

/** Locale que aparece en una ruta, o `null` si no lleva prefijo. */
export function localeFromPath(pathname: string): Locale | null {
  const m = pathname.match(/^\/(es|en)(?=\/|$)/);
  return m ? (m[1] as Locale) : null;
}

const es = {
  nav: {
    palas: "Palas",
    raquetas: "Raquetas",
    noticias: "Noticias",
    finder: "Encuentra la tuya",
    comparar: "Comparar",
    menu: "Menú",
    abrirMenu: "Abrir menú",
    cerrarMenu: "Cerrar menú",
  },
  layout: {
    title: "PalaComparer — Encuentra tu pala o raqueta perfecta",
  },
  home: {
    modelosRango: "modelos — 2022-2026",
    encuentraTu: "Encuentra tu",
    armaPerfecta: "arma perfecta",
    encontrarMiPala: "Encontrar mi pala",
    compararModelos: "Comparar modelos",
    pilarTitulo: "Datos del fabricante, no argumentos de venta.",
    pilarSpecsTitulo: "Specs del fabricante",
    pilarSpecsDesc: "Peso, balance, núcleo y caras tal y como los publica la marca. Sin adjetivos.",
    pilarFiltrosTitulo: "Filtros por tu juego",
    pilarFiltrosDesc: "Nivel y estilo antes que marca: control, potencia o polivalente.",
    pilarComparadorTitulo: "Comparador lado a lado",
    pilarComparadorDesc: "Hasta tres modelos enfrentados, spec por spec, en la misma pantalla.",
    palasDelMomento: "Las palas del momento",
    raquetasDestacadas: "Raquetas destacadas",
    antesDeComprar: "Antes de comprar, leete esto",
  },
  palas: {
    metaTitle: "Palas de pádel — PalaComparer",
    metaDesc:
      "Todas las palas de pádel 2022-2026: Nox, Bullpadel, Head, Adidas, Babolat y más. Filtra por nivel, forma, estilo y precio.",
    titulo: "Palas de pádel",
    subtitulo: "{n} palas de las mejores marcas. Usa los filtros para encontrar la tuya.",
  },
  raquetas: {
    metaTitle: "Raquetas de tenis — PalaComparer",
    metaDesc:
      "Todas las raquetas de tenis 2022-2026: Wilson, Babolat, Head, Yonex y más. Filtra por nivel, estilo y precio.",
    titulo: "Raquetas de tenis",
    subtitulo: "{n} raquetas de las mejores marcas. Usa los filtros para encontrar la tuya.",
  },
  noticias: {
    metaTitle: "Novedades de pádel y tenis — PalaComparer",
    metaDesc:
      "Lanzamientos y novedades de palas de pádel y raquetas de tenis. Para las guías de compra y los análisis de material, ve a la sección de guías.",
    titulo: "Novedades",
    subtitulo:
      "Lanzamientos y cambios de catálogo, con el contexto de qué se mueve respecto al modelo anterior.",
    vacioCuerpo:
      "Cuando salga material nuevo lo contamos aquí. Mientras tanto, las guías de compra y los análisis están en su propia sección.",
  },
  guias: {
    metaTitle: "Guías de compra de palas y raquetas — PalaComparer",
    metaDesc:
      "Guías y análisis de material para elegir pala de pádel o raqueta de tenis: formas, carbono, tamiz, peso y balance explicados con las specs del catálogo.",
    titulo: "Guías para elegir bien",
    subtitulo:
      "Cómo leer una ficha técnica y qué cambia de verdad en la pista. Si una guía recomienda un modelo, puedes abrir su ficha y comprobar los números.",
  },
  finder: {
    etiqueta: "Finder",
    titulo: "Encuentra tu {arma} ideal",
    preguntaDeporte: "¿Qué deporte juegas?",
    deportePadel: "Palas de pádel",
    deporteTenis: "Raquetas de tenis",
    preguntaNivel: "¿Cuál es tu nivel?",
    nivelPrincipiante: "Llevo menos de 1 año jugando",
    nivelIntermedio: "Juego regularmente, domino golpes básicos",
    nivelAvanzado: "Compite o juego a alto nivel",
    nivelProfesional: "Nivel competición/torneo",
    preguntaEstilo: "¿Cuál es tu estilo de juego?",
    estiloControl: "Gano con precisión y colocación",
    estiloPotencia: "Busco el remate y el golpe ganador",
    estiloPolivalente: "Un poco de todo, juego completo",
    preguntaPresupuesto: "¿Cuál es tu presupuesto máximo?",
    atras: "Atrás",
    verRecomendaciones: "Ver recomendaciones",
    tusRecomendaciones: "Tus recomendaciones",
    resultadoOk: "Tu {arma} ideal está aquí",
    resultadoVacio: "No encontramos nada con esos criterios",
    hasta: "Hasta",
    vacioCuerpo: "Prueba a subir el presupuesto o cambiar algún criterio.",
    empezarDeNuevo: "Empezar de nuevo",
  },
  common: {
    padel: "Pádel",
    tenis: "Tenis",
    padelLower: "pala",
    tenisLower: "raqueta",
    desde: "desde",
    anadirComparador: "Añadir al comparador",
    quitarComparador: "Quitar del comparador",
    verTodas: "Ver todas",
    verTodos: "Ver todos",
    min: "min",
  },
  catalog: {
    filtros: "Filtros",
    catalogoCompleto: "Catálogo completo",
    busquedaPrecision: "Búsqueda de precisión",
    placeholderBusqueda: "Buscar marca o modelo...",
    marca: "Marca",
    todas: "Todas",
    nivelLabel: "Nivel",
    estiloLabel: "Estilo de juego",
    forma: "Forma",
    precioMaximo: "Precio máximo",
    limpiarTodo: "Limpiar todo",
    limpiarFiltros: "Limpiar filtros",
    cuentaPalas: "palas",
    cuentaRaquetas: "raquetas",
    noResultados: "No hay resultados con esos filtros.",
    ordenar: {
      recientes: "Más recientes",
      precioAsc: "Precio: menor a mayor",
      precioDesc: "Precio: mayor a menor",
    },
    // Valores de enum mostrados como chips.
    nivel: {
      principiante: "Principiante",
      intermedio: "Intermedio",
      avanzado: "Avanzado",
      profesional: "Profesional",
    },
    estilo: {
      control: "Control",
      potencia: "Potencia",
      polivalente: "Polivalente",
    },
    formaPala: {
      redonda: "Redonda",
      lagrima: "Lágrima",
      diamante: "Diamante",
      hibrida: "Híbrida",
    },
    balance: {
      bajo: "Bajo",
      medio: "Medio",
      alto: "Alto",
    },
    superficie: {
      rugosa: "Rugosa",
      lisa: "Lisa",
    },
    dureza: {
      blanda: "Blanda",
      media: "Media",
      dura: "Dura",
    },
  },
  product: {
    ilustracionOrientativa: "Ilustración orientativa",
    eleccionDe: "La elección de",
    mejorPrecioTiendas: "Mejor precio entre {n} {tiendas} · PVP {pvp}",
    minimoHistorico: "↓ Mínimo histórico",
    pvpOrientativo: "PVP orientativo",
    specsTecnicas: "Especificaciones técnicas",
    dondeComprar: "Dónde comprar",
    dondeComprarNota: "Precios orientativos. Confirma siempre el importe final en la tienda.",
    evolucionPrecio: "Evolución del precio",
    evolucionPrecioSub: "Evolución del mejor precio",
    minimoHistoricoLabel: "Mínimo histórico",
    maximoActual: "Máximo actual",
    hablamosPala: "Hablamos de esta pala",
    hablamosRaqueta: "Hablamos de esta raqueta",
    tambienInteresa: "También te puede interesar",
    inicio: "Inicio",
    // Etiquetas de specs
    forma: "Forma",
    peso: "Peso",
    balance: "Balance",
    nucleo: "Núcleo",
    caras: "Caras",
    superficie: "Superficie",
    dureza: "Dureza",
    tamis: "Tamis",
    pesoEncordada: "Peso encordada",
    longitud: "Longitud",
    patronEncordado: "Patrón encordado",
    rigidez: "Rigidez (RA)",
    swingweight: "Swingweight",
    ano: "Año",
    jugador: "Jugador",
    pvp: "PVP",
    disponibleEn: "Disponible en",
    mejorPrecio: "Mejor precio",
    nivel: "Nivel",
    estiloLabel: "Estilo",
    deporte: "Deporte",
  },
  offers: {
    envioGratis: "Envío gratis",
    envio: "+ {coste} envío",
    hoy: "Hoy",
    ayer: "Ayer",
    haceDias: "Hace {n} días",
    mejor: "Mejor",
    enStock: "En stock",
    sinStock: "Sin stock",
    verTienda: "Ver en tienda ↗",
    tienda: "Tienda",
    tiendaSingular: "tienda",
    tiendaPlural: "tiendas",
    disponibilidad: "Disponibilidad",
    precio: "Precio",
    total: "Total",
    actualizado: "Actualizado:",
  },
  compare: {
    mejorPrecio: "Mejor precio",
    titulo: "Comparador",
    subtitulo: "Compara hasta 3 modelos, spec por spec.",
    cargando: "Cargando comparador…",
    buscarPlaceholder: "Busca un modelo para añadir…",
    anadirPlaceholder: "Añadir otra para comparar...",
    vacioTitulo: "Selecciona modelos para comparar",
    vacioCuerpo:
      "Añade palas o raquetas desde el catálogo o el buscador para ver sus especificaciones lado a lado.",
    limpiar: "Limpiar",
    comparar: "Comparar",
    compararAhora: "Comparar ahora ({n})",
    enComparador: "✓ En el comparador",
    anadirComparador: "+ Añadir al comparador",
    seleccionadas: "{n} de 3 seleccionadas.",
    deportesDistintos:
      "⚠️ Estás comparando deportes distintos — mostrando specs comunes.",
  },
  compareBar: {
    limpiar: "Limpiar",
    compararN: "Comparar ({n})",
  },
  footer: {
    tagline:
      "Compara palas de pádel y raquetas de tenis por especificaciones reales. Decide con datos, no con marketing.",
    catalogo: "Catálogo",
    contenido: "Contenido",
    palasPadel: "Palas de pádel",
    raquetasTenis: "Raquetas de tenis",
    encuentraTuya: "Encuentra la tuya",
    comparador: "Comparador",
    noticiasGuias: "Noticias y guías",
    legal: "Datos de especificaciones de fabricantes. Precios orientativos.",
  },
  news: {
    todo: "Todo",
    todosTemas: "Todos los temas",
    novedades: "Novedades",
    novedadesCuerpo:
      "Lo último en palas de pádel y raquetas de tenis. Pruebas, noticias y modelos recientes.",
    sinNovedades:
      "Todavía no hay novedades. Mientras tanto, échale un ojo a nuestras guías para elegir mejor.",
    verGuias: "Ver las guías",
    minLectura: "{n} min de lectura",
    modelosArticulo: "Modelos de este artículo",
    seguirLeyendo: "Seguir leyendo",
    kindLabel: { guia: "Guía", analisis: "Análisis", noticia: "Novedad" },
  },
} as const;

const en = {
  nav: {
    palas: "Paddles",
    raquetas: "Rackets",
    noticias: "News",
    finder: "Find yours",
    comparar: "Compare",
    menu: "Menu",
    abrirMenu: "Open menu",
    cerrarMenu: "Close menu",
  },
  layout: {
    title: "PalaComparer — Find your perfect paddle or racket",
  },
  home: {
    modelosRango: "models — 2022-2026",
    encuentraTu: "Find your",
    armaPerfecta: "perfect weapon",
    encontrarMiPala: "Find my paddle",
    compararModelos: "Compare models",
    pilarTitulo: "Manufacturer data, not sales pitches.",
    pilarSpecsTitulo: "Manufacturer specs",
    pilarSpecsDesc: "Weight, balance, core and faces exactly as the brand publishes them. No adjectives.",
    pilarFiltrosTitulo: "Filters for your game",
    pilarFiltrosDesc: "Level and style before brand: control, power or all-round.",
    pilarComparadorTitulo: "Side-by-side comparator",
    pilarComparadorDesc: "Up to three models matched, spec by spec, on the same screen.",
    palasDelMomento: "Today's paddles",
    raquetasDestacadas: "Featured rackets",
    antesDeComprar: "Before you buy, read this",
  },
  palas: {
    metaTitle: "Padel paddles — PalaComparer",
    metaDesc:
      "Every padel paddle 2022-2026: Nox, Bullpadel, Head, Adidas, Babolat and more. Filter by level, shape, play style and price.",
    titulo: "Padel paddles",
    subtitulo: "{n} paddles from the best brands. Use the filters to find yours.",
  },
  raquetas: {
    metaTitle: "Tennis rackets — PalaComparer",
    metaDesc:
      "Every tennis racket 2022-2026: Wilson, Babolat, Head, Yonex and more. Filter by level, play style and price.",
    titulo: "Tennis rackets",
    subtitulo: "{n} rackets from the best brands. Use the filters to find yours.",
  },
  noticias: {
    metaTitle: "Padel & tennis news — PalaComparer",
    metaDesc:
      "Launches and news on padel paddles and tennis rackets. For buying guides and gear reviews, head to the guides section.",
    titulo: "Latest",
    subtitulo:
      "Launches and catalog changes, with context on what shifts versus the previous model.",
    vacioCuerpo:
      "When new gear drops we cover it here. In the meantime, the buying guides and reviews live in their own section.",
  },
  guias: {
    metaTitle: "Padel & tennis buying guides — PalaComparer",
    metaDesc:
      "Guides and gear reviews to choose a padel paddle or tennis racket: shapes, carbon, head size, weight and balance explained with catalog specs.",
    titulo: "Guides to choose well",
    subtitulo:
      "How to read a spec sheet and what actually changes on court. If a guide recommends a model, you can open its page and check the numbers.",
  },
  finder: {
    etiqueta: "Finder",
    titulo: "Find your ideal {arma}",
    preguntaDeporte: "What sport do you play?",
    deportePadel: "Padel paddles",
    deporteTenis: "Tennis rackets",
    preguntaNivel: "What's your level?",
    nivelPrincipiante: "I've been playing for less than a year",
    nivelIntermedio: "I play regularly, I've mastered the basics",
    nivelAvanzado: "I compete or play at a high level",
    nivelProfesional: "Competition / tournament level",
    preguntaEstilo: "What's your play style?",
    estiloControl: "I win with precision and placement",
    estiloPotencia: "I go for the smash and the winner",
    estiloPolivalente: "A bit of everything, all-round game",
    preguntaPresupuesto: "What's your maximum budget?",
    atras: "Back",
    verRecomendaciones: "See recommendations",
    tusRecomendaciones: "Your recommendations",
    resultadoOk: "Your ideal {arma} is here",
    resultadoVacio: "We couldn't find anything with those criteria",
    hasta: "Up to",
    vacioCuerpo: "Try raising the budget or changing a criterion.",
    empezarDeNuevo: "Start over",
  },
  common: {
    padel: "Padel",
    tenis: "Tennis",
    padelLower: "paddle",
    tenisLower: "racket",
    desde: "from",
    anadirComparador: "Add to compare",
    quitarComparador: "Remove from compare",
    verTodas: "See all",
    verTodos: "See all",
    min: "min",
  },
  catalog: {
    filtros: "Filters",
    catalogoCompleto: "Full catalog",
    busquedaPrecision: "Precision search",
    placeholderBusqueda: "Search brand or model...",
    marca: "Brand",
    todas: "All",
    nivelLabel: "Level",
    estiloLabel: "Play style",
    forma: "Shape",
    precioMaximo: "Max price",
    limpiarTodo: "Clear all",
    limpiarFiltros: "Clear filters",
    cuentaPalas: "paddles",
    cuentaRaquetas: "rackets",
    noResultados: "No results with those filters.",
    ordenar: {
      recientes: "Newest",
      precioAsc: "Price: low to high",
      precioDesc: "Price: high to low",
    },
    nivel: {
      principiante: "Beginner",
      intermedio: "Intermediate",
      avanzado: "Advanced",
      profesional: "Pro",
    },
    estilo: {
      control: "Control",
      potencia: "Power",
      polivalente: "All-round",
    },
    formaPala: {
      redonda: "Round",
      lagrima: "Teardrop",
      diamante: "Diamond",
      hibrida: "Hybrid",
    },
    balance: {
      bajo: "Low",
      medio: "Medium",
      alto: "High",
    },
    superficie: {
      rugosa: "Rough",
      lisa: "Smooth",
    },
    dureza: {
      blanda: "Soft",
      media: "Medium",
      dura: "Hard",
    },
  },
  product: {
    ilustracionOrientativa: "Illustrative image",
    eleccionDe: "Choice of",
    mejorPrecioTiendas: "Best price across {n} {tiendas} · RRP {pvp}",
    minimoHistorico: "↓ All-time low",
    pvpOrientativo: "Approx. RRP",
    specsTecnicas: "Technical specs",
    dondeComprar: "Where to buy",
    dondeComprarNota: "Indicative prices. Always confirm the final amount at the store.",
    evolucionPrecio: "Price history",
    evolucionPrecioSub: "Best-price history",
    minimoHistoricoLabel: "All-time low",
    maximoActual: "Current high",
    hablamosPala: "About this paddle",
    hablamosRaqueta: "About this racket",
    tambienInteresa: "You may also like",
    inicio: "Home",
    forma: "Shape",
    peso: "Weight",
    balance: "Balance",
    nucleo: "Core",
    caras: "Faces",
    superficie: "Surface",
    dureza: "Hardness",
    tamis: "Head size",
    pesoEncordada: "Strung weight",
    longitud: "Length",
    patronEncordado: "String pattern",
    rigidez: "Stiffness (RA)",
    swingweight: "Swingweight",
    ano: "Year",
    jugador: "Player",
    pvp: "RRP",
    disponibleEn: "Available at",
    mejorPrecio: "Best price",
    nivel: "Level",
    estiloLabel: "Style",
    deporte: "Sport",
  },
  offers: {
    envioGratis: "Free shipping",
    envio: "+ {coste} shipping",
    hoy: "Today",
    ayer: "Yesterday",
    haceDias: "{n} days ago",
    mejor: "Best",
    enStock: "In stock",
    sinStock: "Out of stock",
    verTienda: "View at store ↗",
    tienda: "Store",
    tiendaSingular: "store",
    tiendaPlural: "stores",
    disponibilidad: "Availability",
    precio: "Price",
    total: "Total",
    actualizado: "Updated:",
  },
  compare: {
    mejorPrecio: "Best price",
    titulo: "Compare",
    subtitulo: "Compare up to 3 models, spec by spec.",
    cargando: "Loading comparator…",
    buscarPlaceholder: "Search a model to add…",
    anadirPlaceholder: "Add another to compare...",
    vacioTitulo: "Pick models to compare",
    vacioCuerpo:
      "Add paddles or rackets from the catalog or the search to see their specs side by side.",
    seleccionadas: "{n} of 3 selected.",
    deportesDistintos:
      "⚠️ You're comparing different sports — showing common specs.",
    limpiar: "Clear",
    comparar: "Compare",
    compararAhora: "Compare now ({n})",
    enComparador: "✓ In comparator",
    anadirComparador: "+ Add to compare",
  },
  compareBar: {
    limpiar: "Clear",
    compararN: "Compare ({n})",
  },
  footer: {
    tagline:
      "Compare padel paddles and tennis rackets by real specifications. Decide with data, not marketing.",
    catalogo: "Catalog",
    contenido: "Content",
    palasPadel: "Padel paddles",
    raquetasTenis: "Tennis rackets",
    encuentraTuya: "Find yours",
    comparador: "Comparator",
    noticiasGuias: "News & guides",
    legal: "Specs from manufacturers. Prices are indicative.",
  },
  news: {
    todo: "All",
    todosTemas: "All topics",
    novedades: "Latest",
    novedadesCuerpo:
      "The latest in padel paddles and tennis rackets. Reviews, news and recent models.",
    sinNovedades:
      "No news yet. In the meantime, check out our guides to choose better.",
    verGuias: "See the guides",
    minLectura: "{n} min read",
    modelosArticulo: "Models from this article",
    seguirLeyendo: "Keep reading",
    kindLabel: { guia: "Guide", analisis: "Review", noticia: "News" },
  },
} as const;

export type Dict = typeof es;
export const DICTS = { es, en } as unknown as Record<Locale, Dict>;

/** Texto disponible en los dos idiomas (descripciones, títulos de artículo…). */
export type LocalizedText = { es: string; en: string };

/** Devuelve el texto en el locale pedido. */
export function pickText(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

/** Versión server del traductor: devuelve `t` atada a un locale. */
export function translator(locale: Locale) {
  return (key: TranslationKey, params?: Record<string, string | number>) =>
    translate(locale, key, params);
}

// Acceso anidado por clave con puntos, p. ej. t("nav.palas").
// Inserción {placeholder} vía params.
type Path<T> = T extends object
  ? {
      [K in keyof T & string]: K extends string
        ? T[K] extends object
          ? `${K}.${Path<T[K]>}`
          : K
        : never;
    }[keyof T & string]
  : never;

export type TranslationKey = Path<Dict>;

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const dict = DICTS[locale];
  const parts = key.split(".");
  let node: unknown = dict;
  for (const p of parts) {
    if (node && typeof node === "object" && p in node) {
      node = (node as Record<string, unknown>)[p];
    } else {
      // Clave no encontrada: cae al español y, si tampoco, devuelve la clave.
      node = key;
      break;
    }
  }
  let str = typeof node === "string" ? node : key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
