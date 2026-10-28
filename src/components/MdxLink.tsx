"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import { stripLocale } from "@/i18n/locales";

type AnchorRest = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

interface MdxLinkProps extends AnchorRest {
  href?: string;
}

/**
 * Componente `a` para Markdown/MDX.
 *
 * Los enlaces internos (que empiezan por `/` o `#`) se prefijan con el locale en
 * uso y navegan sin recarga vía next/link. Los externos se abren en pestaña
 * nueva. Es un Client Component porque necesita leer el locale de la URL.
 *
 * Si el enlace interno ya llega prefijado con un locale (p. ej. `/en/guias/x`
 * escrito así en un MDX inglés), se le quita el prefijo antes de volver a
 * añadir el del locale actual — de lo contrario saldrían rutas `/en/en/...`.
 */
export function MdxLink({ href = "", children, ...rest }: MdxLinkProps) {
  // `rest` es `AnchorRest` (sin `href`), así que el spread no duplica href.
  const { lp } = useLocale();
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal) {
    const finalHref = href.startsWith("#") ? href : lp(stripLocale(href));
    return (
      <Link {...rest} href={finalHref}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
