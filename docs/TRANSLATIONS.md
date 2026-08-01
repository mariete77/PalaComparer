# Traducciones del catálogo

Cada producto debe tener una descripción en español y otra en inglés.

- Las traducciones específicas de cada ficha viven en `src/data/product-descriptions-en.ts`.
- Si una ficha necesita una traducción propia, también puede declarar `descriptionEn` en `src/data/products.ts`.
- Antes de publicar, ejecuta `npm run check:translations`. El comando falla si se añade una ficha sin texto EN.

El render en inglés usa primero `descriptionEn`, después el diccionario central y solo como último recurso el texto español. Ese último fallback existe para evitar romper fichas antiguas, pero el check debe mantenerse en verde.
