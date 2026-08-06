# Sistema de ratings de rendimiento

Cada pala y raqueta del catálogo muestra **4 barras de rendimiento** (escala 1–10, coloreadas por código de colores) en la ficha de producto, el catálogo y el comparador.

## Las 4 métricas

| Métrica | ES | EN | Qué mide |
|---|---|---|---|
| Potencia | Potencia | Power | Capacidad de generar velocidad de bola |
| Control | Control | Control | Precisión y dirección de la pelota |
| Punto dulce | Punto dulce | Sweet spot | Tolerancia al golpe descentralizado |
| Manejabilidad | Manejabilidad | Maneuverability | Agilidad en el movimiento de la pala |

## Cómo se calculan

Los ratings se derivan **automáticamente** de las especificaciones físicas de cada pala mediante la función `getRatings()` en `src/data/ratings.ts`. No se asignan manualmente.

### Factores que influyen (pádel)

**Potencia:**
- Forma: diamante (+2.5), lágrima (+1.2), híbrida (+0.5), redonda (+0)
- Balance: alto (+1.5), medio (+0.5), bajo (−0.5)
- Dureza: dura (+1), media (+0.3)
- Carbono en caras: 12K (+0.4), 18K/24K (+0.8), fibra de vidrio (−0.4)
- Peso: continuo, +0.06 por gramo sobre 370g

**Control:**
- Forma: redonda (+3), híbrida (+1.5), lágrima (+0.8), diamante (+0.3)
- Balance: bajo (+2), medio (+1)
- Dureza: blanda (+1.5), media (+0.5)
- Peso: las más ligeras reciben un pequeño bonus

**Punto dulce:**
- Forma: redonda (+3), híbrida (+2), lágrima (+1)
- Balance: bajo (+1.5), medio (+0.8)
- Dureza blanda (+0.8)

**Manejabilidad:**
- Balance: bajo (+2.5), medio (+1)
- Forma: redonda (+1), híbrida (+0.5)
- Peso: ≤360g (+1.5), ≤367g (+0.5), ≥378g (−1)

### Perfiles esperados por arquetipo

| Arquetipo | Potencia | Control | Dulce | Manejo |
|---|---|---|---|---|
| Potencia pura (diamante, alto, dura, pesada) | 8–9 | 3–4 | 3–4 | 3–4 |
| Polivalente (lágrima/híbrida, medio, media) | 5–7 | 5–6 | 5–6 | 5–6 |
| Control puro (redonda, bajo, blanda, ligera) | 2–3 | 8–10 | 8–9 | 8–10 |

## Colores de las barras

| Valor | Color | Hex |
|---|---|---|
| 9–10 | Verde | `#22c55e` |
| 7–8 | Lima | `#84cc16` |
| 5–6 | Amarillo | `#eab308` |
| 3–4 | Naranja | `#f97316` |
| 1–2 | Rojo | `#ef4444` |

## Reglas al añadir palas

1. **Siempre rellenar `hardness`**: "EVA Soft" → blanda, "MultiEva"/"EVA Medium" → media, "EVA Hard" → dura.
2. **El rango de peso importa**: introducir el rango real. El punto medio afecta a los ratings de forma continua.
3. **Caras específicas**: "Carbono 12K", "Fibra de vidrio", no solo "Carbono". El número K afecta al bonus.
4. **Verificar tras añadir**: ejecutar el snippet de sanity-check para confirmar que los ratings tienen sentido.

### Snippet de verificación

```bash
npx tsx -e '
const { PRODUCTS } = require("./src/data/products.ts");
const { getRatings } = require("./src/data/ratings.ts");
PRODUCTS.filter(p => p.model.includes("MODEL"))
  .forEach(p => { console.log(p.model, JSON.stringify(getRatings(p))); });
'
```

## Tenis

Las raquetas de tenis usan una fórmula distinta basada en rigidez (RA), tamaño de cabeza (sq in), peso y swingweight. La lógica vive en la función `tennisRatings()` dentro de `src/data/ratings.ts`.

## Modificar la fórmula

Si se ajustan los pesos o se añaden factores, editar `src/data/ratings.ts` y verificar la distribución con:

```bash
npx tsx -e '
const { PRODUCTS } = require("./src/data/products.ts");
const { getRatings } = require("./src/data/ratings.ts");
const stats = { p: [], c: [], d: [], m: [] };
PRODUCTS.forEach(p => { const r = getRatings(p); if (r) { stats.p.push(r.potencia); stats.c.push(r.control); } });
console.log("potencia avg:", (stats.p.reduce((a,b)=>a+b,0)/stats.p.length).toFixed(1));
'
```

**Objetivo de distribución**: media ~5, máximo ~9, rango usado 2–9. Si más de 5 palas saturan a 10, la fórmula necesita recalibrado.
