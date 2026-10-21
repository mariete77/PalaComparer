"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/i18n/LocaleContext";
import { LOCALES, LOCALE_LABEL, stripLocale, type Locale } from "@/i18n/locales";
import ThemeToggle from "./ThemeToggle";

/**
 * Selector ES/EN. Conmuta al idioma contrario manteniendo la ruta actual;
 * el locale se aplica a la URL, no a un estado interno (ver LocaleContext).
 */
function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex items-center rounded-full border border-overlay-10 overflow-hidden text-[11px] font-bold font-display">
      {LOCALES.map((l: Locale) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-2 py-1 transition-colors ${
            locale === l
              ? "bg-primary-container text-on-primary-container"
              : "text-on-surface-variant hover:bg-overlay-5"
          }`}
        >
          {LOCALE_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [closing, setClosing] = useState(false);
  const pathname = usePathname();
  const lastFocused = useRef<HTMLElement | null>(null);
  const { lp, t } = useLocale();

  const NAV_LINKS = [
    { href: "/palas", label: t("nav.palas") },
    { href: "/raquetas", label: t("nav.raquetas") },
    { href: "/ofertas", label: t("nav.ofertas") },
    { href: "/noticias", label: t("nav.noticias") },
    { href: "/finder", label: t("nav.finder") },
  ];

  /* Ruta actual sin prefijo de locale: `/es/palas` → `/palas`. */
  const activePath = pathname ? stripLocale(pathname) : "/";

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? activePath === "/" : activePath.startsWith(href),
    [activePath]
  );

  /* Estado "scrolled": barra más compacta y con más fondo/blur/sombra. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Drawer móvil: cierre con Escape, foco devuelto al botón y scroll
     bloqueado mientras está abierto. El desmontaje se retrasa hasta el
     final de la animación de salida. */
  const requestClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 220);
  }, []);

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus?.();
    };
  }, [open, requestClose]);

  return (
    <>
      {/* Navbar flotante: cápsula despegada del borde, como en los otros
          proyectos. El blur vive en el div interior, no en el <header>, porque
          un ancestro con backdrop-filter se convierte en bloque contenedor de
          sus hijos `fixed` y recortaría el drawer. */}
      <header className="fixed top-3 sm:top-4 inset-x-0 z-50 px-3 sm:px-4">
        <div className="max-w-[1280px] mx-auto flex items-center gap-4">
          <Link href={lp("/")} className="shrink-0 flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.03]">
            <Image
              src="/logo-icon.png"
              alt=""
              width={46}
              height={46}
              priority
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border object-cover shadow-lg shadow-black/20 transition-[width,height] duration-300 ${
                scrolled ? "border-overlay-14" : "border-overlay-10"
              }`}
            />
            <span className="font-display font-extrabold text-lg sm:text-2xl tracking-tighter text-primary-strong">
              PalaComparer
            </span>
          </Link>

          <nav
            className={`min-w-0 flex-1 px-4 sm:px-6 flex items-center justify-between rounded-2xl border shadow-lg transition-all duration-300 ${
              scrolled
                ? "h-[56px] border-overlay-14 bg-surface/85 backdrop-blur-xl shadow-black/40"
                : "h-[64px] border-overlay-10 bg-surface/70 backdrop-blur-md shadow-black/30"
            }`}
          >

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 font-display font-bold text-sm">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={lp(link.href)}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link group relative text-on-surface-variant hover:text-primary transition-colors ${
                    active ? "active text-primary-strong" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LocaleSwitcher />
            <Link
              href={lp("/comparar")}
              className={`btn-primary px-5 rounded-lg hidden md:inline-block transition-all duration-300 ${
                scrolled ? "py-2" : "py-2.5"
              }`}
            >
              {t("nav.comparar")}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
              aria-label={t("nav.abrirMenu")}
              aria-expanded={open}
            >
              <span className="w-5 h-0.5 bg-on-surface rounded-full transition-transform duration-300 group-hover:scale-x-110" />
              <span className="w-5 h-0.5 bg-on-surface rounded-full transition-transform duration-300 group-hover:scale-x-110" />
              <span className="w-3.5 h-0.5 bg-on-surface rounded-full transition-transform duration-300 group-hover:scale-x-110" />
            </button>
          </div>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label={t("nav.menu")}>
          <div
            className={`drawer-overlay absolute inset-0 ${closing ? "drawer-overlay-out" : "drawer-overlay-in"}`}
            onClick={requestClose}
          />
          <div className={`absolute top-0 right-0 w-72 h-full bg-surface-container border-l border-overlay-8 flex flex-col ${
            closing ? "drawer-panel-out" : "drawer-panel-in"
          }`}>
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-overlay-8">
              <span className="font-display font-extrabold text-lg text-primary-strong">
                {t("nav.menu")}
              </span>
              <button
                onClick={requestClose}
                className="w-10 h-10 flex items-center justify-center"
                aria-label={t("nav.cerrarMenu")}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="2" y1="2" x2="16" y2="16" />
                  <line x1="16" y1="2" x2="2" y2="16" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-1 p-4 overflow-y-auto">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={lp(link.href)}
                    onClick={requestClose}
                    aria-current={active ? "page" : undefined}
                    className={`font-display font-bold text-lg px-4 py-3 rounded-lg hover:bg-overlay-5 transition-colors ${
                      active
                        ? "text-primary-strong bg-overlay-5"
                        : "text-on-surface-variant hover:text-primary-strong"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href={lp("/comparar")}
                onClick={requestClose}
                className={`font-display font-bold text-lg px-4 py-3 rounded-lg hover:bg-overlay-5 transition-colors ${
                  isActive("/comparar")
                    ? "text-primary-strong bg-overlay-5"
                    : "text-primary-strong"
                }`}
              >
                {t("nav.comparar")}
              </Link>
              <div className="px-4 pt-4 mt-2 border-t border-overlay-8">
                <LocaleSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
