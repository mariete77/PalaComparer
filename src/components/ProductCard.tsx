"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Product } from "@/data/products";
import { getProductImage } from "@/data/product-image";
import { formatPrice } from "@/data/offers";
import { getRatings } from "@/data/ratings";
import RatingBar from "@/components/RatingBar";
import { useCompare } from "@/components/CompareContext";
import { useLocale } from "@/i18n/LocaleContext";

gsap.registerPlugin(ScrollTrigger);

export default function ProductCard({
  product,
  bestPrice,
}: {
  product: Product;
  bestPrice?: number | null;
}) {
  const { add, remove, has, isFull } = useCompare();
  const { lp, t } = useLocale();
  const selected = has(product.id);
  const image = getProductImage(product);
  const cardRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Reveal the media wrapper, leaving the inner element free for its hover transform.
  useGSAP(() => {
    if (!cardRef.current || !revealRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.fromTo(
      revealRef.current,
      { y: 18, opacity: 0, willChange: "transform, opacity" },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "willChange",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );
  }, { scope: cardRef });

  const specs: { label: string; value: string }[] =
    product.sport === "padel" && product.padel
      ? [
          { label: t("product.peso"), value: product.padel.weight.replace(/\s*/g, "").replace(/\(+.*\)/, "") },
          { label: t("product.balance"), value: cap(product.padel.balance) },
        ]
      : product.tenis
        ? [
            { label: t("product.peso"), value: `${product.tenis.weightStrung}g` },
            { label: t("product.tamis"), value: `${product.tenis.headSize}in²` },
          ]
        : [];

  const ratings = getRatings(product);

  return (
    <div ref={cardRef} className="card-split group relative flex flex-col h-full">
      <Link href={lp(`/producto/${product.id}`)} className="block flex-1 flex flex-col">
        <div className={`card-split-img aspect-[4/5] flex items-center justify-center p-6 ${image.isReal ? "has-real-photo" : ""}`}>
          <span className={`absolute top-3 left-3 font-bold text-[10px] px-2 py-1 rounded border uppercase tracking-wider z-10 ${
            image.isReal
              ? "bg-surface/70 text-on-surface border-overlay-10"
              : "bg-primary-container/20 text-primary-strong border-primary-container/30"
          }`}>
            {product.sport === "padel" ? t("common.padel") : t("common.tenis")}
          </span>
          <div ref={revealRef} className="h-full w-full">
            <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
              <Image
                src={image.src}
                unoptimized={image.unoptimized}
                alt={`${product.brand} ${product.model}`}
                fill
                className={`object-contain ${image.isReal ? "" : "drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"}`}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>

        <div className="card-split-body p-4 flex-1 flex flex-col">
          <span className="text-muted font-bold text-[11px] uppercase tracking-wider">
            {product.brand}
          </span>
          <h3 className="font-display font-bold text-base text-primary mt-1 line-clamp-2 leading-tight min-h-[2.6em]">
            {product.model}
          </h3>

          {specs.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 mt-3 mb-3">
              {specs.map((s) => (
                <div key={s.label} className="spec-cell px-1.5 py-1 sm:px-2 sm:py-1.5 overflow-hidden">
                  <div className="min-w-0">
                    <div className="text-[7px] sm:text-[9px] text-muted font-bold uppercase tracking-wider leading-none truncate">
                      {s.label}
                    </div>
                    <div className="text-[10px] sm:text-xs text-on-surface font-semibold leading-tight truncate">
                      {s.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mini rating bars */}
          {ratings && (
            <div className="space-y-1 mb-3">
              <RatingBar labelKey="potencia" value={ratings.potencia} variant="compact" />
              <RatingBar labelKey="control" value={ratings.control} variant="compact" />
            </div>
          )}

          <div className="mt-auto flex justify-between items-end pt-2">
            <div>
              {bestPrice != null && (
                <span className="text-muted text-[10px] block">{t("common.desde")}</span>
              )}
              <div className="font-display font-bold text-lg text-primary-strong">
                {bestPrice != null ? formatPrice(bestPrice) : formatPrice(product.price)}
              </div>
            </div>
            <span className="text-muted font-bold text-[11px]">{product.year}</span>
          </div>
        </div>
      </Link>

      <button
        onClick={() => (selected ? remove(product.id) : add(product.id))}
        disabled={!selected && isFull}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all z-10 border ${
          selected
            ? "bg-primary-container text-on-primary border-primary-container scale-110"
            : isFull
              ? "bg-surface-container-highest text-muted border-overlay-5 cursor-not-allowed"
              : "bg-surface-container-highest text-on-surface-variant border-overlay-5 hover:bg-primary-container hover:text-on-primary hover:border-primary-container"
        }`}
        title={selected ? t("common.quitarComparador") : t("common.anadirComparador")}
      >
        {selected ? "\u2713" : "+"}
      </button>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
