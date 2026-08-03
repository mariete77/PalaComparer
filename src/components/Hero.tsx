"use client";

import { useState } from "react";
import Link from "next/link";
import HeroMedia from "./HeroMedia";

export interface HeroContent {
  eyebrow: string;
  titleA: string;
  titleB: string;
  tagline: string;
  updateNote: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

/**
 * Hero con video de fondo: el video se reproduce una vez al entrar en la
 * vista y, cuando termina, el contenido (título, texto, botones) aparece con
 * un fade-in. Al volver a entrar (remount), el ciclo se repite.
 */
export default function Hero({ content }: { content: HeroContent }) {
  const [ended, setEnded] = useState(false);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 -z-10">
        <HeroMedia onEnded={() => setEnded(true)} />
      </div>

      <div
        className={`relative mx-auto max-w-7xl px-6 pt-20 pb-24 transition-all duration-1000 ease-out md:pt-32 md:pb-36 ${
          ended ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        <div className="max-w-3xl">
          <p className="text-sm text-muted">{content.eyebrow}</p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {content.titleA}
            <br />
            <span className="text-primary-container">{content.titleB}</span>
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted">
            {content.tagline}
            <span className="mt-3 block text-sm font-semibold text-primary-container/90">
              {content.updateNote}
            </span>
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href={content.primaryHref} className="btn-lime rounded-lg px-7 py-4 text-sm">
              {content.primaryLabel}
            </Link>
            <Link href={content.secondaryHref} className="btn-outline rounded-lg px-7 py-4 text-sm">
              {content.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
