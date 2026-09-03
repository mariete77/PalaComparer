"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { MoonIcon, SunIcon } from "./icons";

/**
 * Toggle sol/luna. El atributo data-theme del <html> lo fija el script
 * theme-init (layout.tsx) antes del primer paint; aquí solo se conmuta y
 * se persiste en localStorage ("pc-theme"). Sin estado guardado la web
 * respeta prefers-color-scheme.
 */
export default function ThemeToggle() {
  const { t } = useLocale();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("pc-theme", next);
    } catch {
      /* localStorage no disponible: el cambio aplica solo a la sesión. */
    }
  };

  const label = theme === "light" ? t("nav.themeDark") : t("nav.themeLight");

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="w-9 h-9 rounded-full border border-overlay-10 flex items-center justify-center text-on-surface-variant hover:text-primary-strong hover:border-overlay-20 hover:bg-overlay-5 transition-all duration-200"
    >
      <span
        key={theme}
        style={{ animation: "none" }}
        className="block [animation:theme-swap_0.3s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {theme === "light" ? <MoonIcon className="w-4.5 h-4.5" /> : <SunIcon className="w-4.5 h-4.5" />}
      </span>
      <style>{`@keyframes theme-swap{from{opacity:0;transform:rotate(-40deg) scale(0.6)}to{opacity:1;transform:none}}`}</style>
    </button>
  );
}