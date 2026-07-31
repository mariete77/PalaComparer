"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  Locale,
  LOCALES,
  TranslationKey,
  translate,
} from "./locales";

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const Ctx = createContext<LocaleCtx | null>(null);
const STORAGE_KEY = "palacomparer.locale";

function detectInitial(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved && LOCALES.includes(saved as Locale)) return saved as Locale;
  const nav = navigator.language?.toLowerCase() ?? "";
  return nav.startsWith("en") ? "en" : DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Arrancamos siempre en el locale por defecto (server + primer render del
  // cliente coinciden) y corregimos tras montar para evitar parpadeos de
  // hidratación. El efecto sincroniza localStorage y <html lang>.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const detected = detectInitial();
    if (detected !== DEFAULT_LOCALE) setLocaleState(detected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* localStorage puede estar bloqueado (modo privado): no es crítico. */
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggle = useCallback(
    () => setLocaleState((prev) => (prev === "es" ? "en" : "es")),
    []
  );

  const value = useMemo<LocaleCtx>(
    () => ({
      locale,
      setLocale,
      toggle,
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
