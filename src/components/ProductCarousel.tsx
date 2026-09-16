"use client";

import { useEffect } from "react";
import {
  BlossomCarousel,
  BlossomPrev,
  BlossomNext,
  BlossomDots,
} from "@blossom-carousel/react";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";
import { useLocale } from "@/i18n/LocaleContext";

export interface CarouselItem {
  product: Product;
  bestPrice: number | null;
}

/**
 * Carrusel de productos (Blossom Carousel) — scroll nativo del navegador con
 * drag físico para puntero fino, scroll-snap por tarjeta y flechas/dots.
 *
 * - Construido sobre scroll nativo: táctil, rueda, teclado y accesibilidad
 *   del navegador; Blossom solo añade el drag con inercia en desktop.
 * - Móvil: 1 tarjeta con "peek" de la siguiente (invita al swipe), 2 en ≥sm,
 *   3 en ≥md, 4 en ≥lg — igual que el carrusel anterior (Embla).
 * - La librería oculta el scrollbar y pone cursor grab/grabbing al arrastrar.
 * - Flechas: BlossomPrev/Next se deshabilitan solos en los extremos.
 * - Dots (solo móvil/tablet): marcador activo con el color primario.
 */
export default function ProductCarousel({
  items,
  autoplay = false,
  id,
}: {
  items: CarouselItem[];
  /** Autoplay suave (solo ofertas de la homepage). Se cancela con la primera
   *  interacción del usuario (drag, wheel, touch, teclado o foco). */
  autoplay?: boolean;
  /** Identificador para QA/testing (data-carousel). */
  id?: string;
}) {
  const { t } = useLocale();
  const carouselId = `blossom-${id ?? "products"}`;

  useBlossomAutoScroll(autoplay, carouselId);

  return (
    <div className="relative" data-carousel={id}>
      <BlossomCarousel
        id={carouselId}
        as="ul"
        className="pc-blossom"
        aria-label={t("common.carruselProductos")}
      >
        {items.map(({ product, bestPrice }) => (
          <li
            key={product.id}
            data-blossom-slide
            className="pc-blossom-slide"
          >
            <ProductCard product={product} bestPrice={bestPrice} />
          </li>
        ))}
      </BlossomCarousel>

      {/* Flechas — circulares con los tokens de la web; Blossom las
          deshabilita solo cuando no hay más contenido en esa dirección. */}
      <BlossomPrev
        for={carouselId}
        aria-label={t("common.anterior")}
        className="pc-blossom-arrow pc-blossom-arrow-prev"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </BlossomPrev>
      <BlossomNext
        for={carouselId}
        aria-label={t("common.siguiente")}
        className="pc-blossom-arrow pc-blossom-arrow-next"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </BlossomNext>

      {/* Dots (móvil/tablet) — marcador activo en color primario. Se ocultan
          en ≥md con CSS propio porque la capa del paquete pisa a Tailwind. */}
      <BlossomDots for={carouselId} className="pc-blossom-dots" />
    </div>
  );
}

/**
 * Autoplay progresivo y respetuoso:
 * - Solo hasta la primera interacción del usuario con el carrusel (drag,
 *   wheel, touch, teclado o foco) o si el ratón está encima.
 * - Respeta `prefers-reduced-motion` y la pestaña en segundo plano.
 * - Sin bucle infinito artificial: al llegar al final, se detiene.
 */
function useBlossomAutoScroll(enabled: boolean, carouselId: string) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = document.getElementById(carouselId);
    if (!el) return;

    let stopped = false;
    let hovering = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      stopped = true;
      if (timer) clearInterval(timer);
    };
    const onPointerEnter = () => {
      hovering = true;
    };
    const onPointerLeave = () => {
      hovering = false;
    };
    const onVis = () => {
      if (document.hidden) stop();
    };

    el.addEventListener("pointerdown", stop, { once: true });
    el.addEventListener("wheel", stop, { once: true, passive: true });
    el.addEventListener("touchstart", stop, { once: true, passive: true });
    el.addEventListener("keydown", stop, { once: true });
    el.addEventListener("focusin", stop, { once: true });
    el.addEventListener("pointerenter", onPointerEnter);
    el.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVis);

    timer = setInterval(() => {
      if (stopped || hovering || document.hidden) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        stop();
        return;
      }
      el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
    }, 4200);

    return () => {
      stop();
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
      el.removeEventListener("keydown", stop);
      el.removeEventListener("focusin", stop);
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [enabled, carouselId]);
}
