"use client";

import { useEffect, useRef } from "react";

/**
 * Video del hero. Como fondo absoluto cubre toda la sección con
 * object-cover y un gradiente oscuro para que el texto sea legible.
 *
 * Ciclo del hero: al montar (entrar en la vista) el video se reproduce una
 * sola vez desde el principio; al terminar se dispara `onEnded` para que el
 * contenido (título, botones…) aparezca con fade-in. Si el video no puede
 * reproducirse (error, autoplay bloqueado) o el usuario prefiere menos
 * movimiento, se revela el contenido de inmediato en vez de dejar el hero
 * vacío.
 */
export default function HeroMedia({ onEnded }: { onEnded?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reveal = () => onEndedRef.current?.();

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (query.matches) {
        video.pause();
        video.currentTime = 0;
        reveal();
        return;
      }
      // Reiniciar desde el principio cada vez que se monta (volver a entrar
      // en la vista desde otra página).
      video.currentTime = 0;
      const p = video.play();
      if (p) p.catch(reveal);
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster="/hero-palas.jpg"
        preload="auto"
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        onEnded={() => onEndedRef.current?.()}
        onError={() => onEndedRef.current?.()}
      >
        <source src="/hero-palas.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-surface/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/60"
        aria-hidden="true"
      />
    </div>
  );
}
