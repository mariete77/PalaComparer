/**
 * Inyecta un bloque JSON-LD. Server Component a propósito: el marcado tiene que
 * estar en el HTML servido, porque los crawlers de IA no ejecutan JavaScript.
 *
 * `<` se escapa para que un texto con `</script>` dentro de una descripción no
 * pueda cerrar la etiqueta antes de tiempo.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
