import type { MDXComponents } from "mdx/types";
import {
  Callout,
  ProductGrid,
  ProductRef,
  SpecList,
  SpecRow,
} from "@/components/MdxWidgets";
import { MdxLink } from "@/components/MdxLink";

/**
 * Componentes disponibles dentro de los .mdx sin necesidad de importarlos.
 *
 * Los enlaces internos (markdown `[x](/finder)`) pasan por `MdxLink`, un Client
 * Component que los prefija con el locale en uso.
 */
export function useMDXComponents(): MDXComponents {
  return {
    a: MdxLink,
    // Widgets propios: usables en cualquier .mdx sin importarlos.
    Callout,
    ProductGrid,
    ProductRef,
    SpecList,
    SpecRow,
  };
}

