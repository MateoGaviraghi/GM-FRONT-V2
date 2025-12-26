"use client";

import { Facebook, Instagram, MapPin, Phone, Globe, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`transition-all duration-500 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-cyan-500/10"
          : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
      }`}
    >
      {/* Top contact bar - Responsive */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/20 py-2">
        <div className="container mx-auto px-4">
          {/* Desktop layout */}
          <div className="hidden md:flex justify-between items-center text-xs text-white">
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
                  Lun - Vie: 8:30 - 12:30 y 15:30 - 18:30
                </span>
              </div>
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
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://guzmanmotors.com.ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-500/10 p-1.5 rounded-lg hover:bg-cyan-500 hover:scale-110 transition-all group"
                title="Sitio web para clientes"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.facebook.com/guzmanmotors19/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-500/10 p-1.5 rounded-lg hover:bg-cyan-500 hover:scale-110 transition-all group"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/guzmanmotors/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-500/10 p-1.5 rounded-lg hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:scale-110 transition-all group"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden">
            {/* Contact info stacked */}
            <div className="space-y-1.5 text-xs text-white text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="bg-cyan-500/10 p-1 rounded">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                </div>
                <span className="text-slate-300">
                  Av. Blas Parera 6422, Santa Fe
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-cyan-500/10 p-1 rounded">
                  <Phone className="w-3 h-3 text-cyan-400" />
                </div>
                <a href="tel:+5493424216850" className="text-slate-300">
                  +54 9 342 421 6850
                </a>
              </div>
            </div>
            {/* Social links centered */}
            <div className="flex items-center justify-center gap-3 mt-2">
              <a
                href="https://guzmanmotors.com.ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-500/10 p-1.5 rounded-lg hover:bg-cyan-500 transition-all"
                title="Sitio web"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
              </a>
              <a
                href="https://www.facebook.com/guzmanmotors19/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-500/10 p-1.5 rounded-lg hover:bg-cyan-500 transition-all"
                title="Facebook"
              >
                <Facebook className="w-4 h-4 text-cyan-400" />
              </a>
              <a
                href="https://www.instagram.com/guzmanmotors/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-500/10 p-1.5 rounded-lg hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4 text-cyan-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header con logo - Responsive */}
      <div
        className={`transition-all duration-300 ${
          isScrolled ? "py-3" : "py-6"
        }`}
      >
        <div className="container mx-auto px-6">
          {/* Logo con animación - Layout Horizontal */}
          <Link
            href="/"
            className="flex items-center justify-between group relative"
          >
            {/* Logo circular a la izquierda con efecto glow */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full group-hover:bg-cyan-400/40 transition-all duration-500"></div>
              <div
                className={`relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-3xl p-3 border-2 border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-xl group-hover:shadow-cyan-500/30 transition-all duration-300 overflow-hidden ${
                  isScrolled ? "w-16 h-16" : "w-20 h-20"
                }`}
              >
                <Image
                  src="/images/logo/logoGM-Photoroom.png"
                  alt="Guzman Motors Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                  style={{
                    mixBlendMode: "screen",
                  }}
                  priority
                />
                {/* Efecto de resplandor rotatorio */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-opacity duration-500 rounded-3xl"></div>
              </div>
            </div>

            {/* Letras del logo en el centro - MÁS GRANDES */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
              <div className="relative">
                <Image
                  src="/images/logo/letrasGuzmanMotors-Photoroom.png"
                  alt="Guzman Motors"
                  width={380}
                  height={100}
                  className={`object-contain transition-all duration-500 ${
                    isScrolled ? "h-14 opacity-90" : "h-20 opacity-100"
                  }`}
                  style={{
                    mixBlendMode: "screen",
                  }}
                  priority
                />
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
              </div>
            </div>

            {/* Espacio simétrico a la derecha (invisible) */}
            <div
              className={`flex-shrink-0 ${isScrolled ? "w-16" : "w-20"}`}
            ></div>
          </Link>
        </div>
      </div>

      {/* Navigation - Modernizado con efecto glassmorphism */}
      <nav className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl py-4 border-t border-cyan-500/20 overflow-hidden">
        {/* Efecto de luz animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-pulse"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center gap-4">
            {/* Icono de dashboard con animación */}
            <div className="relative group/icon">
              <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-full group-hover/icon:bg-cyan-400/30 transition-all duration-300"></div>
              <div className="relative w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center group-hover/icon:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>

            {/* Texto con efecto de brillo */}
            <div className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 text-base md:text-lg font-bold tracking-wider">
                PANEL ADMINISTRATIVO
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-cyan-300/20 to-blue-400/20 blur-sm -z-10"></div>
            </div>

            {/* Indicador de acceso con animación */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-xs font-medium ml-1 hidden md:inline">
                Activo
              </span>
            </div>
          </div>
        </div>

        {/* Línea decorativa inferior con gradiente animado */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
      </nav>
    </header>
  );
}
