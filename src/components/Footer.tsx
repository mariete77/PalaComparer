"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import AyanipCredit from "@/components/AyanipCredit";

/** Pie común a todas las páginas. Cliente porque depende del locale en uso. */
export default function Footer() {
  const { lp, t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/5 mt-24 bg-surface-container-lowest">
      {/* Textura de fondo: pista de noche desenfocada. Va al 40% y con un velo
          encima porque el footer es texto a 4 columnas y la legibilidad manda
          sobre la imagen. Decorativa: aria-hidden y sin alt. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-90"
        style={{ backgroundImage: "url('/footer-court.webp')" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-surface-container-lowest/85 via-surface-container-lowest/30 to-surface-container-lowest/70"
        aria-hidden="true"
      />
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-10">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display font-extrabold text-lg text-primary-container tracking-tighter">
              PalaComparer
            </span>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm mb-4">
              {t("footer.catalogo")}
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link href={lp("/palas")} className="text-sm text-muted hover:text-primary-container transition-colors">
                {t("footer.palasPadel")}
              </Link>
              <Link href={lp("/raquetas")} className="text-sm text-muted hover:text-primary-container transition-colors">
                {t("footer.raquetasTenis")}
              </Link>
              <Link href={lp("/finder")} className="text-sm text-muted hover:text-primary-container transition-colors">
                {t("footer.encuentraTuya")}
              </Link>
              <Link href={lp("/comparar")} className="text-sm text-muted hover:text-primary-container transition-colors">
                {t("footer.comparador")}
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm mb-4">
              {t("footer.contenido")}
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link href={lp("/guias")} className="text-sm text-muted hover:text-primary-container transition-colors">
                {t("footer.guias")}
              </Link>
              <Link href={lp("/noticias")} className="text-sm text-muted hover:text-primary-container transition-colors">
                {t("footer.noticiasGuias")}
              </Link>
              <Link href={lp("/metodologia")} className="text-sm text-muted hover:text-primary-container transition-colors">
                {t("footer.metodologia")}
              </Link>
              <Link href={lp("/jugadores")} className="text-sm text-muted hover:text-primary-container transition-colors">
                {t("footer.jugadores")}
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-xs text-muted leading-relaxed">
              {t("footer.legal")}
            </p>
            {/* Enlaces legales: obligatorios y accesibles desde cualquier página. */}
            <nav className="flex flex-col gap-2 mt-4">
              <Link href={lp("/legal/aviso-legal")} className="text-xs text-muted hover:text-primary-container transition-colors">
                {t("footer.avisoLegal")}
              </Link>
              <Link href={lp("/legal/privacidad")} className="text-xs text-muted hover:text-primary-container transition-colors">
                {t("footer.privacidad")}
              </Link>
              <Link href={lp("/legal/cookies")} className="text-xs text-muted hover:text-primary-container transition-colors">
                Cookies
              </Link>
            </nav>
            <p className="text-xs text-muted mt-4">
              © {year} PalaComparer
            </p>
          </div>
        </div>
        <AyanipCredit />
      </div>
    </footer>
  );
}
