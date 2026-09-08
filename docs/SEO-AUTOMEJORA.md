# SEO Automejora — PalaComparer (GA4 + Search Console)

Bucle de automejora con **datos reales**: un script recoge métricas de GA4 y
Search Console, y un cron semanal las usa para proponer/aplicar mejoras SEO
(titles, metas, contenido) sobre queries reales. Nada inventado.

## Estado

- [x] GA4 instalado en producción (`G-4YZ39NTPE6`, en `src/app/[locale]/layout.tsx`)
- [x] `scripts/seo_collect.py` — recolector GA4+GSC (falla con rc=2 si falta credencial)
- [ ] **Pendiente (Mario):** credencial de service account en `/root/.gcp/palacomparer-sa.json`
- [ ] Activar cron semanal de análisis + mejoras

## Setup (una sola vez, ~10 min)

1. **Google Cloud Console** → nuevo proyecto (p.ej. `palacomparer-seo`)
2. **APIs y servicios → Biblioteca**: habilitar *Google Analytics Data API* y
   *Search Console API*
3. **IAM y administración → Cuentas de servicio → Crear**: nombre `hermes-seo`
   → crear y **añadir clave JSON** → guardar como
   `/root/.gcp/palacomparer-sa.json`
4. Copiar el email de la service account (`...@palacomparer-seo.iam.gserviceaccount.com`)
5. **GA4** (analytics.google.com → propiedad PalaComparer → Administración →
   Gestión de acceso a la propiedad) → añadir ese email con rol **Lector**
6. **Search Console** (search.google.com/search-console → palacomparer.com →
   Configuración → Acceso de usuarios) → añadir el email con permiso **Completo**
   (el restringido solo da `sc-domain:` de propiedades verificadas por DNS)
7. Avisar a Hermes → probará `seo_collect.py`, y si todo va bien activará el cron

## Flujo

```
seo_collect.py (semanal, lunes ~07:00 UTC)
  ├─ GA4 Data API: páginas, canales, países, landings (28 días)
  ├─ Search Console API: queries + páginas (clics, impresiones, CTR, posición)
  └─ JSONs en /root/seo-data/palacomparer/{ga4,gsc}_<fecha>.json (+ latest/)
        ↓
cron de análisis: detecta oportunidades (CTR bajo con impresiones altas,
páginas 5-15 que caen, landings con engagement pobre) → propone/aplica
mejoras → informe a Mario con números reales
```

## Reglas del bucle

- Solo datos reales; lo sintético va etiquetado
- Cada cambio en un commit separado, verificable en el diff
- Los informes citan la fuente (GSC/GA4) y la ventana de datos
