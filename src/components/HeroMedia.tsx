"use client";

import { useEffect, useRef } from "react";

/**
 * Video del hero. Como fondo absoluto cubre toda la sección con
 * object-cover y un gradiente oscuro para que el texto sea legible.
 *
 * Ciclo del hero: cada vez que la sección entra en el viewport (`playSignal`
 * cambia) el video se reproduce una sola vez desde el principio; ~1.5s antes
 * de que termine se dispara `onEnded` (vía timeupdate) para que el contenido
 * (título, botones…) aparezca con fade-in y quede totalmente visible justo al
 * acabar el video. Cuando la sección sale de la viewport (`active=false`) el
 * video se pausa. Si el video no puede reproducirse (error, autoplay
 * bloqueado) o el usuario prefiere menos movimiento, se revela el contenido
 * de inmediato en vez de dejar el hero vacío.
 */

/** Cuántos segundos antes del final del video se revela el contenido. */
const REVEAL_EARLY_S = 1.5;
export default function HeroMedia({
  onEnded,
  playSignal,
  active,
}: {
  onEnded?: () => void;
  /** Se incrementa cada vez que el hero vuelve a entrar en el viewport. */
  playSignal: number;
  /** false cuando el hero está fuera de la viewport (se pausa el video). */
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  /** Evita revelar el contenido más de una vez por ciclo de reproducción. */
  const revealedRef = useRef(false);

  // Reproducir desde el principio en cada entrada al viewport.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reveal = () => onEndedRef.current?.();

    const apply = () => {
      revealedRef.current = false;
      if (query.matches) {
        video.pause();
        video.currentTime = 0;
        reveal();
        return;
      }
      video.currentTime = 0;
      const p = video.play();
      if (p) p.catch(reveal);
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [playSignal]);

  // Revelar el contenido ~1.5s antes de que termine el video: `timeupdate`
  // dispara ~4 veces/segundo, y al cruzar el umbral duration - REVEAL_EARLY_S
  // se llama a onEnded una sola vez. El fade-in del contenido (1s) queda así
  // totalmente completado justo cuando el video acaba.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryReveal = () => {
      if (revealedRef.current) return;
      const d = video.duration;
      // duration puede ser NaN/Infinity antes de cargar metadata → no se
      // revela prematuramente, el onEnded real del <video> cubre ese caso.
      if (!Number.isFinite(d) || d <= 0) return;
      if (video.currentTime >= d - REVEAL_EARLY_S) {
        revealedRef.current = true;
        onEndedRef.current?.();
      }
    };

    video.addEventListener("timeupdate", tryReveal);
    return () => video.removeEventListener("timeupdate", tryReveal);
  }, []);

  // Pausar cuando el hero sale de la viewport.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || active) return;
    video.pause();
  }, [active]);

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
        onEnded={() => {
          // Si ya se reveló antes del final (timeupdate), no repetir.
          if (!revealedRef.current) onEndedRef.current?.();
        }}
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
