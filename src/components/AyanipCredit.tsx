"use client";

import { useLocale } from "@/i18n/LocaleContext";

/**
 * Crédito de autoría de Ayanip. Va en el footer de todos los proyectos.
 * El icono es SVG inline y conserva el teal de la marca: es un logo ajeno al
 * sistema de color del sitio, no un acento más de PalaComparer.
 */
export default function AyanipCredit() {
  const { t } = useLocale();

  return (
    <div className="flex justify-center border-t border-white/5 pt-6">
      <a
        href="https://www.ayanip.es"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1.5 text-[11px] text-muted/60 transition-colors hover:text-on-surface"
      >
        <span className="uppercase tracking-[0.2em]">{t("footer.creadoPor")}</span>
        <span className="inline-flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 120"
            className="h-7 w-7 transition-transform duration-500 group-hover:rotate-12"
            aria-hidden="true"
          >
            <line x1="60" y1="20" x2="25" y2="95" stroke="#14b8a6" strokeWidth="12" strokeLinecap="round" />
            <line x1="60" y1="20" x2="95" y2="95" stroke="#14b8a6" strokeWidth="12" strokeLinecap="round" />
            <line x1="40" y1="65" x2="80" y2="65" stroke="#14b8a6" strokeWidth="12" strokeLinecap="round" />
            <circle cx="60" cy="20" r="12" fill="#0f766e" />
            <circle cx="60" cy="20" r="5" fill="#5eead4" />
            <circle cx="25" cy="95" r="12" fill="#0f766e" />
            <circle cx="25" cy="95" r="5" fill="#5eead4" />
            <circle cx="95" cy="95" r="12" fill="#0f766e" />
            <circle cx="95" cy="95" r="5" fill="#5eead4" />
            <circle cx="40" cy="65" r="9" fill="#0f766e" />
            <circle cx="40" cy="65" r="4" fill="#5eead4" />
            <circle cx="80" cy="65" r="9" fill="#0f766e" />
            <circle cx="80" cy="65" r="4" fill="#5eead4" />
          </svg>
          {/* El icono es la "A": junto a "yanip" se lee "Ayanip". */}
          <span className="font-display font-semibold tracking-wide">yanip</span>
        </span>
      </a>
    </div>
  );
}
