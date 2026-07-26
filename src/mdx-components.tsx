import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import {
  Callout,
  ProductGrid,
  ProductRef,
  SpecList,
  SpecRow,
} from "@/components/MdxWidgets";

const components = {
  // Los enlaces internos pasan por next/link para navegar sin recarga.
  a: ({ href = "", children, ...rest }) => {
    const internal = href.startsWith("/") || href.startsWith("#");
    if (internal) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },
  // Widgets propios: usables en cualquier .mdx sin importarlos.
  Callout,
  ProductGrid,
  ProductRef,
  SpecList,
  SpecRow,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
