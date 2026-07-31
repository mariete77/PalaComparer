"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/palas", label: "Palas" },
  { href: "/raquetas", label: "Raquetas" },
  { href: "/noticias", label: "Noticias" },
  { href: "/finder", label: "Encuentra la tuya" },
  { href: "/comparar", label: "Comparar" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/90 border-b border-white/8">
        <nav className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo-icon.png"
              alt=""
              width={36}
              height={36}
              priority
              className="w-9 h-9 rounded-lg border border-white/10 object-cover"
            />
            <span className="font-display font-extrabold text-xl tracking-tighter text-primary-container">
              PalaComparer
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 font-display font-bold text-sm">
            {NAV_LINKS.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/comparar"
              className="btn-primary px-5 py-2.5 rounded-lg hidden md:inline-block"
            >
              Comparar
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Abrir menú"
            >
              <span className="w-5 h-0.5 bg-on-surface rounded-full" />
              <span className="w-5 h-0.5 bg-on-surface rounded-full" />
              <span className="w-3.5 h-0.5 bg-on-surface rounded-full" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="drawer-overlay absolute inset-0"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-surface-container border-l border-white/8 flex flex-col">
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/8">
              <span className="font-display font-extrabold text-lg text-primary-container">
                Menu
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 flex items-center justify-center"
                aria-label="Cerrar menú"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="2" y1="2" x2="16" y2="16" />
                  <line x1="16" y1="2" x2="2" y2="16" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display font-bold text-lg text-on-surface-variant hover:text-primary-container px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
