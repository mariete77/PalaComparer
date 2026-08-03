"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/i18n/locales";

/**
 * Selector ES/EN. Conmuta al idioma contrario manteniendo la ruta actual;
 * el locale se aplica a la URL, no a un estado interno (ver LocaleContext).
 */
function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex items-center rounded-full border border-white/10 overflow-hidden text-[11px] font-bold font-display">
      {LOCALES.map((l: Locale) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-2 py-1 transition-colors ${
            locale === l
              ? "bg-primary-container text-on-primary-container"
              : "text-on-surface-variant hover:bg-white/5"
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
  const { lp, t } = useLocale();

  const NAV_LINKS = [
    { href: "/palas", label: t("nav.palas") },
    { href: "/raquetas", label: t("nav.raquetas") },
    { href: "/noticias", label: t("nav.noticias") },
    { href: "/finder", label: t("nav.finder") },
  ];

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
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-white/10 object-cover shadow-lg shadow-black/20"
            />
            <span className="font-display font-extrabold text-lg sm:text-2xl tracking-tighter text-primary-container">
              PalaComparer
            </span>
          </Link>

          <nav className="min-w-0 flex-1 px-4 sm:px-6 h-[64px] flex items-center justify-between rounded-2xl border border-white/10 bg-surface/70 backdrop-blur-md shadow-lg shadow-black/30">

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 font-display font-bold text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={lp(link.href)}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href={lp("/comparar")}
              className="btn-primary px-5 py-2.5 rounded-lg hidden md:inline-block"
            >
              {t("nav.comparar")}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label={t("nav.abrirMenu")}
            >
              <span className="w-5 h-0.5 bg-on-surface rounded-full" />
              <span className="w-5 h-0.5 bg-on-surface rounded-full" />
              <span className="w-3.5 h-0.5 bg-on-surface rounded-full" />
            </button>
          </div>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="drawer-overlay absolute inset-0"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-surface-container border-l border-white/8 flex flex-col">
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/8">
              <span className="font-display font-extrabold text-lg text-primary-container">
                {t("nav.menu")}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 flex items-center justify-center"
                aria-label={t("nav.cerrarMenu")}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="2" y1="2" x2="16" y2="16" />
                  <line x1="16" y1="2" x2="2" y2="16" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={lp(link.href)}
                  onClick={() => setOpen(false)}
                  className="font-display font-bold text-lg text-on-surface-variant hover:text-primary-container px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={lp("/comparar")}
                onClick={() => setOpen(false)}
                className="font-display font-bold text-lg text-primary-container px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                {t("nav.comparar")}
              </Link>
              <div className="px-4 pt-4 mt-2 border-t border-white/8">
                <LocaleSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
