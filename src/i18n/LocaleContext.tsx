"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  Locale,
  LOCALES,
  TranslationKey,
  localePath,
  otherLocale,
  stripLocale,
  translate,
} from "./locales";

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  /**
   * Prefija una ruta interna con el locale actual.
   * Uso: `const lp = useLocalePath(); <Link href={lp("/palas")}>`.
   */
  lp: (path: string) => string;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const Ctx = createContext<LocaleCtx | null>(null);

/**
 * La fuente de verdad del locale es el segmento de la URL (`/[locale]`),
 * inyectado por el layout del servidor. No hay autodetección en cliente: eso lo
 * resuelve el proxy en la primera visita a `/`.
 *
 * Conmutar idioma navega a la ruta espejo con el otro prefijo, conservando el
 * resto del path y el querystring.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();

  const navigateToLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      if (typeof window === "undefined") return;
      const { pathname, search, hash } = window.location;
      const internal = stripLocale(pathname);
      const target = `${localePath(next, internal)}${search}${hash}`;
      router.push(target);
    },
    [locale, router]
  );

  const setLocale = useCallback(
    (l: Locale) => {
      if (!LOCALES.includes(l)) return;
      navigateToLocale(l);
    },
    [navigateToLocale]
  );

  const toggle = useCallback(() => {
    navigateToLocale(otherLocale(locale));
  }, [navigateToLocale, locale]);

  const value = useMemo<LocaleCtx>(
    () => ({
      locale,
      setLocale,
      toggle,
      lp: (path) => localePath(locale, path),
      t: (key, params) => translate(locale, key, params),
    }),
    [locale, setLocale, toggle]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale(): LocaleCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}

/** Locale por defecto, para quien no pueda usar el contexto (raro). */
export { DEFAULT_LOCALE };
