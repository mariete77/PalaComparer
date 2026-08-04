"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

export interface CarouselItem {
  product: Product;
  bestPrice: number | null;
}

/**
 * Carrusel de productos (Embla) — táctil en móvil, con flechas y dots.
 *
 * - Móvil: 1 slide con "peek" del siguiente (invita al swipe), 2 en ≥sm,
 *   3 en ≥md, 4 en ≥lg.
 * - Loop solo si hay más slides que visibles (con 4 productos no hace falta).
 * - Autoplay opcional (se pausa al pasar el ratón o al interactuar).
 */
export default function ProductCarousel({
  items,
  autoplay = false,
  id,
}: {
  items: CarouselItem[];
  autoplay?: boolean;
  /** Identificador para QA/testing (data-carousel). */
  id?: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: items.length > 4 },
    [
      Autoplay({
        delay: 4200,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        active: autoplay,
      }),
    ]
  );

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setActiveIndex(emblaApi.selectedScrollSnap());
    setSnapCount(emblaApi.scrollSnapList().length);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative" data-carousel={id}>
      {/* Viewport + slides */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-2 sm:-ml-3">
          {items.map(({ product, bestPrice }) => (
            <div
              key={product.id}
              className="min-w-0 shrink-0 grow-0 basis-[86%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-2 sm:pl-3"
            >
              <ProductCard product={product} bestPrice={bestPrice} />
            </div>
          ))}
        </div>
      </div>

      {/* Flechas */}
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canPrev}
        aria-label="Anterior"
        className="absolute top-1/2 -translate-y-1/2 -left-3 md:-left-5 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border border-white/10 bg-surface/80 backdrop-blur text-on-surface shadow-lg transition-all hover:bg-primary-container hover:text-on-primary disabled:opacity-0 disabled:pointer-events-none"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canNext}
        aria-label="Siguiente"
        className="absolute top-1/2 -translate-y-1/2 -right-3 md:-right-5 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border border-white/10 bg-surface/80 backdrop-blur text-on-surface shadow-lg transition-all hover:bg-primary-container hover:text-on-primary disabled:opacity-0 disabled:pointer-events-none"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* Dots (móvil/tablet) */}
      {snapCount > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-5 md:hidden">
          {Array.from({ length: snapCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir al slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-primary-container"
                  : "w-1.5 bg-white/15 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
