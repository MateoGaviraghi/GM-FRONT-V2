"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Menu,
  X,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";

export function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Limpiar el timeout anterior
      clearTimeout(timeoutId);

      // Agregar un pequeño delay para evitar cambios rápidos
      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY;
        // Aumentar el umbral a 50px y agregar histéresis
        if (scrollPosition > 50 && !isScrolled) {
          setIsScrolled(true);
        } else if (scrollPosition <= 30 && isScrolled) {
          setIsScrolled(false);
        }
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isScrolled]);

  return (
    <header
      className={`text-white sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/10"
          : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
      }`}
    >
      {/* Top bar con información - Oculto en móviles */}
      <div
        className={`bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/20 transition-all duration-200 ease-in-out ${
          isScrolled ? "py-1.5" : "py-2.5"
        } hidden md:block`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 group">
                <div className="bg-cyan-500/10 p-1.5 rounded-lg group-hover:bg-cyan-500/20 transition-all">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-slate-300">
                  Av. Blas Parera 6422, Santa Fe
                </span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="bg-cyan-500/10 p-1.5 rounded-lg group-hover:bg-cyan-500/20 transition-all">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-slate-300">
                  Lun - Vie: 8:30 - 12:30 y 15:30 - 18:30 | Sáb - Dom: Cerrado
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 group">
                <div className="bg-cyan-500/10 p-1.5 rounded-lg group-hover:bg-cyan-500/20 transition-all">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <a
                  href="tel:+5493424216850"
                  className="text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  +54 9 342 421 6850
                </a>
              </div>
              <div className="h-4 w-px bg-cyan-500/30"></div>
              <div className="flex gap-2">
                <a
                  href="https://www.facebook.com/guzmanmotors19/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-500/10 p-1.5 rounded-lg hover:bg-cyan-500 hover:scale-110 transition-all group"
                >
                  <Facebook className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.instagram.com/guzmanmotors/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-500/10 p-1.5 rounded-lg hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:scale-110 transition-all group"
                >
                  <Instagram className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <div
        className={`transition-all duration-200 ease-in-out ${
          isScrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center relative">
            {/* Logo con animación - Desktop: juntos a la izquierda */}
            <Link
              href="/"
              className="hidden md:flex flex-shrink-0 group relative items-center gap-4"
            >
              {/* Logo circular con efecto glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                <div
                  className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-2.5 border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300 overflow-hidden ${
                    isScrolled ? "w-14 h-14" : "w-16 h-16"
                  }`}
                >
                  <Image
                    src="/images/logo/logoGM-Photoroom.png"
                    alt="Guzman Motors Logo"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain rounded-xl group-hover:scale-110 transition-transform duration-300"
                    style={{
                      mixBlendMode: "screen",
                    }}
                    priority
                  />
                </div>
              </div>
              {/* Letras del logo */}
              <div className="relative">
                <Image
                  src="/images/logo/letrasGuzmanMotors-Photoroom.png"
                  alt="Guzman Motors"
                  width={220}
                  height={60}
                  className={`object-contain group-hover:opacity-100 transition-all duration-300 ${
                    isScrolled ? "h-10" : "h-12"
                  }`}
                  style={{
                    mixBlendMode: "screen",
                  }}
                  priority
                />
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
              </div>
            </Link>

            {/* Mobile: Logo G a la izquierda */}
            <Link
              href="/"
              className="md:hidden flex-shrink-0 group relative z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                <div
                  className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-2.5 border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300 overflow-hidden ${
                    isScrolled ? "w-14 h-14" : "w-16 h-16"
                  }`}
                >
                  <Image
                    src="/images/logo/logoGM-Photoroom.png"
                    alt="Guzman Motors Logo"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain rounded-xl group-hover:scale-110 transition-transform duration-300"
                    style={{
                      mixBlendMode: "screen",
                    }}
                    priority
                  />
                </div>
              </div>
            </Link>

            {/* Mobile: Letras centradas */}
            <Link
              href="/"
              className="md:hidden absolute left-1/2 transform -translate-x-1/2 group"
            >
              <div className="relative">
                <Image
                  src="/images/logo/letrasGuzmanMotors-Photoroom.png"
                  alt="Guzman Motors"
                  width={220}
                  height={60}
                  className={`object-contain group-hover:opacity-100 transition-all duration-300 ${
                    isScrolled ? "h-10" : "h-12"
                  }`}
                  style={{
                    mixBlendMode: "screen",
                  }}
                  priority
                />
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
              </div>
            </Link>

            {/* Navegación Desktop con efecto glassmorphism */}
            <nav className="hidden lg:flex gap-1 text-sm font-medium">
              {[
                { href: "/", label: "INICIO" },
                { href: "/foton", label: "FOTON" },
                { href: "/remolques", label: "REMOLQUES" },
                { href: "/usados", label: "USADOS" },
                { href: "/novedades", label: "NOVEDADES" },
                { href: "/nosotros", label: "NOSOTROS" },
                { href: "/contacto", label: "CONTACTO" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-slate-300 hover:text-white transition-all duration-300 group"
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Efecto hover con glassmorphism */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300"></div>
                  {/* Borde inferior animado */}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                </Link>
              ))}
            </nav>

            {/* Botón hamburguesa mejorado */}
            <button
              onClick={toggleMenu}
              className="lg:hidden relative p-2 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 group"
              aria-label="Abrir menú"
            >
              <div className="absolute inset-0 bg-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></div>
              {isMenuOpen ? (
                <X className="w-6 h-6 text-cyan-400 relative z-10" />
              ) : (
                <Menu className="w-6 h-6 text-cyan-400 relative z-10" />
              )}
            </button>
          </div>

          {/* Menú móvil mejorado */}
          {isMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-cyan-500/20 pt-4 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex flex-col space-y-2">
                {[
                  { href: "/", label: "INICIO" },
                  { href: "/foton", label: "FOTON" },
                  { href: "/remolques", label: "REMOLQUES" },
                  { href: "/usados", label: "USADOS" },
                  { href: "/novedades", label: "NOVEDADES" },
                  { href: "/nosotros", label: "NOSOTROS" },
                  { href: "/contacto", label: "CONTACTO" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative py-3 px-4 text-slate-300 hover:text-white transition-all duration-300 rounded-lg group overflow-hidden"
                    onClick={toggleMenu}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-cyan-400 to-blue-500 group-hover:h-full transition-all duration-300"></div>
                  </Link>
                ))}

                {/* Contacto en móvil mejorado */}
                <div className="border-t border-cyan-500/20 pt-4 mt-4 space-y-3">
                  <a
                    href="tel:+5493424216850"
                    className="flex items-center gap-3 text-sm group p-2 rounded-lg hover:bg-cyan-500/10 transition-all"
                  >
                    <div className="bg-cyan-500/10 p-2 rounded-lg group-hover:bg-cyan-500/20 transition-all">
                      <Phone className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-slate-300 group-hover:text-cyan-400 transition-colors">
                      +54 9 342 421 6850
                    </span>
                  </a>
                  <div className="flex items-center gap-3 text-sm p-2">
                    <div className="bg-cyan-500/10 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-slate-300">
                      Av. Blas Parera 6422, Santa Fe
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <a
                      href="https://www.facebook.com/guzmanmotors19/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-cyan-500/10 p-3 rounded-lg hover:bg-cyan-500 transition-all flex items-center justify-center group"
                    >
                      <Facebook className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
                    </a>
                    <a
                      href="https://www.instagram.com/guzmanmotors/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-cyan-500/10 p-3 rounded-lg hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center group"
                    >
                      <Instagram className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
