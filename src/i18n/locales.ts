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
  common: {
    padel: "Pádel",
    tenis: "Tenis",
    desde: "desde",
    anadirComparador: "Añadir al comparador",
    quitarComparador: "Quitar del comparador",
    verTodas: "Ver todas",
    verTodos: "Ver todos",
    min: "min",
  },
  catalog: {
    filtros: "Filtros",
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
  },
  product: {
    ilustracionOrientativa: "Ilustración orientativa",
    eleccionDe: "La elección de",
    mejorPrecioTiendas: "Mejor precio entre {n} tiendas · PVP",
    minimoHistorico: "↓ Mínimo histórico",
    pvpOrientativo: "PVP orientativo",
    specsTecnicas: "Especificaciones técnicas",
    dondeComprar: "Dónde comprar",
    evolucionPrecio: "Evolución del precio",
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
    disponibilidad: "Disponibilidad",
    precio: "Precio",
    total: "Total",
    actualizado: "Actualizado:",
  },
  compare: {
    mejorPrecio: "Mejor precio",
    titulo: "Comparador",
    subtitulo: "Compara hasta 3 modelos, Specification por Specification.",
    cargando: "Cargando comparador…",
    buscarPlaceholder: "Busca un modelo para añadir…",
    vacioTitulo: "Selecciona modelos para comparar",
    vacioCuerpo:
      "Añade palas o raquetas desde el catálogo o el buscador para ver sus especificaciones lado a lado.",
    limpiar: "Limpiar",
    comparar: "Comparar",
    compararAhora: "Comparar ahora",
    enComparador: "✓ En el comparador",
    anadirComparador: "+ Añadir al comparador",
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
  common: {
    padel: "Padel",
    tenis: "Tennis",
    desde: "from",
    anadirComparador: "Add to compare",
    quitarComparador: "Remove from compare",
    verTodas: "See all",
    verTodos: "See all",
    min: "min",
  },
  catalog: {
    filtros: "Filters",
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
  },
  product: {
    ilustracionOrientativa: "Illustrative image",
    eleccionDe: "Choice of",
    mejorPrecioTiendas: "Best price across {n} stores · RRP",
    minimoHistorico: "↓ All-time low",
    pvpOrientativo: "Approx. RRP",
    specsTecnicas: "Technical specs",
    dondeComprar: "Where to buy",
    evolucionPrecio: "Price history",
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
    vacioTitulo: "Pick models to compare",
    vacioCuerpo:
      "Add paddles or rackets from the catalog or the search to see their specs side by side.",
    limpiar: "Clear",
    comparar: "Compare",
    compararAhora: "Compare now",
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
