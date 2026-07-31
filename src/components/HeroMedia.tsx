"use client";

import { useEffect, useRef } from "react";

/**
 * Video del hero. Como fondo absoluto cubre toda la sección con
 * object-cover y un gradiente oscuro para que el texto sea legible.
 */
export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (query.matches) {
        video.pause();
        video.currentTime = 0;
        return;
      }
      void video.play().catch(() => undefined);
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
        preload="metadata"
        muted
        loop
        playsInline
        autoPlay
        aria-hidden="true"
        tabIndex={-1}
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
