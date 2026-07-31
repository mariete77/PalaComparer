"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/LocaleContext";
import AyanipCredit from "@/components/AyanipCredit";

/** Pie común a todas las páginas. Cliente porque depende del locale en uso. */
export default function Footer() {
  const { lp, t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 mt-24 bg-surface-container-lowest">
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
              <Link href={lp("/noticias")} className="text-sm text-muted hover:text-primary-container transition-colors">
                {t("footer.noticiasGuias")}
              </Link>
            </nav>
          </div>
          <div>
            <p className="text-xs text-muted leading-relaxed">
              {t("footer.legal")}
            </p>
            <p className="text-xs text-muted mt-3">
              © {year} PalaComparer
            </p>
          </div>
        </div>
        <AyanipCredit />
      </div>
    </footer>
  );
}
